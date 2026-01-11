class COLOR {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Color';
        this.defaultValue = args.default_value || '#000000';
        this.value = args.value || this.defaultValue;
        // Ensure value starts with #
        if (this.value && !this.value.startsWith('#')) {
            this.value = '#' + this.value;
        }
        if (this.defaultValue && !this.defaultValue.startsWith('#')) {
            this.defaultValue = '#' + this.defaultValue;
        }
    }

    render() {
        return `
            <div class="elementor-control">
                <div class="elementor-control-label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="elementor-control-input-wrapper">
                    <input type="color" id="${this.id}" name="${this.id}" value="${this.value}" class="elementor-control-input">
                </div>
            </div>
        `;
    }

    renderWithWrapper() {
        return this.render();
    }

    getValue() {
        const element = document.getElementById(this.id);
        return element ? element.value : this.value;
    }

    setValue(value) {
        if (value && !value.startsWith('#')) {
            value = '#' + value;
        }
        this.value = value || this.defaultValue;
        const element = document.getElementById(this.id);
        if (element) {
            element.value = this.value;
        }
    }

    setupListeners() {
        // Native color input doesn't need additional listeners
        // Change events will be handled by the main page builder
    }

    init() {
        // Native color input doesn't need additional initialization
    }

    static init(args, selector) {
        const id = args[0];
        const instance = new COLOR(id, args[1]);
        const html = instance.render();

        if (selector) {
            document.querySelector(selector).innerHTML = html;
        }

        // Return HTML string for repeater compatibility
        return html;
    }
}

// Export global
window.COLOR = COLOR;
