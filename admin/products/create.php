<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $slug = $_POST['slug'] ?? '';
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? 0;
    $image_url = $_POST['image_url'] ?? '';
    $status = $_POST['status'] ?? 'active';
    // Handle multiple category IDs
    $category_id = isset($_POST['category_id']) && is_array($_POST['category_id'])
        ? json_encode(array_map('intval', $_POST['category_id']))
        : (isset($_POST['category_id']) && $_POST['category_id'] !== '' ? $_POST['category_id'] : null);
    $brand_id = isset($_POST['brand_id']) && $_POST['brand_id'] !== '' ? intval($_POST['brand_id']) : null;
    $meta_title = $_POST['meta_title'] ?? null;
    $meta_description = $_POST['meta_description'] ?? null;
    $meta_keywords = $_POST['meta_keywords'] ?? null;
    $meta_image = $_POST['meta_image'] ?? null;

    // Auto-generate slug from name if empty
    if (empty($slug)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $slug = trim($slug, '-');
    }

    if (empty($name) || empty($price)) {
        $error = 'Product name and price are required';
    } else {
        try {
            $pdo = getDBConnection();

            // Check if slug exists
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM products WHERE slug = ?");
            $stmt->execute([$slug]);
            if ($stmt->fetchColumn() > 0) {
                $error = 'Slug already exists. Please choose a different slug.';
            } else {
                $stmt = $pdo->prepare("INSERT INTO products (name, slug, description, price, image_url, status, category_id, brand_id, meta_title, meta_description, meta_keywords, meta_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $slug, $description, $price, $image_url, $status, $category_id, $brand_id, $meta_title, $meta_description, $meta_keywords, $meta_image]);

                header('Location: index.php');
                exit;
            }
        } catch (Exception $e) {
            $error = 'Error creating product: ' . $e->getMessage();
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

// Fetch all brands
$brands = [];
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT id, name FROM brands ORDER BY name ASC");
    $brands = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) { /* ignore */
}

// Fetch all categories with parent_id
$categories = [];
try {
    $pdo = getDBConnection();

    // Add parent_id column if it doesn't exist
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER id");
    }

    $stmt = $pdo->query("SELECT id, name, parent_id FROM categories ORDER BY name ASC");
    $allCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Build hierarchical array
    $categoryTree = [];
    $categoryMap = [];

    // First pass: create map and identify parents
    foreach ($allCategories as $cat) {
        $categoryMap[$cat['id']] = $cat;
        if (empty($cat['parent_id'])) {
            $categoryTree[] = $cat;
        }
    }

    // Second pass: add children to parents
    foreach ($allCategories as $cat) {
        if (!empty($cat['parent_id'])) {
            if (isset($categoryMap[$cat['parent_id']])) {
                // Valid parent exists
                if (!isset($categoryMap[$cat['parent_id']]['children'])) {
                    $categoryMap[$cat['parent_id']]['children'] = [];
                }
                $categoryMap[$cat['parent_id']]['children'][] = $cat;
            } else {
                // Orphaned category (parent doesn't exist) - treat as top-level
                $categoryTree[] = $cat;
            }
        }
    }

    // Flatten for dropdown with indentation
    if (!function_exists('flattenCategories')) {
        function flattenCategories($cats, $level = 0)
        {
            $result = [];
            foreach ($cats as $cat) {
                $cat['level'] = $level;
                $result[] = $cat;
                if (isset($cat['children'])) {
                    $result = array_merge($result, flattenCategories($cat['children'], $level + 1));
                }
            }
            return $result;
        }
    }

    $categories = flattenCategories($categoryTree);
} catch (Exception $e) { /* ignore */
}


$currentPage = 'products';
$pageTitle = 'Add New Product';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">Add New Product</h1>
</div>

<!-- Select2 Library -->
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

<style>
    /* Select2 Custom Styling - Robust Fixes */
    /* Ensure proper box sizing */
    .select2-container,
    .select2-container * {
        box-sizing: border-box;
    }

    /* Target the container to ensure full width */
    .select2-container {
        width: 100% !important;
        display: block;
    }

    /* Single Select Styling */
    .select2-container--default .select2-selection--single {
        height: 42px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0 12px;
    }

    .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height: normal;
        color: #1e293b;
        padding-left: 0;
        flex-grow: 1;
    }

    .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 100%;
        position: absolute;
        top: 0;
        right: 8px;
        display: flex;
        align-items: center;
    }

    .select2-container--default .select2-selection--single .select2-selection__arrow b {
        border-color: #64748b transparent transparent transparent;
        position: relative;
        top: auto;
        left: auto;
        margin: 0;
    }

    /* Focus States */
    .select2-container--default.select2-container--focus .select2-selection--single,
    .select2-container--default.select2-container--open .select2-selection--single {
        border-color: var(--primary, #3b82f6);
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Dropdown Styling */
    .select2-dropdown {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 9999;
    }

    .select2-results__option {
        padding: 8px 12px;
        font-size: 0.9rem;
    }

    .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background-color: var(--primary, #3b82f6);
    }

    /* Search Field */
    .select2-container--default .select2-search--dropdown {
        padding: 8px;
    }

    .select2-container--default .select2-search--dropdown .select2-search__field {
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 6px 10px;
        outline: none;
    }

    .select2-container--default .select2-search--dropdown .select2-search__field:focus {
        border-color: var(--primary, #3b82f6);
    }

    /* Multiselect Styling */
    .select2-container--default .select2-selection--multiple {
        min-height: 42px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background-color: #fff;
        padding: 4px 8px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .select2-container--default.select2-container--focus .select2-selection--multiple,
    .select2-container--default.select2-container--open .select2-selection--multiple {
        border-color: var(--primary, #3b82f6);
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .select2-container--default .select2-selection--multiple .select2-selection__choice {
        background-color: var(--primary, #3b82f6);
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        color: white;
        margin: 2px 4px 2px 0;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
    }

    .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {
        color: rgba(255, 255, 255, 0.8);
        margin-right: 6px;
        font-weight: bold;
        border-right: 1px solid rgba(255, 255, 255, 0.3);
        padding-right: 6px;
    }

    .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {
        color: #fff;
        background: none;
    }

    .select2-container--default .select2-selection--multiple .select2-search__field {
        margin: 2px 0;
        line-height: 24px;
    }
</style>

<div class="content-wrapper">
    <form method="POST" action="" class="form-container">
        <div class="card">
            <?php if ($error): ?>
                <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>
            <div class="form-group">
                <label class="form-label" for="name">Product Name *</label>
                <input type="text" id="name" name="name" class="form-input" required
                    value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label class="form-label" for="slug">Slug (URL)</label>
                <input type="text" id="slug" name="slug" class="form-input"
                    value="<?php echo htmlspecialchars($_POST['slug'] ?? ''); ?>"
                    placeholder="auto-generated-from-name">
                <small style="color: var(--secondary);">Used in product URL: /product/<strong>your-slug</strong>. Leave
                    empty to auto-generate.</small>
            </div>

            <div class="form-group">
                <label class="form-label" for="description">Description</label>
                <textarea id="description" name="description" class="form-input"
                    rows="4"><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" for="price">Price *</label>
                <input type="number" id="price" name="price" class="form-input" step="0.01" min="0" required
                    value="<?php echo htmlspecialchars($_POST['price'] ?? ''); ?>">
                <small style="color: var(--secondary);">Enter numeric value only (e.g., 10.99)</small>
            </div>

            <div class="form-group">
                <label class="form-label" for="category_id">Categories</label>
                <select id="category_id" name="category_id[]" class="form-input" multiple>
                    <?php foreach ($categories as $category): ?>
                        <option value="<?php echo $category['id']; ?>" <?php echo (isset($_POST['category_id']) && is_array($_POST['category_id']) && in_array($category['id'], $_POST['category_id'])) ? 'selected' : ''; ?>>
                            <?php echo str_repeat(' - ', $category['level']); ?>
                            <?php echo htmlspecialchars($category['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <small style="color: var(--secondary);">Assign this product to one or more categories.</small>
            </div>

            <div class="form-group">
                <label class="form-label" for="brand_id">Brand</label>
                <select id="brand_id" name="brand_id" class="form-input">
                    <option value="">No Brand</option>
                    <?php foreach ($brands as $brand): ?>
                        <option value="<?php echo $brand['id']; ?>" <?php echo (isset($_POST['brand_id']) && $_POST['brand_id'] == $brand['id']) ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($brand['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <small style="color: var(--secondary);">Select the brand for this product.</small>
            </div>

            <div class="form-group">
                <label class="form-label">Product Image</label>
                <div class="image-upload-container">
                    <input type="hidden" name="image_url" id="product_image"
                        value="<?php echo htmlspecialchars($_POST['image_url'] ?? ''); ?>">
                    <div id="product_image_preview" class="image-preview-box">
                        <?php if (!empty($_POST['image_url'])): ?>
                            <img src="<?php echo htmlspecialchars($_POST['image_url']); ?>">
                        <?php else: ?>
                            <span class="placeholder">No image</span>
                        <?php endif; ?>
                    </div>
                    <div style="display: flex; gap: 0.5rem; width: 150px;">
                        <button type="button" class="btn btn-secondary select-image-btn" data-target="product_image"
                            style="flex: 1;">Select</button>
                        <button type="button" class="btn btn-danger remove-image-btn" data-target="product_image"
                            style="<?php echo empty($_POST['image_url']) ? 'display:none;' : 'flex: 1;'; ?>">Remove</button>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="status">Status</label>
                <select id="status" name="status" class="form-input">
                    <option value="active" <?php echo (($_POST['status'] ?? 'active') == 'active') ? 'selected' : ''; ?>>
                        Active</option>
                    <option value="inactive" <?php echo (($_POST['status'] ?? '') == 'inactive') ? 'selected' : ''; ?>>
                        Inactive</option>
                </select>
            </div>

        </div>

        <!-- SEO Information -->
        <div class="card mt-8">
            <h2
                style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                SEO Information</h2>

            <div class="form-group">
                <label class="form-label">Meta Title</label>
                <input type="text" name="meta_title" class="form-input"
                    value="<?php echo htmlspecialchars($_POST['meta_title'] ?? ''); ?>"
                    placeholder="SEO Title (defaults to product name if empty)">
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

            <div class="form-group">
                <label class="form-label">Meta Image (Social Share Image)</label>
                <div class="image-upload-container">
                    <input type="hidden" name="meta_image" id="meta_image"
                        value="<?php echo htmlspecialchars($_POST['meta_image'] ?? ''); ?>">

                    <div id="meta_image_preview" class="image-preview-box">
                        <?php if (!empty($_POST['meta_image'])): ?>
                            <img src="<?php echo htmlspecialchars($_POST['meta_image']); ?>">
                        <?php else: ?>
                            <span class="placeholder">No image</span>
                        <?php endif; ?>
                    </div>

                    <div style="display: flex; gap: 0.5rem; width: 150px;">
                        <button type="button" class="btn btn-secondary select-image-btn" data-target="meta_image"
                            style="flex: 1;">Select</button>
                        <button type="button" class="btn btn-danger remove-image-btn" data-target="meta_image"
                            style="<?php echo empty($_POST['meta_image']) ? 'display:none;' : 'flex: 1;'; ?>">Remove</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mt-8" style="padding: 1rem;">
            <div style="display: flex; gap: 1rem;">
                <button type="submit" class="btn btn-primary">
                    <i class="fa fa-save"></i> Create Product
                </button>
                <a href="index.php" class="btn" style="background: #e2e8f0; color: var(--text-main);">
                    <i class="fa fa-times"></i> Cancel
                </a>
            </div>
        </div>
    </form>
</div>

<!-- Hidden gallery data for modal -->
<?php foreach ($galleryImages as $img): ?>
    <div class="gallery-image-item-data" style="display: none;" data-id="<?php echo $img['id']; ?>"
        data-path="<?php echo htmlspecialchars($img['file_path']); ?>"
        data-name="<?php echo htmlspecialchars($img['file_name']); ?>"></div>
<?php endforeach; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>

<!-- Media Modal Assets -->

<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script>
    $(document).ready(function () {
        // Initialize Select2 for Brand dropdown
        if (typeof $.fn.select2 !== 'undefined') {
            $('#brand_id').select2({
                placeholder: 'Select a brand',
                allowClear: true,
                width: '100%',
                theme: 'default'
            });

            // Initialize Select2 for Categories multiselect
            $('#category_id').select2({
                placeholder: 'Select categories',
                allowClear: true,
                width: '100%',
                theme: 'default',
                closeOnSelect: false,
                maximumSelectionLength: 10
            });
        }

        // Universal Media Modal Logic
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
                container.html(`<img src="${url}">`);
                removeBtn.show();
            } else {
                container.html('<span class="placeholder">No image</span>');
                removeBtn.hide();
            }
        }

        // Initialize previews for existing values
        ['product_image', 'meta_image'].forEach(id => {
            const val = $('#' + id).val();
            if (val) {
                updatePreview(id, val);
            }
        });


    // Slug formatting
    const slugInput = $('input[name="slug"]');
    const nameInput = $('input[name="name"]');

    slugInput.on('input', function () {
        let val = $(this).val();
        val = val.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and dashes)
            .replace(/\s+/g, '-')     // Replace spaces with dashes
            .replace(/-+/g, '-');     // Replace multiple dashes with single dash
        $(this).val(val);
    });

    // Optional: Auto-generate slug from name if slug is empty or user hasn't manually edited it much
    nameInput.on('input', function () {
        if (!slugInput.val()) {
            let val = $(this).val();
            val = val.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            slugInput.val(val);
        }
    });
    });
</script>