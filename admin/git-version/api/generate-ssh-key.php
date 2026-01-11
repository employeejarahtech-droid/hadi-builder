<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

header('Content-Type: application/json');

// SSH directory path
$sshDir = getenv('HOME') . '/.ssh';
if (!$sshDir || $sshDir === '/.ssh') {
    // Fallback for Windows
    $sshDir = getenv('USERPROFILE') . '/.ssh';
}

// Check if we're on a restricted environment (like cPanel)
$isRestrictedEnv = false;
$restrictedMessage = '';

// Check if ssh-keygen is available
$sshKeygenPath = shell_exec('which ssh-keygen 2>/dev/null');
if (empty($sshKeygenPath)) {
    $isRestrictedEnv = true;
    $restrictedMessage = 'ssh-keygen command not found on this server';
}

// Check if we have permission to execute commands
if (!$isRestrictedEnv && function_exists('shell_exec')) {
    $testExec = @shell_exec('echo test 2>&1');
    if ($testExec === null || trim($testExec) !== 'test') {
        $isRestrictedEnv = true;
        $restrictedMessage = 'Shell execution is disabled on this server';
    }
}

// If we're in a restricted environment, provide manual instructions
if ($isRestrictedEnv) {
    echo json_encode([
        'success' => false,
        'message' => 'SSH key generation not available on this server',
        'reason' => $restrictedMessage,
        'manual_instructions' => [
            'title' => 'Generate SSH Key Manually in cPanel',
            'steps' => [
                '1. Log in to your cPanel account',
                '2. Go to "Security" section and click "SSH Access"',
                '3. Click "Manage SSH Keys"',
                '4. Click "Generate a New Key"',
                '5. Fill in the form:',
                '   - Key Name: deployment_key',
                '   - Key Password: (leave empty for passwordless)',
                '   - Key Type: RSA',
                '   - Key Size: 4096',
                '6. Click "Generate Key"',
                '7. Go back to "Manage SSH Keys"',
                '8. Find your key and click "Manage"',
                '9. Click "Authorize" to add it to authorized_keys',
                '10. Click "View/Download" to see the public key',
                '11. Copy the public key and add it to your Git provider (GitHub/GitLab/Bitbucket)',
                '12. Return to this page and click "View Public Key" to verify'
            ],
            'alternative' => 'Or generate locally and upload:',
            'local_steps' => [
                '1. On your local machine, run: ssh-keygen -t rsa -b 4096 -C "deploy@yoursite.com"',
                '2. Upload the private key (id_rsa) to: ' . $sshDir . '/id_rsa',
                '3. Upload the public key (id_rsa.pub) to: ' . $sshDir . '/id_rsa.pub',
                '4. Set permissions: chmod 600 for id_rsa, chmod 644 for id_rsa.pub',
                '5. Add the public key to your Git provider'
            ]
        ]
    ]);
    exit;
}

try {
    // Determine SSH directory path with multiple fallbacks
    $possiblePaths = [
        getenv('HOME') . '/.ssh',
        $_SERVER['HOME'] . '/.ssh',
        '/home/' . get_current_user() . '/.ssh',
        __DIR__ . '/../../../.ssh'  // Project root fallback
    ];

    $sshDir = null;
    $homeDir = null;

    // Find the first valid home directory
    foreach ($possiblePaths as $path) {
        if (!empty($path) && $path !== '/.ssh') {
            $parentDir = dirname($path);
            if (is_dir($parentDir) && is_writable($parentDir)) {
                $sshDir = $path;
                $homeDir = $parentDir;
                break;
            }
        }
    }

    // If no valid path found, use project root
    if (!$sshDir) {
        $sshDir = __DIR__ . '/../../../.ssh';
        $homeDir = __DIR__ . '/../../..';
    }

    // Create .ssh directory if it doesn't exist
    if (!is_dir($sshDir)) {
        // Check if parent directory is writable
        if (!is_writable($homeDir)) {
            throw new Exception(
                "Cannot create .ssh directory. Parent directory is not writable.\n" .
                "Attempted path: $sshDir\n" .
                "Parent directory: $homeDir\n" .
                "Current user: " . get_current_user() . "\n" .
                "Please use cPanel's SSH Access interface to generate keys instead."
            );
        }

        if (!@mkdir($sshDir, 0700, true)) {
            $error = error_get_last();
            throw new Exception(
                "Failed to create .ssh directory.\n" .
                "Path: $sshDir\n" .
                "Error: " . ($error['message'] ?? 'Unknown error') . "\n" .
                "Please check file permissions or use cPanel's SSH Access interface."
            );
        }
    }

    $keyPath = $sshDir . '/id_rsa';
    $publicKeyPath = $sshDir . '/id_rsa.pub';

    // Check if keys already exist
    if (file_exists($keyPath) || file_exists($publicKeyPath)) {
        throw new Exception('SSH keys already exist. Please remove existing keys first or use the existing ones.');
    }

    // Generate SSH key
    $email = 'deploy@' . gethostname();
    $command = sprintf(
        'ssh-keygen -t rsa -b 4096 -C "%s" -f "%s" -N "" 2>&1',
        escapeshellarg($email),
        escapeshellarg($keyPath)
    );

    $output = shell_exec($command);

    if ($output === null) {
        throw new Exception('Failed to execute ssh-keygen command');
    }

    // Check if key was generated successfully
    if (!file_exists($publicKeyPath)) {
        throw new Exception('SSH key generation failed. Output: ' . $output);
    }

    // Set proper permissions
    @chmod($keyPath, 0600);
    @chmod($publicKeyPath, 0644);

    // Read the public key
    $publicKey = file_get_contents($publicKeyPath);

    if (empty($publicKey)) {
        throw new Exception('Generated public key is empty');
    }

    echo json_encode([
        'success' => true,
        'message' => 'SSH key generated successfully',
        'publicKey' => trim($publicKey),
        'output' => $output,
        'keyPath' => $keyPath,
        'sshDir' => $sshDir,
        'instructions' => [
            '1. Copy the public key above',
            '2. Add it to your Git provider (GitHub: Settings > SSH Keys, GitLab: Preferences > SSH Keys)',
            '3. Return to the Git Version page and setup your repository'
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'ssh_dir' => $sshDir ?? 'Unable to determine',
        'home_dir' => $homeDir ?? 'Unable to determine',
        'current_user' => get_current_user(),
        'help' => 'If you are on shared hosting (cPanel), you may need to generate SSH keys through cPanel SSH Access interface instead.'
    ]);
}
