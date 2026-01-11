<?php
// Test CSS generation manually
require_once __DIR__ . '/../includes/css-generator.php';

echo "Testing CSS file generation...\n\n";

// Test CSS content
$testCSS = "/* Test CSS */\n.test-class { color: red; }\n";

// Try to generate a test file
$result = generateCSSFile('test', 999, $testCSS);

if ($result) {
    echo "✓ CSS file generated successfully!\n";
    echo "  Path: $result\n";

    // Check if file exists
    $fullPath = __DIR__ . '/../' . $result;
    if (file_exists($fullPath)) {
        echo "✓ File exists on disk\n";
        echo "  Full path: $fullPath\n";
        echo "\nFile contents:\n";
        echo file_get_contents($fullPath);
    } else {
        echo "✗ File does NOT exist on disk!\n";
    }
} else {
    echo "✗ CSS file generation FAILED\n";
}

echo "\n\nChecking directory permissions...\n";
$dir = __DIR__ . '/../assets/css/generated';
echo "Directory: $dir\n";
echo "Exists: " . (is_dir($dir) ? 'YES' : 'NO') . "\n";
echo "Writable: " . (is_writable($dir) ? 'YES' : 'NO') . "\n";
