/**
 * MenuWidget - Custom navigation menu with submenu support
 */
class MenuWidget extends WidgetBase {
    getName() {
        return 'menu';
    }

    getTitle() {
        return 'Menu';
    }

    getIcon() {
        return 'fa fa-bars';
    }

    getCategories() {
        return ['content'];
    }

    getKeywords() {
        return ['menu', 'navigation', 'nav', 'submenu', 'dropdown'];
    }

    registerControls() {
        console.log('MenuWidget: registerControls() called');

        // Content Section
        this.startControlsSection('content_section', {
            label: 'Menu Items',
            tab: 'content'
        });

        this.addControl('menu_items', {
            type: 'menu',
            label: 'Menu Items',
            title_field: 'text',
            default_value: [
                {
                    text: 'Home',
                    url: '#home',
                    icon: 'fa fa-home',
                    has_submenu: false,
                    submenu_items: []
                },
                {
                    text: 'About',
                    url: '#about',
                    icon: 'fa fa-info-circle',
                    has_submenu: true,
                    submenu_items: [
                        { text: 'Our Team', url: '#team' },
                        { text: 'Our Story', url: '#story' },
                        { text: 'Careers', url: '#careers' }
                    ]
                },
                {
                    text: 'Services',
                    url: '#services',
                    icon: 'fa fa-cogs',
                    has_submenu: true,
                    submenu_items: [
                        { text: 'Web Design', url: '#web-design' },
                        { text: 'Development', url: '#development' },
                        { text: 'Marketing', url: '#marketing' }
                    ]
                },
                {
                    text: 'Contact',
                    url: '#contact',
                    icon: 'fa fa-envelope',
                    has_submenu: false,
                    submenu_items: []
                }
            ]
        });

        this.endControlsSection();

        // Layout Section
        this.startControlsSection('layout_section', {
            label: 'Layout',
            tab: 'content'
        });

        this.addControl('menu_layout', {
            type: 'select',
            label: 'Menu Layout',
            default_value: 'horizontal',
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
            ]
        });

        this.addControl('menu_align', {
            type: 'select',
            label: 'Menu Alignment',
            default_value: 'left',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        });

        this.addControl('show_icons', {
            type: 'select',
            label: 'Show Icons',
            default_value: true,
            options: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Menu Style',
            tab: 'style'
        });

        this.addControl('menu_background', {
            type: 'color',
            label: 'Background Color',
            default_value: '#ffffff'
        });

