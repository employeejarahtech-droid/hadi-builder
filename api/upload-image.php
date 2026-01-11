<?php
// Suppress all output before JSON
ob_start();
error_reporting(0);
ini_set('display_errors', 0);

try {
    // Set JSON header first
    header('Content-Type: application/json');

    // Clear any previous output
    ob_clean();

    require_once __DIR__ . '/../includes/db.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed');
    }

    if (!isset($_FILES['file'])) {
        throw new Exception('No file uploaded');
    }

    $file = $_FILES['file'];

    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Upload error code: ' . $file['error']);
    }

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception('Invalid file type: ' . $mimeType . '. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        throw new Exception('File too large. Maximum size is 5MB.');
    }

    // Create images directory if it doesn't exist
    $uploadDir = __DIR__ . '/../images/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Failed to create images directory');
        }
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    if (empty($extension)) {
        $extension = 'jpg';
    }
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        throw new Exception('Failed to move uploaded file');
    }

    // Get relative path for database
    $relativePath = '/images/' . $filename;

    // Save to database
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

    // Add missing columns if they don't exist
    try {
        $pdo->exec("ALTER TABLE gallery ADD COLUMN file_type VARCHAR(50) AFTER file_path");
    } catch (Exception $e) {
        // Column already exists, ignore
    }

    try {
        $pdo->exec("ALTER TABLE gallery ADD COLUMN file_size INT AFTER file_type");
    } catch (Exception $e) {
        // Column already exists, ignore
    }

    $stmt = $pdo->prepare("INSERT INTO gallery (file_name, file_path) VALUES (?, ?)");
    $stmt->execute([$file['name'], $relativePath]);

    $response = [
        'success' => true,
        'file' => [
            'id' => $pdo->lastInsertId(),
            'file_name' => $file['name'],
            'file_path' => $relativePath,
            'file_type' => $mimeType,
            'file_size' => $file['size']
        ]
    ];

    ob_end_clean();
    echo json_encode($response);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
