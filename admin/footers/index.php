<?php
session_start();

// Ensure auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();
    // Fetch all footers
    $stmt = $pdo->query("SELECT * FROM footers ORDER BY created_at DESC");
    $footers = $stmt->fetchAll();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$currentPage = 'footers';
$pageTitle = 'Manage Footers';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Footers</h1>
        <a href="create.php" class="btn btn-primary">
            <i class="fa fa-plus"></i> Create New Footer
        </a>
    </div>
</div>

<div class="content-wrapper">
    <?php if (count($footers) > 0): ?>
        <table class="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($footers as $footer): ?>
                    <tr>
                        <td><strong><?php echo htmlspecialchars($footer['title']); ?></strong></td>
                        <td>
                            <a href="<?php echo base_url . '/' . htmlspecialchars($footer['slug']); ?>" target="_blank"
                                style="color: var(--primary); text-decoration: none;">
                                /<?php echo htmlspecialchars($footer['slug']); ?> <i class="fa fa-external-link-alt"
                                    style="font-size: 0.75em;"></i>
                            </a>
                        </td>
                        <td>
                            <span
                                class="badge <?php echo $footer['status'] === 'published' ? 'badge-success' : 'badge-warning'; ?>">
                                <?php echo ucfirst($footer['status']); ?>
                            </span>
                        </td>
                        <td><?php echo date('M d, Y', strtotime($footer['updated_at'])); ?></td>
                        <td style="text-align: right;">
                            <a href="../footer-builder.php?id=<?php echo $footer['id']; ?>" class="btn btn-primary"
                                style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                <i class="fa fa-edit"></i> Edit
                            </a>
                            <a href="delete.php?id=<?php echo $footer['id']; ?>" class="btn btn-danger"
                                style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="return confirm('Are you sure?');">
                                <i class="fa fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php else: ?>
        <div class="card" style="text-align: center; padding: 3rem;">
            <i class="fa fa-file-alt" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
            <h3>No footers found</h3>
            <p style="color: var(--secondary); margin-bottom: 1.5rem;">Get started by creating your first footer.</p>
            <a href="create.php" class="btn btn-primary">Create Footer</a>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>