<?php
require_once __DIR__ . '/includes/db.php';
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT * FROM settings");
    $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($settings);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
