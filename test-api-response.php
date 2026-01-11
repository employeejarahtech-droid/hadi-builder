<?php
require 'includes/db.php';
$pdo = getDBConnection();

// Simulate what the API does
$slug = 'Product10';

$stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ? LIMIT 1");
$stmt->execute([$slug]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if ($product) {
    // Enrich with variations (same as API)
    $product['variations'] = [];
    if (($product['product_type'] ?? 'simple') === 'variable') {
        $stmt = $pdo->prepare("SELECT * FROM product_variations WHERE product_id = ?");
        $stmt->execute([$product['id']]);
        $variations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($variations as &$var) {
            $var['attributes'] = json_decode($var['attributes'], true);
        }
        $product['variations'] = $variations;
    }

    echo "Product Data:\n";
    echo "Name: " . $product['name'] . "\n";
    echo "Type: " . $product['product_type'] . "\n";
    echo "Attributes: " . $product['attributes'] . "\n";
    echo "Variations Count: " . count($product['variations']) . "\n\n";

    if (count($product['variations']) > 0) {
        echo "First Variation:\n";
        print_r($product['variations'][0]);
    }

    echo "\n\nJSON Response:\n";
    echo json_encode(['success' => true, 'product' => $product], JSON_PRETTY_PRINT);
} else {
    echo "Product not found";
}
