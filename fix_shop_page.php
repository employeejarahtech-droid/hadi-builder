<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT id, content FROM pages WHERE slug = 'shop'");
$stmt->execute();
$page = $stmt->fetch(PDO::FETCH_ASSOC);

if ($page) {
    if (empty($page['content']) || $page['content'] === '[]') {
        echo "Shop page content is empty. Fallback in file will be used (already updated).\n";
    } else {
        $content = json_decode($page['content'], true);
        $updated = false;

        foreach ($content as &$widget) {
            if ($widget['type'] === 'product_grid') {
                if (!isset($widget['settings']['posts_per_page']) || $widget['settings']['posts_per_page'] != 20) {
                    $widget['settings']['posts_per_page'] = 20;
                    $updated = true;
                }
            }
        }

        if ($updated) {
            $newContent = json_encode($content);
            $updateStmt = $pdo->prepare("UPDATE pages SET content = ? WHERE id = ?");
            $updateStmt->execute([$newContent, $page['id']]);
            echo "Updated shop page content in database to use 20 posts per page.\n";
        } else {
            echo "Shop page in database already has correct settings.\n";
        }
    }
} else {
    echo "Shop page not found in database.\n";
}
