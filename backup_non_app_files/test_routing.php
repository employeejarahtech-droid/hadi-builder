<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Check for your-name page
$stmt = $pdo->prepare("SELECT id, title, slug, status FROM pages WHERE slug = ?");
$stmt->execute(['your-name']);
$page = $stmt->fetch(PDO::FETCH_ASSOC);

if ($page) {
    echo "Found page:\n";
    print_r($page);

    if ($page['status'] === 'draft') {
        echo "\nPublishing page...\n";
        $stmt2 = $pdo->prepare("UPDATE pages SET status = ? WHERE slug = ?");
        $stmt2->execute(['published', 'your-name']);
        echo "Page published!\n";
    } else {
        echo "\nPage is already published.\n";
    }
} else {
    echo "Page 'your-name' not found.\n\n";
    echo "Recent pages:\n";
    $stmt = $pdo->query("SELECT id, title, slug, status FROM pages ORDER BY created_at DESC LIMIT 5");
    while ($p = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "{$p['id']}: {$p['title']} ({$p['slug']}) - {$p['status']}\n";
    }
}

// Test URL routing
echo "\n\n=== Testing URL Routing ===\n";
$testSlug = 'your-name';
$basePath = '/new-cms';
$testUri = $basePath . '/' . $testSlug;

echo "Test URI: $testUri\n";
echo "Base Path: $basePath\n";
$route = str_replace($basePath, '', $testUri);
$route = strtok($route, '?');
$slug = trim($route, '/');
echo "Extracted slug: '$slug'\n";

$stmt = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ? AND status = 'published'");
$stmt->execute([$slug]);
$count = $stmt->fetchColumn();
echo "DB match count: $count\n";
?>