/**
 * ControlManager - Manages all control instances
 * Handles control registration, state management, and coordination
 * 
 * Inspired by Elementor's control manager
 */
class ControlManager extends EventEmitter {
    constructor() {
        super();

        this.controls = new Map(); // Map of control instances by ID
        this.controlTypes = new Map(); // Map of control classes by type
        this.values = {}; // Current values of all controls
        this.initialized = false;
    }

    /**
     * Initialize the control manager
     */
    init() {
        if (this.initialized) return;

        this.registerDefaultControls();
        this.setupGlobalListeners();

        this.initialized = true;
        this.emit('init');
    }

    /**
     * Register default control types
     */
    registerDefaultControls() {
        // Register all available control types
        // These will be registered as they're loaded
        if (typeof TEXT !== 'undefined') {
            this.registerControlType('text', TEXT);
        } else if (typeof window.TEXT !== 'undefined') {
            this.registerControlType('text', window.TEXT);
        }

        if (typeof TEXTAREA !== 'undefined') {
            this.registerControlType('textarea', TEXTAREA);
        } else if (typeof window.TEXTAREA !== 'undefined') {
            this.registerControlType('textarea', window.TEXTAREA);
        }
        if (typeof SELECT !== 'undefined') {
            this.registerControlType('select', SELECT);
        } else if (typeof window.SELECT !== 'undefined') {
            this.registerControlType('select', window.SELECT);
        }
        // this.registerControlType('checkbox', CHECKBOX);
        if (typeof SLIDER !== 'undefined') {
            this.registerControlType('slider', SLIDER);
        }
        if (typeof COLOR !== 'undefined') {
            this.registerControlType('color', COLOR);
        }
        if (typeof MediaControl !== 'undefined') {
            this.registerControlType('media', MediaControl);
        } else if (typeof window.MediaControl !== 'undefined') {
            this.registerControlType('media', window.MediaControl);
        } else {
            console.warn('MediaControl not found');
        }

        // Register icon control
        if (typeof ICON !== 'undefined') {
            this.registerControlType('icon', ICON);
        } else if (typeof window.ICON !== 'undefined') {
            this.registerControlType('icon', window.ICON);
        } else {
            console.warn('ICON control not found');
        }

        if (typeof RepeaterControl !== 'undefined') {
            this.registerControlType('repeater', RepeaterControl);
        }

        if (typeof MenuControl !== 'undefined') {
            this.registerControlType('menu', MenuControl);
        }

        if (typeof URLControl !== 'undefined') {
            this.registerControlType('url', URLControl);
        } else if (typeof window.URLControl !== 'undefined') {
            this.registerControlType('url', window.URLControl);
        } else if (typeof URLinput !== 'undefined') { // Fallback for alias
            this.registerControlType('url', URLinput);
        }

        if (typeof CKEditorControl !== 'undefined') {
            this.registerControlType('ckeditor', CKEditorControl);
        } else if (typeof window.CKEditorControl !== 'undefined') {
            this.registerControlType('ckeditor', window.CKEditorControl);
        }

        // Register width and height controls
        if (typeof WIDTH !== 'undefined') {
            this.registerControlType('width', WIDTH);
        } else if (typeof window.WIDTH !== 'undefined') {
            this.registerControlType('width', window.WIDTH);
        }

        if (typeof HEIGHT !== 'undefined') {
            this.registerControlType('height', HEIGHT);
        } else if (typeof window.HEIGHT !== 'undefined') {
            this.registerControlType('height', window.HEIGHT);
        }

        // Add more as needed
    }

    /**
     * Register a control type
     * @param {string} type - Control type name
     * @param {class} controlClass - Control class
     */
    registerControlType(type, controlClass) {
        if (typeof controlClass === 'undefined') {
            console.warn(`Control class for type "${type}" is undefined`);
            return;
        }

        this.controlTypes.set(type, controlClass);
        this.emit('control:registered', type);
    }

    /**
     * Create and register a control instance
     * @param {string} id - Control ID
     * @param {string} type - Control type
     * @param {object} options - Control options
     * @returns {BaseControl} Control instance
     */
    createControl(id, type, options = {}) {
        const ControlClass = this.controlTypes.get(type);

        if (!ControlClass) {
            console.error(`Control type "${type}" not registered`);
            return null;
        }

        console.log(`Creating control "${id}" of type "${type}" using class "${ControlClass.name}"`);

        // Create instance
        const control = new ControlClass(id, options);

        // Register instance
        this.registerControl(control);

        return control;
    }

    /**
     * Register a control instance
     * @param {BaseControl} control - Control instance
     */
    registerControl(control) {
        if (this.controls.has(control.id)) {
            console.warn(`Control with ID "${control.id}" already exists`);
            return;
        }

        this.controls.set(control.id, control);
        this.values[control.id] = control.getValue();

        // Listen to control changes (if control supports events)
        if (control.on && typeof control.on === 'function') {
            control.on('change', (newValue, oldValue) => {
                this.handleControlChange(control.id, newValue, oldValue);
            });
        } else {
            console.warn(`Control "${control.id}" does not support event emitter`);
        }

        this.emit('control:added', control);
    }

    /**
     * Get a control instance by ID
     * @param {string} id - Control ID
     * @returns {BaseControl|null} Control instance
     */
    getControl(id) {
        return this.controls.get(id) || null;
    }

    /**
     * Remove a control
     * @param {string} id - Control ID
     */
    removeControl(id) {
        const control = this.controls.get(id);
        if (!control) return;

        control.destroy();
        this.controls.delete(id);
        delete this.values[id];

        this.emit('control:removed', id);
    }

