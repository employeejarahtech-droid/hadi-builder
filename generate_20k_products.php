<?php
/**
 * Generate 30,000 dummy products with various categories
 * Run this script to populate the database with more products
 */

set_time_limit(0); // No time limit
ini_set('memory_limit', '512M'); // Increase memory limit

require_once __DIR__ . '/includes/db.php';

echo "Starting to generate 30,000 products...\n";
echo str_repeat("=", 50) . "\n";

try {
    $pdo = getDBConnection();

    // Product name templates
    $adjectives = [
        'Premium',
        'Professional',
        'Advanced',
        'Ultra',
        'Pro',
        'Elite',
        'Smart',
        'Digital',
        'Wireless',
        'Portable',
        'Compact',
        'Ergonomic',
        'High-Performance',
        'Next-Gen',
        'Revolutionary',
        'Innovative',
        'Sleek',
        'Modern',
        'Classic',
        'Deluxe',
        'Supreme',
        'Ultimate',
        'Enhanced',
        'Optimized',
        'Powerful',
        'Efficient',
        'Reliable',
        'Durable',
        'Lightweight',
        'Heavy-Duty',
        'Precision',
        'Versatile',
        'Multi-Purpose',
        'All-in-One'
    ];

    $productTypes = [
        'Watch',
        'Phone',
        'Tablet',
        'Laptop',
        'Monitor',
        'Keyboard',
        'Mouse',
        'Headphones',
        'Speaker',
        'Camera',
        'Microphone',
        'Router',
        'Hub',
        'Adapter',
        'Cable',
        'Charger',
        'Case',
        'Stand',
        'Dock',
        'Drive',
        'Card',
        'Battery',
        'Controller',
        'Webcam',
        'Printer',
        'Scanner',
        'Projector',
        'Display',
        'Sensor',
        'Tracker',
        'Band',
        'Earbuds',
        'Soundbar',
        'Amplifier',
        'Mixer',
        'Interface',
        'Converter',
        'Splitter',
        'Switch'
    ];

    $brands = [
        'TechPro',
        'DigiMax',
        'SmartWave',
        'ProGear',
        'EliteCore',
        'NexGen',
        'UltraSync',
        'PowerHub',
        'SwiftTech',
        'PrecisionX',
        'InnoVate',
        'MaxCore',
        'PrimeTech',
        'ZenithPro',
        'ApexGear',
        'VelocityX',
        'QuantumTech',
        'FusionPro',
        'OptimalX',
        'DynamicCore'
    ];

    $models = [
        'X1',
        'X2',
        'X3',
        'Pro',
        'Plus',
        'Max',
        'Ultra',
        'Elite',
        'Prime',
        'Ace',
        'V1',
        'V2',
        'V3',
        'S1',
        'S2',
        'S3',
        'M1',
        'M2',
        'M3',
        'Z1',
        'Z2',
        'Z3'
    ];

    // Get all categories
    $stmt = $pdo->query("SELECT id FROM categories WHERE status = 'active'");
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($categories)) {
        echo "No categories found! Please create categories first.\n";
        exit;
    }

    echo "Found " . count($categories) . " categories\n";
    echo "Generating products...\n\n";

    // Prepare insert statement
    $insertStmt = $pdo->prepare("
        INSERT INTO products 
        (name, slug, description, long_description, price, regular_price, sku, model_number, 
         stock_quantity, image_url, status, category_id, rating, created_at) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, NOW())
    ");

    $batchSize = 1000;
    $totalProducts = 30000;
    $created = 0;

    // Start transaction for better performance
    $pdo->beginTransaction();

    for ($i = 1; $i <= $totalProducts; $i++) {
        // Generate product data
        $adjective = $adjectives[array_rand($adjectives)];
        $type = $productTypes[array_rand($productTypes)];
        $brand = $brands[array_rand($brands)];
        $model = $models[array_rand($models)];

        $name = "$adjective $type $brand $model";
        $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $name)) . '-' . $i;

        $description = "High-quality $type with advanced features and premium build quality.";

        $longDescription = "<h3>Product Features</h3>
<ul>
<li>Premium quality construction</li>
<li>Advanced technology integration</li>
<li>Ergonomic and user-friendly design</li>
<li>Energy efficient operation</li>
<li>Durable and long-lasting</li>
</ul>
<h3>Specifications</h3>
<ul>
<li>Brand: $brand</li>
<li>Model: $model</li>
<li>Type: $type</li>
<li>Warranty: 1 Year</li>
</ul>";

        // Random price between $10 and $2000
        $price = round(rand(1000, 200000) / 100, 2);
        $regularPrice = $price + round(rand(500, 5000) / 100, 2);

        // SKU
        $sku = strtoupper(substr($brand, 0, 3)) . '-' . strtoupper(substr($type, 0, 3)) . '-' . str_pad($i, 6, '0', STR_PAD_LEFT);

        // Model number
        $modelNumber = $brand . ' ' . $model;

        // Stock quantity
        $stockQuantity = rand(0, 500);

        // Random image from Unsplash
        $imageCategories = ['technology', 'electronics', 'gadgets', 'devices'];
        $imageCategory = $imageCategories[array_rand($imageCategories)];
        $imageUrl = "https://source.unsplash.com/400x400/?$imageCategory&sig=$i";

        // Random category (can be single or multiple)
        $numCategories = rand(1, 3);
        $selectedCategories = array_rand(array_flip($categories), min($numCategories, count($categories)));
        if (!is_array($selectedCategories)) {
            $selectedCategories = [$selectedCategories];
        }
        $categoryId = count($selectedCategories) > 1 ? json_encode($selectedCategories) : $selectedCategories[0];

        // Random rating
        $rating = round(rand(30, 50) / 10, 1);

        // Insert product
        $insertStmt->execute([
            $name,
            $slug,
            $description,
            $longDescription,
            $price,
            $regularPrice,
            $sku,
            $modelNumber,
            $stockQuantity,
            $imageUrl,
            $categoryId,
            $rating
        ]);

        $created++;

        // Commit in batches for better performance
        if ($i % $batchSize === 0) {
            $pdo->commit();
            $pdo->beginTransaction();

            $percentage = round(($i / $totalProducts) * 100, 1);
            echo "Progress: $i / $totalProducts ($percentage%) - Last: $name\n";

            // Small delay to prevent overwhelming the server
            usleep(10000); // 10ms
        }
    }

    // Commit remaining products
    $pdo->commit();

    echo "\n" . str_repeat("=", 50) . "\n";
    echo "✓ Successfully created $created products!\n";
    echo "✓ Products distributed across " . count($categories) . " categories\n";
    echo "✓ Price range: $10 - $2000\n";
    echo "✓ Stock quantities: 0 - 500\n";
    echo "\n";
    echo "You can now visit your shop page to see the products!\n";

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Created $created products before error occurred.\n";
}
