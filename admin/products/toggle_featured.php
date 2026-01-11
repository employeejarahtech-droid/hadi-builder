<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$featured = isset($_POST['featured']) ? intval($_POST['featured']) : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Check if is_featured column exists, if not add it
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'is_featured'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE products ADD COLUMN is_featured TINYINT(1) DEFAULT 0 AFTER status");
    }

    // Update the product
    $stmt = $pdo->prepare("UPDATE products SET is_featured = ? WHERE id = ?");
    $stmt->execute([$featured, $id]);

    echo json_encode(['success' => true, 'message' => 'Featured status updated']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
