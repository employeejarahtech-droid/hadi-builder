<?php
// Migration script to add category_id column to products table
require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // Check if category_id column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'category_id'");
    $columnExists = $stmt->fetch();

    if (!$columnExists) {
        // Add category_id column
        $pdo->exec("ALTER TABLE products ADD COLUMN category_id INT NULL AFTER status");

        // Add foreign key constraint (optional, but recommended)
        $pdo->exec("ALTER TABLE products ADD CONSTRAINT fk_products_category 
                    FOREIGN KEY (category_id) REFERENCES categories(id) 
                    ON DELETE SET NULL");

        echo "✓ Successfully added category_id column to products table\n";
    } else {
        echo "✓ category_id column already exists in products table\n";
    }

} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
