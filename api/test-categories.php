<?php
// Simple test file to check if basic PHP and DB work
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "PHP is working<br>";

try {
    require_once __DIR__ . '/../includes/db.php';
    echo "DB file loaded<br>";

    $pdo = getDBConnection();
    echo "DB connection established<br>";

    // Try to create table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        parent_id INT DEFAULT NULL,
        description TEXT,
        image_url VARCHAR(500),
        display_order INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    echo "Table created or already exists<br>";

    // Try to query
    $stmt = $pdo->query("SELECT COUNT(*) FROM categories");
    $count = $stmt->fetchColumn();
    echo "Categories count: $count<br>";

    echo "All tests passed!";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "<br>";
    echo "File: " . $e->getFile() . "<br>";
    echo "Line: " . $e->getLine() . "<br>";
    echo "Trace: <pre>" . $e->getTraceAsString() . "</pre>";
}
