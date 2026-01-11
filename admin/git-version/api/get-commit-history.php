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

// Get pagination parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = isset($_GET['limit']) ? max(1, min(50, intval($_GET['limit']))) : 10;
$branch = isset($_GET['branch']) ? trim($_GET['branch']) : '';

$skip = ($page - 1) * $limit;

try {
    // Build git log command
    $branchArg = $branch ? escapeshellarg($branch) : '';

    // Get total commit count
    $totalCommitsCmd = "cd \"$projectRoot\" && git rev-list --count " . ($branchArg ?: 'HEAD') . " 2>&1";
    $totalCommits = intval(trim(shell_exec($totalCommitsCmd)));

    if ($totalCommits === 0) {
        throw new Exception('No commits found');
    }

    $totalPages = ceil($totalCommits / $limit);

    // Get commits for current page
    $logCmd = "cd \"$projectRoot\" && git log " . ($branchArg ?: '') .
        " --pretty=format:\"%h|%an|%ar|%s\" --skip=$skip -n $limit 2>&1";

    $logOutput = shell_exec($logCmd);

    if ($logOutput === null || strpos($logOutput, 'fatal') !== false) {
        throw new Exception('Failed to get commit history');
    }

    $commits = [];
    $lines = array_filter(explode("\n", trim($logOutput)));

    foreach ($lines as $line) {
        if (empty($line))
            continue;

        $parts = explode('|', $line, 4);
        if (count($parts) === 4) {
            $commits[] = [
                'hash' => $parts[0],
                'author' => $parts[1],
                'date' => $parts[2],
                'message' => $parts[3]
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'commits' => $commits,
        'currentPage' => $page,
        'totalPages' => $totalPages,
        'totalCommits' => $totalCommits
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
