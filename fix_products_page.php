<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$id = 15; // The page ID found in the search
$stmt = $pdo->prepare("SELECT content FROM pages WHERE id = ?");
$stmt->execute([$id]);
$page = $stmt->fetch(PDO::FETCH_ASSOC);

if ($page) {
    echo "Found page ID $id. Updating content...\n";
    $content = $page['content'];

    // Replace posts_per_page:6 with posts_per_page:20
    $content = str_replace('"posts_per_page":6', '"posts_per_page":20', $content);
    $content = str_replace('"posts_per_page":"6"', '"posts_per_page":20', $content);

    // Also update the "limit" object if present
    $content = str_replace('"limit":{"size":6,"unit":""}', '"limit":{"size":20,"unit":""}', $content);

    $updateStmt = $pdo->prepare("UPDATE pages SET content = ? WHERE id = ?");
    $updateStmt->execute([$content, $id]);

    echo "Updated page ID $id content.\n";
} else {
    echo "Page ID $id not found.\n";
}
