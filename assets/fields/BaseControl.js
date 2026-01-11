/**
 * BaseControl - Foundation class for all Elementor-style controls
 * All control types should extend this class
 * 
 * Inspired by Elementor's control system architecture
 */
class BaseControl extends EventEmitter {
    constructor(id, args = {}) {
        super();

        // Core properties
        this.id = id;
        this.type = this.constructor.name.toLowerCase().replace('control', '');
        this.label = args.label || '';
        this.description = args.description || '';
        this.placeholder = args.placeholder || '';

        // Value management
        this.defaultValue = args.default_value !== undefined ? args.default_value : '';
        this.value = args.value !== undefined ? args.value : this.defaultValue;

        // UI properties
        this.labelBlock = args.label_block !== undefined ? args.label_block : false;
        this.separator = args.separator || 'default'; // 'default', 'before', 'after', 'none'
        this.showLabel = args.show_label !== undefined ? args.show_label : true;
        this.classes = args.classes || [];

        // Conditional logic
        this.condition = args.condition || null;
        this.conditions = args.conditions || null;

        // Responsive support
        this.responsive = args.responsive || false;
        this.currentDevice = 'desktop';
        this.deviceValues = {
            desktop: this.value,
            tablet: args.tablet_value || null,
            mobile: args.mobile_value || null
        };

        // Validation
        this.validators = args.validators || [];
        this.required = args.required || false;
        if (this.required && !this.validators.some(v => v.name === 'required')) {
            this.validators.unshift(Validator.required());
        }

        // Callbacks
        this.onChange = args.onChange || null;
        this.onInit = args.onInit || null;

        // State
        this.visible = true;
        this.disabled = args.disabled || false;
        this.initialized = false;
        this.container = null;

        // Error state
        this.errors = [];
        this.hasError = false;
    }

    /**
     * Initialize the control
     * Called after rendering
     */
    init() {
        if (this.initialized) return;

        this.setupListeners();

        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit.call(this);
        }

