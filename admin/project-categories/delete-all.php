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
    $countStmt = $pdo->query("SELECT COUNT(*) FROM project_categories");
    $totalCategories = $countStmt->fetchColumn();

    if ($totalCategories == 0) {
        $_SESSION['error'] = "No project categories to delete.";
        header("Location: index.php");
        exit;
    }

    // 2. Unlink all projects from categories (set category_id to NULL)
    // We update ALL projects because we are deleting ALL categories.
    // If strict FKs are in place, this prevents constraint errors.
    $pdo->exec("UPDATE projects SET category_id = NULL");

    // 3. Delete all project categories
    $stmt = $pdo->prepare("DELETE FROM project_categories");
    $stmt->execute();

    $_SESSION['success'] = "Successfully deleted all $totalCategories project categories. Projects have been unlinked.";

} catch (Exception $e) {
    $_SESSION['error'] = "Error deleting project categories: " . $e->getMessage();
}

header("Location: index.php");
exit;
