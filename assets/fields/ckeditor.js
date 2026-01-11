class CKEditorControl extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);
        this.height = args.height || '200px';
    }

    render() {
        return `
            <div class="elementor-control-input-wrapper">
                <textarea id="${this.id}" class="elementor-control-input ckeditor-input" rows="5" 
                    style="height: ${this.height}; visibility: hidden;">${this.value}</textarea>
            </div>
        `;
    }

    setupListeners() {
        super.setupListeners();

        // Load CKEditor if not already loaded
        if (typeof CKEDITOR === 'undefined') {
            this.loadScript('/assets/jquery/ck-editor/ckeditor.js')
                .then(() => this.initEditor())
                .catch(err => console.error('Failed to load CKEditor:', err));
        } else {
            this.initEditor();
        }
    }

    loadScript(src) {
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

    initEditor() {
        const $textarea = $(`#${this.id}`);
        if (!$textarea.length) return;

        // Destroy existing instance if any
        if (CKEDITOR.instances[this.id]) {
            CKEDITOR.instances[this.id].destroy(true);
        }

        CKEDITOR.disableAutoInline = true;

        try {
            const editor = CKEDITOR.replace(this.id, {
                height: this.height,
                toolbar: [
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
                    '/',
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                    { name: 'colors', items: ['TextColor', 'BGColor'] },
                    { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
                ]
            });

            editor.on('change', () => {
                const data = editor.getData();
                this.setValue(data);
            });

            // Sync initial value if needed
            editor.setData(this.value);

        } catch (e) {
            console.error('CKEditor Init Error:', e);
        }
    }

    destroy() {
        if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances[this.id]) {
            CKEDITOR.instances[this.id].destroy();
        }
        super.destroy();
    }
}

// Register with ControlManager
if (window.elementorControlManager) {
    window.elementorControlManager.registerControlType('ckeditor', CKEditorControl);
} else {
    // Fallback or early registration
    window.CKEditorControl = CKEditorControl;
}