    /**
     * Handle control value change
     * @param {string} id - Control ID
     * @param {*} newValue - New value
     * @param {*} oldValue - Old value
     */
    handleControlChange(id, newValue, oldValue) {
        // Update stored value
        this.values[id] = newValue;

        // Check conditions for all controls
        this.updateConditionalControls();

        // Emit global change event
        this.emit('change', id, newValue, oldValue, this.values);
        this.emit(`change:${id}`, newValue, oldValue);
    }

    /**
     * Update visibility of controls based on conditions
     */
    updateConditionalControls() {
        this.controls.forEach((control) => {
            if (control.condition || control.conditions) {
                const shouldBeVisible = control.checkConditions(this.values);
                control.setVisibility(shouldBeVisible);
            }
        });
    }

    /**
     * Get value of a control
     * @param {string} id - Control ID
     * @returns {*} Control value
     */
    getValue(id) {
        const control = this.controls.get(id);
        return control ? control.getValue() : this.values[id];
    }

    /**
     * Set value of a control
     * @param {string} id - Control ID
     * @param {*} value - New value
     * @param {boolean} silent - Don't emit change event
     */
    setValue(id, value, silent = false) {
        const control = this.controls.get(id);
        if (control) {
            control.setValue(value, silent);
        } else {
            this.values[id] = value;
        }
    }

    /**
     * Get all values
     * @returns {object} All control values
     */
    getValues() {
        // Get fresh values from all controls
        this.controls.forEach((control, id) => {
            this.values[id] = control.getValue();
        });

        return { ...this.values };
    }

    /**
     * Set multiple values
     * @param {object} values - Values object
     * @param {boolean} silent - Don't emit change events
     */
    setValues(values, silent = false) {
        Object.entries(values).forEach(([id, value]) => {
            this.setValue(id, value, silent);
        });
    }

    /**
     * Validate all controls
     * @returns {boolean} Whether all controls are valid
     */
    validateAll() {
        let isValid = true;

        this.controls.forEach((control) => {
            if (!control.validate()) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Get all validation errors
     * @returns {object} Errors by control ID
     */
    getErrors() {
        const errors = {};

        this.controls.forEach((control, id) => {
            if (control.hasError) {
                errors[id] = control.errors;
            }
        });

        return errors;
    }

    /**
     * Serialize all controls
     * @returns {object} Serialized data
     */
    serialize() {
        const data = {};

        this.controls.forEach((control, id) => {
            data[id] = control.serialize();
        });

        return data;
    }

    /**
     * Deserialize and restore state
     * @param {object} data - Serialized data
     */
    deserialize(data) {
        Object.entries(data).forEach(([id, controlData]) => {
            const control = this.controls.get(id);
            if (control) {
                control.deserialize(controlData);
            }
        });
    }

    /**
     * Render all controls into a container
     * @param {string|jQuery} container - Container selector or jQuery object
     * @param {array} controlsConfig - Array of control configurations
     */
    renderControls(container, controlsConfig) {
        const $container = $(container);

        controlsConfig.forEach(config => {
            const { id, type, ...options } = config;
            const control = this.createControl(id, type, options);

            if (control) {
                const html = control.renderWithWrapper();
                $container.append(html);
                control.init();
            }
        });
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Listen for form changes to update conditional controls
        $(document).on('change input', '.elementor-control input, .elementor-control select, .elementor-control textarea', (e) => {
            const $control = $(e.target).closest('.elementor-control');
            const controlId = $control.data('control-id');

            if (controlId) {
                const control = this.getControl(controlId);
                if (control) {
                    const newValue = control.getValue();
                    this.handleControlChange(controlId, newValue, this.values[controlId]);
                }
            }
        });
    }

    /**
     * Reset all controls to default values
     */
    reset() {
        this.controls.forEach((control) => {
            control.setValue(control.defaultValue, true);
        });

        this.updateConditionalControls();
        this.emit('reset');
    }

    /**
     * Destroy all controls and cleanup
     */
    destroy() {
        this.controls.forEach((control) => {
            control.destroy();
        });

        this.controls.clear();
        this.values = {};
        this.removeAllListeners();
        this.initialized = false;

        this.emit('destroy');
    }

    /**
     * Get control by type
     * @param {string} type - Control type
     * @returns {array} Array of controls of that type
     */
    getControlsByType(type) {
        const controls = [];

        this.controls.forEach((control) => {
            if (control.type === type) {
                controls.push(control);
            }
        });

        return controls;
    }

    /**
     * Check if control exists
     * @param {string} id - Control ID
     * @returns {boolean}
     */
    hasControl(id) {
        return this.controls.has(id);
    }

    /**
     * Get number of registered controls
     * @returns {number}
     */
    getControlCount() {
        return this.controls.size;
    }

    /**
     * Render a control and return HTML + control instance
     * This is used by repeater and other complex controls
     * @param {string} type - Control type
     * @param {array} args - [id, options]
     * @returns {string} HTML for the control
     */
    static renderControl(type, args) {
        const [id, options] = args;
        const manager = window.elementorControlManager;

        if (!manager) {
            console.error('ControlManager not initialized');
            return '';
        }

        // Create the control instance
        const control = manager.createControl(id, type, options);

        if (!control) {
            console.error(`Failed to create control of type "${type}"`);
            return '';
        }

        // Return the HTML with wrapper
        return control.renderWithWrapper();
    }

    /**
     * Alias for backward compatibility
     */
    get(id) {
        return this.getControl(id);
    }
}

// Create global instance
window.elementorControlManager = window.elementorControlManager || new ControlManager();
