<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/db.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$id = $input['id'] ?? null;
$title = $input['title'] ?? null;
$slug = $input['slug'] ?? null;

if (!$id || !$title || !$slug) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Check if slug exists (exclude current page)
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ? AND id != ?");
    $stmt->execute([$slug, $id]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Slug already exists']);
        exit;
    }

    // Update page
    $stmt = $pdo->prepare("UPDATE pages SET title = ?, slug = ?, updated_at = NOW() WHERE id = ?");
    $result = $stmt->execute([$title, $slug, $id]);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update database']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
