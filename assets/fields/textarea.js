/**
 * TEXTAREA Control - Refactored to extend BaseControl
 * Multi-line text input control
 */
class TEXTAREA extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);
        this.rows = args.rows || 5;
    }

    render() {
        return `
            <div class="elementor-control-input-wrapper">
                <textarea 
                    id="${this.id}" 
                    name="${this.id}" 
                    class="elementor-control-input" 
                    rows="${this.rows}"
                    placeholder="${this.placeholder}"
                    ${this.disabled ? 'disabled' : ''}
                    ${this.required ? 'required' : ''}
                >${this.escapeHtml(this.value)}</textarea>
            </div>
        `;
    }

    setupListeners() {
        super.setupListeners();
        const $input = $(`#${this.id}`);

        $input.on('input', (e) => {
            const newValue = e.target.value;
            const oldValue = this.value;
            this.value = newValue;
            this.handleChange(newValue, oldValue);
        });

        $input.on('blur', () => {
            this.validate();
        });
    }

    /**
     * Get the current value
     * Reads directly from DOM to ensure accuracy
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
     */
    setValue(newValue, silent = false) {
        const oldValue = this.value;
        this.value = newValue;

        // Update DOM
        const $input = $(`#${this.id}`);
        if ($input.length) {
            $input.val(newValue);
        }

        if (!silent && oldValue !== newValue) {
            this.handleChange(newValue, oldValue);
        }
    }
}

// Export global
window.TEXTAREA = TEXTAREA;
