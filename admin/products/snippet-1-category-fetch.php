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