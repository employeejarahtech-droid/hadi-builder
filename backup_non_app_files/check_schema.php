<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("DESCRIBE products");
print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
