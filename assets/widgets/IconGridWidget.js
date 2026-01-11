/**
 * IconGridWidget - Grid of icons widget
 * Displays icons in a responsive grid layout
 */
class IconGridWidget extends WidgetBase {
    getName() {
        return 'icon_grid';
    }

    getTitle() {
        return 'Icon Grid';
    }

    getIcon() {
        return 'fa fa-th';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['icon', 'grid', 'icons', 'gallery', 'showcase'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Icons',
            tab: 'content'
        });

        this.addControl('icons', {
            type: 'repeater',
            label: 'Icons',
            default_value: [
                { icon: 'fa fa-rocket', label: 'Launch' },
                { icon: 'fa fa-chart-line', label: 'Growth' },
                { icon: 'fa fa-shield-alt', label: 'Security' },
                { icon: 'fa fa-users', label: 'Team' },
                { icon: 'fa fa-cog', label: 'Settings' },
                { icon: 'fa fa-heart', label: 'Love' }
            ],
            fields: [
                {
                    id: 'icon',
                    type: 'text',
                    label: 'Icon',
                    default_value: 'fa fa-star',
                    placeholder: 'e.g., fa fa-star'
                },
                {
                    id: 'label',
                    type: 'text',
                    label: 'Label',
                    default_value: 'Icon',
                    placeholder: 'Enter label'
                }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('columns', {
            type: 'slider',
            label: 'Columns',
            default_value: { size: 3, unit: '' },
            range: {
                min: 2,
                max: 6,
                step: 1
            }
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 32, unit: 'px' },
            range: {
                min: 20,
                max: 80,
                step: 1
            }
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
        });

        this.addControl('label_color', {
            type: 'color',
            label: 'Label Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const icons = this.getSetting('icons', [
            { icon: 'fa fa-rocket', label: 'Launch' },
            { icon: 'fa fa-chart-line', label: 'Growth' },
            { icon: 'fa fa-shield-alt', label: 'Security' },
            { icon: 'fa fa-users', label: 'Team' },
            { icon: 'fa fa-cog', label: 'Settings' },
            { icon: 'fa fa-heart', label: 'Love' }
        ]);
        const columns = this.getSetting('columns', { size: 3, unit: '' });
        const iconSize = this.getSetting('icon_size', { size: 32, unit: 'px' });
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const labelColor = this.getSetting('label_color', '#666666');

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        const safeColumns = (columns && typeof columns === 'object' && columns.size !== undefined) ? columns.size : 3;
        const safeIconSize = (iconSize && typeof iconSize === 'object' && iconSize.size !== undefined && iconSize.unit !== undefined) ? iconSize : { size: 32, unit: 'px' };

        // Build icon items
        const iconsArray = Array.isArray(icons) ? icons : [];
        const iconItems = iconsArray.map(item => {
            const iconClass = item.icon || 'fa fa-star';
            const label = item.label || 'Icon';

            return `
                <div style="text-align: center; padding: 20px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="${this.escapeHtml(iconClass)}" style="color: ${iconColor}; font-size: ${safeIconSize.size}${safeIconSize.unit}; display: block; margin-bottom: 10px;"></i>
                    <div style="color: ${labelColor}; font-size: 13px; font-weight: 500;">${this.escapeHtml(label)}</div>
                </div>
            `;
        }).join('');

        const content = `
            <div style="display: grid; grid-template-columns: repeat(${safeColumns}, 1fr); gap: 15px;">
                ${iconItems}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['icon-grid-widget'];
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

        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(IconGridWidget);
