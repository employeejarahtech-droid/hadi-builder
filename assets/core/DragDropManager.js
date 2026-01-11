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
        this.placeholder = null;
        this.initialized = false;

        // Cache for drop zone positions
        this.dropZoneCache = [];
        // Throttle for calculations
        this.lastDragOver = 0;

        // Auto-scroll state
        this.scrollInterval = null;
        this.scrollSpeed = 0;
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
            this.draggedWidget = null;
            this.clearDropZones();
            this.stopAutoScroll();
            this.dropZoneCache = [];
            this.emit('widget:drag:end');
        });
    }

    /**
     * Setup drop zones on canvas
     */
    setupCanvasDrop() {
        const $canvas = $('#canvas-area');

        // Dragover on canvas - PRIMARY HANDLER
        $canvas.on('dragover', (e) => {
            e.preventDefault();
            this.handleAutoScroll(e);

            if (e.originalEvent && e.originalEvent.dataTransfer) {
                e.originalEvent.dataTransfer.dropEffect = 'copy';
            }

            // Throttling for performance
            const now = Date.now();
            if (now - this.lastDragOver < 20) return;
            this.lastDragOver = now;

            if (this.draggedWidget || this.draggedElement) {
                // If not already showing drop zones, show them and calculate cache
                if (!$('.drop-zone').length) {
                    console.log('Showing and caching drop zones');
                    this.showDropZones();
                    this.calculateDropZones(); // Calc once when they appear
                } else if (this.dropZoneCache.length === 0) {
                    // Recalc if cache empty but zones exist
                    this.calculateDropZones();
                }

                // Find nearest zone based on mouse coords
                // Find nearest zone based on mouse coords
                const pageY = e.originalEvent.pageY;
                const pageX = e.originalEvent.pageX;
                this.highlightNearestDropZone(pageX, pageY);
            }
        });

        // Legacy zone handlers removed to prevent conflict


        // Global Drop Handler on Canvas
        // This ensures we catch drops even if the mouse isn't EXACTLY on the 6px line
        $canvas.on('drop', (e) => {
            console.log('Global Canvas Drop');
            e.preventDefault();
            e.stopPropagation();

            if (!this.dropTarget) {
                console.warn('No active drop target identified');
                return;
            }

            const { position, parentId, containerIndex } = this.dropTarget;
            console.log('Processing drop at:', position, parentId, containerIndex);
            console.log('Drop target details:', this.dropTarget);

            if (this.draggedWidget) {
                console.log('Emitting widget:dropped with parentId:', parentId);
                this.emit('widget:dropped', this.draggedWidget, position, parentId, containerIndex);
            } else if (this.draggedElement) {
                this.emit('element:dropped', this.draggedElement, position, parentId, containerIndex);
            }

            this.clearDropZones();
            this.stopAutoScroll();
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
            this.calculateDropZones();
            this.emit('element:drag:start', elementId);
        });

        $(document).on('dragend', '.element-wrapper', (e) => {
            $(e.currentTarget).removeClass('dragging');
            this.draggedElement = null;
            this.draggedElement = null;
            this.clearDropZones();
            this.stopAutoScroll();
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
        console.log(`[DROP ZONE] Rendering for parentId: ${parentId}, containerIndex: ${containerIndex}, elements: ${elements.length}`);

        // Add start drop zone
        console.log(`  → Creating drop zone at position 0`);
        $container.prepend(this.createDropZone(0, parentId, containerIndex));

        elements.forEach((element, index) => {
            const $el = $(`.element-wrapper[data-element-id="${element.id}"]`);

            // Skip if this is the dragged element
            if (this.draggedElement && element.id === this.draggedElement) {
                return;
            }

            // Add drop zone after this element
            console.log(`  → Creating drop zone at position ${index + 1} (after ${element.id})`);
            $el.after(this.createDropZone(index + 1, parentId, containerIndex));


            // Check for children slots (recursion)
            // Find slots within this element's content (not in nested elements)
            const $slots = $el.find('.element-content > .elementor-container-slot, .element-content > * > .elementor-container-slot');
            if ($slots.length > 0) {
                $slots.each((i, slot) => {
                    const $slot = $(slot);
                    const slotIndex = parseInt($slot.data('container-index'));
                    const children = window.elementorElementManager.getChildren(element.id, slotIndex);

                    // Recursive call for this slot
                    this.renderDropZonesForContainer(children, $slot, element.id, slotIndex);
                });
            }
        });

        // If container is empty but has no elements, the prepend above handles "Drop Here" if we style it right.
        // But for nested empty slots, we might need a specific "Empty" indicator zone.
        if (elements.length === 0) {
            console.log(`  ✓ Empty container - marked zone 0 as empty-container-zone`);
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
        // init is handled dynamically.
    }

    /**
     * Calculate positions of all visible drop zones
     */
    calculateDropZones() {
        this.dropZoneCache = [];
        const self = this;
        const $wrapper = $('.canvas-wrapper');
        this.initialScrollTop = $wrapper.scrollTop() || 0;
        this.initialScrollLeft = $wrapper.scrollLeft() || 0;

        $('.drop-zone').each(function () {
            const $zone = $(this);
            const offset = $zone.offset();
            const width = $zone.outerWidth();
            const height = $zone.outerHeight();

            // We care about center point relative to DOCUMENT
            const midY = offset.top + (height / 2);
            const midX = offset.left + (width / 2);

            self.dropZoneCache.push({
                element: $zone,
                y: midY,
                x: midX,
                position: parseInt($zone.data('position')),
                parentId: $zone.data('parent-id') || null,  // Convert empty string to null
                containerIndex: parseInt($zone.data('container-index'))
            });
        });

        console.log(`Cached ${this.dropZoneCache.length} drop zones (Scroll: ${this.initialScrollTop}, ${this.initialScrollLeft})`);
    }

    /**
     * Find and highlight the nearest drop zone
     */
    highlightNearestDropZone(pageX, pageY) {
        if (this.dropZoneCache.length === 0) return;

        const $wrapper = $('.canvas-wrapper');
        const currentScrollTop = $wrapper.scrollTop() || 0;
        const currentScrollLeft = $wrapper.scrollLeft() || 0;

        // Calculate how much the content has moved since caching
        const deltaY = currentScrollTop - this.initialScrollTop;
        const deltaX = currentScrollLeft - this.initialScrollLeft;

        let closestZone = null;
        let minDistance = Infinity;

        for (const zone of this.dropZoneCache) {
            // Adjust cached position by scroll delta
            // If we scrolled DOWN (delta > 0), content moved UP, so Y decreases.
            const zoneY = zone.y - deltaY;
            const zoneX = zone.x - deltaX;

            // Euclidean distance matching page coords
            const dx = pageX - zoneX;
            const dy = pageY - zoneY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                closestZone = zone;
            }
        }

        // Snap threshold could be added (e.g. only if within 50px)
        // But for better UX, always snapping to *something* is usually preferred inside the canvas.

        if (closestZone) {
            // Only update DOM if changed
            if (!closestZone.element.hasClass('active')) {
                $('.drop-zone').removeClass('active');
                $('.element-wrapper').removeClass('drop-target-parent'); // specific class for drag parent

                closestZone.element.addClass('active');

                // Highlight parent container if exists
                if (closestZone.parentId) {
                    $(`.element-wrapper[data-element-id="${closestZone.parentId}"]`).addClass('drop-target-parent');
                }

                this.dropTarget = {
                    position: closestZone.position,
                    parentId: closestZone.parentId,
                    containerIndex: closestZone.containerIndex
                };
            }
        }
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
     * Handle auto-scrolling when dragging near edges
     */
    handleAutoScroll(e) {
        const $wrapper = $('.canvas-wrapper');
        if (!$wrapper.length) return;

        const wrapperHeight = $wrapper.height();
        const wrapperTop = $wrapper.offset().top;
        const clientY = e.originalEvent.clientY;

        // Threshold for scrolling (pixels from edges)
        const threshold = 60;
        const maxSpeed = 15;

        const relativeY = clientY - wrapperTop;

        let speed = 0;
        if (relativeY < threshold) {
            // Scroll up
            speed = -maxSpeed * (1 - relativeY / threshold);
        } else if (relativeY > wrapperHeight - threshold) {
            // Scroll down
            speed = maxSpeed * (1 - (wrapperHeight - relativeY) / threshold);
        }

        this.scrollSpeed = speed;

        if (Math.abs(speed) > 0) {
            if (!this.scrollInterval) {
                this.scrollInterval = setInterval(() => {
                    if (Math.abs(this.scrollSpeed) > 0) {
                        $wrapper.scrollTop($wrapper.scrollTop() + this.scrollSpeed);
                    }
                }, 16);
            }
        } else {
            this.stopAutoScroll();
        }
    }

    /**
     * Stop auto-scrolling
     */
    stopAutoScroll() {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
        }
        this.scrollSpeed = 0;
    }

    /**
     * Destroy drag-and-drop
     */
    destroy() {
        this.stopAutoScroll();
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
