<?php
// project/index.php - Dedicated Single Project Page handler

$rootDir = dirname(__DIR__);
require_once $rootDir . '/includes/db.php';
$pdo = getDBConnection();

// Load Env
function loadEnv($path)
{
    if (!file_exists($path))
        return [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        list($name, $value) = explode('=', $line, 2);
        $env[trim($name)] = trim($value, " \t\n\r\0\x0B\"");
    }
    return $env;
}
$env = loadEnv($rootDir . '/.env');
$appName = $env['APP_NAME'] ?? 'CMS Projects';

// Paths
$scriptName = $_SERVER['SCRIPT_NAME'];
$webRoot = dirname(dirname($scriptName));
if ($webRoot === '/' || $webRoot === '\\' || $webRoot === '.')
    $webRoot = '';
$basePath = $webRoot;
$assetsRoot = $webRoot . '/assets';

// Get Slug
$requestUri = $_SERVER['REQUEST_URI'];
$uriPath = strtok($requestUri, '?');
$slug = '';
// Expecting /project/slug
$parts = explode('/project/', $uriPath);
if (count($parts) > 1) {
    $slug = trim($parts[1], '/');
}
if (empty($slug) && isset($_GET['slug'])) {
    $slug = $_GET['slug'];
}

// Fetch Settings
$settings = [];
$stmt = $pdo->query("SELECT * FROM settings");
while ($row = $stmt->fetch()) {
    $settings[$row['key_name']] = $row['value'];
}
if (!empty($settings['site_name']))
    $appName = $settings['site_name'];

// Fetch Header/Footer
$topbarContent = '[]';
$stmt = $pdo->query("SELECT content FROM topbars WHERE is_default = 1 LIMIT 1");
$defaultTopbar = $stmt->fetch();
if ($defaultTopbar)
    $topbarContent = $defaultTopbar['content'];

$headerContent = '[]';
$stmt = $pdo->query("SELECT content FROM headers WHERE is_default = 1 LIMIT 1");
$defaultHeader = $stmt->fetch();
if ($defaultHeader)
    $headerContent = $defaultHeader['content'];

$footerContent = '[]';
$stmt = $pdo->query("SELECT content FROM footers WHERE is_default = 1 LIMIT 1");
$defaultFooter = $stmt->fetch();
if ($defaultFooter)
    $footerContent = $defaultFooter['content'];

$mobileMenuContent = '[]';
$stmt = $pdo->query("SELECT content FROM mobile_menus WHERE id = 1 LIMIT 1");
$mm = $stmt->fetch();
if ($mm)
    $mobileMenuContent = $mm['content'];

// Single Project Content
// We use a hardcoded layout with SingleProject widget, 
// OR we could load a "single-project" template from pages table.
// Loading from template is better for builder integration.
$pageContent = '[]';
$stmt = $pdo->prepare("SELECT content FROM pages WHERE slug = 'single-project'");
$stmt->execute();
$tmpl = $stmt->fetch();

if ($tmpl && !empty($tmpl['content'])) {
    $pageContent = $tmpl['content'];
    // Note: The template MUST contain a SingleProject widget set to "Current Query" source
    // to work correctly. If it's just empty, we might fallback.
    $check = json_decode($pageContent, true);
    if (empty($check)) {
        // Fallback layout
        $pageContent = json_encode([
            [
                'id' => 'single-proj-main',
                'type' => 'container',
                'settings' => ['padding' => ['top' => '40', 'bottom' => '60', 'unit' => 'px'], 'boxed' => 'yes', 'width' => '1200'],
                'elements' => [
                    [
                        'id' => 'proj-details-widget',
                        'type' => 'single_project',
                        'settings' => ['source' => 'current_query']
                    ]
                ]
            ]
        ]);
    }
} else {
    // Fallback Layout
    $pageContent = json_encode([
        [
            'id' => 'single-proj-main',
            'type' => 'container',
            'settings' => ['padding' => ['top' => '40', 'bottom' => '60', 'unit' => 'px'], 'boxed' => 'yes', 'width' => '1200'],
            'elements' => [
                [
                    'id' => 'proj-details-widget',
                    'type' => 'single_project',
                    'settings' => ['source' => 'current_query']
                ]
            ]
        ]
    ]);
}

