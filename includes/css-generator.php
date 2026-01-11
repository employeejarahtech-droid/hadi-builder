<?php
/**
 * CSS File Generator Utility
 * Generates and manages CSS files for pages, headers, footers, etc.
 */

/**
 * Generate a CSS file from CSS content
 * @param string $type - Type of content (page, post, header, footer, topbar)
 * @param int $id - Content ID
 * @param string $cssContent - CSS content to write
 * @return string|null - Relative path to CSS file or null on failure
 */
function generateCSSFile($type, $id, $cssContent)
{
    // Base directory for generated CSS
    $baseDir = __DIR__ . '/../assets/css';
    $generatedDir = $baseDir . '/generated';

    // Create directories if they don't exist
    if (!is_dir($baseDir)) {
        mkdir($baseDir, 0755, true);
    }
    if (!is_dir($generatedDir)) {
        mkdir($generatedDir, 0755, true);
    }

    // Validate inputs
    if (empty($cssContent) || empty($type) || !is_numeric($id)) {
        return null;
    }

    // Generate simple filename: header-1.css, page-5.css, etc.
    $filename = "{$type}-{$id}.css";
    $filepath = "{$generatedDir}/{$filename}";

    // Add header comment to CSS file
    $cssWithHeader = "/* Generated CSS for {$type} #{$id} */\n";
    $cssWithHeader .= "/* Generated: " . date('Y-m-d H:i:s') . " */\n\n";
    $cssWithHeader .= $cssContent;

    // Write CSS file (will overwrite if exists)
    $result = file_put_contents($filepath, $cssWithHeader);

    if ($result === false) {
        error_log("Failed to write CSS file: {$filepath}");
        return null;
    }

    // Return relative path from web root
    return "assets/css/generated/{$filename}";
}

/**
 * Delete a CSS file
 * @param string $cssFilePath - Relative path to CSS file
 * @return bool - True if deleted or doesn't exist, false on error
 */
function deleteCSSFile($cssFilePath)
{
    if (empty($cssFilePath)) {
        return true; // Nothing to delete
    }

    $fullPath = __DIR__ . '/../' . $cssFilePath;

    if (!file_exists($fullPath)) {
        return true; // Already deleted
    }

    $result = unlink($fullPath);

    if (!$result) {
        error_log("Failed to delete CSS file: {$fullPath}");
    }

    return $result;
}

/**
 * Clean up old CSS files for a specific content item
 * Note: With simple filenames (header-1.css), old files are automatically overwritten
 * This function is kept for compatibility but does nothing
 * @param string $type - Type of content
 * @param int $id - Content ID
 * @param string $currentCssFile - Current CSS file to keep
 */
function cleanupOldCSSFiles($type, $id, $currentCssFile = null)
{
    // No cleanup needed - files are overwritten with same name
    return;
}

/**
 * Clean up orphaned CSS files (files for deleted content)
 * @param PDO $pdo - Database connection
 */
function cleanupOrphanedCSSFiles($pdo)
{
    $generatedDir = __DIR__ . '/../assets/css/generated';

    if (!is_dir($generatedDir)) {
        return;
    }

    $files = glob($generatedDir . '/*.css');
    $deletedCount = 0;

    foreach ($files as $file) {
        $filename = basename($file);

        // Parse filename: type-id-hash.css
        if (preg_match('/^(page|post|header|footer|topbar)-(\d+)-[a-f0-9]+\.css$/', $filename, $matches)) {
            $type = $matches[1];
            $id = $matches[2];

            // Determine table name
            $table = ($type === 'page') ? 'pages' : $type . 's';

            // Check if content still exists
            $stmt = $pdo->prepare("SELECT id FROM {$table} WHERE id = ?");
            $stmt->execute([$id]);

            if (!$stmt->fetch()) {
                // Content doesn't exist, delete the CSS file
                unlink($file);
                $deletedCount++;
            }
        }
    }

    return $deletedCount;
}
