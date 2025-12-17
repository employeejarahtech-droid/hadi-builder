<?php
session_start();

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

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
$appUrl = isset($env['APP_URL']) ? rtrim($env['APP_URL'], '/') : '';
$appName = isset($env['APP_NAME']) ? $env['APP_NAME'] : 'New CMS';

// Logout Logic
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: /admin/login.php');
    exit;
}
?>
<?php
$currentPage = 'dashboard';
$pageTitle = 'Dashboard';
require_once __DIR__ . '/includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">Dashboard</h1>
</div>

<div class="content-wrapper">
    <div class="dashboard-grid"
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        <!-- Manage Pages Card -->
        <a href="pages/" class="card"
            style="text-decoration: none; color: inherit; transition: transform 0.2s; display: block;">
            <div style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem;">
                <i class="fa fa-file-alt"></i>
            </div>
            <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Manage Pages</div>
            <div style="color: var(--secondary); font-size: 0.875rem;">View, edit, and manage your website pages.</div>
        </a>

        <!-- Manage Posts Card -->
        <a href="posts/" class="card"
            style="text-decoration: none; color: inherit; transition: transform 0.2s; display: block;">
            <div style="font-size: 2rem; color: #f59e0b; margin-bottom: 1rem;">
                <i class="fa fa-newspaper"></i>
            </div>
            <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Manage Posts</div>
            <div style="color: var(--secondary); font-size: 0.875rem;">Create and manage blog posts.</div>
        </a>

        <!-- Create Page Card -->
        <a href="pages/create.php" class="card"
            style="text-decoration: none; color: inherit; transition: transform 0.2s; display: block;">
            <div style="font-size: 2rem; color: #10b981; margin-bottom: 1rem;">
                <i class="fa fa-plus-circle"></i>
            </div>
            <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Create New Page</div>
            <div style="color: var(--secondary); font-size: 0.875rem;">Start building a new page from scratch.</div>
        </a>

        <!-- Settings Card -->
        <a href="settings/" class="card"
            style="text-decoration: none; color: inherit; transition: transform 0.2s; display: block;">
            <div style="font-size: 2rem; color: #64748b; margin-bottom: 1rem;">
                <i class="fa fa-cog"></i>
            </div>
            <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Settings</div>
            <div style="color: var(--secondary); font-size: 0.875rem;">Configure general site settings.</div>
        </a>

        <!-- Controls Demo -->
        <a href="../demo-controls.html" target="_blank" class="card"
            style="text-decoration: none; color: inherit; transition: transform 0.2s; display: block;">
            <div style="font-size: 2rem; color: #8b5cf6; margin-bottom: 1rem;">
                <i class="fa fa-vials"></i>
            </div>
            <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Controls Demo</div>
            <div style="color: var(--secondary); font-size: 0.875rem;">View the component library showcase.</div>
        </a>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>