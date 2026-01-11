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

// Get branch name from POST data
$branch = isset($_POST['branch']) ? trim($_POST['branch']) : '';

if (empty($branch)) {
    echo json_encode([
        'success' => false,
        'message' => 'Branch name is required'
    ]);
    exit;
}

// Validate branch name (basic security check)
if (!preg_match('/^[a-zA-Z0-9\/_-]+$/', $branch)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid branch name'
    ]);
    exit;
}

try {
    // Escape branch name for shell
    $escapedBranch = escapeshellarg($branch);

    // Check for uncommitted changes
    $statusOutput = shell_exec("cd \"$projectRoot\" && git status --porcelain 2>&1");

    if (!empty(trim($statusOutput))) {
        echo json_encode([
            'success' => false,
            'message' => 'You have uncommitted changes. Please commit or stash them before switching branches.',
            'output' => $statusOutput
        ]);
        exit;
    }

    // Execute git checkout
    $output = shell_exec("cd \"$projectRoot\" && git checkout $escapedBranch 2>&1");

    if ($output === null) {
        throw new Exception('Failed to execute git checkout');
    }

    // Check for errors
    if (strpos($output, 'fatal') !== false || strpos($output, 'error') !== false) {
        echo json_encode([
            'success' => false,
            'message' => 'Branch switch failed',
            'output' => $output
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => "Switched to branch '$branch'",
            'output' => $output
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
