/**
 * CSSGenerator - Generates CSS from widget settings and selectors
 * Processes {{WRAPPER}}, {{SIZE}}, {{UNIT}} placeholders
 */
class CSSGenerator {
    constructor() {
        this.widgetCSS = new Map(); // Store CSS by widget ID
    }

    /**
     * Generate CSS for a single widget
     * @param {string} widgetId - Unique widget ID
     * @param {string} widgetType - Widget type name
     * @param {object} settings - Widget settings
     * @param {array} controls - Widget control definitions
     * @returns {string} Generated CSS
     */
    generateWidgetCSS(widgetId, widgetType, settings, controls) {
        let css = '';
        // Use multiple selectors to work in both builder and frontend:
        // Builder: <div data-element-id="elem_1"> (wrapper)
        // Frontend: <div id="elem_1"> (direct)
        // Use comma-separated selectors to match both
        const wrapperSelector = `[data-element-id="${widgetId}"], [id="${widgetId}"]`;

        console.log(`Generating CSS for widget ${widgetId} (${widgetType})`);
        console.log('Settings:', settings);

        // Process each control that has selectors
        controls.forEach(control => {
            if (!control.selectors) return;

            let value = settings[control.id];

            // Fallback to default value if setting is missing
            if (value === undefined || value === null) {
                value = control.default_value;
            }

            console.log(`Control ${control.id}:`, value);

            if (value === undefined || value === null || value === '') {
                console.log(`Skipping ${control.id} - no value`);
                return;
            }

            // Process each selector rule
            Object.entries(control.selectors).forEach(([selector, cssRule]) => {
                const processedSelector = this.processSelector(selector, wrapperSelector);
                const processedRule = this.processCSSRule(cssRule, value, control);

                console.log(`Processed rule for ${control.id}:`, processedRule);

                if (processedRule) {
                    css += `${processedSelector} { ${processedRule} }\n`;
                }
            });
        });

        // Store for later retrieval
        this.widgetCSS.set(widgetId, css);
        return css;
    }

    /**
     * Process selector and replace {{WRAPPER}} placeholder
     * Handles multiple wrapper selectors (comma-separated) by creating complete selector for each
     * @param {string} selector - CSS selector with placeholders
     * @param {string} wrapperSelector - Actual wrapper selector (may contain commas)
     * @returns {string} Processed selector
     */
    processSelector(selector, wrapperSelector) {
        // If wrapperSelector contains commas, we need to create complete selectors for each variant
        if (wrapperSelector.includes(',')) {
            const wrappers = wrapperSelector.split(',').map(w => w.trim());
            return wrappers.map(wrapper => selector.replace(/\{\{WRAPPER\}\}/g, wrapper)).join(', ');
        }
        return selector.replace(/\{\{WRAPPER\}\}/g, wrapperSelector);
    }

    /**
     * Process CSS rule and replace {{SIZE}}, {{UNIT}} placeholders
     * @param {string} cssRule - CSS rule with placeholders
     * @param {*} value - Control value
     * @param {object} control - Control definition
     * @returns {string} Processed CSS rule
     */
    processCSSRule(cssRule, value, control) {
        console.log('processCSSRule called:');
        console.log('  cssRule:', cssRule);
        console.log('  value:', value);
        console.log('  value type:', typeof value);
        console.log('  control:', control);

        let processedRule = cssRule;

        // Handle different value types
        if (typeof value === 'object' && value !== null) {
            console.log('  value.size:', value.size);
            console.log('  value.unit:', value.unit);

            // Slider, dimensions, etc. with size and unit
            if (value.size !== undefined && value.unit !== undefined) {
                console.log('  Replacing SIZE and UNIT');
                processedRule = processedRule.replace(/\{\{SIZE\}\}/g, value.size);
                processedRule = processedRule.replace(/\{\{UNIT\}\}/g, value.unit);
                console.log('  Result:', processedRule);
            }
            // Dimensions (padding, margin)
            else if (value.top !== undefined) {
                const unit = value.unit || 'px';
                processedRule = processedRule.replace(/\{\{TOP\}\}/g, value.top + unit);
                processedRule = processedRule.replace(/\{\{RIGHT\}\}/g, value.right + unit);
                processedRule = processedRule.replace(/\{\{BOTTOM\}\}/g, value.bottom + unit);
                processedRule = processedRule.replace(/\{\{LEFT\}\}/g, value.left + unit);
            } else {
                console.warn('  Object value but no size/unit or top/right/bottom/left properties');
            }
        } else if (typeof value === 'number') {
            // Handle numeric values - get unit from control's default_value or use 'px'
            console.log('  Handling numeric value');
            const unit = control.default_value?.unit || control.units?.[0] || 'px';
            console.log('  Using unit:', unit);
            processedRule = processedRule.replace(/\{\{SIZE\}\}/g, value);
            processedRule = processedRule.replace(/\{\{UNIT\}\}/g, unit);
            console.log('  Result:', processedRule);
        } else {
            // Simple value (color, text, etc.)
            processedRule = processedRule.replace(/\{\{VALUE\}\}/g, value);
        }

        return processedRule;
    }

