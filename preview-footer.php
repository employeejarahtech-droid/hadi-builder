<?php
// preview-footer.php - Preview footer with sample content

require_once __DIR__ . '/includes/db.php';

// Get footer ID from URL
$footerId = $_GET['footer_id'] ?? null;

if (!$footerId || !is_numeric($footerId)) {
    die('Invalid footer ID');
}

try {
    $pdo = getDBConnection();

    // Get footer content
    $stmt = $pdo->prepare("SELECT * FROM footers WHERE id = ?");
    $stmt->execute([$footerId]);
    $footer = $stmt->fetch();

    if (!$footer) {
        die('Footer not found');
    }

    $footerContent = $footer['content'] ?? '[]';

} catch (PDOException $e) {
    die('Database error: ' . $e->getMessage());
}

// Load env for app name
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $env[trim($name)] = trim(trim($value), '"');
    }
    $appName = $env['APP_NAME'] ?? 'New CMS';
} else {
    $appName = 'New CMS';
}

// Get base path
$basePath = dirname($_SERVER['SCRIPT_NAME']);
$root = rtrim(str_replace('\\', '/', $basePath), '/');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Footer Preview - <?php echo htmlspecialchars($footer['title']); ?> - <?php echo htmlspecialchars($appName); ?></title>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Page Builder CSS -->
    <link rel="stylesheet" href="<?php echo $root; ?>/assets/css/page-builder.css">

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
        }

        .preview-header {
            background: #1e293b;
            color: white;
            padding: 10px 20px;
            text-align: center;
            font-size: 14px;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .preview-content {
            min-height: 60vh;
            padding: 40px 20px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .preview-content h1 {
            color: #1e293b;
            margin-bottom: 10px;
        }

        .preview-content p {
            color: #64748b;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .footer-preview-section {
            border-top: 3px solid #3b82f6;
            background: #1e293b;
            color: white;
        }

        /* Hide edit controls */
        .element-controls,
        .empty-container-zone {
            display: none !important;
        }

        .element-wrapper {
            margin: 0 !important;
            outline: none !important;
        }

        .element-wrapper:hover {
            outline: none !important;
        }
    </style>
</head>
<body>
    <!-- Preview Notice -->
    <div class="preview-header">
        <strong>Footer Preview</strong> - Viewing "<?php echo htmlspecialchars($footer['title']); ?>" footer
    </div>

    <!-- Sample Content -->
    <div class="preview-content">
        <div>
            <h1>Sample Page Content</h1>
            <p>This is sample content to demonstrate how your footer will appear on a real page.
            The footer below will be displayed at the bottom of all pages that use this footer template.</p>
        </div>
    </div>

    <!-- Footer Section -->
    <div class="footer-preview-section">
        <div id="site-footer"></div>
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="<?php echo $root; ?>/assets/core/EventEmitter.js"></script>
    <script src="<?php echo $root; ?>/assets/core/WidgetManager.js"></script>
    <script src="<?php echo $root; ?>/assets/core/ElementManager.js"></script>

    <!-- Widgets -->
    <script src="<?php echo $root; ?>/assets/widgets/WidgetBase.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/HeadingWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/TextWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/ButtonWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/ImageWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/VideoWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/ColumnsWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/FlexWidget.js"></script>
    <script src="<?php echo $root; ?>/assets/widgets/LogoWidget.js"></script>

    <script>
        // Register Widgets
        const widgetManager = window.elementorWidgetManager;
        if (typeof HeadingWidget !== 'undefined') widgetManager.registerWidget(HeadingWidget);
        if (typeof TextWidget !== 'undefined') widgetManager.registerWidget(TextWidget);
        if (typeof ButtonWidget !== 'undefined') widgetManager.registerWidget(ButtonWidget);
        if (typeof ImageWidget !== 'undefined') widgetManager.registerWidget(ImageWidget);
        if (typeof VideoWidget !== 'undefined') widgetManager.registerWidget(VideoWidget);
        if (typeof ColumnsWidget !== 'undefined') widgetManager.registerWidget(ColumnsWidget);
        if (typeof FlexWidget !== 'undefined') widgetManager.registerWidget(FlexWidget);
        if (typeof LogoWidget !== 'undefined') widgetManager.registerWidget(LogoWidget);

        window.CMS_ROOT = "<?php echo $root; ?>";
        window.SITE_DATA = {
            header: [], // No header for footer preview
            page: [],  // No main content
            footer: <?php echo $footerContent ?: '[]'; ?>
        };

        // Initialize renderer to show footer
        $(document).ready(function() {
            // Load PublicRenderer
            const script = document.createElement('script');
            script.src = '<?php echo $root; ?>/assets/core/PublicRenderer.js';
            script.onload = function() {
                // Renderer will automatically load and render the footer
                console.log('Footer preview loaded');
            };
            document.head.appendChild(script);
        });
    </script>
</body>
</html>