<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$id = $_GET['id'] ?? null;
if (!$id) {
    header('Location: index.php');
    exit;
}

try {
    $pdo = getDBConnection();

    // Handle Status Update
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status'])) {
        $newStatus = $_POST['status'];
        $updateStmt = $pdo->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?");
        $updateStmt->execute([$newStatus, $id]);
        $message = "Order status updated to " . ucfirst($newStatus);
    }

    // Fetch Order
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$id]);
    $order = $stmt->fetch();

    if (!$order) {
        die("Order not found");
    }

    // Fetch Order Items
    $itemsStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $itemsStmt->execute([$id]);
    $items = $itemsStmt->fetchAll();

} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$currentPage = 'orders';
$pageTitle = 'Order #' . str_pad($order['id'], 6, '0', STR_PAD_LEFT);
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">
            <a href="index.php" style="text-decoration: none; color: var(--secondary); margin-right: 10px;">
                <i class="fa fa-arrow-left"></i>
            </a>
            Order #
            <?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?>
        </h1>

        <form method="POST" style="display: flex; gap: 10px; align-items: center;">
            <select name="status" class="form-input" style="padding: 0.5rem; width: auto;"
                onchange="this.form.submit()">
                <option value="pending" <?php echo $order['status'] === 'pending' ? 'selected' : ''; ?>>Pending</option>
                <option value="processing" <?php echo $order['status'] === 'processing' ? 'selected' : ''; ?>>Processing
                </option>
                <option value="completed" <?php echo $order['status'] === 'completed' ? 'selected' : ''; ?>>Completed
                </option>
                <option value="cancelled" <?php echo $order['status'] === 'cancelled' ? 'selected' : ''; ?>>Cancelled
                </option>
            </select>
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
        </form>
    </div>
</div>

<div class="content-wrapper">
    <?php if (isset($message)): ?>
        <div style="background: #dcfce7; color: #166534; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
            <?php echo htmlspecialchars($message); ?>
        </div>
    <?php endif; ?>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">

        <!-- Left Column: Order Items -->
        <div class="card">
            <h3 style="margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Order
                Items</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th style="width: 50%;">Product</th>
                        <th style="text-align: center;">Price</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($items as $item): ?>
                        <tr>
                            <td>
                                <div style="font-weight: 500; font-size: 1rem;">
                                    <?php echo htmlspecialchars($item['product_name']); ?>
                                </div>
                                <!-- <small style="color: var(--secondary);">SKU: XYZ123</small> -->
                            </td>
                            <td style="text-align: center;">$
                                <?php echo number_format($item['price'], 2); ?>
                            </td>
                            <td style="text-align: center;">
                                <?php echo $item['quantity']; ?>
                            </td>
                            <td style="text-align: right; font-weight: 600;">$
                                <?php echo number_format($item['subtotal'], 2); ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
                <tfoot style="background: #f8fafc; font-weight: 600;">
                    <tr>
                        <td colspan="3" style="text-align: right; padding-top: 1.5rem;">Subtotal:</td>
                        <td style="text-align: right; padding-top: 1.5rem;">$
                            <?php echo number_format($order['subtotal'], 2); ?>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right; border-bottom: none;">Shipping:</td>
                        <td style="text-align: right; border-bottom: none;">$
                            <?php echo number_format($order['shipping'], 2); ?>
                        </td>
                    </tr>
                    <tr style="font-size: 1.1em; color: var(--primary-dark);">
                        <td colspan="3" style="text-align: right; border-bottom: none;">Total:</td>
                        <td style="text-align: right; border-bottom: none;">$
                            <?php echo number_format($order['total'], 2); ?>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Right Column: Customer Details -->
        <div style="display: flex; flex-direction: column; gap: 20px;">

            <!-- Customer Info -->
            <div class="card">
                <h3 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    Customer Details</h3>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 0.8rem; color: var(--secondary); text-transform: uppercase;">Name</div>
                    <div style="font-weight: 500;">
                        <?php echo htmlspecialchars($order['customer_first_name'] . ' ' . $order['customer_last_name']); ?>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 0.8rem; color: var(--secondary); text-transform: uppercase;">Email</div>
                    <div><a href="mailto:<?php echo htmlspecialchars($order['customer_email']); ?>"
                            style="color: var(--primary); text-decoration: none;">
                            <?php echo htmlspecialchars($order['customer_email']); ?>
                        </a></div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 0.8rem; color: var(--secondary); text-transform: uppercase;">Phone</div>
                    <div>
                        <?php echo htmlspecialchars($order['customer_phone']); ?>
                    </div>
                </div>
            </div>

            <!-- Shipping Address -->
            <div class="card">
                <h3 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    Shipping Address</h3>
                <div style="line-height: 1.6;">
                    <?php echo nl2br(htmlspecialchars($order['customer_address'])); ?>
                </div>
            </div>

            <!-- Payment Info -->
            <div class="card">
                <h3 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    Payment Info</h3>

                <div style="margin-bottom: 10px;">
                    <div style="font-size: 0.8rem; color: var(--secondary); text-transform: uppercase;">Method</div>
                    <div style="font-weight: 500; text-transform: capitalize;">
                        <?php echo str_replace('_', ' ', $order['payment_method']); ?>
                    </div>
                </div>

                <div style="margin-bottom: 10px;">
                    <div style="font-size: 0.8rem; color: var(--secondary); text-transform: uppercase;">Date</div>
                    <div>
                        <?php echo date('M d, Y H:i A', strtotime($order['created_at'])); ?>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>