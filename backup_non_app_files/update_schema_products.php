<?php
require_once __DIR__ . '/includes/db.php';
try {
    $pdo = getDBConnection();

    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'similar_products'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE products ADD COLUMN similar_products TEXT DEFAULT NULL");
        echo "Added similar_products column.\n";
    } else {
        echo "Column similar_products already exists.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
