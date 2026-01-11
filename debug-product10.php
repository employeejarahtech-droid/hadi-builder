<?php
require 'includes/db.php';
$pdo = getDBConnection();

// Check Product10
$stmt = $pdo->prepare('SELECT id, name, slug, product_type, attributes FROM products WHERE slug = ?');
$stmt->execute(['Product10']);
$p = $stmt->fetch();

if ($p) {
    echo "✓ Product Found\n";
    echo "ID: " . $p['id'] . "\n";
    echo "Name: " . $p['name'] . "\n";
    echo "Slug: " . $p['slug'] . "\n";
    echo "Type: " . ($p['product_type'] ?? 'NULL/NOT SET') . "\n";
    echo "Attributes: " . ($p['attributes'] ?? 'NULL') . "\n\n";

    // Check variations
    $stmt2 = $pdo->prepare('SELECT * FROM product_variations WHERE product_id = ?');
    $stmt2->execute([$p['id']]);
    $variations = $stmt2->fetchAll();

    echo "Variations Count: " . count($variations) . "\n";
    if (count($variations) > 0) {
        echo "\nVariations:\n";
        foreach ($variations as $v) {
            echo "  - ID: {$v['id']}, Attributes: {$v['attributes']}, Price: {$v['price']}\n";
        }
    }
} else {
    echo "✗ Product 'Product10' not found\n";
    echo "\nSearching for products with '10' in name:\n";
    $stmt = $pdo->query("SELECT id, name, slug, product_type FROM products WHERE name LIKE '%10%' OR slug LIKE '%10%'");
    while ($row = $stmt->fetch()) {
        echo "  - ID: {$row['id']}, Name: {$row['name']}, Slug: {$row['slug']}, Type: " . ($row['product_type'] ?? 'NULL') . "\n";
    }
}
