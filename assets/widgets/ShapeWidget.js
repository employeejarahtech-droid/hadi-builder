/**
 * ShapeWidget - SVG shapes widget
 * Displays SVG shapes with customization
 */
class ShapeWidget extends WidgetBase {
    getName() {
        return 'shape';
    }

    getTitle() {
        return 'Shape';
    }

    getIcon() {
        return 'fa fa-shapes';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['shape', 'svg', 'circle', 'square', 'triangle'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Shape',
            tab: 'content'
        });

        this.addControl('shape_type', {
            type: 'select',
            label: 'Shape Type',
            default_value: 'circle',
            options: [
                { value: 'circle', label: 'Circle' },
                { value: 'square', label: 'Square' },
                { value: 'triangle', label: 'Triangle' },
                { value: 'hexagon', label: 'Hexagon' },
                { value: 'star', label: 'Star' }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('size', {
            type: 'slider',
            label: 'Size',
            default_value: { size: 100, unit: 'px' },
            range: {
                min: 50,
                max: 300,
                step: 10
            }
        });

        this.addControl('fill_color', {
            type: 'color',
            label: 'Fill Color',
            default_value: '#3b82f6'
        });

        this.addControl('stroke_color', {
            type: 'color',
            label: 'Stroke Color',
            default_value: 'transparent'
        });

        this.addControl('stroke_width', {
            type: 'slider',
            label: 'Stroke Width',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: 0,
                max: 10,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const shapeType = this.getSetting('shape_type', 'circle');
        const size = this.getSetting('size', { size: 100, unit: 'px' });
        const fillColor = this.getSetting('fill_color', '#3b82f6');
        const strokeColor = this.getSetting('stroke_color', 'transparent');
        const strokeWidth = this.getSetting('stroke_width', { size: 0, unit: 'px' });

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

        const safeSize = (size && typeof size === 'object' && size.size !== undefined) ? size.size : 100;
        const safeStrokeWidth = (strokeWidth && typeof strokeWidth === 'object' && strokeWidth.size !== undefined) ? strokeWidth.size : 0;

        // Build SVG shape
        let svgShape = '';
        if (shapeType === 'circle') {
            svgShape = `<circle cx="50" cy="50" r="45" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${safeStrokeWidth}" />`;
        } else if (shapeType === 'square') {
            svgShape = `<rect x="5" y="5" width="90" height="90" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${safeStrokeWidth}" />`;
        } else if (shapeType === 'triangle') {
            svgShape = `<polygon points="50,10 90,90 10,90" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${safeStrokeWidth}" />`;
        } else if (shapeType === 'hexagon') {
            svgShape = `<polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${safeStrokeWidth}" />`;
        } else if (shapeType === 'star') {
            svgShape = `<polygon points="50,10 61,35 88,35 67,52 77,77 50,60 23,77 33,52 12,35 39,35" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${safeStrokeWidth}" />`;
        }

        const content = `
            <div style="text-align: center;">
                <svg width="${safeSize}" height="${safeSize}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    ${svgShape}
                </svg>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['shape-widget'];
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

window.elementorWidgetManager.registerWidget(ShapeWidget);
