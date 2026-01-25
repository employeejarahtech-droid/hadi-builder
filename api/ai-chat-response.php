<?php
// Ensure no output before this point
error_reporting(0);
ob_start();

require_once __DIR__ . '/../includes/db.php';

// Clean buffer before sending JSON headers
if (ob_get_length())
    ob_clean();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ===== AI MODEL CLASS =====
class SimpleAI
{
    private $websiteData = [];
    private $stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by'];

    public function __construct($pdo)
    {
        $this->loadWebsiteData($pdo);
    }

    // Load ALL website data into memory
    private function loadWebsiteData($pdo)
    {
        try {
            // Create ai_reply_messages table if it doesn't exist
            $pdo->exec("CREATE TABLE IF NOT EXISTS ai_reply_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                keyword VARCHAR(255) NOT NULL,
                reply_message TEXT NOT NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_keyword (keyword),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // Load Projects
            $stmt = $pdo->query("SELECT id, title, slug, description, 'project' as type FROM projects WHERE status = 'published'");
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
            // Load Products with ALL available fields (handle missing columns gracefully)
            try {
                $stmt = $pdo->query("
                    SELECT 
                        id, 
                        name as title, 
                        slug, 
                        description,
                        price,
                        COALESCE(original_price, 0) as original_price,
                        COALESCE(image_url, '') as image_url,
                        COALESCE(gallery_images, '') as gallery_images,
                        COALESCE(stock_quantity, 0) as stock_quantity,
                        COALESCE(rating, 0) as rating,
                        COALESCE(sku, '') as sku,
                        'product' as type 
                    FROM products 
                    WHERE status = 'active'
                ");
                $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) {
                // Fallback if columns don't exist
                $stmt = $pdo->query("SELECT id, name as title, slug, description, price, 'product' as type FROM products WHERE status = 'active'");
                $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            // Load AI Reply Messages
            $stmt = $pdo->query("SELECT id, keyword as title, '' as slug, reply_message as description, 'ai_message' as type FROM ai_reply_messages WHERE status = 'active'");
            $aiMessages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Merge all data
            $this->websiteData = array_merge($projects, $products, $aiMessages);

            // Preprocess text for each item
            foreach ($this->websiteData as &$item) {
                $item['searchable_text'] = $this->preprocessText($item['title'] . ' ' . ($item['description'] ?? ''));
                $item['tokens'] = $this->tokenize($item['searchable_text']);
            }

        } catch (Exception $e) {
            error_log("AI Model: Failed to load data - " . $e->getMessage());
        }
    }

    // Preprocess text: lowercase, remove special chars
    private function preprocessText($text)
    {
        $text = strtolower($text);
        $text = preg_replace('/[^a-z0-9\s]/', ' ', $text);
        $text = preg_replace('/\s+/', ' ', $text);
        return trim($text);
    }

    // Tokenize text into words
    private function tokenize($text)
    {
        $words = explode(' ', $text);
        // Remove stop words
        $words = array_filter($words, function ($word) {
            return !in_array($word, $this->stopWords) && strlen($word) > 2;
        });
        return array_values($words);
    }

    // Calculate similarity score between query and content
    private function calculateSimilarity($queryTokens, $contentTokens)
    {
        if (empty($queryTokens) || empty($contentTokens))
            return 0;

        $intersection = array_intersect($queryTokens, $contentTokens);
        $union = array_unique(array_merge($queryTokens, $contentTokens));

        // Jaccard similarity
        $jaccardScore = count($intersection) / count($union);

        // Bonus for exact phrase matches in title
        $bonusScore = 0;
        foreach ($queryTokens as $token) {
            if (in_array($token, $contentTokens)) {
                $bonusScore += 0.1;
            }
        }

        return $jaccardScore + $bonusScore;
    }

    // Find best matching content
    public function search($query)
    {
        $processedQuery = $this->preprocessText($query);
        $queryTokens = $this->tokenize($processedQuery);

        if (empty($queryTokens)) {
            return [];
        }

        $results = [];

        foreach ($this->websiteData as $item) {
            $score = $this->calculateSimilarity($queryTokens, $item['tokens']);

            if ($score > 0.1) { // Minimum threshold
                $results[] = [
                    'item' => $item,
                    'score' => $score
                ];
            }
        }

        // Sort by score descending
        usort($results, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        return array_slice($results, 0, 5); // Top 5 results
    }

    // Generate intelligent response
    public function generateResponse($query, $searchResults)
    {
        $processedQuery = strtolower($query);

        // Check if query contains an ID (format: "id:123" or "#123")
        if (preg_match('/(?:id:|#)(\d+)/i', $query, $matches)) {
            $itemId = (int)$matches[1];
            error_log("AI: Direct ID request detected: " . $itemId);
            
            // Find item by ID
            foreach ($this->websiteData as $item) {
                if ($item['id'] == $itemId) {
                    error_log("AI: Found item by ID: " . $item['title']);
                    return $this->generateDetailedResponse($item);
                }
            }
        }

        // Detect if user is asking for details about a specific item
        $isDetailRequest = preg_match('/\b(tell me (more )?about|show me|details|info(rmation)? about)\b/i', $query);
        
        // If detail request, try to find the best match
        if ($isDetailRequest && !empty($searchResults)) {
            $topResult = $searchResults[0];
            
            // Check if it's a strong match (score > 0.3) or if there's only 1 result
            if ($topResult['score'] > 0.3 || count($searchResults) == 1) {
                $item = $topResult['item'];
                error_log("AI: Generating detailed response for: " . $item['title'] . " (type: " . $item['type'] . ", score: " . $topResult['score'] . ")");
                return $this->generateDetailedResponse($item);
            }
        }

        // Detect intent
        $isGreeting = preg_match('/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i', $query);
        $isHelp = preg_match('/\b(help|assist|support|guide|what can you|how can you)\b/i', $query);
        $isQuestion = preg_match('/\b(what|where|when|why|how|who|which)\b/i', $query);

        // Handle greetings
        if ($isGreeting && empty($searchResults)) {
            return [
                'response' => "Hello! 👋 I'm your AI assistant. I have access to all our projects and products. How can I help you today?",
                'suggestions' => [
                    "What projects do you have?",
                    "Show me products",
                    "Tell me about your services"
                ],
                'source' => 'greeting'
            ];
        }

        // Handle help requests
        if ($isHelp && empty($searchResults)) {
            return [
                'response' => "I can help you find information about:\n\n• 🏢 Projects and properties\n• �️ Products and pricing\n• � Custom AI responses\n\nJust ask me anything!",
                'suggestions' => [
                    "Show me your projects",
                    "What products do you offer?",
                    "Tell me about your services"
                ],
                'source' => 'help'
            ];
        }

        // Generate response based on search results
        if (!empty($searchResults)) {
            $count = count($searchResults);
            $types = array_unique(array_column(array_column($searchResults, 'item'), 'type'));
            $topResult = $searchResults[0]['item'];

            // Build response
            $response = "I found {$count} relevant result" . ($count > 1 ? 's' : '') . ":\n\n";

            foreach ($searchResults as $index => $result) {
                $item = $result['item'];
                $emoji = $this->getEmojiForType($item['type']);
                $response .= ($index + 1) . ". {$emoji} " . $item['title'] . " (" . ucfirst($item['type']) . ")\n";
            }

            $response .= "\nWould you like to know more about any of these?";

            // Generate suggestions with IDs for precise selection
            $suggestions = [];
            foreach (array_slice($searchResults, 0, 3) as $result) {
                $item = $result['item'];
                // Include ID in suggestion for precise matching
                $suggestions[] = "id:{$item['id']} {$item['title']}";
            }

            return [
                'response' => $response,
                'suggestions' => $suggestions,
                'source' => 'search',
                'result_count' => $count,
                'top_match' => $topResult['title']
            ];
        }

        // No results found
        return [
            'response' => "I couldn't find specific information about that in our database. However, I have access to:\n\n• " . $this->getDataStats() . "\n\nTry asking about our projects or products!",
            'suggestions' => [
                "Show me all projects",
                "Show me products",
                "What can you help me with?"
            ],
            'source' => 'no_results'
        ];
    }

    // Generate detailed response for a specific item
    private function generateDetailedResponse($item)
    {
        $emoji = $this->getEmojiForType($item['type']);
        $type = ucfirst($item['type']);
        
        if ($item['type'] === 'ai_message') {
            // For AI messages, just return the reply
            return [
                'response' => $item['description'],
                'suggestions' => [
                    "What else can you help with?",
                    "Show me projects",
                    "Show me products"
                ],
                'source' => 'ai_message_detail'
            ];
        }
        
        // For products and projects, show detailed info
        $response = "{$emoji} **{$item['title']}**\n\n";
        
        // Product-specific detailed information
        if ($item['type'] === 'product') {
            // Price information
            if (isset($item['price']) && $item['price'] > 0) {
                if (isset($item['original_price']) && $item['original_price'] > $item['price']) {
                    $discount = round((($item['original_price'] - $item['price']) / $item['original_price']) * 100);
                    $response .= "💰 **Price:** \${$item['price']} ~~\${$item['original_price']}~~ ({$discount}% OFF)\n";
                } else {
                    $response .= "💰 **Price:** \${$item['price']}\n";
                }
            }
            
            // Stock information
            if (isset($item['stock_quantity'])) {
                $stockStatus = $item['stock_quantity'] > 0 ? "✅ In Stock ({$item['stock_quantity']} available)" : "❌ Out of Stock";
                $response .= "📦 **Stock:** {$stockStatus}\n";
            }
            
            // Rating
            if (isset($item['rating']) && $item['rating'] > 0) {
                $stars = str_repeat('⭐', floor($item['rating']));
                $response .= "⭐ **Rating:** {$stars} ({$item['rating']}/5)\n";
            }
            
            // SKU
            if (!empty($item['sku'])) {
                $response .= "🏷️ **SKU:** {$item['sku']}\n";
            }
            
            $response .= "\n";
            
            // Description
            if (!empty($item['description'])) {
                $response .= "**Description:**\n{$item['description']}\n\n";
            }
            
            // Image
            if (!empty($item['image_url'])) {
                $response .= "🖼️ **Image:** {$item['image_url']}\n\n";
            }
            
            $response .= "💡 **Interested in this product?**\nContact us for more details or to place an order!";
            
            $suggestions = [
                "Show me more products",
                "Contact information",
                "Add to cart"
            ];
        } 
        // Project-specific information
        else if ($item['type'] === 'project') {
            $response .= "**Type:** {$type}\n\n";
            
            if (!empty($item['description'])) {
                $response .= "**Description:**\n{$item['description']}\n\n";
            }
            
            $response .= "🏗️ **Want to know more about this project?**\nWe'd be happy to provide additional details!";
            
            $suggestions = [
                "Show me more projects",
                "Contact information",
                "What services do you offer?"
            ];
        } 
        else {
            $response .= "**Type:** {$type}\n\n";
            
            if (!empty($item['description'])) {
                $response .= "**Description:**\n{$item['description']}\n\n";
            }
            
            $suggestions = [
                "Show me projects",
                "Show me products",
                "How can you help?"
            ];
        }
        
        return [
            'response' => $response,
            'suggestions' => $suggestions,
            'source' => $item['type'] . '_detail',
            'item_data' => [
                'id' => $item['id'],
                'title' => $item['title'],
                'slug' => $item['slug'],
                'type' => $item['type'],
                'price' => $item['price'] ?? null,
                'image_url' => $item['image_url'] ?? null,
                'stock_quantity' => $item['stock_quantity'] ?? null
            ]
        ];
    }

    private function getEmojiForType($type)
    {
        $emojis = [
            'project' => '🏢',
            'product' => '🛍️',
            'ai_message' => '💬'
        ];
        return $emojis[$type] ?? '📌';
    }

    private function getDataStats()
    {
        $stats = [];
        $types = array_count_values(array_column($this->websiteData, 'type'));

        foreach ($types as $type => $count) {
            $stats[] = "{$count} " . ucfirst($type) . ($count > 1 ? 's' : '');
        }

        return implode(', ', $stats);
    }

    public function getDataCount()
    {
        return count($this->websiteData);
    }
}

// ===== MAIN EXECUTION =====
try {
    $pdo = getDBConnection();

    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validate input
    if (!$data || empty($data['question'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing question']);
        exit;
    }

    $question = trim($data['question']);

    // Initialize AI Model
    $ai = new SimpleAI($pdo);

    // Search for relevant content
    $searchResults = $ai->search($question);

    // Generate intelligent response
    $aiResponse = $ai->generateResponse($question, $searchResults);

    // Success response
    echo json_encode([
        'success' => true,
        'response' => $aiResponse['response'],
        'suggestions' => $aiResponse['suggestions'] ?? [],
        'source' => $aiResponse['source'] ?? 'unknown',
        'metadata' => [
            'total_data_items' => $ai->getDataCount(),
            'results_found' => count($searchResults),
            'top_match' => $aiResponse['top_match'] ?? null,
            'search_scores' => array_map(function ($r) {
                return round($r['score'], 3);
            }, array_slice($searchResults, 0, 3))
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'response' => "I'm experiencing technical difficulties. Please try again later."
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error',
        'response' => "Sorry, something went wrong. Please try again."
    ]);
}
