<?php
// Ensure no output before this point
error_reporting(0); // Suppress warnings that break JSON
ob_start(); // Buffer output

require_once __DIR__ . '/../includes/db.php';

// Clean buffer before sending JSON headers
if (ob_get_length())
    ob_clean();

header('Content-Type: application/json');

try {
    $pdo = getDBConnection();

    // Create categories table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        parent_id INT DEFAULT NULL,
        description TEXT,
        image_url VARCHAR(500),
        display_order INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    // Check and add missing columns if table already exists
    $columns = $pdo->query("SHOW COLUMNS FROM categories")->fetchAll(PDO::FETCH_ASSOC);
    $columnNames = array_column($columns, 'Field');

    if (!in_array('status', $columnNames)) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active'");
    }

    if (!in_array('display_order', $columnNames)) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN display_order INT DEFAULT 0");
    }

    if (!in_array('image_url', $columnNames)) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN image_url VARCHAR(500)");
    }

    if (!in_array('description', $columnNames)) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN description TEXT");
    }

    // Check if categories exist
    $stmt = $pdo->query("SELECT COUNT(*) FROM categories");
    $count = $stmt->fetchColumn();

    // Insert sample categories if table is empty
    if ($count == 0) {
        $sampleCategories = [
            // Parent categories
            ['Electronics', 'electronics', null, 'Electronic devices and accessories', '', 1],
            ['Clothing', 'clothing', null, 'Fashion and apparel', '', 2],
            ['Home & Garden', 'home-garden', null, 'Home improvement and garden supplies', '', 3],
            ['Sports', 'sports', null, 'Sports equipment and accessories', '', 4],
        ];

        $stmt = $pdo->prepare("INSERT INTO categories (name, slug, parent_id, description, image_url, display_order, status) VALUES (?, ?, ?, ?, ?, ?, 'active')");

        foreach ($sampleCategories as $category) {
            $stmt->execute($category);
        }

        // Add subcategories
        $electronicsId = $pdo->lastInsertId() - 3; // Get first inserted ID
        $subcategories = [
            ['Computers', 'computers', $electronicsId, 'Laptops, desktops, and accessories', '', 1],
            ['Mobile Phones', 'mobile-phones', $electronicsId, 'Smartphones and tablets', '', 2],
            ['Audio', 'audio', $electronicsId, 'Headphones, speakers, and audio equipment', '', 3],
        ];

        foreach ($subcategories as $subcategory) {
            $stmt->execute($subcategory);
        }
    }

    // Build hierarchical category structure
    $stmt = $pdo->query("SELECT * FROM categories WHERE status = 'active' ORDER BY display_order ASC, name ASC");
    $allCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Initialize Cache Manager
    require_once __DIR__ . '/../includes/CacheManager.php';
    $cache = new CacheManager();

    // Try cache first
    $cacheKey = 'categories:tree';
    $cachedData = $cache->get($cacheKey);

    if ($cachedData !== null) {
        echo json_encode($cachedData);
        exit;
    }

    // Organize into parent-child structure
    $categoriesTree = [];
    $categoriesById = [];

    // First pass: index by ID
    foreach ($allCategories as $category) {
        $category['subcategories'] = [];
        $categoriesById[$category['id']] = $category;
    }

    // Second pass: build tree and add product counts
    foreach ($categoriesById as $id => $category) {
        // Count products for this category
        // Handle both single category_id and JSON array format
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM products 
            WHERE status = 'active' 
            AND (
                category_id = :cat_id 
                OR category_id LIKE :cat_json_start
                OR category_id LIKE :cat_json_mid
                OR category_id LIKE :cat_json_end
            )
        ");
        $stmt->execute([
            ':cat_id' => $id,
            ':cat_json_start' => '[' . $id . ',%',
            ':cat_json_mid' => '%,' . $id . ',%',
            ':cat_json_end' => '%,' . $id . ']'
        ]);
        $categoriesById[$id]['product_count'] = (int) $stmt->fetchColumn();

        if ($category['parent_id'] === null) {
            // Root category
            $categoriesTree[] = &$categoriesById[$id];
        } else {
            // Child category
            if (isset($categoriesById[$category['parent_id']])) {
                $categoriesById[$category['parent_id']]['subcategories'][] = &$categoriesById[$id];
            }
        }
    }

    // Get total product count
    $stmt = $pdo->query("SELECT COUNT(*) FROM products WHERE status = 'active'");
    $totalCount = (int) $stmt->fetchColumn();

    $response = [
        'success' => true,
        'categories' => $categoriesTree,
        'all_categories' => $allCategories,
        'count' => count($allCategories),
        'total_count' => $totalCount
    ];

    // Cache for default TTL
    $cache->set($cacheKey, $response);

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
