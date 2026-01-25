/**
 * SummernoteControl - Summernote Editor Control for Widget Builder
 * Extends BaseControl to provide Summernote WYSIWYG editor
 */
class SummernoteControl extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);
        this.height = args.height || '200px';
        this.toolbar = args.toolbar || 'basic';
    }

    render() {
        return `
            <div class="elementor-control-input-wrapper">
                <textarea id="${this.id}" class="elementor-control-input summernote-input" rows="5" 
                    style="height: ${this.height}; visibility: hidden;">${this.escapeHtml(this.value)}</textarea>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupListeners() {
        super.setupListeners();

        // Load Summernote if not already loaded
        this.loadSummernote()
            .then(() => this.initEditor())
            .catch(err => console.error('Failed to load Summernote:', err));
    }

    loadSummernote() {
        return new Promise((resolve, reject) => {
            // Check if jQuery is loaded
            if (typeof $ === 'undefined') {
                reject(new Error('jQuery is required for Summernote'));
                return;
            }

            // Check if Summernote is already loaded
            if (typeof $.fn.summernote !== 'undefined') {
                resolve();
                return;
            }

            // Load CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css';
            document.head.appendChild(cssLink);

            // Load JS
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initEditor() {
        const $textarea = $(`#${this.id}`);
        if (!$textarea.length) return;

        // Destroy existing instance if any
        if ($textarea.data('summernote')) {
            $textarea.summernote('destroy');
        }

        try {
            // Get toolbar configuration
            const toolbarConfig = this.getToolbarConfig(this.toolbar);

            // Initialize Summernote
            $textarea.summernote({
                height: parseInt(this.height) || 200,
                toolbar: toolbarConfig,
                callbacks: {
                    onChange: (contents) => {
                        this.setValue(contents);
                    },
                    onInit: () => {
                        // Set initial value
                        if (this.value) {
                            $textarea.summernote('code', this.value);
                        }
                    }
                }
            });

        } catch (e) {
            console.error('Summernote Init Error:', e);
        }
    }

    getToolbarConfig(preset) {
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
                ['font', ['strikethrough']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['link', 'picture']],
                ['view', ['codeview']]
            ],
            minimal: [
                ['style', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']],
                ['insert', ['link']],
                ['view', ['codeview']]
            ]
        };

        return toolbars[preset] || toolbars.basic;
    }

    destroy() {
        const $textarea = $(`#${this.id}`);
        if ($textarea.length && $textarea.data('summernote')) {
            $textarea.summernote('destroy');
        }
        super.destroy();
    }
}

// Register with ControlManager
if (window.elementorControlManager) {
    window.elementorControlManager.registerControlType('summernote', SummernoteControl);
} else {
    // Fallback or early registration
    window.SummernoteControl = SummernoteControl;
}
