<?php
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();
    echo "Checking mobile_menus table...\n";

    // Check if css_file column exists
    $stmt = $pdo->prepare("SHOW COLUMNS FROM mobile_menus LIKE 'css_file'");
    $stmt->execute();
    if ($stmt->fetch()) {
        echo "Column 'css_file' already exists.\n";
    } else {
        echo "Adding 'css_file' column...\n";
        $pdo->exec("ALTER TABLE mobile_menus ADD COLUMN css_file VARCHAR(255) DEFAULT NULL");
        echo "Column 'css_file' added successfully.\n";
    }

    // Check if content column exists (just to be safe)
    $stmt = $pdo->prepare("SHOW COLUMNS FROM mobile_menus LIKE 'content'");
    $stmt->execute();
    if ($stmt->fetch()) {
        echo "Column 'content' exists.\n";
    } else {
        echo "Adding 'content' column...\n";
        $pdo->exec("ALTER TABLE mobile_menus ADD COLUMN content LONGTEXT DEFAULT NULL");
        echo "Column 'content' added successfully.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>