<?php
require_once __DIR__ . '/includes/db.php';

header('Content-Type: text/plain');

try {
    $pdo = getDBConnection();

    echo "=== GALLERY TABLE DATA ===\n\n";

    $stmt = $pdo->query("SELECT * FROM gallery");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Total rows: " . count($rows) . "\n\n";

    if (!empty($rows)) {
        echo "Columns: " . implode(', ', array_keys($rows[0])) . "\n\n";

        foreach ($rows as $i => $row) {
            echo "Row " . ($i + 1) . ":\n";
            foreach ($row as $key => $value) {
                echo "  $key: $value\n";
            }
            echo "\n";
        }
    } else {
        echo "No rows found\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
