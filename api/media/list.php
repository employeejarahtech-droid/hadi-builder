<?php
// api/media/list.php
header('Content-Type: application/json');

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    $stmt = $pdo->query("SELECT * FROM gallery ORDER BY created_at DESC");
    $images = $stmt->fetchAll();

    // Map to simplified structure if needed, or return as is
    // Let's ensure paths are correct
    $data = array_map(function ($img) {
        return [
            'id' => $img['id'],
            'url' => $img['file_path'], // Assuming relative path works from frontend
            'name' => $img['file_name'],
            'created_at' => $img['created_at']
        ];
    }, $images);

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
