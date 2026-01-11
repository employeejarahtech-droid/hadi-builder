<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

echo "✅ Testing URL routing after fix...\n\n";

// Simulate the routing logic
$testCases = [
    ['uri' => '/my-30', 'scriptName' => '/index.php'],
    ['uri' => '/checkout', 'scriptName' => '/index.php'],
    ['uri' => '/your-name', 'scriptName' => '/index.php'],
];

foreach ($testCases as $test) {
    $requestUri = $test['uri'];
    $scriptName = $test['scriptName'];
    $basePath = dirname($scriptName);

    // Apply the fix
    if ($basePath === '.' || $basePath === '/' || $basePath === '\\') {
        $basePath = '';
    }

    $route = str_replace($basePath, '', $requestUri);
    $route = strtok($route, '?');
    $slug = trim($route, '/');

    echo "URL: http://localhost:4000{$requestUri}\n";
    echo "  → Slug: '$slug'\n";

    // Check if page exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ? AND status = 'published'");
    $stmt->execute([$slug]);
    $exists = $stmt->fetchColumn() > 0;
    echo "  → Page exists: " . ($exists ? "YES ✓" : "NO ✗") . "\n\n";
}

echo "All pages should now be accessible at:\n";
echo "  http://localhost:4000/{slug}\n";
?>