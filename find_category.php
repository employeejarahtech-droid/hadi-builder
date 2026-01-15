<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT id, name FROM categories WHERE name LIKE ?");
$stmt->execute(['%Accessories%']);
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($categories) {
    foreach ($categories as $cat) {
        echo "Found Category: " . $cat['name'] . " (ID: " . $cat['id'] . ")\n";
    }
} else {
    echo "Category 'Accessories' not found.\n";
    // Check all categories to be sure
    $stmt = $pdo->query("SELECT id, name FROM categories LIMIT 20");
    echo "Listing first 20 categories:\n";
    while ($row = $stmt->fetch()) {
        echo $row['name'] . " (" . $row['id'] . ")\n";
    }
}
