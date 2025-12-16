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
    $pagesList = $pdo->query("SELECT id, title FROM pages ORDER BY title")->fetchAll();
} catch (Exception $e) {
    // Ignore error
}

$currentPage = 'settings';
$pageTitle = 'Settings';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">General Settings</h1>
</div>

<div class="content-wrapper">
    <div class="card" style="max-width: 800px;">
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

        <form method="POST" action="">
            <div class="form-group">
                <label class="form-label" for="site_name">Site Name</label>
                <input type="text" id="site_name" name="settings[site_name]" class="form-input"
                    value="<?php echo htmlspecialchars($currentSettings['site_name'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label class="form-label" for="site_description">Site Description</label>
                <textarea id="site_description" name="settings[site_description]" class="form-input"
                    rows="3"><?php echo htmlspecialchars($currentSettings['site_description'] ?? ''); ?></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" for="admin_email">Admin Email</label>
                <input type="email" id="admin_email" name="settings[admin_email]" class="form-input"
                    value="<?php echo htmlspecialchars($currentSettings['admin_email'] ?? ''); ?>">
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
                <small style="color: var(--secondary);">Select the header to display on all pages.</small>
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
                <small style="color: var(--secondary);">Select the footer to display on all pages.</small>
            </div>

            <div class="form-group">
                <label class="form-label" for="home_page">Home Page</label>
                <select id="home_page" name="settings[home_page]" class="form-input">
                    <option value="">-- None --</option>
                    <?php foreach ($pagesList as $page): ?>
                        <option value="<?php echo $page['id']; ?>" <?php echo (isset($currentSettings['home_page']) && $currentSettings['home_page'] == $page['id']) ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($page['title']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <small style="color: var(--secondary);">Select the page to serve as the homepage.</small>
            </div>

            <?php
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
            ?>

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
                <small style="color: var(--secondary);">Select the active theme for the frontend.</small>
            </div>

            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <button type="submit" class="btn btn-primary">
                    <i class="fa fa-save"></i> Save Settings
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>