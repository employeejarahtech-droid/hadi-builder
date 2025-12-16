<?php
require 'includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query('SELECT * FROM gallery ORDER BY id DESC LIMIT 5');
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
