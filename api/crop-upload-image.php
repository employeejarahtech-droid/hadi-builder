<?php
session_start();

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

try {
    // Validate image data
    if (!isset($_POST['image']) || empty($_POST['image'])) {
        throw new Exception('No image data provided');
    }

    $imageData = $_POST['image'];

    // Remove data URI prefix
    $imageData = str_replace('data:image/webp;base64,', '', $imageData);
    $imageData = str_replace(' ', '+', $imageData);

    // Decode base64
    $decodedImage = base64_decode($imageData);

    if ($decodedImage === false) {
        throw new Exception('Invalid image data');
    }

    // Generate unique filename
    $timestamp = time();
    $random = bin2hex(random_bytes(4));
    $filename = "cropped-{$timestamp}-{$random}.webp";

    // Define upload directory
    $uploadDir = __DIR__ . '/../images/';

    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filepath = $uploadDir . $filename;

    // Save file
    if (file_put_contents($filepath, $decodedImage) === false) {
        throw new Exception('Failed to save image file');
    }

    // Get file size
    $fileSize = filesize($filepath);

    // Insert into database
    $pdo = getDBConnection();

    // Ensure gallery table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $stmt = $pdo->prepare("INSERT INTO gallery (file_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $filename,
        '/images/' . $filename,
        'image/webp',
        $fileSize
    ]);

    // Return success response
    echo json_encode([
        'success' => true,
        'url' => '/images/' . $filename,
        'filename' => $filename,
        'size' => $fileSize
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
