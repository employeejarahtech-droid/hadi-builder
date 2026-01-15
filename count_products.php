<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();
$count = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
echo "Total Products: $count";
