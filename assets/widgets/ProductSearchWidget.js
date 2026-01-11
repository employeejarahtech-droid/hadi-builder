class ProductSearchWidget extends WidgetBase {
    getName() { return 'product_search'; }
    getTitle() { return 'Product Search'; }
    getIcon() { return 'fas fa-search'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['search', 'find', 'product']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('placeholder', { type: 'text', label: 'Placeholder', default_value: 'Search for products...' });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const placeholder = this.getSetting('placeholder', 'Search for products...');
        const color = this.getSetting('color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');

        const contentHtml = `
            <div style="display: flex; border: 2px solid ${color}; border-radius: 8px; overflow: hidden;">
                <input type="text" placeholder="${this.escapeHtml(placeholder)}" style="flex: 1; border: none; padding: 12px 15px; font-size: 15px; outline: none;">
                <button style="background: ${color}; border: none; color: white; padding: 0 20px; cursor: pointer; font-size: 16px;">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        `;

        let wrapperClasses = ['product-search-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);
        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}>${contentHtml}</div>`;
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(ProductSearchWidget);
