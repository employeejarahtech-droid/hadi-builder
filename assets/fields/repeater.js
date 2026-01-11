class REPEATER extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);

        this.fields = args.fields || [];
        this.itemLabel = args.item_label || 'Item';
        this.titleField = args.title_field || null;

        if (!Array.isArray(this.value)) {
            this.value = args.default_value || [];
        }
    }

    render() {
        return `
            <div class="elementor-repeater">
                <div class="elementor-repeater-fields"></div>

                <button type="button"
                    class="elementor-button elementor-repeater-add">
                    <i class="fa fa-plus"></i> ${this.placeholder || 'Add Item'}
                </button>
            </div>
        `;
    }

    setupListeners() {
        super.setupListeners();

        this.$wrapper = $(`[data-control-id="${this.id}"]`);

        if (!this.$wrapper.length) {
            console.error(`Repeater wrapper not found for ID: ${this.id}`);
            return;
        }

        this.$fields = this.$wrapper.find('.elementor-repeater-fields');
        this.$addBtn = this.$wrapper.find('.elementor-repeater-add');

        if (!this.$addBtn.length) {
            console.error(`Add button not found for repeater: ${this.id}`);
            return;
        }

        console.log(`Repeater ${this.id}: Found wrapper, fields, and add button`);

        // Render initial items
        this.renderItems();

        // Attach click handler to add button
        this.$addBtn.off('click').on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Add button clicked for repeater: ${this.id}`);
            this.addItem();
        });

        // Attach delegated event handlers for dynamic content
        this.$fields
            .off('click', '.elementor-repeater-tool-remove')
            .on('click', '.elementor-repeater-tool-remove', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = $(e.currentTarget)
                    .closest('.elementor-repeater-row')
                    .index();
                console.log(`Remove button clicked for item ${index}`);
                this.removeItem(index);
            })
            .off('click', '.elementor-repeater-tool-toggle')
            .on('click', '.elementor-repeater-tool-toggle', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const $row = $(e.currentTarget).closest('.elementor-repeater-row');
                const $controls = $row.find('.elementor-repeater-row-controls');
                const $icon = $(e.currentTarget).find('i');

                // Toggle collapsed state
                $row.toggleClass('elementor-repeater-row-collapsed');
                $controls.slideToggle(200);

                // Rotate icon
                if ($row.hasClass('elementor-repeater-row-collapsed')) {
                    $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
                } else {
                    $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
                }
            })
            .off('input change', 'input, textarea, select')
            .on('input change', 'input, textarea, select', () => {
                this.updateValue();
            });
    }

    renderItems() {
        this.$fields.empty();
        this.value.forEach((item, index) => {
            this.$fields.append(this.renderItem(index, item));
        });
    }

    renderItem(index, values = {}) {
        const title = this.getItemTitle(index, values);

        const $row = $(`
            <div class="elementor-repeater-row">
                <div class="elementor-repeater-row-tools">
                    <button type="button" class="elementor-repeater-tool-toggle">
                        <i class="fa fa-chevron-down"></i>
                    </button>
                    <span class="elementor-repeater-row-title">${title}</span>
                    <button type="button" class="elementor-repeater-tool-remove">
                        ✕
                    </button>
                </div>
                <div class="elementor-repeater-row-controls"></div>
            </div>
        `);

        const $controls = $row.find('.elementor-repeater-row-controls');

        this.fields.forEach(field => {
            const key = field.name || field.id;
            const subId = `${this.id}__${index}__${key}`;

            // Clean up existing control to ensure fresh initialization
            if (window.elementorControlManager && window.elementorControlManager.getControl(subId)) {
                window.elementorControlManager.removeControl(subId);
            }

            const html = ControlManager.renderControl(
                field.type,
                [
                    subId,
                    {
                        ...field,
                        value: values[key] || field.default || field.default_value || '',
                        default_value: values[key] || field.default || field.default_value || ''
                    }
                ]
            );

            $controls.append(html);

            // Initialize the control after appending
            const control = window.elementorControlManager.getControl(subId);
            if (control) {
                control.init();

                // Listen for changes from the control instance
                control.on('change', (val) => {
                    console.log(`Repeater caught change from ${subId}:`, val);
                    this.updateValue();
                });
            } else {
                console.error(`Repeater: Could not find control instance for ${subId}`);
            }
        });

        return $row;
    }

    getItemTitle(index, values) {
        // If titleField is specified and has a value, use it
        if (this.titleField && values[this.titleField]) {
            return values[this.titleField];
        }

        // Otherwise use itemLabel with index
        return `${this.itemLabel} #${index + 1}`;
    }

    updateValue() {
        const newValue = [];
        console.log('Repeater.updateValue called');

        this.$fields.find('.elementor-repeater-row').each((rowIndex, row) => {
            const item = {};

            this.fields.forEach(field => {
                const key = field.name || field.id;
                const id = `${this.id}__${rowIndex}__${key}`;
                const control = window.elementorControlManager.get(id);

                console.log(`Repeater getting value for ${id}`, control ? control.getValue() : 'CONTROL NOT FOUND');

                item[key] = control
                    ? control.getValue()
                    : '';
            });

            newValue.push(item);

            // Update row title dynamically
            if (this.titleField && item[this.titleField]) {
                const $row = $(row);
                const $title = $row.find('.elementor-repeater-row-title');
                $title.text(item[this.titleField]);
            }
        });

        console.log('Repeater new value:', newValue);

        const oldValue = this.value;
        this.value = newValue;

        this.handleChange(newValue, oldValue);
    }
    addItem() {
        const item = {};
        this.fields.forEach(f => {
            // Support both name and id, and legacy default property
            const key = f.name || f.id;
            item[key] = f.default_value || f.default || '';
            // Also ensure we set the property if name exists but we used id above, or vice versa?
            // Actually, keep it simple: use the key that will be used for saving.
            // If f.name exists, use it. If not, use f.id.
        });

        this.value.push(item);
        this.renderItems();
        this.handleChange(this.value, this.value);
    }

    removeItem(index) {
        this.value.splice(index, 1);
        this.renderItems();
        this.handleChange(this.value, this.value);
    }

    getValue() {
        return this.value;
    }

    setValue(newValue, silent = false) {
        const oldValue = this.value;
        this.value = Array.isArray(newValue) ? newValue : [];

        this.renderItems();

        if (!silent) {
            this.handleChange(this.value, oldValue);
        }
    }
}

// Register the REPEATER control globally
window.REPEATER = REPEATER;
window.RepeaterControl = REPEATER; // Alias for ControlManager

