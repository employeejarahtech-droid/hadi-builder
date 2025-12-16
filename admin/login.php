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

// Handle Login
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    try {
        require_once __DIR__ . '/../includes/db.php';
        $pdo = getDBConnection();

        $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];

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
    <title>Admin Login - <?php echo isset($env['APP_NAME']) ? $env['APP_NAME'] : 'New CMS'; ?></title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }

        .login-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            width: 100%;
            max-width: 400px;
        }

        .login-title {
            text-align: center;
            color: #1e293b;
            margin-bottom: 2rem;
            font-size: 1.5rem;
            font-weight: 700;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #475569;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .form-input {
            width: 100%;
            padding: 0.625rem;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box;
            /* Fix for width issue */
        }

        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .btn-login {
            width: 100%;
            background-color: #3b82f6;
            color: white;
            padding: 0.75rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .btn-login:hover {
            background-color: #2563eb;
        }

        .error-msg {
            background-color: #fee2e2;
            color: #991b1b;
            padding: 0.75rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="login-card">
        <div class="login-title">Admin Login</div>

        <?php if ($error): ?>
            <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" name="username" class="form-input" required autofocus>
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" name="password" class="form-input" required>
            </div>

            <button type="submit" class="btn-login">Sign In</button>
        </form>
    </div>
</body>

</html>