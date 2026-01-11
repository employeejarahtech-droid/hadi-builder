<?php
session_start();

// Authentication Check
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

// Include DB first
require_once __DIR__ . '/../../includes/db.php';

// Setup Environment
$rootDir = dirname(dirname(dirname(__DIR__))); // Go up from admin/users/index.php
// But actually we are in admin/users/index.php, so __DIR__ is .../admin/users
// Up 1: admin, Up 2: new-cms
// Let's use the same relative path logic as other admin pages
// Access Control
if (($_SESSION['admin_role'] ?? 'user') !== 'admin') {
    require_once __DIR__ . '/../includes/header.php';
    echo '<div class="content-wrapper"><div class="card" style="text-align: center; padding: 40px; color: #ef4444;"><i class="fa fa-lock" style="font-size: 48px; margin-bottom: 20px;"></i><h2>Access Denied</h2><p>Only Administrators can manage users.</p></div></div>';
    require_once __DIR__ . '/../includes/footer.php';
    exit;
}



$pageTitle = 'Manage Users';
$currentPage = 'users';

// Fetch Users
$pdo = getDBConnection();
$stmt = $pdo->query("SELECT * FROM users ORDER BY id ASC");
$users = $stmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Users</h1>
        <a href="create.php" class="btn btn-primary"><i class="fa fa-plus"></i> New User</a>
    </div>
</div>

<div class="content-wrapper">
    <div class="card">
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <!-- <th>Email</th> -->
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($users)): ?>
                    <tr>
                        <td colspan="4" style="text-align: center; color: var(--secondary);">No users found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td>
                                <?php echo $user['id']; ?>
                            </td>
                            <td style="font-weight: 500;">
                                <?php echo htmlspecialchars($user['username']); ?>
                            </td>
                            <!-- <td><?php echo htmlspecialchars($user['email'] ?? ''); ?></td> -->
                            <td style="text-align: right;">
                                <a href="edit.php?id=<?php echo $user['id']; ?>" class="btn btn-sm btn-outline-primary">
                                    <i class="fa fa-edit"></i> Edit
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>