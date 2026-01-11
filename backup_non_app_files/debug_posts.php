<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("SELECT id, title, slug, status FROM posts");
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "TotalPosts:" . count($posts) . "\n";
foreach ($posts as $post) {
    echo "ID:{$post['id']} | Slug:{$post['slug']} | Status:{$post['status']}\n";
}
