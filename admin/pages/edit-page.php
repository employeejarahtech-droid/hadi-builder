<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$id = $_GET['id'] ?? null;
if (!$id) {
    header('Location: index.php');
    exit;
}

$error = '';
$page = null;

try {
    $pdo = getDBConnection();

    // Fetch page
    $stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
    $stmt->execute([$id]);
    $page = $stmt->fetch();

    if (!$page) {
        die("Page not found");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        $status = trim($_POST['status'] ?? 'draft');
        $meta_title = trim($_POST['meta_title'] ?? '');
        $meta_description = trim($_POST['meta_description'] ?? '');
        $keywords = trim($_POST['keywords'] ?? '');
        $og_image = trim($_POST['og_image'] ?? '');

        // Simple slugify if empty (though usually editing existing)
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        }

        // Reserved slugs that cannot be used
        $reservedSlugs = ['admin', 'api', 'assets', 'includes', 'theme', 'uploads', 'post', 'posts', 'product', 'blog', 'category', 'tag', 'search'];

        if (empty($title)) {
            $error = 'Title is required';
        } elseif (in_array($slug, $reservedSlugs) && $slug !== $page['slug']) {
            // Allow keeping the same slug if it was already reserved (for existing pages)
            $error = "The slug '$slug' is reserved and cannot be used. Please choose a different slug.";
        } else {
            // Check if slug exists (excluding current page)
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ? AND id != ?");
            $stmt->execute([$slug, $id]);
            if ($stmt->fetchColumn() > 0) {
                $error = 'Slug already exists';
            } else {
                // Update
                $stmt = $pdo->prepare("UPDATE pages SET title = ?, slug = ?, status = ?, meta_title = ?, meta_description = ?, keywords = ?, og_image = ?, updated_at = NOW() WHERE id = ?");
                $stmt->execute([$title, $slug, $status, $meta_title, $meta_description, $keywords, $og_image, $id]);

                header("Location: index.php");
                exit;
            }
        }
    }

} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

