<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = 'shop'");
$stmt->execute();
$pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

$output = "Found " . count($pages) . " pages with slug 'shop'.\n\n";

foreach ($pages as $page) {
    $output .= "ID: " . $page['id'] . "\n";
    $output .= "Content Length: " . strlen($page['content']) . "\n";
    $output .= "Content:\n" . $page['content'] . "\n";
    $output .= "----------------------------------------\n";
}

file_put_contents(__DIR__ . '/debug_shop_output.txt', $output);
echo "Dumped to debug_shop_output.txt";
