<?php
// check_pages_schema.php
if (file_exists(__DIR__ . '/includes/db.php')) {
    require_once __DIR__ . '/includes/db.php';
} elseif (file_exists(__DIR__ . '/../includes/db.php')) {
    require_once __DIR__ . '/../includes/db.php';
} else {
    die("Could not find db.php");
}

try {
    $pdo = getDBConnection();

    // Check columns
    $stmt = $pdo->query("DESCRIBE pages");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $needed = ['meta_title', 'meta_description', 'meta_keywords', 'image', 'meta_image'];
    $missing = array_diff($needed, $columns);

    if (!empty($missing)) {
        echo "Missing columns: " . implode(', ', $missing) . "\n";
        foreach ($missing as $col) {
            $sql = "ALTER TABLE pages ADD COLUMN $col TEXT DEFAULT NULL";
            $pdo->exec($sql);
            echo "Added column: $col\n";
        }
    } else {
        echo "All meta/image columns exist for pages.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
