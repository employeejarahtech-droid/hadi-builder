/**
 * Media Control
 * Handles image selection with a WordPress-style modal
 */
class MediaControl extends BaseControl {

    constructor(id, args = {}) {
        super(id, args);
        this.trigger = args.trigger || {
            icon: 'fa fa-plus-circle',
            text: 'Choose Image'
        };
    }

    onInit() {
        this.ensureModalExists();
    }

    render() {
        // Handle value which could be string or object
        let url = '';
        if (typeof this.value === 'string') {
            url = this.value;
        } else if (this.value && this.value.url) {
            url = this.value.url;
        }

        const hasImage = !!url;

        // Prevent showing placeholder if URL is empty
        if (url === 'https://via.placeholder.com/800x600?text=Placeholder+Image') {
            // url = ''; // Keep placeholder if it's the default, or maybe let it show?
            // Let's keep it if it's a valid string
        }

        if (hasImage) {
            return `
                <div class="media-preview media-clickable-area">
                    <img src="${url}" class="media-preview-image" alt="Preview">
                    <div class="media-controls">
                        <button type="button" class="btn btn-secondary media-choose-btn">
                            <i class="fa fa-pencil"></i> Edit
                        </button>
                        <button type="button" class="btn btn-secondary media-remove-btn">
                            <i class="fa fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="media-preview-placeholder media-choose-btn media-clickable-area">
                    <div>
                        <i class="${this.trigger.icon}"></i>
                        <div>${this.trigger.text}</div>
                    </div>
                </div>
            `;
        }
    }

    setupListeners() {
        const $el = $(`[data-control-id="${this.id}"]`);

        // Clickable area (preview or placeholder) to open modal
        // We'll use a single unified handler for the entire area, including the Edit button
        $el.on('click', '.media-clickable-area', (e) => {
            // Ignore clicks on the Remove button
            if ($(e.target).closest('.media-remove-btn').length) {
                return;
            }

            // For all other clicks (Placeholder, Image, Edit Button), open the modal
            e.preventDefault();

            console.log('Media area clicked, opening modal for:', this.id);
            this.openModal();
        });

        // Remove button
        $el.on('click', '.media-remove-btn', (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log('Remove button clicked for:', this.id);

            // Clear the value
            this.setValue({ url: '' });

            // Find the media preview container and replace it
            const $mediaPreview = $el.find('.media-preview');

            if ($mediaPreview.length) {
                // Replace the preview with placeholder
                $mediaPreview.replaceWith(`
                    <div class="media-preview-placeholder media-choose-btn media-clickable-area">
                        <div>
                            <i class="${this.trigger.icon}"></i>
                            <div>${this.trigger.text}</div>
                        </div>
                    </div>
                `);
                console.log('Preview replaced with placeholder');
            } else {
                // Try to find it in the parent
                const $parentPreview = $el.closest('.elementor-control').find('.media-preview');
                if ($parentPreview.length) {
                    $parentPreview.replaceWith(`
                        <div class="media-preview-placeholder media-choose-btn media-clickable-area">
                            <div>
                                <i class="${this.trigger.icon}"></i>
                                <div>${this.trigger.text}</div>
                            </div>
                        </div>
                    `);
                    console.log('Parent preview replaced with placeholder');
                } else {
                    console.error('Could not find media preview element');
                    console.log('Available elements:', $el.closest('.elementor-control').html());
                }
            }

            // Trigger change event to update element manager
            this.emit('change', '');
        });
    }

