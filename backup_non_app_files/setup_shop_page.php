<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Content from shop/index.php
$pageContent = json_encode([
    [
        'id' => 'shop-header',
        'type' => 'container',
        'settings' => ['padding' => ['top' => '60', 'bottom' => '60', 'unit' => 'px'], 'background_color' => '#f8fafc'],
        'elements' => [
            [
                'id' => 'shop-title',
                'type' => 'heading',
                'settings' => ['title' => 'Shop', 'align' => 'center', 'html_tag' => 'h1', 'typography_font_size' => ['size' => 48, 'unit' => 'px'], 'typography_font_weight' => '800']
            ],
            [
                'id' => 'shop-desc',
                'type' => 'text',
                'settings' => ['content' => 'Explore our collection of premium products.', 'align' => 'center']
            ]
        ]
    ],
    [
        'id' => 'shop-grid-section',
        'type' => 'container',
        'settings' => ['padding' => ['top' => '40', 'bottom' => '80', 'left' => '20', 'right' => '20', 'unit' => 'px'], 'boxed' => 'yes', 'width' => '1200'],
        'elements' => [
            [
                'id' => 'main-shop-grid',
                'type' => 'product_grid',
                'settings' => [
                    'source' => 'dynamic',
                    'posts_per_page' => 12,
                    'limit' => ['size' => 12],
                    'columns' => '3',
                    'pagination_type' => 'numbers'
                ]
            ]
        ]
    ]
]);

// Check if page exists
$stmt = $pdo->prepare("SELECT id FROM pages WHERE slug = 'shop'");
$stmt->execute();
$page = $stmt->fetch();

if ($page) {
    echo "Shop page already exists (ID: " . $page['id'] . "). Updating content...\n";
    $stmt = $pdo->prepare("UPDATE pages SET content = ? WHERE id = ?");
    $stmt->execute([$pageContent, $page['id']]);
} else {
    echo "Creating Shop page...\n";
    $stmt = $pdo->prepare("INSERT INTO pages (title, slug, content, status) VALUES (?, ?, ?, 'published')");
    $stmt->execute(['Shop', 'shop', $pageContent]);
    echo "Shop page created (ID: " . $pdo->lastInsertId() . ")\n";
}
