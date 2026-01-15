<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Fetch the last 10 products
$stmt = $pdo->query("SELECT id, name, category_id FROM products ORDER BY id DESC LIMIT 10");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Last 10 Products:\n";
foreach ($products as $p) {
    echo "ID: " . $p['id'] . " | Name: " . $p['name'] . " | Category ID (Raw): " . var_export($p['category_id'], true) . "\n";
}

// Also check specifically for ID 7 match
$stmt = $pdo->query("SELECT count(*) FROM products WHERE category_id = '[7]'");
echo "\nExact string '[7]' count: " . $stmt->fetchColumn() . "\n";

$stmt = $pdo->query("SELECT count(*) FROM products WHERE JSON_CONTAINS(category_id, '7')");
echo "JSON_CONTAINS(..., '7') count: " . $stmt->fetchColumn() . "\n";
