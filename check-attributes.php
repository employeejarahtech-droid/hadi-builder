<?php
require 'includes/db.php';
$pdo = getDBConnection();

$stmt = $pdo->prepare('SELECT id, name, attributes FROM products WHERE slug = ?');
$stmt->execute(['Product10']);
$p = $stmt->fetch();

if ($p) {
    echo "Product: " . $p['name'] . "\n\n";
    echo "Raw Attributes JSON:\n";
    echo $p['attributes'] . "\n\n";

    $attrs = json_decode($p['attributes'], true);
    if ($attrs) {
        echo "Parsed Attributes:\n";
        foreach ($attrs as $idx => $attr) {
            echo "Attribute #" . ($idx + 1) . ":\n";
            echo "  Name: " . ($attr['name'] ?? 'N/A') . "\n";
            echo "  Value: " . ($attr['value'] ?? 'N/A') . "\n";
            echo "  is_variation: " . (isset($attr['is_variation']) ? ($attr['is_variation'] ? 'TRUE' : 'FALSE') : 'NOT SET') . "\n\n";
        }

        $variationAttrs = array_filter($attrs, function ($a) {
            return isset($a['is_variation']) && ($a['is_variation'] === true || $a['is_variation'] === 'true');
        });

        echo "\nVariation Attributes Count: " . count($variationAttrs) . "\n";
    } else {
        echo "Failed to parse attributes JSON\n";
    }
}
