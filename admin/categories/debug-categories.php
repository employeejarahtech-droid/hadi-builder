<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // Check if parent_id column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
    $columnExists = $stmt->fetch();

    echo "<h2>Categories Table Debug</h2>";
    echo "<p>parent_id column exists: " . ($columnExists ? "YES" : "NO") . "</p>";

    // Fetch all categories
    $stmt = $pdo->query("SELECT id, name, slug, parent_id FROM categories ORDER BY id ASC");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<h3>All Categories in Database:</h3>";
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>ID</th><th>Name</th><th>Slug</th><th>parent_id</th></tr>";
    foreach ($categories as $cat) {
        echo "<tr>";
        echo "<td>" . $cat['id'] . "</td>";
        echo "<td>" . htmlspecialchars($cat['name']) . "</td>";
        echo "<td>" . htmlspecialchars($cat['slug']) . "</td>";
        echo "<td>" . ($cat['parent_id'] ?? 'NULL') . "</td>";
        echo "</tr>";
    }
    echo "</table>";

    echo "<br><a href='index.php'>Back to Categories</a>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
