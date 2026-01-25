<?php
session_start();

// Ensure auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // Clear all widget settings to reset to default (all active)
    $pdo->exec("TRUNCATE TABLE widget_settings");

    echo "All widget settings cleared. All widgets are now active by default.";
    echo '<br><br><a href="index.php">Back to Widget List</a>';
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>