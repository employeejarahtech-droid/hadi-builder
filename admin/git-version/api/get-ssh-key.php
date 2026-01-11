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
    if (!file_exists($publicKeyPath)) {
        throw new Exception('SSH public key not found');
    }

    $publicKey = file_get_contents($publicKeyPath);

    echo json_encode([
        'success' => true,
        'publicKey' => trim($publicKey)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
