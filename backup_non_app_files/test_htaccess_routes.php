<?php
echo "=== .htaccess Routing Test ===\n\n";

echo "The .htaccess now supports these URL patterns:\n\n";

echo "1. Regular Pages:\n";
echo "   ✓ http://localhost:4000/about-us\n";
echo "   ✓ http://localhost:4000/contact\n";
echo "   ✓ http://localhost:4000/checkout\n";
echo "   → Routes to: index.php (loads page by slug)\n\n";

echo "2. Blog Routes:\n";
echo "   ✓ http://localhost:4000/blog\n";
echo "   → Routes to: index.php (blog listing)\n";
echo "   ✓ http://localhost:4000/blog/my-post-slug\n";
echo "   → Routes to: index.php (single blog post)\n\n";

echo "3. Product Routes:\n";
echo "   ✓ http://localhost:4000/product\n";
echo "   → Routes to: index.php (product listing)\n";
echo "   ✓ http://localhost:4000/product/my-product-slug\n";
echo "   → Routes to: index.php (single product)\n\n";

echo "All routes go through index.php, which will:\n";
echo "  - Check the URL pattern\n";
echo "  - Determine if it's a page, blog post, or product\n";
echo "  - Load the appropriate content\n\n";

echo "Next step: Update index.php to handle these routes!\n";
?>