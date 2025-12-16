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
    
    // Process pages
    if (isset($input['pages']) && is_array($input['pages'])) {
        foreach ($input['pages'] as $pageData) {
            $pageId = $pageData['id'] ?? null;
            $content = $pageData['content'] ?? null;
            $type = $pageData['type'] ?? 'page';
            
            if (!$pageId || !isset($pageData['content'])) {
                $errors[] = "Missing data for page ID: {$pageId}";
                continue;
            }
            
            $table = ($type === 'post') ? 'posts' : 'pages';
            // Validate table name
            if (!in_array($table, ['pages', 'posts'])) {
                $table = 'pages';
            }
            
            // Convert content object/array to JSON string
            $contentJson = is_string($content) ? $content : json_encode($content);
            
            $stmt = $pdo->prepare("UPDATE $table SET content = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $pageId]);
            
            if ($result) {
                $results[] = [
                    'type' => $type,
                    'id' => $pageId,
                    'success' => true
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
            
            if (!$headerId || !isset($headerData['content'])) {
                $errors[] = "Missing data for header ID: {$headerId}";
                continue;
            }
            
            // Convert content object/array to JSON string
            $contentJson = is_string($content) ? $content : json_encode($content);
            
            $stmt = $pdo->prepare("UPDATE headers SET content = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $headerId]);
            
            if ($result) {
                $results[] = [
                    'type' => 'header',
                    'id' => $headerId,
                    'success' => true
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
            
            if (!$footerId || !isset($footerData['content'])) {
                $errors[] = "Missing data for footer ID: {$footerId}";
                continue;
            }
            
            // Convert content object/array to JSON string
            $contentJson = is_string($content) ? $content : json_encode($content);
            
            $stmt = $pdo->prepare("UPDATE footers SET content = ? WHERE id = ?");
            $result = $stmt->execute([$contentJson, $footerId]);
            
            if ($result) {
                $results[] = [
                    'type' => 'footer',
                    'id' => $footerId,
                    'success' => true
                ];
            } else {
                $errors[] = "Failed to update footer ID: {$footerId}";
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