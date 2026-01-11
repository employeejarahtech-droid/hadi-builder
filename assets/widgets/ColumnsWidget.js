class ColumnsWidget extends WidgetBase {
    getName() {
        return 'columns';
    }

    getTitle() {
        return 'Columns';
    }

    getIcon() {
        return 'fa fa-columns';
    }

    getCategories() {
        return ['layout'];
    }

    // Is this a container widget?
    isContainer() {
        return true;
    }

    registerControls() {
        this.startControlsSection('layout_section', {
            label: 'Layout',
            tab: 'content'
        });

        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            options: [
                { value: '2', label: '2 Columns (50/50)' },
                { value: '3', label: '3 Columns (33/33/33)' },
                { value: '4', label: '4 Columns (25/25/25/25)' },
                { value: '2_66_33', label: '2 Columns (66/33)' },
                { value: '2_33_66', label: '2 Columns (33/66)' }
            ],
            default_value: '2'
        });

        this.addControl('gap', {
            type: 'slider',
            label: 'Column Gap',
            min: 0,
            max: 100,
            default_value: 20
        });

        this.endControlsSection();

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
            default_value: 0
        });

        this.endControlsSection();
    }

    render() {
        const columns = this.getSetting('columns');
        const gap = this.getSetting('gap');
        const padding = this.getSetting('padding');
        const bg = this.getSetting('background_color');

        let gridTemplate = '1fr 1fr';
        let numCols = 2;

        if (columns === '3') {
            gridTemplate = '1fr 1fr 1fr';
            numCols = 3;
        } else if (columns === '4') {
            gridTemplate = '1fr 1fr 1fr 1fr';
            numCols = 4;
        } else if (columns === '2_66_33') {
            gridTemplate = '2fr 1fr';
            numCols = 2;
        } else if (columns === '2_33_66') {
            gridTemplate = '1fr 2fr';
            numCols = 2;
        }

        const containerStyle = `
            display: grid;
            grid-template-columns: ${gridTemplate};
            gap: ${gap}px;
            padding: ${padding}px;
            background-color: ${bg};
        `;

        let html = `<div class="elementor-columns-widget" style="${containerStyle}">`;

        // Render slots (containers)
        for (let i = 0; i < numCols; i++) {
            // Added data-container-index for the renderer to identify where to drop children
            html += `<div class="column-item elementor-container-slot" data-container-index="${i}"></div>`;
        }

        html += `</div>`;

        return html;
    }
}

window.elementorWidgetManager.registerWidget(ColumnsWidget);
