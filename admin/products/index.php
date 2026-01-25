<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

// Pagination settings
$items_per_page = 10;
$current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$offset = ($current_page - 1) * $items_per_page;

// Fetch products with pagination
// Filters
$category_filter = $_GET['category_id'] ?? '';
$search_query = $_GET['search'] ?? '';

// Fetch products and categories
$products = [];
$categories = []; // New
$currency = '$';
$total_products = 0;
$total_pages = 1;

try {
    $pdo = getDBConnection();

    // Fetch categories for filter
    $cat_stmt = $pdo->query("SELECT id, name FROM categories ORDER BY name ASC");
    $categories = $cat_stmt->fetchAll();

    // Build Query
    $where_clauses = [];
    $params = [];

    if (!empty($category_filter)) {
        $where_clauses[] = "category_id = :category_id";
        $params[':category_id'] = $category_filter;
    }

    if (!empty($search_query)) {
        $where_clauses[] = "name LIKE :search_name";
        $params[':search_name'] = '%' . $search_query . '%';
    }

    $where_sql = $where_clauses ? 'WHERE ' . implode(' AND ', $where_clauses) : '';

    // Get total count
    $count_sql = "SELECT COUNT(*) FROM products $where_sql";
    if ($params) {
        $count_stmt = $pdo->prepare($count_sql);
        foreach ($params as $key => $value) {
            $count_stmt->bindValue($key, $value);
        }
        $count_stmt->execute();
        $total_products = $count_stmt->fetchColumn();
    } else {
        $total_products = $pdo->query($count_sql)->fetchColumn();
    }

    $total_pages = ceil($total_products / $items_per_page);

    // Fetch products with pagination
    $sql = "SELECT * FROM products $where_sql ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $products = $stmt->fetchAll();

    // Fetch currency from settings
    $stmt = $pdo->query("SELECT value FROM settings WHERE key_name = 'currency' LIMIT 1");
    $currencyRow = $stmt->fetch();
    if ($currencyRow) {
        $currency = $currencyRow['value'];
    }

    // Create Category Map for easy lookup
    $categoryMap = [];
    foreach ($categories as $cat) {
        $categoryMap[$cat['id']] = $cat['name'];
    }

} catch (Exception $e) {
    $error = $e->getMessage();
}

$currentPage = 'products';
$pageTitle = 'Products';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <h1 class="page-title">Products</h1>
        <div style="display: flex; gap: 10px;">
            <a href="delete-all.php" class="btn btn-danger"
                onclick="return confirm('Are you sure you want to delete ALL products? This action cannot be undone.');">
                <i class="fa fa-trash"></i> Delete All
            </a>
            <a href="create.php" class="btn btn-primary">
                <i class="fa fa-plus"></i> Add New Product
            </a>
        </div>
    </div>

    <!-- Filter Form -->
    <div class="card" style="margin-top: .2rem; padding: .2rem;">
        <form method="GET" action="" style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: end;">
            <div style="flex: 1; min-width: 200px;">
                <label class="form-label" style="font-size: 0.875rem;">Search</label>
                <div class="input-wrapper">
                    <i class="fa fa-search input-icon" style="left: 1rem;"></i>
                    <input type="text" name="search" class="form-input with-icon"
                        placeholder="Search by product name..." value="<?php echo htmlspecialchars($search_query); ?>">
                </div>
            </div>

            <div style="width: 250px;">
                <label class="form-label" style="font-size: 0.875rem;">Category</label>
                <select name="category_id" class="form-input">
                    <option value="">All Categories</option>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?php echo $cat['id']; ?>" <?php echo $category_filter == $cat['id'] ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($cat['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <button type="submit" class="btn btn-primary" style="height: 42px;">
                Filter
            </button>

            <?php if (!empty($category_filter) || !empty($search_query)): ?>
                <a href="index.php" class="btn" style="height: 42px; background: #e2e8f0; color: #475569;">
                    Clear
                </a>
            <?php endif; ?>
        </form>
    </div>
