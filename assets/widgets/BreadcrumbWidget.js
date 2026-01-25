/**
 * BreadcrumbWidget - Breadcrumb navigation widget
 * Creates breadcrumb navigation trails
 */
class BreadcrumbWidget extends WidgetBase {
    getName() {
        return 'breadcrumb';
    }

    getTitle() {
        return 'Breadcrumb';
    }

    getIcon() {
        return 'fa fa-chevron-right';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['breadcrumb', 'navigation', 'trail', 'path', 'hierarchy'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Breadcrumb Items',
            tab: 'content'
        });

        this.addControl('items', {
            type: 'repeater',
            label: 'Items',
            default_value: [
                { text: 'Home', url: '/' },
                { text: 'Products', url: '/products' },
                { text: 'Current Page', url: '' }
            ],
            fields: [
                {
                    id: 'text',
                    type: 'text',
                    label: 'Text',
                    default_value: 'Item',
                    placeholder: 'Item text'
                },
                {
                    id: 'url',
                    type: 'url',
                    label: 'URL',
                    default_value: '',
                    placeholder: 'Leave empty for current page'
                }
            ]
        });

        this.addControl('separator', {
            type: 'select',
            label: 'Separator',
            default_value: 'chevron',
            options: [
                { value: 'chevron', label: 'Chevron (›)' },
                { value: 'slash', label: 'Slash (/)' },
                { value: 'arrow', label: 'Arrow (→)' },
                { value: 'dot', label: 'Dot (•)' },
                { value: 'pipe', label: 'Pipe (|)' },
                { value: 'custom', label: 'Custom' }
            ]
        });

        this.addControl('custom_separator', {
            type: 'text',
            label: 'Custom Separator',
            default_value: '>',
            condition: {
                terms: [
                    { name: 'separator', operator: '==', value: 'custom' }
                ]
            }
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            default_value: 'left',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#666666'
        });

        this.addControl('link_color', {
            type: 'color',
            label: 'Link Color',
            default_value: '#3b82f6'
        });

        this.addControl('current_color', {
            type: 'color',
            label: 'Current Page Color',
            default_value: '#333333'
        });

        this.addControl('separator_color', {
            type: 'color',
            label: 'Separator Color',
            default_value: '#999999'
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 14, unit: 'px' },
            range: {
                min: 10,
                max: 24,
                step: 1
            },
            responsive: true
        });

        this.addControl('spacing', {
            type: 'slider',
            label: 'Item Spacing',
            default_value: { size: 10, unit: 'px' },
            range: {
                min: 0,
                max: 30,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const items = this.getSetting('items', [
            { text: 'Home', url: '/' },
            { text: 'Products', url: '/products' },
            { text: 'Current Page', url: '' }
        ]);
        const separator = this.getSetting('separator', 'chevron');
        const customSeparator = this.getSetting('custom_separator', '>');
        const align = this.getSetting('align', 'left');
        const textColor = this.getSetting('text_color', '#666666');
        const linkColor = this.getSetting('link_color', '#3b82f6');
        const currentColor = this.getSetting('current_color', '#333333');
        const separatorColor = this.getSetting('separator_color', '#999999');
        const fontSize = this.getSetting('font_size', { size: 14, unit: 'px' });
        const spacing = this.getSetting('spacing', { size: 10, unit: 'px' });

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate animation values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        // Get separator symbol
        const separatorMap = {
            chevron: '›',
            slash: '/',
            arrow: '→',
            dot: '•',
            pipe: '|',
            custom: customSeparator
        };
        const separatorSymbol = separatorMap[separator] || separatorMap.chevron;

        // Generate unique ID for styles
        const uniqueId = `breadcrumb-${Math.random().toString(36).substr(2, 9)}`;

        // Build styles
        const styles = `
            <style>
                .${uniqueId} {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: ${align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'};
                    gap: ${spacing.size}${spacing.unit};
                    font-size: ${fontSize.size}${fontSize.unit};
                    color: ${textColor};
                }
                .${uniqueId} a {
                    color: ${linkColor};
                    text-decoration: none;
                    transition: opacity 0.3s;
                }
                .${uniqueId} a:hover {
                    opacity: 0.7;
                    text-decoration: underline;
                }
                .${uniqueId} .breadcrumb-current {
                    color: ${currentColor};
                    font-weight: 500;
                }
                .${uniqueId} .breadcrumb-separator {
                    color: ${separatorColor};
                    user-select: none;
                }
            </style>
        `;

        // Build breadcrumb items
        const itemsArray = Array.isArray(items) ? items : [];
        const breadcrumbItems = itemsArray.map((item, index) => {
            const text = item.text || 'Item';
            const url = item.url || '';
            const isLast = index === itemsArray.length - 1;

            let itemHtml = '';

            // Add item
            if (url && !isLast) {
                itemHtml += `<a href="${this.escapeHtml(url)}">${this.escapeHtml(text)}</a>`;
            } else {
                itemHtml += `<span class="breadcrumb-current">${this.escapeHtml(text)}</span>`;
            }

            // Add separator (except for last item)
            if (!isLast) {
                itemHtml += `<span class="breadcrumb-separator">${this.escapeHtml(separatorSymbol)}</span>`;
            }

            return itemHtml;
        }).join('');

        const content = `
            ${styles}
            <div class="section-breadcrumb">
                <div class="container">
                    <nav class="${uniqueId}" aria-label="Breadcrumb">
                        ${breadcrumbItems}
                    </nav>
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['breadcrumb-widget'];
        if (cssClasses) {
            wrapperClasses.push(cssClasses);
        }
        if (animation !== 'none') {
            wrapperClasses.push('animated', animation);
        }

        // Build wrapper attributes
        let wrapperAttributes = '';
        if (cssId) {
            wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        }

        // Build animation styles
        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }

        // Combine wrapper style
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(BreadcrumbWidget);
