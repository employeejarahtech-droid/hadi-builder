<?php
/**
 * IMPROVED AUTOMATED FIX SCRIPT
 * This will fix the category fetching using regex to handle whitespace
 */

$editFilePath = __DIR__ . '/edit.php';

if (!file_exists($editFilePath)) {
    die("Error: edit.php not found!");
}

// Read the file
$content = file_get_contents($editFilePath);

// Use regex to find and replace the complex code block
// This pattern matches from "// Build hierarchical array" to "$categories = flattenCategories($categoryTree);"
$pattern = '/\/\/ Build hierarchical array.*?\$categories = flattenCategories\(\$categoryTree\);/s';

$replacement = '// Simply add level indicator and add ALL categories
    foreach ($allCategories as $cat) {
        $cat[\'level\'] = empty($cat[\'parent_id\']) ? 0 : 1;
        $categories[] = $cat;
    }';

// Perform the replacement
$newContent = preg_replace($pattern, $replacement, $content);

// Check if replacement was made
if ($newContent === $content || $newContent === null) {
    echo "<h2>⚠️ Trying alternative method...</h2>";

    // Alternative: Just replace the flattenCategories call
    $pattern2 = '/\$categories = flattenCategories\(\$categoryTree\);/';
    $replacement2 = '// SIMPLIFIED: Just use all categories directly
    foreach ($allCategories as $cat) {
        $cat[\'level\'] = empty($cat[\'parent_id\']) ? 0 : 1;
        $categories[] = $cat;
    }';

    $newContent = preg_replace($pattern2, $replacement2, $content);

    if ($newContent === $content || $newContent === null) {
        echo "<p>Could not automatically fix. Please check the file manually.</p>";
        echo "<p><a href='edit.php?id=10'>Go to Product Edit Page</a></p>";
        exit;
    }
}

// Backup the original file
$backupPath = __DIR__ . '/edit.php.backup.' . date('YmdHis');
copy($editFilePath, $backupPath);

// Write the new content
file_put_contents($editFilePath, $newContent);

echo "<h2>✅ Success!</h2>";
echo "<p>Category fetching logic has been fixed!</p>";
echo "<p>Backup created: " . basename($backupPath) . "</p>";
echo "<hr>";
echo "<p><strong>Test it now:</strong></p>";
echo "<p><a href='edit.php?id=10' style='font-size: 18px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; display: inline-block;'>Go to Product Edit Page</a></p>";
echo "<p>You should now see BOTH categories in the dropdown!</p>";
?>