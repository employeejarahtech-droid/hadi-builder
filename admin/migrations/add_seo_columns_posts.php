<?php
require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // Check if columns exist
    $stmt = $pdo->query("DESCRIBE posts");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $alterQueries = [];

    if (!in_array('meta_title', $columns)) {
        $alterQueries[] = "ADD COLUMN meta_title VARCHAR(255) DEFAULT NULL";
    }
    if (!in_array('meta_description', $columns)) {
        $alterQueries[] = "ADD COLUMN meta_description TEXT DEFAULT NULL";
    }
    if (!in_array('keywords', $columns)) {
        $alterQueries[] = "ADD COLUMN keywords TEXT DEFAULT NULL";
    }
    if (!in_array('og_image', $columns)) {
        $alterQueries[] = "ADD COLUMN og_image VARCHAR(255) DEFAULT NULL";
    }

    if (!empty($alterQueries)) {
        $sql = "ALTER TABLE posts " . implode(', ', $alterQueries);
        $pdo->exec($sql);
        echo "Successfully added SEO columns to posts table.\n";
    } else {
        echo "SEO columns already exist in posts table.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
