class DividerWidget extends WidgetBase {
    getName() {
        return 'divider';
    }

    getTitle() {
        return 'Divider';
    }

    getIcon() {
        return 'fa fa-minus';
    }

    getCategories() {
        return ['basic'];
    }

    registerControls() {
        this.startControlsSection('style_section', {
            label: 'Divider',
            tab: 'style'
        });

        this.addControl('style', {
            type: 'select',
            label: 'Style',
            options: [
                { value: 'solid', label: 'Solid' },
                { value: 'double', label: 'Double' },
                { value: 'dotted', label: 'Dotted' },
                { value: 'dashed', label: 'Dashed' }
            ],
            default_value: 'solid'
        });

        this.addControl('width', {
            type: 'slider',
            label: 'Width (%)',
            min: 1,
            max: 100,
            default_value: 100
        });

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'center'
        });

        this.addControl('color', {
            type: 'color',
            label: 'Color',
            default_value: '#000000'
        });

        this.addControl('weight', {
            type: 'slider',
            label: 'Weight',
            min: 1,
            max: 10,
            default_value: 1
        });

        this.addControl('gap', {
            type: 'slider',
            label: 'Gap',
            min: 1,
            max: 50,
            default_value: 10
        });

        this.endControlsSection();
    }

    render() {
        const style = this.getSetting('style');
        const width = this.getSetting('width');
        const align = this.getSetting('align');
        const color = this.getSetting('color');
        const weight = this.getSetting('weight');
        const gap = this.getSetting('gap');

        let containerAlign = 'center';
        if (align === 'left') containerAlign = 'flex-start';
        if (align === 'right') containerAlign = 'flex-end';

        return `
            <div class="elementor-divider-widget" style="display: flex; justify-content: ${containerAlign}; padding-top: ${gap}px; padding-bottom: ${gap}px;">
                <span class="elementor-divider-separator" style="
                    border-top: ${weight}px ${style} ${color};
                    width: ${width}%;
                "></span>
            </div>
        `;
    }
}
