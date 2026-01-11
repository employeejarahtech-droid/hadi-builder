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

    // Reserved slugs that cannot be used
    $reservedSlugs = ['admin', 'api', 'assets', 'includes', 'theme', 'uploads', 'post', 'posts', 'product', 'products', 'blog', 'category', 'tag', 'search'];

    if (empty($title)) {
        $error = 'Title is required';
    } elseif (in_array($slug, $reservedSlugs)) {
        $error = "The slug '$slug' is reserved and cannot be used. Please choose a different slug.";
    } else {
        try {
            $pdo = getDBConnection();

            // Check if slug exists
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ?");
            $stmt->execute([$slug]);
            if ($stmt->fetchColumn() > 0) {
                $error = 'Slug already exists';
            } else {
                // Insert
                $stmt = $pdo->prepare("INSERT INTO pages (title, slug, status, content, meta_title, meta_description, meta_keywords, image, meta_image) VALUES (?, ?, 'draft', '[]', ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $title,
                    $slug,
                    $_POST['meta_title'] ?? null,
                    $_POST['meta_description'] ?? null,
                    $_POST['meta_keywords'] ?? null,
                    $_POST['image'] ?? null,
                    $_POST['meta_image'] ?? null
                ]);

                $newId = $pdo->lastInsertId();
                header("Location: ../builder.php?type=page&id=$newId"); // Redirect to builder
                exit;
            }
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
    }
}

// Fetch gallery images
$galleryImages = [];
try {
    $pdo = getDBConnection();
    // Create gallery table if it doesn't exist just in case (though posts check handled it)
    $stmt = $pdo->query("SELECT id, file_path, file_name FROM gallery ORDER BY uploaded_at DESC");
    $galleryImages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // If no images, add sample data
    if (empty($galleryImages)) {
        $galleryImages = [
            ['id' => 1, 'file_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'file_name' => 'sample-1.jpg'],
            ['id' => 2, 'file_path' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'file_name' => 'sample-2.jpg'],
            ['id' => 3, 'file_path' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 'file_name' => 'sample-3.jpg']
        ];
    }
} catch (Exception $e) {
    // Ignore gallery errors
}

$currentPage = 'pages';
$pageTitle = 'Create Page';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">Create New Page</h1>
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
                <input type="text" id="title" name="title" class="form-input" placeholder="e.g. Home Page" required
                    autofocus>
            </div>

            <div class="form-group">
                <label class="form-label" for="slug">Slug (URL)</label>
                <input type="text" id="slug" name="slug" class="form-input" placeholder="e.g. home-page">
                <small style="color: var(--secondary); display: block; margin-top: 0.25rem;">Leave empty to generate
                    from title.</small>
            </div>

            <!-- Image Upload Fields -->
            <div class="form-group">
                <label class="form-label">Page Thumbnail (Featured Image)</label>
                <div class="image-upload-container" style="margin-top: 10px;">
                    <input type="hidden" name="image" id="page_image"
                        value="<?php echo htmlspecialchars($_POST['image'] ?? ''); ?>">

                    <div id="page_image_preview"
                        style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <?php if (!empty($_POST['image'])): ?>
                            <img src="<?php echo htmlspecialchars($_POST['image']); ?>"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        <?php else: ?>
                            <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                        <?php endif; ?>
                    </div>

                    <button type="button" class="btn btn-secondary select-image-btn" data-target="page_image">Select
                        Image</button>
                    <button type="button" class="btn btn-danger remove-image-btn" data-target="page_image"
                        style="<?php echo empty($_POST['image']) ? 'display:none;' : ''; ?>">Remove</button>
                </div>
            </div>
        </div>

        <!-- Card 2: Images & SEO -->
        <div class="card">
            <h2
                style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
                SEO
            </h2>


            <div class="form-group">
                <label class="form-label">Meta Image (Social Share Image)</label>
                <div class="image-upload-container" style="margin-top: 10px;">
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

            <div style="margin-top: 2rem; padding-top: 1rem;">

                <div class="form-group">
                    <label class="form-label">Meta Title</label>
                    <input type="text" name="meta_title" class="form-input"
                        placeholder="SEO Title (defaults to page title if empty)">
                </div>

                <div class="form-group">
                    <label class="form-label">Meta Description</label>
                    <textarea name="meta_description" class="form-input" rows="3"
                        placeholder="Brief summary for search engines"></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Meta Keywords</label>
                    <input type="text" name="meta_keywords" class="form-input" placeholder="comma, separated, keywords">
                </div>
            </div>

            <div style="text-align: right; margin-top: 2rem;">
                <a href="index.php" class="btn" style="color: var(--secondary); margin-right: 1rem;">Cancel</a>
                <button type="submit" class="btn btn-primary">Create & Edit</button>
            </div>
        </div>
    </form>
</div>

<!-- Media Modal Assets -->
<link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/media-modal.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>

<script>
    $(document).ready(function () {
        // Auto-generate slug
        $('#title').on('input', function () {
            if (!$('#slug').val()) {
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                $('#slug').val(slug);
            }
        });

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