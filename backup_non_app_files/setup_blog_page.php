<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Content from blog/index.php (Blog Index portion)
$pageContent = json_encode([
    [
        'id' => 'blog-hero',
        'type' => 'container',
        'settings' => ['padding' => ['top' => '60', 'bottom' => '60', 'unit' => 'px'], 'background_color' => '#f8fafc'],
        'elements' => [
            [
                'id' => 'blog-title',
                'type' => 'heading',
                'settings' => ['title' => 'Our Blog', 'align' => 'center', 'html_tag' => 'h1']
            ],
            [
                'id' => 'blog-desc',
                'type' => 'text',
                'settings' => ['content' => 'Latest news and updates from our team.', 'align' => 'center']
            ]
        ]
    ],
    [
        'id' => 'blog-grid-section',
        'type' => 'container',
        'settings' => ['padding' => ['top' => '40', 'bottom' => '80', 'left' => '20', 'right' => '20', 'unit' => 'px'], 'boxed' => 'yes', 'width' => '1200'],
        'elements' => [
            [
                'id' => 'main-post-grid',
                'type' => 'post_grid', // The widget we created
                'settings' => [
                    'posts_per_page' => ['size' => 9],
                    'columns' => '3'
                ]
            ]
        ]
    ]
]);

// Check if page exists
$stmt = $pdo->prepare("SELECT id FROM pages WHERE slug = 'blog'");
$stmt->execute();
$page = $stmt->fetch();

if ($page) {
    echo "Blog page already exists (ID: " . $page['id'] . "). Updating content...\n";
    $stmt = $pdo->prepare("UPDATE pages SET content = ? WHERE id = ?");
    $stmt->execute([$pageContent, $page['id']]);
} else {
    echo "Creating Blog page...\n";
    $stmt = $pdo->prepare("INSERT INTO pages (title, slug, content, status) VALUES (?, ?, ?, 'published')");
    $stmt->execute(['Blog', 'blog', $pageContent]);
    echo "Blog page created (ID: " . $pdo->lastInsertId() . ")\n";
}
