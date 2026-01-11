<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    try {
        $pdo = getDBConnection();

        // Unlink projects from this category first
        $stmt = $pdo->prepare("UPDATE projects SET category_id = NULL WHERE category_id = ?");
        $stmt->execute([$id]);

        // Delete the category
        $stmt = $pdo->prepare("DELETE FROM project_categories WHERE id = ?");
        $stmt->execute([$id]);

    } catch (Exception $e) {
        // Log error or show it (for now just redirect)
    }
}

header('Location: index.php');
exit;
