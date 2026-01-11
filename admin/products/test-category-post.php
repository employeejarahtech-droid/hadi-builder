<?php
/**
 * DEBUG SCRIPT - Test Category Saving
 * Run this to see what's being posted: http://localhost:4000/admin/products/test-category-post.php
 */
?>
<!DOCTYPE html>
<html>

<head>
    <title>Test Category POST</title>
</head>

<body>
    <h2>Test Category Multiselect POST</h2>

    <?php if ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
        <h3>POST Data Received:</h3>
        <pre><?php print_r($_POST); ?></pre>

        <h3>Category Processing:</h3>
        <?php
        $category_id = isset($_POST['category_id']) && is_array($_POST['category_id'])
            ? json_encode(array_map('intval', $_POST['category_id']))
            : (isset($_POST['category_id']) && $_POST['category_id'] !== '' ? $_POST['category_id'] : null);

        echo "Processed category_id: ";
        var_dump($category_id);
        ?>
    <?php else: ?>
        <form method="POST">
            <label>Select Categories:</label><br>
            <select name="category_id[]" multiple size="5">
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                <option value="3">Category 3</option>
            </select>
            <br><br>
            <button type="submit">Test Submit</button>
        </form>
        <p><small>Select multiple categories (hold Ctrl/Cmd) and click submit to see the POST data</small></p>
    <?php endif; ?>
</body>

</html>