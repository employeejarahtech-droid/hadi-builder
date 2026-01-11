/**
 * MenuControl - Specialized control for building menus with submenus
 * Based on multi-repeater pattern but optimized for menu structure
 */
class MenuControl extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);

        this.titleField = args.title_field || 'text';
        this.value = Array.isArray(args.value) ? args.value : (args.default_value || []);
    }

    render() {
        const items = this.value || [];

        return `
            <div class="elementor-control-input-wrapper">
                <div class="elementor-menu-control">
                    <div class="elementor-menu-items">
                        ${items.map((item, index) => this.renderMenuItem(item, index)).join('')}
                    </div>
                    <button type="button" class="elementor-button elementor-menu-add">
                        <i class="fa fa-plus"></i> Add Menu Item
                    </button>
                </div>
            </div>
        `;
    }

    renderMenuItem(item, index) {
        const title = item[this.titleField] || `Menu Item #${index + 1}`;
        const hasSubmenu = item.has_submenu || false;
        const submenuItems = item.submenu_items || [];

        return `
            <div class="elementor-menu-item" data-index="${index}" draggable="true">
                <div class="elementor-menu-item-header">
                    <button type="button" class="elementor-menu-toggle">
                        <i class="fa fa-chevron-down"></i>
                    </button>
                    <span class="elementor-menu-item-title">${this.escapeHtml(title)}</span>
                    <button type="button" class="elementor-menu-remove">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="elementor-menu-item-content" style="display: none;">
                    <div class="elementor-control">
                        <label>Menu Text</label>
                        <input type="text" class="menu-field" data-field="text" value="${this.escapeHtml(item.text || '')}" placeholder="Menu Text">
                    </div>
                    <div class="elementor-control">
                        <label>URL</label>
                        <input type="text" class="menu-field" data-field="url" value="${this.escapeHtml(item.url || '')}" placeholder="https://example.com">
                    </div>
                    <div class="elementor-control">
                        <label>Icon (Font Awesome class)</label>
                        <div class="icon-box" data-index="${index}">
                            <input type="hidden" class="menu-icon-input" data-field="icon" value="${this.escapeHtml(item.icon || '')}" />
                            <span class="icon-trashs"><i class="fa fa-trash"></i></span>
                            <div class="icon-selected">
                                <i class="${this.escapeHtml(item.icon || '')}"></i>
                            </div>
                            <div class="icon-hover" data-menu-index="${index}">
                                <div>Choose Icon</div>
                            </div>
                        </div>
                    </div>
                    <div class="elementor-control">
                        <label>Has Submenu</label>
                        <select class="menu-field" data-field="has_submenu">
                            <option value="false" ${!hasSubmenu ? 'selected' : ''}>No</option>
                            <option value="true" ${hasSubmenu ? 'selected' : ''}>Yes</option>
                        </select>
                    </div>
                    
                    <div class="elementor-submenu-section" style="display: ${hasSubmenu ? 'block' : 'none'};">
                        <div class="elementor-submenu-header">
                            <strong>Submenu Items</strong>
                        </div>
                        <div class="elementor-submenu-items">
                            ${submenuItems.map((subItem, subIndex) => this.renderSubmenuItem(subItem, index, subIndex)).join('')}
                        </div>
                        <button type="button" class="elementor-button elementor-submenu-add" data-parent="${index}">
                            <i class="fa fa-plus"></i> Add Submenu Item
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderSubmenuItem(item, parentIndex, index) {
        const title = item.text || `Submenu Item #${index + 1}`;

        return `
            <div class="elementor-submenu-item" data-parent="${parentIndex}" data-index="${index}">
                <div class="elementor-submenu-item-header">
                    <span class="elementor-submenu-item-title">${this.escapeHtml(title)}</span>
                    <button type="button" class="elementor-submenu-remove">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="elementor-submenu-item-content">
                    <div class="elementor-control">
                        <label>Text</label>
                        <input type="text" class="submenu-field" data-field="text" value="${this.escapeHtml(item.text || '')}" placeholder="Submenu Text">
                    </div>
                    <div class="elementor-control">
                        <label>URL</label>
                        <input type="text" class="submenu-field" data-field="url" value="${this.escapeHtml(item.url || '')}" placeholder="https://example.com">
                    </div>
                </div>
            </div>
        `;
    }

    setupListeners() {
        super.setupListeners();

        this.$wrapper = $(`[data-control-id="${this.id}"]`);
        if (!this.$wrapper.length) return;

        this.$container = this.$wrapper.find('.elementor-menu-items');

        // Add menu item
        this.$wrapper.on('click', '.elementor-menu-add', (e) => {
            e.preventDefault();
            this.addMenuItem();
        });

        // Remove menu item
        this.$wrapper.on('click', '.elementor-menu-remove', (e) => {
            e.preventDefault();
            const $item = $(e.currentTarget).closest('.elementor-menu-item');
            const index = $item.data('index');
            this.removeMenuItem(index);
        });

        // Toggle menu item
        this.$wrapper.on('click', '.elementor-menu-toggle', (e) => {
            e.preventDefault();
            const $header = $(e.currentTarget).closest('.elementor-menu-item-header');
            const $content = $header.next('.elementor-menu-item-content');
            const $icon = $(e.currentTarget).find('i');

            $content.slideToggle(200);
            $icon.toggleClass('fa-chevron-down fa-chevron-right');
        });

        // Update menu field
        this.$wrapper.on('input change', '.menu-field', (e) => {
            const $item = $(e.currentTarget).closest('.elementor-menu-item');
            const index = $item.data('index');
            const field = $(e.currentTarget).data('field');
            let value = $(e.currentTarget).val();

            // Handle has_submenu toggle
            if (field === 'has_submenu') {
                value = value === 'true';
                const $submenuSection = $item.find('.elementor-submenu-section');
                $submenuSection.toggle(value);
            }

            this.updateMenuItemField(index, field, value);

            // Update title if text field changed
            if (field === 'text') {
                $item.find('.elementor-menu-item-title').text(value || `Menu Item #${index + 1}`);
            }
        });

        // Add submenu item
        this.$wrapper.on('click', '.elementor-submenu-add', (e) => {
            e.preventDefault();
            const parentIndex = $(e.currentTarget).data('parent');
            this.addSubmenuItem(parentIndex);
        });

        // Remove submenu item
        this.$wrapper.on('click', '.elementor-submenu-remove', (e) => {
            e.preventDefault();
            const $item = $(e.currentTarget).closest('.elementor-submenu-item');
            const parentIndex = $item.data('parent');
            const index = $item.data('index');
            this.removeSubmenuItem(parentIndex, index);
        });

        // Update submenu field
        this.$wrapper.on('input', '.submenu-field', (e) => {
            const $item = $(e.currentTarget).closest('.elementor-submenu-item');
            const parentIndex = $item.data('parent');
            const index = $item.data('index');
            const field = $(e.currentTarget).data('field');
            const value = $(e.currentTarget).val();

            this.updateSubmenuItemField(parentIndex, index, field, value);

            // Update title if text field changed
            if (field === 'text') {
                $item.find('.elementor-submenu-item-title').text(value || `Submenu Item #${index + 1}`);
            }
        });

        // Drag and drop for menu items
        this.setupDragDrop();

        // Icon picker functionality
        this.setupIconPicker();
    }

    setupDragDrop() {
        let draggedItem = null;

        this.$wrapper.on('dragstart', '.elementor-menu-item', (e) => {
            draggedItem = $(e.currentTarget);
            draggedItem.addClass('dragging');
            e.originalEvent.dataTransfer.effectAllowed = 'move';
        });

        this.$wrapper.on('dragover', '.elementor-menu-item', (e) => {
            e.preventDefault();
            const $target = $(e.currentTarget);
            if (draggedItem && !$target.is(draggedItem)) {
                $target.addClass('drag-over');
            }
        });

        this.$wrapper.on('dragleave', '.elementor-menu-item', (e) => {
            $(e.currentTarget).removeClass('drag-over');
        });

        this.$wrapper.on('drop', '.elementor-menu-item', (e) => {
            e.preventDefault();
            const $target = $(e.currentTarget);
            $target.removeClass('drag-over');

            if (draggedItem && !$target.is(draggedItem)) {
                draggedItem.insertBefore($target);
                this.reorderItems();
            }
        });

        this.$wrapper.on('dragend', '.elementor-menu-item', () => {
            if (draggedItem) {
                draggedItem.removeClass('dragging');
                draggedItem = null;
            }
            this.$wrapper.find('.elementor-menu-item').removeClass('drag-over');
        });
    }

    setupIconPicker() {
        // Icon selection click handler
        this.$wrapper.on('click', '.icon-hover', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const $iconBox = $(e.currentTarget).closest('.icon-box');
            const menuIndex = $(e.currentTarget).data('menu-index');
            const $input = $iconBox.find('.menu-icon-input');
            const currentIcon = $input.val();

            // Generate unique identifier for this icon picker
            const randId = `menu-icon-${menuIndex}-${Math.random().toString(36).substr(2, 9)}`;
            $iconBox.attr('data-rand-id', randId);

            const values = {
                selectedFiles: currentIcon,
                popType: 'single_select',
                popFileType: 'icon',
                dataSelector: `.icon-box[data-rand-id="${randId}"] .menu-icon-input`,
                dataFor: 'icon',
                controlId: this.id,
                menuIndex: menuIndex
            };

            console.log('Menu icon clicked, opening modal with values:', values);

            if (typeof window.myModalIcon !== 'undefined' && window.myModalIcon) {
                window.myModalIcon.open(values);
            } else {
                console.error('Icon modal (window.myModalIcon) not initialized');
            }
        });

        // Icon removal handler
        this.$wrapper.on('click', '.icon-trashs', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const $iconBox = $(e.currentTarget).closest('.icon-box');
            const menuIndex = $iconBox.data('index');
            const $input = $iconBox.find('.menu-icon-input');

            $input.val('');
            $iconBox.find('.icon-selected i').attr('class', '');

            // Update the menu item
            this.updateMenuItemField(menuIndex, 'icon', '');
        });

        // Listen for icon selection from modal
        this.$wrapper.on('change', '.menu-icon-input', (e) => {
            const $input = $(e.currentTarget);
            const $iconBox = $input.closest('.icon-box');
            const menuIndex = $iconBox.data('index');
            const newIcon = $input.val();

            console.log('Menu icon input changed to:', newIcon);

            // Update the displayed icon
            $iconBox.find('.icon-selected i').attr('class', newIcon);

            // Update the menu item
            this.updateMenuItemField(menuIndex, 'icon', newIcon);
        });
    }

    addMenuItem() {
        const newItem = {
            text: '',
            url: '#',
            icon: '',
            has_submenu: false,
            submenu_items: []
        };

        this.value.push(newItem);
        this.renderItems();
        this.handleChange(this.value, this.value);
    }

    removeMenuItem(index) {
        this.value.splice(index, 1);
        this.renderItems();
        this.handleChange(this.value, this.value);
    }

    updateMenuItemField(index, field, value) {
        if (this.value[index]) {
            this.value[index][field] = value;
            this.handleChange(this.value, this.value);
        }
    }

    addSubmenuItem(parentIndex) {
        if (!this.value[parentIndex]) return;

        if (!this.value[parentIndex].submenu_items) {
            this.value[parentIndex].submenu_items = [];
        }

        this.value[parentIndex].submenu_items.push({
            text: '',
            url: '#'
        });

        this.renderItems();
        this.handleChange(this.value, this.value);
    }

    removeSubmenuItem(parentIndex, index) {
        if (this.value[parentIndex] && this.value[parentIndex].submenu_items) {
            this.value[parentIndex].submenu_items.splice(index, 1);
            this.renderItems();
            this.handleChange(this.value, this.value);
        }
    }

    updateSubmenuItemField(parentIndex, index, field, value) {
        if (this.value[parentIndex] && this.value[parentIndex].submenu_items[index]) {
            this.value[parentIndex].submenu_items[index][field] = value;
            this.handleChange(this.value, this.value);
        }
    }

    reorderItems() {
        const newValue = [];
        this.$container.find('.elementor-menu-item').each((index, el) => {
            const oldIndex = $(el).data('index');
            if (this.value[oldIndex]) {
                newValue.push(this.value[oldIndex]);
            }
        });
        this.value = newValue;
        this.renderItems();
        this.handleChange(this.value, this.value);
    }

    renderItems() {
        this.$container.empty();
        this.value.forEach((item, index) => {
            this.$container.append(this.renderMenuItem(item, index));
        });
    }

    getValue() {
        return this.value;
    }

    setValue(newValue, silent = false) {
        const oldValue = this.value;
        this.value = Array.isArray(newValue) ? newValue : [];
        this.renderItems();

        if (!silent) {
            this.handleChange(this.value, oldValue);
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Register globally
window.MenuControl = MenuControl;

// Register with ControlManager if available
if (typeof window.elementorControlManager !== 'undefined') {
    window.elementorControlManager.registerControlType('menu', MenuControl);
}
