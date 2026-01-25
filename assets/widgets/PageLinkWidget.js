/**
 * PageLinkWidget - A widget for creating styled page links
 * Displays a customizable link to internal or external pages
 */
class PageLinkWidget extends WidgetBase {
    getName() {
        return 'page-link';
    }

    getTitle() {
        return 'Page Link';
    }

    getIcon() {
        return 'fa fa-file-alt';
    }

    getCategories() {
        return ['basic', 'navigation'];
    }

    getKeywords() {
        return ['page', 'link', 'navigation', 'url', 'button link'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Page Link',
            tab: 'content'
        });

        this.addControl('link_text', {
            type: 'text',
            label: 'Link Text',
            default_value: 'Visit Page',
            placeholder: 'Enter link text',
            label_block: true
        });

        this.addControl('page_url', {
            type: 'url',
            label: 'Page URL',
            default_value: '#',
            placeholder: 'https://example.com/page',
            label_block: true
        });

        this.addControl('link_type', {
            type: 'select',
            label: 'Link Type',
            default_value: 'text',
            options: [
                { value: 'text', label: 'Text Link' },
                { value: 'button', label: 'Button Style' }
            ]
        });

        this.addControl('open_new_tab', {
            type: 'switch',
            label: 'Open in New Tab',
            default_value: false
        });

        this.addControl('show_icon', {
            type: 'switch',
            label: 'Show Icon',
            default_value: true
        });

        this.addControl('icon', {
            type: 'icon',
            label: 'Icon',
            default_value: 'fa fa-arrow-right',
            condition: {
                terms: [
                    { name: 'show_icon', operator: '==', value: true }
                ]
            }
        });

        this.addControl('icon_position', {
            type: 'select',
            label: 'Icon Position',
            default_value: 'right',
            options: [
                { value: 'left', label: 'Before Text' },
                { value: 'right', label: 'After Text' }
            ],
            condition: {
                terms: [
                    { name: 'show_icon', operator: '==', value: true }
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

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: 'transparent',
            condition: {
                terms: [
                    { name: 'link_type', operator: '==', value: 'button' }
                ]
            }
        });

        this.addControl('hover_background', {
            type: 'color',
            label: 'Hover Background',
            default_value: '#f3f4f6',
            condition: {
                terms: [
                    { name: 'link_type', operator: '==', value: 'button' }
                ]
            }
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 16, unit: 'px' },
            range: {
                min: 10,
                max: 50,
                step: 1
            }
        });

        this.addControl('font_weight', {
            type: 'select',
            label: 'Font Weight',
            default_value: '500',
            options: [
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' }
            ]
        });

        this.addControl('padding', {
            type: 'slider',
            label: 'Padding',
            default_value: { size: 12, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'link_type', operator: '==', value: 'button' }
                ]
            }
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            default_value: { size: 4, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'link_type', operator: '==', value: 'button' }
                ]
            }
        });

        this.addControl('icon_spacing', {
            type: 'slider',
            label: 'Icon Spacing',
            default_value: { size: 8, unit: 'px' },
            range: {
                min: 0,
                max: 30,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'show_icon', operator: '==', value: true }
                ]
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const linkText = this.getSetting('link_text', 'Visit Page');
        const pageUrl = this.getSetting('page_url', '#');
        const linkType = this.getSetting('link_type', 'text');
        const openNewTab = this.getSetting('open_new_tab', false);
        const showIcon = this.getSetting('show_icon', true);
        const icon = this.getSetting('icon', 'fa fa-arrow-right');
        const iconPosition = this.getSetting('icon_position', 'right');
        const align = this.getSetting('align', 'left');
        const textColor = this.getSetting('text_color', '#3b82f6');
        const hoverColor = this.getSetting('hover_color', '#2563eb');
        const backgroundColor = this.getSetting('background_color', 'transparent');
        const hoverBackground = this.getSetting('hover_background', '#f3f4f6');
        const fontSize = this.getSetting('font_size', { size: 16, unit: 'px' });
        const fontWeight = this.getSetting('font_weight', '500');
        const padding = this.getSetting('padding', { size: 12, unit: 'px' });
        const borderRadius = this.getSetting('border_radius', { size: 4, unit: 'px' });
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
        const uniqueId = `page-link-${Math.random().toString(36).substr(2, 9)}`;

        // Build link attributes
        const target = openNewTab ? ' target="_blank"' : '';
        let rel = '';
        if (openNewTab) {
            rel = ' rel="noopener noreferrer"';
        }

        // Build link styles
        let linkStyles = `
            color: ${textColor};
            font-size: ${fontSize.size}${fontSize.unit};
            font-weight: ${fontWeight};
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: ${showIcon ? iconSpacing.size + iconSpacing.unit : '0'};
            text-decoration: none;
        `;

        if (linkType === 'button') {
            linkStyles += `
                background-color: ${backgroundColor};
                padding: ${padding.size}${padding.unit} ${padding.size * 2}${padding.unit};
                border-radius: ${borderRadius.size}${borderRadius.unit};
                border: 1px solid ${textColor};
            `;
        }

        // Add hover styles
        const hoverStyles = `
            <style>
                .${uniqueId}:hover {
                    color: ${hoverColor} !important;
                    ${linkType === 'button' ? `background-color: ${hoverBackground} !important; border-color: ${hoverColor} !important;` : ''}
                }
            </style>
        `;

        // Build icon HTML
        let iconHtml = '';
        if (showIcon && icon) {
            iconHtml = `<i class="${icon}"></i>`;
        }

        // Build link content
        const linkContent = iconPosition === 'left'
            ? `${iconHtml}${this.escapeHtml(linkText)}`
            : `${this.escapeHtml(linkText)}${iconHtml}`;

        const content = `
            ${hoverStyles}
            <div style="text-align: ${align};">
                <a href="${this.escapeHtml(pageUrl)}" class="${uniqueId}" style="${linkStyles}"${target}${rel}>
                    ${linkContent}
                </a>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['page-link-widget'];
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
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(PageLinkWidget);
