<?php
session_start();

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Simple .env parser
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

// Load env variables from root directory
$env = loadEnv(__DIR__ . '/../.env');
$appUrl = isset($env['APP_URL']) ? rtrim($env['APP_URL'], '/') : '';

// Get Page/Post ID and Content
$id = $_GET['id'] ?? null;
$type = $_GET['type'] ?? 'page'; // 'page' or 'post'

$pageData = [];
$pageTitle = 'Untitled';
$pageSlug = '';

// DB Connection
require_once __DIR__ . '/../includes/db.php';
$pdo = getDBConnection();

// Determine Table
$table = 'pages';
if ($type === 'post')
    $table = 'posts';
if ($type === 'project')
    $table = 'projects';
if ($type === 'header')
    $table = 'headers';
if ($type === 'footer')
    $table = 'footers';
if ($type === 'topbar')
    $table = 'topbars';
if ($type === 'mobile_menu')
    $table = 'mobile_menus';

if (!in_array($table, ['pages', 'posts', 'projects', 'headers', 'footers', 'topbars', 'mobile_menus']))
    $table = 'pages';

// Lookup by slug if provided
if (!$id && isset($_GET['page'])) {
    $slug = $_GET['page'];
    $stmtSlug = $pdo->prepare("SELECT id FROM $table WHERE slug = ?");
    $stmtSlug->execute([$slug]);
    $found = $stmtSlug->fetch();
    if ($found)
        $id = $found['id'];
}

