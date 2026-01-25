<?php
session_start();

// Ensure auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

// Access Control - Only Administrators can manage widgets
if (($_SESSION['admin_role'] ?? 'user') !== 'admin') {
    $currentPage = 'custom_page';
    $pageTitle = 'Widget List';
    require_once __DIR__ . '/../includes/header.php';
    echo '<div class="content-wrapper"><div class="card" style="text-align: center; padding: 40px; color: #ef4444;"><i class="fa fa-lock" style="font-size: 48px; margin-bottom: 20px;"></i><h2>Access Denied</h2><p>Only Administrators can manage widgets.</p></div></div>';
    require_once __DIR__ . '/../includes/footer.php';
    exit;
}

// Handle activation toggle
if (isset($_POST['toggle_widget'])) {
    header('Content-Type: application/json');

    try {
        $pdo = getDBConnection();
        $widgetName = $_POST['widget_name'] ?? '';
        $isActive = $_POST['is_active'] ?? '0';

        // Create table if not exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS widget_settings (
            widget_name VARCHAR(255) PRIMARY KEY,
            is_active TINYINT(1) DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        // Insert or update
        $stmt = $pdo->prepare("INSERT INTO widget_settings (widget_name, is_active) VALUES (?, ?) 
                               ON DUPLICATE KEY UPDATE is_active = ?, updated_at = NOW()");
        $stmt->execute([$widgetName, $isActive, $isActive]);

        echo json_encode(['success' => true, 'message' => 'Widget status updated']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

// Get widget activation status from database
$widgetStatuses = [];
try {
    $pdo = getDBConnection();

    // Create table if not exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS widget_settings (
        widget_name VARCHAR(255) PRIMARY KEY,
        is_active TINYINT(1) DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    $stmt = $pdo->query("SELECT widget_name, is_active FROM widget_settings");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $widgetStatuses[$row['widget_name']] = (bool) $row['is_active'];
    }
} catch (Exception $e) {
    // Ignore errors, default to all active
}

// Get all widget files
$widgetPath = __DIR__ . '/../../assets/widgets/';
$widgetFiles = glob($widgetPath . '*.js');

// Parse widget information
$widgets = [];
foreach ($widgetFiles as $file) {
    $filename = basename($file);

    // Skip base/utility files
    if (in_array($filename, ['WidgetBase.js', 'widget-base.js', 'widget-loader.php'])) {
        continue;
    }

    // Read file content to extract widget info
    $content = file_get_contents($file);

    // Extract class name
    preg_match('/class\s+(\w+)\s+extends/', $content, $classMatch);
    $className = $classMatch[1] ?? str_replace('.js', '', $filename);

    // Extract title
    preg_match('/getTitle\(\)\s*{\s*return\s+[\'"]([^\'"]+)[\'"]/', $content, $titleMatch);
    $title = $titleMatch[1] ?? $className;
    
    // Extract widget name from getName() method - THIS IS WHAT THE BUILDER USES!
    preg_match('/getName\(\)\s*{\s*return\s+[\'"]([^\'"]+)[\'"]/', $content, $nameMatch);
    $widgetName = $nameMatch[1] ?? strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', str_replace('Widget', '', $className)));

    // Extract icon
    preg_match('/getIcon\(\)\s*{\s*return\s+[\'"]([^\'"]+)[\'"]/', $content, $iconMatch);
    $icon = $iconMatch[1] ?? 'fa fa-cube';

    // Extract categories
    preg_match('/getCategories\(\)\s*{\s*return\s+\[(.*?)\]/', $content, $categoriesMatch);
    $categoriesStr = $categoriesMatch[1] ?? '';
    preg_match_all('/[\'"]([^\'"]+)[\'"]/', $categoriesStr, $categoryMatches);
    $categories = $categoryMatches[1] ?? ['general'];

    // Check if widget is active (default to true if not set)
    $isActive = isset($widgetStatuses[$widgetName]) ? $widgetStatuses[$widgetName] : true;
    
    $widgets[] = [
        'filename' => $filename,
        'className' => $className,
        'widgetName' => $widgetName,  // This is what we'll store in DB
        'title' => $title,
        'icon' => $icon,
        'categories' => $categories,
        'size' => filesize($file),
        'modified' => filemtime($file),
        'is_active' => $isActive
    ];
}

// Sort by title
usort($widgets, function ($a, $b) {
    return strcmp($a['title'], $b['title']);
});

// Filter
$search_query = $_GET['search'] ?? '';
$category_filter = $_GET['category'] ?? '';

if (!empty($search_query)) {
    $widgets = array_filter($widgets, function ($widget) use ($search_query) {
        return stripos($widget['title'], $search_query) !== false ||
            stripos($widget['className'], $search_query) !== false;
    });
}

if (!empty($category_filter)) {
    $widgets = array_filter($widgets, function ($widget) use ($category_filter) {
        return in_array($category_filter, $widget['categories']);
    });
}

// Get all unique categories
$allCategories = [];
foreach ($widgets as $widget) {
    foreach ($widget['categories'] as $cat) {
        if (!in_array($cat, $allCategories)) {
            $allCategories[] = $cat;
        }
    }
}
sort($allCategories);

$currentPage = 'custom_page';
$pageTitle = 'Widget List';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h1 class="page-title">Widget List</h1>
            <p style="color: var(--secondary); margin-top: 5px;">Browse all available widgets for the page builder</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span
                style="background: #eff6ff; color: #3b82f6; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600;">
                <?php echo count($widgets); ?> Widgets
            </span>
        </div>
    </div>

    <!-- Filter Form -->
    <div class="card" style="margin-top: 1rem; padding: 1rem;">
        <form method="GET" action="" style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: end;">
            <div style="flex: 1; min-width: 200px;">
                <label class="form-label" style="font-size: 0.875rem;">Search</label>
                <div class="input-wrapper">
                    <i class="fa fa-search input-icon" style="left: 1rem;"></i>
                    <input type="text" name="search" class="form-input with-icon" placeholder="Search by name..."
                        value="<?php echo htmlspecialchars($search_query); ?>">
                </div>
            </div>

            <div style="width: 200px;">
                <label class="form-label" style="font-size: 0.875rem;">Category</label>
                <select name="category" class="form-input">
                    <option value="">All Categories</option>
                    <?php foreach ($allCategories as $cat): ?>
                        <option value="<?php echo htmlspecialchars($cat); ?>" <?php echo $category_filter === $cat ? 'selected' : ''; ?>>
                            <?php echo ucfirst(htmlspecialchars($cat)); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <button type="submit" class="btn btn-primary" style="height: 42px;">
                Filter
            </button>

            <?php if (!empty($category_filter) || !empty($search_query)): ?>
                <a href="index.php" class="btn" style="height: 42px; background: #e2e8f0; color: #475569;">
                    Clear
                </a>
            <?php endif; ?>
        </form>
    </div>
</div>

<div class="content-wrapper">
    <?php if (count($widgets) > 0): ?>
        <div style="overflow-x: auto; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table class="table" style="min-width: 800px; margin-bottom: 0;">
                <thead>
                    <tr>
                        <th style="width: 50px;"></th>
                        <th>Widget Title</th>
                        <th>Widget Name (DB Key)</th>
                        <th>Class Name</th>
                        <th>Categories</th>
                        <th style="width: 100px; text-align: center;">Status</th>
                        <th>File Size</th>
                        <th>Last Modified</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($widgets as $widget): ?>
                        <tr>
                            <td style="text-align: center;">
                                <i class="<?php echo htmlspecialchars($widget['icon']); ?>"
                                    style="font-size: 1.5rem; color: #3b82f6;"></i>
                            </td>
                            <td>
                                <strong>
                                    <?php echo htmlspecialchars($widget['title']); ?>
                                </strong>
                            </td>
                            <td>
                                <code style="background: #dcfce7; color: #166534; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">
                                    <?php echo htmlspecialchars($widget['widgetName']); ?>
                                </code>
                            </td>
                            <td>
                                <code
                                    style="background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">
                                                                    <?php echo htmlspecialchars($widget['className']); ?>
                                                                </code>
                            </td>
                            <td>
                                <?php foreach ($widget['categories'] as $cat): ?>
                                    <span class="badge" style="background: #eff6ff; color: #3b82f6; margin-right: 0.25rem;">
                                        <?php echo ucfirst(htmlspecialchars($cat)); ?>
                                    </span>
                                <?php endforeach; ?>
                            </td>
                            <td style="text-align: center;">
                                <label class="toggle-switch" style="display: inline-block;">
                                    <input type="checkbox" 
                                           class="widget-toggle" 
                                           data-widget="<?php echo htmlspecialchars($widget['widgetName']); ?>"
                                           <?php echo $widget['is_active'] ? 'checked' : ''; ?>>
                                    <span class="toggle-slider"></span>
                                </label>
                            </td>
                            <td style="color: var(--secondary);">
                                <?php echo number_format($widget['size'] / 1024, 1); ?> KB
                            </td>
                            <td style="color: var(--secondary);">
                                <?php echo date('M d, Y', $widget['modified']); ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php else: ?>
        <div class="card" style="text-align: center; padding: 3rem;">
            <i class="fa fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>

            <?php if (!empty($category_filter) || !empty($search_query)): ?>
                <h3>No widgets found matching your filters</h3>
                <p style="color: var(--secondary); margin-bottom: 1.5rem;">Try adjusting your search or filter criteria.</p>
                <a href="index.php" class="btn btn-primary" style="background: #64748b;">Clear Filters</a>
            <?php else: ?>
                <h3>No widgets found</h3>
                <p style="color: var(--secondary);">No widget files were found in the widgets directory.</p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<style>
    /* Toggle Switch Styles */
    .toggle-switch {
        position: relative;
        width: 50px;
        height: 24px;
        cursor: pointer;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cbd5e1;
        border-radius: 24px;
        transition: 0.3s;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: 0.3s;
    }

    .toggle-switch input:checked + .toggle-slider {
        background-color: #10b981;
    }

    .toggle-switch input:checked + .toggle-slider:before {
        transform: translateX(26px);
    }

    .toggle-switch input:disabled + .toggle-slider {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    function showToast(message, type = 'info') {
        if (window.Toast) {
            Toast.show(message, type);
        } else {
            alert(message);
        }
    }

    $(document).ready(function() {
        $('.widget-toggle').on('change', function() {
            const checkbox = $(this);
            const widgetName = checkbox.data('widget');
            const isActive = checkbox.is(':checked') ? 1 : 0;
            
            // Disable checkbox during request
            checkbox.prop('disabled', true);
            
            $.ajax({
                url: 'index.php',
                method: 'POST',
                data: {
                    toggle_widget: true,
                    widget_name: widgetName,
                    is_active: isActive
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showToast(
                            widgetName + ' is now ' + (isActive ? 'active' : 'inactive'),
                            'success'
                        );
                    } else {
                        showToast('Error: ' + response.message, 'error');
                        // Revert checkbox state
                        checkbox.prop('checked', !isActive);
                    }
                },
                error: function() {
                    showToast('Connection error', 'error');
                    // Revert checkbox state
                    checkbox.prop('checked', !isActive);
                },
                complete: function() {
                    checkbox.prop('disabled', false);
                }
            });
        });
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>