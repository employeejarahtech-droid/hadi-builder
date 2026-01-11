<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$productId = $_GET['id'] ?? null;

if (!$productId) {
    header('Location: index.php');
    exit;
}

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$productId]);

    header('Location: index.php');
    exit;
} catch (Exception $e) {
    die('Error deleting product: ' . $e->getMessage());
}
