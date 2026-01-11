<?php
/**
 * FIX DATABASE COLUMN TYPE - Handle Foreign Key
 * Run this: http://localhost:4000/admin/products/fix-category-column.php
 */

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();

    echo "<h2>Category Column Fix - Step by Step</h2>";
    echo "<div style='background:#f0f0f0;padding:20px;margin:20px;border:2px solid #333;'>";

    // Step 1: Find the foreign key constraint name
    echo "<h3>Step 1: Finding foreign key constraint...</h3>";
    $stmt = $pdo->query("
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_NAME = 'products' 
        AND COLUMN_NAME = 'category_id' 
        AND CONSTRAINT_NAME != 'PRIMARY'
    ");
    $constraint = $stmt->fetch();

    if ($constraint) {
        $constraintName = $constraint['CONSTRAINT_NAME'];
        echo "<p>Found constraint: <strong>{$constraintName}</strong></p>";

        // Step 2: Drop the foreign key
        echo "<h3>Step 2: Dropping foreign key constraint...</h3>";
        $pdo->exec("ALTER TABLE products DROP FOREIGN KEY {$constraintName}");
        echo "<p style='color:green;'>✓ Foreign key dropped</p>";

        // Step 3: Drop the index if it exists
        echo "<h3>Step 3: Dropping index...</h3>";
        try {
            $pdo->exec("ALTER TABLE products DROP INDEX {$constraintName}");
            echo "<p style='color:green;'>✓ Index dropped</p>";
        } catch (Exception $e) {
            echo "<p style='color:orange;'>Index may not exist (OK)</p>";
        }
    } else {
        echo "<p>No foreign key constraint found</p>";
    }

    // Step 4: Change column type to TEXT
    echo "<h3>Step 4: Changing column type to TEXT...</h3>";
    $pdo->exec("ALTER TABLE products MODIFY COLUMN category_id TEXT NULL");
    echo "<p style='color:green;'>✓ Column changed to TEXT</p>";

    // Step 5: Verify
    echo "<h3>Step 5: Verifying...</h3>";
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'category_id'");
    $column = $stmt->fetch();
    echo "<p><strong>New column type:</strong> {$column['Type']}</p>";

    echo "</div>";

    echo "<div style='background:#d4edda;padding:20px;margin:20px;border:2px solid #28a745;'>";
    echo "<h3 style='color:#155724;'>✓ SUCCESS!</h3>";
    echo "<p>The category_id column can now store JSON arrays like [1,2,3]</p>";
    echo "<p><strong>Note:</strong> The foreign key constraint was removed because you're using multi-select categories.</p>";
    echo "<p>With multi-select, a product can belong to multiple categories, so a single foreign key doesn't make sense.</p>";
    echo "</div>";

    echo "<p><a href='edit.php?id=10' style='font-size:18px;padding:10px 20px;background:#28a745;color:white;text-decoration:none;border-radius:4px;display:inline-block;'>Go to Product Edit Page</a></p>";
    echo "<p>Now try selecting multiple categories and saving!</p>";

} catch (Exception $e) {
    echo "<p style='color:red;'><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>