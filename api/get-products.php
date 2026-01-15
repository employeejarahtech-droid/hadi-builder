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

    // Create products table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    // Check and add missing columns
    $columns = $pdo->query("SHOW COLUMNS FROM products")->fetchAll(PDO::FETCH_ASSOC);
    $columnNames = array_column($columns, 'Field');

    if (!in_array('slug', $columnNames)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN slug VARCHAR(255)");
        $pdo->exec("ALTER TABLE products ADD UNIQUE (slug)");
    }

    if (!in_array('category_id', $columnNames)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN category_id INT DEFAULT NULL");
    }

    if (!in_array('rating', $columnNames)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0");
    }

    if (!in_array('original_price', $columnNames)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2) DEFAULT NULL");
    }

    // Backfill empty slugs (run this always to ensure integrity)
    $stmt = $pdo->query("SELECT id, name FROM products WHERE slug IS NULL OR slug = ''");
    $productsToUpdate = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($productsToUpdate)) {
        $updateStmt = $pdo->prepare("UPDATE products SET slug = ? WHERE id = ?");
        foreach ($productsToUpdate as $p) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $p['name'])));
            $slug = trim($slug, '-');
            $updateStmt->execute([$slug . '-' . $p['id'], $p['id']]);
        }
    }

    // Check if products exist
    $stmt = $pdo->query("SELECT COUNT(*) FROM products");
    $count = $stmt->fetchColumn();

    // Insert sample products if table is empty
    if ($count == 0) {
        $sampleProducts = [
            ['Wireless Headphones', 'wireless-headphones', 'High-quality wireless headphones with noise cancellation', 79.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
            ['Smart Watch', 'smart-watch', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
            ['Laptop Stand', 'laptop-stand', 'Ergonomic aluminum laptop stand', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
            ['Wireless Mouse', 'wireless-mouse', 'Ergonomic wireless mouse with precision tracking', 29.99, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'],
            ['USB-C Hub', 'usb-c-hub', 'Multi-port USB-C hub with HDMI and USB 3.0', 39.99, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'],
            ['Mechanical Keyboard', 'mechanical-keyboard', 'RGB mechanical gaming keyboard', 89.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'],
        ];

        $stmt = $pdo->prepare("INSERT INTO products (name, slug, description, price, image_url, status) VALUES (?, ?, ?, ?, ?, 'active')");

        foreach ($sampleProducts as $product) {
            $stmt->execute($product);
        }
    }

    // Helper to fetch similar products and variations
    $enrichProduct = function ($product) use ($pdo) {
        $product['similar_products_data'] = [];
        if (!empty($product['similar_products'])) {
            $ids = json_decode($product['similar_products'], true);
            if (is_array($ids) && count($ids) > 0) {
                $ids = array_filter($ids, 'is_numeric');
                if (count($ids) > 0) {
                    $placeholders = implode(',', array_fill(0, count($ids), '?'));
                    $stmt = $pdo->prepare("SELECT id, name, slug, price, image_url FROM products WHERE id IN ($placeholders) AND status = 'active'");
                    $stmt->execute(array_values($ids));
                    $product['similar_products_data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                }
            }
        }

        // Fetch variations if variable product
        $product['variations'] = [];
        if (($product['product_type'] ?? 'simple') === 'variable') {
            $stmt = $pdo->prepare("SELECT * FROM product_variations WHERE product_id = ?");
            $stmt->execute([$product['id']]);
            $variations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Decode attributes JSON
            foreach ($variations as &$var) {
                $var['attributes'] = json_decode($var['attributes'], true);
            }
            $product['variations'] = $variations;
        }

        return $product;
    };

    // Initialize Cache Manager
    require_once __DIR__ . '/../includes/CacheManager.php';
    $cache = new CacheManager();

    // Check for single product fetch
    if (isset($_GET['id'])) {
        // Try cache first
        $cacheKey = 'product:id:' . $_GET['id'];
        $cachedProduct = $cache->get($cacheKey);

        if ($cachedProduct !== null) {
            echo json_encode(['success' => true, 'product' => $cachedProduct, 'cached' => true]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $product = $enrichProduct($product);

            // Cache for 15 minutes
            $cache->set($cacheKey, $product, 900);

            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Product not found']);
        }
        exit;
    }

    if (isset($_GET['slug'])) {
        // Try cache first
        $cacheKey = 'product:slug:' . $_GET['slug'];
        $cachedProduct = $cache->get($cacheKey);

        if ($cachedProduct !== null) {
            echo json_encode(['success' => true, 'product' => $cachedProduct, 'cached' => true]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ?");
        $stmt->execute([$_GET['slug']]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $product = $enrichProduct($product);

            // Cache for 15 minutes
            $cache->set($cacheKey, $product, 900);

            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Product not found']);
        }
        exit;
    }


    // Get pagination parameters
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    // Get filter parameters
    $category = isset($_GET['category']) ? (int) $_GET['category'] : null;
    $minPrice = isset($_GET['min_price']) ? (float) $_GET['min_price'] : null;
    $maxPrice = isset($_GET['max_price']) ? (float) $_GET['max_price'] : null;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';

    // Generate cache key based on all parameters
    $cacheParams = compact('page', 'limit', 'category', 'minPrice', 'maxPrice', 'sort');
    $cacheKey = CacheManager::generateKey('products:list', $cacheParams);

    // Try cache first
    $cachedData = $cache->get($cacheKey);
    if ($cachedData !== null) {
        echo json_encode($cachedData);
        exit;
    }

    // Build WHERE clause
    $whereConditions = ["status = 'active'"];
    $params = [];

    if ($category) {
        $whereConditions[] = "(category_id = :cat_id OR (category_id LIKE '[%]' AND JSON_CONTAINS(category_id, :cat_json)))";
        $params[':cat_id'] = $category;
        $params[':cat_json'] = (string) $category;
    }

    if ($minPrice !== null) {
        $whereConditions[] = "price >= :min_price";
        $params[':min_price'] = $minPrice;
    }

    if ($maxPrice !== null) {
        $whereConditions[] = "price <= :max_price";
        $params[':max_price'] = $maxPrice;
    }

    $whereClause = implode(' AND ', $whereConditions);

    // Build ORDER BY clause
    $orderBy = 'created_at DESC'; // default
    switch ($sort) {
        case 'price_asc':
            $orderBy = 'price ASC';
            break;
        case 'price_desc':
            $orderBy = 'price DESC';
            break;
        case 'rating':
            $orderBy = 'rating DESC, created_at DESC';
            break;
        case 'newest':
            $orderBy = 'created_at DESC';
            break;
    }

    // Fetch total count with filters
    $countSql = "SELECT COUNT(*) FROM products WHERE $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalCount = $countStmt->fetchColumn();

    // Fetch products with filters, sorting, limit and offset
    $sql = "SELECT * FROM products WHERE $whereClause ORDER BY $orderBy LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);

    // Bind filter parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    // Bind pagination parameters
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'success' => true,
        'products' => $products,
        'count' => (int) $totalCount,
        'page' => $page,
        'limit' => $limit,
        'total_pages' => ceil($totalCount / $limit),
        'filters' => [
            'category' => $category,
            'min_price' => $minPrice,
            'max_price' => $maxPrice,
            'sort' => $sort
        ]
    ];

    // Cache the response for 5 minutes
    $cache->set($cacheKey, $response, 300);

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
