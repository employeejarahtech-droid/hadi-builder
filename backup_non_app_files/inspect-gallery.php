<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();

    // Get table structure
    $stmt = $pdo->query('SHOW COLUMNS FROM gallery');
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Gallery Table Structure:\n";
    echo str_repeat("=", 80) . "\n";
    foreach ($columns as $col) {
        printf(
            "%-20s %-20s %-10s %-10s\n",
            $col['Field'],
            $col['Type'],
            $col['Null'],
            $col['Key']
        );
    }

    echo "\n\nGallery Table Data:\n";
    echo str_repeat("=", 80) . "\n";
    $stmt = $pdo->query('SELECT * FROM gallery');
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($rows)) {
        echo "No rows found in gallery table.\n";
    } else {
        foreach ($rows as $row) {
            print_r($row);
            echo "\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
