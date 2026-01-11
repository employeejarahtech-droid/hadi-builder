<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

$currentPage = 'git_version';
$pageTitle = 'Git Version Deploy';
require_once __DIR__ . '/../includes/header.php';
?>

<style>
    .git-section {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .git-section-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .git-status-item {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-bottom: 1px solid #f1f5f9;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
    }

    .git-status-item:last-child {
        border-bottom: none;
    }

    .status-icon {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.75rem;
        font-size: 0.75rem;
        font-weight: bold;
        color: white;
    }

    .status-modified {
        background: #f59e0b;
    }

    .status-added {
        background: #10b981;
    }

    .status-deleted {
        background: #ef4444;
    }

    .status-untracked {
        background: #6366f1;
    }

    .commit-row {
        display: grid;
        grid-template-columns: 100px 1fr 150px 150px;
        gap: 1rem;
        padding: 0.75rem;
        border-bottom: 1px solid #f1f5f9;
        align-items: center;
    }

    .commit-row:hover {
        background: #f8fafc;
    }

    .commit-hash {
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        color: var(--primary);
        font-weight: 600;
    }

    .commit-message {
        font-size: 0.9rem;
        color: var(--text);
    }

    .commit-author {
        font-size: 0.85rem;
        color: var(--secondary);
    }

    .commit-date {
        font-size: 0.85rem;
        color: var(--secondary);
    }

    .branch-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.95rem;
    }

    .console-output {
        background: #1e293b;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        max-height: 300px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        margin-top: 1rem;
        display: none;
    }

    .console-output.active {
        display: block;
    }

    .action-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .repo-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .repo-info-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.25rem;
        border-radius: 8px;
    }

    .repo-info-label {
        font-size: 0.85rem;
        opacity: 0.9;
        margin-bottom: 0.5rem;
    }

    .repo-info-value {
        font-size: 1.1rem;
        font-weight: 600;
        font-family: 'Courier New', monospace;
    }

    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--secondary);
    }

    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.3;
    }
</style>

<div class="page-header">
    <h1 class="page-title">
        <i class="fa fa-code-branch"></i> Git Version Deploy
    </h1>
</div>

<div class="content-wrapper">
    <!-- Repository Information -->
    <div class="repo-info" id="repoInfo">
        <div class="repo-info-card">
            <div class="repo-info-label">Current Branch</div>
            <div class="repo-info-value" id="currentBranch">
                <i class="fa fa-spinner fa-spin"></i> Loading...
            </div>
        </div>
        <div class="repo-info-card">
            <div class="repo-info-label">Remote URL</div>
            <div class="repo-info-value" id="remoteUrl" style="font-size: 0.9rem;">
                <i class="fa fa-spinner fa-spin"></i> Loading...
            </div>
        </div>
        <div class="repo-info-card">
            <div class="repo-info-label">Last Commit</div>
            <div class="repo-info-value" id="lastCommit" style="font-size: 0.85rem;">
                <i class="fa fa-spinner fa-spin"></i> Loading...
            </div>
        </div>
    </div>

    <!-- SSH Key & Repository Setup -->
    <div class="git-section">
        <div class="git-section-title">
            <i class="fa fa-key"></i> SSH Key & Repository Setup
        </div>
        <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; border-left: 4px solid #3b82f6;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text);">
                    <i class="fa fa-key"></i> SSH Key Status
                </div>
                <div id="sshKeyStatus"
                    style="font-size: 0.9rem; color: var(--secondary); font-family: 'Courier New', monospace;">
                    <i class="fa fa-spinner fa-spin"></i> Checking...
                </div>
                <button class="btn btn-sm btn-primary" onclick="generateSSHKey()" style="margin-top: 0.75rem;">
                    <i class="fa fa-plus"></i> Generate SSH Key
                </button>
                <button class="btn btn-sm btn-secondary" onclick="showSSHKeyModal()" style="margin-top: 0.75rem;"
                    id="viewKeyBtn" disabled>
                    <i class="fa fa-eye"></i> View Public Key
                </button>
            </div>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; border-left: 4px solid #10b981;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text);">
                    <i class="fa fa-cog"></i> Repository Setup
                </div>
                <div style="font-size: 0.9rem; color: var(--secondary); margin-bottom: 0.75rem;">
                    Initialize or configure git repository
                </div>
                <button class="btn btn-sm" style="background: #10b981; color: white;" onclick="showRepoSetupModal()">
                    <i class="fa fa-code-branch"></i> Setup Repository
                </button>
            </div>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text);">
                    <i class="fa fa-rocket"></i> Quick Deploy
                </div>
                <div style="font-size: 0.9rem; color: var(--secondary); margin-bottom: 0.75rem;">
                    Pull latest changes and deploy
                </div>
                <button class="btn btn-sm" style="background: #f59e0b; color: white;" onclick="quickDeploy()">
                    <i class="fa fa-bolt"></i> Pull & Deploy
                </button>
            </div>
        </div>
    </div>

    <!-- Git Status Section -->
    <div class="git-section">
        <div class="git-section-title">
            <i class="fa fa-file-code"></i> Repository Status
            <button class="btn btn-sm btn-secondary" onclick="refreshStatus()" style="margin-left: auto;">
                <i class="fa fa-sync-alt"></i> Refresh
            </button>
        </div>
        <div id="gitStatus">
            <div style="text-align: center; padding: 2rem; color: var(--secondary);">
                <i class="fa fa-spinner fa-spin"></i> Loading status...
            </div>
        </div>
    </div>

    <!-- Deployment Actions -->
    <div class="git-section">
        <div class="git-section-title">
            <i class="fa fa-rocket"></i> Deployment Actions
        </div>
        <div class="action-buttons">
            <button class="btn btn-primary" onclick="pullChanges()">
                <i class="fa fa-download"></i> Pull Changes
            </button>
            <button class="btn" style="background: #10b981; color: white;" onclick="showCommitModal()">
                <i class="fa fa-check"></i> Commit Changes
            </button>
            <button class="btn" style="background: #f59e0b; color: white;" onclick="pushChanges()">
                <i class="fa fa-upload"></i> Push to Remote
            </button>
            <button class="btn btn-secondary" onclick="showBranchModal()">
                <i class="fa fa-code-branch"></i> Switch Branch
            </button>
        </div>
        <div id="consoleOutput" class="console-output"></div>
    </div>

    <!-- Commit History -->
    <div class="git-section">
        <div class="git-section-title">
            <i class="fa fa-history"></i> Recent Commits
            <select id="branchFilter" class="form-input" style="margin-left: auto; width: 200px; height: 36px;"
                onchange="loadCommitHistory()">
                <option value="">Current Branch</option>
            </select>
        </div>
        <div id="commitHistory">
            <div style="text-align: center; padding: 2rem; color: var(--secondary);">
                <i class="fa fa-spinner fa-spin"></i> Loading commits...
            </div>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 1rem; gap: 0.5rem;" id="commitPagination"></div>
    </div>
