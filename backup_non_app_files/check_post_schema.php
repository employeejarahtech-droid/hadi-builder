<?php
require_once __DIR__ . '/includes/db.php';
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("DESCRIBE posts");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo implode(", ", $columns);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
