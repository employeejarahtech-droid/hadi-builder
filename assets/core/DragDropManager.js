/**
 * DragDropManager - Handles all drag-and-drop functionality
 * Manages dragging widgets from panel and reordering elements on canvas
 */
class DragDropManager extends EventEmitter {
    constructor() {
        super();

        this.draggedWidget = null; // Widget being dragged from panel
        this.draggedElement = null; // Element being dragged on canvas
        this.dropTarget = null;
        this.dropPosition = null;
        this.placeholder = null;
        this.initialized = false;
    }

    /**
     * Initialize drag-and-drop
     */
    init() {
        if (this.initialized) return;

        this.setupWidgetDrag();
        this.setupCanvasDrop();
        this.setupElementDrag();

        this.initialized = true;
        this.emit('init');
    }

    /**
     * Setup drag for widgets in panel
     */
    setupWidgetDrag() {
        $(document).on('dragstart', '.widget-card', (e) => {
            console.log('Drag started for widget (v2)');
            const widgetType = $(e.currentTarget).data('widget');
            this.draggedWidget = widgetType;

            // Visual feedback
            $('#canvas-area').css('border', '2px solid red');

            if (e.originalEvent && e.originalEvent.dataTransfer) {
                e.originalEvent.dataTransfer.effectAllowed = 'copy';
                e.originalEvent.dataTransfer.setData('text/plain', widgetType);
            }

            $(e.currentTarget).addClass('dragging');
            this.emit('widget:drag:start', widgetType);
        });

        $(document).on('dragend', '.widget-card', (e) => {
            console.log('Drag ended for widget (v2)');

            // Remove visual feedback
            $('#canvas-area').css('border', '');

            $(e.currentTarget).removeClass('dragging');
            this.draggedWidget = null;
            this.clearDropZones();
            this.emit('widget:drag:end');
        });
    }

    /**
     * Setup drop zones on canvas
     */
    setupCanvasDrop() {
        const $canvas = $('#canvas-area');

        // Dragover on canvas
        $canvas.on('dragover', (e) => {
            e.preventDefault();
            if (e.originalEvent && e.originalEvent.dataTransfer) {
                e.originalEvent.dataTransfer.dropEffect = 'copy';
            }

            if (this.draggedWidget || this.draggedElement) {
                // If not already showing drop zones, show them
                if (!$('.drop-zone').length) {
                    console.log('Showing drop zones for canvas');
                    this.showDropZones();
                }
            }
        });

        // Dragover on drop zones
        $(document).on('dragover', '.drop-zone', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const $dropZone = $(e.currentTarget);

            $('.drop-zone').removeClass('active');
            $dropZone.addClass('active');

            this.dropTarget = {
                position: $dropZone.data('position'),
                parentId: $dropZone.data('parent-id'),
                containerIndex: $dropZone.data('container-index')
            };
        });

