<?php
session_start();

// Ensure auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

try {
    $pdo = getDBConnection();
    
    // Pagination
    $items_per_page = 10;
    $current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $offset = ($current_page - 1) * $items_per_page;
    
    // Get total count
    $count_stmt = $pdo->query("SELECT COUNT(*) FROM topbars");
    $total_items = $count_stmt->fetchColumn();
    $total_pages = ceil($total_items / $items_per_page);
    
    // Fetch topbars with pagination
    $stmt = $pdo->prepare("SELECT * FROM topbars ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $topbars = $stmt->fetchAll();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$currentPage = 'topbars';
$pageTitle = 'Manage Topbars';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem;  ">
        <h1 class="page-title">Topbars</h1>
        <a href="create.php" class="btn btn-primary">
            <i class="fa fa-plus"></i> Create New Topbar
        </a>
    </div>
</div>

<div class="content-wrapper">
    <?php if (count($topbars) > 0): ?>
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 50px;">Def.</th>
                    <th style="width: 50px;">ID</th>
                    <th>Name</th>
                    <th>Last Updated</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($topbars as $topbar): ?>
                    <tr>
                        <td style="text-align: center;">
                            <input type="radio" name="default_topbar" 
                                   value="<?php echo $topbar['id']; ?>" 
                                   <?php echo (isset($topbar['is_default']) && $topbar['is_default']) ? 'checked' : ''; ?>
                                   onchange="setDefault(<?php echo $topbar['id']; ?>)">
                        </td>
                        <td style="text-align: center; color: var(--secondary);">
                            #<?php echo $topbar['id']; ?>
                        </td>
                        <td>
                            <input type="text" 
                                   class="form-input header-title-input" 
                                   data-id="<?php echo $topbar['id']; ?>"
                                   value="<?php echo htmlspecialchars($topbar['name']); ?>"
                                   onblur="updateName(this, <?php echo $topbar['id']; ?>)"
                                   onkeypress="if(event.key === 'Enter') this.blur();">
                        </td>
                        <td><?php echo date('M d, Y', strtotime($topbar['updated_at'])); ?></td>
                        <td style="text-align: right;">
                            <a href="../builder.php?type=topbar&id=<?php echo $topbar['id']; ?>" class="btn btn-primary"
                                style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                <i class="fa fa-edit"></i> Edit
                            </a>
                            <a href="delete.php?id=<?php echo $topbar['id']; ?>" class="btn btn-danger"
                                style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="return confirm('Are you sure?');">
                                <i class="fa fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- Pagination -->
        <?php if ($total_pages > 1): ?>
            <?php
            $pageBaseUrl = '?page=';
            ?>
            <div class="pagination"
                style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding: 1rem; background: white; border-radius: 0 0 8px 8px; border-top: 1px solid #f1f5f9;">
                <div style="font-size: 0.875rem; color: #64748b;">
                    Showing <?php echo $offset + 1; ?> to
                    <?php echo min($offset + $items_per_page, $total_items); ?> of
                    <?php echo $total_items; ?> topbars
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <?php if ($current_page > 1): ?>
                        <a href="<?php echo $pageBaseUrl . ($current_page - 1); ?>" class="btn btn-sm btn-secondary"
                            style="text-decoration: none;">&laquo; Previous</a>
                    <?php endif; ?>

                    <?php
                    $start_page = max(1, $current_page - 2);
                    $end_page = min($total_pages, $current_page + 2);

                    if ($start_page > 1) {
                        echo '<a href="' . $pageBaseUrl . '1" class="btn btn-sm btn-outline" style="text-decoration: none; border: 1px solid #e2e8f0; color: #64748b;">1</a>';
                        if ($start_page > 2) {
                            echo '<span style="color: #64748b; padding: 0 0.5rem;">...</span>';
                        }
                    }

                    for ($i = $start_page; $i <= $end_page; $i++): ?>
                        <a href="<?php echo $pageBaseUrl . $i; ?>" class="btn btn-sm"
                            style="<?php echo $i === $current_page ? 'background: var(--primary); color: white;' : 'background: white; border: 1px solid #e2e8f0; color: #64748b;'; ?> text-decoration: none;">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor;

                    if ($end_page < $total_pages) {
                        if ($end_page < $total_pages - 1) {
                            echo '<span style="color: #64748b; padding: 0 0.5rem;">...</span>';
                        }
                        echo '<a href="' . $pageBaseUrl . $total_pages . '" class="btn btn-sm btn-outline" style="text-decoration: none; border: 1px solid #e2e8f0; color: #64748b;">' . $total_pages . '</a>';
                    }
                    ?>

                    <?php if ($current_page < $total_pages): ?>
                        <a href="<?php echo $pageBaseUrl . ($current_page + 1); ?>" class="btn btn-sm btn-secondary"
                            style="text-decoration: none;">Next &raquo;</a>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

    <script>
    function showToast(message, type = 'info') {
        if (window.Toast) {
            Toast.show(message, type);
        } else {
            // Check if Toast is defined in header/footer, else fallback
            if (window.Toast) Toast.show(message, type);
            else console.log(type.toUpperCase() + ": " + message);
        }
    }

    function setDefault(id) {
        fetch('update_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                action: 'set_default'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if(window.Toast) window.Toast.success('Default topbar updated');
            } else {
                if(window.Toast) window.Toast.error(data.message || 'Error updating status');
                else alert(data.message || 'Error updating status');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if(window.Toast) window.Toast.error('Connection error');
        });
    }

    function updateName(input, id) {
        const name = input.value.trim();
        if (!name) {
            showToast('Name cannot be empty', 'error');
            return;
        }

        fetch('update_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                action: 'update_name',
                value: name
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // showToast('Name updated', 'success'); 
                // Using alert or custom toast if available. 
                // The headers page used showToast but didn't import Toast.js explicitly in the file viewed?
                // It might be in header.php or footer.php. 
                // Let's assume standard alert for now if Toast isn't global, but the code in headers/index.php lines 102-108 handles check.
                if(window.Toast) window.Toast.success('Name updated');
            } else {
                if(window.Toast) window.Toast.error(data.message || 'Error updating name');
                else alert(data.message || 'Error updating name');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if(window.Toast) window.Toast.error('Connection error');
        });
    }
    </script>
    <?php else: ?>
        <div class="card" style="text-align: center; padding: 3rem;">
            <i class="fa fa-layer-group" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
            <h3>No topbars found</h3>
            <p style="color: var(--secondary); margin-bottom: 1.5rem;">Get started by creating your first topbar.</p>
            <a href="create.php" class="btn btn-primary">Create Topbar</a>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>