<?php
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    echo "Checking database columns...\n\n";

    $tables = ['pages', 'posts', 'headers', 'footers', 'topbars'];

    foreach ($tables as $table) {
        echo "Table: $table\n";
        $stmt = $pdo->query("DESCRIBE $table");
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (in_array('css_file', $columns)) {
            echo "  ✓ css_file column EXISTS\n";
        } else {
            echo "  ✗ css_file column MISSING - Adding now...\n";
            $pdo->exec("ALTER TABLE $table ADD COLUMN css_file VARCHAR(255) DEFAULT NULL");
            echo "  ✓ css_file column ADDED\n";
        }
        echo "\n";
    }

    echo "Database check complete!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
