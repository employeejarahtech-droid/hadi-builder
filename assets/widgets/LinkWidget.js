/**
 * LinkWidget - Hyperlink with styling widget
 * Displays a customizable hyperlink with text and optional icon
 */
class LinkWidget extends WidgetBase {
    getName() {
        return 'link';
    }

    getTitle() {
        return 'Link';
    }

    getIcon() {
        return 'fa fa-link';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['link', 'hyperlink', 'url', 'anchor', 'text link'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Link',
            tab: 'content'
        });

        this.addControl('text', {
            type: 'text',
            label: 'Link Text',
            default_value: 'Click Here',
            placeholder: 'Enter link text',
            label_block: true
        });

        this.addControl('url', {
            type: 'url',
            label: 'URL',
            default_value: '#',
            placeholder: 'https://example.com',
            label_block: true
        });

        this.addControl('open_new_tab', {
            type: 'switch',
            label: 'Open in New Tab',
            default_value: false
        });

        this.addControl('nofollow', {
            type: 'switch',
            label: 'Add nofollow',
            default_value: false,
            description: 'Add rel="nofollow" attribute'
        });

        this.addControl('icon', {
            type: 'icon',
            label: 'Icon',
            default_value: '',
            description: 'Optional icon before/after text'
        });

        this.addControl('icon_position', {
            type: 'select',
            label: 'Icon Position',
            default_value: 'left',
            options: [
                { value: 'left', label: 'Before Text' },
                { value: 'right', label: 'After Text' }
            ],
            condition: {
                terms: [
                    { name: 'icon', operator: '!=', value: '' }
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
            default_value: '#3b82f6'
        });

        this.addControl('hover_color', {
            type: 'color',
            label: 'Hover Color',
            default_value: '#2563eb'
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 16, unit: 'px' },
            range: {
                min: 10,
                max: 50,
                step: 1
            },
            responsive: true
        });

        this.addControl('font_weight', {
            type: 'select',
            label: 'Font Weight',
            default_value: '400',
            options: [
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' }
            ]
        });

        this.addControl('text_decoration', {
            type: 'select',
            label: 'Text Decoration',
            default_value: 'underline',
            options: [
                { value: 'none', label: 'None' },
                { value: 'underline', label: 'Underline' },
                { value: 'overline', label: 'Overline' },
                { value: 'line-through', label: 'Line Through' }
            ]
        });

        this.addControl('hover_decoration', {
            type: 'select',
            label: 'Hover Decoration',
            default_value: 'none',
            options: [
                { value: 'none', label: 'None' },
                { value: 'underline', label: 'Underline' },
                { value: 'overline', label: 'Overline' },
                { value: 'line-through', label: 'Line Through' }
            ]
        });

        this.addControl('icon_spacing', {
            type: 'slider',
            label: 'Icon Spacing',
            default_value: { size: 8, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'icon', operator: '!=', value: '' }
                ]
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const text = this.getSetting('text', 'Click Here');
        const url = this.getSetting('url', '#');
        const openNewTab = this.getSetting('open_new_tab', false);
        const nofollow = this.getSetting('nofollow', false);
        const icon = this.getSetting('icon', '');
        const iconPosition = this.getSetting('icon_position', 'left');
        const align = this.getSetting('align', 'left');
        const textColor = this.getSetting('text_color', '#3b82f6');
        const hoverColor = this.getSetting('hover_color', '#2563eb');
        const fontSize = this.getSetting('font_size', { size: 16, unit: 'px' });
        const fontWeight = this.getSetting('font_weight', '400');
        const textDecoration = this.getSetting('text_decoration', 'underline');
        const hoverDecoration = this.getSetting('hover_decoration', 'none');
        const iconSpacing = this.getSetting('icon_spacing', { size: 8, unit: 'px' });

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
        const uniqueId = `link-${Math.random().toString(36).substr(2, 9)}`;

        // Build link attributes
        const target = openNewTab ? ' target="_blank"' : '';
        let rel = '';
        if (openNewTab || nofollow) {
            const relParts = [];
            if (openNewTab) relParts.push('noopener', 'noreferrer');
            if (nofollow) relParts.push('nofollow');
            rel = ` rel="${relParts.join(' ')}"`;
        }

        // Build link styles
        const linkStyles = `
            color: ${textColor};
            font-size: ${fontSize.size}${fontSize.unit};
            font-weight: ${fontWeight};
            text-decoration: ${textDecoration};
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: ${icon ? iconSpacing.size + iconSpacing.unit : '0'};
        `;

        // Add hover styles
        const hoverStyles = `
            <style>
                .${uniqueId}:hover {
                    color: ${hoverColor} !important;
                    text-decoration: ${hoverDecoration} !important;
                }
            </style>
        `;

        // Build icon HTML
        let iconHtml = '';
        if (icon) {
            iconHtml = `<i class="${icon}"></i>`;
        }

        // Build link content
        const linkContent = iconPosition === 'left'
            ? `${iconHtml}${this.escapeHtml(text)}`
            : `${this.escapeHtml(text)}${iconHtml}`;

        const content = `
            ${hoverStyles}
            <div style="text-align: ${align};">
                <a href="${this.escapeHtml(url)}" class="${uniqueId}" style="${linkStyles}"${target}${rel}>
                    ${linkContent}
                </a>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['link-widget'];
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

window.elementorWidgetManager.registerWidget(LinkWidget);
