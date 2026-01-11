<?php
// Ensure no output before this point
error_reporting(0); // Suppress warnings that break JSON
ob_start(); // Buffer output

require_once __DIR__ . '/../includes/db.php';

// Clean buffer before sending JSON headers
if (ob_get_length())
    ob_clean();

header('Content-Type: application/json');

try {
    $pdo = getDBConnection();

    // Check for map_embed_code column
    $columns = $pdo->query("SHOW COLUMNS FROM projects LIKE 'map_embed_code'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN map_embed_code TEXT DEFAULT NULL");
    }

    $columns = $pdo->query("SHOW COLUMNS FROM projects LIKE 'project_type'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN project_type VARCHAR(50) DEFAULT 'building' AFTER description");
    }

    $columns = $pdo->query("SHOW COLUMNS FROM projects LIKE 'floor_plans'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN floor_plans TEXT AFTER project_type"); // JSON for floor plans
    }

    $columns = $pdo->query("SHOW COLUMNS FROM projects LIKE 'master_plan'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN master_plan TEXT AFTER floor_plans");
    }

    // Check if projects exist
    $stmt = $pdo->query("SELECT COUNT(*) FROM projects");
    $count = $stmt->fetchColumn();

    // Insert sample projects if table is empty
    if ($count == 0) {
        $sampleProjects = [
            [
                'Modern Apartment Complex',
                'modern-apartment-complex',
                'A stunning modern apartment complex in the heart of the city.',
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                json_encode([
                    ['group_name' => 'General', 'attributes' => [['name' => 'Location', 'value' => 'Downtown', 'type' => 'text'], ['name' => 'Year Built', 'value' => '2024', 'type' => 'text']]],
                    ['group_name' => 'Features', 'attributes' => [['name' => 'Pool', 'value' => 'Yes', 'type' => 'text'], ['name' => 'Gym', 'value' => 'Yes', 'type' => 'text']]]
                ])
            ],
            [
                'Luxury Villa',
                'luxury-villa',
                'Exclusive villa with panoramic ocean views.',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
                json_encode([
                    ['group_name' => 'General', 'attributes' => [['name' => 'Location', 'value' => 'Malibu', 'type' => 'text'], ['name' => 'Bedrooms', 'value' => '6', 'type' => 'text']]],
                    ['group_name' => 'Features', 'attributes' => [['name' => 'Private Beach', 'value' => 'Yes', 'type' => 'text'], ['name' => 'Home Theater', 'value' => 'Yes', 'type' => 'text']]]
                ])
            ],
            [
                'Urban Office Space',
                'urban-office-space',
                'Eco-friendly office space for modern startups.',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
                json_encode([
                    ['group_name' => 'General', 'attributes' => [['name' => 'Location', 'value' => 'Tech District', 'type' => 'text'], ['name' => 'Floors', 'value' => '12', 'type' => 'text']]],
                    ['group_name' => 'Amenities', 'attributes' => [['name' => 'Cafeteria', 'value' => 'Yes', 'type' => 'text'], ['name' => 'Parking', 'value' => 'Underground', 'type' => 'text']]]
                ])
            ]
        ];

        // Ensure table columns exist (attributes is already added)
        // Adjust insert to match columns
        // We assume gallery_images and meta columns exist or are nullable
        $stmt = $pdo->prepare("INSERT INTO projects (title, slug, description, featured_image, attributes, status) VALUES (?, ?, ?, ?, ?, 'published')");

        foreach ($sampleProjects as $project) {
            $stmt->execute($project);
        }
    }

    // Check for single project fetch
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT p.*, pc.name as category_name, pc.slug as category_slug FROM projects p LEFT JOIN project_categories pc ON p.category_id = pc.id WHERE p.id = ?");
        $stmt->execute([$_GET['id']]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($project) {
            echo json_encode(['success' => true, 'project' => $project]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Project not found']);
        }
        exit;
    }

    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT p.*, pc.name as category_name, pc.slug as category_slug FROM projects p LEFT JOIN project_categories pc ON p.category_id = pc.id WHERE p.slug = ?");
        $stmt->execute([$_GET['slug']]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($project) {
            echo json_encode(['success' => true, 'project' => $project]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Project not found']);
        }
        exit;
    }

    // Get pagination parameters
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    // Fetch total count of published projects
    $countStmt = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'published'");
    $totalCount = $countStmt->fetchColumn();

    // Fetch projects with limit and offset
    // Fetch projects with limit and offset
    $stmt = $pdo->prepare("SELECT p.*, pc.name as category_name, pc.slug as category_slug FROM projects p LEFT JOIN project_categories pc ON p.category_id = pc.id WHERE p.status = 'published' ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'projects' => $projects,
        'count' => (int) $totalCount,
        'page' => $page,
        'limit' => $limit,
        'total_pages' => ceil($totalCount / $limit)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
