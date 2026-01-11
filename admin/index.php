<?php
session_start();

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../includes/db.php';

// Simple .env parser (reused)
function loadEnv($path)
{
    if (!file_exists($path)) {
        return [];
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (substr($value, 0, 1) === '"' && substr($value, -1) === '"')
            $value = substr($value, 1, -1);
        $env[$name] = $value;
    }
    return $env;
}

$env = loadEnv(__DIR__ . '/../.env');

// Logout Logic
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: /admin/login.php');
    exit;
}

// Fetch Settings
$settings = [];
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT * FROM settings");
    while ($row = $stmt->fetch()) {
        $settings[$row['key_name']] = $row['value'];
    }
} catch (Exception $e) {
}

// Fetch Dashboard Stats
$stats = [
    'products' => 0,
    'categories' => 0,
    'pages' => 0,
    'posts' => 0,
    'projects' => 0
];
$recentProducts = [];

try {
    $pdo = getDBConnection();

    // Counts
    $stats['products'] = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $stats['categories'] = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    $stats['pages'] = $pdo->query("SELECT COUNT(*) FROM pages")->fetchColumn();
    $stats['posts'] = $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
    $stats['projects'] = $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
    $stats['project_categories'] = $pdo->query("SELECT COUNT(*) FROM project_categories")->fetchColumn();
    // Check if orders table exists or just try query
    try {
        $stats['orders'] = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    } catch (Exception $e) {
        $stats['orders'] = 0;
    }

    // Recent Products
    $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC LIMIT 5");
    $recentProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Recent Orders
    try {
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");
        $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $recentOrders = [];
    }

    // Recent Projects
    try {
        $stmt = $pdo->query("SELECT p.*, pc.name as category_name FROM projects p LEFT JOIN project_categories pc ON p.category_id = pc.id ORDER BY p.created_at DESC LIMIT 5");
        $recentProjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $recentProjects = [];
    }

    // Recent Blogs
    try {
        $stmt = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC LIMIT 5");
        $recentPosts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $recentPosts = [];
    }

    // Project Categories
    try {
        $stmt = $pdo->query("SELECT * FROM project_categories ORDER BY id DESC LIMIT 5");
        $recentProjectCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $recentProjectCategories = [];
    }

    // Product Categories
    try {
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY id DESC LIMIT 5");
        $recentProductCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $recentProductCategories = [];
    }

} catch (Exception $e) {
    // Handle error silently or log
}

$currentPage = 'dashboard';
$pageTitle = 'Dashboard';
require_once __DIR__ . '/includes/header.php';
?>

