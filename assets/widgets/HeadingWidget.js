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
        return ['content'];
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

        // Width and height are now handled in WidgetBase global controls

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'This is a Heading');
        const tag = this.getSetting('html_tag', 'h2');
        const link = this.getSetting('link', '');
        const align = this.getSetting('align', 'left');
        const color = this.getSetting('color', '#333333');
        const fontSize = this.getSetting('font_size', { size: 32, unit: 'px' });
        const fontWeight = this.getSetting('font_weight', '600');
        const width = this.getSetting('width', { size: 100, unit: '%' });
        const height = this.getSetting('height', { size: 0, unit: 'auto' });

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

        // Handle width and height
        const widthValue = width.unit === 'auto' ? 'auto' : `${width.size}${width.unit}`;
        const heightValue = height.unit === 'auto' || height.size === 0 ? 'auto' : `${height.size}${height.unit}`;

        // Build base styles
        const styles = [
            `text-align: ${align}`,
            `color: ${color}`,
            `font-size: ${safeFontSize.size}${safeFontSize.unit}`,
            `font-weight: ${fontWeight}`,
            `width: ${widthValue}`,
            `height: ${heightValue}`,
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

        return this.wrapWithAdvancedSettings(content, 'heading-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(HeadingWidget);
