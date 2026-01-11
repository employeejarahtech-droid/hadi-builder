<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

try {
    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'long_description'");
    $exists = $stmt->fetch();

    if ($exists) {
        echo "Column 'long_description' already exists.\n";
    } else {
        echo "Adding 'long_description' column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN long_description TEXT");
        echo "Column added successfully.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
