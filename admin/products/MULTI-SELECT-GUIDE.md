# Multi-Select Categories - Complete Implementation Guide

## Step 1: Fix Category Fetching (Show ALL Categories)

### File: admin/products/edit.php

**Find line 114** (starts with `// Fetch all categories with parent_id`)

**Replace lines 114-170 with:**

```php
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
```

---

## Step 2: Update POST Handling for Multiple Categories

### File: admin/products/edit.php

**Find line 69** (starts with `$category_id = $_POST['category_id']`)

**Replace lines 69-71 with:**

```php
    // Handle multiple category IDs
    $category_id = isset($_POST['category_id']) && is_array($_POST['category_id']) 
        ? json_encode(array_map('intval', $_POST['category_id'])) 
        : (isset($_POST['category_id']) && $_POST['category_id'] !== '' ? $_POST['category_id'] : null);
```

---

## Step 3: Update Category Dropdown to Multi-Select

### File: admin/products/edit.php

**Find line ~395** (the category dropdown section)

**Replace the entire `<select>` block with:**

```php
<div class="form-group">
    <label class="form-label" for="category_id">Categories</label>
    <select id="category_id" name="category_id[]" class="form-input" multiple size="6" style="height: auto;">
        <?php 
        // Parse existing categories
        $selectedCategories = [];
        if (!empty($product['category_id'])) {
            // Check if it's JSON array
            $decoded = json_decode($product['category_id'], true);
            if (is_array($decoded)) {
                $selectedCategories = $decoded;
            } elseif (is_numeric($product['category_id'])) {
                // Old format: single ID
                $selectedCategories = [$product['category_id']];
            } elseif (strpos($product['category_id'], ',') !== false) {
                // Comma-separated
                $selectedCategories = explode(',', $product['category_id']);
            }
        }
        
        foreach ($categories as $category): 
            $isSelected = in_array($category['id'], $selectedCategories);
        ?>
            <option value="<?php echo $category['id']; ?>" <?php echo $isSelected ? 'selected' : ''; ?>>
                <?php echo str_repeat('— ', $category['level']); ?><?php echo htmlspecialchars($category['name']); ?>
            </option>
        <?php endforeach; ?>
    </select>
    <small style="color: var(--secondary); display: block; margin-top: 5px;">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories
    </small>
</div>
```

---

## Step 4: Apply Same Changes to Create Page

### File: admin/products/create.php

**Apply the same 3 changes:**

1. **Simplify category fetching** (around line 89)
2. **Update POST handling** (around line 21)
3. **Change dropdown to multi-select** (around line 192)

---

## Step 5: Test

1. Go to `http://localhost:4000/admin/products/edit.php?id=12`
2. You should see BOTH "Category-1" and "Subcategory" in the dropdown
3. Select multiple categories (hold Ctrl/Cmd)
4. Save the product
5. Reload - selected categories should be preserved

---

## Database Note

The `category_id` column will now store:
- **Multiple categories:** `["1","2","3"]` (JSON array)
- **Single category:** `"1"` or `1` (backward compatible)
- **No category:** `null`

---

## Optional: Add Select2 for Better UX

Add before closing `</body>` tag:

```html
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<script>
$(document).ready(function() {
    $('#category_id').select2({
        placeholder: 'Select categories',
        allowClear: true,
        width: '100%'
    });
});
</script>
```

This gives you a searchable, tag-style multi-select dropdown!
