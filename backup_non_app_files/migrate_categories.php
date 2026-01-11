<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();

    // Create categories table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    echo "Categories table created successfully.\n";

    // Check if products table has category_id
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'category_id'");
    $exists = $stmt->fetch();

    if (!$exists) {
        $pdo->exec("ALTER TABLE products ADD COLUMN category_id INT NULL, ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL");
        echo "Added category_id column to products table.\n";
    } else {
        echo "category_id column already exists in products table.\n";
    }

    echo "\nDatabase setup complete!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
