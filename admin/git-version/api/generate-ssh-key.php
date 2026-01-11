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

try {
    // Create .ssh directory if it doesn't exist
    if (!is_dir($sshDir)) {
        mkdir($sshDir, 0700, true);
    }

    $keyPath = $sshDir . '/id_rsa';
    $publicKeyPath = $sshDir . '/id_rsa.pub';

    // Generate SSH key
    $email = 'deploy@' . gethostname();
    $output = shell_exec("ssh-keygen -t rsa -b 4096 -C \"$email\" -f \"$keyPath\" -N \"\" 2>&1");

    if ($output === null) {
        throw new Exception('Failed to execute ssh-keygen');
    }

    // Check if key was generated successfully
    if (!file_exists($publicKeyPath)) {
        throw new Exception('SSH key generation failed');
    }

    // Read the public key
    $publicKey = file_get_contents($publicKeyPath);

    echo json_encode([
        'success' => true,
        'message' => 'SSH key generated successfully',
        'publicKey' => trim($publicKey),
        'output' => $output
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
