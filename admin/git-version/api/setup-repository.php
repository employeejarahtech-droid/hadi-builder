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

// Debug: Log received data
error_log("Setup Repository - Received repoUrl: " . $repoUrl);
error_log("Setup Repository - Received branch: " . $branch);

if (empty($repoUrl)) {
    echo json_encode([
        'success' => false,
        'message' => 'Repository URL is required',
        'debug' => [
            'POST' => $_POST,
            'received_repoUrl' => $repoUrl,
            'received_branch' => $branch
        ]
    ]);
    exit;
}

try {
    $output = '';
    $output .= "=== Git Repository Setup ===\n";
    $output .= "Project Root: $projectRoot\n";
    $output .= "Repository URL: $repoUrl\n";
    $output .= "Branch: $branch\n\n";

    // Check if .git directory exists
    $gitDir = $projectRoot . '/.git';

    if (!is_dir($gitDir)) {
        // Initialize new repository
        $output .= "Initializing new Git repository...\n";
        // Change to directory first, then run git init
        chdir($projectRoot);
        $initOutput = shell_exec("git init 2>&1");
        $output .= $initOutput . "\n";

        if (strpos($initOutput, 'Initialized') !== false || is_dir($gitDir)) {
            $output .= "✓ Repository initialized successfully\n\n";
        } else {
            throw new Exception("Failed to initialize repository: " . $initOutput);
        }
    } else {
        $output .= "✓ Git repository already exists\n\n";
    }

    // Make sure we're in the project directory
    chdir($projectRoot);

    // Remove existing origin if it exists
    $output .= "Removing existing remote origin (if any)...\n";
    $removeOutput = shell_exec("git remote remove origin 2>&1");
    $output .= ($removeOutput ? $removeOutput : "No existing origin found") . "\n";

    // Add new origin
    $output .= "\nAdding new remote origin...\n";
    $escapedUrl = escapeshellarg($repoUrl);
    $addOutput = shell_exec("git remote add origin $escapedUrl 2>&1");

    if ($addOutput && strpos($addOutput, 'error') !== false) {
        throw new Exception("Failed to add remote: " . $addOutput);
    }
    $output .= "✓ Remote origin added: $repoUrl\n\n";

    // Verify remote was added
    $verifyRemote = shell_exec("git remote -v 2>&1");
    $output .= "Current remotes:\n" . $verifyRemote . "\n";

    // Set default branch
    $output .= "Setting default branch to '$branch'...\n";
    $escapedBranch = escapeshellarg($branch);
    $branchOutput = shell_exec("git branch -M $escapedBranch 2>&1");
    $output .= ($branchOutput ? $branchOutput : "✓ Branch set successfully") . "\n\n";

    // Configure git to accept new host keys (for SSH)
    $output .= "Configuring SSH settings...\n";
    $sshOutput = shell_exec("git config core.sshCommand \"ssh -o StrictHostKeyChecking=accept-new\" 2>&1");
    $output .= "✓ SSH configuration updated\n\n";

    // Try to fetch from remote
    $output .= "Attempting to fetch from remote...\n";
    $fetchOutput = shell_exec("git fetch origin 2>&1");
    $output .= $fetchOutput . "\n";

    // Check if fetch was successful
    if (strpos($fetchOutput, 'fatal') === false && strpos($fetchOutput, 'error') === false) {
        $output .= "✓ Fetch successful\n\n";

        // Set upstream branch
        $output .= "Setting upstream branch...\n";
        $upstreamOutput = shell_exec("git branch --set-upstream-to=origin/$branch $branch 2>&1");
        $output .= ($upstreamOutput ? $upstreamOutput : "✓ Upstream set successfully") . "\n";
    } else {
        $output .= "⚠ Fetch failed - this is normal if SSH key is not yet added to Git provider\n";
        $output .= "Please add your SSH public key to your Git provider and try again\n";
    }

    $output .= "\n=== Setup Complete ===\n";

    echo json_encode([
        'success' => true,
        'message' => 'Repository setup completed',
        'output' => $output
    ]);

} catch (Exception $e) {
    $errorOutput = "=== Error During Setup ===\n";
    $errorOutput .= "Error: " . $e->getMessage() . "\n";
    $errorOutput .= "\nPlease check:\n";
    $errorOutput .= "1. Git is installed and accessible\n";
    $errorOutput .= "2. The repository URL is correct\n";
    $errorOutput .= "3. You have proper permissions\n";

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'output' => $errorOutput
    ]);
}
