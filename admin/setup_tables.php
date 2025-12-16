<?php
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    // Create headers table
    $pdo->exec("CREATE TABLE IF NOT EXISTS headers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        content LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    echo "Headers table created successfully.\n";

    // Create footers table
    $pdo->exec("CREATE TABLE IF NOT EXISTS footers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        content LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    echo "Footers table created successfully.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>