// Fetch gallery images for modal
$galleryImages = [];
try {
    $pdo = getDBConnection(); // Ensure connection is available
    $stmt_gallery = $pdo->query("SELECT id, file_path, file_name FROM gallery ORDER BY uploaded_at DESC");
    $galleryImages = $stmt_gallery->fetchAll(PDO::FETCH_ASSOC);

    if (empty($galleryImages)) {
        $galleryImages = [
            ['id' => 1, 'file_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'file_name' => 'sample-1.jpg'],
            ['id' => 2, 'file_path' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'file_name' => 'sample-2.jpg'],
            ['id' => 3, 'file_path' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 'file_name' => 'sample-3.jpg']
        ];
    }
} catch (Exception $e) { /* Ignore */
}

$currentPage = 'pages';
$pageTitle = 'Edit Page';
require_once __DIR__ . '/../includes/header.php';
?>

<!-- Media Modal CSS -->
<link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/media-modal.css">

<div class="page-header">
    <h1 class="page-title">Edit Page</h1>
</div>

<div class="content-wrapper">
    <form method="POST" action="" style="max-width: 800px; margin: 0 auto;">

        <!-- Card 1: Basic Information -->
        <div class="card" style="margin-bottom: 2rem;">
            <h2
                style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
                Basic Information
            </h2>

            <div class="form-group">
                <label class="form-label" for="title">Page Title</label>
                <input type="text" id="title" name="title" class="form-input"
                    value="<?php echo htmlspecialchars($page['title']); ?>" required autofocus>
            </div>

            <div class="form-group">
                <label class="form-label" for="slug">Slug (URL)</label>
                <input type="text" id="slug" name="slug" class="form-input"
                    value="<?php echo htmlspecialchars($page['slug']); ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="status">Status</label>
                <select id="status" name="status" class="form-input">
                    <option value="draft" <?php echo $page['status'] === 'draft' ? 'selected' : ''; ?>>Draft</option>
                    <option value="published" <?php echo $page['status'] === 'published' ? 'selected' : ''; ?>>Published
                    </option>
                </select>
                <small style="color: var(--secondary); display: block; margin-top: 0.25rem;">Only published pages are
                    visible on the frontend.</small>
            </div>

            <!-- Page Thumbnail -->
            <div class="form-group">
                <label class="form-label">Page Thumbnail (Featured Image)</label>
                <div class="image-upload-container" style="margin-top: 10px;">
                    <input type="hidden" name="image" id="page_image"
                        value="<?php echo htmlspecialchars($page['image'] ?? ''); ?>">

                    <div id="page_image_preview"
                        style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <?php if (!empty($page['image'])): ?>
                            <img src="<?php echo htmlspecialchars($page['image']); ?>"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        <?php else: ?>
                            <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                        <?php endif; ?>
                    </div>

                    <button type="button" class="btn btn-secondary select-image-btn" data-target="page_image">Select
                        Image</button>
                    <button type="button" class="btn btn-danger remove-image-btn" data-target="page_image"
                        style="<?php echo empty($page['image']) ? 'display:none;' : ''; ?>">Remove</button>
                </div>
            </div>
        </div>

        <!-- Card 2: SEO -->
        <div class="card">
            <h2
                style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
                SEO
            </h2>

            <!-- Meta Image -->
            <div class="form-group">
                <label class="form-label">Meta Image (Social Share Image)</label>
                <div class="image-upload-container" style="margin-top: 10px;">
                    <input type="hidden" name="meta_image" id="meta_image"
                        value="<?php echo htmlspecialchars($page['meta_image'] ?? ''); ?>">

                    <div id="meta_image_preview"
                        style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <?php if (!empty($page['meta_image'])): ?>
                            <img src="<?php echo htmlspecialchars($page['meta_image']); ?>"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        <?php else: ?>
                            <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                        <?php endif; ?>
                    </div>

                    <button type="button" class="btn btn-secondary select-image-btn" data-target="meta_image">Select
                        Image</button>
                    <button type="button" class="btn btn-danger remove-image-btn" data-target="meta_image"
                        style="<?php echo empty($page['meta_image']) ? 'display:none;' : ''; ?>">Remove</button>
                </div>
            </div>

            <div style="margin-top: 2rem; padding-top: 1rem;">
                <div class="form-group">
                    <label class="form-label">Meta Title</label>
                    <input type="text" name="meta_title" class="form-input"
                        value="<?php echo htmlspecialchars($page['meta_title'] ?? ''); ?>"
                        placeholder="SEO Title (defaults to page title if empty)">
                </div>

                <div class="form-group">
                    <label class="form-label">Meta Description</label>
                    <textarea name="meta_description" class="form-input" rows="3"
                        placeholder="Brief summary for search engines"><?php echo htmlspecialchars($page['meta_description'] ?? ''); ?></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Meta Keywords</label>
                    <input type="text" name="meta_keywords" class="form-input"
                        value="<?php echo htmlspecialchars($page['meta_keywords'] ?? ''); ?>"
                        placeholder="comma, separated, keywords">
                </div>
            </div>

            <div style="text-align: right; margin-top: 2rem;">
                <a href="index.php" class="btn" style="color: var(--secondary); margin-right: 1rem;">Cancel</a>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </div>
    </form>
</div>

<!-- Media Modal Component -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>

<script>
    $(document).ready(function () {
        // Media Modal Logic
        const galleryData = <?php echo json_encode($galleryImages); ?>;
        let activeInputId = null;

        const mediaModal = new MediaModal({
            apiUrl: '<?php echo base_url; ?>/api/media/list.php',
            onSelect: function (image) {
                if (activeInputId) {
                    $('#' + activeInputId).val(image.file_path);
                    updatePreview(activeInputId, image.file_path);
                }
            }
        });

        // Open modal
        $(document).on('click', '.select-image-btn', function (e) {
            e.preventDefault();
            activeInputId = $(this).data('target');
            mediaModal.open(galleryData);
        });

        // Remove image
        $(document).on('click', '.remove-image-btn', function (e) {
            e.preventDefault();
            const targetId = $(this).data('target');
            $('#' + targetId).val('');
            updatePreview(targetId, '');
        });

        function updatePreview(inputId, url) {
            const previewId = inputId + '_preview';
            const container = $('#' + previewId);
            const removeBtn = $(`.remove-image-btn[data-target="${inputId}"]`);

            if (url) {
                container.html(`<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">`);
                removeBtn.show();
            } else {
                container.html('<span style="color: #64748b; font-size: 0.9rem;">No image</span>');
                removeBtn.hide();
            }
        }
    });
</script>

<!-- Hidden gallery data for modal -->
<?php foreach ($galleryImages as $img): ?>
    <div class="gallery-image-item-data" style="display: none;" data-id="<?php echo $img['id']; ?>"
        data-path="<?php echo htmlspecialchars($img['file_path']); ?>"
        data-name="<?php echo htmlspecialchars($img['file_name']); ?>"></div>
<?php endforeach; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>