if ($id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        if ($item) {
            $pageTitle = $item['title'] ?? $item['name'] ?? 'Untitled';
            $pageSlug = $item['slug'] ?? '';
            $pageData = json_decode($item['content'] ?? '[]', true);
        }
    } catch (Exception $e) {
        // Handle error
    }
} else {
    // If no ID, maybe redirect to create page or show error?
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Builder -
        <?php echo htmlspecialchars($pageTitle); ?>
    </title>
    <script>
        const PAGE_ID = <?php echo json_encode($id); ?>;
        const ITEM_TYPE = <?php echo json_encode($type); ?>;
        const PAGE_SLUG = <?php echo json_encode($pageSlug); ?>;
        const INITIAL_DATA = <?php echo json_encode($pageData); ?>;
        const API_URL = "api/save-page.php";
        const SAVE_ALL_URL = "api/save-all.php";
        window.CMS_API_BASE = '../api/';
    </script>


    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Page Builder CSS -->
    <link rel="stylesheet" href="../assets/css/page-builder.css">
    <link rel="stylesheet" href="../assets/css/toast.css">
    <link rel="stylesheet" href="../assets/css/menu-control.css">
    <script src="../assets/core/Toast.js"></script>

    <?php
    // Fetch Settings for theme
    $settings = [];
    $stmtSettings = $pdo->query("SELECT * FROM settings");
    while ($row = $stmtSettings->fetch()) {
        $settings[$row['key_name']] = $row['value'];
    }

    // Set basePath for theme includes
    $basePath = '..';
    ?>

    <!-- Theme CSS -->
    <?php if (!empty($settings['active_theme'])): ?>
        <!-- Main theme stylesheet (includes all theme CSS files) -->
        <?php include_once '../theme/' . $settings['active_theme'] . '/index.php'; ?>
    <?php endif; ?>

    <!-- Generated CSS Files for Preview -->
    <?php
    // Load generated CSS file for current item being edited
    if ($type && $id) {
        $cssFile = null;

        // Get CSS file path from database based on type
        if ($type === 'header') {
            $stmt = $pdo->prepare("SELECT css_file FROM headers WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $cssFile = $row['css_file'] ?? null;
        } elseif ($type === 'footer') {
            $stmt = $pdo->prepare("SELECT css_file FROM footers WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $cssFile = $row['css_file'] ?? null;
        } elseif ($type === 'page' || $type === 'post' || $type === 'project') {
            $table = $type === 'post' ? 'posts' : ($type === 'project' ? 'projects' : 'pages');
            $stmt = $pdo->prepare("SELECT css_file FROM {$table} WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $cssFile = $row['css_file'] ?? null;
        }

        // Output CSS link if file exists
        if ($cssFile) {
            $fullPath = __DIR__ . '/../' . $cssFile;
            if (file_exists($fullPath)) {
                $version = filemtime($fullPath);
                echo '<link rel="stylesheet" href="../' . htmlspecialchars($cssFile) . '?v=' . $version . '">' . "\n";
            }
        }
    }
    ?>

    <!-- Control System CSS (if needed) -->
    <style>
        /* Additional control styles */
        .elementor-control {
            margin-bottom: 20px;
            width: 100%;
        }

        .elementor-control-label label {
            font-size: 13px;
            font-weight: 500;
            color: #475569;
            display: block;
            margin-bottom: 8px;
        }

        .elementor-control-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 13px;
            height: 30px;
        }

        select.elementor-control-input {
            cursor: pointer;
            height: 35px !important;
        }

        .elementor-control-input:focus {
            outline: none;
            border-color: #3b82f6;
        }

        select.elementor-control-input {
            cursor: pointer;
        }

        textarea.elementor-control-input {
            min-height: 100px;
            resize: vertical;
        }

        /* Settings tab content styles */
        .settings-tab-content {
            display: none;
        }

        .settings-tab-content.active {
            display: block;
        }

        .control-section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
        }

        .section-content {
            padding-left: 10px;
        }

        /* Icon Picker Styles - Simple Box */
        .icon-box {
            position: relative;
            width: 100px;
            height: 100px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            overflow: hidden;
        }

        .icon-box:hover {
            border-color: #3b82f6;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }

        .icon-selected {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 32px;
            color: #3b82f6;
        }

        .icon-hover {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
            font-size: 12px;
            font-weight: 500;
        }

        .icon-box:hover .icon-hover {
            opacity: 1;
        }

        .icon-trashs {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 24px;
            height: 24px;
            background: #ef4444;
            color: white;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 10;
        }

        .icon-box:hover .icon-trashs {
            opacity: 1;
        }

        .icon-trashs:hover {
            background: #dc2626;
        }

        /* Icon Modal Gallery Styles */
        .icon-item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            background: #fff;
        }

        .icon-item:hover {
            border-color: #3b82f6;
            background: #eff6ff;
            transform: scale(1.05);
        }

        .icon-item.selected {
            border-color: #3b82f6;
            background: #3b82f6;
            color: #fff;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .icon-item.selected i {
            color: #fff;
        }

        .icon-item i {
            font-size: 24px;
            color: #64748b;
        }

        /* Icon Modal Category Tabs */
        .media-modal-tabs {
            padding: 15px 20px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }

        .modal-category-list {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .modal-category-list span {
            padding: 8px 16px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }

        .modal-category-list span:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            color: #475569;
            transform: translateY(-1px);
        }

        .modal-category-list span.selected {
            background: #3b82f6;
            border-color: #3b82f6;
            color: #ffffff;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .modal-category-list span.selected:hover {
            background: #2563eb;
            border-color: #2563eb;
            transform: translateY(-1px);
        }

        .modal-category-list span:active {
            transform: translateY(0);
        }
    </style>

    <!-- Repeater Styles -->
    <link rel="stylesheet" href="../assets/css/repeater-styles.css">

    <style>
        /* Layers Modal Styles */
        .draggable-modal {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 300px;
            height: 400px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            border: 1px solid #e2e8f0;
        }

        .draggable-header {
            padding: 10px 15px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }

        .draggable-header span {
            font-weight: 600;
            color: #475569;
            font-size: 14px;
        }

        .close-modal {
            background: none;
            border: none;
            cursor: pointer;
            color: #94a3b8;
            padding: 4px;
        }

        .close-modal:hover {
            color: #ef4444;
        }

        .draggable-content {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }

        /* Layer Tree Styles */
        .layer-tree {
            font-size: 13px;
        }

        .layer-node {
            padding: 6px 8px;
            cursor: pointer;
            border-radius: 4px;
            display: flex;
            align-items: center;
            color: #475569;
            margin-bottom: 2px;
        }

        .layer-node:hover {
            background: #f1f5f9;
        }

        .layer-node.active {
            background: #eff6ff;
            color: #3b82f6;
        }

        .layer-node i {
            width: 20px;
            text-align: center;
            margin-right: 8px;
            color: #94a3b8;
        }

        .layer-node.active i {
            color: #3b82f6;
        }

        .layer-children {
            padding-left: 20px;
            border-left: 1px solid #e2e8f0;
            margin-left: 10px;
        }

        /* Layer Drag-Drop Styles */
        .layer-drag-handle {
            opacity: 0;
            transition: opacity 0.2s;
        }

        .layer-node:hover .layer-drag-handle {
            opacity: 1;
        }

        .layer-node[draggable="true"] {
            cursor: grab;
        }

        .layer-node.dragging-layer {
            opacity: 0.5;
            cursor: grabbing;
        }

        /* Drop Indicator */
        .layer-drop-indicator {
            height: 2px;
            background: #2563eb;
            margin: 2px 0;
            position: relative;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
            animation: dropIndicatorPulse 1s infinite;
        }

        @keyframes dropIndicatorPulse {

            0%,
            100% {
                opacity: 0.8;
            }

            50% {
                opacity: 1;
            }
        }

        .layer-drop-indicator::before,
        .layer-drop-indicator::after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            background: #2563eb;
            border-radius: 50%;
        }

        .layer-drop-indicator::before {
            left: -3px;
        }

        .layer-drop-indicator::after {
            right: -3px;
        }

        /* Drop Target Highlight */
        .layer-node.layer-drop-target {
            background: rgba(37, 99, 235, 0.1);
            border-left: 3px solid #2563eb;
            padding-left: 5px;
        }

        /* Column Node Styling */
        .layer-node.layer-column-node {
            font-size: 12px;
            font-weight: 500;
            background: #f8fafc;
            border-left: 2px solid #cbd5e1;
            padding: 4px 8px;
            margin: 2px 0;
        }

        .layer-node.layer-column-node:hover {
            background: #f1f5f9;
        }
    </style>
</head>

<body class="builder-mode builder-page">
    <div class="page-builder">
        <!-- Top Bar -->
        <div class="top-bar">
            <div class="top-bar-left">
                <div class="logo">
                    <a href="/admin/pages/" style="text-decoration: none; color: inherit;">
                        <i class="fa fa-cube"></i>
                        <?php echo isset($env['APP_NAME']) ? $env['APP_NAME'] : 'PageBuilder'; ?>
                    </a>
                </div>
                <div class="page-title">
                    <?php echo htmlspecialchars($pageTitle); ?>
                </div>
            </div>

            <div class="top-bar-center">
                <div class="device-switcher">
                    <button class="device-btn active" data-device="desktop" title="Desktop">
                        <i class="fa fa-desktop"></i>
                    </button>
                    <button class="device-btn" data-device="tablet" title="Tablet">
                        <i class="fa fa-tablet-alt"></i>
                    </button>
                    <button class="device-btn" data-device="mobile" title="Mobile">
                        <i class="fa fa-mobile-alt"></i>
                    </button>
                </div>
            </div>

            <div class="top-bar-right">
                <button class="btn btn-secondary" id="btn-layers" title="Layers">
                    <i class="fa fa-layer-group"></i>
                </button>
                <button class="btn btn-secondary" id="btn-undo" title="Undo">
                    <i class="fa fa-undo"></i>
                </button>
                <button class="btn btn-secondary" id="btn-redo" title="Redo">
                    <i class="fa fa-redo"></i>
                </button>
                <button class="btn btn-secondary" id="btn-preview">
                    <i class="fa fa-eye"></i> Preview
                </button>
                <button class="btn btn-secondary" id="btn-save-all" title="Save All Changes">
                    <i class="fa fa-save"></i> Save All
                </button>
                <button class="btn btn-primary" id="btn-save">
                    <i class="fa fa-save"></i> Save
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Left Panel - Widgets -->
            <div class="left-panel">
                <div class="panel-header">
                    <div class="panel-title">Widgets</div>
                    <div class="search-box">
                        <i class="fa fa-search"></i>
                        <input type="text" id="widget-search" placeholder="Search widgets...">
                    </div>
                </div>

                <div class="widgets-list" id="widgets-list">
                    <!-- Widgets will be rendered here -->
                </div>
            </div>

            <!-- Center Canvas -->
            <div class="canvas-panel">
                <div class="canvas-wrapper">
                    <div class="canvas-container">
                        <div id="canvas-area">
                            <div class="canvas-empty">
                                <div>
                                    <i class="fa fa-cube"></i>
                                    <div>Drag widgets from the left panel to start building</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel - Settings -->
            <div class="right-panel">
                <div class="settings-header">
                    <div class="settings-title" id="settings-widget-title">Widget Settings</div>
                </div>

                <div class="settings-tabs">
                    <button class="settings-tab active" data-tab="content">
                        <i class="fa fa-file-alt"></i> Content
                    </button>
                    <button class="settings-tab" data-tab="style">
                        <i class="fa fa-paint-brush"></i> Style
                    </button>
                    <button class="settings-tab" data-tab="advanced">
                        <i class="fa fa-cog"></i> Advanced
                    </button>
                </div>

                <div class="settings-content" id="settings-content">
                    <div class="settings-empty">
                        <div>
                            <i class="fa fa-mouse-pointer"></i>
                            <div>Select a widget to edit its settings</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Load Utilities -->
    <script src="../assets/fields/utils/EventEmitter.js"></script>
    <script src="../assets/fields/utils/Validator.js"></script>
    <script src="../assets/fields/utils/Conditions.js"></script>

    <!-- Load Control System -->
    <script src="../assets/fields/BaseControl.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/text-new.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/textarea.js?v=<?php echo time() + 1; ?>"></script>
    <script src="../assets/fields/slider.js?v=<?php echo time() + 1; ?>"></script>
    <script src="../assets/fields/color.js?v=<?php echo time() + 1; ?>"></script>
    <script src="../assets/fields/select.js?v=<?php echo time() + 1; ?>"></script>
    <script src="../assets/fields/media.js?v=<?php echo time() + 1; ?>"></script>
    <script src="../assets/fields/ckeditor.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/repeater.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/menu.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/icon.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/core/admin-modal-icon.js"></script>
    <script src="../assets/fields/url.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/width.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/height.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/fields/ControlManager.js?v=<?php echo time(); ?>"></script>

    <!-- Core Scripts -->
    <script src="../assets/core/EcommerceManager.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/core/WidgetManager.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/core/CSSGenerator.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/core/ElementManager.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/core/DragDropManager.js?v=<?php echo time(); ?>"></script>
    <script src="../assets/core/register-widgets.js?v=<?php echo time(); ?>"></script>

    <!-- Load Widgets -->
    <?php
    $widgetBasePath = '../assets/widgets';
    include '../assets/widgets/widget-loader.php';
    ?>

    <!-- Main Page Builder Script -->
    <script>
        // Global error handler
        window.onerror = function (msg, url, line, col, error) {
            window.onerror = function (msg, url, line, col, error) {
                // Toast.error("Error: " + msg + "\nLine: " + line); // Use toast? native alert is better for fatal errors
                // Keep alert for fatal errors or use console
                console.error("Global Error:", msg, error);
                // Toast.error("A system error occurred. Check console.");
                return false;
            };
            console.error("Global Error:", msg, error);
            return false;
        };

        // Initialize managers
        const widgetManager = window.elementorWidgetManager;
        const elementManager = window.elementorElementManager;
        const dragDropManager = window.elementorDragDropManager;
        const controlManager = window.elementorControlManager;

        try {
            if (!widgetManager) throw new Error("WidgetManager not loaded");
            if (!elementManager) throw new Error("ElementManager not loaded");
            if (!dragDropManager) throw new Error("DragDropManager not loaded");
            if (!controlManager) throw new Error("ControlManager not loaded");

            // Debug: Check if ICON control is registered
            console.log('=== ICON Control Debug ===');
            console.log('ICON class exists:', typeof ICON !== 'undefined');
            console.log('window.ICON exists:', typeof window.ICON !== 'undefined');
            console.log('ICON extends BaseControl:', ICON && ICON.prototype instanceof BaseControl);
            console.log('Control types registered:', Array.from(controlManager.controlTypes.keys()));
            console.log('========================');

            // Initialize
            widgetManager.init();
            controlManager.init();
            dragDropManager.init();

            // Register widgets

            // Load and Register all widgets from shared file
            if (typeof registerAllWidgets === 'function') {
                registerAllWidgets(widgetManager);
            } else {
                console.error("registerAllWidgets function not found!");
                Toast.error("Failed to register widgets");
            }

        } catch (e) {
            Toast.error("Init Error: " + e.message);
            console.error(e);
        }


        // Render widgets panel
        function renderWidgetsPanel() {
            const categories = widgetManager.getCategories();
            console.log('Rendering categories:', categories);

            const $widgetsList = $('#widgets-list');
            $widgetsList.empty();

            categories.forEach(category => {
                const widgets = widgetManager.getWidgetsByCategory(category.name);
                console.log(`Widgets in category ${category.name}:`, widgets.length);

                if (widgets.length === 0) return;

                const $category = $(`
                    <div class="widget-category">
                        <div class="category-title">
                            <i class="${category.icon}"></i> ${category.title}
                        </div>
                        <div class="widgets-grid" id="category-${category.name}"></div>
                    </div>
                `);

                const $grid = $category.find('.widgets-grid');

                widgets.forEach(widget => {
                    const $card = $(`
                        <div class="widget-card" draggable="true" data-widget="${widget.name}">
                            <i class="${widget.icon}"></i>
                            <span>${widget.title}</span>
                        </div>
                    `);
                    $grid.append($card);
                });

                $widgetsList.append($category);
            });
        }

        // Call render immediately after registration
        renderWidgetsPanel();

        // Render canvas
        function renderCanvas() {
            const rootElements = elementManager.getRootElements();
            const $canvas = $('#canvas-area');
            $canvas.empty();

            if (rootElements.length === 0) {
                $canvas.html(`
                    <div class="canvas-empty">
                        <div>
                            <i class="fa fa-cube"></i>
                            <div>Drag widgets from the left panel to start building</div>
                        </div>
                    </div>
                `);
                // Need to re-init drop zones for empty state
                dragDropManager.initDropZones();
                return;
            }

            // Recursive render function
            function renderElementsRecursively(elements, $container) {
                elements.forEach(element => {
                    // Debug log
                    if (element.type === 'stats_card') {
                        console.log('RenderLoop:', { id: element.id, settingsIcon: element.settings.icon, widgetSettingsIcon: element.widget.getSettings().icon });
                    }

                    const $elementWrapper = createElementWrapper(element);
                    $container.append($elementWrapper);

                    // Check if element is a container (has slots)
                    const $slots = $elementWrapper.find('.elementor-container-slot');

                    if ($slots.length > 0) {
                        $slots.each(function () {
                            const $slot = $(this);
                            const containerIndex = parseInt($slot.data('container-index'));
                            const children = elementManager.getChildren(element.id, containerIndex);

                            // Render children into this slot
                            if (children.length > 0) {
                                renderElementsRecursively(children, $slot);
                            }
                        });
                    }
                });
            }

            renderElementsRecursively(rootElements, $canvas);

            // Re-init drop zones after rendering
            dragDropManager.initDropZones();
        }

        function createElementWrapper(element) {
            const settings = element.settings || {};

            // Build style string
            let styles = '';

            // Apply Margin
            if (settings.margin) {
                const m = settings.margin;
                const unit = m.unit || 'px';
                if (m.top) styles += `margin-top: ${m.top}${unit}; `;
                if (m.right) styles += `margin-right: ${m.right}${unit}; `;
                if (m.bottom) styles += `margin-bottom: ${m.bottom}${unit}; `;
                if (m.left) styles += `margin-left: ${m.left}${unit}; `;
            }

            // Apply Padding
            if (settings.padding) {
                const p = settings.padding;
                const unit = p.unit || 'px';
                if (p.top) styles += `padding-top: ${p.top}${unit}; `;
                if (p.right) styles += `padding-right: ${p.right}${unit}; `;
                if (p.bottom) styles += `padding-bottom: ${p.bottom}${unit}; `;
                if (p.left) styles += `padding-left: ${p.left}${unit}; `;
            }

            return $(`
                <div class="element-wrapper" 
                     data-element-id="${element.id}" 
                     draggable="true"
                     style="${styles}">
                    <div class="element-controls">
                        <button class="edit-element" title="Edit">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="duplicate-element" title="Duplicate">
                            <i class="fa fa-copy"></i>
                        </button>
                        <button class="delete-element" title="Delete">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                    <div class="element-content">
                        ${element.widget.render()}
                    </div>
                </div>
            `);
        }

        // Helper to update widget CSS live
        function updateComponentCSS(elementId) {
            if (!window.cssGenerator) return;

            const element = elementManager.getElement(elementId);
            if (!element) return;

            try {
                const css = window.cssGenerator.generateWidgetCSS(
                    elementId,
                    element.widget.getName(),
                    element.settings,
                    element.widget.getControls()
                );

                // Inject into head
                let styleTag = document.getElementById(`widget-css-${elementId}`);
                if (!styleTag) {
                    styleTag = document.createElement('style');
                    styleTag.id = `widget-css-${elementId}`;
                    document.head.appendChild(styleTag);
                }
                styleTag.textContent = css;
                console.log(`Updated live CSS for widget ${elementId}`);
            } catch (e) {
                console.error('Error updating live CSS:', e);
            }
        }

        // Render settings panel
        function renderSettings(elementId) {
            // Set global selected element ID
            window.selectedElementId = elementId;
            console.log('Selected element ID set to:', elementId);

            // Clear existing controls to prevent ID collisions and stale references from previous renders
            if (window.elementorControlManager) {
                window.elementorControlManager.controls.forEach(control => {
                    if (control.destroy) control.destroy();
                });
                window.elementorControlManager.controls.clear();
                window.elementorControlManager.values = {};
            }

            const element = elementManager.getElement(elementId);

            if (!element) {
                $('#settings-content').html(`
                    <div class="settings-empty">
                        <div>
                            <i class="fa fa-mouse-pointer"></i>
                            <div>Select a widget to edit its settings</div>
                        </div>
                    </div>
                `);
                return;
            }

            $('#settings-widget-title').text(`${element.widget.getTitle()} Settings`);

            const controls = element.widget.getControls();
            const $content = $('#settings-content');
            $content.empty();

            // Group controls by tab
            const controlsByTab = {
                content: [],
                style: [],
                advanced: []
            };

            let currentTab = 'content';
            let currentSection = null;

            controls.forEach(control => {
                if (control.type === 'section') {
                    currentSection = {
                        id: control.id,
                        label: control.label,
                        tab: control.tab || 'content',
                        controls: []
                    };
                    controlsByTab[currentSection.tab].push(currentSection);
                } else if (control.type === 'section_end') {
                    currentSection = null;
                } else if (currentSection) {
                    currentSection.controls.push(control);
                } else {
                    // Control without a section, add to default tab
                    controlsByTab[control.tab || 'content'].push(control);
                }
            });

            // Render tab content
            Object.keys(controlsByTab).forEach(tabName => {
                const $tabContent = $(`<div class="settings-tab-content" data-tab="${tabName}"></div>`);

                controlsByTab[tabName].forEach(item => {
                    if (item.controls) {
                        // This is a section
                        const $section = $(`
                            <div class="control-section" data-section="${item.id}">
                                <h3 class="section-title">${item.label}</h3>
                                <div class="section-content"></div>
                            </div>
                        `);
                        const $sectionContent = $section.find('.section-content');

                        item.controls.forEach(control => {
                            const $control = renderControl(control, element, elementId);
                            $sectionContent.append($control);
                        });

                        $tabContent.append($section);
                    } else {
                        // This is a standalone control
                        const $control = renderControl(item, element, elementId);
                        $tabContent.append($control);
                    }
                });

                $content.append($tabContent);
            });

            // Show the first tab by default
            $content.find('.settings-tab-content[data-tab="content"]').addClass('active');

            // Set the first tab button as active
            $('.settings-tab').removeClass('active');
            $('.settings-tab[data-tab="content"]').addClass('active');
        }

        // Helper function to render a single control
        function renderControl(control, element, elementId) {
            let value = element.settings[control.id];

            // Handle undefined values by falling back to default
            if (value === undefined || value === null) {
                value = control.default_value || '';
            }

            // For HTML tag specifically, ensure it has a default
            if (control.id === 'html_tag' && !value) {
                value = 'h2';
            }

            if (control.type === 'media') {
                // Use MediaControl class for rendering
                const mediaControl = new MediaControl(control.id, {
                    ...control,
                    value: value
                });

                // Render HTML with wrapper
                const html = mediaControl.renderWithWrapper();
                const $control = $(html);

                // Initialize (calls setupListeners and onInit)
                mediaControl.init();

                // Bridge change event
                mediaControl.on('change', (newVal) => {
                    const newSettings = {
                        ...element.settings,
                        [control.id]: newVal
                    };
                    elementManager.updateElement(elementId, newSettings);
                    renderCanvas();
                    updateComponentCSS(elementId);
                });

                return $control; // Return the control element
            }

            // Handle icon control type
            if (control.type === 'icon') {
                // Use ICON class for rendering
                const iconControl = new ICON(control.id, {
                    ...control,
                    value: value,
                    element_id: elementId // Pass element ID
                });

                // Render HTML with wrapper
                const html = iconControl.renderWithWrapper();
                const $control = $(html);

                // Initialize (calls setupListeners)
                iconControl.init();

                // Bridge change event
                iconControl.on('change', (newVal) => {
                    const newSettings = {
                        ...element.settings,
                        [control.id]: newVal
                    };
                    elementManager.updateElement(elementId, newSettings);
                    renderCanvas();
                    updateComponentCSS(elementId);
                });

                return $control; // Return the control element
            }


            if (control.type === 'repeater' && typeof REPEATER !== 'undefined') {
                // Instantiate directly to ensure ID consistency
                const repeaterControl = new REPEATER(control.id, {
                    ...control,
                    value: value || control.default_value || []
                });

                if (repeaterControl) {
                    const html = repeaterControl.renderWithWrapper();
                    const $control = $(html);

                    // Initialize explicitly after a tick to ensure DOM presence
                    setTimeout(() => {
                        repeaterControl.init();
                    }, 10);

                    repeaterControl.on('change', (newVal) => {
                        const newSettings = {
                            ...element.settings,
                            [control.id]: newVal
                        };
                        elementManager.updateElement(elementId, newSettings);
                        renderCanvas();
                        updateComponentCSS(elementId);
                    });

                    return $control;
                }
            }

            // Handle width and height controls using ControlManager
            if ((control.type === 'width' || control.type === 'height') && typeof controlManager !== 'undefined') {
                const controlInstance = controlManager.createControl(control.id, control.type, {
                    ...control,
                    value: value || control.default_value || { size: '', unit: 'px' }
                });

                if (controlInstance) {
                    const html = controlInstance.renderWithWrapper();
                    const $control = $(html);

                    // Initialize after DOM is ready
                    setTimeout(() => {
                        controlInstance.init();
                    }, 10);

                    // Listen for changes
                    controlInstance.on('change', (newVal) => {
                        const newSettings = {
                            ...element.settings,
                            [control.id]: newVal
                        };
                        elementManager.updateElement(elementId, newSettings);
                        renderCanvas();
                        updateComponentCSS(elementId);
                    });

                    return $control;
                }
            }

            if (control.type === 'menu' && typeof MenuControl !== 'undefined') {
                // Instantiate menu control
                const menuControl = new MenuControl(control.id, {
                    ...control,
                    value: value || control.default_value || []
                });

                if (menuControl) {
                    const html = menuControl.renderWithWrapper();
                    const $control = $(html);

                    // Initialize after DOM is ready
                    setTimeout(() => {
                        menuControl.init();
                    }, 10);

                    menuControl.on('change', (newVal) => {
                        const newSettings = {
                            ...element.settings,
                            [control.id]: newVal
                        };
                        elementManager.updateElement(elementId, newSettings);
                        renderCanvas();
                    });

                    return $control;
                }
            }

            let inputHtml = '';

            if (control.type === 'text' || control.type === 'url') {
                inputHtml = `<input type="text" class="elementor-control-input" id="${control.id}" value="${value}">`;
            } else if (control.type === 'textarea') {
                inputHtml = `<textarea class="elementor-control-input" id="${control.id}">${value}</textarea>`;
            } else if (control.type === 'select') {
                const options = control.options.map(opt => {
                    // Handle complex default values (like font_size object)
                    let isSelected = false;
                    if (typeof value === 'object' && value !== null) {
                        isSelected = opt.value === value.value || opt.value === value.size;
                    } else {
                        isSelected = opt.value === value;
                    }
                    return `<option value="${opt.value}" ${isSelected ? 'selected' : ''}>${opt.label}</option>`;
                }).join('');
                inputHtml = `<select class="elementor-control-input" id="${control.id}">${options}</select>`;
            } else if (control.type === 'color') {
                inputHtml = `<input type="color" class="elementor-control-input" id="${control.id}" value="${value}">`;
            } else if (control.type === 'slider') {
                // Handle slider controls with responsive values
                let sliderValue = value;
                let sliderUnit = 'px';

                if (typeof value === 'object' && value !== null) {
                    sliderValue = value.size || value.value || 32;
                    sliderUnit = value.unit || 'px';
                }

                inputHtml = `
                    <div class="elementor-control-input-wrapper">
                        <input type="range" class="slider-input elementor-control-input" id="${control.id}"
                               min="${control.range?.min || 0}" max="${control.range?.max || 100}"
                               step="${control.range?.step || 1}" value="${sliderValue}">
                        <div class="slider-value">${sliderValue}${sliderUnit}</div>
                    </div>
                `;
            } else if (control.type === 'dimensions') {
                const defaults = { top: '', right: '', bottom: '', left: '', unit: 'px', isLinked: true };
                const val = (typeof value === 'object' && value !== null) ? { ...defaults, ...value } : defaults;

                inputHtml = `
                    <div class="elementor-control-dimensions" id="${control.id}">
                        <div class="dimensions-inputs" style="display: flex; gap: 5px;">
                            <div class="dimension-field">
                                <input type="number" class="dimension-input" data-side="top" value="${val.top}" placeholder="0">
                                <label style="font-size: 10px; color: #aaa; display: block; text-align: center;">TOP</label>
                            </div>
                            <div class="dimension-field">
                                <input type="number" class="dimension-input" data-side="right" value="${val.right}" placeholder="0">
                                <label style="font-size: 10px; color: #aaa; display: block; text-align: center;">RIGHT</label>
                            </div>
                            <div class="dimension-field">
                                <input type="number" class="dimension-input" data-side="bottom" value="${val.bottom}" placeholder="0">
                                <label style="font-size: 10px; color: #aaa; display: block; text-align: center;">BOTTOM</label>
                            </div>
                            <div class="dimension-field">
                                <input type="number" class="dimension-input" data-side="left" value="${val.left}" placeholder="0">
                                <label style="font-size: 10px; color: #aaa; display: block; text-align: center;">LEFT</label>
                            </div>
                            <div class="dimension-link" style="display: flex; align-items: center; justify-content: center;">
                                <button class="btn-link ${val.isLinked ? 'active' : ''}" style="border: none; background: none; cursor: pointer; color: ${val.isLinked ? '#3b82f6' : '#94a3b8'};">
                                    <i class="fa fa-link"></i>
                                </button>
                            </div>
                        </div>
                        <div class="dimensions-unit" style="margin-top: 5px; text-align: right;">
                             <select class="dimension-unit-select" style="font-size: 11px; padding: 2px;">
                                <option value="px" ${val.unit === 'px' ? 'selected' : ''}>PX</option>
                                <option value="%" ${val.unit === '%' ? 'selected' : ''}>%</option>
                                <option value="em" ${val.unit === 'em' ? 'selected' : ''}>EM</option>
                                <option value="rem" ${val.unit === 'rem' ? 'selected' : ''}>REM</option>
                             </select>
                        </div>
                    </div>
                `;
            } else {
                inputHtml = `<input type="text" class="elementor-control-input" id="${control.id}" value="${value}">`;
            }

            const $control = $(`
                <div class="elementor-control">
                    <div class="elementor-control-label">
                        <label for="${control.id}">${control.label}</label>
                    </div>
                    <div class="elementor-control-input-wrapper">
                        ${inputHtml}
                    </div>
                </div>
            `);

            // Listen to changes for this control
            $control.find('.elementor-control-input, .dimension-input, .dimension-unit-select').on('input change click', function (e) {
                // Prevent bubbling loops if needed
                // e.stopPropagation(); 

                const controlId = control.id; // Use closure
                let newValue;

                if (control.type === 'dimensions') {
                    const $parent = $control.find('.elementor-control-dimensions');
                    const isLinked = $parent.find('.btn-link').hasClass('active');

                    if ($(this).hasClass('btn-link') || $(this).closest('.btn-link').length) {
                        // Toggle link
                        // This logic should be handled by button click specifically, trying to capture it here might be tricky if not careful
                        // Let's rely on a specific handler below for the button, skipping here if it's the button
                        return;
                    }

                    // Collect all values
                    newValue = {
                        top: $parent.find('[data-side="top"]').val(),
                        right: $parent.find('[data-side="right"]').val(),
                        bottom: $parent.find('[data-side="bottom"]').val(),
                        left: $parent.find('[data-side="left"]').val(),
                        unit: $parent.find('.dimension-unit-select').val(),
                        isLinked: isLinked
                    };

                    // Handle Linked Values Logic
                    if (isLinked && $(this).hasClass('dimension-input')) {
                        const val = $(this).val();
                        newValue.top = val;
                        newValue.right = val;
                        newValue.bottom = val;
                        newValue.left = val;
                        // Update UI
                        $parent.find('.dimension-input').val(val);
                    }

                } else if (control.type === 'slider') {
                    const currentValue = element.settings[controlId];
                    const isObject = typeof currentValue === 'object' && currentValue !== null;

                    if (isObject) {
                        newValue = {
                            ...currentValue,
                            size: parseFloat($(this).val())
                        };
                        $control.find('.slider-value').text(`${newValue.size}${newValue.unit}`);
                    } else {
                        newValue = parseFloat($(this).val());
                        $control.find('.slider-value').text(`${newValue}px`);
                    }
                } else {
                    newValue = $(this).val();
                }

                const newSettings = {
                    ...element.settings,
                    [controlId]: newValue
                };
                elementManager.updateElement(elementId, newSettings);
                renderCanvas();
                updateComponentCSS(elementId);
            });

            // Specific handler for Dimensions Link Button
            if (control.type === 'dimensions') {
                $control.find('.btn-link').on('click', function (e) {
                    e.preventDefault();
                    $(this).toggleClass('active');
                    const isLinked = $(this).hasClass('active');
                    $(this).css('color', isLinked ? '#3b82f6' : '#94a3b8');

                    // Trigger update
                    const $firstInput = $control.find('.dimension-input').first();
                    $firstInput.trigger('change');
                });
            }

            return $control;
        }

        // Event listeners
        dragDropManager.on('widget:dropped', (widgetType, position, parentId, containerIndex) => {
            console.log('Widget dropped:', widgetType, 'at', position, 'in', parentId, 'slot', containerIndex);

            // Handle null vs undefined vs empty string
            const pId = parentId || null;
            const cIndex = containerIndex !== undefined ? containerIndex : 0;

            const newElement = elementManager.createElement(widgetType, {}, pId, cIndex, position);
            renderCanvas();

            if (newElement && newElement.id) {
                updateComponentCSS(newElement.id); // Generate CSS immediately for new widget
            }
        });

        // Global helper to update icon and re-render
        window.updateIconAndRender = function (controlId, iconValue, targetElementId = null) {
            console.log('=== Global updateIconAndRender START ===');
            console.log('Params:', { controlId, iconValue, targetElementId });

            // Priority: Explicit Target -> Global Selected -> DOM Selected
            let elementId = targetElementId || window.selectedElementId;

            // Fallback: Try to find selected element from DOM
            if (!elementId) {
                const $selected = $('.element-wrapper.selected');
                if ($selected.length) {
                    elementId = $selected.data('element-id');
                    console.log('Found selected element from DOM:', elementId);
                    window.selectedElementId = elementId;
                }
            }

            if (!elementId) {
                console.error('No selected element found!');
                Toast.error('Error: No element selected');
                return false;
            }

            const element = elementManager.getElement(elementId);
            if (!element) {
                console.error('Element not found in manager:', elementId);
                Toast.error('Error: Element data missing');
                return false;
            }

            console.log('Before Update - Element Settings:', JSON.parse(JSON.stringify(element.settings)));
            console.log('Before Update - Widget Settings:', JSON.parse(JSON.stringify(element.widget.getSettings())));

            // Verify control ID
            if (!controlId) {
                console.error('Control ID is invalid:', controlId);
                // Try to infer from common names if 'icon' matches pattern
                if (iconValue.includes('fa')) controlId = 'icon';
                console.log('Inferred control ID:', controlId);
            }

            // Update settings
            const newSettings = {
                ...element.settings,
                [controlId]: iconValue
            };

            console.log('Applying New Settings:', newSettings);

            // Allow ElementManager to handle the widget update
            elementManager.updateElement(elementId, newSettings);

            console.log('After Update - Element Settings:', element.settings);
            console.log('After Update - Widget Settings:', element.widget.getSettings());

            // Force render
            console.log('Triggering renderCanvas...');
            renderCanvas();
            updateComponentCSS(elementId);
            console.log('Canvas rendered');

            Toast.success('Icon updated!');
            console.log('=== Global updateIconAndRender END ===');
            return true;
        };

        // Event listeners
        dragDropManager.on('element:dropped', (elementId, position, parentId, containerIndex) => {
            console.log('Element dropped:', elementId, 'at', position, 'in', parentId, 'slot', containerIndex);

            // Handle null vs undefined vs empty string
            const pId = parentId || null;
            const cIndex = containerIndex !== undefined ? containerIndex : 0;

            elementManager.moveElement(elementId, pId, cIndex, position);
            renderCanvas();
        });

        elementManager.on('element:created', () => {
            renderCanvas();
        });

        elementManager.on('element:deleted', () => {
            renderCanvas();
            renderSettings(null);
        });

        // Regenerate CSS for all widgets when loaded (Self-Healing)
        elementManager.on('elements:loaded', () => {
            console.log('Elements loaded - Regenerating CSS for verification...');
            const elements = elementManager.getAllElements();
            elements.forEach(element => {
                if (element && element.id) {
                    updateComponentCSS(element.id);
                }
            });
        });

        // Canvas click handlers
        $(document).on('click', '.element-wrapper', function (e) {
            e.stopPropagation();
            const elementId = $(this).data('element-id');

            $('.element-wrapper').removeClass('selected');
            $(this).addClass('selected');

            elementManager.selectElement(elementId);
            renderSettings(elementId);
        });

        $(document).on('click', '.delete-element', function (e) {
            e.stopPropagation();
            const elementId = $(this).closest('.element-wrapper').data('element-id');
            if (confirm('Delete this element?')) {
                elementManager.deleteElement(elementId);
            }
        });

        $(document).on('click', '.duplicate-element', function (e) {
            e.stopPropagation();
            const elementId = $(this).closest('.element-wrapper').data('element-id');
            elementManager.duplicateElement(elementId);
        });

        $(document).on('click', '.edit-element', function (e) {
            e.stopPropagation();
            const elementId = $(this).closest('.element-wrapper').data('element-id');

            // Select the element and show its settings
            $('.element-wrapper').removeClass('selected');
            $(this).closest('.element-wrapper').addClass('selected');
            elementManager.selectElement(elementId);
            renderSettings(elementId);
        });

        // Save button
        $('#btn-save').on('click', function () {
            if (!PAGE_ID) {
                Toast.error('Error: No Page ID found. Cannot save.');
                return;
            }

            const data = elementManager.serialize();
            const btn = $(this);
            const originalText = btn.html();

            // Generate CSS
            let cssData = '';
            if (window.cssGenerator) {
                // We need to pass widgets array with settings
                const widgets = elementManager.getAllElements().map(el => ({
                    id: el.id,
                    type: el.type,
                    settings: el.settings
                }));
                cssData = window.cssGenerator.generatePageCSS(widgets);
            }

            btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Saving...');

            $.ajax({
                url: API_URL,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: PAGE_ID,
                    type: ITEM_TYPE,
                    content: data,
                    css_data: cssData
                }),
                success: function (response) {
                    const res = typeof response === 'string' ? JSON.parse(response) : response;
                    if (res.success) {
                        Toast.success('Page saved successfully!');
                    } else {
                        Toast.error('Error saving page: ' + (res.message || 'Unknown error'));
                    }
                },
                error: function (xhr, status, error) {
                    Toast.error('System error: ' + error);
                },
                complete: function () {
                    btn.prop('disabled', false).html(originalText);
                }
            });
        });

        // Save All button
        $('#btn-save-all').on('click', function () {
            const btn = $(this);
            const originalText = btn.html();

            // Collect all data to save
            const saveData = {
                pages: [],
                headers: [],
                footers: [],
                topbars: [],
                mobile_menus: []
            };

            // Add current page/post/header/footer/topbar data
            if (PAGE_ID) {
                const data = elementManager.serialize();
                console.log('=== SAVE DEBUG ===');
                console.log('1. Item Type:', ITEM_TYPE);
                console.log('2. Serialized data:', JSON.stringify(data, null, 2));

                // Generate CSS from widgets
                let cssData = '';
                if (window.cssGenerator) {
                    try {
                        const widgets = window.cssGenerator.collectAllWidgets(data);
                        console.log('3. Collected widgets:', widgets);
                        console.log('4. First widget settings:', widgets[0]?.settings);

                        cssData = window.cssGenerator.generatePageCSS(widgets);
                        console.log('5. Generated CSS:', cssData);
                        console.log('6. CSS length:', cssData.length);
                    } catch (e) {
                        console.error('CSS generation error:', e);
                        console.error('Stack:', e.stack);
                    }
                }
                console.log('=== END SAVE DEBUG ===');

                // Route to correct array based on ITEM_TYPE
                if (ITEM_TYPE === 'header') {
                    saveData.headers.push({
                        id: PAGE_ID,
                        content: data,
                        css_data: cssData
                    });
                } else if (ITEM_TYPE === 'footer') {
                    saveData.footers.push({
                        id: PAGE_ID,
                        content: data,
                        css_data: cssData
                    });
                } else if (ITEM_TYPE === 'topbar') {
                    saveData.topbars.push({
                        id: PAGE_ID,
                        content: data,
                        css_data: cssData
                    });
                } else if (ITEM_TYPE === 'mobile_menu') {
                    saveData.mobile_menus.push({
                        id: PAGE_ID,
                        content: data,
                        css_data: cssData
                    });
                } else {
                    // page or post
                    saveData.pages.push({
                        id: PAGE_ID,
                        type: ITEM_TYPE,
                        content: data,
                        css_data: cssData
                    });
                }
            }

            // Check if there are any unsaved changes in other managers (if they exist)
            // For now, we'll focus on the current page, but this structure allows for expansion

            // Disable button and show loading state
            btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Saving All...');

            $.ajax({
                url: SAVE_ALL_URL,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(saveData),
                success: function (response) {
                    const res = typeof response === 'string' ? JSON.parse(response) : response;
                    if (res.success) {
                        if (res.errors && res.errors.length > 0) {
                            // Partial success
                            Toast.warning('Some items saved with warnings: ' + res.message);
                            console.warn('Save All warnings:', res.errors);
                        } else {
                            Toast.success(res.message || 'All changes saved successfully!');
                        }
                    } else {
                        Toast.error('Error saving changes: ' + (res.message || 'Unknown error'));
                        if (res.errors) {
                            console.error('Save All errors:', res.errors);
                        }
                    }
                },
                error: function (xhr, status, error) {
                    let errorMessage = 'System error: ' + error;
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        errorMessage = errorResponse.message || errorMessage;
                    } catch (e) {
                        // Use default error message
                    }
                    Toast.error(errorMessage);
                },
                complete: function () {
                    btn.prop('disabled', false).html(originalText);
                }
            });
        });

        // Load saved data from DB
        if (INITIAL_DATA && (Array.isArray(INITIAL_DATA) ? INITIAL_DATA.length > 0 : Object.keys(INITIAL_DATA).length > 0)) {
            try {
                elementManager.deserialize(INITIAL_DATA);
                renderCanvas();
            } catch (e) {
                console.error('Failed to load initial data:', e);
            }
        }

        // Widget search
        $('#widget-search').on('input', function () {
            const query = $(this).val().toLowerCase();
            $('.widget-card').each(function () {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.includes(query));
            });
        });

        // Listen for element moves (from layers panel drag-drop)
        elementManager.on('element:moved', function () {
            console.log('Element moved - re-rendering canvas');
            renderCanvas();
        });

        // Initial render
        renderCanvas();
        renderWidgetsPanel();

        // Device Switcher
        $('.device-btn').on('click', function () {
            const device = $(this).data('device');

            // Update active state
            $('.device-btn').removeClass('active');
            $(this).addClass('active');

            // Update canvas width
            const $wrapper = $('.canvas-wrapper');
            $wrapper.removeClass('desktop tablet mobile');
            $wrapper.addClass(device);

            // Trigger resize event for widgets that might need it
            $(window).trigger('resize');

            console.log('Switched to device:', device);
        });


        // Settings tabs functionality
        $('.settings-tab').on('click', function () {
            const tabName = $(this).data('tab');

            // Update active tab button
            $('.settings-tab').removeClass('active');
            $(this).addClass('active');

            // Show corresponding tab content
            $('.settings-tab-content').removeClass('active');
            $(`.settings-tab-content[data-tab="${tabName}"]`).addClass('active');
        });

        // Prevent link navigation in canvas (builder mode)
        $(document).on('click', '#canvas-area a', function (e) {
            e.preventDefault();
            console.log('Link click prevented in builder mode');
            return false;
        });

        // Preview button handler
        $('#btn-preview').on('click', function () {
            // Determine the preview URL based on type and slug
            let previewUrl = '../';

            if (ITEM_TYPE === 'post' && PAGE_SLUG) {
                previewUrl = '../blog/' + PAGE_SLUG;
            } else if (PAGE_SLUG) {
                previewUrl = '../' + PAGE_SLUG;
            } else if (PAGE_ID) {
                // Fallback: use ID if no slug exists
                if (ITEM_TYPE === 'post') {
                    previewUrl = '../blog/?post_id=' + PAGE_ID;
                } else {
                    previewUrl = '../?page_id=' + PAGE_ID;
                }
            }

            // Open preview in new tab
            window.open(previewUrl, '_blank');
        });

        console.log('Page Builder initialized!');
        console.log('Widgets:', widgetManager.getWidgetCount());
    </script>

    <!-- Icon Modal -->
    <div id="iconModal" class="media-modal-overlay" style="display: none;">
        <div class="media-modal" style="max-width: 900px;">
            <div class="media-modal-header">
                <h3 class="media-modal-title">Choose Icon</h3>
                <button class="close media-modal-close">&times;</button>
            </div>
            <div class="media-modal-tabs">
                <div class="modal-category-list">
                    <span data-category="All" class="selected">All</span>
                    <span data-category="FontAwesome">Font Awesome</span>
                </div>
            </div>
            <div class="media-modal-body">
                <div class="filter-input" style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                    <input type="text" placeholder="Search icons..."
                        style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px;">
                </div>
                <div class="icon-gallery"
                    style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto;">
                    <!-- Icons will be populated by JavaScript -->
                </div>
            </div>
            <div class="media-modal-footer"
                style="padding: 15px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <div class="selected-qty">Item selected 0</div>
                <button id="confirm-selection" class="btn btn-primary">Insert Icon</button>
            </div>
        </div>
    </div>

    <!-- Initialize Icon Modal -->
    <script>
        // Initialize the icon modal with retry logic
        function initIconModal() {
            console.log('Attempting to initialize icon modal...');
            const modalElement = document.getElementById('iconModal');

            if (!modalElement) {
                console.error('Icon modal element not found in DOM!');
                console.log('Available elements with "modal" in ID:',
                    Array.from(document.querySelectorAll('[id*="modal"]')).map(el => el.id));
                return false;
            }

            console.log('Modal element found:', modalElement);

            if (typeof ModalIcon === 'undefined') {
                console.error('ModalIcon class not found');
                return false;
            }

            try {
                window.myModalIcon = new ModalIcon('iconModal');
                console.log('✓ Icon modal initialized successfully');
                return true;
            } catch (error) {
                console.error('Error initializing icon modal:', error);
                return false;
            }
        }

        // Try to initialize when DOM is ready
        $(document).ready(function () {
            console.log('DOM ready, initializing icon modal...');

            // Try immediately
            if (!initIconModal()) {
                // If failed, try again after a short delay
                console.log('First attempt failed, retrying in 500ms...');
                setTimeout(function () {
                    if (!initIconModal()) {
                        console.error('Icon modal initialization failed after retry');
                    }
                }, 500);
            }
        });
    </script>
    <!-- Layers Modal -->
    <div id="layers-modal" class="draggable-modal" style="display: none;">
        <div class="draggable-header">
            <span><i class="fa fa-layer-group"></i> Layers</span>
            <button class="close-modal"><i class="fa fa-times"></i></button>
        </div>
        <div class="draggable-content">
            <div id="layers-tree" class="layer-tree"></div>
        </div>
    </div>

    <!-- Layers Script -->
    <script>
        $(document).ready(function () {
            // --- Draggable Logic ---
            const $modal = $('#layers-modal');
            const $header = $modal.find('.draggable-header');
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            $header.on('mousedown', function (e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = $modal[0].getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;

                $(document).on('mousemove', onMouseMove);
                $(document).on('mouseup', onMouseUp);
            });

            function onMouseMove(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                $modal.css({
                    left: initialLeft + dx + 'px',
                    top: initialTop + dy + 'px',
                    // Reset right/bottom if set so left/top take precedence
                    right: 'auto',
                    bottom: 'auto'
                });
            }

            function onMouseUp() {
                isDragging = false;
                $(document).off('mousemove', onMouseMove);
                $(document).off('mouseup', onMouseUp);
            }

            // --- Toggle Logic ---
            $('#btn-layers').on('click', function () {
                if ($modal.is(':visible')) {
                    $modal.hide();
                    $(this).removeClass('active');
                } else {
                    $modal.show();
                    $(this).addClass('active');
                    renderLayersTree(); // Render on open

                    // Center initial position if weird
                    if ($modal.css('top') === '100px' && $modal.css('left') === '100px') {
                        // Default is fine
                    }
                }
            });

            $modal.find('.close-modal').on('click', function () {
                $modal.hide();
                $('#btn-layers').removeClass('active');
            });

            // --- Tree Render Logic ---
            function renderLayersTree() {
                const roots = elementManager.getRootElements();
                const $tree = $('#layers-tree');
                $tree.empty();

                if (!roots || roots.length === 0) {
                    $tree.html('<div style="color:#94a3b8; text-align:center; padding:20px;">No layers</div>');
                    return;
                }

                function buildNode(element) {
                    const $item = $('<div></div>');

                    // Get Icon
                    let iconClass = 'fa fa-cube';
                    if (element.widget && typeof element.widget.getIcon === 'function') {
                        iconClass = element.widget.getIcon();
                    }

                    // Build Header with drag handle
                    const $headerDiv = $('<div class="layer-node"></div>');
                    if (window.selectedElementId === element.id) $headerDiv.addClass('active');

                    // Make draggable
                    $headerDiv.attr('draggable', 'true');
                    $headerDiv.data('element-id', element.id);
                    $headerDiv.data('parent-id', element.parentId);
                    $headerDiv.data('container-index', element.containerIndex);

                    // Add drag handle icon and content
                    $headerDiv.append(`
                        <i class="fa fa-grip-vertical layer-drag-handle" style="margin-right: 8px; color: #94a3b8; cursor: grab;"></i>
                        <i class="${iconClass}"></i> ${element.widget ? element.widget.getTitle() : 'Unknown'}
                    `);

                    // Add up/down buttons
                    const $controls = $('<div class="layer-controls" style="margin-left: auto; display: flex; gap: 4px;"></div>');

                    const $upBtn = $('<button class="layer-btn-up" style="background: none; border: none; cursor: pointer; padding: 2px 6px; color: #64748b;" title="Move Up"><i class="fa fa-chevron-up"></i></button>');
                    const $downBtn = $('<button class="layer-btn-down" style="background: none; border: none; cursor: pointer; padding: 2px 6px; color: #64748b;" title="Move Down"><i class="fa fa-chevron-down"></i></button>');

                    $upBtn.on('click', function (e) {
                        e.stopPropagation();
                        moveElementUp(element.id);
                    });

                    $downBtn.on('click', function (e) {
                        e.stopPropagation();
                        moveElementDown(element.id);
                    });

                    $controls.append($upBtn, $downBtn);
                    $headerDiv.append($controls);

                    // Click Handler
                    $headerDiv.on('click', function (e) {
                        e.stopPropagation();
                        selectLayer(element.id);
                    });

                    // Drag Start
                    $headerDiv.on('dragstart', function (e) {
                        e.stopPropagation();
                        $(this).addClass('dragging-layer');
                        $(this).css('opacity', '0.5');

                        e.originalEvent.dataTransfer.effectAllowed = 'move';
                        e.originalEvent.dataTransfer.setData('text/plain', element.id);

                        window.layerDragData = {
                            elementId: element.id,
                            parentId: element.parentId,
                            containerIndex: element.containerIndex
                        };
                    });

                    // Drag End
                    $headerDiv.on('dragend', function (e) {
                        $(this).removeClass('dragging-layer');
                        $(this).css('opacity', '1');
                        $('.layer-drop-indicator').remove();
                        $('.layer-drop-target').removeClass('layer-drop-target');
                        window.layerDragData = null;
                    });

                    // Drag Over
                    $headerDiv.on('dragover', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Check if dragging from widget panel or layers panel
                        const isDraggingWidget = window.draggedWidget; // From widget panel
                        const isDraggingElement = window.layerDragData; // From layers panel

                        if (!isDraggingWidget && !isDraggingElement) return;

                        // If dragging existing element, check for invalid drops
                        if (isDraggingElement) {
                            const draggedId = window.layerDragData.elementId;
                            const targetId = $(this).data('element-id');

                            if (draggedId === targetId || isDescendantOf(draggedId, targetId)) {
                                e.originalEvent.dataTransfer.dropEffect = 'none';
                                return;
                            }
                        }

                        e.originalEvent.dataTransfer.dropEffect = isDraggingWidget ? 'copy' : 'move';
                        showLayerDropIndicator($(this), e);
                    });

                    // Drop Handler
                    $headerDiv.on('drop', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        const isDraggingWidget = window.draggedWidget;
                        const isDraggingElement = window.layerDragData;

                        if (!isDraggingWidget && !isDraggingElement) return;

                        const targetId = $(this).data('element-id');
                        const targetElement = elementManager.getElement(targetId);

                        if (isDraggingWidget) {
                            // Create new widget from widget panel
                            const dropPosition = getLayerDropPosition($(this), e);
                            let newParentId, newContainerIndex, newPosition;

                            if (dropPosition === 'inside') {
                                newParentId = targetId;
                                newContainerIndex = 0;
                                newPosition = 0;
                            } else {
                                newParentId = targetElement.parentId;
                                newContainerIndex = targetElement.containerIndex;
                                newPosition = dropPosition === 'before' ? targetElement.order : targetElement.order + 1;
                            }

                            // Create the new element
                            const newElement = elementManager.createElement(
                                window.draggedWidget,
                                {},
                                newParentId,
                                newContainerIndex,
                                newPosition
                            );

                            if (newElement) {
                                renderLayersTree();
                                Toast.success(`${window.draggedWidget} added`);
                            }
                        } else {
                            // Move existing element
                            const draggedId = window.layerDragData.elementId;

                            if (draggedId === targetId || isDescendantOf(draggedId, targetId)) {
                                return;
                            }

                            const dropPosition = getLayerDropPosition($(this), e);
                            handleLayerDrop(draggedId, targetId, dropPosition);
                        }

                        $('.layer-drop-indicator').remove();
                        $('.layer-drop-target').removeClass('layer-drop-target');
                    });

                    $item.append($headerDiv);

                    // Build Children - Special handling for Columns and Flex widgets
                    const $childrenContainer = $('<div class="layer-children"></div>');
                    let hasChildren = false;

                    // Check if this is a Columns or Flex widget
                    const isColumnsWidget = element.type === 'columns';
                    const isFlexWidget = element.type === 'flex';

                    if (isColumnsWidget || isFlexWidget) {
                        // Determine number of slots
                        let numSlots = 2;
                        let slotLabel = 'Column';

                        if (isColumnsWidget) {
                            const columnsCount = element.widget ? element.widget.getSetting('columns', '2') : '2';
                            if (columnsCount === '3') numSlots = 3;
                            else if (columnsCount === '4') numSlots = 4;
                            else if (columnsCount.startsWith('2_')) numSlots = 2;
                            slotLabel = 'Column';
                        } else if (isFlexWidget) {
                            const itemsCount = element.widget ? element.widget.getSetting('items', '2') : '2';
                            if (itemsCount === '1') numSlots = 1;
                            else if (itemsCount === '3') numSlots = 3;
                            else if (itemsCount === '4') numSlots = 4;
                            else if (itemsCount.includes('-')) numSlots = 2; // e.g., '33-66', '66-33'
                            else numSlots = parseInt(itemsCount) || 2;
                            slotLabel = 'Item';
                        }

                        // Create slot nodes
                        for (let slotIndex = 0; slotIndex < numSlots; slotIndex++) {
                            const slotChildren = elementManager.getChildren(element.id, slotIndex);

                            // Create a virtual slot node
                            const $slotNode = $('<div></div>');
                            const $slotHeader = $(`<div class="layer-node layer-column-node" style="font-style: italic; color: #64748b;"></div>`);
                            $slotHeader.append(`<i class="fa fa-grip-lines-vertical" style="margin-right: 8px;"></i> ${slotLabel} ${slotIndex + 1}`);

                            // Store slot info for drop handling
                            $slotHeader.data('parent-element-id', element.id);
                            $slotHeader.data('slot-index', slotIndex);
                            $slotHeader.data('is-slot-header', true);

                            // Add drag-over handler to accept drops
                            $slotHeader.on('dragover', function (e) {
                                e.preventDefault();
                                e.stopPropagation();

                                const isDraggingWidget = window.draggedWidget;
                                const isDraggingElement = window.layerDragData;

                                if (!isDraggingWidget && !isDraggingElement) return;

                                // If dragging existing element, check for invalid drops
                                if (isDraggingElement) {
                                    const draggedId = window.layerDragData.elementId;
                                    const parentElementId = $(this).data('parent-element-id');

                                    if (draggedId === parentElementId || isDescendantOf(draggedId, parentElementId)) {
                                        e.originalEvent.dataTransfer.dropEffect = 'none';
                                        return;
                                    }
                                }

                                e.originalEvent.dataTransfer.dropEffect = isDraggingWidget ? 'copy' : 'move';

                                // Highlight this slot as drop target
                                $('.layer-drop-indicator').remove();
                                $('.layer-drop-target').removeClass('layer-drop-target');
                                $(this).addClass('layer-drop-target');
                            });

                            // Add drop handler
                            $slotHeader.on('drop', function (e) {
                                e.preventDefault();
                                e.stopPropagation();

                                const isDraggingWidget = window.draggedWidget;
                                const isDraggingElement = window.layerDragData;

                                if (!isDraggingWidget && !isDraggingElement) return;

                                const parentElementId = $(this).data('parent-element-id');
                                const targetSlotIndex = $(this).data('slot-index');

                                if (isDraggingWidget) {
                                    // Create new widget from widget panel
                                    const newElement = elementManager.createElement(
                                        window.draggedWidget,
                                        {},
                                        parentElementId,
                                        targetSlotIndex,
                                        0
                                    );

                                    if (newElement) {
                                        renderLayersTree();
                                        Toast.success(`${window.draggedWidget} added to ${slotLabel} ${targetSlotIndex + 1}`);
                                    }
                                } else {
                                    // Move existing element
                                    const draggedId = window.layerDragData.elementId;

                                    if (draggedId === parentElementId || isDescendantOf(draggedId, parentElementId)) {
                                        return;
                                    }

                                    elementManager.moveElement(draggedId, parentElementId, targetSlotIndex, 0);
                                    renderLayersTree();
                                    Toast.success(`Moved to ${slotLabel} ${targetSlotIndex + 1}`);
                                }

                                $('.layer-drop-indicator').remove();
                                $('.layer-drop-target').removeClass('layer-drop-target');
                            });

                            $slotNode.append($slotHeader);

                            // Add children of this slot
                            if (slotChildren && slotChildren.length > 0) {
                                hasChildren = true;
                                const $slotChildrenContainer = $('<div class="layer-children"></div>');
                                slotChildren.forEach(child => {
                                    $slotChildrenContainer.append(buildNode(child));
                                });
                                $slotNode.append($slotChildrenContainer);
                            }

                            $childrenContainer.append($slotNode);
                        }

                        hasChildren = true; // Always show slot structure
                    } else {
                        // For other container widgets, loop through all container slots
                        for (let i = 0; i < 5; i++) {
                            const children = elementManager.getChildren(element.id, i);
                            if (children && children.length > 0) {
                                hasChildren = true;
                                children.forEach(child => {
                                    $childrenContainer.append(buildNode(child));
                                });
                            }
                        }
                    }

                    if (hasChildren) {
                        $item.append($childrenContainer);
                    }

                    return $item;
                }

                roots.forEach(root => {
                    $tree.append(buildNode(root));
                });
            }

            // Helper: Check if targetId is a descendant of sourceId
            function isDescendantOf(sourceId, targetId) {
                let current = elementManager.getElement(targetId);

                while (current) {
                    if (current.id === sourceId) {
                        return true;
                    }
                    current = current.parentId ? elementManager.getElement(current.parentId) : null;
                }

                return false;
            }

            // Helper: Determine drop position relative to target node
            function getLayerDropPosition($node, event) {
                const rect = $node[0].getBoundingClientRect();
                const mouseY = event.originalEvent.clientY;
                const nodeMiddle = rect.top + (rect.height / 2);

                const targetElement = elementManager.getElement($node.data('element-id'));
                const isContainer = targetElement && targetElement.widget && targetElement.widget.isContainer();

                if (mouseY < nodeMiddle) {
                    return 'before';
                } else if (isContainer && mouseY > rect.bottom - 10) {
                    return 'inside';
                } else {
                    return 'after';
                }
            }

            // Helper: Show visual drop indicator
            function showLayerDropIndicator($node, event) {
                $('.layer-drop-indicator').remove();
                $('.layer-drop-target').removeClass('layer-drop-target');

                const position = getLayerDropPosition($node, event);

                if (position === 'inside') {
                    $node.addClass('layer-drop-target');
                } else {
                    const $indicator = $('<div class="layer-drop-indicator"></div>');

                    if (position === 'before') {
                        $node.before($indicator);
                    } else {
                        $node.after($indicator);
                    }
                }
            }

            // Helper: Handle the actual drop and reorder elements
            function handleLayerDrop(draggedId, targetId, position) {
                const draggedElement = elementManager.getElement(draggedId);
                const targetElement = elementManager.getElement(targetId);

                if (!draggedElement || !targetElement) return;

                let newParentId, newContainerIndex, newPosition;

                if (position === 'inside') {
                    newParentId = targetId;
                    newContainerIndex = 0;
                    newPosition = 0;
                } else {
                    newParentId = targetElement.parentId;
                    newContainerIndex = targetElement.containerIndex;

                    if (position === 'before') {
                        newPosition = targetElement.order;
                    } else {
                        newPosition = targetElement.order + 1;
                    }
                }

                elementManager.moveElement(draggedId, newParentId, newContainerIndex, newPosition);
                renderLayersTree();
                Toast.success('Element moved successfully');
            }

            // Helper: Move element up in order
            function moveElementUp(elementId) {
                const element = elementManager.getElement(elementId);
                if (!element) return;

                // Get siblings in same container
                const siblings = elementManager.getChildren(element.parentId, element.containerIndex);
                const currentIndex = siblings.findIndex(el => el.id === elementId);

                // Can't move up if already first
                if (currentIndex <= 0) {
                    Toast.warning('Already at top');
                    return;
                }

                // Move to previous position
                elementManager.moveElement(elementId, element.parentId, element.containerIndex, currentIndex - 1);
                renderLayersTree();
                Toast.success('Moved up');
            }

            // Helper: Move element down in order
            function moveElementDown(elementId) {
                const element = elementManager.getElement(elementId);
                if (!element) return;

                // Get siblings in same container
                const siblings = elementManager.getChildren(element.parentId, element.containerIndex);
                const currentIndex = siblings.findIndex(el => el.id === elementId);

                // Can't move down if already last
                if (currentIndex >= siblings.length - 1) {
                    Toast.warning('Already at bottom');
                    return;
                }

                // Move to next position
                elementManager.moveElement(elementId, element.parentId, element.containerIndex, currentIndex + 1);
                renderLayersTree();
                Toast.success('Moved down');
            }

            function selectLayer(id) {
                // Update global selection
                window.selectedElementId = id;
                window.activeElementId = id;

                // Update Canvas Visuals
                $('.element-wrapper').removeClass('selected');
                $(`.element-wrapper[data-element-id="${id}"]`).addClass('selected');

                // Update Tree Visuals
                $('#layers-tree .layer-node').removeClass('active');
                $(`#layers-tree .layer-node`).filter(function () { return $(this).data('id') == id; }).addClass('active');

                // Trigger Settings Panel
                const $el = $(`.element-wrapper[data-element-id="${id}"]`);
                if ($el.length) {
                    $el.trigger('click');
                }
            }

            // --- Listeners for Sync ---
            if (typeof elementManager !== 'undefined') {
                elementManager.on('element:created', function () { if ($modal.is(':visible')) renderLayersTree(); });
                elementManager.on('element:deleted', function () { if ($modal.is(':visible')) renderLayersTree(); });
                elementManager.on('element:moved', function () { if ($modal.is(':visible')) renderLayersTree(); });
            }

            $(document).on('click', '.element-wrapper', function () {
                const id = $(this).data('element-id');
                if ($modal.is(':visible')) {
                    $('#layers-tree .layer-node').removeClass('active');
                    const $nodes = $('#layers-tree .layer-node');
                    $nodes.each(function () {
                        if ($(this).data('id') == id) {
                            $(this).addClass('active');
                            this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    });
                }
            });
        });
    </script>
</body>

</html>