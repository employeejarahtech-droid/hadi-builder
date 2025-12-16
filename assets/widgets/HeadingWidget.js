/**
 * HeadingWidget - Heading/Title widget
 * Displays customizable heading text with various options
 */
class HeadingWidget extends WidgetBase {
    getName() {
        return 'heading';
    }

    getTitle() {
        return 'Heading';
    }

    getIcon() {
        return 'fa fa-heading';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['heading', 'title', 'text', 'h1', 'h2', 'h3'];
    }

    getDefaultSettings() {
        return {
            title: 'This is a Heading',
            html_tag: 'h2',
            link: '',
            align: 'left',
            color: '#333333',
            font_size: { size: 32, unit: 'px' },
            font_weight: '600',

            // Add margin and padding defaults to prevent undefined errors
            margin: {
                top: 0,
                right: 0,
                bottom: 10,
                left: 0,
                unit: 'px'
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                unit: 'px'
            },

            css_classes: '',
            css_id: '',
            animation: 'none',
            animation_duration: { size: 0.5, unit: 's' },
            animation_delay: { size: 0, unit: 's' },
            responsive_display: 'show-all'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'This is a Heading',
            placeholder: 'Enter your heading',
            label_block: true
        });

        this.addControl('html_tag', {
            type: 'select',
            label: 'HTML Tag',
            default_value: 'h2',
            options: [
                { value: 'h1', label: 'H1' },
                { value: 'h2', label: 'H2' },
                { value: 'h3', label: 'H3' },
                { value: 'h4', label: 'H4' },
                { value: 'h5', label: 'H5' },
                { value: 'h6', label: 'H6' },
                { value: 'div', label: 'div' },
                { value: 'span', label: 'span' },
                { value: 'p', label: 'p' }
            ]
        });