        this.addControl('menu_text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#1a1a1a'
        });

        this.addControl('menu_hover_color', {
            type: 'color',
            label: 'Hover Color',
            default_value: '#3b82f6'
        });

        this.addControl('menu_active_color', {
            type: 'color',
            label: 'Active Color',
            default_value: '#2563eb'
        });

        this.addControl('menu_font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 15, unit: 'px' },
            range: {
                min: 10,
                max: 30,
                step: 1
            }
        });

        this.addControl('menu_text_transform', {
            type: 'select',
            label: 'Text Transform',
            default_value: 'none',
            options: [
                { value: 'none', label: 'None' },
                { value: 'uppercase', label: 'Uppercase' },
                { value: 'lowercase', label: 'Lowercase' },
                { value: 'capitalize', label: 'Capitalize' }
            ]
        });

        this.addControl('menu_font_weight', {
            type: 'select',
            label: 'Font Weight',
            default_value: '500',
            options: [
                { value: '300', label: 'Light (300)' },
                { value: '400', label: 'Normal (400)' },
                { value: '500', label: 'Medium (500)' },
                { value: '600', label: 'Semi Bold (600)' },
                { value: '700', label: 'Bold (700)' },
                { value: '800', label: 'Extra Bold (800)' }
            ]
        });

        this.addControl('menu_font_style', {
            type: 'select',
            label: 'Font Style',
            default_value: 'normal',
            options: [
                { value: 'normal', label: 'Normal' },
                { value: 'italic', label: 'Italic' },
                { value: 'oblique', label: 'Oblique' }
            ]
        });

        this.endControlsSection();

        // Submenu Style Section
        this.startControlsSection('submenu_style_section', {
            label: 'Submenu Style',
            tab: 'style'
        });

        this.addControl('submenu_background', {
            type: 'color',
            label: 'Submenu Background',
            default_value: '#ffffff'
        });

        this.addControl('submenu_text_color', {
            type: 'color',
            label: 'Submenu Text Color',
            default_value: '#666666'
        });

        this.addControl('submenu_hover_color', {
            type: 'color',
            label: 'Submenu Hover Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const menuItems = this.getSetting('menu_items', []);
        const menuLayout = this.getSetting('menu_layout', 'horizontal');
        const menuAlign = this.getSetting('menu_align', 'left');
        const showIcons = this.getSetting('show_icons', true);

        const menuBackground = this.getSetting('menu_background', '#ffffff');
        const menuTextColor = this.getSetting('menu_text_color', '#1a1a1a');
        const menuHoverColor = this.getSetting('menu_hover_color', '#3b82f6');
        const menuActiveColor = this.getSetting('menu_active_color', '#2563eb');

        // Typography settings
        const menuFontSizeValue = this.getSetting('menu_font_size', { size: 15, unit: 'px' });
        const menuFontSize = typeof menuFontSizeValue === 'object' ? `${menuFontSizeValue.size}${menuFontSizeValue.unit}` : `${menuFontSizeValue}px`;
        const menuTextTransform = this.getSetting('menu_text_transform', 'none');
        const menuFontWeight = this.getSetting('menu_font_weight', '500');
        const menuFontStyle = this.getSetting('menu_font_style', 'normal');

        const submenuBackground = this.getSetting('submenu_background', '#ffffff');
        const submenuTextColor = this.getSetting('submenu_text_color', '#666666');
        const submenuHoverColor = this.getSetting('submenu_hover_color', '#3b82f6');

        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });


        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay : { size: 0, unit: 's' };

        // Generate unique ID - handle undefined widget ID
        const widgetId = this.id || `menu-${Date.now()}`;
        const uniqueId = `menu-${widgetId}`;

        // Generate menu items HTML
        const menuItemsHtml = menuItems.map((item, index) => {
            const itemId = `${uniqueId}-item-${index}`;
            const hasSubmenu = item.has_submenu === true || item.has_submenu === 'true';

            // Parse submenu items
            let submenuItems = [];
            if (hasSubmenu && item.submenu_items) {
                try {
                    if (typeof item.submenu_items === 'string') {
                        submenuItems = JSON.parse(item.submenu_items);
                    } else if (Array.isArray(item.submenu_items)) {
                        submenuItems = item.submenu_items;
                    }
                } catch (e) {
                    console.error('Error parsing submenu items:', e);
                    submenuItems = [];
                }
            }

            const iconHtml = showIcons && item.icon ? `<i class="${this.escapeHtml(item.icon)}" style="margin-right: 8px;"></i>` : '';
            const chevronHtml = hasSubmenu ? `<i class="fa fa-chevron-down" style="margin-left: 8px; font-size: 10px;"></i>` : '';

            // Generate submenu HTML
            let submenuHtml = '';
            if (hasSubmenu && submenuItems.length > 0) {
                const submenuItemsHtml = submenuItems.map(subItem => `
                    <a href="${this.escapeHtml(subItem.url || '#')}" 
                       style="display: block; padding: 10px 20px; color: ${submenuTextColor}; text-decoration: none; transition: all 0.2s; font-size: 14px;"
                       onmouseover="this.style.color='${submenuHoverColor}'; this.style.background='#f8fafc';"
                       onmouseout="this.style.color='${submenuTextColor}'; this.style.background='transparent';">
                        ${this.escapeHtml(subItem.text || 'Submenu Item')}
                    </a>
                `).join('');

                submenuHtml = `
                    <div id="${itemId}-submenu" 
                         style="display: none; position: absolute; top: 100%; left: 0; background: ${submenuBackground}; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-width: 200px; z-index: 1000; margin-top: 5px; overflow: hidden;">
                        ${submenuItemsHtml}
                    </div>
                `;
            }

            return `
                <li style="position: relative; list-style: none; ${menuLayout === 'horizontal' ? 'display: inline-block;' : 'display: block; width: 100%;'}"
                    onmouseover="${hasSubmenu ? `document.getElementById('${itemId}-submenu').style.display='block'` : ''}"
                    onmouseout="${hasSubmenu ? `document.getElementById('${itemId}-submenu').style.display='none'` : ''}">
                    <a href="${this.escapeHtml(item.url || '#')}" 
                       style="display: inline-block; padding: 12px 20px; color: ${menuTextColor}; text-decoration: none; font-size: ${menuFontSize}; font-weight: ${menuFontWeight}; font-style: ${menuFontStyle}; text-transform: ${menuTextTransform}; transition: all 0.2s; vertical-align: middle; white-space: nowrap;"
                       onmouseover="this.style.color='${menuHoverColor}';"
                       onmouseout="this.style.color='${menuTextColor}';"
                       onclick="this.style.color='${menuActiveColor}';">
                        ${iconHtml}${this.escapeHtml(item.text || 'Menu Item')}${chevronHtml}
                    </a>
                    ${submenuHtml}
                </li>
            `;
        }).join('');

        // Determine justify-content based on alignment
        let justifyContent = 'flex-start';
        if (menuAlign === 'center') justifyContent = 'center';
        if (menuAlign === 'right') justifyContent = 'flex-end';

        // Show placeholder if no menu items
        const content = menuItems.length === 0 ? `
            <div style="padding: 20px; text-align: center; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; color: #64748b;">
                <i class="fa fa-bars" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p style="margin: 0; font-size: 14px;">No menu items yet. Click to edit and add menu items.</p>
            </div>
        ` : `
            <nav style="background: ${menuBackground};">
                <ul style="margin: 0; padding: 0; display: flex; ${menuLayout === 'horizontal' ? 'flex-direction: row;' : 'flex-direction: column;'} justify-content: ${justifyContent}; align-items: ${menuLayout === 'horizontal' ? 'center' : 'stretch'};">
                    ${menuItemsHtml}
                </ul>
            </nav>
        `;

        let wrapperClasses = ['menu-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);

        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;

        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }

        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    getControls() {
        const controls = super.getControls();
        console.log('MenuWidget: getControls() called, returning', controls.length, 'controls');
        console.log('MenuWidget controls:', controls);
        return controls;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(MenuWidget);
