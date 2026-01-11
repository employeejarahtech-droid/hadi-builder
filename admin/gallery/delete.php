<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$id = $_GET['id'] ?? null;

if ($id) {
    try {
        $pdo = getDBConnection();

        // Get file path first
        $stmt = $pdo->prepare("SELECT file_path FROM gallery WHERE id = ?");
        $stmt->execute([$id]);
        $image = $stmt->fetch();

        if ($image) {
            // Delete file from disk
            // File path is stored as relative path e.g. /images/filename.jpg
            $filePath = __DIR__ . '/../../' . ltrim($image['file_path'], '/');

            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Delete from DB
            $delStmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
            $delStmt->execute([$id]);
        }
    } catch (Exception $e) {
        // Log error or show message
    }
}

header('Location: index.php');
exit;