// Meta Title
$metaTitle = "Project Details";
if ($slug) {
    $stmt = $pdo->prepare("SELECT title FROM projects WHERE slug = ?");
    $stmt->execute([$slug]);
    $p = $stmt->fetch();
    if ($p)
        $metaTitle = $p['title'];
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?php echo htmlspecialchars($metaTitle); ?> -
        <?php echo htmlspecialchars($appName); ?>
    </title>
    <?php if (!empty($settings['favicon'])): ?>
        <link rel="icon" href="<?php echo htmlspecialchars($settings['favicon']); ?>">
    <?php endif; ?>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo $webRoot; ?>/assets/css/page-builder.css">
    <?php if (!empty($settings['active_theme'])): ?>
        <?php include_once $rootDir . '/theme/' . $settings['active_theme'] . '/index.php'; ?>
    <?php endif; ?>
    <style>
        body {
            margin: 0;
            font-family: sans-serif;
            background-color: #fff;
        }

        .elementor-element {
            position: relative;
        }

        /* Mobile Drawer Styles */
        .mobile-drawer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 9999;
            pointer-events: none;
        }

        .drawer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        .drawer-panel {
            position: absolute;
            top: 0;
            left: -300px;
            width: 300px;
            max-width: 80%;
            height: 100%;
            background: #fff;
            transition: left 0.3s;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            pointer-events: auto;
        }

        .drawer-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
        }

        .drawer-content {
            padding-top: 50px;
            overflow-y: auto;
            height: 100%;
        }

        .mobile-drawer.open .drawer-overlay {
            opacity: 1;
            pointer-events: auto;
        }

        .mobile-drawer.open .drawer-panel {
            left: 0;
        }

        .mobile-drawer:not(.open) {
            pointer-events: none;
        }

        .mobile-header-bar {
            display: none;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: #fff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .mobile-logo {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
        }

        .mobile-toggle-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #334155;
            padding: 5px;
        }

        @media (max-width: 768px) {

            #site-header,
            #site-topbar {
                display: none !important;
            }

            .mobile-header-bar {
                display: flex !important;
            }
        }

        @media (min-width: 769px) {
            .mobile-header-bar {
                display: none !important;
            }
        }
    </style>
</head>

<body>
    <div class="mobile-header-bar">
        <a href="/" class="mobile-logo">
            <?php echo htmlspecialchars($appName); ?>
        </a>
        <button class="mobile-toggle-btn" onclick="toggleMobileDrawer()"><i class="fa fa-bars"></i></button>
    </div>

    <div id="site-topbar"></div>
    <div id="site-header"></div>
    <div id="site-content" style="min-height: 50vh;"></div>
    <div id="site-footer"></div>

    <div id="mobile-drawer" class="mobile-drawer">
        <div class="drawer-overlay" onclick="toggleMobileDrawer()"></div>
        <div class="drawer-panel">
            <button class="drawer-close" onclick="toggleMobileDrawer()">&times;</button>
            <div id="mobile-drawer-content" class="drawer-content"></div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="<?php echo $assetsRoot; ?>/core/EventEmitter.js"></script>
    <script src="<?php echo $assetsRoot; ?>/core/EcommerceManager.js"></script>
    <script src="<?php echo $assetsRoot; ?>/core/WidgetManager.js"></script>
    <script src="<?php echo $assetsRoot; ?>/core/ElementManager.js"></script>
    <?php
    $widgetBasePath = $assetsRoot . '/widgets';
    include __DIR__ . '/../assets/widgets/widget-loader.php';
    ?>
    <script>
        window.CMS_ROOT = <?php echo json_encode($webRoot); ?>;
        window.SITE_DATA = {
            topbar: <?php echo $topbarContent; ?>,
            header: <?php echo $headerContent; ?>,
                footer: <?php echo $footerContent; ?>,
                    page: <?php echo $pageContent; ?>,
                        mobileMenu: <?php echo $mobileMenuContent ?: '[]'; ?>
        };
        window.toggleMobileDrawer = function () {
            var drawer = document.getElementById('mobile-drawer');
            if (drawer) drawer.classList.toggle('open');
        };
        document.addEventListener('click', function (e) {
            if (e.target.closest('.js-toggle-mobile-menu')) {
                e.preventDefault();
                window.toggleMobileDrawer();
            }
        });
        const widgetManager = window.elementorWidgetManager;
        widgetManager.init();
    </script>
    <script src="<?php echo $assetsRoot; ?>/core/PublicRenderer.js"></script>
</body>

</html>