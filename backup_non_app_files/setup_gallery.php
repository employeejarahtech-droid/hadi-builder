<?php
// setup_gallery.php

require_once __DIR__ . '/includes/db.php';

echo "Setting up gallery table...\n";

try {
    $pdo = getDBConnection();

    // Create Gallery Table
    $sql = "CREATE TABLE IF NOT EXISTS `gallery` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `file_name` VARCHAR(255) NOT NULL,
        `file_path` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    $pdo->exec($sql);
    echo "Table 'gallery' created successfully (or already exists).\n";

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage() . "\n");
}
