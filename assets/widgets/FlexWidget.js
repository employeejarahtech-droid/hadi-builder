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
                { value: '1', label: '1 Item' },
                { value: '2', label: '2 Items' },
                { value: '3', label: '3 Items' },
                { value: '4', label: '4 Items' }
            ],
            default_value: '2'
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

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: ''
        });

        this.addControl('padding', {
            type: 'slider',
            label: 'Padding',
            min: 0,
            max: 100,
            default_value: 20
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
        const items = parseInt(this.getSetting('items', '2'));
        const direction = this.getSetting('flex_direction');
        const justify = this.getSetting('justify_content');
        const align = this.getSetting('align_items');
        const wrap = this.getSetting('flex_wrap');
        const gap = this.getSetting('gap');

        const bg = this.getSetting('background_color');
        const padding = this.getSetting('padding');
        const radius = this.getSetting('border_radius');

        const style = `
            display: flex;
            flex-direction: ${direction};
            justify-content: ${justify};
            align-items: ${align};
            flex-wrap: ${wrap};
            gap: ${gap}px;
            background-color: ${bg};
            padding: ${padding}px;
            border-radius: ${radius}px;
        `;

        let html = `<div class="elementor-flex-widget" style="${style}">`;

        // Render slots (containers)
        for (let i = 0; i < items; i++) {
            // Flex items need some default behavior to be visible/usable
            // flex: 1 ensure they share space, but might need adjustment for 'column' direction
            const itemStyle = `
                flex: 1; 
                min-height: 50px; 
                min-width: 50px; 
                border: 1px dashed #e5e7eb;
            `;
            html += `<div class="flex-item elementor-container-slot" data-container-index="${i}" style="${itemStyle}"></div>`;
        }

        html += `</div>`;

        return html;
    }
}

// Self-register if manager exists
if (typeof window.elementorWidgetManager !== 'undefined') {
    window.elementorWidgetManager.registerWidget(FlexWidget);
}
