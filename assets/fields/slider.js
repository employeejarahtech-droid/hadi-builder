class SLIDER {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Slider';
        this.min = args.range?.min || 0;
        this.max = args.range?.max || 100;
        this.step = args.range?.step || 1;
        this.defaultValue = args.default_value || { size: 50, unit: 'px' };
        this.value = args.value || this.defaultValue;
        this.randid = Math.random().toString(36).substr(2, 9);
    }

    render() {
        let sliderValue = this.value;
        let sliderUnit = 'px';

        if (typeof this.value === 'object' && this.value !== null) {
            sliderValue = (this.value.size !== undefined) ? this.value.size : (this.value.value || 50);
            sliderUnit = (this.value.unit !== undefined) ? this.value.unit : 'px';
        }

        return `
            <div class="elementor-control">
                <div class="elementor-control-label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="elementor-control-input-wrapper">
                    <input type="range" class="slider-input elementor-control-input" id="${this.id}" 
                           min="${this.min}" max="${this.max}" 
                           step="${this.step}" value="${sliderValue}">
                    <div class="slider-value">${sliderValue}${sliderUnit}</div>
                </div>
            </div>
        `;
    }

    renderWithWrapper() {
        return this.render();
    }

    getValue() {
        const sliderInput = document.getElementById(this.id);
        if (sliderInput.length === 0) return this.defaultValue;

        const size = parseFloat(sliderInput.value) || 0;
        const currentValue = this.value || this.defaultValue;
        const unit = (typeof currentValue === 'object' && currentValue !== null && currentValue.unit !== undefined)
            ? currentValue.unit
            : 'px';

        return { size, unit };
    }

    setValue(value) {
        if (typeof value === 'object' && value.size !== undefined) {
            const sliderInput = document.getElementById(this.id);
            const valueDisplay = document.querySelector(`.slider-value`);

            if (sliderInput) {
                sliderInput.value = value.size;
                if (valueDisplay) {
                    valueDisplay.textContent = `${value.size}${value.unit !== undefined ? value.unit : 'px'}`;
                }
            }
        }
    }

    setupListeners() {
        const valueDisplay = document.querySelector(`.slider-value`);
        const sliderInput = document.getElementById(this.id);

        if (sliderInput && valueDisplay) {
            // Initialize display value
            const currentValue = this.value || this.defaultValue;
            const size = (typeof currentValue === 'object' && currentValue !== null)
                ? currentValue.size || 50
                : currentValue;
            const unit = (typeof currentValue === 'object' && currentValue !== null && currentValue.unit !== undefined)
                ? currentValue.unit
                : 'px';
            valueDisplay.textContent = `${size}${unit}`;

            // Update display value on input change
            sliderInput.addEventListener('input', function () {
                const value = parseFloat(this.value) || 0;
                valueDisplay.textContent = `${value}${unit}`;
            });
        }
    }

    init() {
        this.setupListeners();
    }

    static init(args, selector) {
        const id = args[0];
        const instance = new SLIDER(id, args[1]);
        const html = instance.render();

        if (selector) {
            document.querySelector(selector).innerHTML = html;
        }

        instance.init();
        return instance;
    }
}
