<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // Add parent_id column to categories table if it doesn't exist
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
    $columnExists = $stmt->fetch();

    if (!$columnExists) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER id");
        $pdo->exec("ALTER TABLE categories ADD FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL");
        echo "Success: parent_id column added to categories table.";
    } else {
        echo "Info: parent_id column already exists.";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
