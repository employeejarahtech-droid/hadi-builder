<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Create Topbar';
$currentPage = 'topbars';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');

    if (empty($name)) {
        $error = "Name is required.";
    } else {
        try {
            $pdo = getDBConnection();
            $stmt = $pdo->prepare("INSERT INTO topbars (name, content, created_at) VALUES (?, '[]', CURRENT_TIMESTAMP)");
            $stmt->execute([$name]);
            $id = $pdo->lastInsertId();

            // Redirect to builder
            header("Location: ../builder.php?type=topbar&id=$id");
            exit;
        } catch (Exception $e) {
            $error = "Error creating topbar: " . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Create New Topbar</h1>
        <a href="index.php" class="btn btn-secondary">Back</a>
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
                <label class="form-label">Topbar Name</label>
                <input type="text" name="name" class="form-input" placeholder="e.g., Default Topbar" required>
            </div>

            <button type="submit" class="btn btn-primary">Create & Edit</button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>