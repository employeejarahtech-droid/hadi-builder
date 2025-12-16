/**
 * ElementManager - Manages elements on the canvas
 * Handles element creation, selection, deletion, and reordering
 */
class ElementManager extends EventEmitter {
    constructor() {
        super();

        this.elements = new Map(); // Map of element instances by ID
        this.selectedElementId = null;
        this.nextId = 1;
    }

    /**
     * Generate unique element ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `elem_${this.nextId++}`;
    }

    /**
     * Create a new element
     * @param {string} widgetType - Widget type name
     * @param {object} settings - Initial settings
     * @param {string} parentId - Parent element ID (optional)
     * @param {number} containerIndex - Container/Column index in parent (optional)
     * @param {number} position - Order position (optional)
     * @returns {object} Element object
     */
    createElement(widgetType, settings = {}, parentId = null, containerIndex = 0, position = null) {
        const widget = window.elementorWidgetManager.createWidget(widgetType, settings);

        if (!widget) {
            console.error(`Failed to create widget: ${widgetType}`);
            return null;
        }

        const id = this.generateId();

        // Calculate order if not provided
        if (position === null) {
            position = this.getChildren(parentId, containerIndex).length;
        }

        const element = {
            id,
            type: widgetType,
            widget,
            settings: widget.getSettings(),
            parentId: parentId || null,
            containerIndex: containerIndex || 0,
            order: position
        };

        // Store element
        this.elements.set(id, element);

        // Update orders of other siblings if inserted in middle
        this.updateSiblingOrders(parentId, containerIndex, position, 1);

        // Listen to widget changes
        widget.on('settings:change', (settings) => {
            element.settings = settings;
            this.emit('element:updated', id, element);
        });

        this.emit('element:created', id, element);

        return element;
    }

    /**
     * Get an element by ID
     * @param {string} id - Element ID
     * @returns {object|null} Element object
     */
    getElement(id) {
        return this.elements.get(id) || null;
    }

    /**
     * Get all elements (flat list)
     * @returns {array} Array of elements
     */
    getAllElements() {
        return Array.from(this.elements.values());
    }

    /**
     * Get root elements (no parent) sorted by order
     * @returns {array} Array of elements
     */
    getRootElements() {
        return this.getChildren(null);
    }

    /**
     * Get children of a parent in a specific container
     * @param {string|null} parentId 
     * @param {number} containerIndex 
     * @returns {array} Sorted array of children
     */
    getChildren(parentId, containerIndex = null) {
        const children = [];
        this.elements.forEach(element => {
            if (element.parentId === parentId) {
                if (containerIndex === null || element.containerIndex === containerIndex) {
                    children.push(element);
                }
            }
        });
        return children.sort((a, b) => a.order - b.order);
    }

    /**
     * Update element settings
     * @param {string} id - Element ID
     * @param {object} settings - New settings
     */
    updateElement(id, settings) {
        const element = this.elements.get(id);

        if (!element) {
            console.error(`Element not found: ${id}`);
            return;
        }

        element.widget.setSettings(settings);
        element.settings = element.widget.getSettings();

        this.emit('element:updated', id, element);
    }

    /**
     * Delete an element and its children
     * @param {string} id - Element ID
     */
    deleteElement(id) {
        const element = this.elements.get(id);

        if (!element) {
            console.error(`Element not found: ${id}`);
            return;
        }

        // Delete children first (recursion)
        const children = this.getChildren(id);
        children.forEach(child => this.deleteElement(child.id));

        // Remove from sibling order
        this.updateSiblingOrders(element.parentId, element.containerIndex, element.order + 1, -1);

        // Destroy widget
        element.widget.destroy();

        // Remove from storage
        this.elements.delete(id);

        // Deselect if selected
        if (this.selectedElementId === id) {
            this.selectedElementId = null;
            this.emit('element:deselected');
        }

        this.emit('element:deleted', id);
    }

    /**
     * Duplicate an element
     * @param {string} id - Element ID
     * @returns {object|null} New element
     */
    duplicateElement(id) {
        const element = this.elements.get(id);

        if (!element) {
            console.error(`Element not found: ${id}`);
            return null;
        }

        // Create duplicate at next position
        const newElement = this.createElement(
            element.type,
            element.settings,
            element.parentId,
            element.containerIndex,
            element.order + 1
        );

        // TODO: Recursively duplicate children if it's a container
        // Keeping it simple for now (shallow duplicate of container, empty children)

        this.emit('element:duplicated', id, newElement.id);

        return newElement;
    }