</div>

<!-- Commit Modal -->
<div id="commitModal"
    style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
    <div style="background: white; border-radius: 8px; padding: 2rem; max-width: 500px; width: 90%;">
        <h3 style="margin-bottom: 1rem;">Commit Changes</h3>
        <div class="form-group">
            <label class="form-label">Commit Message</label>
            <textarea id="commitMessage" class="form-input" rows="4" placeholder="Enter commit message..."></textarea>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button class="btn btn-secondary" onclick="hideCommitModal()">Cancel</button>
            <button class="btn btn-primary" onclick="commitChanges()">
                <i class="fa fa-check"></i> Commit
            </button>
        </div>
    </div>
</div>

<!-- Branch Modal -->
<div id="branchModal"
    style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
    <div style="background: white; border-radius: 8px; padding: 2rem; max-width: 500px; width: 90%;">
        <h3 style="margin-bottom: 1rem;">Switch Branch</h3>
        <div class="form-group">
            <label class="form-label">Select Branch</label>
            <select id="branchSelect" class="form-input"></select>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button class="btn btn-secondary" onclick="hideBranchModal()">Cancel</button>
            <button class="btn btn-primary" onclick="checkoutBranch()">
                <i class="fa fa-code-branch"></i> Switch
            </button>
        </div>
    </div>
</div>

<!-- SSH Key Modal -->
<div id="sshKeyModal"
    style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
    <div style="background: white; border-radius: 8px; padding: 2rem; max-width: 600px; width: 90%;">
        <h3 style="margin-bottom: 1rem;">SSH Public Key</h3>
        <div class="form-group">
            <label class="form-label">Copy this key and add it to your Git provider (GitHub, GitLab, etc.)</label>
            <textarea id="sshPublicKey" class="form-input" rows="8" readonly
                style="font-family: 'Courier New', monospace; font-size: 0.85rem;"></textarea>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button class="btn btn-secondary" onclick="hideSSHKeyModal()">Close</button>
            <button class="btn btn-primary" onclick="copySSHKey()">
                <i class="fa fa-copy"></i> Copy to Clipboard
            </button>
        </div>
    </div>
</div>

