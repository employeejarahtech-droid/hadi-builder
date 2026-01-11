<?php
// check_schema.php
if (file_exists(__DIR__ . '/includes/db.php')) {
    require_once __DIR__ . '/includes/db.php';
} elseif (file_exists(__DIR__ . '/../includes/db.php')) {
    require_once __DIR__ . '/../includes/db.php';
} else {
    // try to find it relative to admin if we were inside admin but we are in root
    // actually, let's just look closely.
    // The script is in d:/xamp74.33/htdocs/new-cms-final/check_posts_schema.php
    // The db.php is in d:/xamp74.33/htdocs/new-cms-final/includes/db.php
    // So __DIR__ . '/includes/db.php' is correct.
    // The invalid include was "admin/includes/db.php" which probably failed.
    die("Could not find db.php at " . __DIR__ . '/includes/db.php');
}

try {
    $pdo = getDBConnection();

    // Check columns
    $stmt = $pdo->query("DESCRIBE posts");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $needed = ['meta_title', 'meta_description', 'meta_keywords', 'image', 'meta_image'];
    $missing = array_diff($needed, $columns);

    if (!empty($missing)) {
        echo "Missing columns: " . implode(', ', $missing) . "\n";
        foreach ($missing as $col) {
            $sql = "ALTER TABLE posts ADD COLUMN $col TEXT DEFAULT NULL";
            $pdo->exec($sql);
            echo "Added column: $col\n";
        }
    } else {
        echo "All meta columns exist.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
