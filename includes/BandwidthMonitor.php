<?php

class BandwidthMonitor
{
    private static $isActive = false;

    public static function start()
    {
        if (self::$isActive) {
            return;
        }

        self::$isActive = true;

        // Ensure table exists (Lazy initialization)
        self::ensureTableExists();

        // Start output buffering with a callback to measure size
        ob_start([self::class, 'measureOutput']);

        // Register shutdown function to record data
        // We calculate size in measureOutput, but we need to ensure the recorded data is saved.
        // Actually, ob_start callback is called when buffer is flushed (which happens at script end).
        // BUT, we need to save to DB. The callback cannot easily do DB ops if connection is closed.
        // Ideally, we calculate size in the callback, and use a shutdown function that runs AFTER the buffer flush 
        // but BEFORE DB connection closes? 
        // Wait, output buffering callback is called when `ob_end_flush` or script ends.

        // Better approach:
        // Use `ob_start` to strictly capture the content length.
        // We will just let the buffer pass through, but count the bytes.
    }

    public static function measureOutput($buffer)
    {
        $size = strlen($buffer);

        // We can try to record within the callback if the DB connection is still alive.
        // Note: Exceptions thrown in ob_start callback can be fatal. We must catch them.
        try {
            self::recordUsage($size);
        } catch (Throwable $e) {
            // Silently fail to avoid breaking the site
        }

        return $buffer;
    }

    private static function ensureTableExists()
    {
        // We use the global PDO instance if available, or get a new one.
        // Since this file is included in db.php, getDBConnection should be available.
        try {
            $pdo = getDBConnection();
            $pdo->exec("CREATE TABLE IF NOT EXISTS bandwidth_usage (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE UNIQUE NOT NULL,
                bytes BIGINT UNSIGNED DEFAULT 0,
                hits INT UNSIGNED DEFAULT 0
            )");
        } catch (Exception $e) {
            // Log error or ignore
        }
    }

    private static function recordUsage($bytes)
    {
        if ($bytes <= 0)
            return;

        $pdo = getDBConnection();
        $date = date('Y-m-d');

        // Upsert: Insert or Update
        $stmt = $pdo->prepare("INSERT INTO bandwidth_usage (date, bytes, hits) VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE bytes = bytes + VALUES(bytes), hits = hits + 1");
        $stmt->execute([$date, $bytes]);
    }
}
