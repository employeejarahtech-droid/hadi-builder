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

// Get repository URL and branch from POST data
$repoUrl = isset($_POST['repoUrl']) ? trim($_POST['repoUrl']) : '';
$branch = isset($_POST['branch']) ? trim($_POST['branch']) : 'main';

if (empty($repoUrl)) {
    echo json_encode([
        'success' => false,
        'message' => 'Repository URL is required'
    ]);
    exit;
}

try {
    $output = '';

    // Check if .git directory exists
    $gitDir = $projectRoot . '/.git';

    if (!is_dir($gitDir)) {
        // Initialize new repository
        $output .= shell_exec("cd \"$projectRoot\" && git init 2>&1") . "\n";
        $output .= "Repository initialized\n";
    }

    // Add remote origin
    $escapedUrl = escapeshellarg($repoUrl);

    // Remove existing origin if it exists
    shell_exec("cd \"$projectRoot\" && git remote remove origin 2>&1");

    // Add new origin
    $output .= shell_exec("cd \"$projectRoot\" && git remote add origin $escapedUrl 2>&1") . "\n";

    // Set default branch
    $escapedBranch = escapeshellarg($branch);
    $output .= shell_exec("cd \"$projectRoot\" && git branch -M $escapedBranch 2>&1") . "\n";

    // Configure git to accept new host keys (for SSH)
    $output .= shell_exec("cd \"$projectRoot\" && git config core.sshCommand \"ssh -o StrictHostKeyChecking=accept-new\" 2>&1") . "\n";

    // Try to fetch from remote
    $fetchOutput = shell_exec("cd \"$projectRoot\" && git fetch origin 2>&1");
    $output .= $fetchOutput . "\n";

    // Check if fetch was successful
    if (strpos($fetchOutput, 'fatal') === false && strpos($fetchOutput, 'error') === false) {
        // Set upstream branch
        $output .= shell_exec("cd \"$projectRoot\" && git branch --set-upstream-to=origin/$branch $branch 2>&1") . "\n";
    }

    echo json_encode([
        'success' => true,
        'message' => 'Repository setup completed',
        'output' => $output
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
