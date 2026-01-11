<?php
// Ensure DB connection is available
if (!function_exists('getDBConnection')) {
    $dbPath = __DIR__ . '/../../includes/db.php';
    if (file_exists($dbPath)) {
        require_once $dbPath;
    }
}

if (!isset($currentPage)) {
    $currentPage = '';
}

if (!defined('base_url')) {
    // Fallback if not defined
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];

    // Get the directory of the current script
    $scriptDir = dirname($_SERVER['SCRIPT_NAME']);

    // Normalize slashes
    $scriptDir = str_replace('\\', '/', $scriptDir);

    // Remove /admin/* from the end to get base root
    $path = preg_replace('#/admin.*$#', '', $scriptDir);

    define('base_url', $protocol . "://" . $host . $path);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' - ' : ''; ?>Admin Dashboard</title>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/admin.css">
    <link rel="stylesheet" href="<?php echo base_url; ?>/assets/css/toast.css">
    <script src="<?php echo base_url; ?>/assets/core/Toast.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const toggle = document.getElementById('sidebar-toggle');
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('sidebar-overlay');

            function toggleSidebar() {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            }

            if (toggle) {
                toggle.addEventListener('click', toggleSidebar);
            }

            if (overlay) {
                overlay.addEventListener('click', toggleSidebar);
            }
        });
    </script>
</head>

<body>


    <div id="sidebar-overlay" class="sidebar-overlay"></div>
    <aside class="sidebar">
        <div class="sidebar-header">
            <i class="fa fa-cube" style="color: var(--primary);"></i>
            <a href="<?php echo base_url; ?>/admin/">ADMIN</a>
        </div>
        <ul class="sidebar-menu">
            <?php
            // Load menu configuration
            $menusJsonPath = __DIR__ . '/../assets/js/menus.json';
            $menusData = [];

            if (file_exists($menusJsonPath)) {
                $menusData = json_decode(file_get_contents($menusJsonPath), true);
            }

            // Fetch sidebar settings
            try {
                $pdo = getDBConnection();
                $stmt = $pdo->query("SELECT key_name, value FROM settings WHERE key_name LIKE 'sidebar_%'");
                $sidebarSettings = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $sidebarSettings[$row['key_name']] = $row['value'];
                }
            } catch (Exception $e) {
                $sidebarSettings = [];
            }

            // Check if grouped menu is enabled (default: enabled)
            $groupedMenuEnabled = !isset($sidebarSettings['sidebar_grouped_menu']) || $sidebarSettings['sidebar_grouped_menu'] == '1';
            $showIcons = !isset($sidebarSettings['sidebar_show_icons']) || $sidebarSettings['sidebar_show_icons'] == '1';

            // Render ungrouped items
            if (!empty($menusData['ungrouped'])) {
                foreach ($menusData['ungrouped'] as $item) {
                    $isActive = ($currentPage == $item['page_key']) ? 'active' : '';
                    $icon = $showIcons ? '<i class="fa ' . htmlspecialchars($item['icon']) . '"></i> ' : '';
                    echo '<li>';
                    echo '<a href="' . base_url . htmlspecialchars($item['url']) . '" class="' . $isActive . '">';
                    echo $icon . htmlspecialchars($item['label']);
                    echo '</a>';
                    echo '</li>' . "\n";
                }
            }

            // Render grouped items
            if (!empty($menusData['groups'])) {
                foreach ($menusData['groups'] as $group) {
                    $groupId = $group['id'];
                    $settingKey = 'sidebar_group_' . $groupId;

                    // Check if this group is enabled (default: enabled)
                    $isGroupEnabled = !isset($sidebarSettings[$settingKey]) || $sidebarSettings[$settingKey] == '1';

                    if (!$isGroupEnabled) {
                        continue; // Skip this group if disabled
                    }

                    // Render divider and group label if grouped menu is enabled
                    if ($groupedMenuEnabled) {
                        echo '<li class="menu-divider"></li>' . "\n";
                        echo '<li class="menu-group-label">' . htmlspecialchars($group['label']) . '</li>' . "\n";
                    }

                    // Render group items
                    if (!empty($group['items'])) {
                        foreach ($group['items'] as $item) {
                            $isActive = ($item['page_key'] && $currentPage == $item['page_key']) ? 'active' : '';
                            $icon = $showIcons ? '<i class="fa ' . htmlspecialchars($item['icon']) . '"></i> ' : '';
                            echo '<li>';
                            echo '<a href="' . base_url . htmlspecialchars($item['url']) . '" class="' . $isActive . '">';
                            echo $icon . htmlspecialchars($item['label']);
                            echo '</a>';
                            echo '</li>' . "\n";
                        }
                    }
                }
            }

            // Render footer items
            if (!empty($menusData['footer'])) {
                if ($groupedMenuEnabled) {
                    echo '<li class="menu-divider"></li>' . "\n";
                }

                foreach ($menusData['footer'] as $item) {
                    $isActive = ($currentPage == $item['page_key']) ? 'active' : '';
                    $icon = $showIcons ? '<i class="fa ' . htmlspecialchars($item['icon']) . '"></i> ' : '';
                    echo '<li>';
                    echo '<a href="' . base_url . htmlspecialchars($item['url']) . '" class="' . $isActive . '">';
                    echo $icon . htmlspecialchars($item['label']);
                    echo '</a>';
                    echo '</li>' . "\n";
                }
            }
            ?>
        </ul>
    </aside>

    <div class="main-content">
        <header class="top-header">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <button id="sidebar-toggle">
                    <i class="fa fa-bars"></i>
                </button>
            </div>
            <div class="user-menu">
                <div class="user-dropdown-toggle">
                    <span style="color: var(--secondary); font-size: 0.875rem; font-weight: 500;">
                        Auth User
                    </span>
                    <i class="fa fa-chevron-down" style="font-size: 0.75rem; color: var(--secondary);"></i>
                    <i class="fa fa-user-circle" style="font-size: 1.5rem; color: var(--secondary);"></i>
                </div>
                <div class="user-dropdown-menu">
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
                        <div style="font-weight: 600;">Auth User</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Administrator</div>
                    </div>
                    <a href="<?php echo base_url; ?>/admin/settings/" class="user-dropdown-item">
                        <i class="fa fa-cog" style="width: 16px;"></i> Settings
                    </a>
                    <div class="user-dropdown-divider"></div>
                    <a href="<?php echo base_url; ?>/admin/?action=logout" class="user-dropdown-item"
                        style="color: #ef4444;">
                        <i class="fa fa-sign-out-alt" style="width: 16px;"></i> Logout
                    </a>
                </div>
            </div>
        </header>

        <div style="padding: 1rem;">