<?php
// Debug script to understand the routing
echo "=== Server Configuration Debug ===\n\n";

echo "SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME'] . "\n";
echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "\n";
echo "DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "PHP_SELF: " . $_SERVER['PHP_SELF'] . "\n";

$scriptName = $_SERVER['SCRIPT_NAME'];
$basePath = dirname($scriptName);

echo "\nCalculated basePath: " . $basePath . "\n";

// Test with different URIs
$testUris = [
    '/my-30',
    '/new-cms/my-30',
    '/admin/pages/',
];

echo "\n=== Route Extraction Tests ===\n";
foreach ($testUris as $testUri) {
    $route = str_replace($basePath, '', $testUri);
    $route = strtok($route, '?');
    $slug = trim($route, '/');
    echo "\nTest URI: $testUri\n";
    echo "  → Extracted slug: '$slug'\n";
}

// Check if port 4000 has special config
echo "\n=== Checking Database for Pages ===\n";
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("SELECT slug FROM pages WHERE status = 'published' LIMIT 3");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "  - " . $row['slug'] . "\n";
}
?>