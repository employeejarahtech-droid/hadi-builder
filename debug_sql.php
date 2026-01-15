<?php
require_once __DIR__ . '/includes/db.php';

try {
    $pdo = getDBConnection();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $category = 7;
    $params = [':cat_id' => $category, ':cat_json' => (string) $category];

    $dateCheck = "2024-01-01"; // Arbitrary, just testing logic

    // Reproducing the exact WHERE clause logic
    $whereConditions = ["status = 'active'"];

    // Using distinct keys
    // JSON_CONTAINS requires the target to be a string if the array contains numbers but we want to be safe
    // Actually, if the array is [7], JSON_CONTAINS(col, '7') works.
    $whereConditions[] = "(category_id = :cat_id OR (category_id LIKE '[%]' AND JSON_CONTAINS(category_id, :cat_json)))";

    $whereClause = implode(' AND ', $whereConditions);
    $sql = "SELECT count(*) FROM products WHERE $whereClause";

    echo "Testing SQL: $sql\n";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo "Count: " . $stmt->fetchColumn() . "\n";
    echo "Success!\n";

} catch (PDOException $e) {
    echo "SQL Error: " . $e->getMessage() . "\n";
    echo "Error Code: " . $e->getCode() . "\n";
} catch (Exception $e) {
    echo "General Error: " . $e->getMessage() . "\n";
}
