<?php
require_once 'includes/db.php';
$pdo = getDBConnection();

$stmt = $pdo->prepare("UPDATE pages SET status = 'published' WHERE slug IN ('home-page', 'about-us/my-home')");
$stmt->execute();

echo "Updated pages to published.\n";

// Verify
$stmt = $pdo->query("SELECT id, title, slug, status FROM pages");
$pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($pages as $p) {
    echo "Slug: '{$p['slug']}', Status: '{$p['status']}'\n";
}
?>