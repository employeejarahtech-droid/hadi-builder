<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$tables = ['products', 'categories', 'brands'];
$output = "";

foreach ($tables as $table) {
    $output .= "Table: $table\n";
    try {
        $stmt = $pdo->query("DESCRIBE $table");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            $output .= "  " . $col['Field'] . " - " . $col['Type'] . "\n";
        }
    } catch (PDOException $e) {
        $output .= "  Table not found or error: " . $e->getMessage() . "\n";
    }
    $output .= "\n";
}

file_put_contents(__DIR__ . '/schema_dump.txt', $output);
echo "Schema dumped to schema_dump.txt";
