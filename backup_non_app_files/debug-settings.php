<?php
require_once __DIR__ . '/includes/db.php';
header('Content-Type: text/plain');

try {
    $pdo = getDBConnection();

    echo "=== SETTINGS TABLE STRUCTURE ===\n\n";
    $stmt = $pdo->query("SHOW COLUMNS FROM settings");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($columns as $col) {
        echo $col['Field'] . " (" . $col['Type'] . ")\n";
    }

    echo "\n=== ALL SETTINGS DATA ===\n\n";
    $stmt = $pdo->query("SELECT * FROM settings");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        print_r($row);
        echo "\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
