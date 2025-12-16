<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');

    // Simple slugify
    if (empty($slug)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    }

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        try {
            $pdo = getDBConnection();

            // Check if slug exists
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM headers WHERE slug = ?");
            $stmt->execute([$slug]);
            if ($stmt->fetchColumn() > 0) {
                $error = 'Slug already exists';
            } else {
                // Insert
                $stmt = $pdo->prepare("INSERT INTO headers (title, slug, status, content) VALUES (?, ?, 'draft', '[]')");
                $stmt->execute([$title, $slug]);

                $newId = $pdo->lastInsertId();
                header("Location: ../header-builder.php?id=$newId"); // Redirect to builder
                exit;
            }
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
    }
}

$currentPage = 'headers';
$pageTitle = 'Create Header';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">Create New Header</h1>
</div>

<div class="content-wrapper">
    <div class="card" style="max-width: 600px; margin: 0 auto;">
        <?php if ($error): ?>
            <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label class="form-label" for="title">Header Title</label>
                <input type="text" id="title" name="title" class="form-input" placeholder="e.g. Main Header" required
                    autofocus>
            </div>

            <div class="form-group">
                <label class="form-label" for="slug">Slug (URL)</label>
                <input type="text" id="slug" name="slug" class="form-input" placeholder="e.g. home-page">
                <small style="color: var(--secondary); display: block; margin-top: 0.25rem;">Leave empty to generate
                    from title.</small>
            </div>

            <div style="text-align: right; margin-top: 2rem;">
                <a href="index.php" class="btn" style="color: var(--secondary); margin-right: 1rem;">Cancel</a>
                <button type="submit" class="btn btn-primary">Create & Edit</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>