/**
 * PublicRenderer - Handles frontend rendering of the page builder content
 */
class PublicRenderer {
    constructor() {
        this.widgetManager = window.elementorWidgetManager;
        // We use a separate element manager logic or reuse the global one, 
        // but we must be careful about ID collisions if we load multiple sections.
        // For rendering HTML, we can process sections sequentially.
    }

    /**
     * Render a section (Header, Page, or Footer)
     * @param {string} containerSelector - DOM selector to inject content into
     * @param {Array} data - Serialized element data
     */
    renderSection(containerSelector, data) {
        const container = $(containerSelector);
        if (!container.length) {
            console.error('Container not found:', containerSelector);
            return;
        }

        // Use a temporary ElementManager instance to avoid conflicts/global state issues
        // We can't easily instantiate ElementManager because it might key off global state,
        // but let's try using the global one and clearing it between renders.
        const manager = window.elementorElementManager;

        // Clear previous state
        manager.clear();

        if (!data || !Array.isArray(data) || data.length === 0) {
            console.log('PublicRenderer: No data to render for', containerSelector);
            return;
        }

        console.log('PublicRenderer: Rendering', data.length, 'elements for', containerSelector);

        // Load data
        try {
            manager.deserialize(data);
            console.log('PublicRenderer: Deserialized successfully. Root elements:', manager.getRootElements().length);
        } catch (e) {
            console.error('Failed to deserialize data:', e);
            return;
        }

        // Render
        const rootElements = manager.getRootElements();
        rootElements.forEach(element => {
            console.log('PublicRenderer: Rendering root element', element.id, element.type);
            this.renderElementRecursive(element, container);
        });

        // After rendering HTML, we can clear the manager to free memory 
        // and prepare for next section (though IDs in DOM might still duplicates).
        // For a full frontend, we might want to run separate instances or namespaces,
        // but for this v1, this approach works for visual rendering.
        manager.clear();
    }

    /**
     * Recursively render an element and its children
     * @param {object} element - Element object
     * @param {jQuery} parentContainer - Container to append to
     */
    renderElementRecursive(element, parentContainer) {
        console.log('PublicRenderer: Recursive render for', element.id);

        if (!element.widget) {
            console.error('PublicRenderer: Widget not found for element', element.id);
            return;
        }

        // Render the widget/element
        let html;
        try {
            html = element.widget.render();
            console.log('PublicRenderer: Rendered HTML length:', html ? html.length : 0);
        } catch (e) {
            console.error('PublicRenderer: Widget render failed:', e);
            return;
        }

        const $elementWrapper = $(html);

        // Set ID (optional, might cause collisions if multiple sections use same IDs)
        $elementWrapper.attr('id', element.id);
        $elementWrapper.addClass('elementor-element');
        $elementWrapper.data('id', element.id);
        $elementWrapper.data('type', element.type);

        // Append to parent
        parentContainer.append($elementWrapper);

        // If it's a container (has children), render them
        // We need to find the content area within the widget

        // Default container is the wrapper itself
        let $childrenContainer = $elementWrapper;

        // Container-specific logic
        if (element.type === 'section') {
            const $cont = $elementWrapper.find('.elementor-container').first();
            if ($cont.length) $childrenContainer = $cont;
        } else if (element.type === 'column') {
            const $cont = $elementWrapper.find('.elementor-widget-wrap').first();
            if ($cont.length) $childrenContainer = $cont;
        }

        // Get children using the manager
        const manager = window.elementorElementManager;
        const children = manager.getChildren(element.id);

        if (children.length > 0) {
            console.log(`Element ${element.id} has ${children.length} children`);
        }

        children.forEach(child => {
            // Determine target based on containerIndex
            let $target = $childrenContainer;

            // If the widget has explicit slots (like ColumnsWidget), try to find the slot
            // defined by data-container-index attribute.
            const $slot = $elementWrapper.find(`[data-container-index="${child.containerIndex}"]`);
            if ($slot.length) {
                console.log(`Found slot for child ${child.id} at index ${child.containerIndex}`);
                $target = $slot;
            } else {
                console.log(`No specific slot found for child ${child.id} (index ${child.containerIndex}), appending to main container`);
            }

            this.renderElementRecursive(child, $target);
        });


        // Run any JS initialization for the widget (sliders, maps, etc)
        // element.widget.onInit? 
        // Since we are not in editor mode, we might need to trigger generic handlers.
    }

    init() {
        // Initialize widget manager if not already
        if (!this.widgetManager.initialized) {
            this.widgetManager.init();
        }

        console.log('PublicRenderer initialized');
    }
}

// Global instance
window.publicRenderer = new PublicRenderer();

// Auto-run if data is available
$(document).ready(function () {
    window.publicRenderer.init();

    if (window.SITE_DATA) {
        // Render Header
        if (window.SITE_DATA.header) {
            window.publicRenderer.renderSection('#site-header', window.SITE_DATA.header);
        }

        // Render Page Content
        if (window.SITE_DATA.page) {
            window.publicRenderer.renderSection('#site-content', window.SITE_DATA.page);
        }

        // Render Footer
        if (window.SITE_DATA.footer) {
            window.publicRenderer.renderSection('#site-footer', window.SITE_DATA.footer);
        }
    }
});
