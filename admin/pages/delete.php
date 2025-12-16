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
        $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ?");
        $stmt->execute([$id]);
    } catch (Exception $e) {
        // Handle error implicitly or log
    }
}

header('Location: index.php');
exit;
