<?php
require_once __DIR__ . '/includes/db.php';

echo "Adding customer_phone column to orders table...\n\n";

try {
    $pdo = getDBConnection();

    // Add customer_phone column
    $pdo->exec("
        ALTER TABLE orders 
        ADD COLUMN customer_phone VARCHAR(20) 
        AFTER customer_email
    ");

    echo "✓ Customer phone column added successfully!\n";

} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "✓ Customer phone column already exists!\n";
    } else {
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
}
?>