<style>
    /* Dashboard Specific Styles */
    .dashboard-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: #fff;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
    }

    .stat-content h3 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-main);
    }

    .stat-content p {
        margin: 0;
        color: var(--secondary);
        font-size: 0.95rem;
    }

    .dashboard-main-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
    }

    @media (max-width: 1024px) {
        .dashboard-main-grid {
            grid-template-columns: 1fr;
        }
    }

    .dashboard-card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .dashboard-card-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dashboard-card-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0;
        color: var(--text-main);
    }

    .table-container {
        overflow-x: auto;
    }

    .dashboard-table {
        width: 100%;
        border-collapse: collapse;
    }

    .dashboard-table th,
    .dashboard-table td {
        padding: 1rem 1.5rem;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
        font-size: 0.95rem;
    }

    .dashboard-table th {
        background: #f8fafc;
        font-weight: 600;
        color: var(--secondary);
    }

    .dashboard-table tr:last-child td {
        border-bottom: none;
    }

    .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding: 1.5rem;
    }

    .quick-action-btn {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border: 1px solid var(--border);
        border-radius: 8px;
        color: var(--text-main);
        text-decoration: none;
        transition: all 0.2s;
        font-weight: 500;
    }

    .quick-action-btn:hover {
        background: #fff;
        border-color: var(--primary);
        color: var(--primary);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .status-active {
        background: #dcfce7;
        color: #166534;
    }

    .status-inactive {
        background: #f1f5f9;
        color: #64748b;
    }
</style>

<div class="page-header">
    <div>
        <h1 class="page-title">Dashboard</h1>
        <p style="color: var(--secondary); margin-top: 5px;">Welcome back! Here's what's happening today.</p>
    </div>
    <div
        style="font-size: 0.9rem; color: var(--secondary); background: #fff; padding: 0.5rem 1rem; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <i class="fa fa-calendar-alt" style="margin-right: 8px;"></i>
        <?php echo date('l, F j, Y'); ?>
    </div>
</div>

<div class="content-wrapper">
    <!-- Stats Grid -->
    <div class="dashboard-stats-grid">
        <?php if (!isset($settings['dash_stat_products']) || $settings['dash_stat_products']): ?>
            <div class="stat-card">
                <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;">
                    <i class="fa fa-box"></i>
                </div>
                <div class="stat-content">
                    <h3>
                        <?php echo number_format($stats['products']); ?>
                    </h3>
                    <p>Total Products</p>
                </div>
            </div>
        <?php endif; ?>
        <?php if (!isset($settings['dash_stat_categories']) || $settings['dash_stat_categories']): ?>
            <div class="stat-card">
                <div class="stat-icon" style="background: #f0fdf4; color: #22c55e;">
                    <i class="fa fa-layer-group"></i>
                </div>
                <div class="stat-content">
                    <h3>
                        <?php echo number_format($stats['categories']); ?>
                    </h3>
                    <p>Categories</p>
                </div>
            </div>
        <?php endif; ?>
        <?php if (!isset($settings['dash_stat_pages']) || $settings['dash_stat_pages']): ?>
            <div class="stat-card">
                <div class="stat-icon" style="background: #fff7ed; color: #f97316;">
                    <i class="fa fa-file-alt"></i>
                </div>
                <div class="stat-content">
                    <h3>
                        <?php echo number_format($stats['pages']); ?>
                    </h3>
                    <p>Published Pages</p>
                </div>
            </div>
        <?php endif; ?>
        <?php if (!isset($settings['dash_stat_posts']) || $settings['dash_stat_posts']): ?>
            <div class="stat-card">
                <div class="stat-icon" style="background: #f5f3ff; color: #8b5cf6;">
                    <i class="fa fa-newspaper"></i>
                </div>
                <div class="stat-content">
                    <h3>
                        <?php echo number_format($stats['posts']); ?>
                    </h3>
                    <p>Blog Posts</p>
                </div>
            </div>
        <?php endif; ?>
        <?php if (!isset($settings['dash_stat_projects']) || $settings['dash_stat_projects']): ?>
            <div class="stat-card">
                <div class="stat-icon" style="background: #fef3c7; color: #f59e0b;">
                    <i class="fa fa-building"></i>
                </div>
                <div class="stat-content">
                    <h3>
                        <?php echo number_format($stats['projects']); ?>
                    </h3>
                    <p>Projects</p>
                </div>
            </div>
        <?php endif; ?>
        <?php if (!isset($settings['dash_stat_project_categories']) || $settings['dash_stat_project_categories']): ?>
            <div class="stat-card">
                <div class="stat-icon" style="background: #fce7f3; color: #db2777;">
                    <i class="fa fa-tags"></i>
                </div>
                <div class="stat-content">
                    <h3>
                        <?php echo number_format($stats['project_categories']); ?>
                    </h3>
                    <p>Project Categories</p>
                </div>
            </div>
        <?php endif; ?>
        <?php if (!isset($settings['dash_stat_orders']) || $settings['dash_stat_orders']): ?>
            <div class="stat-card">
                <div class="stat-icon" style="background: #ccfbf1; color: #0d9488;">
                    <i class="fa fa-shopping-bag"></i>
                </div>
                <div class="stat-content">
                    <h3>
                        <?php echo number_format($stats['orders']); ?>
                    </h3>
                    <p>Total Orders</p>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <!-- Quick Actions Section -->
    <?php if (!isset($settings['dash_widget_quick']) || $settings['dash_widget_quick']): ?>
    <div style="margin-bottom: 1.5rem;">
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title">Quick Actions</h2>
            </div>
            <div class="quick-actions-grid">
                <!-- Add New Product -->
                <?php if (!isset($settings['dash_btn_product']) || $settings['dash_btn_product']): ?>
                <a href="products/create.php" class="quick-action-btn">
                    <i class="fa fa-plus" style="color: #3b82f6;"></i>
                    Add New Product
                </a>
                <?php endif; ?>
                
                <!-- Write New Post -->
                <?php if (!isset($settings['dash_btn_post']) || $settings['dash_btn_post']): ?>
                <a href="posts/create.php" class="quick-action-btn">
                    <i class="fa fa-pen" style="color: #8b5cf6;"></i>
                    Write New Post
                </a>
                <?php endif; ?>
                
                <!-- Add New Project -->
                <?php if (!isset($settings['dash_btn_project']) || $settings['dash_btn_project']): ?>
                <a href="projects/create.php" class="quick-action-btn">
                    <i class="fa fa-building" style="color: #f59e0b;"></i>
                    Add New Project
                </a>
                <?php endif; ?>
                
                <!-- Add New Product Category -->
                <?php if (!isset($settings['dash_btn_cat_prod']) || $settings['dash_btn_cat_prod']): ?>
                <a href="categories/create.php" class="quick-action-btn">
                    <i class="fa fa-layer-group" style="color: #22c55e;"></i>
                    Add New Product Category
                </a>
                <?php endif; ?>
                
                <!-- Add New Project Category -->
                <?php if (!isset($settings['dash_btn_cat_proj']) || $settings['dash_btn_cat_proj']): ?>
                <a href="project-categories/create.php" class="quick-action-btn">
                    <i class="fa fa-tags" style="color: #db2777;"></i>
                    Add New Project Category
                </a>
                <?php endif; ?>
                
                <!-- Settings -->
                <?php if (!isset($settings['dash_btn_settings']) || $settings['dash_btn_settings']): ?>
                <a href="settings/" class="quick-action-btn">
                    <i class="fa fa-cog" style="color: #64748b;"></i>
                    Settings
                </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Builder Promo -->
    <?php if (!isset($settings['dash_widget_builder']) || $settings['dash_widget_builder']): ?>
    <div style="margin-bottom: 1.5rem;">
        <div class="dashboard-card" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white;">
            <div style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">Page Builder</h3>
                        <p style="margin: 0; font-size: 0.9rem; color: #94a3b8;">Customize your layouts visually.</p>
                    </div>
                    <i class="fa fa-th-large" style="font-size: 1.5rem; color: #3b82f6;"></i>
                </div>
                <a href="builder.php" class="btn btn-primary" style="width: auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fa fa-magic"></i> Open Builder
                </a>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Main Content Grid -->
    <div class="dashboard-main-grid">
        <!-- Recent Activity -->
        <?php if (!isset($settings['dash_widget_recent']) || $settings['dash_widget_recent']): ?>
            <div class="dashboard-card">
                <div class="dashboard-card-header">
                    <h2 class="dashboard-card-title">Recent Products</h2>
                    <a href="products/" class="btn btn-sm btn-secondary">View All</a>
                </div>
                <div class="table-container">
                    <table class="dashboard-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($recentProducts)): ?>
                                <tr>
                                    <td colspan="4" style="text-align: center; color: var(--secondary);">No products found</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($recentProducts as $product): ?>
                                    <tr>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div
                                                    style="width: 32px; height: 32px; background: #f1f5f9; border-radius: 6px; overflow: hidden;">
                                                    <?php if (!empty($product['image_url'])): ?>
                                                        <img src="<?php echo htmlspecialchars($product['image_url']); ?>"
                                                            style="width: 100%; height: 100%; object-fit: cover;">
                                                    <?php else: ?>
                                                        <div
                                                            style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                                                            <i class="fa fa-image"></i>
                                                        </div>
                                                    <?php endif; ?>
                                                </div>
                                                <span style="font-weight: 500;">
                                                    <?php echo htmlspecialchars($product['name']); ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td>$
                                            <?php echo number_format($product['price'], 2); ?>
                                        </td>
                                        <td>
                                            <span
                                                class="status-badge <?php echo $product['status'] === 'active' ? 'status-active' : 'status-inactive'; ?>">
                                                <?php echo ucfirst($product['status']); ?>
                                            </span>
                                        </td>
                                        <td style="color: var(--secondary);">
                                            <?php echo date('M j, Y', strtotime($product['created_at'])); ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>

        <!-- Recent Orders -->
        <?php if (!isset($settings['dash_widget_orders']) || $settings['dash_widget_orders']): ?>
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title">Recent Orders</h2>
                <a href="#" class="btn btn-sm btn-secondary">View All</a>
            </div>
            <div class="table-container">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($recentOrders)): ?>
                            <tr><td colspan="5" style="text-align: center; color: var(--secondary);">No orders found</td></tr>
                        <?php else: ?>
                            <?php foreach ($recentOrders as $order): ?>
                                <tr>
                                    <td>#<?php echo htmlspecialchars($order['id']); ?></td>
                                    <td><?php echo htmlspecialchars($order['customer_name'] ?? 'Guest'); ?></td>
                                    <td>$<?php echo number_format($order['total'] ?? 0, 2); ?></td>
                                    <td><span class="status-badge status-active"><?php echo ucfirst($order['status'] ?? 'pending'); ?></span></td>
                                    <td style="color: var(--secondary);"><?php echo date('M j, Y', strtotime($order['created_at'])); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>

        <!-- Recent Projects -->
        <?php if (!isset($settings['dash_widget_projects']) || $settings['dash_widget_projects']): ?>
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title">Recent Projects</h2>
                <a href="projects/" class="btn btn-sm btn-secondary">View All</a>
            </div>
            <div class="table-container">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($recentProjects)): ?>
                            <tr><td colspan="4" style="text-align: center; color: var(--secondary);">No projects found</td></tr>
                        <?php else: ?>
                            <?php foreach ($recentProjects as $project): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($project['title']); ?></td>
                                    <td><?php echo htmlspecialchars($project['category_name'] ?? 'Uncategorized'); ?></td>
                                    <td>$<?php echo number_format($project['price'] ?? 0, 2); ?></td>
                                    <td><span class="status-badge <?php echo $project['status'] === 'published' ? 'status-active' : 'status-inactive'; ?>"><?php echo ucfirst($project['status']); ?></span></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>

        <!-- Recent Blogs -->
        <?php if (!isset($settings['dash_widget_posts']) || $settings['dash_widget_posts']): ?>
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title">Recent Blogs</h2>
                <a href="posts/" class="btn btn-sm btn-secondary">View All</a>
            </div>
            <div class="table-container">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($recentPosts)): ?>
                            <tr><td colspan="3" style="text-align: center; color: var(--secondary);">No posts found</td></tr>
                        <?php else: ?>
                            <?php foreach ($recentPosts as $post): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($post['title']); ?></td>
                                    <td><span class="status-badge <?php echo $post['status'] === 'published' ? 'status-active' : 'status-inactive'; ?>"><?php echo ucfirst($post['status']); ?></span></td>
                                    <td style="color: var(--secondary);"><?php echo date('M j, Y', strtotime($post['created_at'])); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>

        <!-- Project Categories List -->
        <?php if (!isset($settings['dash_widget_project_categories']) || $settings['dash_widget_project_categories']): ?>
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title">Project Categories</h2>
                <a href="project-categories/" class="btn btn-sm btn-secondary">Manage</a>
            </div>
            <div class="table-container">
                <table class="dashboard-table">
                    <tbody>
                        <?php if (empty($recentProjectCategories)): ?>
                            <tr><td style="text-align: center; color: var(--secondary);">No categories found</td></tr>
                        <?php else: ?>
                            <?php foreach ($recentProjectCategories as $cat): ?>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <div style="width: 32px; height: 32px; background: #f1f5f9; border-radius: 6px; overflow: hidden;">
                                                <?php if (!empty($cat['image'])): ?>
                                                    <img src="<?php echo htmlspecialchars($cat['image']); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                                                <?php else: ?>
                                                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #cbd5e1;"><i class="fa fa-image"></i></div>
                                                <?php endif; ?>
                                            </div>
                                            <span style="font-weight: 500;"><?php echo htmlspecialchars($cat['name']); ?></span>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>

        <!-- Product Categories List -->
        <?php if (!isset($settings['dash_widget_product_categories']) || $settings['dash_widget_product_categories']): ?>
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title">Product Categories</h2>
                <a href="categories/" class="btn btn-sm btn-secondary">Manage</a>
            </div>
            <div class="table-container">
                <table class="dashboard-table">
                    <tbody>
                        <?php if (empty($recentProductCategories)): ?>
                            <tr><td style="text-align: center; color: var(--secondary);">No categories found</td></tr>
                        <?php else: ?>
                            <?php foreach ($recentProductCategories as $cat): ?>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <div style="width: 32px; height: 32px; background: #f1f5f9; border-radius: 6px; overflow: hidden;">
                                                <?php if (!empty($cat['image'])): ?>
                                                    <img src="<?php echo htmlspecialchars($cat['image']); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                                                <?php else: ?>
                                                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #cbd5e1;"><i class="fa fa-image"></i></div>
                                                <?php endif; ?>
                                            </div>
                                            <span style="font-weight: 500;"><?php echo htmlspecialchars($cat['name']); ?></span>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>