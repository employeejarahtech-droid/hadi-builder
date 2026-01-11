<?php
require_once __DIR__ . '/includes/db.php';

echo "Creating orders and order_items tables...\n\n";

try {
    $pdo = getDBConnection();

    // Create orders table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_first_name VARCHAR(100),
            customer_last_name VARCHAR(100),
            customer_email VARCHAR(255),
            customer_address TEXT,
            subtotal DECIMAL(10,2),
            shipping DECIMAL(10,2),
            total DECIMAL(10,2),
            status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    echo "✓ Orders table created successfully!\n";

    // Create order_items table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            product_name VARCHAR(255),
            quantity INT NOT NULL,
            price DECIMAL(10,2),
            subtotal DECIMAL(10,2),
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
    ");
    echo "✓ Order items table created successfully!\n";

    echo "\n✅ Database setup complete!\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>