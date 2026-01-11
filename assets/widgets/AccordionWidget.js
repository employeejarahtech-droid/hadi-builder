/**
 * AccordionWidget - Collapsible sections widget
 */
class AccordionWidget extends WidgetBase {
    getName() { return 'accordion'; }
    getTitle() { return 'Accordion'; }
    getIcon() { return 'fa fa-bars'; }
    getCategories() { return ['interactive']; }
    getKeywords() { return ['accordion', 'collapsible', 'faq']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('items', {
            type: 'repeater',
            label: 'Accordion Items',
            default_value: [
                { title: 'Section 1', content: 'Content for section 1' },
                { title: 'Section 2', content: 'Content for section 2' },
                { title: 'Section 3', content: 'Content for section 3' }
            ],
            fields: [
                { id: 'title', type: 'text', label: 'Title', default_value: 'Section Title', placeholder: 'Enter title' },
                { id: 'content', type: 'textarea', label: 'Content', default_value: 'Section content', placeholder: 'Enter content' }
            ]
        });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const items = this.getSetting('items', [
            { title: 'Section 1', content: 'Content for section 1' },
            { title: 'Section 2', content: 'Content for section 2' }
        ]);
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const textColor = this.getSetting('text_color', '#1a1a1a');

        const itemsArray = Array.isArray(items) ? items : [];
        const accordionItems = itemsArray.map((item, index) => {
            const uniqueId = `accordion-${this.id}-${index}`;
            return `
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; overflow: hidden;">
                    <div onclick="document.getElementById('${uniqueId}').style.display = document.getElementById('${uniqueId}').style.display === 'none' ? 'block' : 'none'" style="background: ${accentColor}15; padding: 15px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: ${textColor}; font-size: 16px; font-weight: 600;">${this.escapeHtml(item.title || 'Section')}</span>
                        <i class="fa fa-chevron-down" style="color: ${accentColor};"></i>
                    </div>
                    <div id="${uniqueId}" style="display: none; padding: 20px; color: #666; font-size: 14px; line-height: 1.6;">${this.escapeHtml(item.content || '')}</div>
                </div>
            `;
        }).join('');

        const content = `<div>${accordionItems}</div>`;

        return this.wrapWithAdvancedSettings(content, 'accordion-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(AccordionWidget);
