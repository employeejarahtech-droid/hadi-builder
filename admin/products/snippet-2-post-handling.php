// Handle multiple category IDs
$category_id = isset($_POST['category_id']) && is_array($_POST['category_id'])
? json_encode(array_map('intval', $_POST['category_id']))
: (isset($_POST['category_id']) && $_POST['category_id'] !== '' ? $_POST['category_id'] : null);