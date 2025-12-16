<?php
session_start();
// admin/api/save-page.php

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$pageId = $input['id'] ?? null;
$type = $input['type'] ?? 'page';
$content = $input['content'] ?? null;

if (!$pageId || !isset($input['content'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing data']);
    exit;
}

try {
    $pdo = getDBConnection();

    $table = ($type === 'post') ? 'posts' : 'pages';
    // Validate table name
    if (!in_array($table, ['pages', 'posts']))
        $table = 'pages';

    // Convert content object/array to JSON string
    $contentJson = is_string($content) ? $content : json_encode($content);

    $stmt = $pdo->prepare("UPDATE $table SET content = ? WHERE id = ?");
    $result = $stmt->execute([$contentJson, $pageId]);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