<!-- Repository Setup Modal -->
<div id="repoSetupModal"
    style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
    <div style="background: white; border-radius: 8px; padding: 2rem; max-width: 500px; width: 90%;">
        <h3 style="margin-bottom: 1rem;">Repository Setup</h3>
        <div class="form-group">
            <label class="form-label">Remote Repository URL</label>
            <input type="text" id="remoteRepoUrl" class="form-input" placeholder="git@github.com:username/repo.git">
            <small style="color: var(--secondary); display: block; margin-top: 0.5rem;">
                Use SSH URL format for authentication with your SSH key
            </small>
        </div>
        <div class="form-group">
            <label class="form-label">Branch Name (optional)</label>
            <input type="text" id="defaultBranch" class="form-input" placeholder="main" value="main">
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button class="btn btn-secondary" onclick="hideRepoSetupModal()">Cancel</button>
            <button class="btn btn-primary" onclick="setupRepository()">
                <i class="fa fa-code-branch"></i> Setup
            </button>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    let currentPage = 1;
    const commitsPerPage = 10;

    function showToast(message, type = 'info') {
        if (window.Toast) {
            Toast.show(message, type);
        } else {
            alert(message);
        }
    }

    function showConsole(message, append = false) {
        const console = $('#consoleOutput');
        if (append) {
            console.append(message + '\n');
        } else {
            console.text(message);
        }
        console.addClass('active');
        console.scrollTop(console[0].scrollHeight);
    }

    function hideConsole() {
        $('#consoleOutput').removeClass('active');
    }

    // SSH Key Management
    function checkSSHKey() {
        $.ajax({
            url: 'api/check-ssh-key.php',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.exists) {
                    $('#sshKeyStatus').html('<i class="fa fa-check-circle" style="color: #10b981;"></i> SSH key exists');
                    $('#viewKeyBtn').prop('disabled', false);
                } else {
                    $('#sshKeyStatus').html('<i class="fa fa-times-circle" style="color: #ef4444;"></i> No SSH key found');
                    $('#viewKeyBtn').prop('disabled', true);
                }
            },
            error: function () {
                $('#sshKeyStatus').html('<i class="fa fa-exclamation-circle" style="color: #f59e0b;"></i> Unable to check');
            }
        });
    }

    function generateSSHKey() {
        if (!confirm('Generate a new SSH key pair? This will overwrite any existing key.')) return;

        showConsole('Generating SSH key pair...\n');

        $.ajax({
            url: 'api/generate-ssh-key.php',
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                showConsole(response.output || response.message, true);
                if (response.success) {
                    showToast('SSH key generated successfully', 'success');
                    checkSSHKey();
                    if (response.publicKey) {
                        $('#sshPublicKey').val(response.publicKey);
                        showSSHKeyModal();
                    }
                } else {
                    showToast(response.message || 'Failed to generate SSH key', 'error');
                }
            },
            error: function () {
                showConsole('Error: Failed to generate SSH key', true);
                showToast('Failed to generate SSH key', 'error');
            }
        });
    }

    function showSSHKeyModal() {
        // Load the public key
        $.ajax({
            url: 'api/get-ssh-key.php',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    $('#sshPublicKey').val(response.publicKey);
                    $('#sshKeyModal').css('display', 'flex');
                } else {
                    showToast('Failed to load SSH key', 'error');
                }
            }
        });
    }

    function hideSSHKeyModal() {
        $('#sshKeyModal').hide();
    }

    function copySSHKey() {
        const keyText = $('#sshPublicKey').val();
        navigator.clipboard.writeText(keyText).then(() => {
            showToast('SSH key copied to clipboard', 'success');
        }).catch(() => {
            // Fallback for older browsers
            $('#sshPublicKey').select();
            document.execCommand('copy');
            showToast('SSH key copied to clipboard', 'success');
        });
    }

    // Repository Setup
    function showRepoSetupModal() {
        $('#repoSetupModal').css('display', 'flex');
        $('#remoteRepoUrl').val('').focus();
    }

    function hideRepoSetupModal() {
        $('#repoSetupModal').hide();
    }

    function setupRepository() {
        const repoUrl = $('#remoteRepoUrl').val().trim();
        const branch = $('#defaultBranch').val().trim() || 'main';

        if (!repoUrl) {
            showToast('Please enter a repository URL', 'warning');
            return;
        }

        if (!confirm(`Setup repository with URL: ${repoUrl}?`)) return;

        hideRepoSetupModal();
        showConsole('Setting up repository...\n');

        $.ajax({
            url: 'api/setup-repository.php',
            method: 'POST',
            data: { repoUrl: repoUrl, branch: branch },
            dataType: 'json',
            success: function (response) {
                showConsole(response.output || response.message, true);
                if (response.success) {
                    showToast('Repository setup successfully', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    showToast(response.message || 'Repository setup failed', 'error');
                }
            },
            error: function () {
                showConsole('Error: Failed to setup repository', true);
                showToast('Failed to setup repository', 'error');
            }
        });
    }

    // Quick Deploy
    function quickDeploy() {
        if (!confirm('Pull latest changes and deploy?')) return;

        showConsole('Starting quick deploy...\n');

        $.ajax({
            url: 'api/quick-deploy.php',
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                showConsole(response.output || response.message, true);
                if (response.success) {
                    showToast('Deployment completed successfully', 'success');
                    setTimeout(() => {
                        refreshStatus();
                        loadCommitHistory();
                        loadRepoInfo();
                    }, 1000);
                } else {
                    showToast(response.message || 'Deployment failed', 'error');
                }
            },
            error: function () {
                showConsole('Error: Deployment failed', true);
                showToast('Deployment failed', 'error');
            }
        });
    }

    // Load repository info
    function loadRepoInfo() {
        $.ajax({
            url: 'api/get-repo-info.php',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    $('#currentBranch').html('<i class="fa fa-code-branch"></i> ' + response.branch);
                    $('#remoteUrl').text(response.remote || 'No remote configured');
                    $('#lastCommit').text(response.lastCommit || 'No commits');
                } else {
                    showToast(response.message || 'Error loading repository info', 'error');
                }
            },
            error: function () {
                showToast('Failed to load repository information', 'error');
            }
        });
    }

    // Load git status
    function refreshStatus() {
        $('#gitStatus').html('<div style="text-align: center; padding: 2rem; color: var(--secondary);"><i class="fa fa-spinner fa-spin"></i> Loading status...</div>');

        $.ajax({
            url: 'api/get-git-status.php',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    displayGitStatus(response.files);
                } else {
                    $('#gitStatus').html('<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>' + (response.message || 'Error loading status') + '</p></div>');
                }
            },
            error: function () {
                $('#gitStatus').html('<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>Failed to load git status</p></div>');
            }
        });
    }

    function displayGitStatus(files) {
        if (!files || files.length === 0) {
            $('#gitStatus').html('<div class="empty-state"><i class="fa fa-check-circle"></i><p>Working tree clean - no changes detected</p></div>');
            return;
        }

        let html = '';
        files.forEach(file => {
            const statusClass = file.status === 'M' ? 'modified' :
                file.status === 'A' ? 'added' :
                    file.status === 'D' ? 'deleted' : 'untracked';
            const statusText = file.status === 'M' ? 'M' :
                file.status === 'A' ? 'A' :
                    file.status === 'D' ? 'D' : '?';

            html += `
                <div class="git-status-item">
                    <div class="status-icon status-${statusClass}">${statusText}</div>
                    <div>${file.file}</div>
                </div>
            `;
        });

        $('#gitStatus').html(html);
    }

    // Load commit history
    function loadCommitHistory() {
        const branch = $('#branchFilter').val();
        $('#commitHistory').html('<div style="text-align: center; padding: 2rem; color: var(--secondary);"><i class="fa fa-spinner fa-spin"></i> Loading commits...</div>');

        $.ajax({
            url: 'api/get-commit-history.php',
            method: 'GET',
            data: { page: currentPage, limit: commitsPerPage, branch: branch },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    displayCommitHistory(response.commits);
                    displayPagination(response.totalPages);
                } else {
                    $('#commitHistory').html('<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>' + (response.message || 'Error loading commits') + '</p></div>');
                }
            },
            error: function () {
                $('#commitHistory').html('<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>Failed to load commit history</p></div>');
            }
        });
    }

    function displayCommitHistory(commits) {
        if (!commits || commits.length === 0) {
            $('#commitHistory').html('<div class="empty-state"><i class="fa fa-history"></i><p>No commits found</p></div>');
            return;
        }

        let html = '';
        commits.forEach(commit => {
            html += `
                <div class="commit-row">
                    <div class="commit-hash">${commit.hash}</div>
                    <div class="commit-message">${commit.message}</div>
                    <div class="commit-author">${commit.author}</div>
                    <div class="commit-date">${commit.date}</div>
                </div>
            `;
        });

        $('#commitHistory').html(html);
    }

    function displayPagination(totalPages) {
        if (totalPages <= 1) {
            $('#commitPagination').html('');
            return;
        }

        let html = '';
        if (currentPage > 1) {
            html += `<button class="btn btn-sm btn-secondary" onclick="changePage(${currentPage - 1})">Previous</button>`;
        }

        html += `<span style="padding: 0 1rem; color: var(--secondary);">Page ${currentPage} of ${totalPages}</span>`;

        if (currentPage < totalPages) {
            html += `<button class="btn btn-sm btn-secondary" onclick="changePage(${currentPage + 1})">Next</button>`;
        }

        $('#commitPagination').html(html);
    }

    function changePage(page) {
        currentPage = page;
        loadCommitHistory();
    }

    // Load branches
    function loadBranches() {
        $.ajax({
            url: 'api/get-branches.php',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    let branchFilterHtml = '<option value="">Current Branch</option>';
                    let branchSelectHtml = '';

                    response.branches.forEach(branch => {
                        const branchName = branch.name.replace('* ', '');
                        branchFilterHtml += `<option value="${branchName}">${branchName}</option>`;
                        if (!branch.current) {
                            branchSelectHtml += `<option value="${branchName}">${branchName}</option>`;
                        }
                    });

                    $('#branchFilter').html(branchFilterHtml);
                    $('#branchSelect').html(branchSelectHtml);
                }
            }
        });
    }

    // Pull changes
    function pullChanges() {
        if (!confirm('Pull changes from remote repository?')) return;

        showConsole('Pulling changes from remote...\n');

        $.ajax({
            url: 'api/pull-changes.php',
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                showConsole(response.output || response.message, true);
                if (response.success) {
                    showToast('Changes pulled successfully', 'success');
                    setTimeout(() => {
                        refreshStatus();
                        loadCommitHistory();
                        loadRepoInfo();
                    }, 1000);
                } else {
                    showToast(response.message || 'Pull failed', 'error');
                }
            },
            error: function () {
                showConsole('Error: Failed to pull changes', true);
                showToast('Failed to pull changes', 'error');
            }
        });
    }

    // Commit changes
    function showCommitModal() {
        $('#commitModal').css('display', 'flex');
        $('#commitMessage').val('').focus();
    }

    function hideCommitModal() {
        $('#commitModal').hide();
    }

    function commitChanges() {
        const message = $('#commitMessage').val().trim();
        if (!message) {
            showToast('Please enter a commit message', 'warning');
            return;
        }

        hideCommitModal();
        showConsole('Committing changes...\n');

        $.ajax({
            url: 'api/commit-changes.php',
            method: 'POST',
            data: { message: message },
            dataType: 'json',
            success: function (response) {
                showConsole(response.output || response.message, true);
                if (response.success) {
                    showToast('Changes committed successfully', 'success');
                    setTimeout(() => {
                        refreshStatus();
                        loadCommitHistory();
                        loadRepoInfo();
                    }, 1000);
                } else {
                    showToast(response.message || 'Commit failed', 'error');
                }
            },
            error: function () {
                showConsole('Error: Failed to commit changes', true);
                showToast('Failed to commit changes', 'error');
            }
        });
    }

    // Push changes
    function pushChanges() {
        if (!confirm('Push commits to remote repository?')) return;

        showConsole('Pushing changes to remote...\n');

        $.ajax({
            url: 'api/push-changes.php',
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                showConsole(response.output || response.message, true);
                if (response.success) {
                    showToast('Changes pushed successfully', 'success');
                } else {
                    showToast(response.message || 'Push failed', 'error');
                }
            },
            error: function () {
                showConsole('Error: Failed to push changes', true);
                showToast('Failed to push changes', 'error');
            }
        });
    }

    // Branch operations
    function showBranchModal() {
        $('#branchModal').css('display', 'flex');
    }

    function hideBranchModal() {
        $('#branchModal').hide();
    }

    function checkoutBranch() {
        const branch = $('#branchSelect').val();
        if (!branch) {
            showToast('Please select a branch', 'warning');
            return;
        }

        if (!confirm(`Switch to branch "${branch}"?`)) return;

        hideBranchModal();
        showConsole(`Switching to branch ${branch}...\n`);

        $.ajax({
            url: 'api/checkout-branch.php',
            method: 'POST',
            data: { branch: branch },
            dataType: 'json',
            success: function (response) {
                showConsole(response.output || response.message, true);
                if (response.success) {
                    showToast('Branch switched successfully', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                } else {
                    showToast(response.message || 'Branch switch failed', 'error');
                }
            },
            error: function () {
                showConsole('Error: Failed to switch branch', true);
                showToast('Failed to switch branch', 'error');
            }
        });
    }

    // Initialize
    $(document).ready(function () {
        checkSSHKey();
        loadRepoInfo();
        refreshStatus();
        loadCommitHistory();
        loadBranches();
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>