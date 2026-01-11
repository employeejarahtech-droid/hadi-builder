<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

// Access Control
if (($_SESSION['admin_role'] ?? 'user') !== 'admin') {
    die("Access Denied: You do not have permission to add users.");
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Add New User';
$currentPage = 'users';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    // $email = trim($_POST['email'] ?? '');
    $role = $_POST['role'] ?? 'user';

    if (empty($username) || empty($password)) {
        $error = "Username and Password are required.";
    } else {
        try {
            $pdo = getDBConnection();

            // Check existence
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$username]);
            if ($stmt->fetch()) {
                $error = "Username already exists.";
            } else {
                // Insert
                $hashed = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (username, password, role, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)");
                $stmt->execute([$username, $hashed, $role]);

                header('Location: index.php'); // Redirect to list
                exit;
            }
        } catch (Exception $e) {
            $error = "Error creating user: " . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Add New User</h1>
        <a href="index.php" class="btn btn-secondary">Back to Users</a>
    </div>
</div>

<div class="content-wrapper">
    <div class="card" style="max-width: 600px; margin: 0 auto;">
        <?php if ($error): ?>
            <div style="padding: 10px; background: #fee2e2; color: #991b1b; border-radius: 4px; margin-bottom: 20px;">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" name="username" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Type of User</label>
                <select name="role" class="form-input">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">Create User</button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>