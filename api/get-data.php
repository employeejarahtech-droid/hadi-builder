<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../includes/db.php';
    $pdo = getDBConnection();

    // Create gallery table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Fetch all images from gallery table
    $stmt = $pdo->query("SELECT id, file_path, file_name, file_type, file_size, uploaded_at FROM gallery ORDER BY uploaded_at DESC");
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // If no images, return sample data for testing
    if (empty($images)) {
        $images = [
            [
                'id' => 1,
                'file_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                'file_name' => 'sample-1.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 0,
                'uploaded_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 2,
                'file_path' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                'file_name' => 'sample-2.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 0,
                'uploaded_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 3,
                'file_path' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
                'file_name' => 'sample-3.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 0,
                'uploaded_at' => date('Y-m-d H:i:s')
            ]
        ];
    }

    echo json_encode($images);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
}
