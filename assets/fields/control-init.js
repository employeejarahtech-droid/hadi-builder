/**
 * Control System Initialization
 * Maps control types to their respective classes and initializes the control manager
 */

// Ensure BaseControl is loaded first
if (typeof BaseControl === 'undefined') {
    console.error('BaseControl class not found. Please include base-control.js before this file.');
}

// Register control types
const ControlTypes = {};

// Initialize the control system
class ControlManager {
    constructor() {
        this.controls = new Map();
        this.instances = new Map();
    }

    /**
     * Register a control type
     * @param {string} type - Control type name
     * @param {Class} ControlClass - Control class
     */
    registerControlType(type, ControlClass) {
        ControlTypes[type] = ControlClass;
        console.log(`Registered control type: ${type}`);
    }

    /**
     * Create and initialize a control
     * @param {string} name - Control name
     * @param {Object} config - Control configuration
     * @param {string} container - Container selector
     * @returns {Object} Control instance
     */
    createControl(name, config, container) {
        const ControlClass = ControlTypes[config.type];

        if (!ControlClass) {
            console.error(`Control type '${config.type}' not found. Available types:`, Object.keys(ControlTypes));
            return null;
        }

        // Generate unique ID for the control
        const id = `control_${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create control instance
        const control = new ControlClass(id, config);

        // Store the control
        this.controls.set(name, control);
        this.instances.set(id, control);

        // Initialize the control
        if (container) {
            this.initializeControl(control, container);
        }

        return control;
    }

    /**
     * Initialize a control in its container
     * @param {Object} control - Control instance
     * @param {string} container - Container selector
     */
    initializeControl(control, container) {
        const $container = $(container);

        // Create control wrapper
        const $wrapper = $('<div class="control-wrapper"></div>');
        $wrapper.attr('data-control', control.id);

        // Add label if specified
        if (control.args.label) {
            const $label = $('<div class="control-label"></div>');
            $label.html(`<label for="${control.id}">${control.args.label}</label>`);
            $wrapper.append($label);
        }

        // Add control field
        const $field = $('<div class="control-field"></div>');
        $field.append(control.render());
        $wrapper.append($field);

        // Add to container
        $container.append($wrapper);

        // Setup listeners
        if (control.setupListeners) {
            control.setupListeners();
        }

        console.log(`Initialized control: ${control.id}`);
    }

    /**
     * Get a control by name
     * @param {string} name - Control name
     * @returns {Object|null} Control instance
     */
    getControl(name) {
        return this.controls.get(name) || null;
    }

    /**
     * Get control value
     * @param {string} name - Control name
     * @returns {*} Control value
     */
    getValue(name) {
        const control = this.getControl(name);
        return control ? control.getValue() : null;
    }

    /**
     * Set control value
     * @param {string} name - Control name
     * @param {*} value - New value
     */
    setValue(name, value) {
        const control = this.getControl(name);
        if (control && control.setValue) {
            control.setValue(value);
        }
    }

    /**
     * Get all control values
     * @returns {Object} All control values
     */
    getAllValues() {
        const values = {};
        this.controls.forEach((control, name) => {
            values[name] = control.getValue();
        });
        return values;
    }
}

// Create global control manager instance
window.elementorControlManager = new ControlManager();

// Auto-initialize when DOM is ready
$(document).ready(function() {
    console.log('Control system initialized');
    console.log('Available control types:', Object.keys(ControlTypes));

    // Register DIMENSIONS control if available
    if (typeof DIMENSIONS !== 'undefined') {
        window.elementorControlManager.registerControlType('dimensions', DIMENSIONS);
        console.log('DIMENSIONS control registered');
    }
});

// Initialize DIMENSIONS controls immediately if already loaded
if (typeof DIMENSIONS !== 'undefined') {
    window.elementorControlManager.registerControlType('dimensions', DIMENSIONS);
}

// Backward compatibility function
window.initControl = function(name, config, container) {
    return window.elementorControlManager.createControl(name, config, container);
};

// Batch initialization function
window.initControls = function(controls, container) {
    controls.forEach(controlConfig => {
        const [name, config] = controlConfig;
        window.initControl(name, config, container);
    });
};