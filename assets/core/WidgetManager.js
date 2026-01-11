/**
 * WidgetManager - Manages all widget types and instances
 * Handles widget registration, creation, and rendering
 */
class WidgetManager extends EventEmitter {
    constructor() {
        super();

        this.widgetTypes = new Map(); // Map of widget classes by name
        this.categories = new Map(); // Map of categories
        this.initialized = false;
    }

    /**
     * Initialize the widget manager
     */
    init() {
        if (this.initialized) return;

        this.registerDefaultCategories();
        this.initialized = true;
        this.emit('init');
    }

    /**
     * Register default widget categories
     */
    registerDefaultCategories() {
        this.registerCategory('content', {
            title: 'Content',
            icon: 'fa fa-align-left',
            order: 1
        });

        this.registerCategory('layout', {
            title: 'Layout',
            icon: 'fa fa-columns',
            order: 2
        });

        this.registerCategory('basic', {
            title: 'Basic',
            icon: 'fa fa-columns',
            order: 2
        });

        this.registerCategory('team', {
            title: 'Team',
            icon: 'fa fa-users',
            order: 3
        });

        this.registerCategory('testimonials', {
            title: 'Testimonials',
            icon: 'fa fa-quote-right',
            order: 4
        });

        this.registerCategory('icons', {
            title: 'Icons',
            icon: 'fa fa-icons',
            order: 5
        });

        this.registerCategory('stats', {
            title: 'Stats',
            icon: 'fa fa-chart-bar',
            order: 6
        });

        this.registerCategory('pricing', {
            title: 'Pricing',
            icon: 'fa fa-dollar-sign',
            order: 7
        });

        this.registerCategory('cta', {
            title: 'Marketing',
            icon: 'fa fa-bullhorn',
            order: 8
        });

        this.registerCategory('interactive', {
            title: 'Interactive',
            icon: 'fa fa-hand-pointer',
            order: 9
        });

        this.registerCategory('media', {
            title: 'Media',
            icon: 'fa fa-image',
            order: 10
        });

        this.registerCategory('social', {
            title: 'Social',
            icon: 'fa fa-share-alt',
            order: 11
        });

        this.registerCategory('forms', {
            title: 'Forms',
            icon: 'fa fa-wpforms',
            order: 12
        });

        this.registerCategory('maps', {
            title: 'Maps',
            icon: 'fa fa-map-marked-alt',
            order: 13
        });

        this.registerCategory('events', {
            title: 'Events',
            icon: 'fa fa-calendar-alt',
            order: 14
        });

        this.registerCategory('ecommerce', {
            title: 'E-Commerce',
            icon: 'fa fa-shopping-cart',
            order: 15
        });


        this.registerCategory('section', {
            title: 'Section',
            icon: 'fa fa-section',
            order: 16
        });
    }


    /**
     * Register a category
     * @param {string} name - Category name
     * @param {object} options - Category options
     */
    registerCategory(name, options = {}) {
        this.categories.set(name, {
            name,
            title: options.title || name,
            icon: options.icon || 'fa fa-folder',
            order: options.order || 999
        });

        this.emit('category:registered', name);
    }

    /**
     * Get all categories
     * @returns {array} Array of categories
     */
    getCategories() {
        return Array.from(this.categories.values())
            .sort((a, b) => a.order - b.order);
    }

    /**
     * Register a widget type
     * @param {class} widgetClass - Widget class
     */
    registerWidget(widgetClass) {
        if (typeof widgetClass !== 'function') {
            console.error('Widget must be a class');
            return;
        }

        // Create temporary instance to get widget info
        const tempInstance = new widgetClass();
        const name = tempInstance.getName();

        if (!name) {
            console.error('Widget must have a name');
            return;
        }

        this.widgetTypes.set(name, widgetClass);
        this.emit('widget:registered', name);

        console.log(`Widget registered: ${name}`);
    }

    /**
     * Get a widget class by name
     * @param {string} name - Widget name
     * @returns {class|null} Widget class
     */
    getWidgetClass(name) {
        return this.widgetTypes.get(name) || null;
    }

    /**
     * Create a widget instance
     * @param {string} name - Widget name
     * @param {object} settings - Initial settings
     * @returns {WidgetBase|null} Widget instance
     */
    createWidget(name, settings = {}) {
        const WidgetClass = this.getWidgetClass(name);

        if (!WidgetClass) {
            console.error(`Widget type "${name}" not found`);
            return null;
        }

        const widget = new WidgetClass();
        widget.init(settings);

        this.emit('widget:created', widget);

        return widget;
    }

    /**
     * Get all registered widgets
     * @returns {array} Array of widget info
     */
    getWidgets() {
        const widgets = [];

        this.widgetTypes.forEach((WidgetClass, name) => {
            const tempInstance = new WidgetClass();
            widgets.push({
                name: tempInstance.getName(),
                title: tempInstance.getTitle(),
                icon: tempInstance.getIcon(),
                categories: tempInstance.getCategories(),
                keywords: tempInstance.getKeywords()
            });
        });

        return widgets;
    }

    /**
     * Get widgets by category
     * @param {string} category - Category name
     * @returns {array} Array of widgets in category
     */
    getWidgetsByCategory(category) {
        return this.getWidgets().filter(widget =>
            widget.categories.includes(category)
        );
    }

    /**
     * Search widgets by keyword
     * @param {string} query - Search query
     * @returns {array} Array of matching widgets
     */
    searchWidgets(query) {
        if (!query) return this.getWidgets();

        const lowerQuery = query.toLowerCase();

        return this.getWidgets().filter(widget => {
            const titleMatch = widget.title.toLowerCase().includes(lowerQuery);
            const nameMatch = widget.name.toLowerCase().includes(lowerQuery);
            const keywordMatch = widget.keywords.some(keyword =>
                keyword.toLowerCase().includes(lowerQuery)
            );

            return titleMatch || nameMatch || keywordMatch;
        });
    }

    /**
     * Check if widget type exists
     * @param {string} name - Widget name
     * @returns {boolean}
     */
    hasWidget(name) {
        return this.widgetTypes.has(name);
    }

    /**
     * Get number of registered widgets
     * @returns {number}
     */
    getWidgetCount() {
        return this.widgetTypes.size;
    }

    /**
     * Unregister a widget type
     * @param {string} name - Widget name
     */
    unregisterWidget(name) {
        if (this.widgetTypes.has(name)) {
            this.widgetTypes.delete(name);
            this.emit('widget:unregistered', name);
        }
    }

    /**
     * Destroy the widget manager
     */
    destroy() {
        this.widgetTypes.clear();
        this.categories.clear();
        this.removeAllListeners();
        this.initialized = false;
    }
}

// Create global instance
window.elementorWidgetManager = window.elementorWidgetManager || new WidgetManager();
