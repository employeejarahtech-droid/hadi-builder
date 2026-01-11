<?php
header('Content-Type: application/json');

// Prevent direct access if needed, or allow CORS if used from elsewhere (but this is same-origin usually)
// For simple admin usage, we just proceed.

$query = $_GET['q'] ?? '';

if (empty($query)) {
    echo json_encode(['suggestions' => []]);
    exit;
}

// Google Autocomplete Endpoint
// client=firefox returns standard JSON array: ["query", ["sug1", "sug2"]]
$url = 'http://suggestqueries.google.com/complete/search?client=firefox&q=' . urlencode($query);

// Use curl to fetch
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'); // Fake UA to avoid blocking
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Just in case, though it's http
$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    // Decode Google's response
    $data = json_decode($response, true);

    // Check if valid format
    if (is_array($data) && isset($data[1]) && is_array($data[1])) {
        // Return just the lists
        echo json_encode(['suggestions' => $data[1]]);
    } else {
        echo json_encode(['suggestions' => [], 'error' => 'Invalid response from provider']);
    }
} else {
    echo json_encode(['suggestions' => [], 'error' => 'Failed to fetch suggestions']);
}
