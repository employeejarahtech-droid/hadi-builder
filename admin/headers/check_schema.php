<?php
require_once __DIR__ . '/../../includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("DESCRIBE headers");
$columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo json_encode($columns);
?>