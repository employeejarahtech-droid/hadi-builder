<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$stmt = $pdo->prepare("UPDATE pages SET status = ? WHERE slug = ?");
$stmt->execute(['published', 'myname']);

echo "Page 'myname' published successfully!\n";

// Verify
$stmt = $pdo->prepare("SELECT id, title, slug, status FROM pages WHERE slug = ?");
$stmt->execute(['myname']);
$page = $stmt->fetch(PDO::FETCH_ASSOC);

if ($page) {
    echo "Verified: " . print_r($page, true);
} else {
    echo "Error: Page not found after update.";
}
?>