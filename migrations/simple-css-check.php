<?php
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    echo "Checking if css_file paths are saved...\n\n";

    // Check header 1
    $stmt = $pdo->query("SELECT id, name, css_file FROM headers WHERE id = 1");
    $header = $stmt->fetch();

    if ($header) {
        echo "Header ID 1:\n";
        echo "  Name: {$header['name']}\n";
        echo "  CSS File: " . ($header['css_file'] ?? 'NULL') . "\n\n";

        if ($header['css_file']) {
            $fullPath = __DIR__ . '/../' . $header['css_file'];
            echo "  Full path: $fullPath\n";
            echo "  File exists: " . (file_exists($fullPath) ? 'YES' : 'NO') . "\n";
        } else {
            echo "  ❌ CSS file path is NULL in database!\n";
            echo "  This means the save didn't update the database.\n";
        }
    } else {
        echo "No header with ID 1 found\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
