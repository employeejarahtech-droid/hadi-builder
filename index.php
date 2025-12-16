<?php
// Simple .env parser to get configuration
function loadEnv($path)
{
    if (!file_exists($path)) {
        return [];
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];

    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        // Remove quotes if present
        if (substr($value, 0, 1) === '"' && substr($value, -1) === '"') {
            $value = substr($value, 1, -1);
        }

        $env[$name] = $value;
    }

    return $env;
}

// Load configuration
$env = loadEnv(__DIR__ . '/.env');
$appName = isset($env['APP_NAME']) ? $env['APP_NAME'] : 'New CMS';

// Simple Router
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];
$basePath = dirname($scriptName);

// Remove base path from URI to get the route
$route = str_replace($basePath, '', $requestUri);
$route = strtok($route, '?'); // Remove query string

// Route dispatching
// Helper to get DB connection
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Fetch Settings
$settings = [];
$stmt = $pdo->query("SELECT * FROM settings");
while ($row = $stmt->fetch()) {
    $settings[$row['key_name']] = $row['value'];
}


// Route Logic
$route = str_replace($basePath, '', $requestUri);
$route = strtok($route, '?');
$slug = trim($route, '/');

// DEBUG: Remove in production
// echo "DEBUG: REQUEST_URI: $requestUri <br>";
// echo "DEBUG: SCRIPT_NAME: $scriptName <br>";
// echo "DEBUG: BASE_PATH: $basePath <br>";
// echo "DEBUG: ROUTE: $route <br>";
// echo "DEBUG: SLUG: '$slug' <br>";
// $stmt = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ?");
// $stmt->execute([$slug]);
// echo "DEBUG: DB Count: " . $stmt->fetchColumn() . "<br>";


// Determine Page/Post ID
$pageId = null;
$page = null;
$contentType = 'page'; // 'page' or 'post'

if (empty($slug) || $slug === 'index.php') {
    // Home Page
    $pageId = $settings['home_page'] ?? null;
} else if ($slug === 'admin' || strpos($slug, 'admin/') === 0) {
    // Admin Redirect
    header("Location: admin/");
    exit;
} else if (isset($_GET['page_id']) && is_numeric($_GET['page_id'])) {
    // Preview page by ID (allow draft status for preview)
    $stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
    $stmt->execute([$_GET['page_id']]);
    $page = $stmt->fetch();
    if ($page) {
        $contentType = 'page';
        $pageId = $page['id'];
    }
} else if (isset($_GET['post_id']) && is_numeric($_GET['post_id'])) {
    // Preview post by ID (allow draft status for preview)
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
    $stmt->execute([$_GET['post_id']]);
    $page = $stmt->fetch();
    if ($page) {
        $contentType = 'post';
        $pageId = $page['id'];
    }
} else {
    // Check if it's a blog post
    if (strpos($slug, 'blog/') === 0) {
        $postSlug = substr($slug, 5); // Remvoe 'blog/'
        // Try exact match in posts table
        $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'");
        $stmt->execute([$postSlug]);
        $page = $stmt->fetch();
        if ($page) {
            $contentType = 'post';
            $pageId = $page['id'];
        } else {
            // Fallback: Check if it's a page that just happens to have 'blog/' in URL? 
            // Or maybe user wants /blog/my-page to map to my-page?
            // As per plan, let's also check if the slug exists in pages (without blog/ prefix)
            // or treat it as 404 for blog if strict. 
            // Let's stick to the plan: matching pages might be useful for migration.
            $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ? AND status = 'published'");
            $stmt->execute([$postSlug]);
            $page = $stmt->fetch();
            if ($page)
                $pageId = $page['id'];
        }
    } else {
        // Standard Page
        $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ? AND status = 'published'");
        $stmt->execute([$slug]);
        $page = $stmt->fetch();
        if ($page)
            $pageId = $page['id'];
    }
}

// If looking for home page by ID
if (!$page && $pageId) {
    $stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
    $stmt->execute([$pageId]);
    $page = $stmt->fetch();
}

// 404
if (!$page) {
    http_response_code(404);
    echo "<h1>404 Not Found</h1>";
    exit;
}

