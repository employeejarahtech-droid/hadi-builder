<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/CacheManager.php';
$cache = new CacheManager();

// Handle Actions
$message = '';
$error = '';

if (isset($_GET['action'])) {
    if ($_GET['action'] === 'delete' && isset($_GET['key'])) {
        $key = $_GET['key'];
        if ($cache->delete($key)) {
            $message = "Cache deleted for key: " . htmlspecialchars($key);
        } else {
            $error = "Failed to delete cache for key: " . htmlspecialchars($key);
        }
    }

    if ($_GET['action'] === 'clear_all') {
        if ($cache->flush()) {
            $message = "All cache cleared successfully";
        } else {
            $error = "Failed to clear cache";
        }
    }

    if ($_GET['action'] === 'get_details' && isset($_GET['key'])) {
        $key = $_GET['key'];
        $value = $cache->get($key);
        header('Content-Type: application/json');
        echo json_encode(['key' => $key, 'value' => $value]);
        exit;
    }
}

// Pagination
$page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
$limit = 20;

// Get cache items
$result = $cache->getAll($page, $limit);
$items = $result['items'];
$total = $result['total'];
$totalPages = $result['total_pages'];

$pageTitle = 'Cache Management';
$currentPage = 'cache_manager';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <h1 class="page-title">Cache Manager</h1>
        <a href="?action=clear_all" class="btn btn-danger"
            onclick="return confirm('Are you sure you want to clear ALL cache?');">
            <i class="fa fa-trash"></i> Clear All Cache
        </a>
    </div>
</div>

<div class="content-wrapper">
    <?php if ($message): ?>
        <div style="background: #dcfce7; color: #166534; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
            <?php echo htmlspecialchars($message); ?>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>

    <div class="card">
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Created</th>
                        <th>Expires</th>
                        <th>Status</th>
                        <th>Size</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($items)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 2rem; color: var(--secondary);">
                                No cached items found.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($items as $item):
                            $isExpired = $item['expires'] < time();
                            $statusClass = $isExpired ? 'bg-danger' : 'bg-success';
                            $statusText = $isExpired ? 'Expired' : 'Valid';
                            ?>
                            <tr>
                                <td style="font-family: monospace; font-size: 0.9em;">
                                    <?php echo htmlspecialchars($item['key']); ?>
                                </td>
                                <td>
                                    <?php echo date('Y-m-d H:i:s', $item['created']); ?>
                                </td>
                                <td>
                                    <?php echo date('Y-m-d H:i:s', $item['expires']); ?>
                                </td>
                                <td>
                                    <span
                                        style="padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; color: white; background-color: <?php echo $isExpired ? '#ef4444' : '#22c55e'; ?>">
                                        <?php echo $statusText; ?>
                                    </span>
                                </td>
                                <td>
                                    <?php echo round($item['size'] / 1024, 2); ?> KB
                                </td>
                                <td style="text-align: right;">
                                    <button class="btn btn-sm btn-secondary" style="padding: 0.25rem 0.5rem; margin-right: 5px;"
                                        onclick="viewCacheDetails('<?php echo urlencode($item['key']); ?>')">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                    <a href="?action=delete&key=<?php echo urlencode($item['key']); ?>"
                                        class="btn btn-sm btn-danger" style="padding: 0.25rem 0.5rem;"
                                        onclick="return confirm('Delete this cache item?');">
                                        <i class="fa fa-trash"></i>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <?php if ($totalPages > 1): ?>
            <div class="pagination" style="margin-top: 1rem; display: flex; justify-content: center; gap: 0.5rem;">
                <?php if ($page > 1): ?>
                    <a href="?page=<?php echo $page - 1; ?>" class="btn btn-sm btn-secondary">&laquo; Prev</a>
                <?php endif; ?>

                <?php
                $start = max(1, $page - 2);
                $end = min($totalPages, $page + 2);

                if ($start > 1) {
                    echo '<span style="padding: 0.5rem;">...</span>';
                }

                for ($i = $start; $i <= $end; $i++):
                    $activeStyle = ($i === $page) ? 'background-color: var(--primary); color: white;' : 'background-color: #f1f5f9; color: var(--text);';
                    ?>
                    <a href="?page=<?php echo $i; ?>" class="btn btn-sm" style="<?php echo $activeStyle; ?> border: none;">
                        <?php echo $i; ?>
                    </a>
                <?php endfor; ?>

                <?php
                if ($end < $totalPages) {
                    echo '<span style="padding: 0.5rem;">...</span>';
                }
                ?>

                <?php if ($page < $totalPages): ?>
                    <a href="?page=<?php echo $page + 1; ?>" class="btn btn-sm btn-secondary">Next &raquo;</a>
                <?php endif; ?>
            </div>
            <div style="text-align: center; margin-top: 0.5rem; color: var(--secondary); font-size: 0.85rem;">
                Showing <?php echo count($items); ?> of <?php echo $total; ?> items (Page <?php echo $page; ?> of
                <?php echo $totalPages; ?>)
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- Cache Details Modal -->
<div id="cacheModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Cache Details</h2>
            <span class="close" onclick="closeModal()">&times;</span>
        </div>
        <div class="modal-body">
            <pre id="modalContent"></pre>
        </div>
    </div>
</div>

<style>
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
        padding: 1rem;
        border-bottom: 1px solid var(--border);
        text-align: left;
    }

    .data-table th {
        background-color: #f8fafc;
        font-weight: 600;
        color: var(--secondary);
    }

    /* Modal Styles */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
        background-color: #fefefe;
        margin: 10% auto;
        padding: 0;
        border: 1px solid #888;
        width: 80%;
        max-width: 800px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
        padding: 1rem;
        background-color: #f8fafc;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
    }

    .close {
        color: #aaa;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }

    .modal-body {
        padding: 1rem;
        max-height: 60vh;
        overflow-y: auto;
    }

    #modalContent {
        background: #f1f5f9;
        padding: 1rem;
        border-radius: 4px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>

<script>
    function viewCacheDetails(encodedKey) {
        const key = decodeURIComponent(encodedKey);
        document.getElementById('modalTitle').textContent = 'Loading...';
        document.getElementById('modalContent').textContent = 'Fetching cache data...';
        document.getElementById('cacheModal').style.display = 'block';

        fetch('?action=get_details&key=' + encodeURIComponent(key))
            .then(response => response.json())
            .then(data => {
                document.getElementById('modalTitle').textContent = 'Cache: ' + data.key;
                document.getElementById('modalContent').textContent = JSON.stringify(data.value, null, 2);
            })
            .catch(error => {
                document.getElementById('modalContent').textContent = 'Error loading cache details.';
                console.error('Error:', error);
            });
    }

    function closeModal() {
        document.getElementById('cacheModal').style.display = 'none';
    }

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        var modal = document.getElementById('cacheModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>