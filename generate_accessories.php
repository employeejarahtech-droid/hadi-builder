<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Starting Accessories generation...\n";

    $categoryId = 7; // Accessories
    $brandNames = ['TechGiant', 'SoftLife', 'FutureVision', 'RetroStyle', 'GreenEarth', 'SpeedMaster', 'AudioPhile', 'GamerGear'];

    // Fetch brand IDs
    $brandIds = [];
    foreach ($brandNames as $name) {
        $stmt = $pdo->prepare("SELECT id FROM brands WHERE name = ?");
        $stmt->execute([$name]);
        $id = $stmt->fetchColumn();
        if ($id)
            $brandIds[] = $id;
    }

    if (empty($brandIds)) {
        die("No brands found. Please run main generator first.\n");
    }

    $adjectives = ['Pro', 'Ultra', 'Max', 'Lite', 'Mini', 'Air', 'Elite', 'Prime', 'Plus', 'X', 'Neon', 'Stealth'];
    $nouns = ['Case', 'Cover', 'Charger', 'Cable', 'Stand', 'Mount', 'Protector', 'Strap', 'Bag', 'Dongle', 'Cleaner', 'Hub'];

    $stmt = $pdo->prepare("INSERT INTO products (name, slug, sku, description, price, regular_price, stock_quantity, status, brand_id, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $pdo->beginTransaction();

    $count = 0;
    $targetCount = 200;

    for ($i = 0; $i < $targetCount; $i++) {
        $brandId = $brandIds[array_rand($brandIds)];

        // Random Name
        $name = $brandNames[array_rand($brandNames)] . ' ' . $nouns[array_rand($nouns)] . ' ' . $adjectives[array_rand($adjectives)] . ' ' . rand(100, 999);
        $uniqueSuffix = uniqid();
        $slug = strtolower(str_replace(' ', '-', $name)) . '-' . $uniqueSuffix;
        $sku = 'ACC-' . strtoupper(substr(md5($uniqueSuffix), 0, 8));

        $price = rand(500, 5000) / 100; // 5.00 to 50.00
        $regular_price = $price * (1 + (rand(10, 50) / 100)); // +10% to +50%
        $stock = rand(0, 100);
        $status = 'active';

        // Category stored as JSON array of IDs
        $categoryJson = json_encode([$categoryId]);

        // Description
        $description = "High quality accessory for your devices. Durable and stylish. Generated batch Accessories.";

        // Image Placeholder
        $w = 400;
        $h = 400;
        $image_url = "https://placehold.co/{$w}x{$h}?text=" . urlencode($name);

        try {
            $stmt->execute([$name, $slug, $sku, $description, $price, $regular_price, $stock, $status, $brandId, $categoryJson, $image_url]);
            $count++;
            if ($count % 50 == 0)
                echo "Generated $count accessories...\n";
        } catch (Exception $e) {
            echo "Failed to insert product $name: " . $e->getMessage() . "\n";
        }
    }

    $pdo->commit();
    echo "Done! Generated $count accessories.\n";

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Fatal Error: " . $e->getMessage() . "\n";
}
