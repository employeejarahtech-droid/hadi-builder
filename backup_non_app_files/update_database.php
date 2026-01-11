<?php
// update_database.php

require_once __DIR__ . '/includes/db.php';

echo "Updating database schema...\n";

try {
    $pdo = getDBConnection();

    // Create Pages Table
    echo "Creating 'pages' table...\n";
    $sqlPages = "CREATE TABLE IF NOT EXISTS `pages` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `slug` VARCHAR(255) NOT NULL UNIQUE,
        `content` LONGTEXT,
        `status` ENUM('draft', 'published') DEFAULT 'draft',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sqlPages);

    // Create Settings Table
    echo "Creating 'settings' table...\n";
    $sqlSettings = "CREATE TABLE IF NOT EXISTS `settings` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `key_name` VARCHAR(100) NOT NULL UNIQUE,
        `value` TEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sqlSettings);

    // Insert Default Settings if not exists
    $defaults = [
        'site_name' => 'New CMS',
        'site_description' => 'A simple Elementor-style CMS',
        'admin_email' => 'admin@example.com'
    ];

    $stmt = $pdo->prepare("INSERT IGNORE INTO settings (key_name, value) VALUES (?, ?)");
    foreach ($defaults as $key => $val) {
        $stmt->execute([$key, $val]);
    }


    // Create Posts Table
    echo "Creating 'posts' table...\n";
    $sqlPosts = "CREATE TABLE IF NOT EXISTS `posts` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `slug` VARCHAR(255) NOT NULL UNIQUE,
        `content` LONGTEXT,
        `status` ENUM('draft', 'published') DEFAULT 'draft',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $pdo->exec($sqlPosts);

    // Insert Default Post if not exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM posts");
    if ($stmt->fetchColumn() == 0) {
        $stmt = $pdo->prepare("INSERT INTO posts (title, slug, content, status) VALUES (?, ?, ?, ?)");
        $stmt->execute(['Welcome to my Blog', 'welcome-to-my-blog', '[{"id":"1","type":"heading","content":{"text":"Hello World","tag":"h1"}},{"id":"2","type":"text","content":{"text":"This is my first blog post."}}]', 'published']);
        echo "Created sample blog post.\n";
    }

    echo "Database schema updated successfully!\n";

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage() . "\n");
}
