<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in JSON response
ini_set('log_errors', 1);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../../includes/db.php';

    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    // Validate required fields
    $required = ['customer_first_name', 'customer_last_name', 'customer_email', 'customer_phone', 'customer_address', 'payment_method', 'items'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            exit;
        }
    }

    // Validate payment method
    $validPaymentMethods = ['cash_on_delivery', 'card', 'paypal', 'stripe'];
    if (!in_array($input['payment_method'], $validPaymentMethods)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid payment method']);
        exit;
    }

    // Validate items array
    if (!is_array($input['items']) || count($input['items']) === 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Cart is empty']);
        exit;
    }

    $pdo = getDBConnection();
    $pdo->beginTransaction();

    // Calculate totals
    $subtotal = 0;
    foreach ($input['items'] as $item) {
        if (!isset($item['price']) || !isset($item['quantity'])) {
            throw new Exception('Invalid item data: missing price or quantity');
        }
        $subtotal += ($item['price'] * $item['quantity']);
    }

    $shipping = isset($input['shipping']) ? floatval($input['shipping']) : 10.00;
    $total = $subtotal + $shipping;

    // Insert order
    $stmt = $pdo->prepare("
        INSERT INTO orders (
            customer_first_name,
            customer_last_name,
            customer_email,
            customer_phone,
            customer_address,
            payment_method,
            subtotal,
            shipping,
            total,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");

    $stmt->execute([
        $input['customer_first_name'],
        $input['customer_last_name'],
        $input['customer_email'],
        $input['customer_phone'],
        $input['customer_address'],
        $input['payment_method'],
        $subtotal,
        $shipping,
        $total
    ]);

    $orderId = $pdo->lastInsertId();

    // Insert order items
    $itemStmt = $pdo->prepare("
        INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            price,
            subtotal
        ) VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($input['items'] as $item) {
        $itemSubtotal = $item['price'] * $item['quantity'];
        $itemStmt->execute([
            $orderId,
            isset($item['id']) ? $item['id'] : 0,
            isset($item['name']) ? $item['name'] : 'Unknown Product',
            $item['quantity'],
            $item['price'],
            $itemSubtotal
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully!',
        'order_id' => $orderId,
        'order_number' => str_pad($orderId, 6, '0', STR_PAD_LEFT),
        'total' => $total
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error creating order: ' . $e->getMessage()
    ]);
}
?>