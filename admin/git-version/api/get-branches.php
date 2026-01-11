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
    // Get all branches (local and remote)
    $branchOutput = shell_exec("cd \"$projectRoot\" && git branch -a 2>&1");

    if ($branchOutput === null || strpos($branchOutput, 'fatal') !== false) {
        throw new Exception('Failed to get branches');
    }

    $branches = [];
    $lines = array_filter(explode("\n", trim($branchOutput)));

    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line))
            continue;

        // Skip remote HEAD references
        if (strpos($line, 'remotes/origin/HEAD') !== false) {
            continue;
        }

        $isCurrent = (substr($line, 0, 1) === '*');
        $branchName = trim(str_replace('*', '', $line));

        // Clean up remote branch names
        if (strpos($branchName, 'remotes/origin/') === 0) {
            $branchName = substr($branchName, 15); // Remove 'remotes/origin/'
            $isRemote = true;
        } else {
            $isRemote = false;
        }

        // Avoid duplicates (local branches also appear as remote)
        $exists = false;
        foreach ($branches as $existingBranch) {
            if ($existingBranch['name'] === $branchName) {
                $exists = true;
                break;
            }
        }

        if (!$exists) {
            $branches[] = [
                'name' => $branchName,
                'current' => $isCurrent,
                'remote' => $isRemote
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'branches' => $branches
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
