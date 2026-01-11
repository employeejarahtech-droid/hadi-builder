<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("SELECT id, name, slug FROM products");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<h1>Product List</h1>";
echo "<table border='1'><tr><th>ID</th><th>Name</th><th>Slug</th></tr>";
foreach ($products as $p) {
    echo "<tr>";
    echo "<td>{$p['id']}</td>";
    echo "<td>{$p['name']}</td>";
    echo "<td>{$p['slug']}</td>";
    echo "</tr>";
}
echo "</table>";
?>