    /**
     * Move element to new position/parent
     * @param {string} id - Element ID
     * @param {string|null} newParentId 
     * @param {number} newContainerIndex 
     * @param {number} newPosition 
     */
    moveElement(id, newParentId, newContainerIndex, newPosition) {
        const element = this.elements.get(id);
        if (!element) return;

        const oldParentId = element.parentId;
        const oldContainerIndex = element.containerIndex;
        const oldOrder = element.order;

        // If moving within same container
        if (oldParentId === newParentId && oldContainerIndex === newContainerIndex) {
            if (oldOrder === newPosition) return;

            // Remove from old order
            this.updateSiblingOrders(oldParentId, oldContainerIndex, oldOrder + 1, -1);
            // Insert into new order (adjusting for removal if needed, but since we use splice logic roughly:
            // Actually, if moving down, the newPosition index might be shifted. 
            // Simpler: Extract, shift others, Insert.

            // Re-fetch siblings to handle reorder strictly
            const siblings = this.getChildren(oldParentId, oldContainerIndex);
            // remove self
            const filtered = siblings.filter(el => el.id !== id);
            // insert self
            filtered.splice(newPosition, 0, element);
            // update all orders
            filtered.forEach((el, index) => el.order = index);
        } else {
            // Moving to different container

            // Remove from old container
            this.updateSiblingOrders(oldParentId, oldContainerIndex, oldOrder + 1, -1);

            // Update sibling orders in new container (make space)
            this.updateSiblingOrders(newParentId, newContainerIndex, newPosition, 1);

            // Update element
            element.parentId = newParentId;
            element.containerIndex = newContainerIndex;
            element.order = newPosition;
        }

        this.emit('element:moved', id);
    }

    /**
     * Shift order of siblings
     */
    updateSiblingOrders(parentId, containerIndex, startOrder, delta) {
        this.elements.forEach(element => {
            if (element.parentId === parentId &&
                element.containerIndex === containerIndex &&
                element.order >= startOrder) {
                element.order += delta;
            }
        });
    }

    /**
     * Select an element
     * @param {string} id - Element ID
     */
    selectElement(id) {
        if (!this.elements.has(id)) {
            console.error(`Element not found: ${id}`);
            return;
        }

        const previousId = this.selectedElementId;
        this.selectedElementId = id;

        this.emit('element:selected', id, previousId);
    }

    /**
     * Deselect current element
     */
    deselectElement() {
        const previousId = this.selectedElementId;
        this.selectedElementId = null;

        this.emit('element:deselected', previousId);
    }

    getElement(id) {
        return this.elements.get(id);
    }

    getElements() {
        // Alias for getAllElements to keep compatibility if mostly getting all
        // But for rendering we usually want recursion. 
        // Let's stick to getAllElements for serialization
        return Array.from(this.elements.values());
    }

    /**
     * Clear all elements
     */
    clear() {
        this.elements.forEach(element => {
            element.widget.destroy();
        });

        this.elements.clear();
        this.selectedElementId = null;
        this.nextId = 1;

        this.emit('elements:cleared');
    }

    /**
     * Serialize all elements
     * @returns {array} Array of serialized elements
     */
    serialize() {
        // Save flat list, reliable for reconstruction
        return Array.from(this.elements.values()).map(element => ({
            id: element.id,
            type: element.type,
            settings: element.settings,
            parentId: element.parentId,
            containerIndex: element.containerIndex,
            order: element.order
        }));
    }

    /**
     * Deserialize and restore elements
     * @param {array} data - Array of serialized elements
     */
    deserialize(data) {
        this.clear();

        if (!Array.isArray(data)) return;

        // Sort by ID to ensure some stability? No, just load.
        // We need to properly set nextId
        let maxId = 0;

        data.forEach(elementData => {
            // Parse ID numeral
            const idNum = parseInt(elementData.id.replace('elem_', ''));
            if (idNum > maxId) maxId = idNum;

            const widget = window.elementorWidgetManager.createWidget(elementData.type, elementData.settings);

            if (widget) {
                const element = {
                    id: elementData.id,
                    type: elementData.type,
                    widget,
                    settings: widget.getSettings(),
                    parentId: elementData.parentId || null, // handle legacy null
                    containerIndex: elementData.containerIndex || 0,
                    order: elementData.order || 0
                };

                this.elements.set(element.id, element);

                widget.on('settings:change', (settings) => {
                    element.settings = settings;
                    this.emit('element:updated', element.id, element);
                });
            } else {
                console.error(`Failed to deserialize element ${elementData.id}: Widget type "${elementData.type}" not registered.`);
            }
        });

        this.nextId = maxId + 1;

        this.emit('elements:loaded', data.length);
    }

    getElementCount() {
        return this.elements.size;
    }

    hasElement(id) {
        return this.elements.has(id);
    }

    destroy() {
        this.clear();
        this.removeAllListeners();
    }
}

// Create global instance
window.elementorElementManager = window.elementorElementManager || new ElementManager();
