<?php
require_once __DIR__ . '/includes/db.php';
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT id, title, slug FROM pages");
    $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($pages, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
