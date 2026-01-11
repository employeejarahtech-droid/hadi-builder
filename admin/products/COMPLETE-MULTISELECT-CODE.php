<?php
/**
 * COMPLETE WORKING MULTI-SELECT CATEGORY IMPLEMENTATION
 * Copy this entire file content and follow instructions below
 */

// ============================================
// SECTION 1: POST HANDLING (Line ~69)
// ============================================
// FIND THIS in edit.php around line 69:
//     $category_id = $_POST['category_id'] ?? null;
//     if ($category_id === '')
//         $category_id = null;
//
// REPLACE WITH:
$category_id = isset($_POST['category_id']) && is_array($_POST['category_id'])
    ? json_encode(array_map('intval', $_POST['category_id']))
    : (isset($_POST['category_id']) && $_POST['category_id'] !== '' ? $_POST['category_id'] : null);


// ============================================
// SECTION 2: CATEGORY FETCHING (Line ~114)
// ============================================
// FIND THIS in edit.php around line 114:
// // Fetch all categories with parent_id
// $categories = [];
// try {
//     ... (complex hierarchical code)
// } catch (Exception $e) { /* ignore */ }
//
// REPLACE ENTIRE SECTION (lines 114-170) WITH:

// Fetch all categories - SIMPLIFIED
$categories = [];
try {
    $stmt = $pdo->query("SELECT id, name, parent_id FROM categories ORDER BY id ASC");
    $allCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($allCategories as $cat) {
        $cat['level'] = empty($cat['parent_id']) ? 0 : 1;
        $categories[] = $cat;
    }
} catch (Exception $e) {
    $categories = [];
}


// ============================================
// SECTION 3: MULTI-SELECT DROPDOWN (Line ~399)
// ============================================
// FIND THIS in edit.php around line 399:
// <div class="form-group">
//     <label class="form-label" for="category_id">Category</label>
//     <select id="category_id" name="category_id" class="form-input">
//         <option value="">-- Select --</option>
//         ...
//     </select>
// </div>
//
// REPLACE WITH:
?>

<div class="form-group">
    <label class="form-label" for="category_id">Categories</label>
    <select id="category_id" name="category_id[]" class="form-input" multiple size="6" style="height: auto;">
        <?php
        // Parse existing categories
        $selectedCategories = [];
        if (!empty($product['category_id'])) {
            $decoded = json_decode($product['category_id'], true);
            if (is_array($decoded)) {
                $selectedCategories = $decoded;
            } elseif (is_numeric($product['category_id'])) {
                $selectedCategories = [$product['category_id']];
            }
        }

        foreach ($categories as $category):
            $isSelected = in_array($category['id'], $selectedCategories);
            ?>
            <option value="<?php echo $category['id']; ?>" <?php echo $isSelected ? 'selected' : ''; ?>>
                <?php echo str_repeat('— ', $category['level']); ?>
                <?php echo htmlspecialchars($category['name']); ?>
            </option>
        <?php endforeach; ?>
    </select>
    <small style="color: var(--secondary); display: block; margin-top: 5px;">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories
    </small>
</div>

<?php
/**
 * TESTING:
 * 1. Save edit.php after making all 3 changes
 * 2. Go to http://localhost:4000/admin/products/edit.php?id=12
 * 3. You should see a taller dropdown showing ALL categories
 * 4. Hold Ctrl/Cmd and click multiple categories
 * 5. Save the product
 * 6. Reload - selected categories should be preserved
 */
?>