<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

echo "=== Published Pages ===\n\n";
$stmt = $pdo->query("SELECT id, title, slug, status FROM pages WHERE status = 'published' ORDER BY created_at DESC");
$pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($pages) > 0) {
    echo "Your published pages are accessible at:\n\n";
    foreach ($pages as $page) {
        echo "✓ {$page['title']}\n";
        echo "  URL: http://localhost:4000/new-cms/{$page['slug']}\n\n";
    }
} else {
    echo "No published pages found.\n";
}

echo "\n=== Draft Pages ===\n\n";
$stmt = $pdo->query("SELECT id, title, slug FROM pages WHERE status = 'draft' ORDER BY created_at DESC");
$drafts = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($drafts) > 0) {
    echo "These pages need to be published:\n\n";
    foreach ($drafts as $draft) {
        echo "• {$draft['title']} ({$draft['slug']}) - DRAFT\n";
    }
} else {
    echo "No draft pages.\n";
}
?>