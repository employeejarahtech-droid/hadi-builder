/**
* MULTISELECT DROPDOWN IMPLEMENTATION
* Using: https://github.com/admirhodzic/multiselect-dropdown
*
* This is a lightweight, pure JavaScript library with no dependencies
* that converts native <select multiple> into a beautiful dropdown with:
    * - Checkboxes for each option
    * - Search functionality
    * - "Select All" option
    * - Selected items displayed as tags
    */

    // ============================================
    // STEP 1: Add CSS and JS to edit.php
    // ============================================
    // Add these lines BEFORE the closing </head> tag or before </body>:

    ?>
    <!-- Multiselect Dropdown CSS -->
    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/admirhodzic/multiselect-dropdown@master/multiselect-dropdown.css">

    <!-- Multiselect Dropdown JS -->
    <script src="https://cdn.jsdelivr.net/gh/admirhodzic/multiselect-dropdown@master/multiselect-dropdown.js"></script>
    <?php


    // ============================================
// STEP 2: Update Category Dropdown HTML
// ============================================
// FIND the category dropdown section (around line 399-410)
// REPLACE with this:
    
    ?>
    <div class="form-group">
        <label class="form-label" for="category_id">Categories</label>
        <select id="category_id" name="category_id[]" class="form-input" multiple multiselect-search="true"
            multiselect-select-all="true" multiselect-max-items="3">
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
            Search and select multiple categories
        </small>
    </div>
    <?php


    // ============================================
// STEP 3: Update POST Handling (Line ~69)
// ============================================
// FIND this around line 69:
//     $category_id = $_POST['category_id'] ?? null;
//     if ($category_id === '')
//         $category_id = null;
//
// REPLACE WITH:
    
    $category_id = isset($_POST['category_id']) && is_array($_POST['category_id'])
        ? json_encode(array_map('intval', $_POST['category_id']))
        : (isset($_POST['category_id']) && $_POST['category_id'] !== '' ? $_POST['category_id'] : null);


    // ============================================
// STEP 4: Simplify Category Fetching (Line ~114)
// ============================================
// FIND this around line 114:
// // Fetch all categories with parent_id
// ... (complex code)
//
// REPLACE WITH:
    
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
// FEATURES ENABLED:
// ============================================
// multiselect-search="true"       - Adds search box to filter options
// multiselect-select-all="true"   - Adds "Select All" checkbox
// multiselect-max-items="3"       - Shows max 3 selected items, then "+X more"
//
// You can also add:
// multiselect-hide-x="true"       - Hides the 'x' button on selected tags
//
// ============================================
// RESULT:
// ============================================
// You'll get a beautiful dropdown with:
// ✓ Search box to filter categories
// ✓ "Select All" checkbox
// ✓ Checkboxes for each category
// ✓ Selected categories shown as tags
// ✓ Shows "Category-1, Subcategory +1 more" if more than 3 selected
//
// ============================================
