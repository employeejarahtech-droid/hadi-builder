<?php
/**
 * Product Reviews API - Get reviews for a product
 */

error_reporting(0);
ob_start();

require_once __DIR__ . '/../includes/db.php';

if (ob_get_length())
    ob_clean();

header('Content-Type: application/json');

try {
    $pdo = getDBConnection();

    // Create reviews table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS product_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        review_text TEXT,
        helpful_count INT DEFAULT 0,
        verified_purchase BOOLEAN DEFAULT FALSE,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
    )");

    $productId = isset($_GET['product_id']) ? (int) $_GET['product_id'] : null;

    if (!$productId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Product ID required']);
        exit;
    }

    // Get pagination parameters
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    // Get sort parameter
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';
    $orderBy = 'created_at DESC';

    switch ($sort) {
        case 'highest':
            $orderBy = 'rating DESC, created_at DESC';
            break;
        case 'lowest':
            $orderBy = 'rating ASC, created_at DESC';
            break;
        case 'helpful':
            $orderBy = 'helpful_count DESC, created_at DESC';
            break;
        case 'newest':
        default:
            $orderBy = 'created_at DESC';
            break;
    }

    // Get total count
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM product_reviews WHERE product_id = ? AND status = 'approved'");
    $stmt->execute([$productId]);
    $totalCount = (int) $stmt->fetchColumn();

    // Get reviews
    $stmt = $pdo->prepare("
        SELECT id, user_name, rating, title, review_text, helpful_count, verified_purchase, created_at 
        FROM product_reviews 
        WHERE product_id = ? AND status = 'approved'
        ORDER BY $orderBy
        LIMIT ? OFFSET ?
    ");
    $stmt->execute([$productId, $limit, $offset]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get rating statistics
    $stmt = $pdo->prepare("
        SELECT 
            AVG(rating) as average_rating,
            COUNT(*) as total_reviews,
            SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
            SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
            SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
            SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
            SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
        FROM product_reviews 
        WHERE product_id = ? AND status = 'approved'
    ");
    $stmt->execute([$productId]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'reviews' => $reviews,
        'stats' => [
            'average_rating' => round((float) $stats['average_rating'], 1),
            'total_reviews' => (int) $stats['total_reviews'],
            'rating_breakdown' => [
                5 => (int) $stats['five_star'],
                4 => (int) $stats['four_star'],
                3 => (int) $stats['three_star'],
                2 => (int) $stats['two_star'],
                1 => (int) $stats['one_star']
            ]
        ],
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $totalCount,
            'total_pages' => ceil($totalCount / $limit)
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
