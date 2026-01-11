<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Support both JSON and standard POST
    if (!$data) {
        $data = $_POST;
    }

    $id = $data['id'] ?? null;
    $action = $data['action'] ?? null;
    $value = $data['value'] ?? null;

    if (!$id || !$action) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        exit;
    }

    try {
        $pdo = getDBConnection();

        if ($action === 'set_default') {
            // First, unset default for all
            $stmt = $pdo->prepare("UPDATE mobile_menus SET is_default = 0");
            $stmt->execute();

            // Set default for selected
            $stmt = $pdo->prepare("UPDATE mobile_menus SET is_default = 1 WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['success' => true, 'message' => 'Default mobile menu set']);
        } elseif ($action === 'update_title') {
            if (!$value) {
                http_response_code(400);
                echo json_encode(['error' => 'Title is required']);
                exit;
            }

            // Update title
            // Also update slug? Let's check if we should... user just said "edit title". 
            // Usually simpler to just edit title and leave slug unless explicitly changed.
            $stmt = $pdo->prepare("UPDATE mobile_menus SET title = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$value, $id]);

            echo json_encode(['success' => true, 'message' => 'Title updated']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>