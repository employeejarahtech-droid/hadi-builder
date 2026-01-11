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

$htaccessPath = __DIR__ . '/../../.htaccess';
$content = $data['content'];

try {
    // Create backup
    $backupPath = null;
    if (file_exists($htaccessPath)) {
        $timestamp = date('Y-m-d_H-i-s');
        $backupPath = dirname($htaccessPath) . '/.htaccess.backup.' . $timestamp;

        if (!copy($htaccessPath, $backupPath)) {
            throw new Exception('Failed to create backup');
        }
    }

    // Write new content
    $result = file_put_contents($htaccessPath, $content);

    if ($result === false) {
        throw new Exception('Failed to write to .htaccess file');
    }

    // Set proper permissions (readable by web server)
    chmod($htaccessPath, 0644);

    echo json_encode([
        'success' => true,
        'message' => '.htaccess file updated successfully',
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