    ensureModalExists() {
        if ($('#media-modal-overlay').length > 0) return;

        const modalHtml = `
            <div class="media-modal-overlay" id="media-modal-overlay" style="display: none;">
                <div class="media-modal">
                    <div class="media-modal-header">
                        <div class="media-modal-title">Select or Upload Media</div>
                        <button type="button" class="media-modal-close">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                    <div class="media-modal-tabs">
                        <div class="media-modal-tab active" data-tab="upload">Upload Files</div>
                        <div class="media-modal-tab" data-tab="library">Media Library</div>
                    </div>
                    <div class="media-modal-body">
                        <!-- Upload Tab -->
                        <div class="media-tab-content active" id="media-tab-upload">
                            <div class="media-upload-area">
                                <i class="fa fa-cloud-upload-alt"></i>
                                <div>Drop files to upload</div>
                                <div style="font-size: 12px; margin-top: 5px;">or</div>
                                <button type="button" class="btn btn-primary media-select-files-btn" style="margin-top: 10px;">Select Files</button>
                                <input type="file" id="media-upload-input" multiple style="display: none;">
                            </div>
                        </div>

                        <!-- Library Tab -->
                        <div class="media-tab-content" id="media-tab-library">
                            <div class="media-library-header">
                                <div class="media-library-title">Media Library</div>
                                <div class="media-library-actions">
                                    <button type="button" class="btn btn-small btn-secondary media-refresh-btn">
                                        <i class="fa fa-refresh"></i> Refresh
                                    </button>
                                </div>
                            </div>
                            <div class="media-library-grid">
                                <!-- Placeholders will be injected here -->
                                <div class="media-loading">Loading media...</div>
                            </div>
                        </div>
                    </div>
                    <div class="media-modal-footer">
                        <div class="media-footer-left">
                            <button type="button" class="btn btn-danger media-delete-selected-btn" style="display: none;">
                                <i class="fa fa-trash"></i> Delete Selected
                            </button>
                        </div>
                        <div class="media-footer-right">
                            <button type="button" class="btn btn-secondary media-modal-close-btn">Cancel</button>
                            <button type="button" class="btn btn-primary media-modal-insert-btn" disabled>Insert Media</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHtml);
        this.setupModalListeners();
    }

    setupModalListeners() {
        const $modal = $('#media-modal-overlay');

        // Close functions
        const closeModal = () => {
            if (MediaControl.activeInstance) {
                MediaControl.activeInstance.closeModal();
            } else {
                $modal.hide().removeClass('active');
            }
        };

        $modal.on('click', '.media-modal-close, .media-modal-close-btn', closeModal);

        $modal.on('click', (e) => {
            if (e.target === $modal[0]) {
                closeModal();
            }
        });

        // Tabs
        $modal.on('click', '.media-modal-tab', function () {
            const tab = $(this).data('tab');
            $('.media-modal-tab').removeClass('active');
            $(this).addClass('active');
            $('.media-tab-content').removeClass('active');
            $(`#media-tab-${tab}`).addClass('active');

            // Fetch media when switching to library
            if (tab === 'library') {
                if (MediaControl.activeInstance) {
                    MediaControl.activeInstance.fetchMedia();
                }
            }
        });

        // Library Item Actions
        $modal.on('click', '.media-item-select-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const $item = $(this).closest('.media-library-item');

            $('.media-library-item').removeClass('selected');
            $item.addClass('selected');
            $('.media-modal-insert-btn').prop('disabled', false);
            $('.media-delete-selected-btn').show();
        });

        // Library Item Click (select)
        $modal.on('click', '.media-library-item', function (e) {
            // Don't select if clicking on buttons
            if ($(e.target).closest('.media-item-overlay').length) {
                return;
            }

            $('.media-library-item').removeClass('selected');
            $(this).addClass('selected');
            $('.media-modal-insert-btn').prop('disabled', false);
            $('.media-delete-selected-btn').show();
        });

        // Delete Media Item
        $modal.on('click', '.media-item-delete-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $item = $(this).closest('.media-library-item');
            const mediaId = $item.data('id');
            const mediaName = $item.find('.media-item-name').text();

            if (confirm(`Are you sure you want to delete "${mediaName}"? This action cannot be undone.`)) {
                MediaControl.deleteMedia(mediaId, $item);
            }
        });

        // Delete Selected Button
        $modal.on('click', '.media-delete-selected-btn', function (e) {
            e.preventDefault();
            const $selected = $('.media-library-item.selected');
            if ($selected.length === 0) return;

            const mediaId = $selected.data('id');
            const mediaName = $selected.find('.media-item-name').text();

            if (confirm(`Are you sure you want to delete "${mediaName}"? This action cannot be undone.`)) {
                MediaControl.deleteMedia(mediaId, $selected);
            }
        });

        // Refresh Button
        $modal.on('click', '.media-refresh-btn', function (e) {
            e.preventDefault();
            if (MediaControl.activeInstance) {
                MediaControl.activeInstance.fetchMedia();
            }
        });

        // Insert
        $modal.on('click', '.media-modal-insert-btn', () => {
            const $selected = $('.media-library-item.selected img');
            if ($selected.length && MediaControl.activeInstance) {
                const imageUrl = $selected.attr('src');

                // Set the value
                MediaControl.activeInstance.setValue({ url: imageUrl });

                // Update the UI to show the selected image
                const $controlWrapper = $(`[data-control-id="${MediaControl.activeInstance.id}"]`);
                const $content = $controlWrapper.closest('.elementor-control').find('.elementor-control-content');

                if ($content.length) {
                    $content.html(`
                        <div class="media-preview media-clickable-area">
                            <img src="${imageUrl}" class="media-preview-image" alt="Preview">
                            <div class="media-controls">
                                <button type="button" class="btn btn-secondary media-choose-btn">
                                    <i class="fa fa-pencil"></i> Edit
                                </button>
                                <button type="button" class="btn btn-secondary media-remove-btn">
                                    <i class="fa fa-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    `);
                    console.log('Updated preview with selected image:', imageUrl);
                }

                MediaControl.activeInstance.closeModal();
            }
        });

        // Upload Handling

        // 1. Browse Button
        $modal.on('click', '.media-select-files-btn', function (e) {
            e.preventDefault();
            $('#media-upload-input').click();
        });

        // 2. Click on area triggers input too (optional, but good UX)
        $modal.on('click', '.media-upload-area', function (e) {
            // Prevent recursion: don't trigger if clicking the input itself or the button
            if ($(e.target).is('#media-upload-input') || $(e.target).closest('.media-select-files-btn').length) {
                return;
            }

            // Allow clicking on icon, text, or background
            if (e.target === this || $(e.target).hasClass('fa') || $(e.target).parent().hasClass('media-upload-area')) {
                $('#media-upload-input').click();
            }
        });

        // 3. File Input Change
        $modal.on('change', '#media-upload-input', function () {
            console.log('File input changed:', this.files);
            try {
                if (this.files && this.files.length > 0) {
                    if (MediaControl.activeInstance) {
                        MediaControl.activeInstance.uploadMedia(this.files);
                    } else {
                        console.error('No active MediaControl instance found for upload.');
                    }
                }
            } catch (err) {
                console.error('Error in file selection handler:', err);
                Toast.error('An error occurred during file selection: ' + err.message);
            }
            // Reset val so same file can be selected again if needed
            $(this).val('');
        });
    }

    fetchMedia() {
        const $grid = $('.media-library-grid');
        $grid.html('<div class="media-loading">Loading media...</div>');

        // Use global API base if available, otherwise default to relative 'api/'
        const apiBase = window.CMS_API_BASE || 'api/';

        // Ensure strictly one slash between base and endpoint to avoid // or missing /
        const listUrl = apiBase + 'media/list.php';
        console.log('Fetching media from:', listUrl);

        fetch(listUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                $grid.empty();

                if (data.success && data.data && data.data.length > 0) {
                    data.data.forEach(image => {
                        $grid.append(`
                            <div class="media-library-item" data-id="${image.id}">
                                <img src="${image.url}" alt="${image.name}" title="${image.name}">
                                <div class="media-item-overlay">
                                    <button type="button" class="media-item-select-btn" title="Select">
                                        <i class="fa fa-check"></i>
                                    </button>
                                    <button type="button" class="media-item-delete-btn" title="Delete">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                                <div class="media-item-info">
                                    <div class="media-item-name">${image.name}</div>
                                </div>
                            </div>
                        `);
                    });

                    // Re-select current value if exists
                    this.highlightCurrentSelection();

                } else {
                    $grid.html('<div class="media-empty">No media files found. Upload some!</div>');
                }
            })
            .catch(err => {
                console.error('Error fetching media:', err);
                $grid.html(`<div class="media-error">Failed to load media: ${err.message}</div>`);
            });
    }

    uploadMedia(files) {
        console.log('Starting upload for files:', files);

        // Switch to library tab to show progress/result
        $('[data-tab="library"]').click();

        // Use global API base
        const apiBase = window.CMS_API_BASE || 'api/';
        const uploadUrl = apiBase + 'media/upload.php';
        console.log('Upload URL:', uploadUrl);

        const $grid = $('.media-library-grid');

        Array.from(files).forEach(file => {
            const formData = new FormData();
            formData.append('file', file);

            fetch(uploadUrl, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    return response.text().then(text => {
                        if (!response.ok) {
                            throw new Error(`Server Error (${response.status}): ${text.substring(0, 200)}...`);
                        }
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            console.error('Invalid JSON:', text);
                            throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
                        }
                    });
                })
                .then(data => {
                    if (data.success) {
                        console.log('Upload success:', data);
                        // Prepend new image
                        const itemHtml = `
                        <div class="media-library-item selected" data-id="${data.data.id}">
                            <img src="${data.data.url}" alt="${data.data.name}">
                            <div class="media-item-overlay">
                                <button type="button" class="media-item-select-btn" title="Select">
                                    <i class="fa fa-check"></i>
                                </button>
                                <button type="button" class="media-item-delete-btn" title="Delete">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                            <div class="media-item-info">
                                <div class="media-item-name">${data.data.name}</div>
                            </div>
                        </div>
                    `;

                        // Remove "empty" message if it exists
                        if ($grid.find('.media-empty').length) {
                            $grid.empty();
                        }

                        $('.media-library-item').removeClass('selected');
                        $grid.prepend(itemHtml);

                        // Enable insert
                        $('.media-modal-insert-btn').prop('disabled', false);

                    } else {
                        console.error('Upload failed with message:', data.message);
                        Toast.error('Upload failed: ' + data.message);
                    }
                })
                .catch(err => {
                    console.error('Upload Error Details:', err);
                    Toast.error('Upload error: ' + err.message);
                });
        });
    }

    highlightCurrentSelection() {
        let currentUrl = this.value;
        if (typeof currentUrl === 'object') currentUrl = currentUrl.url;

        if (currentUrl) {
            $(`.media-library-item img[src="${currentUrl}"]`).parent().addClass('selected');
            if ($('.media-library-item.selected').length > 0) {
                $('.media-modal-insert-btn').prop('disabled', false);
            }
        }
    }

    openModal() {
        console.log('MediaControl.openModal called for:', this.id);

        if ($('#media-modal-overlay').length === 0) {
            console.warn('Media Modal not found in DOM! Attempting to create it...');
            this.ensureModalExists();
        }

        MediaControl.activeInstance = this;

        const $modal = $('#media-modal-overlay');

        // Always fetch latest media when opening
        this.fetchMedia();

        $('.media-modal-insert-btn').prop('disabled', true);

        // Force show
        $modal.css({
            'display': 'flex',
            'visibility': 'visible',
            'opacity': '1',
            'z-index': '99999'
        }).addClass('active');
    }

    closeModal() {
        console.log('MediaControl.closeModal');
        $('#media-modal-overlay').hide().removeClass('active');
        MediaControl.activeInstance = null;
    }

    // Update preview UI without full re-render
    updatePreviewUI($el, url) {
        const $wrapper = $el.closest('.elementor-control-content');

        if (!url || url === '') {
            // Show placeholder
            $wrapper.html(`
                <div class="media-preview-placeholder media-choose-btn media-clickable-area">
                    <div>
                        <i class="${this.trigger.icon}"></i>
                        <div>${this.trigger.text}</div>
                    </div>
                </div>
            `);
        } else {
            // Show preview
            $wrapper.html(`
                <div class="media-preview media-clickable-area">
                    <img src="${url}" class="media-preview-image" alt="Preview">
                    <div class="media-controls">
                        <button type="button" class="btn btn-secondary media-choose-btn">
                            <i class="fa fa-pencil"></i> Edit
                        </button>
                        <button type="button" class="btn btn-secondary media-remove-btn">
                            <i class="fa fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `);
        }
    }

    // Static method to delete media
    static deleteMedia(mediaId, $element) {
        const apiBase = window.CMS_API_BASE || 'api/';
        const deleteUrl = apiBase + 'media/delete.php';

        // Show loading state
        $element.addClass('deleting');

        fetch(deleteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: mediaId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove element with animation
                $element.fadeOut(300, function() {
                    $(this).remove();

                    // Hide delete button if no items left
                    if ($('.media-library-item').length === 0) {
                        $('.media-delete-selected-btn').hide();
                        $('.media-library-grid').html('<div class="media-empty">No media files found. Upload some!</div>');
                    }
                });

                Toast.success('Media deleted successfully');
            } else {
                Toast.error('Failed to delete media: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(err => {
            console.error('Delete error:', err);
            Toast.error('Error deleting media: ' + err.message);
        })
        .finally(() => {
            $element.removeClass('deleting');
        });
    }
}

// Static property to track active instance
MediaControl.activeInstance = null;

// Export to global scope
window.MediaControl = MediaControl;
