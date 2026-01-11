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
    // Get current branch
    $branch = trim(shell_exec("cd \"$projectRoot\" && git rev-parse --abbrev-ref HEAD 2>&1"));

    // Get remote URL
    $remote = trim(shell_exec("cd \"$projectRoot\" && git config --get remote.origin.url 2>&1"));

    // Get last commit info
    $lastCommit = trim(shell_exec("cd \"$projectRoot\" && git log -1 --pretty=format:\"%h - %s (%ar)\" 2>&1"));

    // Check if commands were successful
    if (empty($branch) || strpos($branch, 'fatal') !== false) {
        throw new Exception('Not a git repository');
    }

    echo json_encode([
        'success' => true,
        'branch' => $branch,
        'remote' => $remote ?: 'No remote configured',
        'lastCommit' => $lastCommit ?: 'No commits yet'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
