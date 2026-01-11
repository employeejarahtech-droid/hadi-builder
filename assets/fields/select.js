class SELECT extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);
        this.options = args.options || [];
    }

    render() {
        // Get current value (could be from parent or default)
        const currentValue = this.value || this.defaultValue;

        // Generate HTML for select options
        const optionsHtml = this.options.map(option => {
            const isSelected = option.value === currentValue ? 'selected' : '';
            return `<option value="${option.value}" ${isSelected}>${option.label}</option>`;
        }).join('');

        // Generate full HTML for select input
        return `
            <div class="elementor-control-input-wrapper">
                <select name="${this.id}" id="${this.id}" class="elementor-control-input">
                    ${this.placeholder ? `<option value="" disabled ${!currentValue ? 'selected' : ''}>${this.placeholder}</option>` : ''}
                    ${optionsHtml}
                </select>
            </div>
        `;
    }

    getValue() {
        const element = document.getElementById(this.id);
        return element ? element.value : this.value;
    }

    setValue(value, silent = false) {
        const oldValue = this.value;
        this.value = value;

        const element = document.getElementById(this.id);
        if (element) {
            element.value = value;
        }

        if (!silent) {
            this.handleChange(value, oldValue);
        }
    }

    setupListeners() {
        super.setupListeners();

        // Listen for change events on the select element
        const element = document.getElementById(this.id);
        if (element) {
            element.addEventListener('change', (e) => {
                const newValue = e.target.value;
                this.setValue(newValue);
            });
        }
    }

    static init(args, selector) {
        const id = args[0];
        const instance = new SELECT(id, args[1]);
        const html = instance.renderWithWrapper();

        if (selector) {
            document.querySelector(selector).innerHTML = html;
        }

        // Return HTML string for repeater compatibility
        return html;
    }
}

// Export global
window.SELECT = SELECT;

