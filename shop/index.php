<?php
// shop/index.php - Dedicated Shop Page

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
$appName = $env['APP_NAME'] ?? 'CMS Shop';

// Paths
$scriptName = $_SERVER['SCRIPT_NAME'];
// Calculate web root - same as main index.php
$webRoot = dirname(dirname($scriptName));
if ($webRoot === '/' || $webRoot === '\\' || $webRoot === '.')
    $webRoot = '';
$basePath = $webRoot; // For theme compatibility
$assetsRoot = $webRoot . '/assets';

// Fetch Global Settings
$settings = [];
$stmt = $pdo->query("SELECT * FROM settings");
while ($row = $stmt->fetch()) {
    $settings[$row['key_name']] = $row['value'];
}
if (!empty($settings['site_name']))
    $appName = $settings['site_name'];

// Fetch Header/Footer
$topbarContent = '[]';
// Fetch Topbar
$topbarContent = '[]';
$stmt = $pdo->query("SELECT content FROM topbars WHERE is_default = 1 LIMIT 1");
$defaultTopbar = $stmt->fetch();

if ($defaultTopbar) {
    $topbarContent = $defaultTopbar['content'];
} elseif (!empty($settings['global_topbar'])) {
    $stmt = $pdo->prepare("SELECT content FROM topbars WHERE id = ?");
    $stmt->execute([$settings['global_topbar']]);
    $tb = $stmt->fetch();
    if ($tb)
        $topbarContent = $tb['content'];
}
$headerContent = '[]';
if (!empty($settings['global_header'])) {
    $stmt = $pdo->prepare("SELECT content FROM headers WHERE id = ?");
    $stmt->execute([$settings['global_header']]);
    $h = $stmt->fetch();
    if ($h)
        $headerContent = $h['content'];
}
$footerContent = '[]';
if (!empty($settings['global_footer'])) {
    $stmt = $pdo->prepare("SELECT content FROM footers WHERE id = ?");
    $stmt->execute([$settings['global_footer']]);
    $f = $stmt->fetch();
    if ($f)
        $footerContent = $f['content'];
}

// Fetch Mobile Menu
$mobileMenuContent = '[]';
if (!empty($settings['mobile_menu'])) {
    $stmt = $pdo->prepare("SELECT content FROM mobile_menus WHERE id = ?");
    $stmt->execute([$settings['mobile_menu']]);
    $mm = $stmt->fetch();
    if ($mm)
        $mobileMenuContent = $mm['content'];
}

// Shop Page Content
$pageContent = '[]';
$stmt = $pdo->prepare("SELECT content FROM pages WHERE slug = 'shop'");
$stmt->execute();
$shopPage = $stmt->fetch();

if ($shopPage && !empty($shopPage['content'])) {
    $pageContent = $shopPage['content'];
} else {
    // Fallback if not found in DB - use enhanced ProductGridWidget
    $pageContent = json_encode([
        [
            'id' => 'main-shop-grid',
            'type' => 'product_grid',
            'settings' => [
                'title' => 'Shop All Products',
                'source' => 'dynamic',
                'columns' => '4',
                'show_filters' => 'yes',
                'show_categories' => 'yes',
                'show_price_filter' => 'yes',
                'posts_per_page' => 20,
                'primary_color' => '#007EFC',
                'discount_badge_color' => '#ff4444'
            ]
        ]
    ]);
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop -
        <?php echo htmlspecialchars($appName); ?>
    </title>
    <!-- Favicon -->
    <?php if (!empty($settings['favicon'])): ?>
        <link rel="icon" href="<?php echo htmlspecialchars($settings['favicon']); ?>">
    <?php endif; ?>
    <!-- CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo $webRoot; ?>/assets/css/page-builder.css">

    <!-- Theme CSS -->
    <?php if (!empty($settings['active_theme'])): ?>
        <!-- Main theme stylesheet (includes header.css and footer.css via @import) -->
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

        /* Mobile Header Bar Styles */
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

        /* Responsive Visibility */
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

    <body>
        <!-- Mobile Header Bar -->
        <div class="mobile-header-bar">
            <a href="/" class="mobile-logo">
                <?php if (!empty($settings['site_logo'])): ?>
                    <img src="<?php echo htmlspecialchars($settings['site_logo']); ?>"
                        alt="<?php echo htmlspecialchars($appName); ?>"
                        style="height: 40px; width: auto; object-fit: contain;">
                <?php else: ?>
                    <?php echo htmlspecialchars($appName); ?>
                <?php endif; ?>
            </a>
            <button class="mobile-toggle-btn" onclick="toggleMobileDrawer()">
                <i class="fa fa-bars"></i>
            </button>
            </button>
        </div>

        <div id="site-topbar"></div>
        <div id="site-header"></div>
        <div id="site-content" style="min-height: 50vh;"></div>
        <div id="site-footer"></div>

        <!-- Mobile Drawer -->
        <div id="mobile-drawer" class="mobile-drawer">
            <div class="drawer-overlay" onclick="toggleMobileDrawer()"></div>
            <div class="drawer-panel">
                <button class="drawer-close" onclick="toggleMobileDrawer()">&times;</button>
                <div id="mobile-drawer-content" class="drawer-content"></div>
            </div>
        </div>

        <!-- Core Scripts -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="<?php echo $assetsRoot; ?>/core/EventEmitter.js"></script>
        <script src="<?php echo $assetsRoot; ?>/core/EcommerceManager.js"></script>
        <script src="<?php echo $assetsRoot; ?>/core/WidgetManager.js"></script>
        <script src="<?php echo $assetsRoot; ?>/core/ElementManager.js"></script>

        <!-- Widgets -->
        <?php
        $widgetBasePath = $assetsRoot . '/widgets';
        include __DIR__ . '/../assets/widgets/widget-loader.php';
        ?>

        <!-- Renderer -->
        <script>
            window.CMS_ROOT = <?php echo json_encode($webRoot); ?>;
            window.SITE_DATA = {
                topbar: <?php echo $topbarContent; ?>,
                header: <?php echo $headerContent; ?>,
                footer: <?php echo $footerContent; ?>,
                page: <?php echo $pageContent; ?>,
                mobileMenu: <?php echo $mobileMenuContent ?: '[]'; ?>
            };

            // Global toggle function
            window.toggleMobileDrawer = function () {
                var drawer = document.getElementById('mobile-drawer');
                if (drawer) drawer.classList.toggle('open');
            };

            // Attach listeners to any element with class .js-toggle-mobile-menu
            document.addEventListener('click', function (e) {
                if (e.target.closest('.js-toggle-mobile-menu')) {
                    e.preventDefault();
                    window.toggleMobileDrawer();
                }
            });

            // Initialize the widget manager
            const widgetManager = window.elementorWidgetManager;
            widgetManager.init();
        </script>
        <script src="<?php echo $assetsRoot; ?>/core/PublicRenderer.js"></script>
    </body>

</html>