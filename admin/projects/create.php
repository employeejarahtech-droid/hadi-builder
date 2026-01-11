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
    $description = trim($_POST['description'] ?? '');
    $featured_image = trim($_POST['featured_image'] ?? '');
    $project_type = trim($_POST['project_type'] ?? 'building');
    $category_id = !empty($_POST['category_id']) ? intval($_POST['category_id']) : null;

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
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM projects WHERE slug = ?");
            $stmt->execute([$slug]);
            if ($stmt->fetchColumn() > 0) {
                $error = 'Slug already exists';
            } else {
                // Insert
                $stmt = $pdo->prepare("INSERT INTO projects (title, slug, description, project_type, category_id, featured_image, status, content, meta_title, meta_description, meta_keywords, meta_image) VALUES (?, ?, ?, ?, ?, ?, 'draft', '[]', ?, ?, ?, ?)");
                $stmt->execute([
                    $title,
                    $slug,
                    $description,
                    $project_type,
                    $category_id,
                    $featured_image,
                    $_POST['meta_title'] ?? null,
                    $_POST['meta_description'] ?? null,
                    $_POST['meta_keywords'] ?? null,
                    $_POST['meta_image'] ?? null
                ]);

                $newId = $pdo->lastInsertId();
                header("Location: edit.php?id=$newId"); // Redirect to edit
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
    $stmt = $pdo->query("SELECT id, file_path, file_name FROM gallery ORDER BY uploaded_at DESC");
    $galleryImages = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    // Ignore gallery errors
}

// Fetch categories
$projectCategories = [];
try {
    $stmt = $pdo->query("SELECT id, name FROM project_categories ORDER BY name ASC");
    $projectCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    // Ignore category errors
}

$currentPage = 'projects';
$pageTitle = 'Create Project';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">Create New Project</h1>
</div>

<div class="content-wrapper">
    <?php if ($error): ?>
        <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="" style="max-width: 800px; margin: 0 auto;">

        <!-- Card 1: Basic Information -->
        <div class="card" style="margin-bottom: 2rem;">
            <h2
                style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
                Basic Information
            </h2>

            <div class="form-group">
                <label class="form-label" for="title">Project Title</label>
                <input type="text" id="title" name="title" class="form-input"
                    placeholder="e.g. Luxury Apartments Downtown" required autofocus
                    value="<?php echo htmlspecialchars($_POST['title'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label class="form-label" for="slug">Slug (URL)</label>
                <input type="text" id="slug" name="slug" class="form-input"
                    placeholder="e.g. luxury-apartments-downtown"
                    value="<?php echo htmlspecialchars($_POST['slug'] ?? ''); ?>">
                <small style="color: var(--secondary); display: block; margin-top: 0.25rem;">Leave empty to generate
                    from title.</small>
            </div>

            <div class="form-group">
                <label class="form-label" for="description">Description</label>
                <textarea id="description" name="description" class="form-input" rows="4"
                    placeholder="Brief description of the project..."><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
            </div>

            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group" style="flex: 1;">
                    <label class="form-label">Project Type</label>
                    <select name="project_type" class="form-input">
                        <option value="building" <?php echo ($_POST['project_type'] ?? '') == 'building' ? 'selected' : ''; ?>>Building</option>
                        <option value="land" <?php echo ($_POST['project_type'] ?? '') == 'land' ? 'selected' : ''; ?>>
                            Land</option>
                        <option value="plot" <?php echo ($_POST['project_type'] ?? '') == 'plot' ? 'selected' : ''; ?>>
                            Plot</option>
                        <option value="house" <?php echo ($_POST['project_type'] ?? '') == 'house' ? 'selected' : ''; ?>>
                            House</option>
                        <option value="commercial" <?php echo ($_POST['project_type'] ?? '') == 'commercial' ? 'selected' : ''; ?>>Commercial</option>
                        <option value="residential" <?php echo ($_POST['project_type'] ?? '') == 'residential' ? 'selected' : ''; ?>>Residential</option>
                        <option value="apartment" <?php echo ($_POST['project_type'] ?? '') == 'apartment' ? 'selected' : ''; ?>>Apartment</option>
                        <option value="villa" <?php echo ($_POST['project_type'] ?? '') == 'villa' ? 'selected' : ''; ?>>
                            Villa</option>
                    </select>
                </div>
                <div class="form-group" style="flex: 1;">
                    <label class="form-label">Category</label>
                    <select name="category_id" class="form-input">
                        <option value="">Select Category</option>
                        <?php foreach ($projectCategories as $cat): ?>
                            <option value="<?php echo $cat['id']; ?>" <?php echo ($_POST['category_id'] ?? '') == $cat['id'] ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($cat['name']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <!-- Featured Image -->
            <div class="form-group">
                <label class="form-label">Featured Image</label>
                <div class="image-upload-container" style="margin-top: 10px;">
                    <input type="hidden" name="featured_image" id="featured_image"
                        value="<?php echo htmlspecialchars($_POST['featured_image'] ?? ''); ?>">

                    <div id="featured_image_preview"
                        style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <?php if (!empty($_POST['featured_image'])): ?>
                            <img src="<?php echo htmlspecialchars($_POST['featured_image']); ?>"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        <?php else: ?>
                            <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                        <?php endif; ?>
                    </div>

                    <button type="button" class="btn btn-secondary select-image-btn" data-target="featured_image">Select
                        Image</button>
                    <button type="button" class="btn btn-danger remove-image-btn" data-target="featured_image"
                        style="<?php echo empty($_POST['featured_image']) ? 'display:none;' : ''; ?>">Remove</button>
                </div>
            </div>
        </div>

        <!-- Card 2: SEO -->
        <div class="card" style="margin-bottom: 2rem;">
            <h2
                style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
                SEO
            </h2>

            <!-- Meta Image -->
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
                        value="<?php echo htmlspecialchars($_POST['meta_title'] ?? ''); ?>"
                        placeholder="SEO Title (defaults to project title if empty)">
                </div>

                <div class="form-group">
                    <label class="form-label">Meta Description</label>
                    <textarea name="meta_description" class="form-input" rows="3"
                        placeholder="Brief summary for search engines"><?php echo htmlspecialchars($_POST['meta_description'] ?? ''); ?></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Meta Keywords</label>
                    <input type="text" name="meta_keywords" class="form-input"
                        value="<?php echo htmlspecialchars($_POST['meta_keywords'] ?? ''); ?>"
                        placeholder="comma, separated, keywords">
                </div>
            </div>
        </div>

        <div style="text-align: right; max-width: 800px; margin: 0 auto;">
            <a href="index.php" class="btn" style="color: var(--secondary); margin-right: 1rem;">Cancel</a>
            <button type="submit" class="btn btn-primary">Create & Edit</button>
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

<?php require_once __DIR__ . '/../includes/footer.php'; ?>