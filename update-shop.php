<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();

    // New enhanced ProductGrid configuration
    $newContent = json_encode([
        [
            'id' => 'main-shop-grid',
            'type' => 'product_grid',
            'settings' => [
                'title' => 'Shop All Products',
                'source' => 'dynamic',
                'columns' => '4',
                'show_filters' => 'yes',
                'show_categories' => 'yes',
                'show_price_filter' => 'yes',
                'posts_per_page' => 12,
                'primary_color' => '#007EFC',
                'discount_badge_color' => '#ff4444'
            ]
        ]
    ]);

    // Update the shop page
    $stmt = $pdo->prepare("UPDATE pages SET content = ? WHERE slug = 'shop'");
    $stmt->execute([$newContent]);

    echo "✅ Shop page updated successfully!\n";
    echo "New configuration:\n";
    echo "- 4 columns\n";
    echo "- Filters enabled\n";
    echo "- Categories sidebar enabled\n";
    echo "- Price filter enabled\n";
    echo "\nRefresh http://localhost:4000/shop to see changes\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
