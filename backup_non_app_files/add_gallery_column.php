<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

try {
    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'gallery_images'");
    $exists = $stmt->fetch();

    if ($exists) {
        echo "Column 'gallery_images' already exists.\n";
    } else {
        echo "Adding 'gallery_images' column...\n";
        $pdo->exec("ALTER TABLE products ADD COLUMN gallery_images TEXT");
        echo "Column added successfully.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
