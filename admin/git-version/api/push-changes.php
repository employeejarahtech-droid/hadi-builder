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
    // Execute git push
    $output = shell_exec("cd \"$projectRoot\" && git push 2>&1");

    if ($output === null) {
        throw new Exception('Failed to execute git push');
    }

    // Check for errors
    if (strpos($output, 'fatal') !== false || strpos($output, 'error') !== false) {
        echo json_encode([
            'success' => false,
            'message' => 'Push failed',
            'output' => $output
        ]);
    } elseif (strpos($output, 'Everything up-to-date') !== false) {
        echo json_encode([
            'success' => true,
            'message' => 'Everything up-to-date',
            'output' => $output
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Changes pushed successfully',
            'output' => $output
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
