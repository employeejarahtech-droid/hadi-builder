<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

$envPath = __DIR__ . '/../../.env';
$message = '';
$error = '';
$envContent = '';

// Read .env file
if (file_exists($envPath)) {
    $envContent = file_get_contents($envPath);
} else {
    $error = '.env file not found';
}

$currentPage = 'env_editor';
$pageTitle = '.env Editor';
require_once __DIR__ . '/../includes/header.php';
?>

<style>
    .editor-container {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .editor-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8fafc;
    }

    .editor-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-main);
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .editor-body {
        padding: 1.5rem;
    }

    .code-editor {
        width: 100%;
        min-height: 500px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.6;
        padding: 1rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: #1e1e1e;
        color: #d4d4d4;
        resize: vertical;
    }

    .code-editor:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .editor-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .alert {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .alert-success {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
    }

    .alert-error {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
    }

    .alert-warning {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fde68a;
    }

    .file-info {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
    }

    .file-info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--secondary);
    }

    .file-info-item i {
        color: var(--primary);
    }
</style>

<div class="page-header">
    <h1 class="page-title">.env File Editor</h1>
    <p style="color: var(--secondary); margin-top: 5px;">Edit environment configuration variables</p>
</div>

<div class="content-wrapper">
    <div class="editor-container">
        <div class="editor-header">
            <div class="editor-title">
                <i class="fa fa-file-code" style="color: var(--primary);"></i>
                .env
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <span style="font-size: 0.85rem; color: var(--secondary);">
                    <i class="fa fa-info-circle"></i> Changes take effect after page reload
                </span>
            </div>
        </div>

        <div class="editor-body">
            <?php if ($error): ?>
                <div class="alert alert-error">
                    <i class="fa fa-exclamation-circle"></i>
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <div id="message-container"></div>

            <div class="alert alert-warning">
                <i class="fa fa-exclamation-triangle"></i>
                <strong>Warning:</strong> This file contains sensitive configuration data. A backup will be created
                automatically before saving.
            </div>

            <div class="file-info">
                <div class="file-info-item">
                    <i class="fa fa-folder"></i>
                    <span>Location: <code>/<?php echo basename(dirname(dirname(__DIR__))); ?>/.env</code></span>
                </div>
                <div class="file-info-item">
                    <i class="fa fa-clock"></i>
                    <span>Last modified:
                        <?php echo file_exists($envPath) ? date('Y-m-d H:i:s', filemtime($envPath)) : 'N/A'; ?>
                    </span>
                </div>
            </div>

            <form id="env-editor-form">
                <textarea id="env-content" name="content" class="code-editor"
                    spellcheck="false"><?php echo htmlspecialchars($envContent); ?></textarea>

                <div class="editor-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa fa-save"></i> Save Changes
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="location.reload()">
                        <i class="fa fa-undo"></i> Reset
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    document.getElementById('env-editor-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const content = document.getElementById('env-content').value;
        const messageContainer = document.getElementById('message-container');
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';

        try {
            const response = await fetch('save-env.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: content })
            });

            const result = await response.json();

            if (result.success) {
                messageContainer.innerHTML = `
                <div class="alert alert-success">
                    <i class="fa fa-check-circle"></i> ${result.message}
                    ${result.backup ? `<br><small>Backup created: ${result.backup}</small>` : ''}
                </div>
            `;

                // Show toast notification
                if (typeof Toast !== 'undefined') {
                    Toast.success(result.message);
                }
            } else {
                messageContainer.innerHTML = `
                <div class="alert alert-error">
                    <i class="fa fa-exclamation-circle"></i> ${result.message}
                </div>
            `;

                if (typeof Toast !== 'undefined') {
                    Toast.error(result.message);
                }
            }

            // Scroll to message
            messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            messageContainer.innerHTML = `
            <div class="alert alert-error">
                <i class="fa fa-exclamation-circle"></i> Error: ${error.message}
            </div>
        `;

            if (typeof Toast !== 'undefined') {
                Toast.error('Failed to save file');
            }
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa fa-save"></i> Save Changes';
        }
    });

    // Add line numbers (optional enhancement)
    const textarea = document.getElementById('env-content');
    textarea.addEventListener('keydown', function (e) {
        // Tab key support
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
        }
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>