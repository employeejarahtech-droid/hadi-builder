/**
 * IconListWidget - Icon bullet list widget
 * Displays list items with icon bullets
 */
class IconListWidget extends WidgetBase {
    getName() {
        return 'icon_list';
    }

    getTitle() {
        return 'Icon List';
    }

    getIcon() {
        return 'fa fa-list-ul';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['icon', 'list', 'bullet', 'checklist', 'features'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'List Items',
            tab: 'content'
        });

        this.addControl('items', {
            type: 'repeater',
            label: 'Items',
            default_value: [
                { text: 'Professional design and development', icon: 'fa fa-check' },
                { text: 'Responsive and mobile-friendly', icon: 'fa fa-check' },
                { text: 'Fast loading and optimized', icon: 'fa fa-check' },
                { text: 'SEO friendly structure', icon: 'fa fa-check' }
            ],
            fields: [
                {
                    id: 'text',
                    type: 'text',
                    label: 'Text',
                    default_value: 'List item',
                    placeholder: 'Enter list item text'
                },
                {
                    id: 'icon',
                    type: 'text',
                    label: 'Icon',
                    default_value: 'fa fa-check',
                    placeholder: 'e.g., fa fa-check'
                }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#059669'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#1a1a1a'
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 16, unit: 'px' },
            range: {
                min: 12,
                max: 32,
                step: 1
            }
        });

        this.addControl('text_size', {
            type: 'slider',
            label: 'Text Size',
            default_value: { size: 16, unit: 'px' },
            range: {
                min: 12,
                max: 24,
                step: 1
            }
        });

        this.addControl('spacing', {
            type: 'slider',
            label: 'Item Spacing',
            default_value: { size: 12, unit: 'px' },
            range: {
                min: 0,
                max: 40,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const items = this.getSetting('items', [
            { text: 'Professional design and development', icon: 'fa fa-check' },
            { text: 'Responsive and mobile-friendly', icon: 'fa fa-check' },
            { text: 'Fast loading and optimized', icon: 'fa fa-check' },
            { text: 'SEO friendly structure', icon: 'fa fa-check' }
        ]);
        const iconColor = this.getSetting('icon_color', '#059669');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const iconSize = this.getSetting('icon_size', { size: 16, unit: 'px' });
        const textSize = this.getSetting('text_size', { size: 16, unit: 'px' });
        const spacing = this.getSetting('spacing', { size: 12, unit: 'px' });

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

        // Validate sizes
        const safeIconSize = (iconSize && typeof iconSize === 'object' && iconSize.size !== undefined && iconSize.unit !== undefined)
            ? iconSize
            : { size: 16, unit: 'px' };

        const safeTextSize = (textSize && typeof textSize === 'object' && textSize.size !== undefined && textSize.unit !== undefined)
            ? textSize
            : { size: 16, unit: 'px' };

        const safeSpacing = (spacing && typeof spacing === 'object' && spacing.size !== undefined && spacing.unit !== undefined)
            ? spacing
            : { size: 12, unit: 'px' };

        // Build list items
        const itemsArray = Array.isArray(items) ? items : [];
        const listItems = itemsArray.map((item, index) => {
            const text = item.text || 'List item';
            const icon = item.icon || 'fa fa-check';

            return `
                <li style="margin-bottom: ${index < itemsArray.length - 1 ? safeSpacing.size + safeSpacing.unit : '0'};">
                    <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: ${safeIconSize.size}${safeIconSize.unit}; margin-right: 12px;"></i>
                    <span style="color: ${textColor}; font-size: ${safeTextSize.size}${safeTextSize.unit}; line-height: 1.6;">${this.escapeHtml(text)}</span>
                </li>
            `;
        }).join('');

        const content = `
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${listItems}
            </ul>
        `;

        // Build wrapper classes
        let wrapperClasses = ['icon-list-widget'];
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

window.elementorWidgetManager.registerWidget(IconListWidget);
