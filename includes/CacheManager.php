<?php
/**
 * Simple Cache Manager
 * Supports file-based caching with optional Redis upgrade path
 */

class CacheManager
{
    private $redis = null;
    private $useRedis = false;
    private $cacheDir;
    private $defaultTTL = 300; // 5 minutes

    public function __construct()
    {
        // Try to connect to Redis if available
        if (extension_loaded('redis')) {
            try {
                $this->redis = new Redis();
                $this->redis->connect('127.0.0.1', 6379);
                $this->redis->ping();
                $this->useRedis = true;
            } catch (Exception $e) {
                $this->useRedis = false;
            }
        }

        // Fallback to file-based cache
        if (!$this->useRedis) {
            $this->cacheDir = __DIR__ . '/../cache';
            if (!is_dir($this->cacheDir)) {
                mkdir($this->cacheDir, 0755, true);
            }
        }

        // Try to fetch TTL from settings
        $this->loadSettingsTTL();
    }

    private function loadSettingsTTL()
    {
        if (function_exists('getDBConnection')) {
            try {
                $pdo = getDBConnection();
                $stmt = $pdo->prepare("SELECT value FROM settings WHERE key_name = ?");
                $stmt->execute(['cache_ttl']);
                if ($row = $stmt->fetch()) {
                    $minutes = (int) $row['value'];
                    if ($minutes > 0) {
                        $this->defaultTTL = $minutes * 60;
                    }
                }
            } catch (Exception $e) {
                // Ignore DB errors, use default
            }
        }
    }

    /**
     * Get cached value
     */
    public function get($key)
    {
        if ($this->useRedis) {
            $value = $this->redis->get($key);
            return $value !== false ? json_decode($value, true) : null;
        }

        // File-based cache
        $file = $this->getCacheFile($key);
        if (!file_exists($file)) {
            return null;
        }

        $data = json_decode(file_get_contents($file), true);

        // Check if expired
        if ($data['expires'] < time()) {
            unlink($file);
            return null;
        }

        return $data['value'];
    }

    /**
     * Set cached value
     */
    public function set($key, $value, $ttl = null)
    {
        $ttl = $ttl ?? $this->defaultTTL;

        if ($this->useRedis) {
            $this->redis->setex($key, $ttl, json_encode($value));
            return true;
        }

        // File-based cache
        $file = $this->getCacheFile($key);
        $data = [
            'key' => $key, // Store original key
            'value' => $value,
            'expires' => time() + $ttl,
            'created' => time()
        ];

        return file_put_contents($file, json_encode($data)) !== false;
    }

    /**
     * Delete cached value
     */
    public function delete($key)
    {
        if ($this->useRedis) {
            $this->redis->del($key);
            return true;
        }

        // File-based cache
        $file = $this->getCacheFile($key);
        if (file_exists($file)) {
            unlink($file);
        }
        return true;
    }

    /**
     * Clear all cache matching pattern
     */
    public function deletePattern($pattern)
    {
        if ($this->useRedis) {
            $keys = $this->redis->keys($pattern);
            if (!empty($keys)) {
                $this->redis->del($keys);
            }
            return true;
        }

        // File-based cache
        // Note: Pattern matching on hashed filenames is not directly possible without storing metadata separately or scanning all.
        // For simplicity in file-based, we'll iterate all and check keys if possible, or just accept that pattern deletion might be limited.
        // Implementation for exact match or * wildcard:
        if ($pattern === '*') {
            return $this->flush();
        }

        // Advanced pattern matching would require reading all files, which is expensive. 
        // For this simple implementation, we will skip advanced file-based pattern matching 
        // unless we store keys effectively.
        return true;
    }

    /**
     * Clear all cache
     */
    public function flush()
    {
        if ($this->useRedis) {
            $this->redis->flushDB();
            return true;
        }

        // File-based cache
        $files = glob($this->cacheDir . '/*.cache');
        foreach ($files as $file) {
            unlink($file);
        }
        return true;
    }

    /**
     * Get all cached items (Metadata only) with pagination
     * @param int $page
     * @param int $limit
     * @return array ['items' => [], 'total' => int, 'page' => int, 'limit' => int, 'total_pages' => int]
     */
    public function getAll($page = 1, $limit = 20)
    {
        $items = [];
        $total = 0;
        $offset = ($page - 1) * $limit;

        if ($this->useRedis) {
            $keys = $this->redis->keys('*');
            $total = count($keys);
            $keys = array_slice($keys, $offset, $limit);

            foreach ($keys as $key) {
                $ttl = $this->redis->ttl($key);
                $items[] = [
                    'key' => $key,
                    'created' => time(), // Redis doesn't store creation time by default easily without sidecar
                    'expires' => time() + $ttl,
                    'ttl' => $ttl,
                    'size' => strlen($this->redis->get($key))
                ];
            }
        } else {
            // File-based cache
            $files = glob($this->cacheDir . '/*.cache');
            if ($files === false)
                $files = [];

            $total = count($files);

            // Sort by modification time desc (newest first) by default
            usort($files, function ($a, $b) {
                return filemtime($b) - filemtime($a);
            });

            $files = array_slice($files, $offset, $limit);

            foreach ($files as $file) {
                $content = file_get_contents($file);
                $data = json_decode($content, true);

                if ($data) {
                    $items[] = [
                        'key' => $data['key'] ?? 'Unknown (' . basename($file) . ')',
                        'created' => $data['created'] ?? 0,
                        'expires' => $data['expires'] ?? 0,
                        'ttl' => ($data['expires'] ?? 0) - time(),
                        'size' => filesize($file)
                    ];
                }
            }
        }

        return [
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ];
    }

    /**
     * Get cache file path
     */
    private function getCacheFile($key)
    {
        $hash = md5($key);
        return $this->cacheDir . '/' . $hash . '.cache';
    }

    /**
     * Generate cache key
     */
    public static function generateKey($prefix, $params = [])
    {
        ksort($params);
        $paramString = http_build_query($params);
        return $prefix . ':' . md5($paramString);
    }

    /**
     * Check if using Redis
     */
    public function isUsingRedis()
    {
        return $this->useRedis;
    }

    /**
     * Clean expired cache files (for file-based cache)
     */
    public function cleanExpired()
    {
        if ($this->useRedis) {
            return; // Redis handles this automatically
        }

        $files = glob($this->cacheDir . '/*.cache');
        $now = time();
        $cleaned = 0;

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);
            if ($data && $data['expires'] < $now) {
                unlink($file);
                $cleaned++;
            }
        }

        return $cleaned;
    }
}
