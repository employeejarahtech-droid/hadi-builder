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
        $files = glob($this->cacheDir . '/' . str_replace('*', '*', $pattern) . '.cache');
        foreach ($files as $file) {
            if (file_exists($file)) {
                unlink($file);
            }
        }
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
