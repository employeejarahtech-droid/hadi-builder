<?php
// api/get-posts.php - Fetch blog posts

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    // Check if fetching single post by ID or Slug
    if (isset($_GET['id']) || isset($_GET['slug'])) {
        $sql = "SELECT * FROM posts WHERE status = 'published'";
        $params = [];

        if (isset($_GET['slug'])) {
            $sql .= " AND slug = ?";
            $params[] = $_GET['slug'];
        } else {
            $sql .= " AND id = ?";
            $params[] = $_GET['id'];
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($post) {
            // Parse content usually stored as JSON for page builder
            // But if we want to show excerpt/content in grid, we might need to handle it.
            // For single post, we return raw content string (JSON) or processed?
            // Page builder content is JSON. We just return it as is, frontend widget renders it.
            // But SinglePostWidget typically renders Title/Meta/Image itself, and then maybe the "content"
            // If "content" is page builder data, SinglePostWidget might need to initiate a sub-renderer? 
            // OR simpler: standard posts are just text/html?
            // In this CMS, "posts" are page-builder pages or simple text? 
            // In create.php: INSERT ... VALUES (..., '[]') -> It's a JSON array (Page Builder).
            // So a "Single Post" view needs to render that page builder content.
            // This is complex. Product description is simple text. Post content is a widget tree.
            // A "Single Post" normally just shows Title, Date, Author, Featured Image, and then... the content.
            // If the content is Section -> Column -> Widgets, then it should be rendered via PublicRenderer.

            // However, the requested structure `blog/index.php` mimics `product/index.php`.
            // Product rendering was manual in `SingleProductWidget`.
            // For Posts, if they are built with Page Builder, we need to render them as such.

            // Simplification: We will return the data. The frontend widget will decide how to render.
            // If it's a JSON string, we keep it.

            echo json_encode(['success' => true, 'post' => $post]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Post not found']);
        }
    } else {
        // List posts
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page - 1) * $limit;

        // Exclude content from list to save bandwidth, unless requested?
        // Usually list needs title, slug, image, excerpt, date.
        // We don't have explicit excerpt column, so we might send full content or skip it.
        // Let's send everything except massive content if possible.
        // But for now start with *

        $sql = "SELECT id, title, slug, status, meta_description, og_image as image, created_at, updated_at 
                FROM posts 
                WHERE status = 'published' 
                ORDER BY created_at DESC 
                LIMIT $limit OFFSET $offset";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count
        $countStmt = $pdo->query("SELECT COUNT(*) FROM posts WHERE status = 'published'");
        $total = $countStmt->fetchColumn();

        echo json_encode([
            'success' => true,
            'posts' => $posts,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
