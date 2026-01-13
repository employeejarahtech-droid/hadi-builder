<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    header("Location: index.php");
    exit;
}

try {
    $pdo = getDBConnection();

    // Check if brand is used by any products
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM products WHERE brand_id = ?");
    $stmt->execute([$id]);
    $productCount = $stmt->fetchColumn();

    if ($productCount > 0) {
        $_SESSION['error'] = "Cannot delete brand. It is being used by $productCount product(s).";
        header("Location: index.php");
        exit;
    }

    // Delete brand
    $stmt = $pdo->prepare("DELETE FROM brands WHERE id = ?");
    $stmt->execute([$id]);

    header("Location: index.php");
    exit;
} catch (Exception $e) {
    $_SESSION['error'] = "Error deleting brand: " . $e->getMessage();
    header("Location: index.php");
    exit;
}
