<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // Get count before deletion
    $countStmt = $pdo->query("SELECT COUNT(*) FROM products");
    $totalProducts = $countStmt->fetchColumn();

    if ($totalProducts == 0) {
        $_SESSION['error'] = "No products to delete.";
        header("Location: index.php");
        exit;
    }

    // Delete all products
    // Using DELETE instead of TRUNCATE to respect potential foreign key constraints
    $stmt = $pdo->prepare("DELETE FROM products");
    $stmt->execute();

    $_SESSION['success'] = "Successfully deleted all $totalProducts products.";

} catch (Exception $e) {
    $_SESSION['error'] = "Error deleting products: " . $e->getMessage();
}

header("Location: index.php");
exit;