    /**
     * Generate CSS for all widgets on a page
     * @param {array} widgets - Array of widget data
     * @returns {string} Complete CSS for the page
     */
    generatePageCSS(widgets) {
        let allCSS = '';

        widgets.forEach(widget => {
            if (!widget.id || !widget.type || !widget.settings) {
                console.log('Skipping widget - missing required data:', widget);
                return;
            }

            console.log(`Processing widget: ${widget.type} (${widget.id})`);
            console.log('Widget settings:', widget.settings);

            // Get widget class to access control definitions
            const WidgetClass = window.elementorWidgetManager.getWidgetClass(widget.type);
            if (!WidgetClass) {
                console.warn(`Widget class "${widget.type}" not found`);
                return;
            }

            // Create temporary instance just to get controls
            const tempInstance = new WidgetClass();
            tempInstance.registerControls(); // Register controls
            const controls = tempInstance.getControls();

            console.log(`Found ${controls.length} controls for ${widget.type}`);

            // Generate CSS using the widget's actual settings
            const widgetCSS = this.generateWidgetCSS(
                widget.id,
                widget.type,
                widget.settings,  // Use settings from serialized data
                controls
            );

            if (widgetCSS) {
                allCSS += `/* Widget: ${widget.type} (${widget.id}) */\n`;
                allCSS += widgetCSS;
                allCSS += '\n';
            }
        });

        return allCSS;
    }

    /**
     * Recursively collect all widgets from content structure
     * @param {array} content - Content array (may contain containers)
     * @returns {array} Flat array of all widgets
     */
    collectAllWidgets(content) {
        const widgets = [];

        const traverse = (items) => {
            if (!Array.isArray(items)) return;

            items.forEach(item => {
                if (!item) return;

                // Add this widget
                widgets.push(item);

                // If it's a container, traverse its children
                if (item.children && Array.isArray(item.children)) {
                    traverse(item.children);
                }

                // Handle slot-based containers (FlexWidget, etc.)
                if (item.slots && typeof item.slots === 'object') {
                    Object.values(item.slots).forEach(slot => {
                        if (Array.isArray(slot)) {
                            traverse(slot);
                        }
                    });
                }
            });
        };

        traverse(content);
        return widgets;
    }

    /**
     * Generate CSS for entire page including all sections
     * @param {object} pageData - Complete page data with header, content, footer
     * @returns {string} Complete CSS
     */
    generateCompleteCSS(pageData) {
        let allWidgets = [];

        // Collect widgets from all sections
        if (pageData.header) {
            allWidgets = allWidgets.concat(this.collectAllWidgets(pageData.header));
        }
        if (pageData.content) {
            allWidgets = allWidgets.concat(this.collectAllWidgets(pageData.content));
        }
        if (pageData.footer) {
            allWidgets = allWidgets.concat(this.collectAllWidgets(pageData.footer));
        }

        return this.generatePageCSS(allWidgets);
    }

    /**
     * Clear stored CSS
     */
    clear() {
        this.widgetCSS.clear();
    }
}

// Export class to window first
window.CSSGenerator = CSSGenerator;

// Initialize global instance
window.cssGenerator = new CSSGenerator();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSSGenerator;
}
