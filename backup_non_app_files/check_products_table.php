<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

echo "=== Products Table Structure ===\n\n";
$stmt = $pdo->query("DESCRIBE products");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}

echo "\n=== Checking if slug column exists ===\n";
$stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'slug'");
$slugExists = $stmt->fetch();

if ($slugExists) {
    echo "✓ Slug column already exists!\n";
} else {
    echo "✗ Slug column does NOT exist. Need to add it.\n";
}
?>