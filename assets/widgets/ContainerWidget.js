/**
 * ContainerWidget - A simple container widget for holding other widgets
 * Based on ColumnsWidget but with a single container slot
 */
class ContainerWidget extends WidgetBase {
    getName() {
        return 'container';
    }

    getTitle() {
        return 'Container';
    }

    getIcon() {
        return 'fa fa-square';
    }

    getCategories() {
        return ['layout'];
    }

    getKeywords() {
        return ['container', 'wrapper', 'box', 'section'];
    }

    // Is this a container widget?
    isContainer() {
        return true;
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Container Settings',
            tab: 'content'
        });

        this.addControl('html_tag', {
            type: 'select',
            label: 'HTML Tag',
            options: [
                { value: 'div', label: 'div' },
                { value: 'section', label: 'section' },
                { value: 'article', label: 'article' },
                { value: 'aside', label: 'aside' },
                { value: 'main', label: 'main' },
                { value: 'header', label: 'header' },
                { value: 'footer', label: 'footer' }
            ],
            default_value: 'div'
        });

        this.addControl('min_height', {
            type: 'height',
            label: 'Min Height',
            default_value: { size: 20, unit: 'px' },
            range: {
                min: 0,
                max: 1000,
                step: 1
            },
            size_units: ['px', '%', 'vh']
            // No wrapper selector - applied manually
        });

        this.addControl('max_width', {
            type: 'width',
            label: 'Max Width',
            default_value: { size: '', unit: 'px' }, // Default empty usually means none
            range: {
                min: 0,
                max: 2000,
                step: 1
            },
            size_units: ['px', '%', 'vw'],
            selector: '{{WRAPPER}}'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('container_style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('width', {
            type: 'width',
            label: 'Width',
            default_value: { size: '', unit: '%' },
            range: {
                min: 0,
                max: 100,
                step: 5
            },
            size_units: ['px', '%', 'vw'],
            selector: '{{WRAPPER}}'
        });

        this.addControl('max_width_style', {
            type: 'width',
            label: 'Max Width',
            default_value: { size: '', unit: 'px' },
            range: {
                min: 0,
                max: 2000,
                step: 10
            },
            size_units: ['px', '%', 'vw']
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: ''
        });

        this.addControl('background_gradient', {
            type: 'gradient',
            label: 'Background Gradient',
            default_value: ''
        });

        this.addControl('background_image', {
            type: 'media',
            label: 'Background Image',
            default_value: { url: '' }
        });

        this.addControl('background_position', {
            type: 'select',
            label: 'Background Position',
            options: [
                { value: 'center center', label: 'Center Center' },
                { value: 'center left', label: 'Center Left' },
                { value: 'center right', label: 'Center Right' },
                { value: 'top center', label: 'Top Center' },
                { value: 'top left', label: 'Top Left' },
                { value: 'top right', label: 'Top Right' },
                { value: 'bottom center', label: 'Bottom Center' },
                { value: 'bottom left', label: 'Bottom Left' },
                { value: 'bottom right', label: 'Bottom Right' }
            ],
            default_value: 'center center'
        });

        this.addControl('background_size', {
            type: 'select',
            label: 'Background Size',
            options: [
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
                { value: 'auto', label: 'Auto' }
            ],
            default_value: 'cover'
        });

        this.addControl('background_repeat', {
            type: 'select',
            label: 'Background Repeat',
            options: [
                { value: 'no-repeat', label: 'No Repeat' },
                { value: 'repeat', label: 'Repeat' },
                { value: 'repeat-x', label: 'Repeat X' },
                { value: 'repeat-y', label: 'Repeat Y' }
            ],
            default_value: 'no-repeat'
        });

        this.addControl('background_overlay_color', {
            type: 'color',
            label: 'Overlay Color',
            default_value: ''
        });

        this.addControl('background_overlay_opacity', {
            type: 'slider',
            label: 'Overlay Opacity',
            min: 0,
            max: 1,
            step: 0.01,
            default_value: 0.5
        });

        this.addControl('padding', {
            type: 'dimensions',
            label: 'Padding',
            default_value: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true },
            size_units: ['px', '%', 'em']
            // No wrapper selector - applied to inner manualy
        });

        this.addControl('margin', {
            type: 'dimensions',
            label: 'Margin',
            default_value: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true },
            size_units: ['px', '%', 'em'],
            selector: '{{WRAPPER}}'
        });

        this.addControl('border_width', {
            type: 'slider',
            label: 'Border Width',
            min: 0,
            max: 10,
            default_value: 0
            // Applied manually
        });

        this.addControl('border_color', {
            type: 'color',
            label: 'Border Color',
            default_value: '#e2e8f0'
            // Applied manually
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            min: 0,
            max: 50,
            default_value: 0
            // Applied manually
        });

        this.addControl('box_shadow', {
            type: 'select',
            label: 'Box Shadow',
            options: [
                { value: 'none', label: 'None' },
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' },
                { value: 'xl', label: 'Extra Large' }
            ],
            default_value: 'none'
            // Applied manually
        });

        this.endControlsSection();

        // Advanced Section
        this.registerAdvancedControls();
    }

    constructor() {
        super();
        this.useFlexControls = true;
    }

    render() {
        const htmlTag = this.getSetting('html_tag', 'div');
        const minHeight = this.getSetting('min_height', { size: 20, unit: 'px' });
        const maxWidth = this.getSetting('max_width', { size: '', unit: 'px' });

        // Settings for Outer Wrapper
        const bg = this.getSetting('background_color', '');
        const bgGradient = this.getSetting('background_gradient', '');
        const bgImage = this.getSetting('background_image', { url: '' });
        const bgPosition = this.getSetting('background_position', 'center center');
        const bgSize = this.getSetting('background_size', 'cover');
        const bgRepeat = this.getSetting('background_repeat', 'no-repeat');
        const overlayColor = this.getSetting('background_overlay_color', '');
        const overlayOpacity = this.getSetting('background_overlay_opacity', 0.5);
        const backgroundSlideshow = this.getSetting('background_slideshow', []);
        const borderwidth = this.getSetting('border_width', 0);
        const borderColor = this.getSetting('border_color', '#e2e8f0');
        const borderRadius = this.getSetting('border_radius', 0);
        const boxShadow = this.getSetting('box_shadow', 'none');
        const padding = this.getSetting('padding', { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' });
        const width = this.getSetting('width', { size: '', unit: '%' });
        const height = this.getSetting('height', { size: '', unit: 'px' });
        const maxWidthStyle = this.getSetting('max_width_style', { size: '', unit: 'px' });

        // Note: Margin is applied to the {{WRAPPER}} by the builder logic
        // Width and Height are applied here to the container

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');

        // Global Flex settings
        const flexDisplay = this.getSetting('flex_display', 'default');
        const flexDirection = this.getSetting('flex_direction', 'row');
        const justifyContent = this.getSetting('justify_content', 'flex-start');
        const alignItems = this.getSetting('align_items', 'stretch');
        const flexWrap = this.getSetting('flex_wrap', 'nowrap');
        const flexGap = this.getSetting('flex_gap', { size: 0, unit: 'px' });

        // Box shadow values
        const shadowMap = {
            'none': 'none',
            'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        };

        // Handle strict min-height/max-width formatting
        let minHeightVal = '';
        if (minHeight && typeof minHeight === 'object' && minHeight.size !== '') {
            minHeightVal = `min-height: ${minHeight.size}${minHeight.unit};`;
        } else if (typeof minHeight === 'number' || (typeof minHeight === 'string' && minHeight !== '')) {
            minHeightVal = `min-height: ${minHeight}px;`;
        }

        // Priority: max_width_style (Style section) > max_width (Content section)
        let maxWidthVal = '';
        const effectiveMaxWidth = (maxWidthStyle && maxWidthStyle.size !== '') ? maxWidthStyle : maxWidth;

        if (effectiveMaxWidth && typeof effectiveMaxWidth === 'object' && effectiveMaxWidth.size !== '') {
            // Apply max-width to inner content to constrain it within the wrapper
            maxWidthVal = `max-width: ${effectiveMaxWidth.size}${effectiveMaxWidth.unit}; margin-left: auto; margin-right: auto;`;
        } else if (typeof effectiveMaxWidth === 'number' && effectiveMaxWidth > 0) {
            maxWidthVal = `max-width: ${effectiveMaxWidth}px; margin-left: auto; margin-right: auto;`;
        }

        // Handle width setting
        let widthVal = 'width: 100%;';
        if (width && typeof width === 'object' && width.size !== '') {
            widthVal = `width: ${width.size}${width.unit};`;
        }

        // Handle height setting
        let heightVal = '';
        if (height && typeof height === 'object' && height.size !== '') {
            heightVal = `height: ${height.size}${height.unit};`;
        }

        // Build Flexbox Styles (Inner Slot)
        let flexStyles = '';
        if (flexDisplay && flexDisplay !== 'default') {
            flexStyles += `display: ${flexDisplay}; `;
            if (flexDisplay === 'flex' || flexDisplay === 'inline-flex') {
                flexStyles += `flex-direction: ${flexDirection}; `;
                flexStyles += `justify-content: ${justifyContent}; `;
                flexStyles += `align-items: ${alignItems}; `;
                flexStyles += `flex-wrap: ${flexWrap}; `;

                if (flexGap && flexGap.size !== '' && flexGap.icon === undefined) {
                    const gapVal = (typeof flexGap === 'object' && flexGap.unit) ? `${flexGap.size}${flexGap.unit}` : `${flexGap}px`;
                    flexStyles += `gap: ${gapVal}; `;
                }
            }
        } else {
            flexStyles = 'width: 100%;';
        }

        // 1. OUTER STYLE: Width, Height, Padding, Border, Background, Dimensions
        const containerStyle = `
            ${widthVal}
            ${heightVal}
            ${maxWidthVal}
            padding: ${padding.top}${padding.unit} ${padding.right}${padding.unit} ${padding.bottom}${padding.unit} ${padding.left}${padding.unit};
            background-color: ${bg};
            border: ${borderwidth}px solid ${borderColor};
            border-radius: ${borderRadius}px;
            box-shadow: ${shadowMap[boxShadow] || 'none'};
            box-sizing: border-box;
            position: relative; /* Needed for background slideshow absolute positioning */
            overflow: hidden; /* Contain slideshow */
        `.trim();

        // Slot styles (Flexbox goes here)
        // Ensure slot takes full available space inside padding
        // Min-height checks: Use user value if set, otherwise default 100% to fill wrapper?
        // User requested min-height ON the slot. 
        // If minHeightVal is set, use it. If not, should we fallback? 
        // If parent is auto height, min-height 100% does nothing. 
        // So just applying the value is safer.
        const defaultMinHeight = minHeightVal ? '' : 'min-height: 100%;';
        const finalMinHeight = minHeightVal ? minHeightVal : defaultMinHeight;

        const slotStyle = `${finalMinHeight} width: 100%; position: relative; z-index: 2; ${flexStyles}`.trim();

        // Build wrapper classes
        const wrapperClasses = ['elementor-container-widget'];
        if (cssClasses) {
            wrapperClasses.push(cssClasses);
        }

        // Build wrapper attributes
        let wrapperAttributes = '';
        if (cssId) {
            wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        }

        // Generate Slideshow HTML
        let slideshowHtml = '';
        if (backgroundSlideshow && backgroundSlideshow.length > 0) {
            const slides = backgroundSlideshow.map(slide => {
                if (slide.image && slide.image.url) {
                    return `<div class="elementor-background-slide" style="background-image: url('${slide.image.url}');"></div>`;
                }
                return '';
            }).join('');

            if (slides) {
                slideshowHtml = `
                    <div class="elementor-background-slideshow" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                        ${slides}
                    </div>
                    <style>
                        .elementor-background-slide {
                            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                            background-size: cover; background-position: center;
                            /* Simple fade animation could be added here later */
                        }
                    </style>
                `;
            }
        }

        // Render container with slot receiving the flex target
        return `<${htmlTag} class="${wrapperClasses.join(' ')}"${wrapperAttributes} style="${containerStyle}">
            ${slideshowHtml}
            <div class="elementor-container-slot" data-container-index="0" style="${slotStyle}"></div>
        </${htmlTag}>`;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(ContainerWidget);
