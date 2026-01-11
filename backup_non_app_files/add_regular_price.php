<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

try {
    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'regular_price'");
    $exists = $stmt->fetch();

    if ($exists) {
        echo "Column 'regular_price' already exists.\n";
    } else {
        echo "Adding 'regular_price' column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN regular_price DECIMAL(10, 2) DEFAULT NULL");
        echo "Column added successfully.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
