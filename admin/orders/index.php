<?php
session_start();

// Ensure auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    // Filters
    $filters = [];
    $params = [];
    $where_clauses = [];

    // Search
    if (!empty($_GET['search'])) {
        $search = trim($_GET['search']);
        $where_clauses[] = "(
            id LIKE ? OR 
            customer_first_name LIKE ? OR 
            customer_last_name LIKE ? OR 
            customer_email LIKE ?
        )";
        $params[] = "%$search%"; // For ID (fuzzy match) or exact? Let's do fuzzy
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $filters['search'] = $search;
    }

    // Status Filter
    if (!empty($_GET['status'])) {
        $status = trim($_GET['status']);
        $where_clauses[] = "status = ?";
        $params[] = $status;
        $filters['status'] = $status;
    }

    $where_sql = "";
    if (count($where_clauses) > 0) {
        $where_sql = "WHERE " . implode(" AND ", $where_clauses);
    }

    // Pagination
    $items_per_page = 10;
    $current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $offset = ($current_page - 1) * $items_per_page;

    // Get total orders count with filters
    $count_stmt = $pdo->prepare("SELECT COUNT(*) FROM orders $where_sql");
    $count_stmt->execute($params); // Reuse params for count
    $total_items = $count_stmt->fetchColumn();
    $total_pages = ceil($total_items / $items_per_page);

    // Fetch orders for current page
    // Needs params merged for LIMIT/OFFSET
    $sql = "SELECT * FROM orders $where_sql ORDER BY created_at DESC LIMIT $items_per_page OFFSET $offset";
    // We can't bind LIMIT/OFFSET with ? if we use execute($params) because params has string types
    // and PDO emulation might quote them.
    // Safer to use bindValue for everything or carefully construct params.
    // For simplicity with variable params, let's use the execute($params) for where clause only, 
    // and inject integers for limit/offset into string (safe since we cast them to int above).

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$currentPage = 'orders';
$pageTitle = 'Manage Orders';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;">
        <h1 class="page-title">Orders</h1>
    </div>

    <!-- Filter Form -->
    <div class="card" style="margin-bottom: .2rem; padding: .2rem;">
        <form method="GET" action="" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">

            <div style="flex: 1; min-width: 200px;">
                <label
                    style="font-size: 0.875rem; font-weight: 500; color: #64748b; display: block; margin-bottom: 0.25rem;">Search</label>
                <div style="position: relative;">
                    <i class="fa fa-search"
                        style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8;"></i>
                    <input type="text" name="search" class="form-input"
                        value="<?php echo htmlspecialchars($filters['search'] ?? ''); ?>"
                        placeholder="Order ID, Name or Email" style="padding-left: 2rem;">
                </div>
            </div>

            <div style="width: 200px;">
                <label
                    style="font-size: 0.875rem; font-weight: 500; color: #64748b; display: block; margin-bottom: 0.25rem;">Status</label>
                <select name="status" class="form-input">
                    <option value="">All Statuses</option>
                    <option value="pending" <?php echo (isset($filters['status']) && $filters['status'] === 'pending') ? 'selected' : ''; ?>>Pending</option>
                    <option value="processing" <?php echo (isset($filters['status']) && $filters['status'] === 'processing') ? 'selected' : ''; ?>>Processing</option>
                    <option value="completed" <?php echo (isset($filters['status']) && $filters['status'] === 'completed') ? 'selected' : ''; ?>>Completed</option>
                    <option value="cancelled" <?php echo (isset($filters['status']) && $filters['status'] === 'cancelled') ? 'selected' : ''; ?>>Cancelled</option>
                </select>
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <button type="submit" class="btn btn-primary" style="height: 42px;">Filter</button>
                <?php if (!empty($filters)): ?>
                    <a href="index.php" class="btn btn-secondary"
                        style="height: 42px; text-decoration: none; display: flex; align-items: center;">Clear</a>
                <?php endif; ?>
            </div>

        </form>
    </div>
</div>

<div class="content-wrapper">
    <?php if (count($orders) > 0): ?>
        <table class="table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($orders as $order): ?>
                    <!-- Handle missing created_at if necessary, usually defaults to timestamp -->
                    <tr>
                        <td><strong>#
                                <?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?>
                            </strong></td>
                        <td>
                            <?php echo htmlspecialchars($order['customer_first_name'] . ' ' . $order['customer_last_name']); ?><br>
                            <span style="font-size: 0.75rem; color: var(--secondary);">
                                <?php echo htmlspecialchars($order['customer_email']); ?>
                            </span>
                        </td>
                        <td>
                            <?php echo isset($order['created_at']) ? date('M d, Y H:i', strtotime($order['created_at'])) : 'N/A'; ?>
                        </td>
                        <td>
                            <span class="badge" style="<?php
                            switch ($order['status']) {
                                case 'completed':
                                    echo 'background: #dcfce7; color: #166534;';
                                    break;
                                case 'pending':
                                    echo 'background: #fef9c3; color: #854d0e;';
                                    break;
                                case 'cancelled':
                                    echo 'background: #fee2e2; color: #991b1b;';
                                    break;
                                default:
                                    echo 'background: #f1f5f9; color: #475569;';
                                    break;
                            }
                            ?>">
                                <?php echo ucfirst($order['status']); ?>
                            </span>
                        </td>
                        <td style="font-weight: 600;">
                            <?php echo number_format($order['total'], 2); ?>
                        </td>
                        <td style="text-align: right;">
                            <!-- Placeholder for view details -->
                            <!-- View Details -->
                            <a href="view.php?id=<?php echo $order['id']; ?>" class="btn btn-sm btn-secondary"
                                style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                <i class="fa fa-eye"></i> View
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- Pagination -->
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
                    <?php echo min($offset + $items_per_page, $total_items); ?> of
                    <?php echo $total_items; ?> orders
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
            <i class="fa fa-shopping-cart" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>

            <?php if (!empty($filters)): ?>
                <h3>No orders found matching your filters</h3>
                <p style="color: var(--secondary); margin-bottom: 1.5rem;">Try adjusting your search or status filter.</p>
                <a href="index.php" class="btn btn-primary" style="background: #64748b;">Clear Filters</a>
            <?php else: ?>
                <h3>No orders found</h3>
                <p style="color: var(--secondary); margin-bottom: 1.5rem;">When customers place orders, they will appear here.
                </p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>