<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

header('Content-Type: application/json');

// Get project root directory
$projectRoot = realpath(__DIR__ . '/../../../');

try {
    $output = '';

    // Step 1: Pull latest changes
    $output .= "=== Pulling latest changes ===\n";
    $pullOutput = shell_exec("cd \"$projectRoot\" && git pull 2>&1");
    $output .= $pullOutput . "\n";

    // Check if pull was successful
    if (strpos($pullOutput, 'fatal') !== false || strpos($pullOutput, 'error') !== false) {
        throw new Exception('Pull failed');
    }

    // Step 2: Optional: Run any deployment scripts
    // You can add custom deployment logic here
    // For example: composer install, npm install, cache clear, etc.

    $output .= "\n=== Deployment completed ===\n";
    $output .= "All changes pulled successfully\n";

    echo json_encode([
        'success' => true,
        'message' => 'Deployment completed successfully',
        'output' => $output
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'output' => $output
    ]);
}
