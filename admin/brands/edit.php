<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Edit Brand';
$currentPage = 'brands';

$error = '';
$brand = null;
$id = $_GET['id'] ?? null;

if (!$id) {
    header("Location: index.php");
    exit;
}

$pdo = getDBConnection();

// Fetch brand
$stmt = $pdo->prepare("SELECT * FROM brands WHERE id = ?");
$stmt->execute([$id]);
$brand = $stmt->fetch();

if (!$brand) {
    header("Location: index.php");
    exit;
}

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

            $stmt = $pdo->prepare("UPDATE brands SET name = ?, slug = ?, description = ?, logo = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, meta_image = ? WHERE id = ?");
            $stmt->execute([$name, $slug, $description, $logo, $meta_title, $meta_description, $meta_keywords, $meta_image, $id]);

            header("Location: index.php");
            exit;
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                $error = "A brand with this slug already exists.";
            } else {
                $error = "Error updating brand: " . $e->getMessage();
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
        <h1 class="page-title">Edit Brand</h1>
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

        <form method="POST" style="max-width: 800px; margin: 0 auto;">

            <!-- Card 1: Basic Information -->
            <div class="card" style="margin-bottom: 2rem;">
                <h2
                    style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
                    Basic Information
                </h2>

                <div class="form-group">
                    <label class="form-label">Brand Name *</label>
                    <input type="text" name="name" class="form-input"
                        value="<?php echo htmlspecialchars($_POST['name'] ?? $brand['name']); ?>" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Slug *</label>
                    <input type="text" name="slug" class="form-input"
                        value="<?php echo htmlspecialchars($_POST['slug'] ?? $brand['slug']); ?>" required>
                    <small style="color: var(--secondary); display: block; margin-top: 5px;">
                        URL-friendly version (lowercase, no spaces)
                    </small>
                </div>

                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea name="description" class="form-input"
                        rows="4"><?php echo htmlspecialchars($_POST['description'] ?? $brand['description'] ?? ''); ?></textarea>
                </div>

                <!-- Logo Upload Field -->
                <div class="form-group">
                    <label class="form-label">Brand Logo</label>
                    <div class="image-upload-container" style="margin-top: 10px;">
                        <input type="hidden" name="logo" id="brand_logo"
                            value="<?php echo htmlspecialchars($_POST['logo'] ?? $brand['logo'] ?? ''); ?>">
                        <div id="logo_preview"
                            style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <?php
                            $currentLogo = $_POST['logo'] ?? $brand['logo'] ?? '';
                            if (!empty($currentLogo)):
                                ?>
                                <img src="<?php echo htmlspecialchars($currentLogo); ?>"
                                    style="width: 100%; height: 100%; object-fit: cover;">
                            <?php else: ?>
                                <span style="color: #64748b; font-size: 0.9rem;">No logo</span>
                            <?php endif; ?>
                        </div>
                        <button type="button" id="choose_logo_btn" class="btn btn-secondary select-image-btn"
                            data-target="brand_logo">Select Logo</button>
                        <button type="button" class="btn btn-danger remove-image-btn" id="remove_logo_btn"
                            data-target="brand_logo"
                            style="<?php echo empty($currentLogo) ? 'display:none;' : ''; ?>">Remove</button>
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
                            value="<?php echo htmlspecialchars($brand['meta_image'] ?? ''); ?>">

                        <div id="meta_image_preview"
                            style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <?php if (!empty($brand['meta_image'])): ?>
                                <img src="<?php echo htmlspecialchars($brand['meta_image']); ?>"
                                    style="width: 100%; height: 100%; object-fit: cover;">
                            <?php else: ?>
                                <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                            <?php endif; ?>
                        </div>

                        <button type="button" class="btn btn-secondary select-image-btn" data-target="meta_image">Select
                            Image</button>
                        <button type="button" class="btn btn-danger remove-image-btn" data-target="meta_image"
                            style="<?php echo empty($brand['meta_image']) ? 'display:none;' : ''; ?>">Remove</button>
                    </div>
                </div>

                <div style="margin-top: 2rem; padding-top: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Meta Title</label>
                        <input type="text" name="meta_title" class="form-input"
                            value="<?php echo htmlspecialchars($brand['meta_title'] ?? ''); ?>"
                            placeholder="SEO Title (defaults to brand name if empty)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Meta Description</label>
                        <textarea name="meta_description" class="form-input" rows="3"
                            placeholder="Brief summary for search engines"><?php echo htmlspecialchars($brand['meta_description'] ?? ''); ?></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Meta Keywords</label>
                        <input type="text" name="meta_keywords" class="form-input"
                            value="<?php echo htmlspecialchars($brand['meta_keywords'] ?? ''); ?>"
                            placeholder="comma, separated, keywords">
                    </div>
                </div>

                <div style="text-align: right; margin-top: 2rem;">
                    <a href="index.php" class="btn" style="color: var(--secondary); margin-right: 1rem;">Cancel</a>
                    <button type="submit" class="btn btn-primary">Update Brand</button>
                </div>
            </div>
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>

    <script>
        $(document).ready(function () {
            // Prepare gallery data
            const galleryData = <?php echo json_encode($galleryImages); ?>;

            // Initialize Media Modal
            const mediaModal = new MediaModal({
                apiUrl: '<?php echo base_url; ?>/api/media/list.php',
                onSelect: function (image) {
                    // image object contains {id, url, name, ...}
                    console.log('Selected image:', image);
                    $('#brand_logo').val(image.file_path);
                    updateLogoPreview(image.file_path);
                }
            });

            // Choose logo button
            $(document).on('click', '#choose_logo_btn', function (e) {
                e.preventDefault();
                e.stopPropagation();
                mediaModal.open(galleryData);
            });

            // Remove logo button
            $(document).on('click', '#remove_logo_btn', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('#brand_logo').val('');
                updateLogoPreview('');
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
        });
    </script>

    <!-- Hidden gallery data for modal -->
    <?php foreach ($galleryImages as $img): ?>
        <div class="gallery-image-item-data" style="display: none;" data-id="<?php echo $img['id']; ?>"
            data-path="<?php echo htmlspecialchars($img['file_path']); ?>"
            data-name="<?php echo htmlspecialchars($img['file_name']); ?>"></div>
    <?php endforeach; ?>

    <?php require_once __DIR__ . '/../includes/footer.php'; ?>