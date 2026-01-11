<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Login Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 500px;
        }

        h1 {
            color: #1e293b;
            margin-bottom: 1rem;
        }

        .info-box {
            background: #f1f5f9;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            text-align: left;
        }

        .credential {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.75rem 0;
            padding: 0.5rem;
            background: white;
            border-radius: 4px;
        }

        .label {
            font-weight: 600;
            color: #475569;
        }

        .value {
            font-family: 'Courier New', monospace;
            background: #e0e7ff;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            color: #3730a3;
        }

        .btn {
            background: #3b82f6;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 0.5rem;
            transition: all 0.3s;
        }

        .btn:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
            background: #64748b;
        }

        .btn-secondary:hover {
            background: #475569;
        }

        .status {
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 8px;
            font-weight: 500;
        }

        .success {
            background: #dcfce7;
            color: #166534;
        }

        .error {
            background: #fee2e2;
            color: #991b1b;
        }

        .info {
            background: #dbeafe;
            color: #1e40af;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>🔐 Login Test Page</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Use these credentials to log in</p>

        <div class="info-box">
            <div class="credential">
                <span class="label">Username:</span>
                <span class="value">maksud</span>
            </div>
            <div class="credential">
                <span class="label">Password:</span>
                <span class="value">maksud</span>
            </div>
        </div>

        <?php
        session_start();

        // Check if already logged in
        if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
            echo '<div class="status success">';
            echo '✓ You are currently LOGGED IN!<br>';
            echo 'User: ' . htmlspecialchars($_SESSION['admin_username']) . ' (ID: ' . $_SESSION['admin_user_id'] . ')';
            echo '</div>';
            echo '<a href="admin/index.php" class="btn">Go to Dashboard</a>';
            echo '<a href="admin/login.php?logout=1" class="btn btn-secondary">Logout</a>';
        } else {
            echo '<div class="status info">';
            echo 'ℹ You are not logged in yet';
            echo '</div>';
            echo '<a href="admin/login.php" class="btn">Go to Login Page</a>';
        }
        ?>

        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
            <a href="login-diagnostic.php" class="btn btn-secondary">Open Diagnostic Tool</a>
        </div>

        <div style="margin-top: 2rem; font-size: 0.875rem; color: #64748b;">
            <p><strong>Instructions:</strong></p>
            <ol style="text-align: left; padding-left: 2rem;">
                <li>Click "Go to Login Page"</li>
                <li>Enter username: <code>maksud</code></li>
                <li>Enter password: <code>maksud</code></li>
                <li>Click "Sign In"</li>
            </ol>
        </div>
    </div>
</body>

</html>