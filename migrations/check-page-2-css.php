<?php
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    echo "=== Checking Page 2 CSS Generation ===\n\n";

    // Check page 2 data
    $stmt = $pdo->query("SELECT id, title, css_file FROM pages WHERE id = 2");
    $page = $stmt->fetch();

    if ($page) {
        echo "Page ID 2:\n";
        echo "  Title: {$page['title']}\n";
        echo "  CSS File: " . ($page['css_file'] ?? 'NULL') . "\n\n";

        if ($page['css_file']) {
            $fullPath = __DIR__ . '/../' . $page['css_file'];
            echo "  Full path: $fullPath\n";
            echo "  File exists: " . (file_exists($fullPath) ? 'YES ✓' : 'NO ✗') . "\n";

            if (file_exists($fullPath)) {
                echo "\n  File contents:\n";
                echo "  " . str_repeat('-', 50) . "\n";
                echo file_get_contents($fullPath);
                echo "\n  " . str_repeat('-', 50) . "\n";
            }
        } else {
            echo "  ❌ CSS file path is NULL!\n";
            echo "  This means either:\n";
            echo "    1. Page has no widgets with 'selectors' property\n";
            echo "    2. Save didn't generate CSS\n";
            echo "    3. Save didn't update database\n";
        }
    } else {
        echo "❌ No page with ID 2 found\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
