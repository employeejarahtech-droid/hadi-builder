<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Existing tables:\n";
    foreach ($tables as $table) {
        echo "- $table\n";
    }

    // Check if categories table exists
    if (in_array('categories', $tables)) {
        echo "\nCategories table exists. Showing structure:\n";
        $stmt = $pdo->query("DESCRIBE categories");
        print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo "\nCategories table does NOT exist.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
