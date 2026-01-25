/**
 * HTMLEditor Field - Standalone HTML Editor for Admin Forms
 * Uses CKEditor for rich text editing
 * 
 * Usage:
 * <script src="/assets/fields/htmleditor.js"></script>
 * <script>
 *   HTMLEditor.init('textarea_id', {
 *     height: '400px',
 *     toolbar: 'full' // or 'basic'
 *   });
 * </script>
 */

class HTMLEditor {
    /**
     * Initialize CKEditor on a textarea
     * @param {string} elementId - The ID of the textarea element
     * @param {object} options - Configuration options
     */
    static init(elementId, options = {}) {
        const defaults = {
            height: '400px',
            toolbar: 'full',
            removeButtons: '',
            format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address;div',
            removeDialogTabs: 'image:advanced;link:advanced'
        };

        const config = { ...defaults, ...options };

        // Load CKEditor if not already loaded
        if (typeof CKEDITOR === 'undefined') {
            this.loadScript('/assets/jquery/ck-editor/ckeditor.js')
                .then(() => this.createEditor(elementId, config))
                .catch(err => console.error('Failed to load CKEditor:', err));
        } else {
            this.createEditor(elementId, config);
        }
    }

    /**
     * Load CKEditor script dynamically
     */
    static loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Create the CKEditor instance
     */
    static createEditor(elementId, config) {
        if (typeof CKEDITOR === 'undefined') {
            console.error('CKEditor not loaded');
            return null;
        }

        CKEDITOR.disableAutoInline = true;

        // Destroy existing instance if any
        if (CKEDITOR.instances[elementId]) {
            CKEDITOR.instances[elementId].destroy(true);
        }

        // Get toolbar configuration
        const toolbarConfig = this.getToolbarConfig(config.toolbar);

        // Create editor
        const editor = CKEDITOR.replace(elementId, {
            height: config.height,
            toolbar: toolbarConfig,
            removeButtons: config.removeButtons,
            format_tags: config.format_tags,
            removeDialogTabs: config.removeDialogTabs,
            // Additional useful settings
            enterMode: CKEDITOR.ENTER_P,
            shiftEnterMode: CKEDITOR.ENTER_BR,
            autoParagraph: true,
            fillEmptyBlocks: false,
            allowedContent: true, // Allow all HTML
            extraAllowedContent: '*(*);*{*}', // Allow all classes and styles
        });

        // Auto-sync on form submit
        this.setupFormSync(elementId, editor);

        return editor;
    }

    /**
     * Get toolbar configuration based on preset
     */
    static getToolbarConfig(preset) {
        const toolbars = {
            full: [
                { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print'] },
                { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
                '/',
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'] },
                '/',
                { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                { name: 'colors', items: ['TextColor', 'BGColor'] },
                { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
            ],
            basic: [
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
                { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
                { name: 'links', items: ['Link', 'Unlink'] },
                { name: 'insert', items: ['Image', 'Table', 'HorizontalRule'] },
                '/',
                { name: 'styles', items: ['Format', 'FontSize'] },
                { name: 'colors', items: ['TextColor', 'BGColor'] },
                { name: 'tools', items: ['Maximize'] }
            ],
            minimal: [
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
                { name: 'links', items: ['Link', 'Unlink'] }
            ]
        };

        return toolbars[preset] || toolbars.full;
    }

    /**
     * Setup automatic form synchronization
     */
    static setupFormSync(elementId, editor) {
        const textarea = document.getElementById(elementId);
        if (!textarea) return;

        const form = textarea.closest('form');
        if (!form) return;

        // Sync data on form submit
        form.addEventListener('submit', function () {
            if (editor) {
                textarea.value = editor.getData();
            }
        });

        // Optional: Sync periodically
        setInterval(() => {
            if (editor) {
                textarea.value = editor.getData();
            }
        }, 5000); // Every 5 seconds
    }

    /**
     * Initialize multiple editors at once
     * @param {Array} configs - Array of {id, options} objects
     */
    static initMultiple(configs) {
        configs.forEach(config => {
            this.init(config.id, config.options || {});
        });
    }

    /**
     * Destroy an editor instance
     */
    static destroy(elementId) {
        if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances[elementId]) {
            CKEDITOR.instances[elementId].destroy(true);
        }
    }

    /**
     * Get editor instance
     */
    static getInstance(elementId) {
        if (typeof CKEDITOR !== 'undefined') {
            return CKEDITOR.instances[elementId];
        }
        return null;
    }

    /**
     * Get editor data
     */
    static getData(elementId) {
        const instance = this.getInstance(elementId);
        return instance ? instance.getData() : '';
    }

    /**
     * Set editor data
     */
    static setData(elementId, data) {
        const instance = this.getInstance(elementId);
        if (instance) {
            instance.setData(data);
        }
    }
}

// Auto-initialize editors with data-htmleditor attribute
document.addEventListener('DOMContentLoaded', function () {
    const editors = document.querySelectorAll('[data-htmleditor]');
    editors.forEach(textarea => {
        const height = textarea.getAttribute('data-height') || '400px';
        const toolbar = textarea.getAttribute('data-toolbar') || 'full';

        HTMLEditor.init(textarea.id, {
            height: height,
            toolbar: toolbar
        });
    });
});

// Make available globally
window.HTMLEditor = HTMLEditor;
