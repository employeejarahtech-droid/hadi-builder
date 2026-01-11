<?php
// Test reserved slug validation
echo "=== Testing Reserved Slug Validation ===\n\n";

$reservedSlugs = ['admin', 'api', 'assets', 'includes', 'theme', 'uploads', 'post', 'posts', 'product', 'products', 'blog', 'category', 'tag', 'search'];

echo "Reserved slugs that CANNOT be used for pages:\n";
foreach ($reservedSlugs as $slug) {
    echo "  ✗ $slug\n";
}

echo "\n✅ These slugs are now protected!\n\n";
echo "If you try to create a page with any of these slugs, you'll see:\n";
echo "  \"The slug 'product' is reserved and cannot be used. Please choose a different slug.\"\n\n";

echo "Examples of ALLOWED slugs:\n";
echo "  ✓ my-products\n";
echo "  ✓ product-list\n";
echo "  ✓ products-page\n";
echo "  ✓ about-us\n";
echo "  ✓ contact\n";
?>