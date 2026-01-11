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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id'] ?? null;
$action = $input['action'] ?? null;

if (!$id || !$action) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $pdo = getDBConnection();

    if ($action === 'update_name') {
        $name = trim($input['value'] ?? '');
        if (empty($name)) {
            throw new Exception("Name cannot be empty");
        }

        $stmt = $pdo->prepare("UPDATE topbars SET name = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$name, $id]);

        echo json_encode(['success' => true, 'message' => 'Name updated successfully']);

    } elseif ($action === 'set_default') {
        $pdo->beginTransaction();
        // Reset all others
        $pdo->exec("UPDATE topbars SET is_default = 0");
        // Set current as default
        $stmt = $pdo->prepare("UPDATE topbars SET is_default = 1 WHERE id = ?");
        $stmt->execute([$id]);

        // Sync with settings table
        $stmtSettings = $pdo->prepare("INSERT INTO settings (key_name, value) VALUES ('global_topbar', ?) ON DUPLICATE KEY UPDATE value = VALUES(value)");
        $stmtSettings->execute([$id]);

        $pdo->commit();

        echo json_encode(['success' => true, 'message' => 'Default topbar updated']);
    } else {
        throw new Exception("Invalid action");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