        // Drop on drop zone
        $(document).on('drop', '.drop-zone', (e) => {
            console.log('Drop detected on zone');
            e.preventDefault();
            e.stopPropagation();

            if (!this.dropTarget) {
                console.warn('No drop target found');
                return;
            }

            const { position, parentId, containerIndex } = this.dropTarget;
            console.log('Dropping at:', position, parentId, containerIndex);

            if (this.draggedWidget) {
                this.emit('widget:dropped', this.draggedWidget, position, parentId, containerIndex);
            } else if (this.draggedElement) {
                this.emit('element:dropped', this.draggedElement, position, parentId, containerIndex);
            }

            this.clearDropZones();
            this.dropTarget = null;
        });
    }

    /**
     * Setup drag for elements on canvas
     */
    setupElementDrag() {
        $(document).on('dragstart', '.element-wrapper', (e) => {
            const elementId = $(e.currentTarget).data('element-id');
            this.draggedElement = elementId;

            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/plain', elementId);

            $(e.currentTarget).addClass('dragging');
            this.showDropZones();
            this.emit('element:drag:start', elementId);
        });

        $(document).on('dragend', '.element-wrapper', (e) => {
            $(e.currentTarget).removeClass('dragging');
            this.draggedElement = null;
            this.clearDropZones();
            this.emit('element:drag:end');
        });
    }

    /**
     * Show drop zones
     */
    showDropZones() {
        // Clear existing
        this.clearDropZones();

        try {
            if (!window.elementorElementManager) {
                console.error("CRITICAL: ElementManager not found globally!");
                return;
            }

            const rootElements = window.elementorElementManager.getRootElements();
            const $canvas = $('#canvas-area');

            // Render root drop zones
            this.renderDropZonesForContainer(rootElements, $canvas, null, 0);
        } catch (e) {
            console.error("Error in showDropZones:", e);
        }
    }

    /**
     * Recursive helper to render drop zones
     */
    renderDropZonesForContainer(elements, $container, parentId, containerIndex) {
        // Add start drop zone
        $container.prepend(this.createDropZone(0, parentId, containerIndex));

        elements.forEach((element, index) => {
            const $el = $(`.element-wrapper[data-element-id="${element.id}"]`);

            // Skip if this is the dragged element
            if (this.draggedElement && element.id === this.draggedElement) {
                return;
            }

            // Add drop zone after this element
            $el.after(this.createDropZone(index + 1, parentId, containerIndex));

            // Check for children slots (recursion)
            const $slots = $el.find('.elementor-container-slot');
            if ($slots.length > 0) {
                $slots.each((i, slot) => {
                    const $slot = $(slot);
                    const slotIndex = parseInt($slot.data('container-index'));
                    const children = window.elementorElementManager.getChildren(element.id, slotIndex);

                    // Recursive call for this slot
                    // We need to clear any text/content in empty slots temporarily? 
                    // No, just append drop zones. CSS will handle layout.
                    this.renderDropZonesForContainer(children, $slot, element.id, slotIndex);
                });
            }
        });

        // If container is empty but has no elements, the prepend above handles "Drop Here" if we style it right.
        // But for nested empty slots, we might need a specific "Empty" indicator zone.
        if (elements.length === 0) {
            // The prepended zone (0) is enough.
            // We can mark it as 'empty' if needed for styling
            $container.find('.drop-zone').first().addClass('empty-container-zone');
        }
    }

    /**
     * Create a drop zone element
     */
    createDropZone(position, parentId, containerIndex) {
        const $dropZone = $(`
            <div class="drop-zone" 
                data-position="${position}" 
                data-parent-id="${parentId || ''}" 
                data-container-index="${containerIndex}">
                <div class="drop-zone-line"></div>
            </div>
        `);
        return $dropZone;
    }

    /**
     * Clear all drop zones
     */
    clearDropZones() {
        $('.drop-zone').remove();
        this.dropTarget = null;
    }

    // Alias for init (called in renderer)
    initDropZones() {
        // We don't need to do anything here permanently, 
        // zones only appear during drag.
    }

    // ... rest of class logic ... (createPlaceholder, etc)


    /**
     * Create placeholder for dragged element
     * @param {jQuery} $element - Element being dragged
     * @returns {jQuery} Placeholder element
     */
    createPlaceholder($element) {
        const height = $element.outerHeight();
        const $placeholder = $(`
            <div class="element-placeholder" style="height: ${height}px;">
                <div class="placeholder-content">Drop here</div>
            </div>
        `);

        return $placeholder;
    }

    /**
     * Enable drag for an element
     * @param {string} elementId - Element ID
     */
    enableElementDrag(elementId) {
        const $element = $(`.element-wrapper[data-element-id="${elementId}"]`);
        $element.attr('draggable', 'true');
    }

    /**
     * Disable drag for an element
     * @param {string} elementId - Element ID
     */
    disableElementDrag(elementId) {
        const $element = $(`.element-wrapper[data-element-id="${elementId}"]`);
        $element.attr('draggable', 'false');
    }

    /**
     * Enable drag for all elements
     */
    enableAllElementDrag() {
        $('.element-wrapper').attr('draggable', 'true');
    }

    /**
     * Disable drag for all elements
     */
    disableAllElementDrag() {
        $('.element-wrapper').attr('draggable', 'false');
    }

    /**
     * Destroy drag-and-drop
     */
    destroy() {
        $(document).off('dragstart', '.widget-card');
        $(document).off('dragend', '.widget-card');
        $(document).off('dragstart', '.element-wrapper');
        $(document).off('dragend', '.element-wrapper');
        $(document).off('dragover', '.drop-zone');
        $(document).off('drop', '.drop-zone');

        $('#canvas-area').off('dragover drop');

        this.clearDropZones();
        this.removeAllListeners();
        this.initialized = false;
    }
}

// Create global instance
window.elementorDragDropManager = window.elementorDragDropManager || new DragDropManager();