        this.initialized = true;
        this.emit('init', this);
    }

    /**
     * Render the control HTML
     * Must be overridden by subclasses
     * @returns {string} HTML string
     */
    render() {
        throw new Error('render() method must be implemented by subclass');
    }

    /**
     * Render the control wrapper with label
     * @returns {string} Complete HTML with wrapper
     */
    renderWithWrapper() {
        const wrapperClasses = [
            'elementor-control',
            `elementor-control-${this.type}`,
            `elementor-control-${this.id}`,
            this.labelBlock ? 'elementor-label-block' : 'elementor-label-inline',
            this.separator !== 'default' ? `elementor-control-separator-${this.separator}` : '',
            !this.visible ? 'elementor-hidden' : '',
            this.hasError ? 'elementor-control-error' : '',
            ...this.classes
        ].filter(Boolean).join(' ');

        return `
            <div class="${wrapperClasses}" data-control-id="${this.id}">
                ${this.showLabel ? this.renderLabel() : ''}
                <div class="elementor-control-content">
                    ${this.responsive ? this.renderResponsiveSwitcher() : ''}
                    ${this.render()}
                    ${this.description ? this.renderDescription() : ''}
                    ${this.renderErrors()}
                </div>
            </div>
        `;
    }

    /**
     * Render the label
     * @returns {string} Label HTML
     */
    renderLabel() {
        return `
            <div class="elementor-control-label">
                <label for="${this.id}">
                    ${this.label}
                    ${this.required ? '<span class="elementor-required">*</span>' : ''}
                </label>
            </div>
        `;
    }

    /**
     * Render description
     * @returns {string} Description HTML
     */
    renderDescription() {
        return `
            <div class="elementor-control-description">
                ${this.description}
            </div>
        `;
    }

    /**
     * Render responsive device switcher
     * @returns {string} Responsive switcher HTML
     */
    renderResponsiveSwitcher() {
        return `
            <div class="elementor-control-responsive-switchers">
                <button type="button" class="elementor-responsive-switcher" data-device="desktop" title="Desktop">
                    <i class="eicon-device-desktop"></i>
                </button>
                <button type="button" class="elementor-responsive-switcher" data-device="tablet" title="Tablet">
                    <i class="eicon-device-tablet"></i>
                </button>
                <button type="button" class="elementor-responsive-switcher" data-device="mobile" title="Mobile">
                    <i class="eicon-device-mobile"></i>
                </button>
            </div>
        `;
    }

    /**
     * Render validation errors
     * @returns {string} Errors HTML
     */
    renderErrors() {
        if (!this.hasError || this.errors.length === 0) return '';

        return `
            <div class="elementor-control-errors">
                ${this.errors.map(error => `
                    <div class="elementor-control-error-message">${error}</div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Setup event listeners
     * Can be overridden by subclasses
     */
    setupListeners() {
        // Responsive switcher
        if (this.responsive) {
            this.setupResponsiveListeners();
        }
    }

    /**
     * Setup responsive device switcher listeners
     */
    setupResponsiveListeners() {
        $(document).on('click', `[data-control-id="${this.id}"] .elementor-responsive-switcher`, (e) => {
            const device = $(e.currentTarget).data('device');
            this.switchDevice(device);
        });
    }

    /**
     * Switch to a different device view
     * @param {string} device - 'desktop', 'tablet', or 'mobile'
     */
    switchDevice(device) {
        if (!this.responsive) return;

        // Save current device value
        this.deviceValues[this.currentDevice] = this.getValue();

        // Switch device
        this.currentDevice = device;

        // Load device value (with inheritance)
        const deviceValue = this.getDeviceValue(device);
        this.setValue(deviceValue);

        // Update UI
        this.updateResponsiveSwitcherUI(device);

        this.emit('device:change', device, deviceValue);
    }

    /**
     * Get value for a specific device (with inheritance)
     * @param {string} device - Device name
     * @returns {*} Device value
     */
    getDeviceValue(device) {
        // If device has explicit value, use it
        if (this.deviceValues[device] !== null && this.deviceValues[device] !== undefined) {
            return this.deviceValues[device];
        }

        // Inheritance: mobile -> tablet -> desktop
        if (device === 'mobile') {
            return this.deviceValues.tablet !== null ? this.deviceValues.tablet : this.deviceValues.desktop;
        }
        if (device === 'tablet') {
            return this.deviceValues.desktop;
        }

        return this.deviceValues.desktop;
    }

    /**
     * Update responsive switcher UI
     * @param {string} activeDevice - Active device
     */
    updateResponsiveSwitcherUI(activeDevice) {
        const $switchers = $(`[data-control-id="${this.id}"] .elementor-responsive-switcher`);
        $switchers.removeClass('elementor-active');
        $switchers.filter(`[data-device="${activeDevice}"]`).addClass('elementor-active');
    }

    /**
     * Get the current value
     * Must be overridden by subclasses
     * @returns {*} Current value
     */
    getValue() {
        return this.value;
    }

    /**
     * Set a new value
     * Must be overridden by subclasses
     * @param {*} newValue - New value
     * @param {boolean} silent - Don't emit change event
     */
    setValue(newValue, silent = false) {
        console.log(`URLControl.setValue [${this.id}]:`, newValue);
        const oldValue = this.value;
        this.value = newValue;

        if (this.responsive) {
            this.deviceValues[this.currentDevice] = newValue;
        }

        // Always emit change for objects to be safe, or do deep comparison
        if (!silent) {
            this.handleChange(newValue, oldValue);
        }
    }

    /**
     * Handle value change
     * @param {*} newValue - New value
     * @param {*} oldValue - Old value
     */
    handleChange(newValue, oldValue) {
        // Validate
        this.validate();

        // Emit change event
        this.emit('change', newValue, oldValue, this);

        // Call onChange callback
        if (this.onChange && typeof this.onChange === 'function') {
            this.onChange.call(this, newValue, oldValue);
        }
    }

    /**
     * Validate the current value
     * @returns {boolean} Whether validation passed
     */
    validate() {
        this.errors = [];
        this.hasError = false;

        if (this.validators.length === 0) {
            return true;
        }

        const value = this.getValue();

        for (const validator of this.validators) {
            const result = validator(value);
            if (!result.valid) {
                this.errors.push(result.message);
                this.hasError = true;
            }
        }

        this.updateErrorUI();

        return !this.hasError;
    }

    /**
     * Update error UI
     */
    updateErrorUI() {
        const $control = $(`[data-control-id="${this.id}"]`);

        if (this.hasError) {
            $control.addClass('elementor-control-error');
            $control.find('.elementor-control-errors').remove();
            $control.find('.elementor-control-content').append(this.renderErrors());
        } else {
            $control.removeClass('elementor-control-error');
            $control.find('.elementor-control-errors').remove();
        }
    }

    /**
     * Check if control should be visible based on conditions
     * @param {object} formValues - All form values
     * @returns {boolean} Whether control should be visible
     */
    checkConditions(formValues) {
        // Check single condition
        if (this.condition) {
            return Conditions.evaluate(this.condition, formValues);
        }

        // Check multiple conditions
        if (this.conditions) {
            return Conditions.evaluate(this.conditions, formValues);
        }

        return true;
    }

    /**
     * Set visibility
     * @param {boolean} visible - Whether control should be visible
     */
    setVisibility(visible) {
        this.visible = visible;
        const $control = $(`[data-control-id="${this.id}"]`);

        if (visible) {
            $control.removeClass('elementor-hidden').show();
        } else {
            $control.addClass('elementor-hidden').hide();
        }

        this.emit('visibility:change', visible);
    }

    /**
     * Enable/disable the control
     * @param {boolean} disabled - Whether control should be disabled
     */
    setDisabled(disabled) {
        this.disabled = disabled;
        const $input = $(`#${this.id}`);

        if (disabled) {
            $input.prop('disabled', true).addClass('elementor-disabled');
        } else {
            $input.prop('disabled', false).removeClass('elementor-disabled');
        }
    }

    /**
     * Serialize control data
     * @returns {object} Serialized data
     */
    serialize() {
        const data = {
            id: this.id,
            type: this.type,
            value: this.getValue()
        };

        if (this.responsive) {
            data.responsive = true;
            data.deviceValues = this.deviceValues;
        }

        return data;
    }

    /**
     * Deserialize and restore control state
     * @param {object} data - Serialized data
     */
    deserialize(data) {
        if (data.value !== undefined) {
            this.setValue(data.value, true);
        }

        if (data.responsive && data.deviceValues) {
            this.deviceValues = data.deviceValues;
        }
    }

    /**
     * Destroy the control and cleanup
     */
    destroy() {
        this.removeAllListeners();

        // Remove event listeners
        if (this.responsive) {
            $(document).off('click', `[data-control-id="${this.id}"] .elementor-responsive-switcher`);
        }

        // Remove DOM element
        $(`[data-control-id="${this.id}"]`).remove();

        this.initialized = false;
        this.emit('destroy', this);
    }


    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Static factory method
     * @param {array} args - [id, options]
     * @returns {string} Rendered HTML
     */
    static init(args) {
        const id = args[0];
        const options = args[1] || {};
        const instance = new this(id, options);
        return instance.renderWithWrapper();
    }
}

// Export to global scope
window.BaseControl = BaseControl;
