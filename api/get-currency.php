<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT value FROM settings WHERE key_name = 'currency'");
    $stmt->execute();
    $result = $stmt->fetch();

    require_once __DIR__ . '/../admin/includes/currencies.php';

    $storedValue = $result ? $result['value'] : '$';
    $currency = $storedValue;

    // Check if stored value is a known code in our list
    if (isset($currencies[$storedValue])) {
        $currency = $currencies[$storedValue]['symbol'];
    } elseif (strlen($storedValue) > 3) {
        // Fallback or assuming it might be a symbol if short, 
        // but if it's long and not in list, it might be legacy or custom.
        // For now, if not in list, just return as is (matches old behavior)
    }

    echo json_encode(['success' => true, 'currency' => $currency]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
