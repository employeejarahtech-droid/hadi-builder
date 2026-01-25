<?php
// blog/index.php - Dedicated Blog Page handler

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
$appName = $env['APP_NAME'] ?? 'CMS Blog';

// Paths
$scriptName = $_SERVER['SCRIPT_NAME'];
$webRoot = dirname(dirname($scriptName));
if ($webRoot === '/' || $webRoot === '\\' || $webRoot === '.')
    $webRoot = '';
$basePath = $webRoot; // For theme compatibility
$assetsRoot = $webRoot . '/assets';

// Get Slug
$requestUri = $_SERVER['REQUEST_URI'];
$uriPath = strtok($requestUri, '?');
$slug = '';
$parts = explode('/blog/', $uriPath);
if (count($parts) > 1) {
    $slug = trim($parts[1], '/');
}
if (empty($slug) && isset($_GET['slug'])) {
    $slug = $_GET['slug'];
}

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

// Mobile Menu
$mobileMenuContent = '[]';
if (!empty($settings['mobile_menu'])) {
    $stmt = $pdo->prepare("SELECT content FROM mobile_menus WHERE id = ?");
    $stmt->execute([$settings['mobile_menu']]);
    $mm = $stmt->fetch();
    if ($mm)
        $mobileMenuContent = $mm['content'];
}

// Logic: Single Post vs Blog Index
$pageContent = '[]';
$metaTitle = "Blog";

if ($slug) {
    // Single Post
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'");
    $stmt->execute([$slug]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($post) {
        $metaTitle = $post['title'];

        // Decode existing content
        $storedContent = json_decode($post['content'], true);
        if (!is_array($storedContent))
            $storedContent = [];

        // Create Header Section (Title + Image)
        $date = date('F j, Y', strtotime($post['created_at']));
        $headerSection = [
            'id' => 'post-header',
            'type' => 'container',
            'settings' => [
                'padding' => ['top' => '60', 'right' => '20', 'bottom' => '40', 'left' => '20', 'unit' => 'px', 'isLinked' => false],
                'boxed' => 'yes',
                'width' => '800' // Max width for readability
            ],
            'elements' => [
                [
                    'id' => 'post-title',
                    'type' => 'heading',
                    'settings' => [
                        'title' => $post['title'],
                        'html_tag' => 'h1',
                        'align' => 'center',
                        'typography_typography' => 'custom',
                        'typography_font_size' => ['size' => 48, 'unit' => 'px'],
                        'typography_font_weight' => '800'
                    ]
                ],
                [
                    'id' => 'post-meta',
                    'type' => 'text',
                    'settings' => [
                        'content' => "<div style='text-align: center; color: #64748b; font-size: 16px; margin-bottom: 30px;'>Published on $date</div>",
                        'align' => 'center'
                    ]
                ]
            ]
        ];

        // Add Featured Image if exists
        if (!empty($post['og_image'])) {
            $headerSection['elements'][] = [
                'id' => 'post-feat-img',
                'type' => 'image',
                'settings' => [
                    'image' => ['url' => $post['og_image']],
                    'align' => 'center',
                    'width' => ['size' => 100, 'unit' => '%'],
                    'border_radius' => ['top' => 12, 'right' => 12, 'bottom' => 12, 'left' => 12, 'unit' => 'px', 'isLinked' => true]
                ]
            ];
            // Add some spacing after image
            $headerSection['elements'][] = [
                'id' => 'post-spacer',
                'type' => 'spacer',
                'settings' => [
                    'space' => ['size' => 40, 'unit' => 'px']
                ]
            ];
        }

        // Combine Header + Content
        // We put the post content in a container too if it's not already?
        // Usually builder content is Sections. safe to prepend.
        array_unshift($storedContent, $headerSection);

        $pageContent = json_encode($storedContent);
    } else {
        // 404
        $pageContent = json_encode([
            [
                'id' => '404-msg',
                'type' => 'heading',
                'settings' => ['title' => 'Post Not Found', 'align' => 'center', 'html_tag' => 'h1']
            ]
        ]);
    }
} else {
    // Blog Index (Grid)
    $stmt = $pdo->prepare("SELECT content FROM pages WHERE slug = 'blog'");
    $stmt->execute();
    $blogPage = $stmt->fetch();

    if ($blogPage && !empty($blogPage['content'])) {
        $pageContent = $blogPage['content'];
    } else {
        // Fallback
        $pageContent = json_encode([
            [
                'id' => 'blog-hero',
                'type' => 'container',
                'settings' => ['padding' => ['top' => '60', 'bottom' => '60', 'unit' => 'px'], 'background_color' => '#f8fafc'],
                'elements' => [
                    [
                        'id' => 'blog-title',
                        'type' => 'heading',
                        'settings' => ['title' => 'Our Blog', 'align' => 'center', 'html_tag' => 'h1']
                    ],
                    [
                        'id' => 'blog-desc',
                        'type' => 'text',
                        'settings' => ['content' => 'Latest news and updates from our team.', 'align' => 'center']
                    ]
                ]
            ],
            [
                'id' => 'blog-grid-section',
                'type' => 'container',
                'settings' => ['padding' => ['top' => '40', 'bottom' => '80', 'left' => '20', 'right' => '20', 'unit' => 'px'], 'boxed' => 'yes', 'width' => '1200'],
                'elements' => [
                    [
                        'id' => 'main-post-grid',
                        'type' => 'post_grid', // The widget we created
                        'settings' => [
                            'posts_per_page' => ['size' => 9],
                            'columns' => '3'
                        ]
                    ]
                ]
            ]
        ]);
    }
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
            font-family: "Basier Square", sans-serif;
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
            padding-top: 20px;
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
            padding: 5px 20px;
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
    <!-- Mobile Header Bar -->
    <div class="mobile-header-bar">
        <a href="/" class="mobile-logo">
            <?php if (!empty($settings['site_logo'])): ?>
                <img src="<?php echo htmlspecialchars($settings['site_logo']); ?>"
                    alt="<?php echo htmlspecialchars($appName); ?>"
                    style="width: 140px; height: auto; object-fit: contain;">
            <?php else: ?>
                <?php echo htmlspecialchars($appName); ?>
            <?php endif; ?>
        </a>
        <button class="mobile-toggle-btn" onclick="toggleMobileDrawer()">
            <i class="fa fa-bars"></i>
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

    <!-- Blog Specific Widgets -->
    <script src="<?php echo $assetsRoot; ?>/widgets/PostGridWidget.js"></script>

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