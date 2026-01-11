<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

// Access Control
if (($_SESSION['admin_role'] ?? 'user') !== 'admin') {
    die("Access Denied.");
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Edit User';
$currentPage = 'users';

$pdo = getDBConnection();
$message = '';
$error = '';

// Get ID
$id = $_GET['id'] ?? null;
if (!$id) {
    header('Location: index.php');
    exit;
}

// Fetch User
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();

if (!$user) {
    die("User not found.");
}

// Handle Update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $role = $_POST['role'] ?? 'user';
    $password = $_POST['password'] ?? '';
    // $email = trim($_POST['email'] ?? ''); // Uncomment if email column exists

    if (empty($username)) {
        $error = "Username is required.";
    } else {
        try {
            if (!empty($password)) {
                // Update with password
                $hashed = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ?, password = ? WHERE id = ?");
                $stmt->execute([$username, $role, $hashed, $id]);
            } else {
                // Update without password
                $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
                $stmt->execute([$username, $role, $id]);
            }
            $message = "User updated successfully!";
            // Refresh
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();
        } catch (Exception $e) {
            $error = "Error updating user: " . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Edit User:
            <?php echo htmlspecialchars($user['username']); ?>
        </h1>
        <a href="index.php" class="btn btn-secondary">Back to Users</a>
    </div>
</div>

<div class="content-wrapper">
    <div class="card" style="max-width: 600px; margin: 0 auto;">
        <?php if ($message): ?>
            <div style="padding: 10px; background: #dcfce7; color: #166534; border-radius: 4px; margin-bottom: 20px;">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div style="padding: 10px; background: #fee2e2; color: #991b1b; border-radius: 4px; margin-bottom: 20px;">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" name="username" class="form-input"
                    value="<?php echo htmlspecialchars($user['username']); ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label">Type of User</label>
                <select name="role" class="form-input">
                    <option value="user" <?php echo ($user['role'] === 'user') ? 'selected' : ''; ?>>User</option>
                    <option value="admin" <?php echo ($user['role'] === 'admin') ? 'selected' : ''; ?>>Admin</option>
                </select>
            </div>

            <!-- Email Field (Hidden/Commented until DB confirmed) -->
            <!--
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-input" value="<?php echo htmlspecialchars($user['email'] ?? ''); ?>">
            </div>
            -->

            <div class="form-group">
                <label class="form-label">New Password (leave blank to keep current)</label>
                <input type="password" name="password" class="form-input" placeholder="Enter new password">
                <small style="color: var(--secondary);">Only fill this if you want to change the password.</small>
            </div>

            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>