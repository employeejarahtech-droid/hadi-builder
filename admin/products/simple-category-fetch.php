<?php
// Simple category fetching - shows ALL categories
$categories = [];
try {
    // Add parent_id column if it doesn't exist
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER id");
    }

    // Fetch ALL categories
    $stmt = $pdo->query("SELECT id, name, parent_id FROM categories ORDER BY id ASC");
    $allCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add level to each category (0 for parent, 1 for child)
    foreach ($allCategories as $cat) {
        $cat['level'] = empty($cat['parent_id']) ? 0 : 1;
        $categories[] = $cat;
    }
} catch (Exception $e) {
    // Fallback: just get all categories without parent logic
    try {
        $stmt = $pdo->query("SELECT id, name, 0 as level FROM categories ORDER BY name ASC");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e2) {
        $categories = [];
    }
}
?>