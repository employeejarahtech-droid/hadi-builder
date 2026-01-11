<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();
    $stmt = $pdo->query('DESCRIBE gallery');
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Gallery table structure:\n\n";
    foreach ($columns as $col) {
        echo "Column: " . $col['Field'] . " | Type: " . $col['Type'] . " | Null: " . $col['Null'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
