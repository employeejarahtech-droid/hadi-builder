/**
 * PreformattedWidget - Preformatted text widget
 * Displays text with preserved whitespace and formatting
 */
class PreformattedWidget extends WidgetBase {
    getName() {
        return 'preformatted';
    }

    getTitle() {
        return 'Preformatted';
    }

    getIcon() {
        return 'fa fa-file-alt';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['preformatted', 'pre', 'text', 'whitespace', 'ascii', 'monospace'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('content', {
            type: 'textarea',
            label: 'Text',
            default_value: 'This is preformatted text.\n    Whitespace is preserved.\n        Including indentation.',
            placeholder: 'Enter your preformatted text',
            label_block: true,
            description: 'Text will preserve all spaces, tabs, and line breaks'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#333333'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#f5f5f5'
        });

        this.addControl('font_family', {
            type: 'select',
            label: 'Font Family',
            default_value: 'monospace',
            options: [
                { value: 'monospace', label: 'Monospace (Default)' },
                { value: '"Courier New", Courier, monospace', label: 'Courier New' },
                { value: '"Consolas", monospace', label: 'Consolas' },
                { value: '"Monaco", monospace', label: 'Monaco' },
                { value: 'inherit', label: 'Inherit' }
            ]
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 14, unit: 'px' },
            range: {
                min: 10,
                max: 30,
                step: 1
            },
            responsive: true
        });

        this.addControl('line_height', {
            type: 'slider',
            label: 'Line Height',
            default_value: { size: 1.6, unit: '' },
            range: {
                min: 1,
                max: 3,
                step: 0.1
            }
        });

        this.addControl('padding', {
            type: 'slider',
            label: 'Padding',
            default_value: { size: 20, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            }
        });

        this.addControl('border_width', {
            type: 'slider',
            label: 'Border Width',
            default_value: { size: 1, unit: 'px' },
            range: {
                min: 0,
                max: 10,
                step: 1
            }
        });

        this.addControl('border_color', {
            type: 'color',
            label: 'Border Color',
            default_value: '#dddddd'
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            default_value: { size: 4, unit: 'px' },
            range: {
                min: 0,
                max: 30,
                step: 1
            }
        });

        this.addControl('overflow', {
            type: 'select',
            label: 'Overflow',
            default_value: 'auto',
            options: [
                { value: 'visible', label: 'Visible' },
                { value: 'auto', label: 'Auto Scroll' },
                { value: 'hidden', label: 'Hidden' },
                { value: 'scroll', label: 'Always Scroll' }
            ],
            description: 'How to handle content that exceeds container'
        });

        this.addControl('max_height', {
            type: 'slider',
            label: 'Max Height',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: 0,
                max: 1000,
                step: 10
            },
            description: 'Set to 0 for no limit'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const content = this.getSetting('content', 'This is preformatted text.\n    Whitespace is preserved.\n        Including indentation.');
        const textColor = this.getSetting('text_color', '#333333');
        const backgroundColor = this.getSetting('background_color', '#f5f5f5');
        const fontFamily = this.getSetting('font_family', 'monospace');
        const fontSize = this.getSetting('font_size', { size: 14, unit: 'px' });
        const lineHeight = this.getSetting('line_height', { size: 1.6, unit: '' });
        const padding = this.getSetting('padding', { size: 20, unit: 'px' });
        const borderWidth = this.getSetting('border_width', { size: 1, unit: 'px' });
        const borderColor = this.getSetting('border_color', '#dddddd');
        const borderRadius = this.getSetting('border_radius', { size: 4, unit: 'px' });
        const overflow = this.getSetting('overflow', 'auto');
        const maxHeight = this.getSetting('max_height', { size: 0, unit: 'px' });

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

        // Build pre styles
        const maxHeightStyle = maxHeight.size > 0 ? `max-height: ${maxHeight.size}${maxHeight.unit};` : '';

        const preStyles = `
            color: ${textColor};
            background-color: ${backgroundColor};
            font-family: ${fontFamily};
            font-size: ${fontSize.size}${fontSize.unit};
            line-height: ${lineHeight.size}${lineHeight.unit};
            padding: ${padding.size}${padding.unit};
            border: ${borderWidth.size}${borderWidth.unit} solid ${borderColor};
            border-radius: ${borderRadius.size}${borderRadius.unit};
            overflow: ${overflow};
            ${maxHeightStyle}
            margin: 0;
            white-space: pre;
            word-wrap: normal;
            tab-size: 4;
        `;

        // Escape HTML but preserve whitespace
        const escapedContent = this.escapeHtml(content);

        const contentHtml = `<pre style="${preStyles}">${escapedContent}</pre>`;

        // Build wrapper classes
        let wrapperClasses = ['preformatted-widget'];
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

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${contentHtml}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(PreformattedWidget);
