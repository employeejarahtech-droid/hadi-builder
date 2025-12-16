<?php
// includes/db.php

function getDBConnection()
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    // Reuse the loadEnv function logic or assume it is available if included context allows,
    // but for a standalone include, it's safer to have the parsing logic or include a config.
    // Let's quickly parse .env again here to be self-contained or use a shared config approach.

    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        die('.env file not found');
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        list($name, $value) = explode('=', $line, 2);
        $env[trim($name)] = trim(trim($value), '"');
    }

    $host = $env['DB_HOST'] ?? '127.0.0.1';
    $db = $env['DB_DATABASE'] ?? 'new_cms';
    $user = $env['DB_USERNAME'] ?? 'root';
    $pass = $env['DB_PASSWORD'] ?? '';
    $port = $env['DB_PORT'] ?? '3306';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (\PDOException $e) {
        // If the database doesn't exist, we might catch it here. 
        // For logic flow, we re-throw or handle.
        throw new \PDOException($e->getMessage(), (int) $e->getCode());
    }
}
