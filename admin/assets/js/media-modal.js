/**
 * Media Modal Component
 * Handles image upload and selection
 */
class MediaModal {
    constructor(options = {}) {
        this.onSelect = options.onSelect || function () { };
        this.apiUrl = options.apiUrl || null; // Add API URL support
        this.selectedImages = [];
        this.init();
    }

    init() {
        this.createModal();
        this.attachEvents();
    }

    createModal() {
        const modalHTML = `
            <div class="media-modal-overlay" id="media-modal-overlay">
                <div class="media-modal">
                    <div class="media-modal-header">
                        <div class="media-modal-title">Select or Upload Media</div>
                        <button type="button" class="media-modal-close">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                    <div class="media-modal-tabs">
                        <div class="media-modal-tab active" data-tab="library">Media Library</div>
                        <div class="media-modal-tab" data-tab="upload">Upload Files</div>
                    </div>
                    <div class="media-modal-body">
                        <!-- Library Tab -->
                        <div class="media-tab-content active" id="media-tab-library">
                            <div class="media-library-header">
                                <div class="media-library-title">Media Library</div>
                                <div class="media-library-actions">
                                    <button type="button" class="btn btn-small btn-secondary media-refresh-btn">
                                        <i class="fa fa-refresh"></i> Refresh
                                    </button>
                                </div>
                            </div>
                            <div class="media-library-grid" id="media-library-grid">
                                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">
                                    <i class="fa fa-spinner fa-spin" style="font-size: 32px;"></i>
                                    <div style="margin-top: 10px;">Loading...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Upload Tab -->
                        <div class="media-tab-content" id="media-tab-upload">
                            <div class="media-upload-area" id="media-upload-area">
                                <i class="fa fa-cloud-upload-alt"></i>
                                <div>Drop files to upload</div>
                                <div style="font-size: 12px; margin-top: 5px;">or</div>
                                <button type="button" class="btn btn-primary media-select-files-btn" style="margin-top: 10px;">Select Files</button>
                                <input type="file" id="media-upload-input" multiple accept="image/*" style="display: none;">
                                <div style="font-size: 11px; color: #94a3b8; margin-top: 15px;">Maximum file size: 5MB. Supported: JPEG, PNG, GIF, WebP</div>
                            </div>
                            <div id="upload-progress" style="display: none; margin-top: 20px;">
                                <div style="background: #f1f5f9; border-radius: 4px; height: 8px; overflow: hidden;">
                                    <div id="progress-bar" style="background: #3b82f6; height: 100%; width: 0%; transition: width 0.3s;"></div>
                                </div>
                                <p id="upload-status" style="text-align: center; margin-top: 10px; color: #64748b;"></p>
                            </div>
                        </div>
                    </div>
                    <div class="media-modal-footer">
                        <div class="media-footer-left">
                            <span id="selected-count" style="color: #64748b; font-size: 14px;"></span>
                        </div>
                        <div class="media-footer-right">
                            <button type="button" class="btn btn-secondary media-modal-close-btn">Cancel</button>
                            <button type="button" class="btn btn-primary media-modal-insert-btn">Insert Media</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existing = document.getElementById('media-modal-overlay');
        if (existing) existing.remove();

        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEvents() {
        const overlay = document.getElementById('media-modal-overlay');

        // Close buttons
        overlay.querySelectorAll('.media-modal-close, .media-modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        // Tab switching
        overlay.querySelectorAll('.media-modal-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Upload events
        const uploadArea = document.getElementById('media-upload-area');
        const fileInput = document.getElementById('media-upload-input');

        document.querySelector('.media-select-files-btn').addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        // Refresh button
        document.querySelector('.media-refresh-btn').addEventListener('click', () => {
            this.loadLibrary();
        });

        // Insert button
        document.querySelector('.media-modal-insert-btn').addEventListener('click', () => {
            if (this.selectedImages.length > 0) {
                this.onSelect(this.selectedImages[0]);
                this.close();
            }
        });
    }

    switchTab(tabName) {
        // Update tabs
        document.querySelectorAll('.media-modal-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update content
        document.querySelectorAll('.media-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `media-tab-${tabName}`);
        });
    }


    async loadLibrary(galleryData = null) {
        const grid = document.getElementById('media-library-grid');

        let images = galleryData;

        // If no data passed, and we have an API URL, fetch it
        if (!images && this.apiUrl) {
            try {
                // Show loading state if grid is empty
                if (!grid.hasChildNodes() || grid.innerHTML.includes('Loading')) {
                    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;"><i class="fa fa-spinner fa-spin" style="font-size: 32px;"></i><div style="margin-top: 10px;">Loading library...</div></div>';
                }

                const response = await fetch(this.apiUrl);
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    // Map API data format to internal format if needed
                    // API returns { id, url, name, created_at }
                    // We need { id, file_path, file_name }
                    images = result.data.map(img => ({
                        id: img.id,
                        file_path: img.url,
                        file_name: img.name
                    }));
                }
            } catch (e) {
                console.error('Failed to load library:', e);
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">Failed to load images from server</div>';
                return;
            }
        }

        // Fallback to scraping if still no images and no API URL (legacy support)
        if (!images && !this.apiUrl) {
            // ... existing scraping logic ...
            // Simplified for now, assuming API is preferred
        }

        if (!images) images = []; // safety

        if (images.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">No images found. Upload some images to get started.</div>';
            return;
        }

        grid.innerHTML = images.map(img => `
            <div class="media-library-item" data-id="${img.id}" data-path="${img.file_path}">
                <img src="${img.file_path}" alt="${img.file_name}" title="${img.file_name}">
                <div class="media-item-overlay">
                    <button type="button" class="media-item-select-btn" title="Select">
                        <i class="fa fa-check"></i>
                    </button>
                </div>
                <div class="media-item-info">
                    <div class="media-item-name">${img.file_name}</div>
                </div>
            </div>
        `).join('');


        // Attach click events - use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const items = grid.querySelectorAll('.media-library-item');
            items.forEach(item => {
                item.addEventListener('click', () => {
                    this.selectImage(item);
                });
            });
        }, 100);
    }

    async handleFiles(files) {
        const formData = new FormData();
        formData.append('file', files[0]);

        const progressDiv = document.getElementById('upload-progress');
        const progressBar = document.getElementById('progress-bar');
        const statusText = document.getElementById('upload-status');

        progressDiv.style.display = 'block';
        progressBar.style.width = '0%';
        statusText.textContent = 'Uploading...';
        statusText.style.color = '#64748b';

        try {
            const response = await fetch('/api/upload-image.php', { // Ensure path is correct or passed via options
                method: 'POST',
                body: formData
            });

            // Handle non-JSON responses gracefully
            const textResult = await response.text();
            let result;
            try {
                result = JSON.parse(textResult);
            } catch (e) {
                throw new Error('Invalid server response');
            }

            if (result.success) {
                progressBar.style.width = '100%';
                statusText.textContent = 'Upload complete!';
                statusText.style.color = '#10b981';

                // Switch to library tab and refresh
                setTimeout(() => {
                    this.switchTab('library');
                    // Refresh library using API
                    this.loadLibrary(null);
                }, 1000);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            progressBar.style.width = '0%';
            statusText.textContent = 'Upload failed: ' + error.message;
            statusText.style.color = '#ef4444';
        }
    }

    open(galleryData = null) {
        const overlay = document.getElementById('media-modal-overlay');
        overlay.classList.add('active');
        this.selectedImages = [];
        document.getElementById('selected-count').textContent = '';
        this.loadLibrary(galleryData);
    }

    selectImage(item) {
        // Toggle selection
        const id = item.dataset.id;
        const path = item.dataset.path;
        const index = this.selectedImages.findIndex(img => img.id == id);

        // For now, simple single select behavior (replace selection)
        // To support multi-select, check if shift key pressed? 
        // But UI suggests "Insert Media", so maybe single select is safer default for now or toggle.

        // Clear previous selections
        const grid = document.getElementById('media-library-grid');
        grid.querySelectorAll('.media-library-item').forEach(el => el.classList.remove('selected'));
        this.selectedImages = [];

        if (index === -1) {
            // Select it
            item.classList.add('selected');
            this.selectedImages.push({
                id: id,
                file_path: path
            });
        }

        // Update footer count
        const count = this.selectedImages.length;
        document.getElementById('selected-count').textContent = count > 0 ? `${count} selected` : '';
    }

    close() {
        const overlay = document.getElementById('media-modal-overlay');
        overlay.classList.remove('active');
        this.selectedImages = [];
    }
}

// Export for use
window.MediaModal = MediaModal;
