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