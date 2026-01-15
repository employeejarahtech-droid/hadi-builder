<?php
/**
 * Product Reviews API - Submit a new review
 */

error_reporting(0);
ob_start();

require_once __DIR__ . '/../includes/db.php';

if (ob_get_length())
    ob_clean();

header('Content-Type: application/json');

try {
    $pdo = getDBConnection();

    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
    }

    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);

    $productId = isset($data['product_id']) ? (int) $data['product_id'] : null;
    $userName = isset($data['user_name']) ? trim($data['user_name']) : '';
    $userEmail = isset($data['user_email']) ? trim($data['user_email']) : '';
    $rating = isset($data['rating']) ? (int) $data['rating'] : 0;
    $title = isset($data['title']) ? trim($data['title']) : '';
    $reviewText = isset($data['review_text']) ? trim($data['review_text']) : '';

    // Validation
    $errors = [];

    if (!$productId) {
        $errors[] = 'Product ID is required';
    }

    if (empty($userName)) {
        $errors[] = 'Name is required';
    } elseif (strlen($userName) < 2) {
        $errors[] = 'Name must be at least 2 characters';
    }

    if (empty($userEmail)) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if ($rating < 1 || $rating > 5) {
        $errors[] = 'Rating must be between 1 and 5 stars';
    }

    if (empty($reviewText)) {
        $errors[] = 'Review text is required';
    } elseif (strlen($reviewText) < 10) {
        $errors[] = 'Review must be at least 10 characters';
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }

    // Check if product exists
    $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Product not found']);
        exit;
    }

    // Insert review
    $stmt = $pdo->prepare("
        INSERT INTO product_reviews 
        (product_id, user_name, user_email, rating, title, review_text, status) 
        VALUES (?, ?, ?, ?, ?, ?, 'approved')
    ");

    $stmt->execute([
        $productId,
        $userName,
        $userEmail,
        $rating,
        $title,
        $reviewText
    ]);

    $reviewId = $pdo->lastInsertId();

    // Update product average rating
    $stmt = $pdo->prepare("
        UPDATE products 
        SET rating = (
            SELECT AVG(rating) 
            FROM product_reviews 
            WHERE product_id = ? AND status = 'approved'
        )
        WHERE id = ?
    ");
    $stmt->execute([$productId, $productId]);

    echo json_encode([
        'success' => true,
        'message' => 'Review submitted successfully',
        'review_id' => $reviewId
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
