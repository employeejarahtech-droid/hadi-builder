<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$id = $_GET['id'] ?? null;

if ($id) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("DELETE FROM topbars WHERE id = ?");
        $stmt->execute([$id]);
    } catch (Exception $e) {
        // Ignore error
    }
}

header('Location: index.php');
exit;
?>