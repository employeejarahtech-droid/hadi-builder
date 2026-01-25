<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get input data (handle both JSON and Form Data)
$contentType = $_SERVER["CONTENT_TYPE"] ?? '';
$data = [];

if (strpos($contentType, 'application/json') !== false) {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true) ?? [];
} else {
    $data = $_POST;
}

$id = $data['id'] ?? null;
$action = $data['action'] ?? 'update_status'; // Default to update_status for backward compatibility

// Validate ID
if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing ID field']);
    exit;
}

try {
    $pdo = getDBConnection();

    if ($action === 'set_default') {
        // Reset all to 0
        $pdo->query("UPDATE footers SET is_default = 0");

        // Set current to 1
        $stmt = $pdo->prepare("UPDATE footers SET is_default = 1 WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Default footer updated']);

    } elseif ($action === 'update_title') {
        $title = $data['value'] ?? null;
        if (!$title) {
            throw new Exception('Title is required');
        }

        $stmt = $pdo->prepare("UPDATE footers SET title = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$title, $id]);

        echo json_encode(['success' => true, 'message' => 'Title updated successfully']);

    } else {
        // Default action: Update Status
        $status = $data['status'] ?? null;

        if (!in_array($status, ['draft', 'published'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid status value']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE footers SET status = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
        } else {
            // Check if it exists but wasn't changed
            $check = $pdo->prepare("SELECT id FROM footers WHERE id = ?");
            $check->execute([$id]);
            if ($check->fetch()) {
                echo json_encode(['success' => true, 'message' => 'Status unchanged']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Footer not found']);
            }
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>