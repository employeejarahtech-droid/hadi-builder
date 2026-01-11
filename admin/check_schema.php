<?php
require_once __DIR__ . '/../includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("SHOW COLUMNS FROM categories");
$columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo json_encode($columns);
?>