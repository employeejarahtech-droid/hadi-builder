/**
 * TEXT Control - Refactored to extend BaseControl
 * Single-line text input control
 * 
 * Example usage:
 * const textControl = new TEXT('my_text', {
 *     label: 'Enter Text',
 *     default_value: 'Hello',
 *     placeholder: 'Type here...',
 *     validators: [Validator.required(), Validator.minLength(3)],
 *     condition: { name: 'show_text', operator: '===', value: 'yes' }
 * });
 */
class TEXT extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);

        // TEXT-specific properties
        this.inputType = args.input_type || 'text'; // text, email, url, tel, etc.
        this.maxLength = args.max_length || null;
        this.minLength = args.min_length || null;
        this.pattern = args.pattern || null;
        this.autocomplete = args.autocomplete || null;
    }

    /**
     * Render the text input
     * @returns {string} HTML string
     */
    render() {
        const attributes = [
            `type="${this.inputType}"`,
            `id="${this.id}"`,
            `name="${this.id}"`,
            `class="elementor-control-input"`,
            `placeholder="${this.placeholder}"`,
            `value="${this.escapeHtml(this.value)}"`,
            this.maxLength ? `maxlength="${this.maxLength}"` : '',
            this.pattern ? `pattern="${this.pattern}"` : '',
            this.autocomplete ? `autocomplete="${this.autocomplete}"` : '',
            this.disabled ? 'disabled' : '',
            this.required ? 'required' : ''
        ].filter(Boolean).join(' ');

        return `
            <div class="elementor-control-input-wrapper">
                <input ${attributes} />
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupListeners() {
        super.setupListeners();

        const $input = $(`#${this.id}`);

        // Update value on input
        $input.on('input', (e) => {
            const newValue = e.target.value;
            const oldValue = this.value;
            this.value = newValue;

            if (this.responsive) {
                this.deviceValues[this.currentDevice] = newValue;
            }

            this.handleChange(newValue, oldValue);
        });

        // Validate on blur
        $input.on('blur', () => {
            this.validate();
        });
    }

    /**
     * Get the current value
     * @returns {string} Current value
     */
    getValue() {
        const $input = $(`#${this.id}`);
        if ($input.length) {
            return $input.val();
        }
        return this.value;
    }

    /**
     * Set a new value
     * @param {string} newValue - New value
     * @param {boolean} silent - Don't emit change event
     */
    setValue(newValue, silent = false) {
        const oldValue = this.value;
        this.value = newValue;

        if (this.responsive) {
            this.deviceValues[this.currentDevice] = newValue;
        }

        // Update DOM
        const $input = $(`#${this.id}`);
        if ($input.length) {
            $input.val(newValue);
        }

        if (!silent && oldValue !== newValue) {
            this.handleChange(newValue, oldValue);
        }
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Static factory method (backward compatibility)
     * @param {array} args - [id, options]
     * @returns {string} Rendered HTML
     */
    static init(args) {
        const id = args[0];
        const options = args[1] || {};
        const instance = new TEXT(id, options);

        // Auto-register with control manager if available
        if (window.elementorControlManager) {
            window.elementorControlManager.registerControl(instance);
        }

        return instance.renderWithWrapper();
    }
}

// Export global
window.TEXT = TEXT;
