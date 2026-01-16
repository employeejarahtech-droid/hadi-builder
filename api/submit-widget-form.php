<?php
// Ensure no output before this point
error_reporting(0);
ob_start();

require_once __DIR__ . '/../includes/db.php';

// Clean buffer before sending JSON headers
if (ob_get_length())
    ob_clean();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Create table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS widget_form (
        id INT AUTO_INCREMENT PRIMARY KEY,
        widget_name VARCHAR(255) NOT NULL,
        json_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_widget_name (widget_name),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validate input
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
        exit;
    }

    if (empty($data['widget_name'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing widget_name']);
        exit;
    }

    if (empty($data['form_data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing form_data']);
        exit;
    }

    // Sanitize widget name
    $widgetName = filter_var($data['widget_name'], FILTER_SANITIZE_STRING);

    // Convert form_data to JSON string
    $jsonData = json_encode($data['form_data']);

    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO widget_form (widget_name, json_data) VALUES (?, ?)");
    $stmt->execute([$widgetName, $jsonData]);

    $insertId = $pdo->lastInsertId();

    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Form submitted successfully',
        'id' => $insertId
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}
