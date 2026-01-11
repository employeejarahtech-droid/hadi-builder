<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$productId = $_GET['id'] ?? null;
$product = null;
$error = '';
$message = '';

if (!$productId) {
    header('Location: index.php');
    exit;
}

// Fetch product
try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();

    if (!$product) {
        header('Location: index.php');
        exit;
    }
} catch (Exception $e) {
    $error = $e->getMessage();
}

// Add SEO columns if not exist
try {
    $pdo = getDBConnection();
    $columns = $pdo->query("SHOW COLUMNS FROM products")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('meta_title', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN meta_title VARCHAR(255)");
    }
    if (!in_array('meta_description', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN meta_description TEXT");
    }
    if (!in_array('meta_keywords', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN meta_keywords VARCHAR(255)");
    }
    if (!in_array('meta_image', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN meta_image VARCHAR(500)");
    }
    if (!in_array('attributes', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN attributes TEXT");
    }
    if (!in_array('product_type', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN product_type VARCHAR(50) DEFAULT 'simple'");
    }
    if (!in_array('sku', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN sku VARCHAR(100)");
    }
    if (!in_array('stock_quantity', $columns)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0");
    }

    // Create variations table
    $pdo->exec("CREATE TABLE IF NOT EXISTS product_variations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        attributes TEXT, -- Stored as JSON
        price DECIMAL(10, 2),
        regular_price DECIMAL(10, 2),
        sku VARCHAR(100),
        stock_quantity INT DEFAULT 0,
        image_url VARCHAR(500),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )");
} catch (Exception $e) {
    // Ignore column errors
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $product_type = $_POST['product_type'] ?? 'simple';
    $slug = $_POST['slug'] ?? '';
    $description = $_POST['description'] ?? '';
    $long_description = $_POST['long_description'] ?? '';
    $price = $_POST['price'] ?? 0;
    $regular_price = $_POST['regular_price'] ?? null;
    if ($regular_price === '')
        $regular_price = null;
    $sku = $_POST['sku'] ?? '';
    $stock_quantity = $_POST['stock_quantity'] ?? 0;
    $image_url = $_POST['image_url'] ?? '';
    $status = $_POST['status'] ?? 'active';
    // Handle multiple category IDs
    $category_id = isset($_POST['category_id']) && is_array($_POST['category_id'])
        ? json_encode(array_map('intval', $_POST['category_id']))
        : (isset($_POST['category_id']) && $_POST['category_id'] !== '' ? $_POST['category_id'] : null);
    $similar_products = $_POST['similar_products'] ?? '[]'; // JSON string of IDs
    $gallery_images = $_POST['gallery_images'] ?? '[]'; // JSON string of URLs
    $meta_title = $_POST['meta_title'] ?? null;
    $meta_description = $_POST['meta_description'] ?? null;
    $meta_keywords = $_POST['meta_keywords'] ?? null;
    $meta_image = $_POST['meta_image'] ?? null;
    $attributes = $_POST['attributes'] ?? '[]'; // JSON string of attributes

    // Auto-generate slug from name if empty
    if (empty($slug)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $slug = trim($slug, '-');
    }

    if (empty($name) || empty($price)) {
        $error = 'Product name and price are required';
    } else {
        // Check if slug exists (excluding current product)
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM products WHERE slug = ? AND id != ?");
        $stmt->execute([$slug, $productId]);
        if ($stmt->fetchColumn() > 0) {
            $error = 'Slug already exists. Please choose a different slug.';
        } else {
            try {
                // Check if column exists (migration safety)
                // (Assuming schema update ran, but safe to allow fail if field missing in query if caught)
                // We'll trust schema update ran.
                $stmt = $pdo->prepare("UPDATE products SET name = ?, product_type = ?, slug = ?, description = ?, long_description = ?, price = ?, regular_price = ?, sku = ?, stock_quantity = ?, image_url = ?, status = ?, category_id = ?, similar_products = ?, gallery_images = ?, attributes = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, meta_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->execute([$name, $product_type, $slug, $description, $long_description, $price, $regular_price, $sku, $stock_quantity, $image_url, $status, $category_id, $similar_products, $gallery_images, $attributes, $meta_title, $meta_description, $meta_keywords, $meta_image, $productId]);

                // 2. Handle Variations (Simple: Delete all and Re-insert for now, or Upsert?)
                // Re-inserting is safer for preventing orphans if ID logic is complex.
                // However, we want to keep IDs if possible for order history? 
                // For MVP, Let's just Delete All for this product and Re-create.
                // NOTE: In production, you'd want to update existing IDs to preserve order references.

                if ($product_type === 'variable') {
                    $variationsJSON = $_POST['variations'] ?? '[]';
                    $variationsData = json_decode($variationsJSON, true);

                    if (is_array($variationsData)) {
                        // Delete existing (simplest sync strategy)
                        $pdo->prepare("DELETE FROM product_variations WHERE product_id = ?")->execute([$productId]);

                        $insertVar = $pdo->prepare("INSERT INTO product_variations (product_id, attributes, price, sku, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)");

                        foreach ($variationsData as $var) {
                            $attrs = json_encode($var['attributes']);
                            $vPrice = $var['price'] ?: 0;
                            $vSku = $var['sku'] ?? '';
                            $vStock = $var['stock_quantity'] ?? 0;
                            $vImage = $var['image'] ?? '';

                            $insertVar->execute([$productId, $attrs, $vPrice, $vSku, $vStock, $vImage]);
                        }
                    }
                }

                $message = 'Product updated successfully';

                // Refresh product data
                $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
                $stmt->execute([$productId]);
                $product = $stmt->fetch();
            } catch (Exception $e) {
                $error = 'Error updating product: ' . $e->getMessage();
            }
        }
    }
}

// Fetch gallery images
$galleryImages = [];
try {
    // Create gallery table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $stmt = $pdo->prepare("SELECT * FROM gallery ORDER BY uploaded_at DESC");
    $stmt->execute();
    $galleryImages = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) { /* ignore */
}

// Fetch Variations
$existingVariations = [];
if (($product['product_type'] ?? 'simple') === 'variable') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM product_variations WHERE product_id = ?");
        $stmt->execute([$productId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Format for JS
        foreach ($rows as $row) {
            $existingVariations[] = [
                'id' => $row['id'],
                'attributes' => json_decode($row['attributes'], true),
                'price' => $row['price'],
                'sku' => $row['sku'],
                'stock_quantity' => $row['stock_quantity'],
                'image' => $row['image_url']
            ];
        }
    } catch (Exception $e) { /* ignore */
    }
}

// Fetch all categories with parent_id
$categories = [];
try {
    // Add parent_id column if it doesn't exist
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER id");
    }

    $stmt = $pdo->query("SELECT id, name, parent_id FROM categories ORDER BY name ASC");
    $allCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Simply add level indicator and add ALL categories
    foreach ($allCategories as $cat) {
        $cat['level'] = empty($cat['parent_id']) ? 0 : 1;
        $categories[] = $cat;
    }
} catch (Exception $e) { /* ignore */
}


// Fetch all other products for selection
$allProducts = [];
try {
    $stmt = $pdo->prepare("SELECT id, name, image_url, price FROM products WHERE id != ? ORDER BY name");
    $stmt->execute([$productId]);
    $allProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) { /* ignore */
}

// Fetch gallery images
$galleryImages = [];
try {
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

$currentPage = 'products';
$pageTitle = 'Edit Product';
require_once __DIR__ . '/../includes/header.php';
?>

<!-- Media Modal CSS -->




<div class="page-header">
    <h1 class="page-title">Edit Product</h1>
</div>

<div class="content-wrapper max-w-1000">
    <form method="POST" action="">
        <div class="admin-grid-layout">
            <!-- Main Column -->
            <div style="display: flex; flex-direction: column;">

                <!-- Basic Info Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Basic Information
                    </h2>
                    <div class="form-group">
                        <label class="form-label">Product Type</label>
                        <select name="product_type" class="form-input">
                            <option value="simple" <?php echo ($product['product_type'] ?? 'simple') === 'simple' ? 'selected' : ''; ?>>Simple Product</option>
                            <option value="variable" <?php echo ($product['product_type'] ?? '') === 'variable' ? 'selected' : ''; ?>>Variable Product</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="name">Product Name *</label>
                        <input type="text" id="name" name="name" class="form-input" required
                            value="<?php echo htmlspecialchars($product['name']); ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="slug">Slug (URL)</label>
                        <input type="text" id="slug" name="slug" class="form-input"
                            value="<?php echo htmlspecialchars($product['slug'] ?? ''); ?>"
                            placeholder="auto-generated-from-name">
                        <small style="color: var(--secondary);">Used in product URL:
                            /product/<strong>
                                <?php echo htmlspecialchars($product['slug'] ?? 'slug'); ?>
                            </strong></small>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="description">Short Description (Summary)</label>
                        <textarea id="description" name="description" class="form-input"
                            rows="3"><?php echo htmlspecialchars($product['description'] ?? ''); ?></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="long_description">Detailed Description</label>
                        <textarea id="long_description" name="long_description" class="form-input" rows="10"
                            placeholder="<h3>Features</h3><ul><li>Feature 1</li></ul>..."><?php echo htmlspecialchars($product['long_description'] ?? ''); ?></textarea>
                    </div>
                </div>

                <!-- Pricing & Inventory Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Pricing & Inventory
                    </h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="regular_price">Regular Price (Optional)</label>
                            <input type="number" id="regular_price" name="regular_price" class="form-input" step="0.01"
                                min="0" value="<?php echo htmlspecialchars($product['regular_price'] ?? ''); ?>"
                                placeholder="Original Price">
                            <small style="color: var(--secondary);">Shows as crossed-out original price.</small>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="price">Sale Price *</label>
                            <input type="number" id="price" name="price" class="form-input" step="0.01" min="0" required
                                value="<?php echo htmlspecialchars($product['price']); ?>"
                                placeholder="Current Selling Price">
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="sku">SKU</label>
                            <input type="text" id="sku" name="sku" class="form-input"
                                value="<?php echo htmlspecialchars($product['sku'] ?? ''); ?>"
                                placeholder="Stock Keeping Unit">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="stock_quantity">Stock Quantity</label>
                            <input type="number" id="stock_quantity" name="stock_quantity" class="form-input"
                                value="<?php echo htmlspecialchars($product['stock_quantity'] ?? 0); ?>"
                                placeholder="0">
                        </div>
                    </div>
                </div>

                <!-- Gallery Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Product Gallery
                    </h2>
                    <input type="hidden" id="gallery_images_input" name="gallery_images"
                        value="<?php echo htmlspecialchars($product['gallery_images'] ?? '[]'); ?>">

                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;" id="gallery-list">
                        <!-- JS will populate -->
                        <div class="add-gallery-btn" id="add-gallery-btn"
                            style="width: 100px; height: 100px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; font-size: 24px;">
                            +
                        </div>
                    </div>
                </div>

                <!-- Linked Products -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Similar Products
                    </h2>
                    <input type="hidden" id="similar_products_input" name="similar_products"
                        value="<?php echo htmlspecialchars($product['similar_products'] ?? '[]'); ?>">

                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;"
                        id="similar-products-list">
                        <!-- JS will populate -->
                        <div class="add-similar-btn" onclick="openProductSelector()">+</div>
                    </div>
                    <small style="color: var(--secondary); display: block; margin-top: 5px;">Select related products to
                        display on the product page.</small>
                </div>

                <!-- Attributes Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Product Attributes
                    </h2>
                    <input type="hidden" id="attributes_input" name="attributes"
                        value="<?php echo htmlspecialchars($product['attributes'] ?? '[]'); ?>">

                    <div id="attributes-list" style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- JS will populate -->
                    </div>

                    <button type="button" class="btn btn-secondary btn-sm" onclick="addAttribute()"
                        style="margin-top: 15px;">
                        <i class="fa fa-plus"></i> Add Attribute
                    </button>
                    <small style="color: var(--secondary); display: block; margin-top: 5px;">
                        e.g. Color: Red, Size: XL, Material: Cotton
                    </small>
                </div>

                <!-- Variations Card (Hidden by default, shown for Variable Product) -->
                <div class="card" id="variations-card" style="display: none;">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        <h2 style="font-size: 1.1rem; font-weight: 600; margin: 0;">Product Variations</h2>
                        <div style="display: flex; gap: 10px;">
                            <button type="button" class="btn btn-secondary btn-sm" onclick="generateVariations()">
                                <i class="fa fa-sync"></i> Generate Variations
                            </button>
                            <button type="button" class="btn btn-sm" onclick="addManualVariation()"
                                style="color: var(--primary); border: 1px solid var(--primary);">
                                + Add Manually
                            </button>
                        </div>
                    </div>

                    <input type="hidden" id="variations_input" name="variations"
                        value="<?php echo htmlspecialchars(json_encode($existingVariations ?? [])); ?>">

                    <div id="variations-list" style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- JS will populate -->
                    </div>

                    <p style="color: var(--secondary); font-size: 0.9rem; margin-top: 15px;">
                        <i class="fa fa-info-circle"></i>
                        Mark attributes as "Used for Variations" above, then click "Generate".
                    </p>
                </div>

                <!-- SEO Information -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        SEO Information
                    </h2>

                    <div class="form-group">
                        <label class="form-label">Meta Title</label>
                        <input type="text" name="meta_title" class="form-input"
                            value="<?php echo htmlspecialchars($product['meta_title'] ?? ''); ?>"
                            placeholder="SEO Title (defaults to product name if empty)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Meta Description</label>
                        <textarea name="meta_description" class="form-input" rows="3"
                            placeholder="Brief summary for search engines"><?php echo htmlspecialchars($product['meta_description'] ?? ''); ?></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Meta Keywords</label>
                        <input type="text" name="meta_keywords" class="form-input"
                            value="<?php echo htmlspecialchars($product['meta_keywords'] ?? ''); ?>"
                            placeholder="comma, separated, keywords">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Meta Image (Social Share Image)</label>
                        <div class="image-upload-container" style="margin-top: 10px;">
                            <input type="hidden" name="meta_image" id="meta_image"
                                value="<?php echo htmlspecialchars($product['meta_image'] ?? ''); ?>">

                            <div id="meta_image_preview"
                                style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                <?php if (!empty($product['meta_image'])): ?>
                                    <img src="<?php echo htmlspecialchars($product['meta_image']); ?>"
                                        style="width: 100%; height: 100%; object-fit: cover;">
                                <?php else: ?>
                                    <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                                <?php endif; ?>
                            </div>

                            <div style="display: flex; gap: 0.5rem; width: 150px;">
                                <button type="button" class="btn btn-secondary select-image-btn"
                                    data-target="meta_image" style="flex: 1;">Select</button>
                                <button type="button" class="btn btn-danger remove-image-btn" data-target="meta_image"
                                    style="<?php echo empty($product['meta_image']) ? 'display:none;' : 'flex: 1;'; ?>">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Sidebar Column -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">

                <!-- Status & Category -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Organization
                    </h2>
                    <div class="form-group">
                        <label class="form-label" for="status">Status</label>
                        <select id="status" name="status" class="form-input">
                            <option value="active" <?php echo ($product['status'] == 'active') ? 'selected' : ''; ?>>
                                Active
                            </option>
                            <option value="inactive" <?php echo ($product['status'] == 'inactive') ? 'selected' : ''; ?>>
                                Inactive
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="category_id">Categories</label>
                        <select id="category_id" name="category_id[]" class="form-input" multiple
                            multiselect-search="true" multiselect-select-all="true" multiselect-max-items="3">
                            <?php
                            // Parse existing categories
                            $selectedCategories = [];
                            if (!empty($product['category_id'])) {
                                $decoded = json_decode($product['category_id'], true);
                                if (is_array($decoded)) {
                                    $selectedCategories = $decoded;
                                } elseif (is_numeric($product['category_id'])) {
                                    $selectedCategories = [$product['category_id']];
                                }
                            }

                            foreach ($categories as $category):
                                $isSelected = in_array($category['id'], $selectedCategories);
                                ?>
                                <option value="<?php echo $category['id']; ?>" <?php echo $isSelected ? 'selected' : ''; ?>>
                                    <?php echo str_repeat('— ', $category['level']); ?>
                                    <?php echo htmlspecialchars($category['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <small style="color: var(--secondary); display: block; margin-top: 5px;">
                            Search and select multiple categories
                        </small>
                    </div>
                </div>

                <!-- Featured Image -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Featured Image
                    </h2>
                    <div class="image-upload-container" style="margin-top: 10px;">
                        <input type="hidden" name="image_url" id="product_image"
                            value="<?php echo htmlspecialchars($product['image_url'] ?? ''); ?>">

                        <div id="product_image_preview"
                            style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <?php if ($product['image_url']): ?>
                                <img src="<?php echo htmlspecialchars($product['image_url']); ?>"
                                    style="width: 100%; height: 100%; object-fit: cover;">
                            <?php else: ?>
                                <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                            <?php endif; ?>
                        </div>

                        <button type="button" class="btn btn-secondary select-image-btn"
                            data-target="product_image">Select
                            Image</button>
                        <button type="button" class="btn btn-danger remove-image-btn" data-target="product_image"
                            style="<?php echo empty($product['image_url']) ? 'display:none;' : ''; ?>">Remove</button>
                    </div>
                </div>

                <!-- Actions -->
                <div class="card">
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                        <i class="fa fa-save"></i> Update Product
                    </button>
                    <a href="index.php" class="btn"
                        style="width: 100%; background: #e2e8f0; color: var(--text-main); text-align: center;">
                        <i class="fa fa-arrow-left"></i> Back to Products
                    </a>
                </div>

            </div>
        </div>
    </form>
</div>

<!-- Product Selector Modal -->
<div id="product-selector-modal">
    <div id="product-selector-content">
        <div
            style="padding: 15px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">Select Product</h3>
            <span onclick="closeProductSelector()" style="cursor: pointer; font-size: 20px;">&times;</span>
        </div>
        <div style="padding: 10px;">
            <input type="text" id="product-search" placeholder="Search products..." class="form-input"
                onkeyup="filterProducts()">
        </div>
        <div id="product-list-container" style="flex: 1; overflow-y: auto; padding: 0 10px 10px;">
            <!-- Products -->
        </div>
    </div>
</div>

<!-- Hidden gallery data for modal -->
<?php foreach ($galleryImages as $img): ?>
    <div class="gallery-image-item-data" style="display: none;" data-id="<?php echo $img['id']; ?>"
        data-path="<?php echo htmlspecialchars($img['file_path']); ?>"
        data-name="<?php echo htmlspecialchars($img['file_name']); ?>"></div>
<?php endforeach; ?>


<!-- Multiselect Dropdown Library -->
<link rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/admirhodzic/multiselect-dropdown@master/multiselect-dropdown.css">
<script src="https://cdn.jsdelivr.net/gh/admirhodzic/multiselect-dropdown@master/multiselect-dropdown.js"></script>



<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js?v=<?php echo time(); ?>"></script>



<!-- Summernote CSS/JS -->
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>

<script>
    // All available products (except current)
    const allProducts = <?php echo json_encode($allProducts); ?>;
    let selectedIds = <?php echo $product['similar_products'] ? $product['similar_products'] : '[]'; ?>;

    function renderSimilarProducts() {
        // Clear list (except add btn)
        const container = document.getElementById('similar-products-list');
        const btn = container.querySelector('.add-similar-btn');
        container.innerHTML = '';
        container.appendChild(btn);

        selectedIds.forEach(id => {
            const prod = allProducts.find(p => p.id == id);
            if (!prod) return; // Should not happen unless deleted

            const div = document.createElement('div');
            div.className = 'similar-product-item';
            div.innerHTML = `
                <img src="${prod.image_url || 'https://via.placeholder.com/80'}" title="${prod.name}">
                <div class="remove-btn" onclick="removeSimilarProduct(${id}, event)">&times;</div>
            `;
            container.insertBefore(div, btn);
        });

        // Update hidden input
        document.getElementById('similar_products_input').value = JSON.stringify(selectedIds);
    }

    function removeSimilarProduct(id, e) {
        if (e) e.stopPropagation();
        selectedIds = selectedIds.filter(pid => pid != id);
        renderSimilarProducts();
    }

    function openProductSelector() {
        const modal = document.getElementById('product-selector-modal');
        const list = document.getElementById('product-list-container');
        modal.style.display = 'block';

        // Render list
        renderProductList(allProducts);
    }

    function closeProductSelector() {
        document.getElementById('product-selector-modal').style.display = 'none';
        document.getElementById('product-search').value = '';
    }

    function renderProductList(products) {
        const list = document.getElementById('product-list-container');
        list.innerHTML = '';

        products.forEach(prod => {
            // Skip if already selected
            if (selectedIds.includes(parseInt(prod.id))) return;

            const div = document.createElement('div');
            div.className = 'product-list-item';
            div.onclick = () => { selectSimilarProduct(prod.id); };
            div.innerHTML = `
                <img src="${prod.image_url || 'https://via.placeholder.com/40'}" alt="">
                <div>
                    <div style="font-weight: 500;">${prod.name}</div>
                    <div style="font-size: 12px; color: #64748b;">$${prod.price}</div>
                </div>
                <button class="btn btn-sm btn-primary" style="margin-left: auto;">Add</button>
            `;
            list.appendChild(div);
        });

        if (list.children.length === 0) {
            list.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b;">No products available</div>';
        }
    }

    function filterProducts() {
        const query = document.getElementById('product-search').value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
        renderProductList(filtered);
    }

    function selectSimilarProduct(id) {
        selectedIds.push(parseInt(id));
        renderSimilarProducts();
        closeProductSelector();
    }

    $(document).ready(function () {
        // Init Summernote
        $('#long_description').summernote({
            placeholder: 'Type your detailed product description here...',
            tabsize: 2,
            height: 300,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ]
        });

        // Init similar products
        renderSimilarProducts();


        // Universal Media Modal Logic
        const galleryData = <?php echo json_encode($galleryImages); ?>;

        // Callback handler for the single modal instance
        window.onMediaSelect = null;

        // Initialize single modal instance
        window.mediaModal = new MediaModal({
            apiUrl: '<?php echo base_url; ?>/api/media/list.php',
            onSelect: function (image) {
                if (window.onMediaSelect) {
                    window.onMediaSelect(image);
                }
            }
        });

        // Open modal for Featured Image (or any single image input)
        $(document).on('click', '.select-image-btn', function (e) {
            e.preventDefault();
            const targetId = $(this).data('target');

            // Set callback for this specific action
            window.onMediaSelect = function (image) {
                $('#' + targetId).val(image.file_path);
                updatePreview(targetId, image.file_path);
            };

            window.mediaModal.open(galleryData);
        });

        // Remove image logic
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

        // ==========================================
        // Gallery Handling
        // ==========================================
        let galleryImages = <?php echo isset($product['gallery_images']) ? $product['gallery_images'] : '[]'; ?>;
        // Ensure it's an array (handle legacy or null)
        if (!Array.isArray(galleryImages)) galleryImages = [];

        function renderGallery() {
            const container = document.getElementById('gallery-list');
            const addBtn = document.getElementById('add-gallery-btn');

            if (!container || !addBtn) return;

            // Remove all image items, keep button
            Array.from(container.children).forEach(child => {
                if (child.id !== 'add-gallery-btn') container.removeChild(child);
            });

            galleryImages.forEach((url, index) => {
                const div = document.createElement('div');
                div.style.cssText = 'position: relative; width: 100px; height: 100px; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;';
                div.innerHTML = `
                     <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">
                     <div onclick="removeGalleryImage(${index})" style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px;">&times;</div>
                 `;
                container.insertBefore(div, addBtn);
            });

            const galleryInput = document.getElementById('gallery_images_input');
            if (galleryInput) {
                galleryInput.value = JSON.stringify(galleryImages);
            }
        }

        window.removeGalleryImage = function (index) {
            galleryImages.splice(index, 1);
            renderGallery();
        };

        // Open modal for Gallery
        $('#add-gallery-btn').on('click', function () {
            // Set callback for gallery action
            window.onMediaSelect = function (image) {
                galleryImages.push(image.file_path);
                renderGallery();
            };

            window.mediaModal.open(galleryData);
        });

        // Initial render
        renderGallery();
    });

    // Close modal on outside click
    window.onclick = function (event) {
        const modal = document.getElementById('product-selector-modal');
        if (event.target == modal) {
            closeProductSelector();
        }
    }

    // ==========================================
    // Advanced Attributes Handling
    // ==========================================
    let rawAttributes = <?php echo isset($product['attributes']) ? $product['attributes'] : '[]'; ?>;
    let attributeGroups = [];

    // Initialize: Migrate flat list to grouped structure if needed
    try {
        if (!Array.isArray(rawAttributes)) {
            rawAttributes = JSON.parse(rawAttributes);
        }
    } catch (e) { rawAttributes = []; }
    if (!Array.isArray(rawAttributes)) rawAttributes = [];

    if (rawAttributes.length > 0 && typeof rawAttributes[0].group_name === 'undefined') {
        // Migration: Convert flat [{name, value, group}] to [{group_name, attributes:[]}]
        console.log("Migrating flat attributes to grouped structure...");
        let groups = {};
        rawAttributes.forEach(attr => {
            let gName = attr.group || 'General';
            if (!groups[gName]) groups[gName] = [];
            groups[gName].push({ name: attr.name, value: attr.value, type: attr.type || 'text' });
        });
        for (let gName in groups) {
            attributeGroups.push({ group_name: gName, attributes: groups[gName] });
        }
    } else {
        // Already structured
        attributeGroups = rawAttributes;
    }

    function renderAttributes() {
        const container = document.getElementById('attributes-list');
        const input = document.getElementById('attributes_input');

        // Save scroll position
        const scrollPos = window.scrollY;

        container.innerHTML = '';

        attributeGroups.forEach((group, gIndex) => {
            const card = document.createElement('div');
            card.className = 'card group-card'; // Added class
            card.dataset.index = gIndex; // Keep index for ref
            card.style.background = '#f8fafc';
            card.style.border = '1px solid #e2e8f0';
            card.style.padding = '15px';
            card.style.marginBottom = '15px';

            // Group Header
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '15px';
            header.innerHTML = `
                <div style="flex: 1; display: flex; gap: 10px; align-items: center;">
                    <i class="fa fa-layer-group sortable-handle" style="color: #64748b; cursor: move;"></i>
                    <input type="text" class="form-input group-name" style="font-weight: 600; width: auto; flex: 1;"
                        value="${group.group_name}" placeholder="Group Name (e.g. Specifications)"
                        onchange="updateGroup(${gIndex}, this.value)">
                </div>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeGroup(${gIndex})" title="Remove Group">
                    <i class="fa fa-trash"></i>
                </button>
            `;
            card.appendChild(header);

            // Attributes List Container
            const attrContainer = document.createElement('div');
            attrContainer.className = 'attributes-container';
            attrContainer.style.display = 'flex';
            attrContainer.style.flexDirection = 'column';
            attrContainer.style.gap = '10px';
            attrContainer.style.minHeight = '10px'; // Allow dropping into empty groups

            group.attributes.forEach((attr, aIndex) => {
                const row = document.createElement('div');
                row.className = 'attr-row'; // Added class
                row.style.display = 'flex';
                row.style.gap = '10px';
                row.style.alignItems = 'center';

                // Type Selector logic
                const isColor = attr.type === 'color';
                const valueInput = isColor
                    ? `<div style="display: flex; gap: 5px; flex: 1;">
                         <input type="color" class="attr-value-color" value="${attr.value}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'value', this.value)" style="height: 38px; width: 50px; padding: 2px;">
                         <input type="text" class="form-input attr-value" value="${attr.value}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'value', this.value)" style="flex: 1;">
                       </div>`
                    : `<input type="text" class="form-input attr-value" placeholder="Value" value="${attr.value}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'value', this.value)" style="flex: 1;">`;

                row.innerHTML = `
                    <i class="fa fa-bars sortable-handle-attr" style="color: #cbd5e1; cursor: move;"></i>
                    <select class="form-input attr-type" style="width: 100px;" onchange="updateAttribute(${gIndex}, ${aIndex}, 'type', this.value)">
                        <option value="text" ${attr.type === 'text' ? 'selected' : ''}>Text</option>
                        <option value="color" ${attr.type === 'color' ? 'selected' : ''}>Color</option>
                    </select>
                    <input type="text" class="form-input attr-name" placeholder="Name" value="${attr.name}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'name', this.value)" style="flex: 1;">
                    ${valueInput}
                    
                    <div style="display: flex; align-items: center; gap: 5px;" title="Used for Variations">
                        <input type="checkbox" class="attr-variation" ${attr.is_variation ? 'checked' : ''} onchange="updateAttribute(${gIndex}, ${aIndex}, 'is_variation', this.checked)">
                        <small style="color: #64748b; font-size: 0.7rem;">Var</small>
                    </div>

                    <button type="button" class="btn btn-sm" style="color: #94a3b8;" onclick="deleteAttribute(${gIndex}, ${aIndex})">&times;</button>
                `;
                attrContainer.appendChild(row);
            });

            card.appendChild(attrContainer);

            // Add Attribute Button
            const footer = document.createElement('div');
            footer.style.marginTop = '15px';
            footer.innerHTML = `
                <button type="button" class="btn btn-sm btn-secondary" onclick="addAttribute(${gIndex})">
                    <i class="fa fa-plus"></i> Add Attribute
                </button>
            `;
            card.appendChild(footer);

            container.appendChild(card);
        });

        input.value = JSON.stringify(attributeGroups);

        // Re-init sortable after render
        initSortable();

        // Restore scroll position
        window.scrollTo(0, scrollPos);
    }

    // --- Actions ---

    window.addGroup = function () {
        attributeGroups.push({ group_name: '', attributes: [] });
        renderAttributes();
    };

    window.removeGroup = function (index) {
        if (confirm('Delete this group and all its attributes?')) {
            attributeGroups.splice(index, 1);
            renderAttributes();
        }
    };

    window.updateGroup = function (index, newName) {
        attributeGroups[index].group_name = newName;
        document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);
    };

    window.addAttribute = function (groupIndex) {
        attributeGroups[groupIndex].attributes.push({ name: '', value: '', type: 'text' });
        renderAttributes();
    };

    window.deleteAttribute = function (groupIndex, attrIndex) {
        attributeGroups[groupIndex].attributes.splice(attrIndex, 1);
        renderAttributes();
    };

    window.updateAttribute = function (groupIndex, attrIndex, key, value) {
        attributeGroups[groupIndex].attributes[attrIndex][key] = value;
        // If changing type, re-render to show appropriate input
        if (key === 'type') {
            renderAttributes();
        } else {
            document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);
            // Sync color picker if text changed
            if (key === 'value') {
                // If it's a color input, we might need to sync the other way, but `renderAttributes` handles it on next load.
                // For live sync, we could find the sibling input.
                // But simplified for now.
            }
        }
    };

    // Replace the simple "Add Attribute" button from PHP with "Add Group"
    $(document).ready(function () {
        renderAttributes();

        // Find the button by its onclick attribute because it has no ID
        const oldBtn = document.querySelector('button[onclick="addAttribute()"]');
        if (oldBtn) {
            oldBtn.innerHTML = '<i class="fa fa-plus"></i> Add Group';
            oldBtn.onclick = function () { window.addGroup(); };
            oldBtn.classList.remove('btn-secondary');
            oldBtn.classList.add('btn-primary');
        }
    });

    function initSortable() {
        if (typeof $ === 'undefined' || typeof $.fn.sortable === 'undefined') {
            // console.warn('jQuery UI Sortable not loaded.');
            return;
        }

        // Sort Groups
        $("#attributes-list").sortable({
            handle: '.sortable-handle',
            placeholder: "ui-state-highlight",
            forcePlaceholderSize: true,
            update: function () {
                rebuildFromDOM();
            }
        });

        // Sort Attributes within Groups
        $(".attributes-container").sortable({
            connectWith: ".attributes-container",
            handle: '.sortable-handle-attr',
            placeholder: "ui-state-highlight",
            forcePlaceholderSize: true,
            update: function (event, ui) {
                // Prevent multiple fires when moving between lists
                // But wait, rebuildFromDOM handles the entire state, so it's fine to run twice.
                rebuildFromDOM();
            }
        });
    }

    function rebuildFromDOM() {
        let newGroups = [];

        document.querySelectorAll('#attributes-list > .card').forEach(card => {
            let groupName = card.querySelector('.group-name').value;
            let attrs = [];

            card.querySelectorAll('.attr-row').forEach(row => {
                let type = row.querySelector('.attr-type').value;
                let name = row.querySelector('.attr-name').value;
                let value = row.querySelector('.attr-value').value;

                // Safe check for variation flag
                let isVariation = false;
                const varCheckbox = row.querySelector('.attr-variation');
                if (varCheckbox) isVariation = varCheckbox.checked;

                attrs.push({ name: name, value: value, type: type, is_variation: isVariation });
            });

            newGroups.push({ group_name: groupName, attributes: attrs });
        });

        // Update memory without re-rendering (would kill drag)
        attributeGroups = newGroups;
        document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);

        // Simple fix: Re-render.
        setTimeout(renderAttributes, 50);
    }

    // Failsafe: Ensure variations are saved on submit
    $(document).ready(function () {
        $('form').on('submit', function () {
            // Force update of hidden input
            if (typeof variations !== 'undefined') {
                document.getElementById('variations_input').value = JSON.stringify(variations);
            }
            // Also force attributes
            document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);
        });
    });

    // ==========================================
    // Variations Logic
    // ==========================================
    let variations = <?php echo json_encode($existingVariations); ?>; // Store variations data from PHP

    function toggleVariationsPanel() {
        const typeStart = document.querySelector('select[name="product_type"]');
        const card = document.getElementById('variations-card');
        if (typeStart && card) {
            if (typeStart.value === 'variable') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    }

    // Bind listener to product type
    document.querySelector('select[name="product_type"]').addEventListener('change', toggleVariationsPanel);

    // Initial check
    toggleVariationsPanel();

    window.generateVariations = function () {
        // 1. Find all attributes marked as 'is_variation'
        let variationAttrs = [];
        attributeGroups.forEach(group => {
            group.attributes.forEach(attr => {
                if (attr.is_variation) {
                    // Split values by pipe '|' or comma ','? 
                    // No, usually users enter "Red", "Blue" as separate text? 
                    // Wait, current UI is "Name: Color, Value: Red". 
                    // To have "Red" and "Blue", user needs to enter "Red | Blue" or we need a tag input?
                    // OR user adds "Color" attribute multiple times?
                    // User adds "Color" once. The value should be "Red | Blue". 
                    // Requirement said: "User adds 'Size' (S, M, L)".
                    // Assumption: Value field supports delimiters. Let's use pipe '|'.

                    const values = attr.value.split('|').map(v => v.trim()).filter(v => v !== '');
                    if (values.length > 0) {
                        variationAttrs.push({ name: attr.name, values: values });
                    }
                }
            });
        });

        if (variationAttrs.length === 0) {
            alert('No attributes marked for variation. Please check "Var" on attributes and ensure they have values separated by "|".');
            return;
        }

        // 2. Cartesian Product
        // cartesian([['Red','Blue'], ['S','M']]) => [['Red','S'], ['Red','M'], ...]
        const cartesian = (args) => {
            var r = [], max = args.length - 1;
            function helper(arr, i) {
                for (var j = 0, l = args[i].length; j < l; j++) {
                    var a = arr.slice(0); // clone arr
                    a.push(args[i][j]);
                    if (i == max) r.push(a);
                    else helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        };

        const combinations = cartesian(variationAttrs.map(a => a.values));

        // 3. Create variations
        // Don't overwrite existing if possible? For now, we append or replace?
        // Let's ask confirm.
        if (variations.length > 0 && !confirm('This will generate new variations. Clear existing ones? (Cancel to append)')) {
            // Append mode
        } else {
            variations = []; // Clear
        }

        combinations.forEach(combo => {
            // combo is ['Red', 'S'] corresponding to variationAttrs names
            let attrsObj = {};
            variationAttrs.forEach((attr, idx) => {
                attrsObj[attr.name] = combo[idx];
            });

            variations.push({
                attributes: attrsObj, // {Color: 'Red', Size: 'S'}
                price: document.querySelector('input[name="price"]').value || 0,
                sku: '',
                stock_quantity: 10,
                image: ''
            });
        });

        renderVariations();
    };

    window.addManualVariation = function () {
        variations.push({
            attributes: {},
            price: 0,
            sku: '',
            stock: 0
        });
        renderVariations();
    };

    window.removeVariation = function (index) {
        if (confirm('Remove this variation?')) {
            variations.splice(index, 1);
            renderVariations();
        }
    }

    window.updateVariation = function (index, key, value) {
        variations[index][key] = value;
        document.getElementById('variations_input').value = JSON.stringify(variations);
    };

    window.selectVariationImage = function (index) {
        if (!window.mediaModal) {
            alert('Media modal not initialized');
            return;
        }
        window.onMediaSelect = function (image) {
            updateVariation(index, 'image', image.file_path);
            renderVariations();
        };
        window.mediaModal.open();
    };

    function renderVariations() {
        const list = document.getElementById('variations-list');
        list.innerHTML = '';

        variations.forEach((varItem, index) => {
            // Generate Title from attributes
            let title = Object.entries(varItem.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || `Variation #${index + 1}`;

            const div = document.createElement('div');
            div.className = 'card';
            div.style.background = '#fff';
            div.style.padding = '10px';
            div.style.borderLeft = '4px solid #3b82f6';

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: pointer;" onclick="toggleVariation(this)">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fa fa-chevron-down transition-icon" style="transition: transform 0.3s;"></i>
                        <strong>${title}</strong>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" onclick="event.stopPropagation(); removeVariation(${index})">&times;</button>
                </div>
                     <div style="display: flex; gap: 15px;">
                        <div class="form-group" style="flex: 1;">
                             <label>Price</label>
                             <input type="number" class="form-input" style="width: 100%;" value="${varItem.price}" onchange="updateVariation(${index}, 'price', this.value)">
                        </div>
                        <div class="form-group" style="flex: 1;">
                             <label>SKU</label>
                             <input type="text" class="form-input" style="width: 100%;" value="${varItem.sku || ''}" onchange="updateVariation(${index}, 'sku', this.value)">
                        </div>
                         <div class="form-group" style="flex: 1;">
                             <label>Stock</label>
                             <input type="number" class="form-input" style="width: 100%;" value="${varItem.stock_quantity || 0}" onchange="updateVariation(${index}, 'stock_quantity', this.value)">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Image</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 38px; height: 38px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                     ${varItem.image ? `<img src="${varItem.image}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fa fa-image" style="color: #cbd5e1;"></i>'}
                                </div>
                                <button type="button" class="btn btn-sm btn-secondary" onclick="selectVariationImage(${index})">Select</button>
                                ${varItem.image ? `<button type="button" class="btn btn-sm btn-danger" onclick="updateVariation(${index}, 'image', '')">&times;</button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(div);
        });

        document.getElementById('variations_input').value = JSON.stringify(variations);
    }

    // Helper for toggle animation
    window.toggleVariation = function (header) {
        const content = $(header).next();
        const icon = $(header).find('i.fa-chevron-down');

        content.slideToggle(300, function () {
            // Optional: Rotate icon based on visibility
            if (content.is(':visible')) {
                icon.css('transform', 'rotate(180deg)');
            } else {
                icon.css('transform', 'rotate(0deg)');
            }
        });
    };

    // Initial Render of variations if loaded from DB
    // Use setTimeout to ensure DOM is ready? No, this script is at bottom of page.
    if (variations.length > 0) {
        renderVariations();
    }

    // Initial render
    renderAttributes();
</script>



<script src="<?php echo base_url; ?>/assets/js/admin.js"></script>
<?php include '../includes/footer.php'; ?>
<?php ob_end_flush(); ?>