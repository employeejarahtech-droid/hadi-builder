<?php
require_once __DIR__ . '/../includes/db.php';

$pdo = getDBConnection();

echo "=== Checking CSS Files in Database ===\n\n";

// Check headers
echo "HEADERS:\n";
$stmt = $pdo->query("SELECT id, name, css_file FROM headers");
while ($row = $stmt->fetch()) {
    echo "  ID: {$row['id']} | Name: {$row['name']} | CSS: " . ($row['css_file'] ?? 'NULL') . "\n";
}

echo "\nPAGES:\n";
$stmt = $pdo->query("SELECT id, title, css_file FROM pages LIMIT 5");
while ($row = $stmt->fetch()) {
    echo "  ID: {$row['id']} | Title: {$row['title']} | CSS: " . ($row['css_file'] ?? 'NULL') . "\n";
}

echo "\nFOOTERS:\n";
$stmt = $pdo->query("SELECT id, name, css_file FROM footers");
while ($row = $stmt->fetch()) {
    echo "  ID: {$row['id']} | Name: {$row['name']} | CSS: " . ($row['css_file'] ?? 'NULL') . "\n";
}

echo "\n=== Checking Settings ===\n";
$stmt = $pdo->query("SELECT * FROM settings WHERE key_name IN ('global_header', 'global_footer', 'global_topbar')");
while ($row = $stmt->fetch()) {
    echo "  {$row['key_name']}: {$row['value']}\n";
}
