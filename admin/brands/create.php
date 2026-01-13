<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Create Brand';
$currentPage = 'brands';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if (empty($name)) {
        $error = "Brand name is required.";
    } elseif (empty($slug)) {
        $error = "Slug is required.";
    } else {
        try {
            $logo = trim($_POST['logo'] ?? ''); // Get logo
            $meta_title = trim($_POST['meta_title'] ?? '');
            $meta_description = trim($_POST['meta_description'] ?? '');
            $meta_keywords = trim($_POST['meta_keywords'] ?? '');
            $meta_image = trim($_POST['meta_image'] ?? '');

            $pdo = getDBConnection();

            // Create brands table if it doesn't exist
            $pdo->exec("CREATE TABLE IF NOT EXISTS brands (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                logo VARCHAR(255) NULL,
                meta_title VARCHAR(255) NULL,
                meta_description TEXT NULL,
                meta_keywords VARCHAR(255) NULL,
                meta_image VARCHAR(255) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )");

            $stmt = $pdo->prepare("INSERT INTO brands (name, slug, description, logo, meta_title, meta_description, meta_keywords, meta_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $slug, $description, $logo, $meta_title, $meta_description, $meta_keywords, $meta_image]);

            header("Location: index.php");
            exit;
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                $error = "A brand with this slug already exists.";
            } else {
                $error = "Error creating brand: " . $e->getMessage();
            }
        }
    }
}

// Fetch gallery images
$galleryImages = [];
try {
    $pdo = getDBConnection();
    // Create gallery table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

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

require_once __DIR__ . '/../includes/header.php';
?>

<!-- Media Modal CSS -->
<link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/media-modal.css">

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Create New Brand</h1>
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
            <!-- Card 1: Basic Information -->
            <div class="card" style="margin-bottom: 2rem;">
                <h2
                    style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
                    Basic Information
                </h2>

                <div class="form-group">
                    <label class="form-label">Brand Name *</label>
                    <input type="text" name="name" class="form-input" placeholder="e.g., Nike"
                        value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Slug *</label>
                    <input type="text" name="slug" class="form-input" placeholder="e.g., nike"
                        value="<?php echo htmlspecialchars($_POST['slug'] ?? ''); ?>" required>
                    <small style="color: var(--secondary); display: block; margin-top: 5px;">
                        URL-friendly version (lowercase, no spaces)
                    </small>
                </div>

                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea name="description" class="form-input" rows="4"
                        placeholder="Brief description of this brand"><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
                </div>

                <!-- Logo Upload Field -->
                <div class="form-group">
                    <label class="form-label">Brand Logo</label>
                    <div class="image-upload-container" style="margin-top: 10px;">
                        <input type="hidden" name="logo" id="brand_logo"
                            value="<?php echo htmlspecialchars($_POST['logo'] ?? ''); ?>">
                        <div id="logo_preview"
                            style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <?php if (!empty($_POST['logo'])): ?>
                                <img src="<?php echo htmlspecialchars($_POST['logo']); ?>"
                                    style="width: 100%; height: 100%; object-fit: cover;">
                            <?php else: ?>
                                <span style="color: #64748b; font-size: 0.9rem;">No logo</span>
                            <?php endif; ?>
                        </div>
                        <button type="button" id="choose_logo_btn" class="btn btn-secondary">Select Logo</button>
                        <button type="button" class="btn btn-danger" id="remove_logo_btn"
                            style="<?php echo empty($_POST['logo']) ? 'display:none;' : ''; ?>">Remove</button>
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
                            placeholder="SEO Title (defaults to brand name if empty)">
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

                <div style="text-align: right; margin-top: 2rem;">
                    <a href="index.php" class="btn" style="color: var(--secondary); margin-right: 1rem;">Cancel</a>
                    <button type="submit" class="btn btn-primary">Create Brand</button>
                </div>
            </div>
        </form>
    </div>
</div>

<script>
    // Auto-generate slug from name
    document.querySelector('input[name="name"]').addEventListener('input', function (e) {
        const slugInput = document.querySelector('input[name="slug"]');
        if (!slugInput.value || slugInput.dataset.autoGenerated) {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            slugInput.value = slug;
            slugInput.dataset.autoGenerated = 'true';
        }
    });

    document.querySelector('input[name="slug"]').addEventListener('input', function () {
        delete this.dataset.autoGenerated;
    });
</script>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>

<script>
    $(document).ready(function () {
        // Prepare gallery data
        const galleryData = <?php echo json_encode($galleryImages); ?>;

        // Initialize Media Modal for Logo
        const logoMediaModal = new MediaModal({
            apiUrl: '<?php echo base_url; ?>/api/media/list.php',
            onSelect: function (image) {
                $('#brand_logo').val(image.file_path);
                updateLogoPreview(image.file_path);
            }
        });

        // Initialize Media Modal for Meta Image
        const metaImageMediaModal = new MediaModal({
            apiUrl: '<?php echo base_url; ?>/api/media/list.php',
            onSelect: function (image) {
                $('#meta_image').val(image.file_path);
                updateMetaImagePreview(image.file_path);
            }
        });

        // Choose logo button
        $(document).on('click', '#choose_logo_btn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            logoMediaModal.open(galleryData);
        });

        // Remove logo button
        $(document).on('click', '#remove_logo_btn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('#brand_logo').val('');
            updateLogoPreview('');
        });

        // Choose meta image button (using class selector)
        $(document).on('click', '.select-image-btn[data-target="meta_image"]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            metaImageMediaModal.open(galleryData);
        });

        // Remove meta image button (using class selector)
        $(document).on('click', '.remove-image-btn[data-target="meta_image"]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('#meta_image').val('');
            updateMetaImagePreview('');
        });

        function updateLogoPreview(url) {
            const container = $('#logo_preview');

            if (url) {
                container.html(`<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">`);
                $('#remove_logo_btn').show();
            } else {
                container.html('<span style="color: #64748b; font-size: 0.9rem;">No logo</span>');
                $('#remove_logo_btn').hide();
            }
        }

        function updateMetaImagePreview(url) {
            const container = $('#meta_image_preview');

            if (url) {
                container.html(`<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">`);
                $('.remove-image-btn[data-target="meta_image"]').show();
            } else {
                container.html('<span style="color: #64748b; font-size: 0.9rem;">No image</span>');
                $('.remove-image-btn[data-target="meta_image"]').hide();
            }
        }

        // Initial preview if value exists
        const initialLogoUrl = $('#brand_logo').val();
        if (initialLogoUrl) {
            updateLogoPreview(initialLogoUrl);
        }

        const initialMetaImageUrl = $('#meta_image').val();
        if (initialMetaImageUrl) {
            updateMetaImagePreview(initialMetaImageUrl);
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