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

// If basePath is just "." or "/", treat it as root
if ($basePath === '.' || $basePath === '/' || $basePath === '\\') {
    $basePath = '';
}

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

if (!empty($settings['site_name'])) {
    $appName = $settings['site_name'];
}

// Route Logic
$slug = trim($route, '/');

// Initialize Cache Manager
require_once __DIR__ . '/includes/CacheManager.php';
$cache = new CacheManager();
$cacheKey = 'page:slug:' . ($slug ?: 'home');
$page = $cache->get($cacheKey);
$isCached = false;

if ($page !== null) {
    $pageId = $page['id'];
    $contentType = $page['content_type'] ?? 'page';
    $isCached = true;
} else {


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
        // Check if it's a shop route
        if ($slug === 'shop' || $slug === 'products') {
            // Try to fetch specific page from DB first
            $targetSlug = ($slug === 'products') ? 'shop' : $slug;
            $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ? AND status = 'published'");
            $stmt->execute([$targetSlug]);
            $dbPage = $stmt->fetch();

            if ($dbPage) {
                $page = $dbPage;
                $pageId = $page['id'];
                $contentType = 'page';
            } else {
                // Fallback: Shop page - create a virtual page for product grid
                $page = [
                    'id' => 0,
                    'title' => 'Shop',
                    'slug' => 'shop',
                    'status' => 'published',
                    'content' => json_encode([
                        [
                            'id' => 'product-grid-shop',
                            'type' => 'ProductGridWidget',
                            'settings' => [
                                'columns' => 4,
                                'show_price' => true,
                                'show_add_to_cart' => true,
                                'posts_per_page' => 20
                            ]
                        ]
                    ]),
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                    'meta_title' => 'Shop',
                    'meta_description' => 'Browse our products',
                    'keywords' => '',
                    'og_image' => ''
                ];
                $contentType = 'page';
                $pageId = 0;
            }
        } elseif ($slug === 'product') {
            // Product listing page - create a virtual page for product grid
            $page = [
                'id' => 0,
                'title' => 'Products',
                'slug' => 'product',
                'status' => 'published',
                'content' => json_encode([
                    [
                        'id' => 'product-grid-1',
                        'type' => 'ProductGridWidget',
                        'settings' => [
                            'columns' => 3,
                            'show_price' => true,
                            'show_add_to_cart' => true
                        ]
                    ]
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'meta_title' => 'Products',
                'meta_description' => 'Browse our products',
                'keywords' => '',
                'og_image' => ''
            ];
            $contentType = 'page';
            $pageId = 0;
        } elseif (strpos($slug, 'product/') === 0) {
            // Single product page - /product/{slug}
            $productSlug = substr($slug, 8); // Remove 'product/'

            // Create a virtual page for single product
            $page = [
                'id' => 0,
                'title' => 'Product',
                'slug' => 'product/' . $productSlug,
                'status' => 'published',
                'content' => json_encode([
                    [
                        'id' => 'single-product-1',
                        'type' => 'SingleProductWidget',
                        'settings' => [
                            'product_slug' => $productSlug
                        ]
                    ]
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'meta_title' => 'Product',
                'meta_description' => '',
                'keywords' => '',
                'og_image' => ''
            ];
            $contentType = 'page';
            $pageId = 0;
        } elseif ($slug === 'blog') {
            // Blog listing page - create a virtual page
            $page = [
                'id' => 0,
                'title' => 'Blog',
                'slug' => 'blog',
                'status' => 'published',
                'content' => '[]', // You can add a blog listing widget here
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'meta_title' => 'Blog',
                'meta_description' => 'Read our latest blog posts',
                'keywords' => '',
                'og_image' => ''
            ];
            $contentType = 'page';
            $pageId = 0;
        } elseif (strpos($slug, 'blog/') === 0) {
            $postSlug = substr($slug, 5); // Remove 'blog/'
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

    // Cache the result if found and active
    if ($page && isset($page['status']) && $page['status'] === 'published') {
        $page['content_type'] = $contentType;
        $cache->set($cacheKey, $page);
    }
}

// 404 - Check for custom 404 page first
if (!$page) {
    // Try to load a custom 404 page from database (slug: notfound)
    $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = 'notfound' LIMIT 1");
    $stmt->execute();
    $custom404 = $stmt->fetch();

    if ($custom404) {
        // Use custom 404 page
        $page = $custom404;
        $pageId = $custom404['id'];
        http_response_code(404);
    } else {
        // Fallback to basic 404
        http_response_code(404);
        ?>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                }

                .error-container {
                    text-align: center;
                    padding: 2rem;
                    max-width: 600px;
                }

                .error-code {
                    font-size: 120px;
                    font-weight: 900;
                    line-height: 1;
                    margin-bottom: 1rem;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .error-title {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }

                .error-message {
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                    line-height: 1.6;
                }

                .error-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .btn-primary {
                    background: #fff;
                    color: #667eea;
                }

                .btn-primary:hover {
                    background: #f8f9fa;
                }

                @media (max-width: 768px) {
                    .error-code {
                        font-size: 80px;
                    }

                    .error-title {
                        font-size: 1.5rem;
                    }

                    .error-message {
                        font-size: 1rem;
                    }
                }
            </style>
        </head>

        <body class="client-preview">
            <div class="error-container">
                <div class="error-code">404</div>
                <h1 class="error-title">Page Not Found</h1>
                <p class="error-message">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                <div class="error-actions">
                    <a href="/" class="btn btn-primary">
                        <i class="fa fa-home"></i>
                        Go Home
                    </a>
                    <a href="javascript:history.back()" class="btn">
                        <i class="fa fa-arrow-left"></i>
                        Go Back
                    </a>
                </div>
            </div>
        </body>

        </html>
        <?php
        exit;
    }
}

// Fetch Header and Footer
$topbarContent = '[]';
$headerContent = '[]';
$footerContent = '[]';

// Fetch Topbar
// Try to get default topbar first
$stmt = $pdo->query("SELECT content FROM topbars WHERE is_default = 1 LIMIT 1");
$defaultTopbar = $stmt->fetch();

if ($defaultTopbar) {
    $topbarContent = $defaultTopbar['content'];
} elseif (!empty($settings['global_topbar'])) {
    // Fallback to settings (legacy support)
    $stmt = $pdo->prepare("SELECT content FROM topbars WHERE id = ?");
    $stmt->execute([$settings['global_topbar']]);
    $tb = $stmt->fetch();
    if ($tb)
        $topbarContent = $tb['content'];
}

// Try to get default header
$stmt = $pdo->query("SELECT content FROM headers WHERE is_default = 1 LIMIT 1");
$defaultHeader = $stmt->fetch();

if ($defaultHeader) {
    $headerContent = $defaultHeader['content'];
} elseif (!empty($settings['global_header'])) {
    // Fallback to settings
    $stmt = $pdo->prepare("SELECT content FROM headers WHERE id = ?");
    $stmt->execute([$settings['global_header']]);
    $h = $stmt->fetch();
    if ($h)
        $headerContent = $h['content'];
}

// Try to get default footer
$stmt = $pdo->query("SELECT content FROM footers WHERE is_default = 1 LIMIT 1");
$defaultFooter = $stmt->fetch();

if ($defaultFooter) {
    $footerContent = $defaultFooter['content'];
} elseif (!empty($settings['global_footer'])) {
    // Fallback to settings
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

$pageContent = $page['content'] ?? '[]';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    $metaTitle = !empty($page['meta_title']) ? $page['meta_title'] : $page['title'];
    $metaDesc = $page['meta_description'] ?? '';
    $metaKeys = $page['keywords'] ?? '';
    $ogImage = $page['og_image'] ?? '';
    $currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    ?>
    <title><?php echo htmlspecialchars($metaTitle); ?> - <?php echo htmlspecialchars($appName); ?></title>
    <?php if ($metaDesc): ?>
        <meta name="description" content="<?php echo htmlspecialchars($metaDesc); ?>">
    <?php endif; ?>
    <?php if ($metaKeys): ?>
        <meta name="keywords" content="<?php echo htmlspecialchars($metaKeys); ?>">
    <?php endif; ?>

    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo htmlspecialchars($metaTitle); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($metaDesc); ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($currentUrl); ?>">
    <meta property="og:type" content="website">
    <?php if ($ogImage): ?>
        <meta property="og:image" content="<?php echo htmlspecialchars($ogImage); ?>">
    <?php endif; ?>

    <!-- Favicon -->
    <?php if (!empty($settings['favicon'])): ?>
        <link rel="icon" href="<?php echo htmlspecialchars($settings['favicon']); ?>">
    <?php endif; ?>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Page Builder CSS -->
    <link rel="stylesheet"
        href="<?php echo rtrim(str_replace('\\', '/', $basePath), '/'); ?>/assets/css/page-builder.css">

    <!-- Theme CSS -->
    <?php if (!empty($settings['active_theme'])): ?>
        <!-- Main theme stylesheet (includes header.css and footer.css via @import) -->
        <?php include_once 'theme/' . $settings['active_theme'] . '/index.php'; ?>
    <?php endif; ?>

    <!-- Generated CSS Files -->
    <?php
    // Collect CSS file paths from topbar, header, page, footer
    $cssFiles = [];

    // Topbar CSS
    if (!empty($settings['global_topbar'])) {
        $stmt = $pdo->prepare("SELECT css_file FROM topbars WHERE id = ? LIMIT 1");
        $stmt->execute([$settings['global_topbar']]);
        $row = $stmt->fetch();
        if (!empty($row['css_file'])) {
            $cssFiles[] = $row['css_file'];
        }
    }

    // Header CSS
    if (!empty($settings['global_header'])) {
        $stmt = $pdo->prepare("SELECT css_file FROM headers WHERE id = ? LIMIT 1");
        $stmt->execute([$settings['global_header']]);
        $row = $stmt->fetch();
        if (!empty($row['css_file'])) {
            $cssFiles[] = $row['css_file'];
        }
    }

    // Page/Post CSS
    if (!empty($page['css_file'])) {
        $cssFiles[] = $page['css_file'];
    }

    // Footer CSS
    if (!empty($settings['global_footer'])) {
        $stmt = $pdo->prepare("SELECT css_file FROM footers WHERE id = ? LIMIT 1");
        $stmt->execute([$settings['global_footer']]);
        $row = $stmt->fetch();
        if (!empty($row['css_file'])) {
            $cssFiles[] = $row['css_file'];
        }
    }

    // Output CSS file links
    foreach ($cssFiles as $cssFile):
        $fullPath = __DIR__ . '/' . $cssFile;
        if (file_exists($fullPath)):
            $version = filemtime($fullPath);
            ?>
            <link rel="stylesheet" href="<?php echo htmlspecialchars($basePath . '/' . $cssFile); ?>?v=<?php echo $version; ?>">
            <?php
        endif;
    endforeach;
    ?>

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

        /* Mobile Drawer Styles */
        .mobile-drawer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 9999;
            pointer-events: none;
            /* Let clicks pass through when closed */
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
            /* Hidden off-screen */
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
            /* Space for close button */
            overflow-y: auto;
            height: 100%;
        }

        /* Open State */
        .mobile-drawer.open .drawer-overlay {
            opacity: 1;
            pointer-events: auto;
        }

        .mobile-drawer.open .drawer-panel {
            left: 0;
        }

        .mobile-drawer:not(.open) {
            /* Ensure it doesn't block interactions when closed */
            pointer-events: none;
        }

        .mobile-drawer:not(.open) .drawer-panel {
            pointer-events: none;
        }

        <?php if (!empty($settings['sticky_header'])): ?>
            #site-header {
                position: sticky;
                top: 0;
                z-index: 1000;
                background: #fff;
                width: 100%;
            }

        <?php endif; ?>

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
    </style>
</head>

<body class="client-preview">


    <!-- Mobile Header Bar -->
    <div class="mobile-header-bar">
        <a href="/" class="mobile-logo">
            <?php if (!empty($settings['site_logo'])): ?>
                <img src="<?php echo htmlspecialchars($settings['site_logo']); ?>"
                    alt="<?php echo htmlspecialchars($appName); ?>" style="height: 40px; width: auto; object-fit: contain;">
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

    <div id="site-content"></div>
    <div id="site-footer"></div>

    <!-- Mobile Drawer -->
    <div id="mobile-drawer" class="mobile-drawer">
        <div class="drawer-overlay" onclick="toggleMobileDrawer()"></div>
        <div class="drawer-panel">
            <button class="drawer-close" onclick="toggleMobileDrawer()">&times;</button>
            <div id="mobile-drawer-content" class="drawer-content"></div>
        </div>
    </div>

    <?php
    $root = rtrim(str_replace('\\', '/', $basePath), '/');
    ?>

    <!-- Core Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="<?php echo $root; ?>/assets/core/EventEmitter.js"></script>
    <script src="<?php echo $root; ?>/assets/core/EcommerceManager.js"></script>
    <script src="<?php echo $root; ?>/assets/core/WidgetManager.js"></script>
    <script src="<?php echo $root; ?>/assets/core/ElementManager.js"></script>
    <script src="<?php echo $root; ?>/assets/core/register-widgets.js"></script>

    <!-- Widgets -->
    <?php
    $widgetBasePath = $root . '/assets/widgets';
    include __DIR__ . '/assets/widgets/widget-loader.php';
    ?>

    <!-- Renderer -->
    <script>
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

        // Widgets self-register when their scripts load
        // Initialize the widget manager
        // Initialize the widget manager
        const widgetManager = window.elementorWidgetManager;

        // Register widgets using shared logic
        if (typeof registerAllWidgets === 'function') {
            registerAllWidgets(widgetManager);
        }

        widgetManager.init();

        window.CMS_ROOT = "<?php echo $root; ?>";
        window.SITE_DATA = {
            topbar: <?php echo $topbarContent ?: '[]'; ?>,
            header: <?php echo $headerContent ?: '[]'; ?>,
            page: <?php echo $pageContent ?: '[]'; ?>,
            footer: <?php echo $footerContent ?: '[]'; ?>,
            mobileMenu: <?php echo $mobileMenuContent ?: '[]'; ?>
        };

        <?php
        // Helper to get page slug/URL
        function getPageUrl($pdo, $id, $root)
        {
            if (!$id)
                return '';
            try {
                $stmt = $pdo->prepare("SELECT slug FROM pages WHERE id = ?");
                $stmt->execute([$id]);
                $p = $stmt->fetch();
                if ($p) {
                    return $root . '/' . $p['slug'];
                }
            } catch (Exception $e) {
            }
            return '';
        }

        $cartUrl = getPageUrl($pdo, $settings['page_cart_id'] ?? 0, $root);
        $checkoutUrl = getPageUrl($pdo, $settings['page_checkout_id'] ?? 0, $root);
        $successUrl = getPageUrl($pdo, $settings['page_success_id'] ?? 0, $root);

        // Resolve Shop URL (use setting or default to virtual /shop)
        $shopUrl = $root . '/shop';
        if (!empty($settings['page_shop_id'])) {
            $shopUrl = getPageUrl($pdo, $settings['page_shop_id'], $root);
        }

        $currencySymbol = '$';
        if (!empty($settings['currency'])) {
            require_once __DIR__ . '/admin/includes/currencies.php';
            if (isset($currencies[$settings['currency']])) {
                $currencySymbol = $currencies[$settings['currency']]['symbol'];
            }
        }
        ?>

        window.CMS_SETTINGS = {
            shopUrl: "<?php echo $shopUrl; ?>",
            cartUrl: "<?php echo $cartUrl; ?>",
            checkoutUrl: "<?php echo $checkoutUrl; ?>",
            successUrl: "<?php echo $successUrl; ?>",
            currency: "<?php echo $currencySymbol; ?>"
        };
    </script>
    <script src="<?php echo $root; ?>/assets/core/PublicRenderer.js"></script>

</body>

</html>
<?php
// End of file
exit;
?>