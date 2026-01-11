<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();

    // Check if user exists
    echo "=== Checking for user 'maksud' ===\n";
    $stmt = $pdo->prepare("SELECT id, username, email, password, role FROM users WHERE username = ?");
    $stmt->execute(['maksud']);
    $user = $stmt->fetch();

    if ($user) {
        echo "✓ User found in database:\n";
        echo "  ID: " . $user['id'] . "\n";
        echo "  Username: " . $user['username'] . "\n";
        echo "  Email: " . $user['email'] . "\n";
        echo "  Role: " . $user['role'] . "\n";
        echo "  Password Hash: " . substr($user['password'], 0, 20) . "...\n\n";

        // Test password verification
        echo "=== Testing password verification ===\n";
        $testPassword = 'maksud';
        $verified = password_verify($testPassword, $user['password']);

        if ($verified) {
            echo "✓ Password 'maksud' VERIFIED successfully!\n";
        } else {
            echo "✗ Password 'maksud' FAILED verification!\n";
            echo "  This means the stored hash doesn't match.\n";

            // Try to fix by rehashing
            echo "\n=== Attempting to fix password hash ===\n";
            $newHash = password_hash($testPassword, PASSWORD_DEFAULT);
            $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = ?");
            $updateStmt->execute([$newHash, 'maksud']);
            echo "✓ Password hash updated. Please try logging in again.\n";
        }
    } else {
        echo "✗ User 'maksud' NOT FOUND in database!\n";
        echo "  Creating user now...\n\n";

        $password = password_hash('maksud', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute(['maksud', 'maksud@gmail.com', $password, 'admin']);
        echo "✓ User created with ID: " . $pdo->lastInsertId() . "\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
