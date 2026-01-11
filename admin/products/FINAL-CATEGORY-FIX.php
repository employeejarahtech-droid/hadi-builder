<?php
/**
 * FINAL SOLUTION - Category Fetching Fix
 * 
 * The multiselect dropdown is working, but only showing 1 of 2 categories.
 * This is because the complex hierarchical logic is filtering categories.
 * 
 * FIND THIS SECTION in edit.php (lines 115-170):
 * Starting with: // Fetch all categories with parent_id
 * 
 * REPLACE THE ENTIRE SECTION (lines 115-170) WITH THE CODE BELOW:
 */

// Fetch all categories - SIMPLIFIED to show ALL categories
$categories = [];
try {
    // Add parent_id column if it doesn't exist
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER id");
    }

    // Fetch ALL categories - simple query
    $stmt = $pdo->query("SELECT id, name, parent_id FROM categories ORDER BY id ASC");
    $allCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Simply add level indicator (0 for parent, 1 for child)
    foreach ($allCategories as $cat) {
        $cat['level'] = empty($cat['parent_id']) ? 0 : 1;
        $categories[] = $cat;
    }
} catch (Exception $e) { /* ignore */
}

/**
 * THAT'S IT!
 * 
 * After making this change:
 * 1. Save edit.php
 * 2. Go to http://localhost:4000/admin/products/edit.php?id=12
 * 3. You should now see BOTH "Category-1" and "Subcategory" in the dropdown
 * 4. The multiselect will work with search, checkboxes, and tag display
 * 
 * The dropdown will show:
 * - Category-1 (no indent)
 * - — Subcategory (with dash if it has parent_id set)
 */
?>