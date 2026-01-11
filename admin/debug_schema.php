<?php
require_once __DIR__ . '/../includes/db.php';
$pdo = getDBConnection();

// Check tables
$tables = $pdo->query("SHOW TABLES LIKE 'product_variations'")->fetchAll();
echo "Table 'product_variations': " . (count($tables) > 0 ? "EXISTS" : "MISSING") . "\n";

if (count($tables) > 0) {
    echo "Columns:\n";
    $cols = $pdo->query("SHOW COLUMNS FROM product_variations")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($cols as $c) {
        echo "- {$c['Field']} ({$c['Type']})\n";
    }
}
