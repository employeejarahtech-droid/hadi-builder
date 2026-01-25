<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

echo "<h2>Widget Settings Debug</h2>";

try {
    $pdo = getDBConnection();

    echo "<h3>All Widget Settings in Database:</h3>";
    $stmt = $pdo->query("SELECT widget_name, is_active FROM widget_settings ORDER BY widget_name");

    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>Widget Name</th><th>Is Active</th></tr>";

    $count = 0;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $count++;
        $status = $row['is_active'] ? 'Active' : 'Inactive';
        $color = $row['is_active'] ? 'green' : 'red';
        echo "<tr><td>{$row['widget_name']}</td><td style='color: $color'><strong>$status</strong></td></tr>";
    }

    echo "</table>";
    echo "<p>Total: $count widget settings</p>";

    echo "<h3>Inactive Widgets (should be hidden in builder):</h3>";
    $stmt = $pdo->query("SELECT widget_name FROM widget_settings WHERE is_active = 0");
    $inactive = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $inactive[] = $row['widget_name'];
    }

    echo "<pre>" . print_r($inactive, true) . "</pre>";
    echo "<p>This array is passed to JavaScript as INACTIVE_WIDGETS</p>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

echo '<br><br><a href="index.php">Back to Widget List</a>';
?>