<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$tables = ['products', 'categories', 'brands'];

foreach ($tables as $table) {
    echo "Table: $table\n";
    try {
        $stmt = $pdo->query("DESCRIBE $table");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            echo "  " . $col['Field'] . " - " . $col['Type'] . "\n";
        }
    } catch (PDOException $e) {
        echo "  Table not found or error: " . $e->getMessage() . "\n";
    }
    echo "\n";
}