</div>

<div class="content-wrapper">
    <?php if (isset($error)): ?>
        <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
            Error:
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>

    <?php if (empty($products)): ?>
        <div class="card" style="text-align: center; padding: 3rem;">
            <i class="fa fa-box-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>

            <?php if (!empty($category_filter) || !empty($search_query)): ?>
                <h3>No products found matching your filters</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your categories or search query.</p>
                <a href="index.php" class="btn btn-primary" style="background: #64748b;">Clear Filters</a>
            <?php else: ?>
                <h3>No products found</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Get started by creating your first product.</p>
                <a href="create.php" class="btn btn-primary">
                    <i class="fa fa-plus"></i> Add New Product
                </a>
            <?php endif; ?>
        </div>
    <?php else: ?>
        <div style="overflow-x: auto; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table class="table" style="min-width: 800px; margin-bottom: 0;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th style="text-align: center;">Featured</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $product): ?>
                        <tr>
                            <td>
                                <?php echo $product['id']; ?>
                            </td>
                            <td>
                                <?php if ($product['image_url']): ?>
                                    <img src="<?php echo htmlspecialchars($product['image_url']); ?>"
                                        alt="<?php echo htmlspecialchars($product['name']); ?>"
                                        style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                                <?php else: ?>
                                    <div
                                        style="width: 50px; height: 50px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fa fa-box" style="color: #9ca3af;"></i>
                                    </div>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php echo htmlspecialchars($product['name']); ?>
                            </td>
                            <td>
                                <?php
                                $catIds = $product['category_id'];
                                if (!empty($catIds)) {
                                    // Handle JSON array or single ID
                                    $ids = json_decode($catIds, true);
                                    if (!is_array($ids)) {
                                        $ids = [$catIds];
                                    }

                                    $catNames = [];
                                    foreach ($ids as $cid) {
                                        if (isset($categoryMap[$cid])) {
                                            $catNames[] = $categoryMap[$cid];
                                        }
                                    }

                                    if (!empty($catNames)) {
                                        foreach ($catNames as $cName) {
                                            echo '<span class="badge badge-secondary" style="margin-right: 4px; font-weight: normal;">' . htmlspecialchars($cName) . '</span>';
                                        }
                                    } else {
                                        echo '<span style="color: #9ca3af;">-</span>';
                                    }
                                } else {
                                    echo '<span style="color: #9ca3af;">-</span>';
                                }
                                ?>
                                    </td>
                                    <td>
                                        <?php
                                        $pType = $product['product_type'] ?? 'simple';
                                        $pTypeClass = $pType === 'variable' ? 'badge-info' : 'badge-secondary';
                                        ?>
                                <span class="badge <?php echo $pTypeClass; ?>"
                                    style="background-color: <?php echo $pType === 'variable' ? '#e0f2fe' : '#f1f5f9'; ?>; color: <?php echo $pType === 'variable' ? '#0369a1' : '#475569'; ?>;">
                                    <?php echo ucfirst($pType); ?>
                                </span>
                            </td>
                            <td><?php echo htmlspecialchars($currency) . number_format($product['price'], 2); ?>
                            </td>
                            <td style="text-align: center;">
                                <?php
                                $isFeatured = isset($product['is_featured']) && $product['is_featured'] == 1;
                                ?>
                                <button onclick="toggleFeatured(<?php echo $product['id']; ?>, this)"
                                    style="background: none; border: none; cursor: pointer; font-size: 20px; padding: 5px; transition: all 0.2s;"
                                    title="<?php echo $isFeatured ? 'Remove from featured' : 'Mark as featured'; ?>">
                                    <i class="fa<?php echo $isFeatured ? 's' : 'r'; ?> fa-star"
                                        style="color: <?php echo $isFeatured ? '#fbbf24' : '#cbd5e1'; ?>;"></i>
                                </button>
                            </td>
                            <td>
                                <span
                                    class="badge <?php echo $product['status'] == 'active' ? 'badge-success' : 'badge-warning'; ?>">
                                    <?php echo ucfirst($product['status']); ?>
                                </span>
                            </td>
                            <td>
                                <?php echo date('M d, Y', strtotime($product['created_at'])); ?>
                            </td>
                            <td style="text-align: right;">
                                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                    <a href="edit.php?id=<?php echo $product['id']; ?>" class="btn btn-primary"
                                        style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">
                                        <i class="fa fa-edit"></i> Edit
                                    </a>
                                    <a href="delete.php?id=<?php echo $product['id']; ?>"
                                        onclick="return confirm('Are you sure you want to delete this product?')"
                                        class="btn btn-danger" style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">
                                        <i class="fa fa-trash"></i> Delete
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <?php if ($total_pages > 1): ?>
            <?php
            // Build pagination base URL
            $queryParams = $_GET;
            unset($queryParams['page']);
            $queryString = http_build_query($queryParams);
            $pageBaseUrl = '?' . ($queryString ? $queryString . '&' : '') . 'page=';
            ?>
            <div style="margin-top: 30px; display: flex; justify-content: center; align-items: center; gap: 8px;">
                <?php if ($current_page > 1): ?>
                    <a href="<?php echo $pageBaseUrl . ($current_page - 1); ?>" class="btn"
                        style="padding: 8px 12px; font-size: 14px;">
                        <i class="fa fa-chevron-left"></i> Previous
                    </a>
                <?php endif; ?>

                <?php
                $start_page = max(1, $current_page - 2);
                $end_page = min($total_pages, $current_page + 2);

                if ($start_page > 1): ?>
                    <a href="<?php echo $pageBaseUrl; ?>1" class="btn" style="padding: 8px 12px; font-size: 14px;">1</a>
                    <?php if ($start_page > 2): ?>
                        <span style="padding: 8px;">...</span>
                    <?php endif; ?>
                <?php endif; ?>

                <?php for ($i = $start_page; $i <= $end_page; $i++): ?>
                    <a href="<?php echo $pageBaseUrl . $i; ?>" class="btn <?php echo $i === $current_page ? 'btn-primary' : ''; ?>"
                        style="padding: 8px 12px; font-size: 14px;">
                        <?php echo $i; ?>
                    </a>
                <?php endfor; ?>

                <?php if ($end_page < $total_pages): ?>
                    <?php if ($end_page < $total_pages - 1): ?>
                        <span style="padding: 8px;">...</span>
                    <?php endif; ?>
                    <a href="<?php echo $pageBaseUrl . $total_pages; ?>" class="btn"
                        style="padding: 8px 12px; font-size: 14px;"><?php echo $total_pages; ?></a>
                <?php endif; ?>

                <?php if ($current_page < $total_pages): ?>
                    <a href="<?php echo $pageBaseUrl . ($current_page + 1); ?>" class="btn"
                        style="padding: 8px 12px; font-size: 14px;">
                        Next <i class="fa fa-chevron-right"></i>
                    </a>
                <?php endif; ?>
            </div>

            <div style="text-align: center; margin-top: 15px; color: #6b7280; font-size: 14px;">
                Showing <?php echo $offset + 1; ?> to <?php echo min($offset + $items_per_page, $total_products); ?> of
                <?php echo $total_products; ?> products
            </div>
        <?php endif; ?>
    <?php endif; ?>
</div>

<script>
    function toggleFeatured(productId, button) {
        const icon = button.querySelector('i');
        const isFeatured = icon.classList.contains('fas');

        // Send AJAX request
        fetch('toggle_featured.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id=' + productId + '&featured=' + (isFeatured ? '0' : '1')
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Toggle the icon
                    if (isFeatured) {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '#cbd5e1';
                        button.title = 'Mark as featured';
                    } else {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = '#fbbf24';
                        button.title = 'Remove from featured';
                    }
                } else {
                    alert('Error: ' + (data.message || 'Failed to update featured status'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update featured status');
            });
    }
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>