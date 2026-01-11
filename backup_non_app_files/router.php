<?php
// Router for PHP built-in server
// Usage: php -S localhost:4000 router.php

$root = __DIR__;
$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// If file exists, serve it
if ($root . $uri !== $root && file_exists($root . $uri)) {
    return false;
}

// Product Routes - Delegate to product/index.php ONLY for sub-paths (single product)
// /product/something -> product/index.php
// /product -> index.php (handled by fallback)
if (preg_match('/^\/product\/.+$/', $uri)) {
    // If it's a file request (e.g. css/js inside product dir - unlikely but possible), serve it
    if (file_exists(__DIR__ . $uri) && is_file(__DIR__ . $uri) && pathinfo($uri, PATHINFO_EXTENSION) !== 'php') {
        return false;
    }
    // Otherwise serve the product index
    require __DIR__ . '/product/index.php';
    exit;
}

// Blog Routes
if (preg_match('/^\/blog(\/.*)?$/', $uri)) {
    if (file_exists(__DIR__ . $uri) && is_file(__DIR__ . $uri) && pathinfo($uri, PATHINFO_EXTENSION) !== 'php') {
        return false;
    }
    require __DIR__ . '/blog/index.php';
    exit;
}

// Shop Routes
if (preg_match('/^\/shop(\/.*)?$/', $uri)) {
    if (file_exists(__DIR__ . $uri) && is_file(__DIR__ . $uri) && pathinfo($uri, PATHINFO_EXTENSION) !== 'php') {
        return false;
    }
    require __DIR__ . '/shop/index.php';
    exit;
}

// Serve index.php for everything else (SPA-like routing)
require 'index.php';
?>