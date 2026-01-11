<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

header('Content-Type: application/json');

// SSH directory path
$sshDir = getenv('HOME') . '/.ssh';
if (!$sshDir || $sshDir === '/.ssh') {
    // Fallback for Windows
    $sshDir = getenv('USERPROFILE') . '/.ssh';
}

$publicKeyPath = $sshDir . '/id_rsa.pub';

try {
    if (file_exists($publicKeyPath)) {
        echo json_encode([
            'success' => true,
            'exists' => true,
            'path' => $publicKeyPath
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'exists' => false
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
