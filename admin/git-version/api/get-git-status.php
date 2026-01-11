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
    // Get git status in porcelain format
    $statusOutput = shell_exec("cd \"$projectRoot\" && git status --porcelain 2>&1");

    if ($statusOutput === null || strpos($statusOutput, 'fatal') !== false) {
        throw new Exception('Failed to get git status');
    }

    $files = [];
    $lines = array_filter(explode("\n", trim($statusOutput)));

    foreach ($lines as $line) {
        if (empty($line))
            continue;

        // Parse porcelain format: XY filename
        $status = substr($line, 0, 2);
        $file = trim(substr($line, 3));

        // Determine status type
        $statusType = 'M'; // Modified by default
        if ($status[0] === 'A' || $status[1] === 'A') {
            $statusType = 'A'; // Added
        } elseif ($status[0] === 'D' || $status[1] === 'D') {
            $statusType = 'D'; // Deleted
        } elseif ($status[0] === '?' || $status[1] === '?') {
            $statusType = '?'; // Untracked
        }

        $files[] = [
            'status' => $statusType,
            'file' => $file
        ];
    }

    echo json_encode([
        'success' => true,
        'files' => $files,
        'count' => count($files)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
