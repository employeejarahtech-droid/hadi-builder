<?php
require_once __DIR__ . '/includes/db.php';
try {
    $pdo = getDBConnection();
    $html = '<h3>Product Highlights</h3>
    <ul>
        <li>Premium Quality material</li>
        <li>Ergonomic design for daily use</li>
        <li>Available in multiple colors</li>
    </ul>
    <p>Experience the best in class performance with our latest model. It features advanced durability and a sleek finish.</p>';

    $stmt = $pdo->prepare('UPDATE products SET long_description = ? WHERE id = 12');
    $stmt->execute([$html]);
    echo "Updated Product 12 successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
