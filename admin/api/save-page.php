<?php
session_start();
// admin/api/save-page.php

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// DEBUG LOGGING
$logFile = __DIR__ . '/debug_save.log';
$logEntry = date('Y-m-d H:i:s') . " - Input: " . print_r($input, true) . "\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

$pageId = $input['id'] ?? null;
$type = $input['type'] ?? 'page';
$content = $input['content'] ?? null;

if (!$pageId || !isset($input['content'])) {
    file_put_contents($logFile, "Missing Data Error: ID=$pageId, Content Set=" . isset($input['content']) . "\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing data']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Determine table based on type
    $table = 'pages'; // default
    if ($type === 'post') {
        $table = 'posts';
    } elseif ($type === 'project') {
        $table = 'projects';
    } elseif ($type === 'header') {
        $table = 'headers';
    } elseif ($type === 'footer') {
        $table = 'footers';
    } elseif ($type === 'topbar') {
        $table = 'topbars';
    } elseif ($type === 'mobile_menu') {
        $table = 'mobile_menus';
    }

    // Validate table name for security
    if (!in_array($table, ['pages', 'posts', 'projects', 'headers', 'footers', 'topbars', 'mobile_menus'])) {
        $table = 'pages';
    }

    // Include CSS generator usage
    require_once __DIR__ . '/../../includes/css-generator.php';

    $cssData = $input['css_data'] ?? '';

    // Get old CSS file for cleanup
    $oldCssFile = null;
    $stmt = $pdo->prepare("SELECT css_file FROM $table WHERE id = ?");
    $stmt->execute([$pageId]);
    $row = $stmt->fetch();
    $oldCssFile = $row['css_file'] ?? null;

    // Convert content object/array to JSON string
    $contentJson = is_string($content) ? $content : json_encode($content);

    // Generate CSS file if CSS data provided
    $cssFilePath = null;
    if (!empty($cssData)) {
        file_put_contents($logFile, "Generating CSS for type=$type, id=$pageId, cssData length=" . strlen($cssData) . "\n", FILE_APPEND);
        $cssFilePath = generateCSSFile($type, $pageId, $cssData);
        file_put_contents($logFile, "CSS file generated: $cssFilePath\n", FILE_APPEND);
    } else {
        file_put_contents($logFile, "No CSS data provided\n", FILE_APPEND);
    }

    // Update database with content and CSS file path
    // If no new CSS generated, keep the old one (or clear it? If cssData is empty strict, clear it)
    // But typically we send full CSS. If empty, maybe no custom CSS.
    // Let's assume sending empty string means clear.

    if (empty($cssData) && $cssFilePath === null) {
        // Keep existing if not provided? No, builder sends empty if empty.
        // Actually builder sends empty string if no CSS.
    }

    file_put_contents($logFile, "Updating DB: content length=" . strlen($contentJson) . ", css_file=$cssFilePath\n", FILE_APPEND);
    $stmt = $pdo->prepare("UPDATE $table SET content = ?, css_file = ? WHERE id = ?");
    $result = $stmt->execute([$contentJson, $cssFilePath, $pageId]);

    if ($result) {
        // Cleanup old CSS file if it exists and is different
        if ($oldCssFile && $oldCssFile !== $cssFilePath) {
            deleteCSSFile($oldCssFile);
        }
        file_put_contents($logFile, "Save successful!\n", FILE_APPEND);
        echo json_encode(['success' => true, 'css_file' => $cssFilePath]);
    } else {
        file_put_contents($logFile, "Save failed!\n", FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
