<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

try {
    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'role'");
    $col = $stmt->fetch();

    if ($col) {
        echo "Column 'role' already exists.\n";
    } else {
        // Add column
        $pdo->exec("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER email");
        echo "Column 'role' added successfully.\n";
    }

} catch (Exception $e) {
    // If table doesn't have email column, try after password
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER password");
        echo "Column 'role' added successfully (after password, as email might not exist).\n";
    } catch (Exception $e2) {
        echo "Error: " . $e2->getMessage() . "\n";
    }
}
?>