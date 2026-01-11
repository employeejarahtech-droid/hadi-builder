<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $settings = $_POST['settings'] ?? [];

    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)");

        foreach ($settings as $key => $value) {
            $stmt->execute([$key, $value]);

            // Sync global_topbar with topbars table
            if ($key === 'global_topbar') {
                // Reset all defaults
                $pdo->exec("UPDATE topbars SET is_default = 0");
                if (!empty($value)) {
                    $stmtTop = $pdo->prepare("UPDATE topbars SET is_default = 1 WHERE id = ?");
                    $stmtTop->execute([$value]);
                }
            }
        }

        $message = 'Settings updated successfully';
    } catch (Exception $e) {
        $error = 'Error updating settings: ' . $e->getMessage();
    }
}

// Fetch current settings
$currentSettings = [];
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT * FROM settings");
    while ($row = $stmt->fetch()) {
        $currentSettings[$row['key_name']] = $row['value'];
    }

    // Fallback: If global_topbar not set in settings, check topbars table for is_default
    if (!isset($currentSettings['global_topbar']) || $currentSettings['global_topbar'] === '') {
        try {
            $stmtDef = $pdo->query("SELECT id FROM topbars WHERE is_default = 1 LIMIT 1");
            if ($def = $stmtDef->fetch()) {
                $currentSettings['global_topbar'] = $def['id'];
            }
        } catch (Exception $ex) {
            // Ignore
        }
    }
} catch (Exception $e) {
    // Handle error
}

// Fetch headers and footers for dropdowns
$headersList = [];
$footersList = [];
$pagesList = [];
try {
    $pdo = getDBConnection();
    $headersList = $pdo->query("SELECT id, title FROM headers ORDER BY title")->fetchAll();
    $footersList = $pdo->query("SELECT id, title FROM footers ORDER BY title")->fetchAll();
    $mobileMenusList = $pdo->query("SELECT id, title FROM mobile_menus ORDER BY title")->fetchAll();
    $topbarsList = $pdo->query("SELECT id, name FROM topbars ORDER BY name")->fetchAll();
    $pagesList = $pdo->query("SELECT id, title FROM pages ORDER BY title")->fetchAll();
} catch (Exception $e) {
    // Ignore error
}

// Scan for themes
$themeDir = __DIR__ . '/../../theme';
$themes = [];
if (is_dir($themeDir)) {
    $scanned_themes = array_diff(scandir($themeDir), array('..', '.'));
    foreach ($scanned_themes as $theme) {
        if (is_dir($themeDir . '/' . $theme)) {
            $themes[] = $theme;
        }
    }
}

$currentPage = 'settings';
$pageTitle = 'Settings';
require_once __DIR__ . '/../includes/header.php';
?>

<!-- Media Modal CSS -->
<link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/media-modal.css">

<style>
    .settings-tabs {
        display: flex;
        gap: 0;
        border-bottom: 2px solid var(--border);
        margin-bottom: 2rem;
        overflow-x: auto;
        padding-bottom: 5px;
        /* Spacing for scrollbar */
    }

    .settings-tab {
        padding: 1rem 1.5rem;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--secondary);
        transition: all 0.2s;
        white-space: nowrap;
        position: relative;
        bottom: -2px;
    }

    .settings-tab:hover {
        color: var(--primary);
        background: rgba(59, 130, 246, 0.05);
    }

    .settings-tab.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
        font-weight: 600;
    }

    .settings-tab i {
        margin-right: 0.5rem;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
        animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .settings-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--border);
    }

    .settings-section:last-child {
        border-bottom: none;
    }

    .settings-section-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text);
    }

    .settings-section-description {
        font-size: 0.9rem;
        color: var(--secondary);
        margin-bottom: 1.5rem;
    }
</style>

<div class="page-header">
    <h1 class="page-title">Settings</h1>
</div>

