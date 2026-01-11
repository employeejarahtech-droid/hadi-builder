class FlexWidget extends WidgetBase {
    getName() {
        return 'flex';
    }

    getTitle() {
        return 'Flex Container';
    }

    getIcon() {
        return 'fa fa-layer-group';
    }

    getCategories() {
        return ['layout'];
    }

    isContainer() {
        return true;
    }

    registerControls() {
        // Layout Section
        this.startControlsSection('layout_section', {
            label: 'Layout',
            tab: 'content'
        });

        this.addControl('items', {
            type: 'select',
            label: 'Items (Slots)',
            options: [
                { value: '1', label: '1 Item (100%)' },
                { value: '2', label: '2 Items (50/50)' },
                { value: '3', label: '3 Items (33/33/33)' },
                { value: '4', label: '4 Items (25/25/25/25)' },
                { value: '33-66', label: '1/3 - 2/3' },
                { value: '66-33', label: '2/3 - 1/3' },
                { value: '25-75', label: '1/4 - 3/4' },
                { value: '75-25', label: '3/4 - 1/4' }
            ],
            default_value: '2'
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

        this.addControl('flex_direction', {
            type: 'select',
            label: 'Direction',
            options: [
                { value: 'row', label: 'Row (Horizontal)' },
                { value: 'column', label: 'Column (Vertical)' },
                { value: 'row-reverse', label: 'Row Reverse' },
                { value: 'column-reverse', label: 'Column Reverse' }
            ],
            default_value: 'row'
        });

        this.addControl('justify_content', {
            type: 'select',
            label: 'Justify Content',
            options: [
                { value: 'flex-start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'End' },
                { value: 'space-between', label: 'Space Between' },
                { value: 'space-around', label: 'Space Around' },
                { value: 'space-evenly', label: 'Space Evenly' }
            ],
            default_value: 'flex-start'
        });

        this.addControl('align_items', {
            type: 'select',
            label: 'Align Items',
            options: [
                { value: 'stretch', label: 'Stretch' },
                { value: 'flex-start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'End' },
                { value: 'baseline', label: 'Baseline' }
            ],
            default_value: 'stretch'
        });

        this.addControl('flex_wrap', {
            type: 'select',
            label: 'Wrap',
            options: [
                { value: 'nowrap', label: 'No Wrap' },
                { value: 'wrap', label: 'Wrap' },
                { value: 'wrap-reverse', label: 'Wrap Reverse' }
            ],
            default_value: 'nowrap'
        });

        this.addControl('gap', {
            type: 'slider',
            label: 'Gap',
            min: 0,
            max: 100,
            default_value: 10
        });

        this.addControl('min_height', {
            type: 'height',
            label: 'Min Height',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: 0,
                max: 1000,
                step: 1
            },
            size_units: ['px', '%', 'vh']
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
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

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: ''
        });

        this.addControl('padding', {
            type: 'dimensions',
            label: 'Padding',
            default_value: { top: 20, right: 20, bottom: 20, left: 20, unit: 'px', isLinked: true },
            size_units: ['px', '%', 'em']
        });

        this.addControl('margin', {
            type: 'dimensions',
            label: 'Margin',
            default_value: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true },
            size_units: ['px', '%', 'em'],
            selector: '{{WRAPPER}}'
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            min: 0,
            max: 100,
            default_value: 0
        });

        this.endControlsSection();
    }

    render() {
        const layout = this.getSetting('items', '2'); // Can be '1', '2', '33-66', etc.
        const htmlTag = this.getSetting('html_tag', 'div');

        // Layout
        const direction = this.getSetting('flex_direction', 'row');
        const justify = this.getSetting('justify_content', 'flex-start');
        const align = this.getSetting('align_items', 'stretch');
        const wrap = this.getSetting('flex_wrap', 'nowrap');
        const gap = this.getSetting('gap', 10);
        const minHeight = this.getSetting('min_height', { size: 0, unit: 'px' });

        // Style
        const bg = this.getSetting('background_color', '');
        const padding = this.getSetting('padding', { top: 20, right: 20, bottom: 20, left: 20, unit: 'px' });
        const radius = this.getSetting('border_radius', 0);

        // Normalize Min Height
        let minHeightVal = '';
        if (minHeight && typeof minHeight === 'object' && minHeight.size !== '') {
            minHeightVal = `min-height: ${minHeight.size}${minHeight.unit};`;
        } else if (typeof minHeight === 'number') {
            minHeightVal = `min-height: ${minHeight}px;`;
        }

        const style = `
            display: flex;
            width: 100%; /* Fill wrapper */
            flex-direction: ${direction};
            justify-content: ${justify};
            align-items: ${align};
            flex-wrap: ${wrap};
            gap: ${gap}px;
            background-color: ${bg};
            padding: ${padding.top}${padding.unit} ${padding.right}${padding.unit} ${padding.bottom}${padding.unit} ${padding.left}${padding.unit};
            border-radius: ${radius}px;
            ${minHeightVal}
            box-sizing: border-box;
        `.trim();

        let html = `<${htmlTag} class="elementor-flex-widget" style="${style}">`;

        // Determine Columns (Standard or Custom Ratio)
        let columns = [];
        if (layout.includes('-')) {
            // Asymmetric layout like "33-66"
            const parts = layout.split('-');
            parts.forEach(part => {
                columns.push({ width: `${part}%` });
            });
        } else {
            // Standard equal layout
            const count = parseInt(layout);
            for (let i = 0; i < count; i++) {
                columns.push({ width: 'equal' });
            }
        }

        // Render slots
        columns.forEach((col, i) => {
            let itemStyle = `
                position: relative;
                box-sizing: border-box;
            `;

            if (col.width === 'equal') {
                itemStyle += `flex: 1; min-width: 50px;`;
            } else {
                // Fixed percentage width
                itemStyle += `flex: 0 0 ${col.width}; max-width: ${col.width};`;
            }

            html += `<div class="flex-item elementor-container-slot" data-container-index="${i}" style="${itemStyle}"></div>`;
        });

        html += `</${htmlTag}>`;

        return html;
    }
}

// Self-register if manager exists
if (typeof window.elementorWidgetManager !== 'undefined') {
    window.elementorWidgetManager.registerWidget(FlexWidget);
}
