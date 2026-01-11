<?php
// Simulate actual POST request to login
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/admin/login.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'username' => 'maksud',
    'password' => 'maksud'
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_COOKIEJAR, __DIR__ . '/cookie.txt');
curl_setopt($ch, CURLOPT_COOKIEFILE, __DIR__ . '/cookie.txt');

echo "=== Simulating Browser Login ===\n";
echo "Sending POST to: http://localhost:8000/admin/login.php\n";
echo "Username: maksud\n";
echo "Password: maksud\n\n";

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

echo "HTTP Status Code: $httpCode\n";
echo "\nResponse Headers:\n";
echo $headers . "\n";

if ($httpCode == 302) {
    echo "✓ Login successful! (302 redirect)\n";

    // Check redirect location
    if (preg_match('/Location: (.+)/', $headers, $matches)) {
        echo "Redirect to: " . trim($matches[1]) . "\n";
    }
} else {
    echo "✗ Login failed or no redirect\n";
    echo "\nResponse Body:\n";
    echo substr($body, 0, 500) . "...\n";

    // Check for error message
    if (preg_match('/error-msg[^>]*>([^<]+)</', $body, $matches)) {
        echo "\nError Message Found: " . $matches[1] . "\n";
    }
}

curl_close($ch);

// Clean up cookie file
if (file_exists(__DIR__ . '/cookie.txt')) {
    unlink(__DIR__ . '/cookie.txt');
}
