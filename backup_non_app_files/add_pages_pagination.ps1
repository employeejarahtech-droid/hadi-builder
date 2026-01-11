$file = 'admin\pages\index.php'
$content = Get-Content $file -Raw

# Replace the database query section
$content = $content -replace 'try \{\s+\$pdo = getDBConnection\(\);\s+// Fetch all pages\s+\$stmt = \$pdo->query\("SELECT \* FROM pages ORDER BY created_at DESC"\);\s+\$pages = \$stmt->fetchAll\(\);', @'
// Pagination settings
$items_per_page = 10;
$current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$offset = ($current_page - 1) * $items_per_page;

try {
    $pdo = getDBConnection();
    
    // Get total count
    $count_stmt = $pdo->query("SELECT COUNT(*) FROM pages");
    $total_pages_count = $count_stmt->fetchColumn();
    $total_pages = ceil($total_pages_count / $items_per_page);
    
    // Fetch pages with pagination
    $stmt = $pdo->prepare("SELECT * FROM pages ORDER BY updated_at DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $pages = $stmt->fetchAll();
'@

# Add pagination HTML before the else clause
$paginationHtml = @'

        <?php if ($total_pages > 1): ?>
            <div style="margin-top: 30px; display: flex; justify-content: center; align-items: center; gap: 8px;">
                <?php if ($current_page > 1): ?>
                    <a href="?page=<?php echo $current_page - 1; ?>" class="btn" style="padding: 8px 12px; font-size: 14px;">
                        <i class="fa fa-chevron-left"></i> Previous
                    </a>
                <?php endif; ?>

                <?php
                $start_page = max(1, $current_page - 2);
                $end_page = min($total_pages, $current_page + 2);
                
                if ($start_page > 1): ?>
                    <a href="?page=1" class="btn" style="padding: 8px 12px; font-size: 14px;">1</a>
                    <?php if ($start_page > 2): ?>
                        <span style="padding: 8px;">...</span>
                    <?php endif; ?>
                <?php endif; ?>

                <?php for ($i = $start_page; $i <= $end_page; $i++): ?>
                    <a href="?page=<?php echo $i; ?>" 
                       class="btn <?php echo $i === $current_page ? 'btn-primary' : ''; ?>" 
                       style="padding: 8px 12px; font-size: 14px;">
                        <?php echo $i; ?>
                    </a>
                <?php endfor; ?>

                <?php if ($end_page < $total_pages): ?>
                    <?php if ($end_page < $total_pages - 1): ?>
                        <span style="padding: 8px;">...</span>
                    <?php endif; ?>
                    <a href="?page=<?php echo $total_pages; ?>" class="btn" style="padding: 8px 12px; font-size: 14px;"><?php echo $total_pages; ?></a>
                <?php endif; ?>

                <?php if ($current_page < $total_pages): ?>
                    <a href="?page=<?php echo $current_page + 1; ?>" class="btn" style="padding: 8px 12px; font-size: 14px;">
                        Next <i class="fa fa-chevron-right"></i>
                    </a>
                <?php endif; ?>
            </div>

            <div style="text-align: center; margin-top: 15px; color: #6b7280; font-size: 14px;">
                Showing <?php echo $offset + 1; ?> to <?php echo min($offset + $items_per_page, $total_pages_count); ?> of <?php echo $total_pages_count; ?> pages
            </div>
        <?php endif; ?>
'@

$content = $content -replace '        </table>', "        </table>$paginationHtml"

Set-Content $file -Value $content -NoNewline
Write-Host "Added pagination to pages list"
