<?php
require_once __DIR__ . '/includes/db.php';
$pdo = getDBConnection();

// Publish my-30 page
$stmt = $pdo->prepare("UPDATE pages SET status = 'published' WHERE slug = ?");
$stmt->execute(['my-30']);

echo "Page 'my-30' published!\n\n";

// Show correct URL
echo "✅ Access your page at:\n";
echo "   http://localhost:4000/new-cms/my-30\n\n";

echo "❌ NOT at:\n";
echo "   http://localhost:4000/my-30\n\n";

echo "Remember: Your CMS is in the /new-cms subdirectory!\n";
?>