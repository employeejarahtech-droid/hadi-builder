<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Check count
$stmt = $pdo->query("SELECT status, COUNT(*) as count FROM products GROUP BY status");
$stats = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Product Statuses:\n";
foreach ($stats as $s) {
    echo "{$s['status']}: {$s['count']}\n";
}

// Fetch first page of API
$_GET['limit'] = 5;
ob_start();
include __DIR__ . '/api/get-products.php';
$apiOutput = ob_get_clean();
echo "\nAPI Output Preview (First 100 chars):\n";
echo substr($apiOutput, 0, 100) . "...\n";

$data = json_decode($apiOutput, true);
if ($data && isset($data['products'])) {
    echo "API returned " . count($data['products']) . " products.\n";
} else {
    echo "API Failed to return products.\nError: " . ($data['error'] ?? 'Unknown') . "\n";
}
