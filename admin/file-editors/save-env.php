<?php
session_start();

header('Content-Type: application/json');

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['content'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No content provided']);
    exit;
}

$envPath = __DIR__ . '/../../.env';
$content = $data['content'];

try {
    // Create backup
    $backupPath = null;
    if (file_exists($envPath)) {
        $timestamp = date('Y-m-d_H-i-s');
        $backupPath = dirname($envPath) . '/.env.backup.' . $timestamp;

        if (!copy($envPath, $backupPath)) {
            throw new Exception('Failed to create backup');
        }
    }

    // Write new content
    $result = file_put_contents($envPath, $content);

    if ($result === false) {
        throw new Exception('Failed to write to .env file');
    }

    // Set proper permissions (read/write for owner only)
    chmod($envPath, 0600);

    echo json_encode([
        'success' => true,
        'message' => '.env file updated successfully',
        'backup' => $backupPath ? basename($backupPath) : null,
        'bytes_written' => $result
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
