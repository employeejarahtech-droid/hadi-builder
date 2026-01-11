console.log('🔧 WIDTH.JS LOADED - Standalone Version - ' + new Date().toISOString());

class WIDTH extends BaseControl {
    constructor(id, args) {
        super(id, args);
        this.type = 'width';
        this.label = args.label || 'Width';
        this.units = args.units || args.size_units || ['px', '%', 'rem', 'em', 'vh', 'vw']; // Default units for Width
        this.defaultValue = args.default_value || { size: 100, unit: '%' };
        this.value = args.value || this.defaultValue;
    }

    render() {
        let currentValue = this.value;
        let currentUnit = 'px';

        if (typeof this.value === 'object' && this.value !== null) {
            currentValue = this.value.size ?? (this.value.value ?? '');
            currentUnit = this.value.unit || this.units[0] || 'px';
        }

        // Build Unit Switcher Options
        let options = '';
        if (this.units.length > 0) {
            options = this.units.map(u =>
                `<option value="${u}" ${u === currentUnit ? 'selected' : ''}>${u.toUpperCase()}</option>`
            ).join('');
        }

        return `
            <div class="elementor-control" data-control-id="${this.id}">
                <div class="elementor-control-label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="elementor-control-input-wrapper">
                    <div class="width-control-wrapper" data-id="${this.id}" style="display: flex; gap: 5px; align-items: center;">
                        <input type="number" class="width-input elementor-control-input" id="${this.id}" 
                               value="${currentValue}" style="flex-grow: 1;">
                        
                        <div class="dimensions-unit" style="min-width: 60px;">
                            <select class="dimension-unit-select" data-control-id="${this.id}" style="font-size: 11px; padding: 2px; width: 100%; height: 30px; border: 1px solid #e2e8f0;">
                                ${options}
                            </select>
                         </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderWithWrapper() {
        return this.render();
    }

    getValue() {
        const input = document.getElementById(this.id);
        const wrapper = input?.closest('.width-control-wrapper');

        if (!input || !wrapper) return this.value; // Return current stored value if DOM not found

        // Allow empty string or numbers
        const size = input.value === '' ? '' : parseFloat(input.value);

        let unit = 'px';
        const unitSelect = wrapper.querySelector('.dimension-unit-select');
        if (unitSelect) {
            unit = unitSelect.value;
        }

        return { size, unit };
    }

    setValue(value) {
        super.setValue(value); // Calls handleChange -> emits change

        const input = document.getElementById(this.id);
        const wrapper = input?.closest('.width-control-wrapper');

        if (typeof value === 'object' && input && wrapper) {
            if (value.size !== undefined) {
                input.value = value.size;
            }

            if (value.unit) {
                const unitSelect = wrapper.querySelector('.dimension-unit-select');
                if (unitSelect && this.units.includes(value.unit)) {
                    unitSelect.value = value.unit;
                }
            }
        }
    }

    setupListeners() {
        const input = document.getElementById(this.id);
        const wrapper = input?.closest('.width-control-wrapper');

        if (input && wrapper) {
            // Function to update value and emit change
            const update = () => {
                const newVal = this.getValue();
                this.setValue(newVal);
            };

            // 1. Input Change
            input.addEventListener('input', update);
            input.addEventListener('change', update);

            // 2. Unit Switching
            const unitSelect = wrapper.querySelector('.dimension-unit-select');
            if (unitSelect) {
                unitSelect.addEventListener('change', update);
            }
        }
    }

    init() {
        this.setupListeners();
    }

    static init(args, selector) {
        const id = args[0];
        const instance = new WIDTH(id, args[1]);
        const html = instance.render();

        if (selector) {
            document.querySelector(selector).innerHTML = html;
        }

        instance.init();
        return instance;
    }
}

window.WIDTH = WIDTH;
