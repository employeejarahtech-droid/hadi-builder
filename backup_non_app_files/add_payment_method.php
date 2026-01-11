<?php
require_once __DIR__ . '/includes/db.php';

echo "Adding payment_method column to orders table...\n\n";

try {
    $pdo = getDBConnection();

    // Add payment_method column
    $pdo->exec("
        ALTER TABLE orders 
        ADD COLUMN payment_method ENUM('cash_on_delivery', 'card', 'paypal', 'stripe') 
        DEFAULT 'cash_on_delivery' 
        AFTER customer_address
    ");

    echo "✓ Payment method column added successfully!\n";
    echo "\nPayment methods available:\n";
    echo "  - cash_on_delivery\n";
    echo "  - card\n";
    echo "  - paypal\n";
    echo "  - stripe\n";

} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "✓ Payment method column already exists!\n";
    } else {
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
}
?>