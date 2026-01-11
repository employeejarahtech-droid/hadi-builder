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
    $count_stmt = $pdo->query("SELECT COUNT(*) FROM footers");
    $total_items = $count_stmt->fetchColumn();
    $total_pages = ceil($total_items / $items_per_page);
    
    // Fetch footers with pagination
    $stmt = $pdo->prepare("SELECT * FROM footers ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $footers = $stmt->fetchAll();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$currentPage = 'footers';
$pageTitle = 'Manage Footers';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="page-title">Footers</h1>
        <a href="create.php" class="btn btn-primary">
            <i class="fa fa-plus"></i> Create New Footer
        </a>
    </div>
</div>

<div class="content-wrapper">
    <?php if (count($footers) > 0): ?>
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 50px;">Def.</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($footers as $footer): ?>
                    <tr>
                        <td style="text-align: center;">
                            <input type="radio" name="default_footer" 
                                   value="<?php echo $footer['id']; ?>" 
                                   <?php echo (isset($footer['is_default']) && $footer['is_default']) ? 'checked' : ''; ?>
                                   onchange="setDefault(<?php echo $footer['id']; ?>)">
                        </td>
                        <td>
                            <input type="text" 
                                   class="form-input footer-title-input" 
                                   data-id="<?php echo $footer['id']; ?>"
                                   value="<?php echo htmlspecialchars($footer['title']); ?>"
                                   onblur="updateTitle(this, <?php echo $footer['id']; ?>)"
                                   onkeypress="if(event.key === 'Enter') this.blur();">
                        </td>
                        <td>
                            <a href="<?php echo base_url . '/' . htmlspecialchars($footer['slug']); ?>" target="_blank"
                                style="color: var(--primary); text-decoration: none;">
                                /<?php echo htmlspecialchars($footer['slug']); ?> <i class="fa fa-external-link-alt"
                                    style="font-size: 0.75em;"></i>
                            </a>
                        </td>
                        <td>
                            <span
                                class="badge <?php echo $footer['status'] === 'published' ? 'badge-success' : 'badge-warning'; ?>">
                                <?php echo ucfirst($footer['status']); ?>
                            </span>
                        </td>
                        <td><?php echo date('M d, Y', strtotime($footer['updated_at'])); ?></td>
                        <td style="text-align: right;">
                            <button class="btn toggle-status-btn" 
                                    data-id="<?php echo $footer['id']; ?>" 
                                    data-status="<?php echo $footer['status']; ?>"
                                    style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: <?php echo $footer['status'] === 'published' ? '#f59e0b' : '#10b981'; ?>; color: white; border: none; cursor: pointer; border-radius: 4px;">
                                <i class="fa <?php echo $footer['status'] === 'published' ? 'fa-eye-slash' : 'fa-eye'; ?>"></i>
                                <?php echo $footer['status'] === 'published' ? 'Unpublish' : 'Publish'; ?>
                            </button>
                            <a href="../builder.php?type=footer&id=<?php echo $footer['id']; ?>" class="btn btn-primary"
                                style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                <i class="fa fa-edit"></i> Edit
                            </a>
                            <a href="delete.php?id=<?php echo $footer['id']; ?>" class="btn btn-danger"
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
                    <?php echo $total_items; ?> footers
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
            alert(message);
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
                showToast('Default footer updated', 'success');
            } else {
                showToast(data.error || 'Error updating status', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Connection error', 'error');
        });
    }

    function updateTitle(input, id) {
        const title = input.value.trim();
        if (!title) {
            showToast('Title cannot be empty', 'error');
            return;
        }

        fetch('update_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                action: 'update_title',
                value: title
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Title updated', 'success');
            } else {
                showToast(data.error || 'Error updating title', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Connection error', 'error');
        });
    }

    // Toggle status handler
    $('.toggle-status-btn').on('click', function() {
        const btn = $(this);
        const footerId = btn.data('id');
        const currentStatus = btn.data('status');
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        
        btn.prop('disabled', true).text('Updating...');
        
        $.ajax({
            url: 'update_status.php',
            method: 'POST',
            data: {
                id: footerId,
                status: newStatus
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Update button
                    btn.data('status', newStatus);
                    btn.css('background', newStatus === 'published' ? '#f59e0b' : '#10b981');
                    btn.html('<i class="fa ' + (newStatus === 'published' ? 'fa-eye-slash' : 'fa-eye') + '"></i> ' + 
                             (newStatus === 'published' ? 'Unpublish' : 'Publish'));
                    
                    // Update status badge
                    const badge = btn.closest('tr').find('.badge');
                    badge.removeClass('badge-success badge-warning')
                         .addClass(newStatus === 'published' ? 'badge-success' : 'badge-warning')
                         .text(newStatus.charAt(0).toUpperCase() + newStatus.slice(1));
                    
                    showToast('Status updated successfully', 'success');
                } else {
                    showToast(response.message || 'Error updating status', 'error');
                }
            },
            error: function() {
                showToast('Connection error', 'error');
            },
            complete: function() {
                btn.prop('disabled', false);
            }
        });
    });
    </script>
    <?php else: ?>
        <div class="card" style="text-align: center; padding: 3rem;">
            <i class="fa fa-file-alt" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
            <h3>No footers found</h3>
            <p style="color: var(--secondary); margin-bottom: 1.5rem;">Get started by creating your first footer.</p>
            <a href="create.php" class="btn btn-primary">Create Footer</a>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>