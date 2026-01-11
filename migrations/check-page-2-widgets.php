<?php
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    echo "=== Checking Page 2 Content ===\n\n";

    // Get page content
    $stmt = $pdo->query("SELECT id, title, content FROM pages WHERE id = 2");
    $page = $stmt->fetch();

    if ($page) {
        echo "Page: {$page['title']}\n\n";

        $content = json_decode($page['content'], true);

        if ($content && is_array($content)) {
            echo "Widgets on this page:\n";
            foreach ($content as $index => $widget) {
                $type = $widget['type'] ?? 'unknown';
                $id = $widget['id'] ?? 'no-id';
                echo "  " . ($index + 1) . ". {$type} (ID: {$id})\n";
            }

            echo "\n✅ Page has " . count($content) . " widget(s)\n";
            echo "\nNote: CSS is only generated for widgets that have 'selectors' property.\n";
            echo "Most widgets (slideshow, faq, etc.) don't have selectors - they use theme CSS.\n";
            echo "Only widgets like header-section with dynamic controls (menu_gap) have selectors.\n";
        } else {
            echo "❌ Page content is empty or invalid JSON\n";
        }
    } else {
        echo "❌ Page 2 not found\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
