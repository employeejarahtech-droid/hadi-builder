<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Search for any occurrence of "posts_per_page" in pages content
$stmt = $pdo->prepare("SELECT id, slug, content FROM pages WHERE content LIKE '%posts_per_page%'");
$stmt->execute();
$pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Checking " . count($pages) . " pages for settings:\n";

foreach ($pages as $page) {
    if (strpos($page['content'], '"posts_per_page":6') !== false || strpos($page['content'], '"posts_per_page":"6"') !== false) {
        echo "MATCH FOUND in Page ID: " . $page['id'] . " (Slug: " . $page['slug'] . ")\n";
        echo "Content snippet: " . substr($page['content'], 0, 500) . "...\n";
    }
}

echo "Search complete.\n";
