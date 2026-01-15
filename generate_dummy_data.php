<?php
// generate_dummy_data.php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Starting dummy data generation...\n";

    // 1. Ensure Dummy Brands Exist
    $brandNames = ['TechGiant', 'SoftLife', 'FutureVision', 'RetroStyle', 'GreenEarth', 'SpeedMaster', 'AudioPhile', 'GamerGear'];
    $brandIds = [];

    foreach ($brandNames as $name) {
        // Check if exists
        $stmt = $pdo->prepare("SELECT id FROM brands WHERE name = ?");
        $stmt->execute([$name]);
        $id = $stmt->fetchColumn();

        if (!$id) {
            $slug = strtolower($name);
            // Brands does not have status column based on schema check
            $stmt = $pdo->prepare("INSERT INTO brands (name, slug, description) VALUES (?, ?, 'Auto-generated brand')");
            $stmt->execute([$name, $slug]);

            $id = $pdo->lastInsertId();
            echo "Created Brand: $name ($id)\n";
        }
        $brandIds[] = $id;
    }

    // 2. Ensure Dummy Categories Exist
    $categoryNames = ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Accessories', 'Tablets', 'Monitors', 'Gaming'];
    $categoryIds = [];

    foreach ($categoryNames as $name) {
        $stmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
        $stmt->execute([$name]);
        $id = $stmt->fetchColumn();

        if (!$id) {
            $slug = strtolower($name);
            // Schema: id, parent_id, name, slug, description, image, ..., status
            $stmt = $pdo->prepare("INSERT INTO categories (name, slug, description, status) VALUES (?, ?, 'Auto-generated category', 'active')");
            $stmt->execute([$name, $slug]);
            $id = $pdo->lastInsertId();
            echo "Created Category: $name ($id)\n";
        }
        $categoryIds[] = $id;
    }

    // 3. Generate 5000 Products
    $adjectives = ['Pro', 'Ultra', 'Max', 'Lite', 'Mini', 'Air', 'Elite', 'Prime', 'Plus', 'X', 'Super', 'Hyper', 'Mega', 'Nano', 'Giga'];
    $nouns = ['Phone', 'Book', 'Pad', 'Buds', 'Cam', 'Watch', 'Station', 'Hub', 'Drive', 'Screen', 'Drone', 'Bot', 'Pod', 'Tab', 'View'];

    $stmt = $pdo->prepare("INSERT INTO products (name, slug, sku, description, price, regular_price, stock_quantity, status, brand_id, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $pdo->beginTransaction(); // Start Transaction for speed

    $count = 0;
    $targetCount = 5000;

    for ($i = 0; $i < $targetCount; $i++) {
        $brandId = $brandIds[array_rand($brandIds)];
        $catId = $categoryIds[array_rand($categoryIds)];

        // Random Name
        $name = $brandNames[array_rand($brandNames)] . ' ' . $nouns[array_rand($nouns)] . ' ' . $adjectives[array_rand($adjectives)] . ' ' . rand(10, 99);
        $uniqueSuffix = uniqid();
        $slug = strtolower(str_replace(' ', '-', $name)) . '-' . $uniqueSuffix;
        $sku = 'SKU-' . strtoupper(substr(md5($uniqueSuffix), 0, 8));

        $price = rand(1000, 200000) / 100; // 10.00 to 2000.00
        $regular_price = $price * (1 + (rand(10, 50) / 100)); // +10% to +50%
        $stock = rand(0, 100);
        $status = 'active';

        // Category stored as JSON array of IDs
        $categoryJson = json_encode([$catId]);

        // Description
        $description = "This is a dummy product generated for testing purposes. It features high quality specs and comes with a warranty. Generated batch 5000.";

        // Image Placeholder
        $w = 400; // Fixed size for consistency
        $h = 400;
        $image_url = "https://placehold.co/{$w}x{$h}?text=" . urlencode($name);

        try {
            $stmt->execute([$name, $slug, $sku, $description, $price, $regular_price, $stock, $status, $brandId, $categoryJson, $image_url]);
            $count++;
            if ($count % 500 == 0)
                echo "Generated $count products...\n";
        } catch (Exception $e) {
            echo "Failed to insert product $name: " . $e->getMessage() . "\n";
        }
    }

    $pdo->commit(); // Commit all changes
    echo "Done! generated $count products.\n";

} catch (Exception $e) {
    echo "Fatal Error: " . $e->getMessage() . "\n";
}