        this.addControl('link', {
            type: 'url',
            label: 'Link',
            placeholder: 'https://your-link.com',
            label_block: true
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
                { value: 'right', label: 'Right' },
                { value: 'justify', label: 'Justify' }
            ]
        });

        this.addControl('color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#333333'
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 32, unit: 'px' },
            range: {
                min: 10,
                max: 100,
                step: 1
            },
            responsive: true
        });

        this.addControl('font_weight', {
            type: 'select',
            label: 'Font Weight',
            default_value: '600',
            options: [
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' },
                { value: '800', label: 'Extra Bold' }
            ]
        });

        this.endControlsSection();

        // Advanced Section
        this.startControlsSection('advanced_section', {
            label: 'Advanced',
            tab: 'advanced'
        });

        this.addControl('css_classes', {
            type: 'text',
            label: 'CSS Classes',
            description: 'Add custom CSS classes to the widget wrapper',
            placeholder: 'class-1 class-2',
            label_block: true
        });

        this.addControl('css_id', {
            type: 'text',
            label: 'CSS ID',
            description: 'Add custom ID to the widget wrapper',
            placeholder: 'my-custom-id',
            label_block: true
        });

        this.addControl('animation', {
            type: 'select',
            label: 'Entrance Animation',
            default_value: 'none',
            options: [
                { value: 'none', label: 'None' },
                { value: 'fadeIn', label: 'Fade In' },
                { value: 'fadeInDown', label: 'Fade In Down' },
                { value: 'fadeInUp', label: 'Fade In Up' },
                { value: 'fadeInLeft', label: 'Fade In Left' },
                { value: 'fadeInRight', label: 'Fade In Right' },
                { value: 'slideInDown', label: 'Slide In Down' },
                { value: 'slideInUp', label: 'Slide In Up' },
                { value: 'slideInLeft', label: 'Slide In Left' },
                { value: 'slideInRight', label: 'Slide In Right' },
                { value: 'bounce', label: 'Bounce' },
                { value: 'pulse', label: 'Pulse' },
                { value: 'flash', label: 'Flash' },
                { value: 'shake', label: 'Shake' },
                { value: 'swing', label: 'Swing' },
                { value: 'tada', label: 'Tada' },
                { value: 'wobble', label: 'Wobble' },
                { value: 'jello', label: 'Jello' },
                { value: 'heartBeat', label: 'Heart Beat' }
            ]
        });

        this.addControl('animation_duration', {
            type: 'slider',
            label: 'Animation Duration',
            default_value: { size: 0.5, unit: 's' },
            range: {
                min: 0.1,
                max: 5,
                step: 0.1
            },
            condition: {
                terms: [
                    { name: 'animation', operator: '!=', value: 'none' }
                ]
            }
        });

        this.addControl('animation_delay', {
            type: 'slider',
            label: 'Animation Delay',
            default_value: { size: 0, unit: 's' },
            range: {
                min: 0,
                max: 5,
                step: 0.1
            },
            condition: {
                terms: [
                    { name: 'animation', operator: '!=', value: 'none' }
                ]
            }
        });

        this.addControl('responsive_display', {
            type: 'select',
            label: 'Responsive Display',
            default_value: 'show-all',
            options: [
                { value: 'show-all', label: 'Show on All Devices' },
                { value: 'hide-desktop', label: 'Hide on Desktop' },
                { value: 'hide-tablet', label: 'Hide on Tablet' },
                { value: 'hide-mobile', label: 'Hide on Mobile' },
                { value: 'show-desktop', label: 'Show only on Desktop' },
                { value: 'show-tablet', label: 'Show only on Tablet' },
                { value: 'show-mobile', label: 'Show only on Mobile' }
            ]
        });

        this.endControlsSection();
    }

    render() {
        const title = this.getSetting('title', 'This is a Heading');
        const tag = this.getSetting('html_tag', 'h2');
        const link = this.getSetting('link', '');
        const align = this.getSetting('align', 'left');
        const color = this.getSetting('color', '#333333');
        const fontSize = this.getSetting('font_size', { size: 32, unit: 'px' });
        const fontWeight = this.getSetting('font_weight', '600');

        // Debug log to check what font size value we're getting
        console.log('HeadingWidget render - font_size:', {
            fontSize: fontSize,
            allSettings: this.settings
        });

        // Get dimension settings with proper defaults
        const margin = this.getSetting('margin', {
            top: 0,
            right: 0,
            bottom: 10,
            left: 0,
            unit: 'px'
        });

        const padding = this.getSetting('padding', {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            unit: 'px'
        });

        // Get other advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate and fix structured values to prevent "undefinedundefined"
        // Handle font_size - can be object with size/unit or responsive values
        let safeFontSize = { size: 32, unit: 'px' };
        if (fontSize) {
            if (typeof fontSize === 'object' && fontSize.size !== undefined) {
                safeFontSize = {
                    size: parseFloat(fontSize.size) || 32,
                    unit: fontSize.unit || 'px',
                    tablet_size: fontSize.tablet_size !== undefined ? parseFloat(fontSize.tablet_size) : null,
                    mobile_size: fontSize.mobile_size !== undefined ? parseFloat(fontSize.mobile_size) : null
                };
            } else if (typeof fontSize === 'number') {
                safeFontSize = { size: fontSize, unit: 'px' };
            } else if (typeof fontSize === 'string') {
                // Try to parse string like "32px" or "2em"
                const match = fontSize.match(/^([\d.]+)(px|em|rem|%)$/);
                if (match) {
                    safeFontSize = { size: parseFloat(match[1]), unit: match[2] };
                } else {
                    // If it's just a number as string, convert to number with default px unit
                    const numValue = parseFloat(fontSize);
                    if (!isNaN(numValue)) {
                        safeFontSize = { size: numValue, unit: 'px' };
                    }
                }
            }
        }

        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        // Build base styles
        const styles = [
            `text-align: ${align}`,
            `color: ${color}`,
            `font-size: ${safeFontSize.size}${safeFontSize.unit}`,
            `font-weight: ${fontWeight}`,
            `margin: ${margin.top}${margin.unit} ${margin.right}${margin.unit} ${margin.bottom}${margin.unit} ${margin.left}${margin.unit}`,
            `padding: ${padding.top}${padding.unit} ${padding.right}${padding.unit} ${padding.bottom}${padding.unit} ${padding.left}${padding.unit}`
        ].join('; ');

        // Debug log to check styles
        console.log('HeadingWidget render - styles:', {
            safeFontSize: safeFontSize,
            stylesArray: [
                `text-align: ${align}`,
                `color: ${color}`,
                `font-size: ${safeFontSize.size}${safeFontSize.unit}`,
                `font-weight: ${fontWeight}`,
                `margin: ${margin.top}${margin.unit} ${margin.right}${margin.unit} ${margin.bottom}${margin.unit} ${margin.left}${margin.unit}`,
                `padding: ${padding.top}${padding.unit} ${padding.right}${padding.unit} ${padding.bottom}${padding.unit} ${padding.left}${padding.unit}`
            ],
            finalStyles: styles
        });

        // Apply responsive font sizes using CSS custom properties
        let responsiveStyle = '';
        if (safeFontSize.tablet_size !== null && safeFontSize.tablet_size !== undefined) {
            responsiveStyle += ` --tablet-font-size: ${safeFontSize.tablet_size}${safeFontSize.unit};`;
        }
        if (safeFontSize.mobile_size !== null && safeFontSize.mobile_size !== undefined) {
            responsiveStyle += ` --mobile-font-size: ${safeFontSize.mobile_size}${safeFontSize.unit};`;
        }

        // Update styles to include responsive CSS variables
        const stylesWithResponsive = styles + responsiveStyle;

        let content = `<${tag} style="${stylesWithResponsive}" class="heading-responsive-font">${this.escapeHtml(title)}</${tag}>`;

        if (link) {
            content = `<a href="${this.escapeHtml(link)}" style="text-decoration: none; color: inherit;">${content}</a>`;
        }

        // Build wrapper classes
        let wrapperClasses = ['heading-widget'];
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

        // Add animation styles if needed
        let animationStyles = '';
        if (animation !== 'none') {
            // Format animation styles properly (no newlines, proper spacing)
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }

        // Combine all styles
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(HeadingWidget);
