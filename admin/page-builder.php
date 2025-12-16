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

if ($id) {
    require_once __DIR__ . '/../includes/db.php';
    try {
        $pdo = getDBConnection();
        $table = ($type === 'post') ? 'posts' : 'pages';
        // Validate table name to prevent injection
        if (!in_array($table, ['pages', 'posts']))
            $table = 'pages';

        $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        if ($item) {
            $pageTitle = $item['title'];
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
    <title>Page Builder - <?php echo htmlspecialchars($pageTitle); ?></title>
    <script>
        const PAGE_ID = <?php echo json_encode($id); ?>;
        const ITEM_TYPE = <?php echo json_encode($type); ?>;
        const PAGE_SLUG = <?php echo json_encode($pageSlug); ?>;
        const INITIAL_DATA = <?php echo json_encode($pageData); ?>;
        const API_URL = "api/save-page.php";
        window.CMS_API_BASE = '../api/';
    </script>


    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Page Builder CSS -->
    <link rel="stylesheet" href="../assets/css/page-builder.css">
    <link rel="stylesheet" href="../assets/css/toast.css">
    <script src="../assets/core/Toast.js"></script>

    <!-- Control System CSS (if needed) -->
    <style>
        /* Additional control styles */
        .elementor-control {
            margin-bottom: 20px;
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
    </style>
</head>

<body>
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
                <div class="page-title"><?php echo htmlspecialchars($pageTitle); ?></div>
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
                <button class="btn btn-secondary" id="btn-undo" title="Undo">
                    <i class="fa fa-undo"></i>
                </button>
                <button class="btn btn-secondary" id="btn-redo" title="Redo">
                    <i class="fa fa-redo"></i>
                </button>
                <button class="btn btn-secondary" id="btn-preview">
                    <i class="fa fa-eye"></i> Preview
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
    <script src="../assets/fields/BaseControl.js"></script>
    <script src="../assets/fields/text-new.js"></script>
    <script src="../assets/fields/textarea.js"></script>
    <script src="../assets/fields/media.js"></script>
    <script src="../assets/fields/ControlManager.js"></script>

    <!-- Load Core -->
    <script src="../assets/widgets/WidgetBase.js"></script>
    <script src="../assets/core/WidgetManager.js"></script>
    <script src="../assets/core/ElementManager.js"></script>
    <script src="../assets/core/DragDropManager.js"></script>

    <!-- Load Widgets -->
    <script src="../assets/widgets/HeadingWidget.js"></script>
    <script src="../assets/widgets/TextWidget.js"></script>
    <script src="../assets/widgets/ButtonWidget.js"></script>
    <script src="../assets/widgets/ImageWidget.js"></script>
    <script src="../assets/widgets/VideoWidget.js"></script>
    <script src="../assets/widgets/DividerWidget.js"></script>
    <script src="../assets/widgets/ColumnsWidget.js"></script>
    <script src="../assets/widgets/FlexWidget.js"></script>
    <script src="../assets/widgets/LogoWidget.js"></script>

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

            // Initialize
            widgetManager.init();
            controlManager.init();
            dragDropManager.init();

            // Register widgets
            if (typeof HeadingWidget !== 'undefined') widgetManager.registerWidget(HeadingWidget);
            if (typeof TextWidget !== 'undefined') widgetManager.registerWidget(TextWidget);
            if (typeof ButtonWidget !== 'undefined') widgetManager.registerWidget(ButtonWidget);
            if (typeof ImageWidget !== 'undefined') widgetManager.registerWidget(ImageWidget);
            if (typeof VideoWidget !== 'undefined') widgetManager.registerWidget(VideoWidget);
            if (typeof DividerWidget !== 'undefined') widgetManager.registerWidget(DividerWidget);
            if (typeof ColumnsWidget !== 'undefined') widgetManager.registerWidget(ColumnsWidget);
            if (typeof FlexWidget !== 'undefined') widgetManager.registerWidget(FlexWidget);
            if (typeof LogoWidget !== 'undefined') widgetManager.registerWidget(LogoWidget);
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
            return $(`
                <div class="element-wrapper" data-element-id="${element.id}" draggable="true">
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

        // Render settings panel
        function renderSettings(elementId) {
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

            // Simple rendering for now
            controls.forEach(control => {
                if (control.type === 'section' || control.type === 'section_end') return;

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
                    $content.append($control);

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
                    });

                    return; // Skip default rendering
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

                $content.append($control);
            });

            // Listen to changes
            $content.find('.elementor-control-input').on('input change', function () {
                const controlId = $(this).attr('id');
                const value = $(this).val();

                const newSettings = {
                    ...element.settings,
                    [controlId]: value
                };
                elementManager.updateElement(elementId, newSettings);
                renderCanvas();
            });
        }

        // Event listeners
        dragDropManager.on('widget:dropped', (widgetType, position, parentId, containerIndex) => {
            console.log('Widget dropped:', widgetType, 'at', position, 'in', parentId, 'slot', containerIndex);

            // Handle null vs undefined vs empty string
            const pId = parentId || null;
            const cIndex = containerIndex !== undefined ? containerIndex : 0;

            elementManager.createElement(widgetType, {}, pId, cIndex, position);
            renderCanvas();
        });

        elementManager.on('element:created', () => {
            renderCanvas();
        });

        elementManager.on('element:deleted', () => {
            renderCanvas();
            renderSettings(null);
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

        // Save button
        $('#btn-save').on('click', function () {
            if (!PAGE_ID) {
                Toast.error('Error: No Page ID found. Cannot save.');
                return;
            }

            const data = elementManager.serialize();
            const btn = $(this);
            const originalText = btn.html();

            btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Saving...');

            $.ajax({
                url: API_URL,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: PAGE_ID,
                    type: ITEM_TYPE,
                    content: data
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
</body>

</html>