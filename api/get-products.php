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

    // Check if slug column exists
    $columns = $pdo->query("SHOW COLUMNS FROM products LIKE 'slug'")->fetchAll();
    if (empty($columns)) {
        // Add slug column
        $pdo->exec("ALTER TABLE products ADD COLUMN slug VARCHAR(255)");
        $pdo->exec("ALTER TABLE products ADD UNIQUE (slug)");
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

    // Check for single product fetch
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $product = $enrichProduct($product);
            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Product not found']);
        }
        exit;
    }

    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ?");
        $stmt->execute([$_GET['slug']]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $product = $enrichProduct($product);
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

    // Fetch total count of active products
    $countStmt = $pdo->query("SELECT COUNT(*) FROM products WHERE status = 'active'");
    $totalCount = $countStmt->fetchColumn();

    // Fetch products with limit and offset
    $stmt = $pdo->prepare("SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => (int) $totalCount,
        'page' => $page,
        'limit' => $limit,
        'total_pages' => ceil($totalCount / $limit)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
