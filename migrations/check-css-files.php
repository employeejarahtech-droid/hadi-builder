<?php
require_once __DIR__ . '/../includes/db.php';

$pdo = getDBConnection();

echo "Checking headers table for CSS files...\n\n";

$stmt = $pdo->query("SELECT id, name, css_file FROM headers LIMIT 5");

while ($row = $stmt->fetch()) {
    echo "Header ID: " . $row['id'] . "\n";
    echo "  Name: " . $row['name'] . "\n";
    echo "  CSS File: " . ($row['css_file'] ?? 'NULL') . "\n\n";
}
