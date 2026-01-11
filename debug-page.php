<?php
require 'includes/db.php';
$pdo = getDBConnection();

$slug = 'about-us/my-home';
$stmt = $pdo->prepare('SELECT id, title, slug, content, status FROM pages WHERE slug = ?');
$stmt->execute([$slug]);
$page = $stmt->fetch();

if ($page) {
    echo "✓ Page found!\n";
    echo "ID: " . $page['id'] . "\n";
    echo "Title: " . $page['title'] . "\n";
    echo "Slug: " . $page['slug'] . "\n";
    echo "Status: " . $page['status'] . "\n";
    echo "Content length: " . strlen($page['content']) . " bytes\n";
    echo "\nContent preview:\n";
    echo substr($page['content'], 0, 500) . "\n";
} else {
    echo "✗ Page NOT found in database\n";
    echo "\nChecking all pages with similar slugs:\n";
    $stmt = $pdo->query("SELECT id, title, slug FROM pages WHERE slug LIKE '%home%' OR slug LIKE '%about%'");
    while ($row = $stmt->fetch()) {
        echo "  - ID: {$row['id']}, Slug: {$row['slug']}, Title: {$row['title']}\n";
    }
}
