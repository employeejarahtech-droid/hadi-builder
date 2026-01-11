<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

echo "Adding slug column to products table...\n\n";

try {
    // Add slug column
    $pdo->exec("ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE AFTER name");
    echo "✓ Slug column added successfully!\n\n";

    // Generate slugs for existing products
    echo "Generating slugs for existing products...\n";
    $stmt = $pdo->query("SELECT id, name FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($products as $product) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $product['name'])));
        $slug = trim($slug, '-');

        // Make sure slug is unique
        $baseSlug = $slug;
        $counter = 1;
        while (true) {
            $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM products WHERE slug = ? AND id != ?");
            $checkStmt->execute([$slug, $product['id']]);
            if ($checkStmt->fetchColumn() == 0) {
                break;
            }
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $updateStmt = $pdo->prepare("UPDATE products SET slug = ? WHERE id = ?");
        $updateStmt->execute([$slug, $product['id']]);
        echo "  - Product #{$product['id']}: {$product['name']} → slug: $slug\n";
    }

    echo "\n✓ All done!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>