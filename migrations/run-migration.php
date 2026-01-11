<?php
/**
 * Database Migration Runner
 * Run this file once to add css_file columns to all tables
 */

require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = getDBConnection();

    echo "Starting database migration...\n\n";

    // Read migration SQL
    $sql = file_get_contents(__DIR__ . '/add_css_file_columns.sql');

    // Split into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function ($stmt) {
            return !empty($stmt) && strpos($stmt, '--') !== 0;
        }
    );

    $successCount = 0;
    $errorCount = 0;

    foreach ($statements as $statement) {
        // Skip comments
        if (strpos(trim($statement), '--') === 0) {
            continue;
        }

        try {
            $pdo->exec($statement);
            $successCount++;
            echo "✓ Executed: " . substr($statement, 0, 60) . "...\n";
        } catch (PDOException $e) {
            // Check if column already exists
            if (strpos($e->getMessage(), 'Duplicate column') !== false) {
                echo "⊘ Skipped (already exists): " . substr($statement, 0, 60) . "...\n";
            } else {
                $errorCount++;
                echo "✗ Error: " . $e->getMessage() . "\n";
                echo "  Statement: " . substr($statement, 0, 60) . "...\n";
            }
        }
    }

    echo "\n";
    echo "Migration complete!\n";
    echo "Successful: $successCount\n";
    echo "Errors: $errorCount\n";

} catch (Exception $e) {
    echo "Fatal error: " . $e->getMessage() . "\n";
    exit(1);
}
