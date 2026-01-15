<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();
$count = $pdo->query("SELECT COUNT(*) FROM products WHERE category_id IS NOT NULL AND JSON_CONTAINS(category_id, '7')")->fetchColumn();
echo "Total Accessories Products: $count";
