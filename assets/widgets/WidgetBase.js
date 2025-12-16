/**
 * WidgetBase - Base class for all widgets
 * All widgets should extend this class
 * 
 * Inspired by Elementor's widget system
 */
class WidgetBase extends EventEmitter {
    constructor() {
        super();

        this.controls = [];
        this.settings = {};
    }

    /**
     * Get widget name (unique identifier)
     * @returns {string} Widget name
     */
    getName() {
        throw new Error('getName() must be implemented');
    }

    /**
     * Get widget title (display name)
     * @returns {string} Widget title
     */
    getTitle() {
        throw new Error('getTitle() must be implemented');
    }

    /**
     * Get widget icon class
     * @returns {string} Icon class (e.g., 'fa fa-heading')
     */
    getIcon() {
        return 'fa fa-square';
    }

    /**
     * Get widget categories
     * @returns {array} Array of category names
     */
    getCategories() {
        return ['basic'];
    }

    /**
     * Get widget keywords for search
     * @returns {array} Array of keywords
     */
    getKeywords() {
        return [];
    }

    /**
     * Register widget controls
     * This is where you define all the settings controls
     */
    registerControls() {
        // Override in subclass
        // Example:
        // this.addControl('title', {
        //     type: 'text',
        //     label: 'Title',
        //     default_value: 'Heading'
        // });
    }

    /**
     * Add a control to the widget
     * @param {string} id - Control ID
     * @param {object} options - Control options
     */
    addControl(id, options) {
        this.controls.push({
            id,
            ...options
        });
    }

    /**
     * Start a controls section (tab)
     * @param {string} id - Section ID
     * @param {object} options - Section options
     */
    startControlsSection(id, options = {}) {
        this.controls.push({
            id,
            type: 'section',
            label: options.label || '',
            tab: options.tab || 'content'
        });
    }

    /**
     * End controls section
     */
    endControlsSection() {
        this.controls.push({
            type: 'section_end'
        });
    }

    /**
     * Get all controls
     * @returns {array} Array of controls
     */
    getControls() {
        if (this.controls.length === 0) {
            this.registerControls();
        }
        return this.controls;
    }

    /**
     * Get control by ID
     * @param {string} id - Control ID
     * @returns {object|null} Control object
     */
    getControl(id) {
        return this.controls.find(control => control.id === id) || null;
    }

    /**
     * Set widget settings
     * @param {object} settings - Settings object
     */
    setSettings(settings) {
        // Debug log to check what's being set
        console.log('WidgetBase.setSettings:', {
            widgetName: this.constructor.name,
            currentSettings: this.settings,
            newSettings: settings,
            mergedSettings: { ...this.settings, ...settings }
        });

        this.settings = { ...this.settings, ...settings };
        this.emit('settings:change', this.settings);
    }

    /**
     * Get widget settings
     * @returns {object} Settings object
     */
    getSettings() {
        return this.settings;
    }

    /**
     * Get a specific setting value
     * @param {string} key - Setting key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Setting value
     */
    getSetting(key, defaultValue = null) {
        return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
    }

    /**
     * Render widget for editor view
     * @returns {string} HTML string
     */
    renderEditor() {
        return this.render();
    }

    /**
     * Render widget for frontend view
     * @returns {string} HTML string
     */
    render() {
        throw new Error('render() must be implemented');
    }

    /**
     * Get default settings
     * @returns {object} Default settings
     */
    getDefaultSettings() {
        const defaults = {};

        this.getControls().forEach(control => {
            if (control.id && control.default_value !== undefined) {
                defaults[control.id] = control.default_value;
            }
        });

        return defaults;
    }

    /**
     * Initialize widget with settings
     * @param {object} settings - Initial settings
     */
    init(settings = {}) {
        const defaults = this.getDefaultSettings();
        this.settings = { ...defaults, ...settings };
        this.emit('init', this);
    }

    /**
     * Get widget data for serialization
     * @returns {object} Widget data
     */
    serialize() {
        return {
            type: this.getName(),
            settings: this.settings
        };
    }

    /**
     * Restore widget from serialized data
     * @param {object} data - Serialized data
     */
    deserialize(data) {
        if (data.settings) {
            this.setSettings(data.settings);
        }
    }

    /**
     * Clone the widget
     * @returns {WidgetBase} Cloned widget instance
     */
    clone() {
        const cloned = new this.constructor();
        cloned.init(this.settings);
        return cloned;
    }

    /**
     * Destroy the widget
     */
    destroy() {
        this.removeAllListeners();
        this.controls = [];
        this.settings = {};
    }
}
