<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();

    // Check for shop page
    $stmt = $pdo->query("SELECT id, slug, title, content FROM pages WHERE slug = 'shop'");
    $shopPage = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($shopPage) {
        echo "Shop page found in database:\n";
        echo "ID: " . $shopPage['id'] . "\n";
        echo "Title: " . $shopPage['title'] . "\n";
        echo "Content preview: " . substr($shopPage['content'], 0, 300) . "...\n\n";

        // Parse the content
        $content = json_decode($shopPage['content'], true);
        if ($content && is_array($content)) {
            foreach ($content as $widget) {
                if (isset($widget['type']) && $widget['type'] === 'product_grid') {
                    echo "Found ProductGrid widget:\n";
                    echo "Settings: " . json_encode($widget['settings'], JSON_PRETTY_PRINT) . "\n";
                }
            }
        }
    } else {
        echo "No shop page found in database - will use fallback\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
