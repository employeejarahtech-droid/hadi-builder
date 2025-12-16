<?php
// setup_database.php

require_once __DIR__ . '/includes/db.php';

echo "Setting up database...\n";

// Load Env to get connection details for connection without DB name (to create DB if needed)
$envPath = __DIR__ . '/.env';
$lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$env = [];
foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0)
        continue;
    list($name, $value) = explode('=', $line, 2);
    $env[trim($name)] = trim(trim($value), '"');
}

$host = $env['DB_HOST'] ?? '127.0.0.1';
$dbname = $env['DB_DATABASE'] ?? 'new_cms';
$user = $env['DB_USERNAME'] ?? 'root';
$pass = $env['DB_PASSWORD'] ?? '';
$port = $env['DB_PORT'] ?? '3306';

try {
    // Connect without DB name to check/create DB
    $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // Create Database
    echo "Creating database '$dbname' if not exists...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    // Connect to the specific DB
    $pdo->exec("USE `$dbname`");

    // Create Users Table
    echo "Creating 'users' table...\n";
    $sql = "CREATE TABLE IF NOT EXISTS `users` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL UNIQUE,
        `email` VARCHAR(100) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `role` VARCHAR(20) DEFAULT 'admin',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    $pdo->exec($sql);

    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $stmt->execute(['admin']);
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        echo "Creating default admin user...\n";
        // Default credentials: admin / password
        $password = password_hash('password', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute(['admin', 'admin@example.com', $password, 'admin']);
        echo "Admin user created (admin / password).\n";
    } else {
        echo "Admin user already exists.\n";
    }

    echo "Database setup completed successfully!\n";

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage() . "\n");
}
