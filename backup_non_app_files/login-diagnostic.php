<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Diagnostic Tool</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f1f5f9;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }

        .card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
        }

        h1 {
            color: #1e293b;
            margin-top: 0;
        }

        h2 {
            color: #475569;
            font-size: 1.25rem;
            margin-top: 0;
        }

        .status {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            margin: 0.5rem 0;
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

        pre {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }

        .btn {
            background: #3b82f6;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            margin-right: 0.5rem;
        }

        .btn:hover {
            background: #2563eb;
        }
    </style>
</head>

<body>
    <div class="card">
        <h1>🔍 Login Diagnostic Tool</h1>
        <p>This page will help diagnose why you can't log in.</p>
    </div>

    <div class="card">
        <h2>Test Results</h2>
        <?php
        session_start();
        require_once __DIR__ . '/includes/db.php';

        echo '<div class="status info"><strong>Session ID:</strong> ' . session_id() . '</div>';

        try {
            $pdo = getDBConnection();

            // Check user exists
            $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE username = ?");
            $stmt->execute(['maksud']);
            $user = $stmt->fetch();

            if ($user) {
                echo '<div class="status success">✓ User "maksud" exists in database (ID: ' . $user['id'] . ')</div>';
            } else {
                echo '<div class="status error">✗ User "maksud" NOT found in database</div>';
            }

            // Test password
            $stmt = $pdo->prepare("SELECT password FROM users WHERE username = ?");
            $stmt->execute(['maksud']);
            $userData = $stmt->fetch();

            if ($userData && password_verify('maksud', $userData['password'])) {
                echo '<div class="status success">✓ Password verification works correctly</div>';
            } else {
                echo '<div class="status error">✗ Password verification failed</div>';
            }

            // Check session
            if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
                echo '<div class="status success">✓ You are currently logged in!</div>';
                echo '<div class="status info">User ID: ' . $_SESSION['admin_user_id'] . ', Username: ' . $_SESSION['admin_username'] . '</div>';
            } else {
                echo '<div class="status info">ℹ You are not currently logged in</div>';
            }

        } catch (Exception $e) {
            echo '<div class="status error">Database Error: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
        ?>
    </div>

    <div class="card">
        <h2>Quick Actions</h2>
        <button class="btn" onclick="window.location.href='admin/login.php'">Go to Login Page</button>
        <button class="btn" onclick="clearBrowserData()">Clear Browser Cache</button>
    </div>

    <div class="card">
        <h2>Common Issues & Solutions</h2>
        <ol>
            <li><strong>Browser Cache:</strong> Try clearing your browser cache and cookies, then try logging in again.
            </li>
            <li><strong>Incognito Mode:</strong> Try logging in using an incognito/private window.</li>
            <li><strong>Cookies Disabled:</strong> Make sure cookies are enabled in your browser.</li>
            <li><strong>JavaScript Errors:</strong> Open browser console (F12) and check for any errors.</li>
            <li><strong>Wrong URL:</strong> Make sure you're accessing
                <code>http://localhost:8000/admin/login.php</code></li>
        </ol>
    </div>

    <div class="card">
        <h2>Manual Login Test</h2>
        <form method="POST" action="admin/login.php" style="margin-top: 1rem;">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">Username:</label>
                <input type="text" name="username" value="maksud"
                    style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">Password:</label>
                <input type="password" name="password" value="maksud"
                    style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 4px;">
            </div>
            <button type="submit" class="btn">Test Login</button>
        </form>
    </div>

    <script>
        function clearBrowserData() {
            alert('Please manually clear your browser cache and cookies:\n\n' +
                'Chrome: Ctrl+Shift+Delete\n' +
                'Firefox: Ctrl+Shift+Delete\n' +
                'Edge: Ctrl+Shift+Delete\n\n' +
                'Then try logging in again.');
        }
    </script>
</body>

</html>