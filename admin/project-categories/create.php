<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Create Project Category';
$currentPage = 'project_categories';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $image = trim($_POST['image'] ?? '');

    // SEO
    $meta_title = trim($_POST['meta_title'] ?? '');
    $meta_description = trim($_POST['meta_description'] ?? '');
    $meta_keywords = trim($_POST['meta_keywords'] ?? '');
    $meta_image = trim($_POST['meta_image'] ?? '');

    if (empty($name)) {
        $error = "Category name is required.";
    } elseif (empty($slug)) {
        $error = "Slug is required.";
    } else {
        try {
            $pdo = getDBConnection();

            // Check slug uniqueness
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM project_categories WHERE slug = ?");
            $stmt->execute([$slug]);
            if ($stmt->fetchColumn() > 0) {
                $error = "Slug '$slug' already exists.";
            } else {
                $stmt = $pdo->prepare("INSERT INTO project_categories 
                    (name, slug, description, image, meta_title, meta_description, meta_keywords, meta_image) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

                $stmt->execute([$name, $slug, $description, $image, $meta_title, $meta_description, $meta_keywords, $meta_image]);

                header("Location: index.php");
                exit;
            }
        } catch (Exception $e) {
            $error = "Error creating category: " . $e->getMessage();
        }
    }
}

// Fetch gallery for modal
$galleryImages = [];
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT id, file_path, file_name FROM gallery ORDER BY uploaded_at DESC");
    $galleryImages = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
}

require_once __DIR__ . '/../includes/header.php';
?>

<!-- Media Modal CSS -->
<link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/media-modal.css">

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Create Project Category</h1>
        <a href="index.php" class="btn btn-secondary">Back</a>
    </div>
</div>

<div class="content-wrapper">
    <div class="card" style="max-width: 800px; margin: 0 auto;">
        <?php if ($error): ?>
            <div style="padding: 10px; background: #fee2e2; color: #991b1b; border-radius: 4px; margin-bottom: 20px;">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label class="form-label">Category Name *</label>
                <input type="text" name="name" class="form-input" placeholder="e.g., Luxury Villas"
                    value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label">Slug *</label>
                <input type="text" name="slug" class="form-input" placeholder="e.g., luxury-villas"
                    value="<?php echo htmlspecialchars($_POST['slug'] ?? ''); ?>" required>
                <small style="color: var(--secondary);">Auto-generated from name.</small>
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea name="description" class="form-input"
                    rows="4"><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
            </div>

            <!-- Image Upload Field -->
            <div class="form-group">
                <label class="form-label">Category Image</label>
                <div class="image-upload-container">
                    <input type="hidden" name="image" id="category_image"
                        value="<?php echo htmlspecialchars($_POST['image'] ?? ''); ?>">
                    <div id="image_preview"
                        style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <?php if (!empty($_POST['image'])): ?>
                            <img src="<?php echo htmlspecialchars($_POST['image']); ?>"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        <?php else: ?>
                            <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                        <?php endif; ?>
                    </div>
                    <button type="button" class="btn btn-secondary select-image-btn" data-target="category_image">Select
                        Image</button>
                    <button type="button" class="btn btn-danger remove-image-btn" data-target="category_image"
                        style="<?php echo empty($_POST['image']) ? 'display:none;' : ''; ?>">Remove</button>
                </div>
            </div>

            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;">

            <h3 style="margin-bottom: 20px; font-size: 18px;">SEO Settings</h3>

            <div class="form-group">
                <label class="form-label">Meta Title</label>
                <input type="text" name="meta_title" class="form-input"
                    value="<?php echo htmlspecialchars($_POST['meta_title'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label class="form-label">Meta Description</label>
                <textarea name="meta_description" class="form-input"
                    rows="3"><?php echo htmlspecialchars($_POST['meta_description'] ?? ''); ?></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Meta Keywords</label>
                <input type="text" name="meta_keywords" class="form-input"
                    value="<?php echo htmlspecialchars($_POST['meta_keywords'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label class="form-label">Meta Image</label>
                <div class="image-upload-container">
                    <input type="hidden" name="meta_image" id="meta_image"
                        value="<?php echo htmlspecialchars($_POST['meta_image'] ?? ''); ?>">
                    <div id="meta_image_preview"
                        style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <?php if (!empty($_POST['meta_image'])): ?>
                            <img src="<?php echo htmlspecialchars($_POST['meta_image']); ?>"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        <?php else: ?>
                            <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                        <?php endif; ?>
                    </div>
                    <button type="button" class="btn btn-secondary select-image-btn" data-target="meta_image">Select
                        Image</button>
                    <button type="button" class="btn btn-danger remove-image-btn" data-target="meta_image"
                        style="<?php echo empty($_POST['meta_image']) ? 'display:none;' : ''; ?>">Remove</button>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 20px;">Create Category</button>
        </form>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>
<script>
    $(document).ready(function () {
        // Auto-generate slug
        $('input[name="name"]').on('input', function () {
            if (!$('input[name="slug"]').val() || $('input[name="slug"]').data('auto-generated')) {
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                $('input[name="slug"]').val(slug).data('auto-generated', true);
            }
        });
        $('input[name="slug"]').on('input', function () { $(this).data('auto-generated', false); });

        // Media Modal
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

        $(document).on('click', '.select-image-btn', function (e) {
            e.preventDefault();
            activeInputId = $(this).data('target');
            mediaModal.open(galleryData);
        });

        $(document).on('click', '.remove-image-btn', function (e) {
            e.preventDefault();
            activeInputId = $(this).data('target');
            $('#' + activeInputId).val('');
            updatePreview(activeInputId, '');
        });

        function updatePreview(id, url) {
            let previewId = '';
            if (id === 'category_image') previewId = 'image_preview';
            else if (id === 'meta_image') previewId = 'meta_image_preview';

            if (previewId) {
                const preview = $('#' + previewId);
                const removeBtn = $('.remove-image-btn[data-target="' + id + '"]');
                if (url) {
                    preview.html(`<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">`);
                    removeBtn.show();
                } else {
                    preview.html('<span style="color: #64748b; font-size: 0.9rem;">No image</span>');
                    removeBtn.hide();
                }
            }
        }
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>