// Fetch Header and Footer
$headerContent = '[]';
$footerContent = '[]';

if (!empty($settings['global_header'])) {
    $stmt = $pdo->prepare("SELECT content FROM headers WHERE id = ?");
    $stmt->execute([$settings['global_header']]);
    $h = $stmt->fetch();
    if ($h)
        $headerContent = $h['content'];
}

if (!empty($settings['global_footer'])) {
    $stmt = $pdo->prepare("SELECT content FROM footers WHERE id = ?");
    $stmt->execute([$settings['global_footer']]);
    $f = $stmt->fetch();
    if ($f)
        $footerContent = $f['content'];
}

$pageContent = $page['content'] ?? '[]';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page['title']); ?> - <?php echo htmlspecialchars($appName); ?></title>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Page Builder CSS -->
    <link rel="stylesheet"
        href="<?php echo rtrim(str_replace('\\', '/', $basePath), '/'); ?>/assets/css/page-builder.css">

    <!-- Theme CSS -->
    <?php if (!empty($settings['active_theme'])): ?>
        <link rel="stylesheet"
            href="<?php echo rtrim(str_replace('\\', '/', $basePath), '/'); ?>/theme/<?php echo htmlspecialchars($settings['active_theme']); ?>/style.css">
    <?php endif; ?>

    <style>
        /* Frontend specific overrides */
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
        }

        .elementor-element {
            position: relative;
        }

        /* Hide edit controls/empty placeholders if any leak through */
        .empty-container-zone {
            display: none !important;
        }
    </style>
</head>

<body>


    <div id="site-header"></div>
    <div id="site-content"></div>
    <div id="site-footer"></div>

    <?php
    $root = rtrim(str_replace('\\', '/', $basePath), '/');
    ?>

    <!-- Core Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="<?php echo $root; ?>/assets/core/EventEmitter.js"></script>
    <script src="<?php echo $root; ?>/assets/core/WidgetManager.js"></script>
    <script src="<?php echo $root; ?>/assets/core/ElementManager.js"></script>

    <!-- Widgets -->
    <script src="<?php echo $root; ?>/assets/widgets/WidgetBase.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/HeadingWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/TextWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/ButtonWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/ImageWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/VideoWidget.js"></script>
    <!-- <script src="<?php echo $root; ?>/assets/widgets/ContainerWidget.js"></script> -->
    <script src="<?php echo $root; ?>/assets/widgets/ColumnsWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/FlexWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/LogoWidget.js"></script>

    <!-- Renderer -->
    <script>
        // Register Widgets
        const widgetManager = window.elementorWidgetManager;
        if (typeof HeadingWidget !== 'undefined') { widgetManager.registerWidget(HeadingWidget); console.log('Registered HeadingWidget'); } else { console.error('HeadingWidget not found'); }
        if (typeof TextWidget !== 'undefined') { widgetManager.registerWidget(TextWidget); console.log('Registered TextWidget'); } else { console.error('TextWidget not found'); }
        if (typeof ButtonWidget !== 'undefined') { widgetManager.registerWidget(ButtonWidget); }
        if (typeof ImageWidget !== 'undefined') { widgetManager.registerWidget(ImageWidget); }
        if (typeof VideoWidget !== 'undefined') { widgetManager.registerWidget(VideoWidget); }
        if (typeof ColumnsWidget !== 'undefined') { widgetManager.registerWidget(ColumnsWidget); }
        if (typeof FlexWidget !== 'undefined') { widgetManager.registerWidget(FlexWidget); }
        if (typeof LogoWidget !== 'undefined') { widgetManager.registerWidget(LogoWidget); }

        window.CMS_ROOT = "<?php echo $root; ?>";
        window.SITE_DATA = {
            header: <?php echo $headerContent ?: '[]'; ?>,
            page: <?php echo $pageContent ?: '[]'; ?>,
            footer: <?php echo $footerContent ?: '[]'; ?>
        };
    </script>
    <script src="<?php echo $root; ?>/assets/core/PublicRenderer.js"></script>

</body>

</html>
<?php
// End of file
exit;
?>