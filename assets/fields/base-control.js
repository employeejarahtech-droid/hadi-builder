/**
 * BaseControl - Base class for all form controls
 * Provides common functionality for control rendering and event handling
 */
class BaseControl {
    constructor(id, args = {}) {
        this.id = id;
        this.args = args;
        this.disabled = args.disabled || false;
        this.responsive = args.responsive || false;
        this.currentDevice = 'desktop';
        this.deviceValues = {};
        this.listeners = new Map();
    }

    /**
     * Render the control with wrapper
     */
    renderWithWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = 'control-wrapper';
        wrapper.setAttribute('data-control', this.id);

        // Add label if provided
        if (this.args.label) {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'control-label';
            labelDiv.innerHTML = `<label for="${this.id}">${this.args.label}</label>`;
            wrapper.appendChild(labelDiv);
        }

        // Add field
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'control-field';
        fieldDiv.innerHTML = this.render();
        wrapper.appendChild(fieldDiv);

        return wrapper.outerHTML;
    }

    /**
     * Render method - to be implemented by child classes
     */
    render() {
        throw new Error('render() method must be implemented by child class');
    }

    /**
     * Setup event listeners
     */
    setupListeners() {
        // Base implementation - can be overridden by child classes
    }

    /**
     * Add event listener
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Trigger event
     */
    trigger(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    /**
     * Handle value change
     */
    handleChange(newValue, oldValue) {
        this.trigger('change', { newValue, oldValue, control: this });
    }

    /**
     * Get control value - to be implemented by child classes
     */
    getValue() {
        throw new Error('getValue() method must be implemented by child class');
    }

    /**
     * Set control value - to be implemented by child classes
     */
    setValue(value, silent = false) {
        throw new Error('setValue() method must be implemented by child class');
    }

    /**
     * Disable the control
     */
    disable() {
        this.disabled = true;
        const $inputs = $(`#${this.id} input, #${this.id} select, #${this.id} textarea`);
        $inputs.attr('disabled', true);
    }

    /**
     * Enable the control
     */
    enable() {
        this.disabled = false;
        const $inputs = $(`#${this.id} input, #${this.id} select, #${this.id} textarea`);
        $inputs.attr('disabled', false);
    }

    /**
     * Show the control
     */
    show() {
        const $wrapper = $(`.control-wrapper[data-control="${this.id}"]`);
        $wrapper.show();
    }

    /**
     * Hide the control
     */
    hide() {
        const $wrapper = $(`.control-wrapper[data-control="${this.id}"]`);
        $wrapper.hide();
    }

    /**
     * Destroy the control
     */
    destroy() {
        const $wrapper = $(`.control-wrapper[data-control="${this.id}"]`);
        $wrapper.remove();
        this.listeners.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseControl;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.BaseControl = BaseControl;
}