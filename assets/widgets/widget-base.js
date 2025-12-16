/**
 * WidgetBase - Base class for custom widgets
 * Provides common functionality for all widgets including custom field support
 */
class WidgetBase {
    constructor() {
        this.fields = [];
        this.controls = [];
        this.sections = [];
        this.currentTab = 'content';
    }

    /**
     * Add a custom field using field classes
     * @param {string} name - Field name
     * @param {Class} FieldClass - The field class to use (e.g., MARGIN, PADDING)
     * @param {Object} args - Arguments to pass to the field class
     */
    addCustomField(name, FieldClass, args = {}) {
        const fieldId = `widget_${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        this.fields.push({
            name: name,
            id: fieldId,
            FieldClass: FieldClass,
            args: {
                label: args.label || this.capitalizeFirst(name),
                top: args.top || '0',
                right: args.right || '0',
                bottom: args.bottom || '0',
                left: args.left || '0',
                unit: args.unit || 'px',
                responsive: args.responsive || false,
                namePrefix: args.namePrefix || fieldId,
                ...args
            }
        });
    }

    /**
     * Add regular control (for backward compatibility)
     * @param {string} name - Control name
     * @param {Object} control - Control configuration
     */
    addControl(name, control) {
        this.controls.push({
            name: name,
            ...control
        });
    }

    /**
     * Start a new controls section
     * @param {string} sectionId - Section identifier
     * @param {Object} options - Section options
     */
    startControlsSection(sectionId, options = {}) {
        this.sections.push({
            id: sectionId,
            type: 'start',
            ...options
        });
        this.currentTab = options.tab || 'content';
    }

    /**
     * End current controls section
     */
    endControlsSection() {
        this.sections.push({
            type: 'end'
        });
    }

    /**
     * Get setting value with default fallback
     * @param {string} key - Setting key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Setting value
     */
    getSetting(key, defaultValue = null) {
        // Implementation depends on your widget system
        // This is a placeholder - adapt to your needs
        if (window.widgetSettings && window.widgetSettings[this.constructor.name]) {
            return window.widgetSettings[this.constructor.name][key] || defaultValue;
        }
        return defaultValue;
    }

    /**
     * Render the widget configuration panel
     * @returns {string} HTML for the configuration panel
     */
    renderConfigPanel() {
        let html = '<div class="widget-config-panel">';

        // Render sections
        this.sections.forEach(section => {
            if (section.type === 'start') {
                html += `
                    <div class="control-section" data-section="${section.id}">
                        <h3 class="section-title">${section.label}</h3>
                        <div class="section-content">
                `;
            } else if (section.type === 'end') {
                html += `
                        </div>
                    </div>
                `;
            }
        });

        // Render fields
        this.fields.forEach(field => {
            html += `
                <div class="custom-field-container" data-field="${field.name}">
                    ${field.FieldClass.render ? field.FieldClass.render(field.args) : ''}
                </div>
            `;
        });

        // Render regular controls
        this.controls.forEach(control => {
            html += this.renderControl(control);
        });

        html += '</div>';
        return html;
    }

    /**
     * Render a regular control
     * @param {Object} control - Control configuration
     * @returns {string} HTML for the control
     */
    renderControl(control) {
        switch (control.type) {
            case 'text':
                return `
                    <div class="control-field">
                        <label>${control.label}</label>
                        <input type="text" name="${control.name}" value="${control.default || ''}" placeholder="${control.placeholder || ''}" />
                    </div>
                `;
            case 'select':
                return `
                    <div class="control-field">
                        <label>${control.label}</label>
                        <select name="${control.name}">
                            ${(control.options || []).map(option =>
                                `<option value="${option.value}" ${option.value === control.default ? 'selected' : ''}>${option.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
            case 'color':
                return `
                    <div class="control-field">
                        <label>${control.label}</label>
                        <input type="color" name="${control.name}" value="${control.default || '#000000'}" />
                    </div>
                `;
            // Add more control types as needed
            default:
                return '';
        }
    }

    /**
     * Initialize the widget configuration
     * @param {string} container - Container selector
     */
    initialize(container) {
        const html = this.renderConfigPanel();
        document.querySelector(container).innerHTML = html;

        // Initialize custom fields
        this.fields.forEach(field => {
            if (field.FieldClass.init) {
                field.FieldClass.init([field.id, field.args], `[data-field="${field.name}"]`);
            }
        });
    }

    /**
     * Get all field values
     * @returns {Object} All field values
     */
    getValues() {
        const values = {};

        // Get custom field values
        this.fields.forEach(field => {
            if (field.FieldClass.getValues) {
                values[field.name] = field.FieldClass.getValues(field.id);
            }
        });

        // Get regular control values
        this.controls.forEach(control => {
            const element = document.querySelector(`[name="${control.name}"]`);
            if (element) {
                values[control.name] = element.value;
            }
        });

        return values;
    }

    /**
     * Helper method to capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Abstract methods to be implemented by child classes
    getName() {
        throw new Error('getName() must be implemented by child class');
    }

    getTitle() {
        throw new Error('getTitle() must be implemented by child class');
    }

    getIcon() {
        throw new Error('getIcon() must be implemented by child class');
    }

    getCategories() {
        throw new Error('getCategories() must be implemented by child class');
    }

    getKeywords() {
        throw new Error('getKeywords() must be implemented by child class');
    }

    registerControls() {
        throw new Error('registerControls() must be implemented by child class');
    }

    render() {
        throw new Error('render() must be implemented by child class');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WidgetBase;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.WidgetBase = WidgetBase;
}