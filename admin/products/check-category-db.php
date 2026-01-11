<?php
/**
 * DATABASE CHECK - Verify Category Saving
 * Run this: http://localhost:4000/admin/products/check-category-db.php
 */

require_once __DIR__ . '/../../includes/db.php';

$productId = $_GET['id'] ?? 10;

try {
    $pdo = getDBConnection();

    // Fetch the product
    $stmt = $pdo->prepare("SELECT id, name, category_id FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();

    echo "<h2>Database Check for Product ID: {$productId}</h2>";

    if ($product) {
        echo "<div style='background:#f0f0f0;padding:20px;margin:20px;border:2px solid #333;'>";
        echo "<h3>Product: " . htmlspecialchars($product['name']) . "</h3>";
        echo "<p><strong>category_id value in database:</strong></p>";
        echo "<pre>" . htmlspecialchars($product['category_id'] ?? 'NULL') . "</pre>";

        echo "<p><strong>Data type:</strong> " . gettype($product['category_id']) . "</p>";

        echo "<p><strong>JSON decode test:</strong></p>";
        $decoded = json_decode($product['category_id'], true);
        echo "<pre>";
        print_r($decoded);
        echo "</pre>";

        if (is_array($decoded)) {
            echo "<p style='color:green;'><strong>✓ Successfully decoded as array with " . count($decoded) . " items</strong></p>";
        } else {
            echo "<p style='color:red;'><strong>✗ Not a valid JSON array</strong></p>";
        }

        echo "</div>";

        echo "<p><a href='edit.php?id={$productId}'>Go to Edit Page</a></p>";
    } else {
        echo "<p style='color:red;'>Product not found!</p>";
    }

} catch (Exception $e) {
    echo "<p style='color:red;'>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>