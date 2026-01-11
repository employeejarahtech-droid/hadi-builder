<?php
session_start();
// admin/api/save-all.php

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$results = [];
$errors = [];

try {
    $pdo = getDBConnection();

    // Include CSS generator utility
    require_once __DIR__ . '/../../includes/css-generator.php';

    // Process pages
    if (isset($input['pages']) && is_array($input['pages'])) {
        foreach ($input['pages'] as $pageData) {
            $pageId = $pageData['id'] ?? null;
            $content = $pageData['content'] ?? null;
            $type = $pageData['type'] ?? 'page';
            $cssData = $pageData['css_data'] ?? '';

            if (!$pageId || !isset($pageData['content'])) {
                $errors[] = "Missing data for page ID: {$pageId}";
                continue;
            }

            $table = ($type === 'post') ? 'posts' : (($type === 'project') ? 'projects' : 'pages');
            // Validate table name
            if (!in_array($table, ['pages', 'posts', 'projects'])) {
                $table = 'pages';
            }

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
                $cssFilePath = generateCSSFile($type, $pageId, $cssData);
            }

            // Update database with content and CSS file path
            $stmt = $pdo->prepare("UPDATE $table SET content = ?, css_file = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $cssFilePath, $pageId]);

            if ($result) {
                // Cleanup old CSS file if it exists and is different
                if ($oldCssFile && $oldCssFile !== $cssFilePath) {
                    deleteCSSFile($oldCssFile);
                }

                $results[] = [
                    'type' => $type,
                    'id' => $pageId,
                    'success' => true,
                    'css_file' => $cssFilePath
                ];
            } else {
                $errors[] = "Failed to update {$type} ID: {$pageId}";
            }
        }
    }

    // Process headers
    if (isset($input['headers']) && is_array($input['headers'])) {
        foreach ($input['headers'] as $headerData) {
            $headerId = $headerData['id'] ?? null;
            $content = $headerData['content'] ?? null;
            $cssData = $headerData['css_data'] ?? '';

            if (!$headerId || !isset($headerData['content'])) {
                $errors[] = "Missing data for header ID: {$headerId}";
                continue;
            }

            // Get old CSS file for cleanup
            $stmt = $pdo->prepare("SELECT css_file FROM headers WHERE id = ?");
            $stmt->execute([$headerId]);
            $row = $stmt->fetch();
            $oldCssFile = $row['css_file'] ?? null;

            // Convert content object/array to JSON string
            $contentJson = is_string($content) ? $content : json_encode($content);

            // Generate CSS file if CSS data provided
            $cssFilePath = null;
            if (!empty($cssData)) {
                $cssFilePath = generateCSSFile('header', $headerId, $cssData);
            }

            $stmt = $pdo->prepare("UPDATE headers SET content = ?, css_file = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $cssFilePath, $headerId]);

            if ($result) {
                if ($oldCssFile && $oldCssFile !== $cssFilePath) {
                    deleteCSSFile($oldCssFile);
                }

                $results[] = [
                    'type' => 'header',
                    'id' => $headerId,
                    'success' => true,
                    'css_file' => $cssFilePath
                ];
            } else {
                $errors[] = "Failed to update header ID: {$headerId}";
            }
        }
    }

    // Process footers
    if (isset($input['footers']) && is_array($input['footers'])) {
        foreach ($input['footers'] as $footerData) {
            $footerId = $footerData['id'] ?? null;
            $content = $footerData['content'] ?? null;
            $cssData = $footerData['css_data'] ?? '';

            if (!$footerId || !isset($footerData['content'])) {
                $errors[] = "Missing data for footer ID: {$footerId}";
                continue;
            }

            // Get old CSS file for cleanup
            $stmt = $pdo->prepare("SELECT css_file FROM footers WHERE id = ?");
            $stmt->execute([$footerId]);
            $row = $stmt->fetch();
            $oldCssFile = $row['css_file'] ?? null;

            // Convert content object/array to JSON string
            $contentJson = is_string($content) ? $content : json_encode($content);

            // Generate CSS file if CSS data provided
            $cssFilePath = null;
            if (!empty($cssData)) {
                $cssFilePath = generateCSSFile('footer', $footerId, $cssData);
            }

            $stmt = $pdo->prepare("UPDATE footers SET content = ?, css_file = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $cssFilePath, $footerId]);

            if ($result) {
                if ($oldCssFile && $oldCssFile !== $cssFilePath) {
                    deleteCSSFile($oldCssFile);
                }

                $results[] = [
                    'type' => 'footer',
                    'id' => $footerId,
                    'success' => true,
                    'css_file' => $cssFilePath
                ];
            } else {
                $errors[] = "Failed to update footer ID: {$footerId}";
            }
        }
    }

    // Process topbars
    if (isset($input['topbars']) && is_array($input['topbars'])) {
        foreach ($input['topbars'] as $topbarData) {
            $topbarId = $topbarData['id'] ?? null;
            $content = $topbarData['content'] ?? null;
            $cssData = $topbarData['css_data'] ?? '';

            if (!$topbarId || !isset($topbarData['content'])) {
                $errors[] = "Missing data for topbar ID: {$topbarId}";
                continue;
            }

            // Get old CSS file for cleanup
            $stmt = $pdo->prepare("SELECT css_file FROM topbars WHERE id = ?");
            $stmt->execute([$topbarId]);
            $row = $stmt->fetch();
            $oldCssFile = $row['css_file'] ?? null;

            // Convert content object/array to JSON string
            $contentJson = is_string($content) ? $content : json_encode($content);

            // Generate CSS file if CSS data provided
            $cssFilePath = null;
            if (!empty($cssData)) {
                $cssFilePath = generateCSSFile('topbar', $topbarId, $cssData);
            }

            $stmt = $pdo->prepare("UPDATE topbars SET content = ?, css_file = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $cssFilePath, $topbarId]);

            if ($result) {
                if ($oldCssFile && $oldCssFile !== $cssFilePath) {
                    deleteCSSFile($oldCssFile);
                }

                $results[] = [
                    'type' => 'topbar',
                    'id' => $topbarId,
                    'success' => true,
                    'css_file' => $cssFilePath
                ];
            } else {
                $errors[] = "Failed to update topbar ID: {$topbarId}";
            }
        }
    }

    // Process mobile menus
    if (isset($input['mobile_menus']) && is_array($input['mobile_menus'])) {
        foreach ($input['mobile_menus'] as $menuData) {
            $menuId = $menuData['id'] ?? null;
            $content = $menuData['content'] ?? null;
            $cssData = $menuData['css_data'] ?? '';

            if (!$menuId || !isset($menuData['content'])) {
                $errors[] = "Missing data for mobile menu ID: {$menuId}";
                continue;
            }

            // Get old CSS file for cleanup
            $stmt = $pdo->prepare("SELECT css_file FROM mobile_menus WHERE id = ?");
            $stmt->execute([$menuId]);
            $row = $stmt->fetch();
            $oldCssFile = $row['css_file'] ?? null;

            // Convert content object/array to JSON string
            $contentJson = is_string($content) ? $content : json_encode($content);

            // Generate CSS file if CSS data provided
            $cssFilePath = null;
            if (!empty($cssData)) {
                $cssFilePath = generateCSSFile('mobile_menu', $menuId, $cssData);
            }

            $stmt = $pdo->prepare("UPDATE mobile_menus SET content = ?, css_file = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $cssFilePath, $menuId]);

            if ($result) {
                if ($oldCssFile && $oldCssFile !== $cssFilePath) {
                    deleteCSSFile($oldCssFile);
                }

                $results[] = [
                    'type' => 'mobile_menu',
                    'id' => $menuId,
                    'success' => true,
                    'css_file' => $cssFilePath
                ];
            } else {
                $errors[] = "Failed to update mobile menu ID: {$menuId}";
            }
        }
    }

    // Return response
    $hasErrors = !empty($errors);
    $hasSuccess = !empty($results);

    if ($hasErrors && !$hasSuccess) {
        // All operations failed
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'All save operations failed',
            'errors' => $errors
        ]);
    } elseif ($hasErrors && $hasSuccess) {
        // Partial success
        http_response_code(207); // Multi-Status
        echo json_encode([
            'success' => true,
            'message' => 'Some items saved successfully, others failed',
            'results' => $results,
            'errors' => $errors
        ]);
    } else {
        // All operations succeeded
        echo json_encode([
            'success' => true,
            'message' => 'All items saved successfully',
            'results' => $results
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}