<div class="content-wrapper">
    <div class="card" style="max-width: 100%;">
        <?php if ($message): ?>
            <div style="background: #dcfce7; color: #166534; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <!-- Tabs Navigation -->
        <div class="settings-tabs">
            <button class="settings-tab active" data-tab="general">
                <i class="fa fa-cog"></i> General
            </button>
            <button class="settings-tab" data-tab="dashboard">
                <i class="fa fa-tachometer-alt"></i> Dashboard
            </button>
            <button class="settings-tab" data-tab="appearance">
                <i class="fa fa-palette"></i> Appearance
            </button>
            <button class="settings-tab" data-tab="layout">
                <i class="fa fa-th-large"></i> Layout
            </button>
            <button class="settings-tab" data-tab="sidebar">
                <i class="fa fa-bars"></i> Sidebar
            </button>
            <button class="settings-tab" data-tab="ecommerce">
                <i class="fa fa-shopping-cart"></i> E-commerce
            </button>
            <button class="settings-tab" data-tab="seo">
                <i class="fa fa-search"></i> SEO
            </button>
            <button class="settings-tab" data-tab="advanced">
                <i class="fa fa-sliders-h"></i> Advanced
            </button>
        </div>

        <div style="max-width: 900px;">
            <form method="POST" action="">
                <!-- General Tab -->
                <div class="tab-content active" id="general-tab">
                    <div class="settings-section">
                        <h3 class="settings-section-title">Site Information</h3>
                        <p class="settings-section-description">Basic information about your website</p>

                        <div class="form-group">
                            <label class="form-label" for="site_name">Site Name</label>
                            <input type="text" id="site_name" name="settings[site_name]" class="form-input"
                                value="<?php echo htmlspecialchars($currentSettings['site_name'] ?? ''); ?>">
                            <small style="color: var(--secondary);">The name of your website</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="site_description">Site Description</label>
                            <textarea id="site_description" name="settings[site_description]" class="form-input"
                                rows="3"><?php echo htmlspecialchars($currentSettings['site_description'] ?? ''); ?></textarea>
                            <small style="color: var(--secondary);">A brief description of your website</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="admin_email">Admin Email</label>
                            <input type="email" id="admin_email" name="settings[admin_email]" class="form-input"
                                value="<?php echo htmlspecialchars($currentSettings['admin_email'] ?? ''); ?>">
                            <small style="color: var(--secondary);">Email address for admin notifications</small>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-title">Homepage Settings</h3>
                        <p class="settings-section-description">Configure your homepage</p>

                        <div class="form-group">
                            <label class="form-label" for="home_page">Home Page</label>
                            <select id="home_page" name="settings[home_page]" class="form-input">
                                <option value="">-- Default --</option>
                                <?php foreach ($pagesList as $page): ?>
                                    <option value="<?php echo $page['id']; ?>" <?php echo (isset($currentSettings['home_page']) && $currentSettings['home_page'] == $page['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($page['title']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Select the page to serve as the homepage</small>
                        </div>
                    </div>
                </div>

                <!-- Appearance Tab -->
                <div class="tab-content" id="appearance-tab">
                    <div class="settings-section">
                        <h3 class="settings-section-title">Branding</h3>
                        <p class="settings-section-description">Customize your site's visual identity</p>

                        <!-- Site Logo -->
                        <div class="form-group">
                            <label class="form-label">Site Logo</label>
                            <div class="image-upload-container" style="margin-top: 10px;">
                                <input type="hidden" id="site_logo" name="settings[site_logo]"
                                    value="<?php echo htmlspecialchars($currentSettings['site_logo'] ?? ''); ?>">

                                <div id="site_logo_preview"
                                    style="margin-bottom: 10px; width: 200px; height: 100px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                    <?php if (!empty($currentSettings['site_logo'])): ?>
                                        <img src="<?php echo htmlspecialchars($currentSettings['site_logo']); ?>"
                                            style="max-width: 100%; max-height: 100%; object-fit: contain;">
                                    <?php else: ?>
                                        <span style="color: #64748b; font-size: 0.9rem;">No logo</span>
                                    <?php endif; ?>
                                </div>

                                <button type="button" class="btn btn-secondary select-image-btn"
                                    data-target="site_logo">Select
                                    Logo</button>
                                <button type="button" class="btn btn-danger remove-image-btn" data-target="site_logo"
                                    style="<?php echo empty($currentSettings['site_logo']) ? 'display:none;' : ''; ?>">Remove</button>
                            </div>
                        </div>

                        <!-- Favicon -->
                        <div class="form-group">
                            <label class="form-label">Favicon</label>
                            <div class="image-upload-container" style="margin-top: 10px;">
                                <input type="hidden" id="favicon" name="settings[favicon]"
                                    value="<?php echo htmlspecialchars($currentSettings['favicon'] ?? ''); ?>">

                                <div id="favicon_preview"
                                    style="margin-bottom: 10px; width: 64px; height: 64px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                    <?php if (!empty($currentSettings['favicon'])): ?>
                                        <img src="<?php echo htmlspecialchars($currentSettings['favicon']); ?>"
                                            style="width: 32px; height: 32px; object-fit: contain;">
                                    <?php else: ?>
                                        <span style="color: #64748b; font-size: 0.8rem;">No icon</span>
                                    <?php endif; ?>
                                </div>

                                <button type="button" class="btn btn-secondary select-image-btn"
                                    data-target="favicon">Select
                                    Favicon</button>
                                <button type="button" class="btn btn-danger remove-image-btn" data-target="favicon"
                                    style="<?php echo empty($currentSettings['favicon']) ? 'display:none;' : ''; ?>">Remove</button>
                            </div>
                            <small style="color: var(--secondary); display: block; margin-top: 8px;">Small icon
                                displayed in
                                browser tabs (recommended: 32x32px)</small>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-title">Colors</h3>
                        <p class="settings-section-description">Customize your site's color scheme</p>

                        <div class="form-group">
                            <label class="form-label" for="primary_color">Primary Color</label>
                            <input type="color" id="primary_color" name="settings[primary_color]" class="form-input"
                                value="<?php echo htmlspecialchars($currentSettings['primary_color'] ?? '#3b82f6'); ?>"
                                style="height: 50px; cursor: pointer;">
                            <small style="color: var(--secondary);">Main brand color used throughout your site</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="secondary_color">Secondary Color</label>
                            <input type="color" id="secondary_color" name="settings[secondary_color]" class="form-input"
                                value="<?php echo htmlspecialchars($currentSettings['secondary_color'] ?? '#8b5cf6'); ?>"
                                style="height: 50px; cursor: pointer;">
                            <small style="color: var(--secondary);">Accent color for highlights and secondary
                                elements</small>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-title">Theme</h3>
                        <p class="settings-section-description">Select and manage your site theme</p>

                        <div class="form-group">
                            <label class="form-label" for="active_theme">Active Theme</label>
                            <select id="active_theme" name="settings[active_theme]" class="form-input">
                                <option value="">-- Default --</option>
                                <?php foreach ($themes as $theme): ?>
                                    <option value="<?php echo htmlspecialchars($theme); ?>" <?php echo (isset($currentSettings['active_theme']) && $currentSettings['active_theme'] == $theme) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($theme); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Choose the active theme for your website</small>
                        </div>
                    </div>
                </div>

                <!-- Layout Tab -->
                <div class="tab-content" id="layout-tab">
                    <div class="settings-section">
                        <h3 class="settings-section-title">Global Layout Components</h3>
                        <p class="settings-section-description">Configure header, footer, and navigation elements</p>

                        <div class="form-group">
                            <label class="form-label" for="global_topbar">Global Topbar</label>
                            <select id="global_topbar" name="settings[global_topbar]" class="form-input">
                                <option value="">-- None --</option>
                                <?php foreach ($topbarsList as $topbar): ?>
                                    <option value="<?php echo $topbar['id']; ?>" <?php echo (isset($currentSettings['global_topbar']) && $currentSettings['global_topbar'] == $topbar['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($topbar['name']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Select the topbar to display on all pages</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="global_header">Global Header</label>
                            <select id="global_header" name="settings[global_header]" class="form-input">
                                <option value="">-- None --</option>
                                <?php foreach ($headersList as $header): ?>
                                    <option value="<?php echo $header['id']; ?>" <?php echo (isset($currentSettings['global_header']) && $currentSettings['global_header'] == $header['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($header['title']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Select the header to display on all pages</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="sticky_header">Sticky Header</label>
                            <select id="sticky_header" name="settings[sticky_header]" class="form-input">
                                <option value="0" <?php echo (isset($currentSettings['sticky_header']) && $currentSettings['sticky_header'] == '0') ? 'selected' : ''; ?>>Disabled</option>
                                <option value="1" <?php echo (isset($currentSettings['sticky_header']) && $currentSettings['sticky_header'] == '1') ? 'selected' : ''; ?>>Enabled</option>
                            </select>
                            <small style="color: var(--secondary);">Keep the header visible at the top while
                                scrolling</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="global_footer">Global Footer</label>
                            <select id="global_footer" name="settings[global_footer]" class="form-input">
                                <option value="">-- None --</option>
                                <?php foreach ($footersList as $footer): ?>
                                    <option value="<?php echo $footer['id']; ?>" <?php echo (isset($currentSettings['global_footer']) && $currentSettings['global_footer'] == $footer['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($footer['title']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Select the footer to display on all pages</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="mobile_menu">Global Mobile Menu</label>
                            <select id="mobile_menu" name="settings[mobile_menu]" class="form-input">
                                <option value="">-- None --</option>
                                <?php foreach ($mobileMenusList as $menu): ?>
                                    <option value="<?php echo $menu['id']; ?>" <?php echo (isset($currentSettings['mobile_menu']) && $currentSettings['mobile_menu'] == $menu['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($menu['title']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Select the menu for mobile drawer navigation</small>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Tab -->
                <div class="tab-content" id="sidebar-tab">
                    <div class="settings-section">
                        <h3 class="settings-section-title">Sidebar Menu Configuration</h3>
                        <p class="settings-section-description">Configure the admin sidebar navigation menu</p>

                        <div class="form-group">
                            <label class="form-label" for="sidebar_grouped_menu">Enable Grouped Menu</label>
                            <select id="sidebar_grouped_menu" name="settings[sidebar_grouped_menu]" class="form-input">
                                <option value="1" <?php echo (!isset($currentSettings['sidebar_grouped_menu']) || $currentSettings['sidebar_grouped_menu'] == '1') ? 'selected' : ''; ?>>Enabled</option>
                                <option value="0" <?php echo (isset($currentSettings['sidebar_grouped_menu']) && $currentSettings['sidebar_grouped_menu'] == '0') ? 'selected' : ''; ?>>Disabled</option>
                            </select>
                            <small style="color: var(--secondary);">Enable or disable the grouped sidebar menu with dividers</small>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-title">Menu Groups Visibility</h3>
                        <p class="settings-section-description">Select which menu groups to display in the sidebar</p>

                        <?php
                        // Load menu configuration
                        $menusJsonPath = __DIR__ . '/../assets/js/menus.json';
                        $menuGroups = [];
                        if (file_exists($menusJsonPath)) {
                            $menusData = json_decode(file_get_contents($menusJsonPath), true);
                            $menuGroups = $menusData['groups'] ?? [];
                        }

                        // Display checkbox for each group
                        foreach ($menuGroups as $group):
                            $groupId = $group['id'];
                            $groupLabel = $group['label'];
                            $settingKey = 'sidebar_group_' . $groupId;
                            $isEnabled = isset($currentSettings[$settingKey]) ? $currentSettings[$settingKey] : ($group['enabled_by_default'] ?? '1');
                        ?>
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                                    <input type="hidden" name="settings[<?php echo $settingKey; ?>]" value="0">
                                    <input type="checkbox" 
                                           name="settings[<?php echo $settingKey; ?>]" 
                                           value="1" 
                                           <?php echo $isEnabled == '1' ? 'checked' : ''; ?>
                                           style="width: 18px; height: 18px; cursor: pointer;">
                                    <span style="font-weight: 500;"><?php echo htmlspecialchars($groupLabel); ?></span>
                                </label>
                                <small style="color: var(--secondary); margin-left: 2rem; display: block;">
                                    <?php 
                                    $itemCount = count($group['items'] ?? []);
                                    echo $itemCount . ' menu item' . ($itemCount !== 1 ? 's' : '');
                                    ?>
                                </small>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-title">Display Options</h3>
                        <p class="settings-section-description">Customize sidebar appearance</p>

                        <div class="form-group">
                            <label class="form-label" for="sidebar_show_icons">Show Menu Icons</label>
                            <select id="sidebar_show_icons" name="settings[sidebar_show_icons]" class="form-input">
                                <option value="1" <?php echo (!isset($currentSettings['sidebar_show_icons']) || $currentSettings['sidebar_show_icons'] == '1') ? 'selected' : ''; ?>>Enabled</option>
                                <option value="0" <?php echo (isset($currentSettings['sidebar_show_icons']) && $currentSettings['sidebar_show_icons'] == '0') ? 'selected' : ''; ?>>Disabled</option>
                            </select>
                            <small style="color: var(--secondary);">Show or hide icons in the sidebar menu items</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="sidebar_compact_mode">Compact Mode</label>
                            <select id="sidebar_compact_mode" name="settings[sidebar_compact_mode]" class="form-input">
                                <option value="0" <?php echo (!isset($currentSettings['sidebar_compact_mode']) || $currentSettings['sidebar_compact_mode'] == '0') ? 'selected' : ''; ?>>Disabled</option>
                                <option value="1" <?php echo (isset($currentSettings['sidebar_compact_mode']) && $currentSettings['sidebar_compact_mode'] == '1') ? 'selected' : ''; ?>>Enabled</option>
                            </select>
                            <small style="color: var(--secondary);">Reduce padding and spacing in the sidebar menu</small>
                        </div>
                    </div>
                </div>



                <!-- SEO Tab -->
                <div class="tab-content" id="seo-tab">
                    <div class="settings-section">
                        <h3 class="settings-section-title">Search Engine Optimization</h3>
                        <p class="settings-section-description">Improve your site's visibility in search engines</p>

                        <div class="form-group">
                            <label class="form-label" for="meta_keywords">Meta Keywords</label>
                            <input type="text" id="meta_keywords" name="settings[meta_keywords]" class="form-input"
                                value="<?php echo htmlspecialchars($currentSettings['meta_keywords'] ?? ''); ?>"
                                placeholder="keyword1, keyword2, keyword3">
                            <small style="color: var(--secondary);">Comma-separated keywords for search engines</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="google_analytics">Google Analytics ID</label>
                            <input type="text" id="google_analytics" name="settings[google_analytics]"
                                class="form-input"
                                value="<?php echo htmlspecialchars($currentSettings['google_analytics'] ?? ''); ?>"
                                placeholder="G-XXXXXXXXXX">
                            <small style="color: var(--secondary);">Your Google Analytics tracking ID</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="google_search_console">Google Search Console</label>
                            <input type="text" id="google_search_console" name="settings[google_search_console]"
                                class="form-input"
                                value="<?php echo htmlspecialchars($currentSettings['google_search_console'] ?? ''); ?>"
                                placeholder="Verification code">
                            <small style="color: var(--secondary);">Google Search Console verification code</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="robots_txt">Robots.txt Content</label>
                            <textarea id="robots_txt" name="settings[robots_txt]" class="form-input" rows="6"
                                placeholder="User-agent: *&#10;Disallow: /admin/"><?php echo htmlspecialchars($currentSettings['robots_txt'] ?? ''); ?></textarea>
                            <small style="color: var(--secondary);">Custom robots.txt content for search engine
                                crawlers</small>
                        </div>

                        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                            <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--text);">Keyword Research & Ideas</h4>

                            <!-- Target Keywords (Main Storage) -->
                            <div class="form-group">
                                <label class="form-label" for="target_keywords">Target Focus Keywords</label>
                                <textarea id="target_keywords" name="settings[target_keywords]" class="form-input" rows="3"
                                    placeholder="Enter your main target keywords (comma separated)"><?php echo htmlspecialchars($currentSettings['target_keywords'] ?? ''); ?></textarea>
                                <small style="color: var(--secondary);">Your selected focus keywords.</small>
                            </div>

                            <!-- Keyword Finder Tool -->
                            <div class="card" style="background: #f8fafc; border: 1px solid var(--border); box-shadow: none; padding: 1.5rem;">
                                <h5 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                                    <i class="fa fa-lightbulb" style="color: #f59e0b;"></i> Keyword Idea Generator
                                </h5>
                                
                                <div style="display: flex; gap: 10px; margin-bottom: 1rem;">
                                    <input type="text" id="seed_keyword" class="form-input" placeholder="Enter a topic (e.g. 'summer dress')" style="margin-bottom: 0;">
                                    <button type="button" class="btn btn-primary" onclick="fetchKeywordIdeas()" style="white-space: nowrap;">
                                        Get Ideas
                                    </button>
                                </div>

                                <div id="keyword_ideas_container" style="display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px;">
                                    <span style="color: var(--secondary); font-size: 0.9rem; font-style: italic;">Results will appear here...</span>
                                </div>
                            </div>

                            <!-- Legacy / External Tool Link (Minimized) -->
                            <div class="form-group" style="margin-top: 1.5rem;">
                                <label class="form-label" style="font-size: 0.85rem;">External Advanced Tools (Optional)</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <select id="keyword_research_tool" name="settings[keyword_research_tool]" class="form-input" onchange="updateResearchToolLink()" style="width: auto; padding: 4px 8px; height: 36px;">
                                        <option value="">-- Quick Link to Tool --</option>
                                        <option value="google" <?php echo ($currentSettings['keyword_research_tool'] ?? '') == 'google' ? 'selected' : ''; ?>>Google Keyword Planner</option>
                                        <option value="semrush" <?php echo ($currentSettings['keyword_research_tool'] ?? '') == 'semrush' ? 'selected' : ''; ?>>SEMrush</option>
                                        <option value="ahrefs" <?php echo ($currentSettings['keyword_research_tool'] ?? '') == 'ahrefs' ? 'selected' : ''; ?>>Ahrefs</option>
                                        <option value="moz" <?php echo ($currentSettings['keyword_research_tool'] ?? '') == 'moz' ? 'selected' : ''; ?>>Moz</option>
                                        <option value="ubersuggest" <?php echo ($currentSettings['keyword_research_tool'] ?? '') == 'ubersuggest' ? 'selected' : ''; ?>>Ubersuggest</option>
                                    </select>
                                    <a id="keyword_tool_link" href="#" target="_blank" class="btn btn-sm btn-secondary" style="display: none;">
                                        Open <i class="fa fa-external-link-alt" style="margin-left: 4px;"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Advanced Tab -->
                <div class="tab-content" id="advanced-tab">
                    <div class="settings-section">
                        <h3 class="settings-section-title">Advanced Settings</h3>
                        <p class="settings-section-description">Advanced configuration options</p>

                        <div class="form-group">
                            <label class="form-label" for="maintenance_mode">Maintenance Mode</label>
                            <select id="maintenance_mode" name="settings[maintenance_mode]" class="form-input">
                                <option value="0" <?php echo (isset($currentSettings['maintenance_mode']) && $currentSettings['maintenance_mode'] == '0') ? 'selected' : ''; ?>>Disabled</option>
                                <option value="1" <?php echo (isset($currentSettings['maintenance_mode']) && $currentSettings['maintenance_mode'] == '1') ? 'selected' : ''; ?>>Enabled</option>
                            </select>
                            <small style="color: var(--secondary);">Enable maintenance mode to show a "coming soon" page
                                to
                                visitors</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="custom_css">Custom CSS</label>
                            <textarea id="custom_css" name="settings[custom_css]" class="form-input" rows="8"
                                placeholder=".my-custom-class { color: red; }"><?php echo htmlspecialchars($currentSettings['custom_css'] ?? ''); ?></textarea>
                            <small style="color: var(--secondary);">Add custom CSS that will be applied to your entire
                                site</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="custom_js">Custom JavaScript</label>
                            <textarea id="custom_js" name="settings[custom_js]" class="form-input" rows="8"
                                placeholder="console.log('Hello World');"><?php echo htmlspecialchars($currentSettings['custom_js'] ?? ''); ?></textarea>
                            <small style="color: var(--secondary);">Add custom JavaScript code (without &lt;script&gt;
                                tags)</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="timezone">Timezone</label>
                            <select id="timezone" name="settings[timezone]" class="form-input">
                                <option value="UTC" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'UTC') ? 'selected' : ''; ?>>UTC</option>
                                <option value="America/New_York" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'America/New_York') ? 'selected' : ''; ?>>America/New
                                    York
                                </option>
                                <option value="America/Los_Angeles" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'America/Los_Angeles') ? 'selected' : ''; ?>>
                                    America/Los
                                    Angeles</option>
                                <option value="Europe/London" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'Europe/London') ? 'selected' : ''; ?>>Europe/London
                                </option>
                                <option value="Europe/Paris" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'Europe/Paris') ? 'selected' : ''; ?>>Europe/Paris
                                </option>
                                <option value="Asia/Tokyo" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'Asia/Tokyo') ? 'selected' : ''; ?>>Asia/Tokyo
                                </option>
                                <option value="Asia/Dubai" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'Asia/Dubai') ? 'selected' : ''; ?>>Asia/Dubai
                                </option>
                                <option value="Asia/Kolkata" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'Asia/Kolkata') ? 'selected' : ''; ?>>Asia/Kolkata
                                </option>
                                <option value="Australia/Sydney" <?php echo (isset($currentSettings['timezone']) && $currentSettings['timezone'] == 'Australia/Sydney') ? 'selected' : ''; ?>>
                                    Australia/Sydney
                                </option>
                            </select>
                            <small style="color: var(--secondary);">Select your site's timezone</small>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Tab -->
                <div class="tab-content" id="dashboard-tab">
                    <div class="settings-section">
                        <h3 class="settings-section-title">Dashboard Statistics</h3>
                        <p class="settings-section-description">Select which statistic cards to display on the dashboard</p>

                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_stat_products]" value="0">
                                <input type="checkbox" name="settings[dash_stat_products]" value="1" <?php echo (!isset($currentSettings['dash_stat_products']) || $currentSettings['dash_stat_products']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Total Products</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_stat_categories]" value="0">
                                <input type="checkbox" name="settings[dash_stat_categories]" value="1" <?php echo (!isset($currentSettings['dash_stat_categories']) || $currentSettings['dash_stat_categories']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Categories</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_stat_pages]" value="0">
                                <input type="checkbox" name="settings[dash_stat_pages]" value="1" <?php echo (!isset($currentSettings['dash_stat_pages']) || $currentSettings['dash_stat_pages']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Published Pages</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_stat_posts]" value="0">
                                <input type="checkbox" name="settings[dash_stat_posts]" value="1" <?php echo (!isset($currentSettings['dash_stat_posts']) || $currentSettings['dash_stat_posts']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Blog Posts</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_stat_projects]" value="0">
                                <input type="checkbox" name="settings[dash_stat_projects]" value="1" <?php echo (!isset($currentSettings['dash_stat_projects']) || $currentSettings['dash_stat_projects']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Projects</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_stat_project_categories]" value="0">
                                <input type="checkbox" name="settings[dash_stat_project_categories]" value="1" <?php echo (!isset($currentSettings['dash_stat_project_categories']) || $currentSettings['dash_stat_project_categories']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Project Categories</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_stat_orders]" value="0">
                                <input type="checkbox" name="settings[dash_stat_orders]" value="1" <?php echo (!isset($currentSettings['dash_stat_orders']) || $currentSettings['dash_stat_orders']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Orders</span>
                            </label>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-title">Dashboard Widgets</h3>
                        <p class="settings-section-description">Select which widgets to display</p>

                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_recent]" value="0">
                                <input type="checkbox" name="settings[dash_widget_recent]" value="1" <?php echo (!isset($currentSettings['dash_widget_recent']) || $currentSettings['dash_widget_recent']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Recent Products Table</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_orders]" value="0">
                                <input type="checkbox" name="settings[dash_widget_orders]" value="1" <?php echo (!isset($currentSettings['dash_widget_orders']) || $currentSettings['dash_widget_orders']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Recent Orders</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_projects]" value="0">
                                <input type="checkbox" name="settings[dash_widget_projects]" value="1" <?php echo (!isset($currentSettings['dash_widget_projects']) || $currentSettings['dash_widget_projects']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Recent Projects</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_posts]" value="0">
                                <input type="checkbox" name="settings[dash_widget_posts]" value="1" <?php echo (!isset($currentSettings['dash_widget_posts']) || $currentSettings['dash_widget_posts']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Recent Blogs</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_project_categories]" value="0">
                                <input type="checkbox" name="settings[dash_widget_project_categories]" value="1" <?php echo (!isset($currentSettings['dash_widget_project_categories']) || $currentSettings['dash_widget_project_categories']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Project Categories List</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_product_categories]" value="0">
                                <input type="checkbox" name="settings[dash_widget_product_categories]" value="1" <?php echo (!isset($currentSettings['dash_widget_product_categories']) || $currentSettings['dash_widget_product_categories']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Product Categories List</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_quick]" value="0">
                                <input type="checkbox" name="settings[dash_widget_quick]" value="1" <?php echo (!isset($currentSettings['dash_widget_quick']) || $currentSettings['dash_widget_quick']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Quick Actions Widget (Enable/Disable Main Section)</span>
                            </label>
                        </div>
                        
                        <div class="settings-section" style="margin-top: 15px; margin-left: 20px; border-left: 2px solid var(--border); padding-left: 15px;">
                            <h5 style="margin: 0 0 10px 0; font-size: 0.95rem; color: var(--text);">Visible Buttons:</h5>
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="hidden" name="settings[dash_btn_product]" value="0">
                                    <input type="checkbox" name="settings[dash_btn_product]" value="1" <?php echo (!isset($currentSettings['dash_btn_product']) || $currentSettings['dash_btn_product']) ? 'checked' : ''; ?> style="width: 16px; height: 16px;">
                                    <span>Add New Product</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="hidden" name="settings[dash_btn_post]" value="0">
                                    <input type="checkbox" name="settings[dash_btn_post]" value="1" <?php echo (!isset($currentSettings['dash_btn_post']) || $currentSettings['dash_btn_post']) ? 'checked' : ''; ?> style="width: 16px; height: 16px;">
                                    <span>Write New Post</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="hidden" name="settings[dash_btn_project]" value="0">
                                    <input type="checkbox" name="settings[dash_btn_project]" value="1" <?php echo (!isset($currentSettings['dash_btn_project']) || $currentSettings['dash_btn_project']) ? 'checked' : ''; ?> style="width: 16px; height: 16px;">
                                    <span>Add New Project</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="hidden" name="settings[dash_btn_cat_prod]" value="0">
                                    <input type="checkbox" name="settings[dash_btn_cat_prod]" value="1" <?php echo (!isset($currentSettings['dash_btn_cat_prod']) || $currentSettings['dash_btn_cat_prod']) ? 'checked' : ''; ?> style="width: 16px; height: 16px;">
                                    <span>Add New Product Category</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="hidden" name="settings[dash_btn_cat_proj]" value="0">
                                    <input type="checkbox" name="settings[dash_btn_cat_proj]" value="1" <?php echo (!isset($currentSettings['dash_btn_cat_proj']) || $currentSettings['dash_btn_cat_proj']) ? 'checked' : ''; ?> style="width: 16px; height: 16px;">
                                    <span>Add New Project Category</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="hidden" name="settings[dash_btn_settings]" value="0">
                                    <input type="checkbox" name="settings[dash_btn_settings]" value="1" <?php echo (!isset($currentSettings['dash_btn_settings']) || $currentSettings['dash_btn_settings']) ? 'checked' : ''; ?> style="width: 16px; height: 16px;">
                                    <span>Settings</span>
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="hidden" name="settings[dash_widget_builder]" value="0">
                                <input type="checkbox" name="settings[dash_widget_builder]" value="1" <?php echo (!isset($currentSettings['dash_widget_builder']) || $currentSettings['dash_widget_builder']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                                <span>Page Builder Promo</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- E-commerce Tab -->
                <!-- E-commerce Tab -->
                <div class="tab-content" id="ecommerce-tab">
                    
                    <!-- Page Configuration (Moved to Top) -->
                     <div class="settings-section">
                        <h3 class="settings-section-title">Page Configuration</h3>
                        <p class="settings-section-description">Assign pages to store functions</p>

                        <div class="form-group">
                            <label class="form-label">Shop Page</label>
                            <select name="settings[page_shop_id]" class="form-input">
                                <option value="">-- Default (Virtual) --</option>
                                <?php foreach ($pagesList as $page): ?>
                                <option value="<?php echo $page['id']; ?>" <?php echo (isset($currentSettings['page_shop_id']) && $currentSettings['page_shop_id'] == $page['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($page['title']); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Main shop listing page. Leave empty to use default /shop</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Cart Page</label>
                            <select name="settings[page_cart_id]" class="form-input">
                                <option value="">-- Select Page --</option>
                                <?php foreach ($pagesList as $page): ?>
                                <option value="<?php echo $page['id']; ?>" <?php echo (isset($currentSettings['page_cart_id']) && $currentSettings['page_cart_id'] == $page['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($page['title']); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Page where users view their cart</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Checkout Page</label>
                            <select name="settings[page_checkout_id]" class="form-input">
                                <option value="">-- Select Page --</option>
                                <?php foreach ($pagesList as $page): ?>
                                <option value="<?php echo $page['id']; ?>" <?php echo (isset($currentSettings['page_checkout_id']) && $currentSettings['page_checkout_id'] == $page['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($page['title']); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Page where users complete their purchase</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Success Page</label>
                            <select name="settings[page_success_id]" class="form-input">
                                <option value="">-- Select Page --</option>
                                <?php foreach ($pagesList as $page): ?>
                                <option value="<?php echo $page['id']; ?>" <?php echo (isset($currentSettings['page_success_id']) && $currentSettings['page_success_id'] == $page['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($page['title']); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Page users are redirected to after successful payment</small>
                        </div>
                    </div>
                    <!-- Currency Settings -->
                    <div class="settings-section">
                        <h3 class="settings-section-title">Currency Settings</h3>
                        <p class="settings-section-description">Configure currency and pricing options</p>

                        <div class="form-group">
                            <label class="form-label">Currency</label>
                            <!-- Removed select2 class to ensure visibility -->
                            <select name="settings[currency]" class="form-input">
                                <?php 
                                // Ensure currencies are loaded
                                if (!isset($currencies)) {
                                    require_once __DIR__ . '/../includes/currencies.php';
                                }
                                foreach ($currencies as $code => $currency): 
                                ?>
                                <option value="<?php echo $code; ?>" <?php echo (isset($currentSettings['currency']) && $currentSettings['currency'] == $code) ? 'selected' : ''; ?>>
                                    <?php echo $code; ?> - <?php echo $currency['name']; ?> (<?php echo $currency['symbol']; ?>)
                                </option>
                                <?php endforeach; ?>
                            </select>
                            <small style="color: var(--secondary);">Select the currency for your e-commerce store</small>
                        </div>
                    </div>

                    <!-- Shop Settings -->
                    <div class="settings-section">
                        <h3 class="settings-section-title">Shop Settings</h3>
                        <p class="settings-section-description">Configure your online store</p>

                        <div class="form-group">
                            <label class="form-label">Products Per Page</label>
                            <input type="number" name="settings[products_per_page]" class="form-input" min="1" max="100" 
                                value="<?php echo htmlspecialchars($currentSettings['products_per_page'] ?? '12'); ?>">
                            <small style="color: var(--secondary);">Number of products to display per page</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Enable Shopping Cart</label>
                             <div style="margin-top: 10px;">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="hidden" name="settings[enable_cart]" value="0">
                                    <input type="checkbox" name="settings[enable_cart]" value="1" 
                                        <?php echo (!isset($currentSettings['enable_cart']) || $currentSettings['enable_cart'] == '1') ? 'checked' : ''; ?> 
                                        style="width: 18px; height: 18px;">
                                    <span>Enabled</span>
                                </label>
                            </div>
                            <small style="color: var(--secondary); display: block; margin-top: 5px;">Enable or disable the shopping cart functionality</small>
                        </div>
                    </div>


                </div>

                <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa fa-save"></i> Save Settings
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>


<!-- Media Modal Component -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>
<script>
    $(document).ready(function () {
        // Tab Switching
        $('.settings-tab').on('click', function () {
            const tab = $(this).data('tab');

            // Update active tab
            $('.settings-tab').removeClass('active');
            $(this).addClass('active');

            // Update active content
            $('.tab-content').removeClass('active');
            $(`#${tab}-tab`).addClass('active');

            // Save active tab to localStorage
            localStorage.setItem('activeSettingsTab', tab);
        });

        // Restore active tab from localStorage
        const savedTab = localStorage.getItem('activeSettingsTab');
        if (savedTab) {
            $(`.settings-tab[data-tab="${savedTab}"]`).click();
        }

        // Initialize Media Modal
        const galleryData = <?php echo json_encode($galleryImages ?? []); ?>; // Assuming galleryData is available? No, need to fetch via AJAX if not passed. 
        // Note: The previous code didn't use galleryData passed from PHP for modal init, it used apiUrl.
        // But for open(), we might want to pass data if available or let it fetch.
        // The previous implementation used mediaModal.open() without args, relying on API.

        // Wait, index.php doesn't seem to have $galleryImages defined in the viewed code.
        // Ah, checked the viewed file, it DOES NOT calculate $galleryImages.
        // The original code used mediaModal.open() without arguments.
        // The standard pattern uses mediaModal.open(galleryData).
        // I should stick to the pattern used in index.php originally or upgrade it.
        // Original: mediaModal.open(); -> This implies the modal fetches data itself or is empty.
        // Actually, looking at previous code, `mediaModal` was initialized with `apiUrl`.

        let activeInputId = null;

        const mediaModal = new MediaModal({
            apiUrl: '<?php echo base_url; ?>/api/media/list.php',
            onSelect: function (image) {
                if (activeInputId) {
                    $('#' + activeInputId).val(image.file_path);
                    updatePreview(activeInputId, image.file_path);
                }
            }
        });

        // Open modal
        $(document).on('click', '.select-image-btn', function (e) {
            e.preventDefault();
            activeInputId = $(this).data('target');
            mediaModal.open(); // Opening without pre-seeded data, will rely on API if implemented in MediaModal
        });

        // Remove image
        $(document).on('click', '.remove-image-btn', function (e) {
            e.preventDefault();
            const targetId = $(this).data('target');
            $('#' + targetId).val('');
            updatePreview(targetId, '');
        });


        function updatePreview(inputId, url) {
            const previewId = inputId + '_preview';
            const container = $('#' + previewId);
            const removeBtn = $(`.remove-image-btn[data-target="${inputId}"]`);

            // Custom sizing for logo vs favicon if needed, but standardizing styles is safer.
            // Using logic from standard files:
            let imgStyle = "width: 100%; height: 100%; object-fit: cover;";
            if (inputId === 'site_logo') {
                imgStyle = "max-width: 100%; max-height: 100%; object-fit: contain;";
            } else if (inputId === 'favicon') {
                imgStyle = "width: 32px; height: 32px; object-fit: contain;";
            }

            if (url) {
                container.html(`<img src="${url}" style="${imgStyle}">`);
                removeBtn.show();
            } else {
                if (inputId === 'site_logo') {
                    container.html('<span style="color: #64748b; font-size: 0.9rem;">No logo</span>');
                } else if (inputId === 'favicon') {
                    container.html('<span style="color: #64748b; font-size: 0.8rem;">No icon</span>');
                } else {
                    container.html('<span style="color: #64748b; font-size: 0.9rem;">No image</span>');
                }
                removeBtn.hide();
            }
        }
    });

    function updateResearchToolLink() {
        const toolSelect = document.getElementById('keyword_research_tool');
        if (!toolSelect) return;
        
        const tool = toolSelect.value;
        const linkBtn = document.getElementById('keyword_tool_link');
        let url = '';

        switch (tool) {
            case 'google':
                url = 'https://ads.google.com/home/tools/keyword-planner/';
                break;
            case 'semrush':
                url = 'https://www.semrush.com/analytics/keywordmagic/start';
                break;
            case 'ahrefs':
                url = 'https://ahrefs.com/keywords-explorer';
                break;
            case 'moz':
                url = 'https://moz.com/explorer';
                break;
            case 'ubersuggest':
                url = 'https://neilpatel.com/ubersuggest/';
                break;
        }

        if (url) {
            linkBtn.href = url;
            linkBtn.style.display = 'inline-flex';
            linkBtn.style.alignItems = 'center';
            linkBtn.style.gap = '5px';
        } else {
            linkBtn.style.display = 'none';
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        updateResearchToolLink();
    });

    // Keyword Ideas Logic
    function fetchKeywordIdeas() {
        const seed = document.getElementById('seed_keyword').value.trim();
        const container = document.getElementById('keyword_ideas_container');
        
        if (!seed) {
            alert('Please enter a topic first.');
            return;
        }

        container.innerHTML = '<span style="color: var(--secondary);"><i class="fa fa-spinner fa-spin"></i> Finding ideas...</span>';

        fetch('<?php echo base_url; ?>/api/seo/suggestions.php?q=' + encodeURIComponent(seed))
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                
                if (data.suggestions && data.suggestions.length > 0) {
                    data.suggestions.forEach(keyword => {
                        const tag = document.createElement('div');
                        tag.style.cssText = `
                            padding: 6px 12px;
                            background: white;
                            border: 1px solid #cbd5e1;
                            border-radius: 20px;
                            font-size: 0.9rem;
                            cursor: pointer;
                            transition: all 0.2s;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        `;
                        tag.innerHTML = `<span>${keyword}</span> <i class="fa fa-plus" style="font-size: 10px; opacity: 0.5;"></i>`;
                        
                        tag.onmouseover = () => { tag.style.borderColor = '#3b82f6'; tag.style.color = '#3b82f6'; };
                        tag.onmouseout = () => { tag.style.borderColor = '#cbd5e1'; tag.style.color = 'var(--text)'; };
                        
                        tag.onclick = () => addKeywordToTarget(keyword);
                        
                        container.appendChild(tag);
                    });
                } else {
                    container.innerHTML = '<span style="color: var(--secondary);">No suggestions found. Try a different topic.</span>';
                }
            })
            .catch(err => {
                console.error(err);
                container.innerHTML = '<span style="color: #ef4444;">Error fetching suggestions.</span>';
            });
    }

    function addKeywordToTarget(keyword) {
        const textarea = document.getElementById('target_keywords');
        let current = textarea.value.trim();
        
        // Prevent duplicates (simple check)
        const parts = current.split(',').map(s => s.trim());
        if (parts.includes(keyword)) return;

        if (current.length > 0 && !current.endsWith(',')) {
            current += ', ';
        }
        
        textarea.value = current + keyword;
        
        // Visual feedback
        // alert('Added: ' + keyword);
    }
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>