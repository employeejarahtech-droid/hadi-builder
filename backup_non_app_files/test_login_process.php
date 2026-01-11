<?php
// Test login with detailed debugging
session_start();

require_once __DIR__ . '/includes/db.php';

$username = 'maksud';
$password = 'maksud';

echo "=== Testing Login Process ===\n";
echo "Username: $username\n";
echo "Password: $password\n\n";

try {
    $pdo = getDBConnection();

    echo "1. Fetching user from database...\n";
    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user) {
        echo "   ✓ User found: ID=" . $user['id'] . ", Username=" . $user['username'] . "\n\n";

        echo "2. Verifying password...\n";
        $verified = password_verify($password, $user['password']);

        if ($verified) {
            echo "   ✓ Password verified successfully!\n\n";

            echo "3. Setting session variables...\n";
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];

            echo "   ✓ Session variables set:\n";
            echo "     - admin_logged_in: " . ($_SESSION['admin_logged_in'] ? 'true' : 'false') . "\n";
            echo "     - admin_user_id: " . $_SESSION['admin_user_id'] . "\n";
            echo "     - admin_username: " . $_SESSION['admin_username'] . "\n\n";

            echo "4. Checking session...\n";
            if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
                echo "   ✓ Session check PASSED - Login would succeed!\n";
            } else {
                echo "   ✗ Session check FAILED - Something wrong with session\n";
            }

        } else {
            echo "   ✗ Password verification FAILED!\n";
        }
    } else {
        echo "   ✗ User NOT found in database!\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
