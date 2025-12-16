<?php
// api/media/delete.php
header('Content-Type: application/json');

require_once __DIR__ . '/../../includes/db.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing media ID'
    ]);
    exit;
}

try {
    $pdo = getDBConnection();

    // First, get the file path from database
    $stmt = $pdo->prepare("SELECT file_path FROM gallery WHERE id = ?");
    $stmt->execute([$id]);
    $media = $stmt->fetch();

    if (!$media) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Media file not found'
        ]);
        exit;
    }

    // Delete from database
    $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
    $result = $stmt->execute([$id]);

    if ($result) {
        // Try to delete physical file
        $filePath = $media['file_path'];

        // Convert URL path to file system path
        if (strpos($filePath, 'images/') === 0) {
            $relativePath = substr($filePath, 7); // Remove 'images/' prefix
            $systemPath = __DIR__ . '/../../images/' . $relativePath;

            if (file_exists($systemPath)) {
                unlink($systemPath);
            }
        }

        echo json_encode([
            'success' => true,
            'message' => 'Media deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete media from database'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>