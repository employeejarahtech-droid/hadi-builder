<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$pageTitle = 'Media Gallery';
$currentPage = 'gallery';

try {
    $pdo = getDBConnection();

    // Ensure table exists (just in case)
    $pdo->exec("CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Pagination
    $items_per_page = 24;
    $current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $offset = ($current_page - 1) * $items_per_page;

    // Get total count
    $count_stmt = $pdo->query("SELECT COUNT(*) FROM gallery");
    $total_items = $count_stmt->fetchColumn();
    $total_pages = ceil($total_items / $items_per_page);

    // Fetch images
    $stmt = $pdo->prepare("SELECT * FROM gallery ORDER BY uploaded_at DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $images = $stmt->fetchAll();

} catch (Exception $e) {
    $error = $e->getMessage();
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="page-header">
    <div
        style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-bottom: 1rem;">
        <h1 class="page-title">Media Gallery</h1>
        <div style="display: flex; gap: 0.5rem;">
            <input type="file" id="imageUpload" style="display: none;" accept="image/*" multiple>
            <button class="btn btn-primary" onclick="document.getElementById('imageUpload').click()">
                <i class="fa fa-cloud-upload-alt"></i> Upload Images
            </button>

            <input type="file" id="crop-file-input" style="display: none;" accept="image/*">
            <button class="btn btn-secondary" onclick="openCropperModal()">
                <i class="fa fa-crop"></i> Upload with Crop
            </button>
        </div>
    </div>
</div>

<div class="content-wrapper">
    <!-- Upload Progress -->
    <div id="uploadProgress" style="display: none; margin-bottom: 1.5rem;">
        <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 500;">Uploading...</span>
                <span id="uploadPercent">0%</span>
            </div>
            <div style="height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden;">
                <div id="progressBar"
                    style="width: 0%; height: 100%; background: var(--primary); transition: width 0.3s;"></div>
            </div>
        </div>
    </div>

    <?php if (empty($images)): ?>
        <div class="card" style="text-align: center; padding: 3rem;">
            <i class="fa fa-images" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
            <h3>No images found</h3>
            <p style="color: var(--secondary); margin-bottom: 1.5rem;">Upload your first image to the gallery.</p>
            <button class="btn btn-primary" onclick="document.getElementById('imageUpload').click()">
                Upload Images
            </button>
        </div>
    <?php else: ?>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
            <?php foreach ($images as $img): ?>
                <div class="card" style="padding: 0; overflow: hidden; position: relative; group: hover;">
                    <div style="aspect-ratio: 16/9; background: #f8fafc; overflow: hidden; position: relative;">
                        <img src="<?php echo htmlspecialchars($img['file_path']); ?>"
                            alt="<?php echo htmlspecialchars($img['file_name']); ?>" loading="lazy"
                            style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;"
                            onclick="viewImage('<?php echo htmlspecialchars($img['file_path']); ?>')">
                    </div>
                    <div style="padding: 1rem;">
                        <div style="font-size: 0.875rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.5rem;"
                            title="<?php echo htmlspecialchars($img['file_name']); ?>">
                            <?php echo htmlspecialchars($img['file_name']); ?>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--secondary);">
                            <span>
                                <?php echo date('M d, Y', strtotime($img['uploaded_at'])); ?>
                            </span>
                            <a href="delete.php?id=<?php echo $img['id']; ?>" class="text-danger"
                                onclick="return confirm('Delete this image permanently?');"
                                style="color: #ef4444; text-decoration: none; padding: 0.25rem;">
                                <i class="fa fa-trash"></i>
                            </a>
                        </div>
                    </div>

                    <!-- Copy Link Overlay -->
                    <div style="position: absolute; top: 0.5rem; right: 0.5rem;">
                        <button class="btn btn-sm"
                            onclick="copyToClipboard('<?php echo htmlspecialchars($img['file_path']); ?>')"
                            style="background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); padding: 0.25rem 0.5rem; border-radius: 4px;"
                            title="Copy URL">
                            <i class="fa fa-link" style="color: #64748b;"></i>
                        </button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Pagination -->
        <?php if ($total_pages > 1): ?>
            <?php
            $pageBaseUrl = '?page=';
            ?>
            <div class="pagination"
                style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="font-size: 0.875rem; color: #64748b;">
                    Showing <?php echo $offset + 1; ?> to
                    <?php echo min($offset + $items_per_page, $total_items); ?> of
                    <?php echo $total_items; ?> images
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
    <?php endif; ?>
    <!-- Cropper Modal -->
    <div id="cropper-modal"
        style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); justify-content: center; align-items: center;">
        <div
            style="position: relative; background-color: white; padding: 20px; border-radius: 8px; max-width: 800px; max-height: 90vh; overflow: auto; text-align: center;">
            <span id="close-cropper"
                style="position: absolute; top: 10px; right: 15px; font-size: 28px; cursor: pointer; color: #64748b;">&times;</span>

            <h2 style="margin-bottom: 1rem;">Crop Image</h2>

            <!-- Dimension Controls -->
            <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap;">
                <div>
                    <label style="font-size: 0.875rem; color: #64748b;">Width (px):</label>
                    <input type="number" id="crop-width" value="500" min="1"
                        style="width: 80px; padding: 0.25rem; border: 1px solid #e2e8f0; border-radius: 4px;">
                </div>
                <div>
                    <label style="font-size: 0.875rem; color: #64748b;">Height (px):</label>
                    <input type="number" id="crop-height" value="500" min="1"
                        style="width: 80px; padding: 0.25rem; border: 1px solid #e2e8f0; border-radius: 4px;">
                </div>
                <div>
                    <label style="font-size: 0.875rem; color: #64748b;">Max Size (KB):</label>
                    <input type="number" id="max-size" value="50" min="1"
                        style="width: 70px; padding: 0.25rem; border: 1px solid #e2e8f0; border-radius: 4px;">
                </div>
            </div>

            <!-- Image Preview Area -->
            <div style="max-width: 700px; max-height: 500px; overflow: hidden; margin: 0 auto 1rem;">
                <img id="crop-preview" style="max-width: 100%; display: none;">
            </div>

            <!-- Crop Button -->
            <button id="crop-and-save" class="btn btn-primary" style="display: none;">
                <i class="fa fa-check"></i> Crop & Upload
            </button>

            <!-- Result Message -->
            <div id="crop-result-msg" style="margin-top: 1rem; font-size: 0.875rem;"></div>
        </div>
    </div>
</div>

<!-- Cropper.js -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
<script src="../assets/js/gallery-cropper.js"></script>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function () {
            showToast('URL copied to clipboard', 'success');
        }, function (err) {
            showToast('Could not copy text', 'error');
        });
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        toast.style.zIndex = '9999';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Upload Logic
    $('#imageUpload').on('change', async function (e) {
        const files = e.target.files;
        if (!files.length) return;

        $('#uploadProgress').show();
        let completed = 0;
        let hasErrors = false;

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);

            try {
                await $.ajax({
                    url: '../../api/upload-image.php',
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false
                });
            } catch (error) {
                console.error('Upload failed:', error);
                hasErrors = true;
            }

            completed++;
            const percent = Math.round((completed / files.length) * 100);
            $('#uploadPercent').text(percent + '%');
            $('#progressBar').css('width', percent + '%');
        }

        setTimeout(() => {
            $('#uploadProgress').hide();
            if (hasErrors) {
                showToast('Some images failed to upload', 'error');
            } else {
                showToast('Images uploaded successfully', 'success');
            }
            // Reload page to show new images
            setTimeout(() => location.reload(), 1000);
        }, 500);
    });

    function viewImage(url) {
        // Optional: Implement lightbox or full view
        window.open(url, '_blank');
    }
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>