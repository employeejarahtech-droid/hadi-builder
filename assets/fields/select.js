class SELECT {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Select';
        this.defaultValue = args.default_value || '';
        this.placeholder = args.placeholder || 'Select an option';
        this.options = args.options || [];
        this.labelBlock = args.label_block || false;
    }

    render() {
        // Generate HTML for select options
        const optionsHtml = this.options.map(option => {
            const isSelected = option.value === this.defaultValue ? 'selected' : '';
            return `<option value="${option.value}" ${isSelected}>${option.label}</option>`;
        }).join('');

        // Generate full HTML for select input
        return `
            <div class="elementor-control">
                <div class="elementor-control-label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="elementor-control-input-wrapper">
                    <select name="${this.id}" id="${this.id}" class="elementor-control-input">
                        <option value="" disabled ${!this.defaultValue ? 'selected' : ''}>${this.placeholder}</option>
                        ${optionsHtml}
                    </select>
                </div>
            </div>
        `;
    }

    renderWithWrapper() {
        return this.render();
    }

    getValue() {
        const element = document.getElementById(this.id);
        return element ? element.value : this.defaultValue;
    }

    setValue(value) {
        this.value = value || this.defaultValue;
        const element = document.getElementById(this.id);
        if (element) {
            element.value = this.value;
        }
    }

    setupListeners() {
        // Native select doesn't need additional listeners
        // Change events will be handled by the main page builder
    }

    init() {
        // Native select doesn't need additional initialization
    }

    static init(args, selector) {
        const id = args[0];
        const instance = new SELECT(id, args[1]);
        const html = instance.render();
        
        if (selector) {
            document.querySelector(selector).innerHTML = html;
        }
        
        return instance;
    }
}
