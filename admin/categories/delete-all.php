<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // 1. Get total number of categories
    $countStmt = $pdo->query("SELECT COUNT(*) FROM categories");
    $totalCategories = $countStmt->fetchColumn();

    if ($totalCategories == 0) {
        $_SESSION['error'] = "No categories to delete.";
        header("Location: index.php");
        exit;
    }

    // 2. Delete categories that are NOT used in 'products' table
    // Adjust based on your schema. Assuming 'products' table has 'category_id'.
    // If you have a pivot table 'product_categories', check that instead.

    // Check if 'category_id' exists in products table or if it's a many-to-many.
    // Based on previous delete.php, it checked: "SELECT COUNT(*) FROM products WHERE category_id = ?"
    // So it's a direct relationship.

    $sql = "DELETE FROM categories WHERE id NOT IN (SELECT DISTINCT category_id FROM products WHERE category_id IS NOT NULL)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $deletedCount = $stmt->rowCount();
    $skippedCount = $totalCategories - $deletedCount;

    if ($deletedCount > 0) {
        $msg = "Successfully deleted $deletedCount categories.";
        if ($skippedCount > 0) {
            $msg .= " $skippedCount categories were skipped because they contain products.";
        }
        $_SESSION['success'] = $msg;
    } else {
        $_SESSION['error'] = "No categories were deleted. All $totalCategories categories are currently in use by products.";
    }

} catch (Exception $e) {
    $_SESSION['error'] = "Error deleting categories: " . $e->getMessage();
}

header("Location: index.php");
exit;
