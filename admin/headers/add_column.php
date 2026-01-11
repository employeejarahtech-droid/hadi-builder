<?php
require_once __DIR__ . '/../../includes/db.php';
try {
    $pdo = getDBConnection();
    $pdo->exec("ALTER TABLE headers ADD COLUMN is_default TINYINT(1) DEFAULT 0");
    echo "Column added successfully";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>