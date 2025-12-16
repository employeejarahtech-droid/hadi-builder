<?php
if (!defined('base_url')) {
    // Fallback if not defined
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];

    // Get the directory of the current script
    $scriptDir = dirname($_SERVER['SCRIPT_NAME']);

    // Normalize slashes
    $scriptDir = str_replace('\\', '/', $scriptDir);

    // Remove /admin/* from the end to get base root
    $path = preg_replace('#/admin.*$#', '', $scriptDir);

    define('base_url', $protocol . "://" . $host . $path);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' - ' : ''; ?>Admin Dashboard</title>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/admin.css">
    <link rel="stylesheet" href="<?php echo base_url; ?>/assets/css/toast.css">
    <script src="<?php echo base_url; ?>/assets/core/Toast.js"></script>
    <style>
        :root {
            --primary: #3b82f6;
            --primary-dark: #2563eb;
            --secondary: #64748b;
            --bg: #f1f5f9;
            --card-bg: #ffffff;
            --text-main: #1e293b;
            --text-muted: #94a3b8;
            --border: #e2e8f0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            margin: 0;
            padding: 0;
            color: var(--text-main);
            display: flex;
            min-height: 100vh;
        }

        .sidebar {
            width: 250px;
            background: #1e293b;
            /* Dark sidebar */
            color: #fff;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
        }

        .sidebar-header {
            padding: 1.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            border-bottom: 1px solid #334155;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .sidebar-header a {
            color: #fff;
            text-decoration: none;
        }

        .sidebar-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
        }

        .sidebar-menu li a {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            color: #cbd5e1;
            text-decoration: none;
            transition: all 0.2s;
            border-left: 3px solid transparent;
        }

        .sidebar-menu li a:hover,
        .sidebar-menu li a.active {
            background: #334155;
            color: #fff;
            border-left-color: var(--primary);
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .top-header {
            background: #fff;
            padding: 1rem 2rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .page-header {
            padding: 2rem;
            padding-bottom: 0;
        }

        .page-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }

        .content-wrapper {
            padding: 2rem;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: 1px solid transparent;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
        }

        .btn-primary {
            background: var(--primary);
            color: #fff;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        .btn-danger {
            background: #ef4444;
            color: #fff;
        }

        .btn-danger:hover {
            background: #dc2626;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .table th,
        .table td {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .table th {
            background: #f8fafc;
            font-weight: 600;
            color: var(--secondary);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .table tr:last-child td {
            border-bottom: none;
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }

        .badge-success {
            background: #dcfce7;
            color: #166534;
        }

        .badge-warning {
            background: #fef9c3;
            color: #854d0e;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-input {
            width: 100%;
            padding: 0.625rem;
            border: 1px solid var(--border);
            border-radius: 6px;
            box-sizing: border-box;
        }

        .card {
            background: #fff;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
    </style>
</head>

<body>
    <aside class="sidebar">
        <div class="sidebar-header">
            <i class="fa fa-cube" style="color: var(--primary);"></i>
            <a href="<?php echo base_url; ?>/admin/">CMS Admin</a>
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="<?php echo base_url; ?>/admin/"
                    class="<?php echo ($currentPage == 'dashboard') ? 'active' : ''; ?>">
                    <i class="fa fa-home"></i> Dashboard
                </a>
            </li>
            <li>
                <a href="<?php echo base_url; ?>/admin/pages/"
                    class="<?php echo ($currentPage == 'pages') ? 'active' : ''; ?>">
                    <i class="fa fa-file-alt"></i> Pages
                </a>
            </li>
            <li>
                <a href="<?php echo base_url; ?>/admin/posts/"
                    class="<?php echo ($currentPage == 'posts') ? 'active' : ''; ?>">
                    <i class="fa fa-newspaper"></i> Posts
                </a>
            </li>
            <li>
                <a href="<?php echo base_url; ?>/admin/headers/"
                    class="<?php echo ($currentPage == 'headers') ? 'active' : ''; ?>">
                    <i class="fa fa-heading"></i> Headers
                </a>
            </li>
            <li>
                <a href="<?php echo base_url; ?>/admin/footers/"
                    class="<?php echo ($currentPage == 'footers') ? 'active' : ''; ?>">
                    <i class="fa fa-shoe-prints"></i> Footers
                </a>
            </li>
            <li>
                <a href="<?php echo base_url; ?>/admin/settings/"
                    class="<?php echo ($currentPage == 'settings') ? 'active' : ''; ?>">
                    <i class="fa fa-cog"></i> Settings
                </a>
            </li>
        </ul>
    </aside>

    <div class="main-content">
        <header class="top-header">
            <div></div> <!-- Spacer -->
            <div class="user-menu">
                <span style="margin-right: 15px; color: var(--secondary); font-size: 0.875rem;">
                    <i class="fa fa-user-circle"></i> Auth User
                </span>
                <a href="<?php echo base_url; ?>/admin/?action=logout" class="btn btn-danger"
                    style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">
                    Logout
                </a>
            </div>
        </header>