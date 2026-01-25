/**
 * Summernote Field - Lightweight HTML Editor for Admin Forms
 * Uses Summernote WYSIWYG editor
 * 
 * Usage:
 * <script src="/assets/fields/summernote.js"></script>
 * <script>
 *   SummernoteEditor.init('textarea_id', {
 *     height: 300,
 *     toolbar: 'full' // or 'basic', 'minimal'
 *   });
 * </script>
 */

class SummernoteEditor {
    static loaded = false;
    static loading = false;
    static loadCallbacks = [];

    /**
     * Initialize Summernote on a textarea
     * @param {string} elementId - The ID of the textarea element
     * @param {object} options - Configuration options
     */
    static init(elementId, options = {}) {
        const defaults = {
            height: 300,
            toolbar: 'full',
            placeholder: 'Enter text here...',
            tabsize: 2,
            focus: false
        };

        const config = { ...defaults, ...options };

        // Load Summernote if not already loaded
        if (!this.loaded) {
            this.loadLibrary()
                .then(() => this.createEditor(elementId, config))
                .catch(err => console.error('Failed to load Summernote:', err));
        } else {
            this.createEditor(elementId, config);
        }
    }

    /**
     * Load Summernote library from CDN
     */
    static loadLibrary() {
        if (this.loaded) {
            return Promise.resolve();
        }

        if (this.loading) {
            return new Promise((resolve) => {
                this.loadCallbacks.push(resolve);
            });
        }

        this.loading = true;

        return Promise.all([
            this.loadCSS('https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css'),
            this.loadScript('https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js')
        ]).then(() => {
            this.loaded = true;
            this.loading = false;
            // Call all waiting callbacks
            this.loadCallbacks.forEach(cb => cb());
            this.loadCallbacks = [];
        });
    }

    /**
     * Load CSS file
     */
    static loadCSS(href) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Load JavaScript file
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
     * Create the Summernote instance
     */
    static createEditor(elementId, config) {
        if (typeof $ === 'undefined' || typeof $.fn.summernote === 'undefined') {
            console.error('Summernote or jQuery not loaded');
            return null;
        }

        const $element = $(`#${elementId}`);
        if (!$element.length) {
            console.error(`Element #${elementId} not found`);
            return null;
        }

        // Destroy existing instance if any
        if ($element.data('summernote')) {
            $element.summernote('destroy');
        }

        // Get toolbar configuration
        const toolbarConfig = this.getToolbarConfig(config.toolbar);

        // Initialize Summernote
        $element.summernote({
            height: config.height,
            placeholder: config.placeholder,
            tabsize: config.tabsize,
            focus: config.focus,
            toolbar: toolbarConfig,
            callbacks: {
                onChange: function (contents) {
                    // Auto-sync with textarea
                    $element.val(contents);
                }
            }
        });

        // Setup form sync
        this.setupFormSync(elementId);

        return $element;
    }

    /**
     * Get toolbar configuration based on preset
     */
    static getToolbarConfig(preset) {
        const toolbars = {
            full: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            basic: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['link', 'picture', 'table']],
                ['view', ['fullscreen', 'codeview']]
            ],
            minimal: [
                ['style', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']],
                ['insert', ['link']],
                ['view', ['codeview']]
            ],
            simple: [
                ['style', ['bold', 'italic']],
                ['para', ['ul', 'ol']],
                ['insert', ['link']]
            ]
        };

        return toolbars[preset] || toolbars.full;
    }

    /**
     * Setup automatic form synchronization
     */
    static setupFormSync(elementId) {
        const $element = $(`#${elementId}`);
        if (!$element.length) return;

        const form = $element.closest('form')[0];
        if (!form) return;

        // Sync data on form submit
        $(form).on('submit', function () {
            const code = $element.summernote('code');
            $element.val(code);
        });
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
        const $element = $(`#${elementId}`);
        if ($element.length && $element.data('summernote')) {
            $element.summernote('destroy');
        }
    }

    /**
     * Get editor content
     */
    static getCode(elementId) {
        const $element = $(`#${elementId}`);
        if ($element.length && $element.data('summernote')) {
            return $element.summernote('code');
        }
        return '';
    }

    /**
     * Set editor content
     */
    static setCode(elementId, html) {
        const $element = $(`#${elementId}`);
        if ($element.length && $element.data('summernote')) {
            $element.summernote('code', html);
        }
    }

    /**
     * Check if editor is empty
     */
    static isEmpty(elementId) {
        const $element = $(`#${elementId}`);
        if ($element.length && $element.data('summernote')) {
            return $element.summernote('isEmpty');
        }
        return true;
    }

    /**
     * Reset editor
     */
    static reset(elementId) {
        const $element = $(`#${elementId}`);
        if ($element.length && $element.data('summernote')) {
            $element.summernote('reset');
        }
    }

    /**
     * Disable editor
     */
    static disable(elementId) {
        const $element = $(`#${elementId}`);
        if ($element.length && $element.data('summernote')) {
            $element.summernote('disable');
        }
    }

    /**
     * Enable editor
     */
    static enable(elementId) {
        const $element = $(`#${elementId}`);
        if ($element.length && $element.data('summernote')) {
            $element.summernote('enable');
        }
    }
}

// Auto-initialize editors with data-summernote attribute
$(document).ready(function () {
    $('[data-summernote]').each(function () {
        const id = $(this).attr('id');
        if (!id) {
            console.warn('Summernote element must have an ID');
            return;
        }

        const height = $(this).data('height') || 300;
        const toolbar = $(this).data('toolbar') || 'full';
        const placeholder = $(this).data('placeholder') || 'Enter text here...';

        SummernoteEditor.init(id, {
            height: height,
            toolbar: toolbar,
            placeholder: placeholder
        });
    });
});

// Make available globally
window.SummernoteEditor = SummernoteEditor;
