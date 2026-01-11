/**
 * IconWidget - Single icon display widget
 * Displays a single icon with customization options
 */
class IconWidget extends WidgetBase {
    getName() {
        return 'icon';
    }

    getTitle() {
        return 'Icon';
    }

    getIcon() {
        return 'fa fa-star';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['icon', 'symbol', 'graphic', 'fontawesome'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Icon',
            tab: 'content'
        });

        this.addControl('icon', {
            type: 'icon',
            label: 'Choose Icon',
            default_value: 'fa fa-star',
            description: 'Select an icon from Font Awesome'
        });

        this.addControl('link', {
            type: 'url',
            label: 'Link',
            placeholder: 'https://your-link.com',
            default_value: '',
            description: 'Optional link for the icon'
        });

        this.addControl('open_new_tab', {
            type: 'switch',
            label: 'Open in New Tab',
            default_value: false,
            condition: {
                terms: [
                    { name: 'link', operator: '!=', value: '' }
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
            default_value: 'center',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 50, unit: 'px' },
            range: {
                min: 10,
                max: 300,
                step: 1
            },
            responsive: true
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
        });

        this.addControl('icon_rotation', {
            type: 'slider',
            label: 'Rotation (deg)',
            default_value: { size: 0, unit: 'deg' },
            range: {
                min: 0,
                max: 360,
                step: 1
            }
        });

        this.addControl('hover_color', {
            type: 'color',
            label: 'Hover Color',
            default_value: '#2563eb',
            description: 'Icon color on hover'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: 'transparent'
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 1
            }
        });

        this.addControl('padding', {
            type: 'slider',
            label: 'Padding',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const icon = this.getSetting('icon', 'fa fa-star');
        const link = this.getSetting('link', '');
        const openNewTab = this.getSetting('open_new_tab', false);
        const align = this.getSetting('align', 'center');
        const iconSize = this.getSetting('icon_size', { size: 50, unit: 'px' });
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const iconRotation = this.getSetting('icon_rotation', { size: 0, unit: 'deg' });
        const hoverColor = this.getSetting('hover_color', '#2563eb');
        const backgroundColor = this.getSetting('background_color', 'transparent');
        const borderRadius = this.getSetting('border_radius', { size: 0, unit: 'px' });
        const padding = this.getSetting('padding', { size: 0, unit: 'px' });

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

        // Generate unique ID for hover styles
        const uniqueId = `icon-${Math.random().toString(36).substr(2, 9)}`;

        // Build icon styles
        const iconStyles = `
            font-size: ${iconSize.size}${iconSize.unit};
            color: ${iconColor};
            transform: rotate(${iconRotation.size}${iconRotation.unit});
            background-color: ${backgroundColor};
            border-radius: ${borderRadius.size}${borderRadius.unit};
            padding: ${padding.size}${padding.unit};
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;

        // Add hover styles
        const hoverStyles = `
            <style>
                .${uniqueId}:hover {
                    color: ${hoverColor} !important;
                }
            </style>
        `;

        // Build icon HTML
        let iconHtml = `${hoverStyles}<i class="${icon} ${uniqueId}" style="${iconStyles}"></i>`;

        // Wrap in link if provided
        if (link) {
            const target = openNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
            iconHtml = `<a href="${this.escapeHtml(link)}"${target} style="text-decoration: none; color: inherit;">${iconHtml}</a>`;
        }

        const content = `
            <div style="text-align: ${align};">
                ${iconHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['icon-widget'];
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

window.elementorWidgetManager.registerWidget(IconWidget);
