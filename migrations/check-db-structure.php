<?php
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    echo "=== Checking Database Structure ===\n\n";

    // Check headers table structure
    echo "HEADERS table columns:\n";
    $stmt = $pdo->query("DESCRIBE headers");
    while ($row = $stmt->fetch()) {
        echo "  - {$row['Field']} ({$row['Type']})\n";
    }

    echo "\n=== Checking CSS File Data ===\n\n";

    // Check header 1 (use correct column names)
    $stmt = $pdo->query("SELECT * FROM headers WHERE id = 1");
    $header = $stmt->fetch();

    if ($header) {
        echo "Header ID 1:\n";
        foreach ($header as $key => $value) {
            if (!is_numeric($key)) {
                echo "  $key: " . ($value ?? 'NULL') . "\n";
            }
        }

        if (isset($header['css_file']) && $header['css_file']) {
            $fullPath = __DIR__ . '/../' . $header['css_file'];
            echo "\nCSS File Check:\n";
            echo "  Path: {$header['css_file']}\n";
            echo "  Full path: $fullPath\n";
            echo "  Exists: " . (file_exists($fullPath) ? 'YES ✓' : 'NO ✗') . "\n";
        } else {
            echo "\n❌ css_file is NULL or empty!\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
