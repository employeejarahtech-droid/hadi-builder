<?php
session_start();

// Simple .env parser (duplicated from page-builder.php for now, should be in a shared file)
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

        if (substr($value, 0, 1) === '"' && substr($value, -1) === '"') {
            $value = substr($value, 1, -1);
        }

        $env[$name] = $value;
    }

    return $env;
}

$env = loadEnv(__DIR__ . '/../.env');
$appUrl = isset($env['APP_URL']) ? rtrim($env['APP_URL'], '/') : '';

// DB Connection & Settings
require_once __DIR__ . '/../includes/db.php';
$pdo = getDBConnection();

// Fetch Settings
$settings = [];
try {
    $stmt = $pdo->query("SELECT * FROM settings");
    while ($row = $stmt->fetch()) {
        $settings[$row['key_name']] = $row['value'];
    }
} catch (Exception $e) {
    // Silent fail if settings table issue, will fallback to defaults
}

$siteLogo = $settings['site_logo'] ?? '';
$siteName = $settings['site_name'] ?? 'New CMS';

// Handle Login
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    try {
        $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];
            $_SESSION['admin_role'] = $user['role'] ?? 'user'; // Default to user if null

            header('Location: index.php'); // Redirect to dashboard
            exit;
        } else {
            $error = 'Invalid credentials';
        }
    } catch (Exception $e) {
        $error = 'System error: ' . $e->getMessage();
    }
}

// Redirect if already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - <?php echo htmlspecialchars($siteName); ?></title>
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/admin.css">
</head>

<body class="login-body">
    <div class="login-card">
        <div class="logo-container">
            <?php if (!empty($siteLogo)): ?>
                <img src="<?php echo htmlspecialchars($siteLogo); ?>" alt="Logo" class="logo-img">
            <?php else: ?>
                <i class="fa fa-cube logo-icon"></i>
            <?php endif; ?>

            <div>
                <div class="login-title">Welcome Back</div>
                <div class="login-subtitle">Sign in to your admin dashboard</div>
            </div>
        </div>

        <?php if ($error): ?>
            <div class="error-msg">
                <i class="fa fa-circle-exclamation"></i>
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <div class="input-wrapper">
                    <i class="fa fa-user input-icon"></i>
                    <input type="text" id="username" name="username" class="form-input with-icon"
                        placeholder="Enter your username" required autofocus>
                </div>
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                    <i class="fa fa-lock input-icon"></i>
                    <input type="password" id="password" name="password" class="form-input with-icon"
                        placeholder="Enter your password" required>
                </div>
            </div>

            <button type="submit" class="btn-login">Sign In</button>
        </form>

        <div class="footer-text">
            &copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($siteName); ?>. All rights reserved.
        </div>
    </div>
</body>

</html>