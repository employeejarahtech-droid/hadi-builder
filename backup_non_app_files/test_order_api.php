<?php
// Test the orders API endpoint
$testData = [
    'customer_first_name' => 'John',
    'customer_last_name' => 'Doe',
    'customer_email' => 'john@test.com',
    'customer_phone' => '1234567890',
    'customer_address' => '123 Test St',
    'payment_method' => 'cash_on_delivery',
    'shipping' => 10.00,
    'items' => [
        [
            'id' => 1,
            'name' => 'Test Product',
            'price' => 29.99,
            'quantity' => 2
        ]
    ]
];

$ch = curl_init('http://localhost:4000/api/orders/create.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";

$decoded = json_decode($response, true);
if ($decoded) {
    echo "\nDecoded Response:\n";
    print_r($decoded);
} else {
    echo "\nFailed to decode JSON. Raw response:\n";
    echo $response;
}
?>