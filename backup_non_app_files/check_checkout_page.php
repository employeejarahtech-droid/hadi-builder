<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$slug = 'checkout';
$stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ?");
$stmt->execute([$slug]);
$page = $stmt->fetch(PDO::FETCH_ASSOC);

if ($page) {
    echo "Page found: " . print_r($page, true);
} else {
    echo "Page with slug '$slug' NOT found.";

    // List all pages
    echo "\n\nAll pages:\n";
    $stmt = $pdo->query("SELECT id, title, slug FROM pages");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['id']}: {$row['title']} ({$row['slug']})\n";
    }
}
?>