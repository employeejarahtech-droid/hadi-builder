<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

require_once __DIR__ . '/../../includes/db.php';

$projectId = $_GET['id'] ?? null;
$project = null;
$error = '';
$message = '';

if (!$projectId) {
    header('Location: index.php');
    exit;
}

// Fetch project
try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();

    if (!$project) {
        header('Location: index.php');
        exit;
    }
} catch (Exception $e) {
    $error = $e->getMessage();
}

// Add columns if not exists
try {
    $columns = $pdo->query("SHOW COLUMNS FROM projects")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('gallery_images', $columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN gallery_images TEXT AFTER featured_image");
    }
    if (!in_array('map_embed_code', $columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN map_embed_code TEXT AFTER attributes");
    }
    if (!in_array('project_type', $columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN project_type VARCHAR(50) DEFAULT 'building' AFTER description");
    }
    if (!in_array('master_plan', $columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN master_plan TEXT AFTER attributes");
    }
    if (!in_array('category_id', $columns)) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN category_id INT NULL AFTER id");
    }
} catch (Exception $e) {
    // Ignore
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $featured_image = trim($_POST['featured_image'] ?? '');
    $gallery_images = $_POST['gallery_images'] ?? '[]';
    $attributes = $_POST['attributes'] ?? '[]';
    $map_embed_code = trim($_POST['map_embed_code'] ?? '');
    $project_type = trim($_POST['project_type'] ?? 'building');
    $category_id = !empty($_POST['category_id']) ? intval($_POST['category_id']) : null;
    $master_plan = trim($_POST['master_plan'] ?? '');
    $status = trim($_POST['status'] ?? 'draft');
    $meta_title = trim($_POST['meta_title'] ?? '');
    $meta_description = trim($_POST['meta_description'] ?? '');
    $meta_keywords = trim($_POST['meta_keywords'] ?? '');
    $meta_image = trim($_POST['meta_image'] ?? '');

    // Auto-generate slug from title if empty
    if (empty($slug)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $slug = trim($slug, '-');
    }

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // Check if slug exists (excluding current project)
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM projects WHERE slug = ? AND id != ?");
        $stmt->execute([$slug, $projectId]);
        if ($stmt->fetchColumn() > 0) {
            $error = 'Slug already exists';
        } else {
            try {
                $stmt = $pdo->prepare("UPDATE projects SET title = ?, slug = ?, description = ?, project_type = ?, category_id = ?, featured_image = ?, gallery_images = ?, attributes = ?, master_plan = ?, map_embed_code = ?, status = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, meta_image = ?, updated_at = NOW() WHERE id = ?");
                $stmt->execute([$title, $slug, $description, $project_type, $category_id, $featured_image, $gallery_images, $attributes, $master_plan, $map_embed_code, $status, $meta_title, $meta_description, $meta_keywords, $meta_image, $projectId]);

                $message = 'Project updated successfully';

                // Refresh project data
                $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
                $stmt->execute([$projectId]);
                $project = $stmt->fetch();
            } catch (Exception $e) {
                $error = 'Error updating project: ' . $e->getMessage();
            }
        }
    }
}

// Fetch gallery images
$galleryImages = [];
try {
    $stmt = $pdo->query("SELECT id, file_path, file_name FROM gallery ORDER BY uploaded_at DESC");
    $galleryImages = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    // Ignore gallery image fetching errors
}

// Fetch categories
$projectCategories = [];
try {
    $stmt = $pdo->query("SELECT id, name FROM project_categories ORDER BY name ASC");
    $projectCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    // Ignore category fetching errors
}

$currentPage = 'projects';
$pageTitle = 'Edit Project';
require_once __DIR__ . '/../includes/header.php';
?>

<!-- Media Modal CSS -->
<link rel="stylesheet" href="<?php echo base_url; ?>/admin/assets/css/media-modal.css">

<div class="page-header">
    <h1 class="page-title">Edit Project</h1>
</div>

<div class="content-wrapper max-w-1000">
    <?php if ($error): ?>
        <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>

    <?php if ($message): ?>
        <div style="background: #d1fae5; color: #065f46; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
            <?php echo htmlspecialchars($message); ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="">
        <div class="admin-grid-layout">
            <!-- Main Column -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">

                <!-- Basic Info Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Basic Information
                    </h2>

                    <div class="form-group">
                        <label class="form-label" for="title">Project Title *</label>
                        <input type="text" id="title" name="title" class="form-input" required
                            value="<?php echo htmlspecialchars($project['title']); ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="slug">Slug (URL)</label>
                        <input type="text" id="slug" name="slug" class="form-input"
                            value="<?php echo htmlspecialchars($project['slug']); ?>"
                            placeholder="auto-generated-from-title">
                        <small style="color: var(--secondary);">Used in project URL:
                            /projects/<strong><?php echo htmlspecialchars($project['slug'] ?? 'slug'); ?></strong></small>
                    </div>

                    <div style="display: flex; gap: 1rem;">
                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Project Type</label>
                            <select name="project_type" class="form-input">
                                <option value="building" <?php echo ($project['project_type'] ?? 'building') === 'building' ? 'selected' : ''; ?>>Building</option>
                                <option value="land" <?php echo ($project['project_type'] ?? '') === 'land' ? 'selected' : ''; ?>>Land</option>
                                <option value="plot" <?php echo ($project['project_type'] ?? '') === 'plot' ? 'selected' : ''; ?>>Plot</option>
                                <option value="house" <?php echo ($project['project_type'] ?? '') === 'house' ? 'selected' : ''; ?>>House</option>
                                <option value="commercial" <?php echo ($project['project_type'] ?? '') == 'commercial' ? 'selected' : ''; ?>>Commercial</option>
                                <option value="residential" <?php echo ($project['project_type'] ?? '') == 'residential' ? 'selected' : ''; ?>>Residential</option>
                                <option value="apartment" <?php echo ($project['project_type'] ?? '') == 'apartment' ? 'selected' : ''; ?>>Apartment</option>
                                <option value="villa" <?php echo ($project['project_type'] ?? '') == 'villa' ? 'selected' : ''; ?>>Villa</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Category</label>
                            <select name="category_id" class="form-input">
                                <option value="">Select Category</option>
                                <?php foreach ($projectCategories as $cat): ?>
                                    <option value="<?php echo $cat['id']; ?>" <?php echo ($project['category_id'] ?? '') == $cat['id'] ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($cat['name']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="description">Description</label>
                        <textarea id="description" name="description" class="form-input"
                            rows="4"><?php echo htmlspecialchars($project['description'] ?? ''); ?></textarea>
                    </div>
                </div>

                <!-- Gallery Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Project Gallery
                    </h2>
                    <input type="hidden" id="gallery_images_input" name="gallery_images"
                        value="<?php echo htmlspecialchars($project['gallery_images'] ?? '[]'); ?>">

                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;" id="gallery-list">
                        <!-- JS will populate -->
                        <div class="add-gallery-btn" id="add-gallery-btn"
                            style="width: 100px; height: 100px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; font-size: 24px;">
                            +
                        </div>
                    </div>
                </div>

                <!-- Attributes Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Project Attributes
                    </h2>
                    <input type="hidden" id="attributes_input" name="attributes"
                        value="<?php echo htmlspecialchars($project['attributes'] ?? '[]'); ?>">

                    <div id="attributes-list" style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- JS will populate -->
                    </div>

                    <button type="button" class="btn btn-secondary btn-sm" onclick="addAttribute()"
                        style="margin-top: 15px;">
                        <i class="fa fa-plus"></i> Add Group
                    </button>
                    <small style="color: var(--secondary); display: block; margin-top: 5px;">
                        Organize attributes into groups (e.g., Specifications, Features, Location Details)
                    </small>
                </div>

                <!-- Location / Map Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Location
                    </h2>
                    <div class="form-group">
                        <label class="form-label" for="map_embed_code">Google Maps Embed Code</label>
                        <textarea id="map_embed_code" name="map_embed_code" class="form-input" rows="4"
                            placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'><?php echo htmlspecialchars($project['map_embed_code'] ?? ''); ?></textarea>
                        <small style="color: var(--secondary);">Paste the full <code>&lt;iframe&gt;</code> code from
                            Google Maps here.</small>
                    </div>
                </div>

                <!-- Project Plans Card -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Project Plans
                    </h2>

                    <!-- Master Plan -->
                    <div id="master-plan-section">
                        <label class="form-label">Master Plan / Layout Plan</label>
                        <div class="image-upload-container" style="margin-top: 10px;">
                            <input type="hidden" name="master_plan" id="master_plan"
                                value="<?php echo htmlspecialchars($project['master_plan'] ?? ''); ?>">

                            <div id="master_plan_preview"
                                style="margin-bottom: 10px; width: 100%; height: 200px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                <?php if (!empty($project['master_plan'])): ?>
                                    <img src="<?php echo htmlspecialchars($project['master_plan']); ?>"
                                        style="width: 100%; height: 100%; object-fit: contain;">
                                <?php else: ?>
                                    <span style="color: #64748b; font-size: 0.9rem;">No master plan selected</span>
                                <?php endif; ?>
                            </div>

                            <div style="display: flex; gap: 0.5rem; width: 200px;">
                                <button type="button" class="btn btn-secondary select-image-btn"
                                    data-target="master_plan" style="flex: 1;">Select Image</button>
                                <button type="button" class="btn btn-danger remove-image-btn" data-target="master_plan"
                                    style="<?php echo empty($project['master_plan']) ? 'display:none;' : 'flex: 1;'; ?>">Remove</button>
                            </div>
                        </div>
                    </div>

                    <!-- Floor Plans -->
                    <!-- Floor Plans Removed (Moved to Attributes) -->
                </div>

                <!-- SEO Information -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        SEO Information
                    </h2>

                    <div class="form-group">
                        <label class="form-label">Meta Image (Social Share Image)</label>
                        <div class="image-upload-container" style="margin-top: 10px;">
                            <input type="hidden" name="meta_image" id="meta_image"
                                value="<?php echo htmlspecialchars($project['meta_image'] ?? ''); ?>">

                            <div id="meta_image_preview"
                                style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                <?php if (!empty($project['meta_image'])): ?>
                                    <img src="<?php echo htmlspecialchars($project['meta_image']); ?>"
                                        style="width: 100%; height: 100%; object-fit: cover;">
                                <?php else: ?>
                                    <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                                <?php endif; ?>
                            </div>

                            <div style="display: flex; gap: 0.5rem; width: 150px;">
                                <button type="button" class="btn btn-secondary select-image-btn"
                                    data-target="meta_image" style="flex: 1;">Select</button>
                                <button type="button" class="btn btn-danger remove-image-btn" data-target="meta_image"
                                    style="<?php echo empty($project['meta_image']) ? 'display:none;' : 'flex: 1;'; ?>">Remove</button>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 2rem; padding-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Meta Title</label>
                            <input type="text" name="meta_title" class="form-input"
                                value="<?php echo htmlspecialchars($project['meta_title'] ?? ''); ?>"
                                placeholder="SEO Title (defaults to project title if empty)">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Meta Description</label>
                            <textarea name="meta_description" class="form-input" rows="3"
                                placeholder="Brief summary for search engines"><?php echo htmlspecialchars($project['meta_description'] ?? ''); ?></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Meta Keywords</label>
                            <input type="text" name="meta_keywords" class="form-input"
                                value="<?php echo htmlspecialchars($project['meta_keywords'] ?? ''); ?>"
                                placeholder="comma, separated, keywords">
                        </div>
                    </div>
                </div>

            </div>

            <!-- Sidebar Column -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">

                <!-- Status -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Status
                    </h2>
                    <div class="form-group">
                        <label class="form-label" for="status">Publication Status</label>
                        <select id="status" name="status" class="form-input">
                            <option value="draft" <?php echo $project['status'] === 'draft' ? 'selected' : ''; ?>>Draft
                            </option>
                            <option value="published" <?php echo $project['status'] === 'published' ? 'selected' : ''; ?>>
                                Published
                            </option>
                        </select>
                        <small style="color: var(--secondary); display: block; margin-top: 5px;">Only published
                            projects are visible on the frontend.</small>
                    </div>
                </div>

                <!-- Featured Image -->
                <div class="card">
                    <h2
                        style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        Featured Image
                    </h2>
                    <div class="image-upload-container" style="margin-top: 10px;">
                        <input type="hidden" name="featured_image" id="featured_image"
                            value="<?php echo htmlspecialchars($project['featured_image'] ?? ''); ?>">

                        <div id="featured_image_preview"
                            style="margin-bottom: 10px; width: 150px; height: 150px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <?php if (!empty($project['featured_image'])): ?>
                                <img src="<?php echo htmlspecialchars($project['featured_image']); ?>"
                                    style="width: 100%; height: 100%; object-fit: cover;">
                            <?php else: ?>
                                <span style="color: #64748b; font-size: 0.9rem;">No image</span>
                            <?php endif; ?>
                        </div>

                        <button type="button" class="btn btn-secondary select-image-btn"
                            data-target="featured_image">Select
                            Image</button>
                        <button type="button" class="btn btn-danger remove-image-btn" data-target="featured_image"
                            style="<?php echo empty($project['featured_image']) ? 'display:none;' : ''; ?>">Remove</button>
                    </div>
                </div>

                <!-- Actions -->
                <div class="card">
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                        <i class="fa fa-save"></i> Update Project
                    </button>
                    <a href="../builder.php?type=project&id=<?php echo $projectId; ?>" class="btn btn-secondary"
                        style="width: 100%; text-align: center; margin-bottom: 1rem;">
                        <i class="fa fa-paint-brush"></i> Open in Builder
                    </a>
                    <a href="index.php" class="btn"
                        style="width: 100%; background: #e2e8f0; color: var(--text-main); text-align: center;">
                        <i class="fa fa-arrow-left"></i> Back to Projects
                    </a>
                </div>

            </div>
        </div>
    </form>
</div>

<!-- Media Modal Component -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo base_url; ?>/admin/assets/js/media-modal.js"></script>

<script>
    $(document).ready(function () {
        // Auto-generate slug from title
        $('#title').on('input', function () {
            if (!$('#slug').val() || $('#slug').data('auto-generated')) {
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                $('#slug').val(slug).data('auto-generated', true);
            }
        });

        $('#slug').on('input', function () {
            $(this).data('auto-generated', false);
        });

        // Media Modal Logic
        const galleryData = <?php echo json_encode($galleryImages); ?>;
        let activeInputId = null;

        const mediaModal = new MediaModal({
            apiUrl: '<?php echo base_url; ?>/api/media/list.php',
            onSelect: function (image) {
                if (window.currentAttrTarget) {
                    const { gIndex, aIndex } = window.currentAttrTarget;
                    // Update Attributes
                    if (attributeGroups[gIndex] && attributeGroups[gIndex].attributes[aIndex]) {
                        attributeGroups[gIndex].attributes[aIndex].value = image.file_path;
                        renderAttributes();
                        document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);
                    }
                    window.currentAttrTarget = null;
                    return;
                }

                if (activeInputId) {
                    if (activeInputId === 'gallery') {
                        addGalleryImage(image.file_path);
                    } else {
                        $('#' + activeInputId).val(image.file_path);
                        updatePreview(activeInputId, image.file_path);
                    }
                }
            }
        });

        // Open modal for attributes
        $(document).on('click', '.select-attr-image-btn', function (e) {
            e.preventDefault();
            const gIndex = $(this).data('gindex');
            const aIndex = $(this).data('aindex');
            window.currentAttrTarget = { gIndex, aIndex };
            mediaModal.open(galleryData); // Pass gallery data if available/cached
        });

        // Open modal for single image
        $(document).on('click', '.select-image-btn', function (e) {
            e.preventDefault();
            activeInputId = $(this).data('target');
            mediaModal.open(galleryData);
        });

        // Open modal for gallery
        $(document).on('click', '#add-gallery-btn', function (e) {
            e.preventDefault();
            activeInputId = 'gallery';
            mediaModal.open(galleryData);
        });

        // Remove image
        $(document).on('click', '.remove-image-btn', function (e) {
            e.preventDefault();
            const targetId = $(this).data('target');
            $('#' + targetId).val('');
            updatePreview(targetId, '');
        });

        function updatePreview(inputId, url) {
            const previewId = inputId + '_preview';
            const container = $('#' + previewId);
            const removeBtn = $(`.remove-image-btn[data-target="${inputId}"]`);

            if (url) {
                container.html(`<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">`);
                removeBtn.show();
            } else {
                container.html('<span style="color: #64748b; font-size: 0.9rem;">No image</span>');
                removeBtn.hide();
            }
        }

        // Gallery Management
        let galleryImages = <?php echo $project['gallery_images'] ?? '[]'; ?>;

        function renderGallery() {
            const container = $('#gallery-list');
            const addBtn = $('#add-gallery-btn');
            container.empty();

            galleryImages.forEach((url, index) => {
                const item = $(`
                    <div class="gallery-item" style="position: relative; width: 100px; height: 100px; border-radius: 8px; overflow: hidden;">
                        <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">
                        <div class="remove-btn" data-index="${index}" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: #ef4444; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px;">&times;</div>
                    </div>
                `);
                container.append(item);
            });

            container.append(addBtn);
            $('#gallery_images_input').val(JSON.stringify(galleryImages));
        }

        function addGalleryImage(url) {
            galleryImages.push(url);
            renderGallery();
        }

        $(document).on('click', '.remove-btn', function () {
            const index = $(this).data('index');
            galleryImages.splice(index, 1);
            renderGallery();
        });

        // Attributes Management (Grouped)
        let rawAttributes = <?php echo $project['attributes'] ?? '[]'; ?>;
        let attributeGroups = [];

        // Convert old format to new if needed
        if (Array.isArray(rawAttributes) && rawAttributes.length > 0 && rawAttributes[0].key) {
            // Old format: [{key, value}]
            attributeGroups = [{ group_name: 'General', attributes: rawAttributes.map(a => ({ name: a.key, value: a.value, type: 'text' })) }];
        } else if (Array.isArray(rawAttributes) && rawAttributes.length > 0 && !rawAttributes[0].group_name) {
            // Flat attributes without groups
            const groups = {};
            for (const attr of rawAttributes) {
                const gName = attr.group || 'General';
                if (!groups[gName]) groups[gName] = [];
                groups[gName].push(attr);
            }
            for (const gName in groups) {
                attributeGroups.push({ group_name: gName, attributes: groups[gName] });
            }
        } else {
            // Already structured
            attributeGroups = rawAttributes;
        }

        function renderAttributes() {
            const container = document.getElementById('attributes-list');
            const input = document.getElementById('attributes_input');

            const scrollPos = window.scrollY;
            container.innerHTML = '';

            attributeGroups.forEach((group, gIndex) => {
                const card = document.createElement('div');
                card.className = 'card group-card';
                card.dataset.index = gIndex;
                card.style.background = '#f8fafc';
                card.style.border = '1px solid #e2e8f0';
                card.style.padding = '15px';
                card.style.marginBottom = '15px';

                // Group Header
                const header = document.createElement('div');
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.alignItems = 'center';
                header.style.marginBottom = '15px';
                header.innerHTML = `
                    <div style="flex: 1; display: flex; gap: 10px; align-items: center;">
                        <i class="fa fa-layer-group" style="color: #64748b;"></i>
                        <input type="text" class="form-input group-name" style="font-weight: 600; width: auto; flex: 1;"
                            value="${group.group_name}" placeholder="Group Name (e.g. Specifications)"
                            onchange="updateGroup(${gIndex}, this.value)">
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeGroup(${gIndex})" title="Remove Group">
                        <i class="fa fa-trash"></i>
                    </button>
                `;
                card.appendChild(header);

                // Attributes List Container
                const attrContainer = document.createElement('div');
                attrContainer.className = 'attributes-container';
                attrContainer.style.display = 'flex';
                attrContainer.style.flexDirection = 'column';
                attrContainer.style.gap = '10px';
                attrContainer.style.minHeight = '10px';

                group.attributes.forEach((attr, aIndex) => {
                    const row = document.createElement('div');
                    row.className = 'attr-row';
                    row.style.display = 'flex';
                    row.style.gap = '10px';
                    row.style.alignItems = 'center';

                    const isColor = attr.type === 'color';
                    const isImage = attr.type === 'image';
                    let valueInput = '';

                    if (isColor) {
                        valueInput = `<div style="display: flex; gap: 5px; flex: 1;">
                             <input type="color" class="attr-value-color" value="${attr.value}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'value', this.value)" style="height: 38px; width: 50px; padding: 2px;">
                             <input type="text" class="form-input attr-value" value="${attr.value}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'value', this.value)" style="flex: 1;">
                           </div>`;
                    } else if (isImage) {
                        const imgSrc = attr.value || '';
                        const imgPreview = imgSrc ? `<img src="${imgSrc}" style="width:30px;height:30px;object-fit:cover;border-radius:4px;">` : `<i class="fa fa-image" style="color:#cbd5e1;"></i>`;
                        valueInput = `
                            <div style="display:flex; gap:5px; flex:1; align-items:center;">
                                <div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;">${imgPreview}</div>
                                <input type="text" class="form-input attr-value" value="${attr.value}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'value', this.value)" style="flex: 1;" placeholder="Image URL">
                                <button type="button" class="btn btn-sm btn-secondary select-attr-image-btn" data-gindex="${gIndex}" data-aindex="${aIndex}">Select</button>
                            </div>
                         `;
                    } else {
                        valueInput = `<input type="text" class="form-input attr-value" placeholder="Value" value="${attr.value}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'value', this.value)" style="flex: 1;">`;
                    }

                    row.innerHTML = `
                        <select class="form-input attr-type" style="width: 100px;" onchange="updateAttribute(${gIndex}, ${aIndex}, 'type', this.value)">
                            <option value="text" ${attr.type === 'text' ? 'selected' : ''}>Text</option>
                            <option value="color" ${attr.type === 'color' ? 'selected' : ''}>Color</option>
                            <option value="image" ${attr.type === 'image' ? 'selected' : ''}>Image</option>
                        </select>
                        <input type="text" class="form-input attr-name" placeholder="Name" value="${attr.name}" onchange="updateAttribute(${gIndex}, ${aIndex}, 'name', this.value)" style="flex: 1;">
                        ${valueInput}
                        <button type="button" class="btn btn-sm" style="color: #94a3b8;" onclick="deleteAttribute(${gIndex}, ${aIndex})">&times;</button>
                    `;
                    attrContainer.appendChild(row);
                });

                card.appendChild(attrContainer);

                // Add Attribute Button
                const footer = document.createElement('div');
                footer.style.marginTop = '15px';
                footer.innerHTML = `
                    <button type="button" class="btn btn-sm btn-secondary" onclick="addAttribute(${gIndex})">
                        <i class="fa fa-plus"></i> Add Attribute
                    </button>
                `;
                card.appendChild(footer);

                container.appendChild(card);
            });

            input.value = JSON.stringify(attributeGroups);
            window.scrollTo(0, scrollPos);
        }

        // --- Actions ---
        window.addGroup = function () {
            attributeGroups.push({ group_name: '', attributes: [] });
            renderAttributes();
        };

        window.removeGroup = function (index) {
            if (confirm('Delete this group and all its attributes?')) {
                attributeGroups.splice(index, 1);
                renderAttributes();
            }
        };

        window.updateGroup = function (index, newName) {
            attributeGroups[index].group_name = newName;
            document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);
        };

        window.addAttribute = function (groupIndex) {
            attributeGroups[groupIndex].attributes.push({ name: '', value: '', type: 'text' });
            renderAttributes();
        };

        window.deleteAttribute = function (groupIndex, attrIndex) {
            attributeGroups[groupIndex].attributes.splice(attrIndex, 1);
            renderAttributes();
        };

        window.updateAttribute = function (groupIndex, attrIndex, key, value) {
            attributeGroups[groupIndex].attributes[attrIndex][key] = value;
            if (key === 'type') {
                renderAttributes();
            } else {
                document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);
            }
        };

        // Replace the simple "Add Attribute" button with "Add Group"
        $(document).ready(function () {
            renderAttributes();

            const oldBtn = document.querySelector('button[onclick="addAttribute()"]');
            if (oldBtn) {
                oldBtn.innerHTML = '<i class="fa fa-plus"></i> Add Group';
                oldBtn.onclick = function () { window.addGroup(); };
                oldBtn.classList.remove('btn-secondary');
                oldBtn.classList.add('btn-primary');
            }
        });

        renderGallery();
        // --- Project Plans Logic (Master Plan Only now) ---

        window.togglePlanFields = function () {
            const type = $('#project_type').val();
            const masterSection = $('#master-plan-section');
            // Master Plan is shown for all types now? Or just toggle logic? 
            // User: "if select Buiding need floow plan (now attributes), if land plan cields same"
            // Let's just always show Master Plan for now, or keep toggle if strict.
            // Since Floor Plans are now Attributes, we rely on user to add the group if needed.
            // So we only toggle Master Plan??
            // Actually, Master Plan is relevant for ALL. 
            // So togglePlanFields might not be needed anymore unless we hide Master Plan for something.
            // Let's keep Master Plan visible always.
        };

        $(document).ready(function () {
            renderGallery();
            $('#project_type').on('change', window.togglePlanFields); // Keep listener but do nothing or minimal
        });

        // Hook into selectImage once everything is loaded
        $(window).on('load', function () {
            const originalSelectImage = window.selectImage;
            window.selectImage = function (url) {
                if (window.currentImageTarget && typeof window.currentImageTarget === 'object') {
                    // Attribute Image
                    if (window.currentImageTarget.type === 'attribute') {
                        const { gIndex, aIndex } = window.currentImageTarget;
                        if (attributeGroups[gIndex] && attributeGroups[gIndex].attributes[aIndex]) {
                            attributeGroups[gIndex].attributes[aIndex].value = url;
                            renderAttributes();
                            document.getElementById('attributes_input').value = JSON.stringify(attributeGroups);
                        }
                        if (typeof closeMediaModal === 'function') closeMediaModal();
                        window.currentImageTarget = null;
                        return;
                    }
                    // Master Plan
                    if (window.currentImageTarget.type === 'master_plan') {
                        // Original logic for IDs might not work if we use object target.
                        // But for master plan we likely use data-target="master_plan" which is a string?
                        // Re-check HTML. Button has data-target="master_plan". 
                        // But logic for that button is default generic logic?
                        // "select-image-btn" click handler is generic.
                    }
                }

                // Fallback to original or standard ID update
                if (typeof originalSelectImage === 'function') originalSelectImage(url);

                // Manual handling for Master Plan if using legacy ID
                if (typeof window.currentImageTarget === 'string') {
                    // handled by originalSelectImage usually or we do it here if needed
                }
            };
        });

    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>