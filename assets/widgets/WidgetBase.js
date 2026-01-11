/**
 * WidgetBase - Base class for all widgets
 * All widgets should extend this class
 * 
 * Inspired by Elementor's widget system
 */
class WidgetBase extends EventEmitter {
    constructor() {
        super();
        console.log('WidgetBase v3 initialized');

        this.controls = [];
        this.settings = {};
        this.currentTab = 'content';
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
            tab: this.currentTab,
            ...options
        });
    }

    /**
     * Start a controls section (tab)
     * @param {string} id - Section ID
     * @param {object} options - Section options
     */
    startControlsSection(id, options = {}) {
        this.currentSectionId = id; // Track current section ID
        this.currentTab = options.tab || 'content';
        this.controls.push({
            id,
            type: 'section',
            label: options.label || '',
            tab: this.currentTab
        });
    }

    /**
     * End controls section
     */
    endControlsSection() {
        // Inject Global Style Controls if ending 'style_section'
        // This ensures every widget gets Margin/Padding in their Style tab
        if (this.currentSectionId === 'style_section') {
            this.addGlobalStyleControls();
        }

        this.controls.push({
            type: 'section_end'
        });

        this.currentSectionId = null;
    }

    /**
     * Add global style controls (Margin, Padding)
     */
    addGlobalStyleControls() {
        this.addControl('margin', {
            type: 'dimensions',
            label: 'Margin',
            default_value: { top: '', right: '', bottom: '', left: '', unit: 'px', isLinked: true },
            tab: 'style'
        });

        this.addControl('padding', {
            type: 'dimensions',
            label: 'Padding',
            default_value: { top: '', right: '', bottom: '', left: '', unit: 'px', isLinked: true },
            tab: 'style'
        });

        this.addControl('width', {
            type: 'width',
            label: 'Width',
            default_value: { size: '', unit: '%' },
            range: {
                min: 0,
                max: 100,
                step: 1
            },
            size_units: ['px', '%', 'vw'],
            responsive: true,
            tab: 'style'
        });

        this.addControl('height', {
            type: 'height',
            label: 'Height',
            default_value: { size: '', unit: 'px' },
            range: {
                min: 0,
                max: 500,
                step: 1
            },
            size_units: ['px', '%', 'vh'],
            responsive: true,
            tab: 'style'
        });

        // Flex controls - enabled for widgets that need them
        if (this.useFlexControls) {
            this.addFlexBoxControls();
        }
    }

    /**
     * Add Flexbox controls
     * Can be called manually by widgets that need flex controls
     */
    addFlexBoxControls() {
        this.addControl('flex_display', {
            type: 'select',
            label: 'Display',
            default_value: 'default',
            options: [
                { value: 'default', label: 'Default' },
                { value: 'block', label: 'Block' },
                { value: 'inline-block', label: 'Inline Block' },
                { value: 'flex', label: 'Flex' },
                { value: 'inline-flex', label: 'Inline Flex' }
            ],
            tab: 'style'
        });

        this.addControl('flex_direction', {
            type: 'select',
            label: 'Direction',
            default_value: 'row',
            options: [
                { value: 'row', label: 'Row (Horizontal)' },
                { value: 'column', label: 'Column (Vertical)' },
                { value: 'row-reverse', label: 'Row Reverse' },
                { value: 'column-reverse', label: 'Column Reverse' }
            ],
            condition: {
                name: 'flex_display',
                operator: 'in',
                value: ['flex', 'inline-flex']
            },
            tab: 'style'
        });

        this.addControl('justify_content', {
            type: 'select',
            label: 'Justify Content',
            default_value: 'flex-start',
            options: [
                { value: 'flex-start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'End' },
                { value: 'space-between', label: 'Space Between' },
                { value: 'space-around', label: 'Space Around' },
                { value: 'space-evenly', label: 'Space Evenly' }
            ],
            condition: {
                name: 'flex_display',
                operator: 'in',
                value: ['flex', 'inline-flex']
            },
            tab: 'style'
        });

        this.addControl('align_items', {
            type: 'select',
            label: 'Align Items',
            default_value: 'stretch',
            options: [
                { value: 'flex-start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'End' },
                { value: 'stretch', label: 'Stretch' },
                { value: 'baseline', label: 'Baseline' }
            ],
            condition: {
                name: 'flex_display',
                operator: 'in',
                value: ['flex', 'inline-flex']
            },
            tab: 'style'
        });

        this.addControl('flex_wrap', {
            type: 'select',
            label: 'Wrap',
            default_value: 'nowrap',
            options: [
                { value: 'nowrap', label: 'No Wrap' },
                { value: 'wrap', label: 'Wrap' },
                { value: 'wrap-reverse', label: 'Wrap Reverse' }
            ],
            condition: {
                name: 'flex_display',
                operator: 'in',
                value: ['flex', 'inline-flex']
            },
            tab: 'style'
        });

        this.addControl('flex_gap', {
            type: 'slider',
            label: 'Gap (px)',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 1
            },
            condition: {
                name: 'flex_display',
                operator: 'in',
                value: ['flex', 'inline-flex']
            },
            tab: 'style'
        });
    }

    /**
     * Register standard Advanced tab controls
     * Call this at the end of registerControls() to add Advanced tab
     */
    registerAdvancedControls() {
        this.startControlsSection('advanced_section', {
            label: 'Advanced',
            tab: 'advanced'
        });

        this.addControl('css_classes', {
            type: 'text',
            label: 'CSS Classes',
            description: 'Add custom CSS classes to the widget wrapper',
            placeholder: 'class-1 class-2',
            label_block: true
        });

        this.addControl('css_id', {
            type: 'text',
            label: 'CSS ID',
            description: 'Add custom ID to the widget wrapper',
            placeholder: 'my-custom-id',
            label_block: true
        });

        this.addControl('animation', {
            type: 'select',
            label: 'Entrance Animation',
            default_value: 'none',
            options: [
                { value: 'none', label: 'None' },
                { value: 'fadeIn', label: 'Fade In' },
                { value: 'fadeInDown', label: 'Fade In Down' },
                { value: 'fadeInUp', label: 'Fade In Up' },
                { value: 'fadeInLeft', label: 'Fade In Left' },
                { value: 'fadeInRight', label: 'Fade In Right' },
                { value: 'slideInDown', label: 'Slide In Down' },
                { value: 'slideInUp', label: 'Slide In Up' },
                { value: 'slideInLeft', label: 'Slide In Left' },
                { value: 'slideInRight', label: 'Slide In Right' },
                { value: 'bounce', label: 'Bounce' },
                { value: 'pulse', label: 'Pulse' },
                { value: 'flash', label: 'Flash' },
                { value: 'shake', label: 'Shake' },
                { value: 'swing', label: 'Swing' },
                { value: 'tada', label: 'Tada' },
                { value: 'wobble', label: 'Wobble' },
                { value: 'jello', label: 'Jello' },
                { value: 'heartBeat', label: 'Heart Beat' }
            ]
        });

        this.addControl('animation_duration', {
            type: 'slider',
            label: 'Animation Duration',
            default_value: { size: 0.5, unit: 's' },
            range: {
                min: 0.1,
                max: 5,
                step: 0.1
            },
            condition: {
                terms: [
                    { name: 'animation', operator: '!=', value: 'none' }
                ]
            }
        });

        this.addControl('animation_delay', {
            type: 'slider',
            label: 'Animation Delay',
            default_value: { size: 0, unit: 's' },
            range: {
                min: 0,
                max: 5,
                step: 0.1
            },
            condition: {
                terms: [
                    { name: 'animation', operator: '!=', value: 'none' }
                ]
            }
        });

        this.addControl('responsive_display', {
            type: 'select',
            label: 'Responsive Display',
            default_value: 'show-all',
            options: [
                { value: 'show-all', label: 'Show on All Devices' },
                { value: 'hide-desktop', label: 'Hide on Desktop' },
                { value: 'hide-tablet', label: 'Hide on Tablet' },
                { value: 'hide-mobile', label: 'Hide on Mobile' },
                { value: 'show-desktop', label: 'Show only on Desktop' },
                { value: 'show-tablet', label: 'Show only on Tablet' },
                { value: 'show-mobile', label: 'Show only on Mobile' }
            ]
        });

        this.endControlsSection();
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
     * Wrap widget content with Advanced tab settings
     * Applies CSS classes, ID, animations, and responsive display
     * @param {string} content - Widget HTML content
     * @param {string} baseClass - Base CSS class for the widget (e.g., 'button-widget')
     * @returns {string} Wrapped HTML content
     */
    wrapWithAdvancedSettings(content, baseClass = 'widget') {
        // Get Advanced tab settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0.5, unit: 's' });
        const responsiveDisplay = this.getSetting('responsive_display', 'show-all');
        const width = this.getSetting('width', { size: '', unit: '%' });
        const height = this.getSetting('height', { size: '', unit: 'px' });

        // Flexbox settings
        const flexDisplay = this.getSetting('flex_display', 'default');
        const flexDirection = this.getSetting('flex_direction', 'row');
        const justifyContent = this.getSetting('justify_content', 'flex-start');
        const alignItems = this.getSetting('align_items', 'stretch');
        const flexWrap = this.getSetting('flex_wrap', 'nowrap');
        const flexGap = this.getSetting('flex_gap', { size: 0, unit: 'px' });

        // Build wrapper classes
        let wrapperClasses = [baseClass];

        // Add custom CSS classes
        if (cssClasses) {
            wrapperClasses.push(cssClasses);
        }

        // Add animation classes
        if (animation !== 'none') {
            wrapperClasses.push('animated', animation);
        }

        // Add responsive display classes
        if (responsiveDisplay !== 'show-all') {
            wrapperClasses.push(responsiveDisplay);
        }

        // Build wrapper attributes
        let wrapperAttributes = '';
        if (cssId) {
            wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        }

        // Build animation styles
        let animationStyles = '';
        if (animation !== 'none') {
            const duration = animationDuration && typeof animationDuration === 'object'
                ? `${animationDuration.size}${animationDuration.unit}`
                : '0.5s';
            const delay = animationDelay && typeof animationDelay === 'object'
                ? `${animationDelay.size}${animationDelay.unit}`
                : '0s';
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }

        // Build dimension styles
        let dimensionStyles = '';
        if (width && (width.size !== '' || width.unit === 'auto')) {
            const wVal = width.unit === 'auto' ? 'auto' : `${width.size}${width.unit}`;
            dimensionStyles += `width: ${wVal}; `;
        }
        if (height && (height.size !== '' || height.unit === 'auto')) {
            const hVal = height.unit === 'auto' ? 'auto' : `${height.size}${height.unit}`;
            dimensionStyles += `height: ${hVal}; `;
        }

        // Build Flexbox styles
        let flexStyles = '';
        if (flexDisplay && flexDisplay !== 'default') {
            flexStyles += `display: ${flexDisplay}; `;
            if (flexDisplay === 'flex' || flexDisplay === 'inline-flex') {
                flexStyles += `flex-direction: ${flexDirection}; `;
                flexStyles += `justify-content: ${justifyContent}; `;
                flexStyles += `align-items: ${alignItems}; `;
                flexStyles += `flex-wrap: ${flexWrap}; `;

                if (flexGap && flexGap.size !== '' && flexGap.icon === undefined) { // Check if it's a valid simple object or just number, assuming object from slider
                    const gapVal = (typeof flexGap === 'object' && flexGap.unit) ? `${flexGap.size}${flexGap.unit}` : `${flexGap}px`;
                    flexStyles += `gap: ${gapVal}; `;
                }
            }
        }

        // Combine all styles
        const finalStyle = (animationStyles + dimensionStyles + flexStyles).trim();
        const wrapperStyle = finalStyle ? ` style="${finalStyle}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
