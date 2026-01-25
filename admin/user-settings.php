<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

require_once __DIR__ . '/../includes/db.php';

$pageTitle = 'User Settings';
// $currentPage = 'user-settings'; // Not strictly needed unless sidebar highlights it

$pdo = getDBConnection();
$message = '';
$error = '';

// Get Current User ID
$id = $_SESSION['admin_user_id'] ?? null;
if (!$id) {
    header('Location: login.php');
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
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    // Email field if supported in DB. Checking if user array has email key
    $email = isset($user['email']) ? trim($_POST['email'] ?? '') : null;

    if (empty($username)) {
        $error = "Username is required.";
    } elseif (!empty($password) && $password !== $confirm_password) {
        $error = "Passwords do not match.";
    } else {
        try {
            // Check if username taken by another user
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ? AND id != ?");
            $stmt->execute([$username, $id]);
            if ($stmt->fetchColumn() > 0) {
                $error = "Username already exists.";
            } else {
                if (!empty($password)) {
                    // Update with password
                    $hashed = password_hash($password, PASSWORD_DEFAULT);

                    if ($email !== null) {
                        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?");
                        $stmt->execute([$username, $email, $hashed, $id]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE users SET username = ?, password = ? WHERE id = ?");
                        $stmt->execute([$username, $hashed, $id]);
                    }
                } else {
                    // Update without password
                    if ($email !== null) {
                        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
                        $stmt->execute([$username, $email, $id]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE users SET username = ? WHERE id = ?");
                        $stmt->execute([$username, $id]);
                    }
                }

                // Update Session
                $_SESSION['admin_username'] = $username;
                if ($email !== null) {
                    $_SESSION['admin_email'] = $email;
                }

                $message = "Profile updated successfully!";

                // Refresh data
                $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$id]);
                $user = $stmt->fetch();
            }
        } catch (Exception $e) {
            $error = "Error updating profile: " . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">User Settings</h1>
</div>

<div class="content-wrapper">
    <div class="card" style="max-width: 600px; margin: 0 auto;">

        <?php if ($message): ?>
            <div style="padding: 10px; background: #dcfce7; color: #166534; border-radius: 4px; margin-bottom: 20px;">
                <i class="fa fa-check-circle"></i>
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div style="padding: 10px; background: #fee2e2; color: #991b1b; border-radius: 4px; margin-bottom: 20px;">
                <i class="fa fa-exclamation-circle"></i>
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" name="username" class="form-input"
                    value="<?php echo htmlspecialchars($user['username']); ?>" required>
            </div>

            <?php if (isset($user['email'])): ?>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" name="email" class="form-input"
                        value="<?php echo htmlspecialchars($user['email']); ?>">
                </div>
            <?php endif; ?>

            <div style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;">Change Password</h3>

                <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input type="password" name="password" class="form-input" placeholder="Leave blank to keep current">
                </div>

                <div class="form-group">
                    <label class="form-label">Confirm New Password</label>
                    <input type="password" name="confirm_password" class="form-input"
                        placeholder="Confirm new password">
                </div>
            </div>

            <div style="margin-top: 2rem; text-align: right;">
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>