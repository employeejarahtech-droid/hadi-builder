/**
 * SpacerWidget - Custom spacing widget
 * Adds vertical or horizontal space between elements
 */
class SpacerWidget extends WidgetBase {
    getName() {
        return 'spacer';
    }

    getTitle() {
        return 'Spacer';
    }

    getIcon() {
        return 'fa fa-arrows-alt-v';
    }

    getCategories() {
        return ['layout'];
    }

    getKeywords() {
        return ['spacer', 'space', 'gap', 'margin', 'padding', 'divider'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Spacer',
            tab: 'content'
        });

        this.addControl('space', {
            type: 'slider',
            label: 'Space',
            default_value: { size: 50, unit: 'px' },
            range: {
                min: 0,
                max: 500,
                step: 1
            },
            responsive: true,
            description: 'Set the amount of vertical space'
        });

        this.addControl('direction', {
            type: 'select',
            label: 'Direction',
            default_value: 'vertical',
            options: [
                { value: 'vertical', label: 'Vertical' },
                { value: 'horizontal', label: 'Horizontal' }
            ],
            description: 'Choose spacing direction'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('show_divider', {
            type: 'select',
            label: 'Show Divider',
            default_value: 'no',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            description: 'Display a visual divider line'
        });

        this.addControl('divider_color', {
            type: 'color',
            label: 'Divider Color',
            default_value: '#e0e0e0',
            condition: {
                terms: [
                    { name: 'show_divider', operator: '==', value: 'yes' }
                ]
            }
        });

        this.addControl('divider_width', {
            type: 'slider',
            label: 'Divider Width (%)',
            default_value: { size: 100, unit: '%' },
            range: {
                min: 1,
                max: 100,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'show_divider', operator: '==', value: 'yes' }
                ]
            }
        });

        this.addControl('divider_thickness', {
            type: 'slider',
            label: 'Divider Thickness',
            default_value: { size: 1, unit: 'px' },
            range: {
                min: 1,
                max: 10,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'show_divider', operator: '==', value: 'yes' }
                ]
            }
        });

        this.addControl('divider_style', {
            type: 'select',
            label: 'Divider Style',
            default_value: 'solid',
            options: [
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' },
                { value: 'double', label: 'Double' }
            ],
            condition: {
                terms: [
                    { name: 'show_divider', operator: '==', value: 'yes' }
                ]
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const space = this.getSetting('space', { size: 50, unit: 'px' });
        const direction = this.getSetting('direction', 'vertical');
        const showDivider = this.getSetting('show_divider', 'no');
        const dividerColor = this.getSetting('divider_color', '#e0e0e0');
        const dividerWidth = this.getSetting('divider_width', { size: 100, unit: '%' });
        const dividerThickness = this.getSetting('divider_thickness', { size: 1, unit: 'px' });
        const dividerStyle = this.getSetting('divider_style', 'solid');

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

        // Build spacer styles based on direction
        let spacerStyles = '';
        if (direction === 'vertical') {
            spacerStyles = `height: ${space.size}${space.unit}; width: 100%; display: block;`;
        } else {
            spacerStyles = `width: ${space.size}${space.unit}; height: 100%; display: inline-block;`;
        }

        // Build divider content if enabled
        let dividerHtml = '';
        if (showDivider === 'yes' && direction === 'vertical') {
            const dividerStyles = `
                width: ${dividerWidth.size}${dividerWidth.unit};
                height: ${dividerThickness.size}${dividerThickness.unit};
                background-color: ${dividerColor};
                border: none;
                margin: 0 auto;
                border-style: ${dividerStyle};
                ${dividerStyle !== 'solid' ? `border-top: ${dividerThickness.size}${dividerThickness.unit} ${dividerStyle} ${dividerColor}; background: none;` : ''}
            `;
            dividerHtml = `<hr style="${dividerStyles.trim()}">`;
        }

        const content = `
            <div style="${spacerStyles}">
                ${dividerHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['spacer-widget'];
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

window.elementorWidgetManager.registerWidget(SpacerWidget);
