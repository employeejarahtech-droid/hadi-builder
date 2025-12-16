<?php
require_once 'includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("SELECT id, title, slug, status FROM pages");
$pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Pages found: " . count($pages) . "\n";
foreach ($pages as $p) {
    echo "ID: {$p['id']}, Slug: '{$p['slug']}', Status: '{$p['status']}', Title: '{$p['title']}'\n";
}

$stmt = $pdo->query("SELECT id, title, slug FROM posts");
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "\nPosts found: " . count($posts) . "\n";
foreach ($posts as $p) {
    echo "ID: {$p['id']}, Slug: '{$p['slug']}', Title: '{$p['title']}'\n";
}
?>