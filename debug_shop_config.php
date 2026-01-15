<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = 'shop'");
$stmt->execute();
$pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Found " . count($pages) . " pages with slug 'shop'.\n\n";

foreach ($pages as $page) {
    echo "ID: " . $page['id'] . "\n";
    echo "Content Length: " . strlen($page['content']) . "\n";
    echo "Content:\n" . $page['content'] . "\n";
    echo "----------------------------------------\n";
}
