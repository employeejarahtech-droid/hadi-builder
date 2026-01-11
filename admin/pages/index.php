<?php
session_start();

// Ensure auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

// Pagination settings
$items_per_page = 10;
$current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$offset = ($current_page - 1) * $items_per_page;

// Filters
$status_filter = $_GET['status'] ?? '';
$search_query = $_GET['search'] ?? '';

try {
    $pdo = getDBConnection();

    // Build Query
    $where_clauses = [];
    $params = [];

    if (!empty($status_filter)) {
        $where_clauses[] = "status = :status";
        $params[':status'] = $status_filter;
    }

    if (!empty($search_query)) {
        $where_clauses[] = "(title LIKE :search_title OR slug LIKE :search_slug)";
        $params[':search_title'] = '%' . $search_query . '%';
        $params[':search_slug'] = '%' . $search_query . '%';
    }

    $where_sql = $where_clauses ? 'WHERE ' . implode(' AND ', $where_clauses) : '';

    // Get total count
    $count_sql = "SELECT COUNT(*) FROM pages $where_sql";
    if ($params) {
        $count_stmt = $pdo->prepare($count_sql);
        foreach ($params as $key => $value) {
            $count_stmt->bindValue($key, $value);
        }
        $count_stmt->execute();
        $total_pages_count = $count_stmt->fetchColumn();
    } else {
        $total_pages_count = $pdo->query($count_sql)->fetchColumn();
    }

    $total_pages = ceil($total_pages_count / $items_per_page);

    // Fetch pages with pagination
    $sql = "SELECT * FROM pages $where_sql ORDER BY updated_at DESC LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $pages = $stmt->fetchAll();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$currentPage = 'pages';
$pageTitle = 'Manage Pages';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <h1 class="page-title">Pages</h1>
        <a href="create.php" class="btn btn-primary">
            <i class="fa fa-plus"></i> Create New Page
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
                        placeholder="Search by title or slug..." value="<?php echo htmlspecialchars($search_query); ?>">
                </div>
            </div>

            <div style="width: 200px;">
                <label class="form-label" style="font-size: 0.875rem;">Status</label>
                <select name="status" class="form-input">
                    <option value="">All Statuses</option>
                    <option value="published" <?php echo $status_filter === 'published' ? 'selected' : ''; ?>>Published
                    </option>
                    <option value="draft" <?php echo $status_filter === 'draft' ? 'selected' : ''; ?>>Draft</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary" style="height: 42px;">
                Filter
            </button>

            <?php if (!empty($status_filter) || !empty($search_query)): ?>
                <a href="index.php" class="btn" style="height: 42px; background: #e2e8f0; color: #475569;">
                    Clear
                </a>
            <?php endif; ?>
        </form>
    </div>
</div>

<div class="content-wrapper">
    <?php if (count($pages) > 0): ?>
        <div style="overflow-x: auto; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table class="table" style="min-width: 800px; margin-bottom: 0;">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pages as $page): ?>
                        <tr>
                            <td>
                                <a href="../builder.php?type=page&id=<?php echo $page['id']; ?>"
                                    style="color: inherit; text-decoration: none;">
                                    <strong><?php echo htmlspecialchars($page['title']); ?></strong>
                                </a>
                            </td>
                            <td>
                                <a href="<?php echo base_url . '/' . htmlspecialchars($page['slug']); ?>" target="_blank"
                                    style="color: var(--primary); text-decoration: none;">
                                    /<?php echo htmlspecialchars($page['slug']); ?> <i class="fa fa-external-link-alt"
                                        style="font-size: 0.75em;"></i>
                                </a>
                            </td>
                            <td>
                                <span
                                    class="badge <?php echo $page['status'] === 'published' ? 'badge-success' : 'badge-warning'; ?>">
                                    <?php echo ucfirst($page['status']); ?>
                                </span>
                            </td>
                            <td><?php echo date('M d, Y', strtotime($page['updated_at'])); ?></td>
                            <td style="text-align: right;">
                                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                    <button class="btn toggle-status-btn" data-id="<?php echo $page['id']; ?>"
                                        data-status="<?php echo $page['status']; ?>"
                                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: <?php echo $page['status'] === 'published' ? '#f59e0b' : '#10b981'; ?>; color: white; border: none; cursor: pointer; border-radius: 4px; white-space: nowrap;">
                                        <i
                                            class="fa <?php echo $page['status'] === 'published' ? 'fa-eye-slash' : 'fa-eye'; ?>"></i>
                                        <?php echo $page['status'] === 'published' ? 'Unpublish' : 'Publish'; ?>
                                    </button>
                                    <a href="../builder.php?type=page&id=<?php echo $page['id']; ?>" class="btn btn-primary"
                                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem; white-space: nowrap;">
                                        <i class="fa fa-paint-brush"></i> Builder
                                    </a>
                                    <a href="edit-page.php?id=<?php echo $page['id']; ?>" class="btn"
                                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #6366f1; color: white;">
                                        <i class="fa fa-edit"></i>
                                    </a>
                                    <a href="delete.php?id=<?php echo $page['id']; ?>" class="btn btn-danger"
                                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                        onclick="return confirm('Are you sure?');">
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
                    <?php echo min($offset + $items_per_page, $total_pages_count); ?> of
                    <?php echo $total_pages_count; ?> pages
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
            <i class="fa fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>

            <?php if (!empty($status_filter) || !empty($search_query)): ?>
                <h3>No pages found matching your filters</h3>
                <p style="color: var(--secondary); margin-bottom: 1.5rem;">Try adjusting your search or filter criteria.</p>
                <a href="index.php" class="btn btn-primary" style="background: #64748b;">Clear Filters</a>
            <?php else: ?>
                <h3>No pages found</h3>
                <p style="color: var(--secondary); margin-bottom: 1.5rem;">Get started by creating your first page.</p>
                <a href="create.php" class="btn btn-primary">Create Page</a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    function showToast(message, type = 'info') {
        if (window.Toast) {
            Toast.show(message, type);
        } else {
            alert(message);
        }
    }

    // Toggle status handler
    $('.toggle-status-btn').on('click', function () {
        const btn = $(this);
        const pageId = btn.data('id');
        const currentStatus = btn.data('status');
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';

        btn.prop('disabled', true).text('Updating...');

        $.ajax({
            url: 'update_status.php',
            method: 'POST',
            data: {
                id: pageId,
                status: newStatus
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Update button
                    btn.data('status', newStatus);
                    btn.css('background', newStatus === 'published' ? '#f59e0b' : '#10b981');
                    btn.html('<i class="fa ' + (newStatus === 'published' ? 'fa-eye-slash' : 'fa-eye') + '"></i> ' +
                        (newStatus === 'published' ? 'Unpublish' : 'Publish'));

                    // Update status badge
                    const badge = btn.closest('tr').find('.badge');
                    badge.removeClass('badge-success badge-warning')
                        .addClass(newStatus === 'published' ? 'badge-success' : 'badge-warning')
                        .text(newStatus.charAt(0).toUpperCase() + newStatus.slice(1));

                    showToast('Status updated successfully', 'success');
                } else {
                    showToast(response.message || 'Error updating status', 'error');
                }
            },
            error: function () {
                showToast('Connection error', 'error');
            },
            complete: function () {
                btn.prop('disabled', false);
            }
        });
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>