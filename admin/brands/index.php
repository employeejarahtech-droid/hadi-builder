<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Brands';
$currentPage = 'brands';

// Pagination settings
$items_per_page = 10;
$current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$offset = ($current_page - 1) * $items_per_page;

$pdo = getDBConnection();

// Create brands table if it doesn't exist
try {
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
} catch (Exception $e) {
    // Table creation failed, but continue
}

// Filters
$search_query = $_GET['search'] ?? '';

// Build Query
$where_clauses = [];
$params = [];

if (!empty($search_query)) {
    $where_clauses[] = "(name LIKE :search_name OR slug LIKE :search_slug)";
    $params[':search_name'] = '%' . $search_query . '%';
    $params[':search_slug'] = '%' . $search_query . '%';
}

$where_sql = $where_clauses ? 'WHERE ' . implode(' AND ', $where_clauses) : '';

// Get total count
$count_sql = "SELECT COUNT(*) FROM brands $where_sql";
if ($params) {
    $count_stmt = $pdo->prepare($count_sql);
    foreach ($params as $key => $value) {
        $count_stmt->bindValue($key, $value);
    }
    $count_stmt->execute();
    $total_brands = $count_stmt->fetchColumn();
} else {
    $total_brands = $pdo->query($count_sql)->fetchColumn();
}

$total_pages = ceil($total_brands / $items_per_page);

// Fetch brands with pagination
$sql = "SELECT * FROM brands $where_sql ORDER BY name ASC LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($sql);

foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}

$stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$brands = $stmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <h1 class="page-title">Brands</h1>
        <a href="create.php" class="btn btn-primary">
            <i class="fa fa-plus"></i> Create New Brand
        </a>
    </div>

    <!-- Filter Form -->
    <div class="card" style="margin-top: .2rem; padding: .2rem;">
        <form method="GET" action="" style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: end;">
            <div style="flex: 1; min-width: 200px;">
                <label class="form-label" style="font-size: 0.875rem;">Search</label>
                <div class="input-wrapper">
                    <i class="fa fa-search input-icon" style="left: 1rem;"></i>
                    <input type="text" name="search" class="form-input with-icon"
                        placeholder="Search by brand name or slug..."
                        value="<?php echo htmlspecialchars($search_query); ?>">
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="height: 42px;">
                Filter
            </button>

            <?php if (!empty($search_query)): ?>
                <a href="index.php" class="btn" style="height: 42px; background: #e2e8f0; color: #475569;">
                    Clear
                </a>
            <?php endif; ?>
        </form>
    </div>
</div>

<div class="content-wrapper">
    <?php if (count($brands) > 0): ?>
        <div style="overflow-x: auto; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table class="table" style="min-width: 800px; margin-bottom: 0;">
                <thead>
                    <tr>
                        <th style="width: 50px;">ID</th>
                        <th style="width: 80px;">Logo</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($brands as $brand): ?>
                        <tr>
                            <td style="text-align: center; color: var(--secondary);">
                                #<?php echo $brand['id']; ?>
                            </td>
                            <td>
                                <?php if (!empty($brand['logo'])): ?>
                                    <div
                                        style="width: 40px; height: 40px; border-radius: 4px; overflow: hidden; background: #f1f5f9; border: 1px solid #e2e8f0;">
                                        <img src="<?php echo htmlspecialchars($brand['logo']); ?>"
                                            alt="<?php echo htmlspecialchars($brand['name']); ?>"
                                            style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                <?php else: ?>
                                    <div
                                        style="width: 40px; height: 40px; border-radius: 4px; background: #f1f5f9; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                                        <i class="fa fa-image"></i>
                                    </div>
                                <?php endif; ?>
                            </td>
                            <td style="font-weight: 500;">
                                <?php echo htmlspecialchars($brand['name']); ?>
                            </td>
                            <td style="color: var(--secondary);">
                                <?php echo htmlspecialchars($brand['slug']); ?>
                            </td>
                            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <?php echo htmlspecialchars($brand['description'] ?? ''); ?>
                            </td>
                            <td style="text-align: right;">
                                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                    <a href="edit.php?id=<?php echo $brand['id']; ?>" class="btn btn-primary"
                                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                        <i class="fa fa-edit"></i> Edit
                                    </a>
                                    <a href="delete.php?id=<?php echo $brand['id']; ?>" class="btn btn-danger"
                                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                        onclick="return confirm('Are you sure you want to delete this brand?');">
                                        <i class="fa fa-trash"></i>
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
            <div class="pagination"
                style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding: 1rem; background: white; border-radius: 0 0 8px 8px; border-top: 1px solid #f1f5f9;">
                <div style="font-size: 0.875rem; color: #64748b;">
                    Showing <?php echo $offset + 1; ?> to
                    <?php echo min($offset + $items_per_page, $total_brands); ?> of
                    <?php echo $total_brands; ?> brands
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <?php if ($current_page > 1): ?>
                        <a href="<?php echo $pageBaseUrl . ($current_page - 1); ?>" class="btn btn-sm btn-secondary"
                            style="text-decoration: none;">&laquo; Previous</a>
                    <?php endif; ?>

                    <?php
                    $start_page = max(1, $current_page - 2);
                    $end_page = min($total_pages, $current_page + 2);

                    if ($start_page > 1) {
                        echo '<a href="' . $pageBaseUrl . '1" class="btn btn-sm btn-outline" style="text-decoration: none; border: 1px solid #e2e8f0; color: #64748b;">1</a>';
                        if ($start_page > 2) {
                            echo '<span style="color: #64748b; padding: 0 0.5rem;">...</span>';
                        }
                    }

                    for ($i = $start_page; $i <= $end_page; $i++): ?>
                        <a href="<?php echo $pageBaseUrl . $i; ?>" class="btn btn-sm"
                            style="<?php echo $i === $current_page ? 'background: var(--primary); color: white;' : 'background: white; border: 1px solid #e2e8f0; color: #64748b;'; ?> text-decoration: none;">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor;

                    if ($end_page < $total_pages) {
                        if ($end_page < $total_pages - 1) {
                            echo '<span style="color: #64748b; padding: 0 0.5rem;">...</span>';
                        }
                        echo '<a href="' . $pageBaseUrl . $total_pages . '" class="btn btn-sm btn-outline" style="text-decoration: none; border: 1px solid #e2e8f0; color: #64748b;">' . $total_pages . '</a>';
                    }
                    ?>

                    <?php if ($current_page < $total_pages): ?>
                        <a href="<?php echo $pageBaseUrl . ($current_page + 1); ?>" class="btn btn-sm btn-secondary"
                            style="text-decoration: none;">Next &raquo;</a>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    <?php else: ?>
        <div class="card" style="text-align: center; padding: 3rem;">
            <i class="fa fa-tag" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>

            <?php if (!empty($search_query)): ?>
                <h3>No brands found matching your search</h3>
                <p style="color: var(--secondary); margin-bottom: 1.5rem;">Try adjusting your search query.</p>
                <a href="index.php" class="btn btn-primary" style="background: #64748b;">Clear Filters</a>
            <?php else: ?>
                <h3>No brands found</h3>
                <p style="color: var(--secondary); margin-bottom: 1.5rem;">Get started by creating your first brand.
                </p>
                <a href="create.php" class="btn btn-primary">Create Brand</a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>