<?php
require_once __DIR__ . '/includes/db.php';

$pdo = getDBConnection();
$count = $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
echo "Total products in database: $count\n";

$activeCount = $pdo->query("SELECT COUNT(*) FROM products WHERE status = 'active'")->fetchColumn();
echo "Active products: $activeCount\n";

$categoryCount = $pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn();
echo "Total categories: $categoryCount\n";
