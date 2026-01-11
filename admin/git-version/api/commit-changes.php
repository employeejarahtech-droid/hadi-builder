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

// Get commit message from POST data
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($message)) {
    echo json_encode([
        'success' => false,
        'message' => 'Commit message is required'
    ]);
    exit;
}

try {
    // Escape the commit message for shell
    $escapedMessage = escapeshellarg($message);

    // Stage all changes
    $addOutput = shell_exec("cd \"$projectRoot\" && git add -A 2>&1");

    // Commit changes
    $commitOutput = shell_exec("cd \"$projectRoot\" && git commit -m $escapedMessage 2>&1");

    if ($commitOutput === null) {
        throw new Exception('Failed to execute git commit');
    }

    // Check for errors or "nothing to commit"
    if (strpos($commitOutput, 'fatal') !== false || strpos($commitOutput, 'error') !== false) {
        echo json_encode([
            'success' => false,
            'message' => 'Commit failed',
            'output' => $commitOutput
        ]);
    } elseif (strpos($commitOutput, 'nothing to commit') !== false) {
        echo json_encode([
            'success' => false,
            'message' => 'Nothing to commit, working tree clean',
            'output' => $commitOutput
        ]);
    } else {
        // Extract commit hash from output
        preg_match('/\[.+?\s+([a-f0-9]+)\]/', $commitOutput, $matches);
        $commitHash = isset($matches[1]) ? $matches[1] : 'unknown';

        echo json_encode([
            'success' => true,
            'message' => 'Changes committed successfully',
            'commitHash' => $commitHash,
            'output' => $commitOutput
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
