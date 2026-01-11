/**
 * TextWidget - Text/Paragraph widget
 * Displays formatted text content
 */
class TextWidget extends WidgetBase {
    getName() {
        return 'text';
    }

    getTitle() {
        return 'Text Editor';
    }

    getIcon() {
        return 'fa fa-align-left';
    }

    getCategories() {
        return ['content'];
    }

    getKeywords() {
        return ['text', 'paragraph', 'content', 'editor'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('content', {
            type: 'textarea',
            label: 'Content',
            default_value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
            placeholder: 'Enter your text',
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
            default_value: '#666666'
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

        this.addControl('line_height', {
            type: 'slider',
            label: 'Line Height',
            default_value: { size: 1.6, unit: '' },
            range: {
                min: 1,
                max: 3,
                step: 0.1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const content = this.getSetting('content', 'Lorem ipsum...');
        const align = this.getSetting('align', 'left');
        const color = this.getSetting('color', '#666666');
        const fontSize = this.getSetting('font_size', { size: 16, unit: 'px' });
        const lineHeight = this.getSetting('line_height', { size: 1.6, unit: '' });

        const safeFontSize = typeof fontSize === 'object' ? `${fontSize.size}${fontSize.unit}` : `${fontSize}px`;
        const safeLineHeight = typeof lineHeight === 'object' ? `${lineHeight.size}${lineHeight.unit}` : lineHeight;

        const styles = [
            `text-align: ${align}`,
            `color: ${color}`,
            `font-size: ${safeFontSize}`,
            `line-height: ${safeLineHeight}`
        ].join('; ');

        const formattedContent = this.escapeHtml(content).replace(/\n/g, '<br>');

        const contentHtml = `<div style="${styles}">${formattedContent}</div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'text-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(TextWidget);
