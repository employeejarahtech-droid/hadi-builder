<?php
// api/media/upload.php
header('Content-Type: application/json');

require_once __DIR__ . '/../../includes/db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    if (!isset($_FILES['file'])) {
        throw new Exception('No file uploaded');
    }

    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('File upload error: ' . $file['error']);
    }

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.');
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_', true) . '.' . $extension;

    // Physical path: d:/xamp/.../new-cms/images/
    $uploadDir = __DIR__ . '/../../images/';
    $uploadPath = $uploadDir . $filename;

    // Web path: /images/filename.jpg
    // We'll trust that 'images' is at the site root.
    // This avoids issues with folder sub-nesting detection.
    $publicPath = 'images/' . $filename;

    // If we want it absolute (leading slash), we can check if we are in a subdir or not,
    // but for most "site root" setups, 'images/' or '/images/' is best.
    // Let's use 'images/' (relative) which works well if <base> is not set weirdly,
    // OR '/images/' if we want it from domain root.
    // Given the issues, let's try '/images/' assuming the site is served from root or the user handles rewrites.

    // Actually, if served from localhost:4000/about-us, a relative 'images/foo.jpg' would look for localhost:4000/about-us/images/foo.jpg -> Fail.
    // So we need '/images/foo.jpg' (domain root) or '../images/foo.jpg'.

    // If the user serves 'd:/xamp/new-cms' as root (localhost:4000), then '/images/' is correct.
    // If the user serves 'd:/xamp/htdocs' as root (localhost/new-cms), then '/new-cms/images/' is correct.

    // Compromise: Use a relative path detection that actually works, or just return the filename
    // and let the frontend decide? No, we store the full URL usually.

    // Let's try to detect if 'new-cms' is part of the URL.
    $scriptName = $_SERVER['SCRIPT_NAME']; // e.g. /new-cms/api/media/upload.php OR /api/media/upload.php
    $scriptDir = dirname($scriptName); // /new-cms/api/media OR /api/media

    // Remove '/api/media' from the end
    $basePath = str_replace('/api/media', '', $scriptDir); // /new-cms OR "" (empty)

    // Ensure leading slash if not empty
    if ($basePath && $basePath !== '/' && $basePath[0] !== '/') {
        $basePath = '/' . $basePath;
    }
    if ($basePath === '/')
        $basePath = '';

    $publicPath = $basePath . '/images/' . $filename;


    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Failed to move uploaded file');
    }

    // Insert into DB
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("INSERT INTO gallery (file_name, file_path) VALUES (?, ?)");
    $stmt->execute([$file['name'], $publicPath]);
    $id = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'data' => [
            'id' => $id,
            'url' => $publicPath,
            'name' => $file['name']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
