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

    // Copy methods from TEXT or generic ones if BaseControl doesn't cover
    // BaseControl handles logic, this just renders specific HTML
}
