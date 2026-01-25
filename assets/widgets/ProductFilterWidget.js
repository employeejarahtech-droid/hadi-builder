class ProductFilterWidget extends WidgetBase {
    getName() { return 'product_filter'; }
    getTitle() { return 'Product Filter'; }
    getIcon() { return 'fas fa-filter'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['filter', 'search', 'sidebar']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Filters' });
        this.addControl('show_price_filter', { type: 'switcher', label: 'Show Price Filter', default_value: 'yes' });
        this.addControl('show_categories_filter', { type: 'switcher', label: 'Show Categories', default_value: 'yes' });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Filters');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const showPriceFilter = this.getSetting('show_price_filter', 'yes');
        const showCategoriesFilter = this.getSetting('show_categories_filter', 'yes');

        let contentHtml = `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                <h4 style="font-size: 18px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h4>`;

        if (showPriceFilter === 'yes') {
            contentHtml += `
                <div style="margin-bottom: 25px;">
                    <h5 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Price Range</h5>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <input type="number" placeholder="Min" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <span>-</span>
                        <input type="number" placeholder="Max" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <input type="range" min="0" max="1000" style="width: 100%; accent-color: ${accentColor};">
                </div>`;
        }

        if (showCategoriesFilter === 'yes') {
            contentHtml += `
                <div>
                    <h5 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Categories</h5>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" style="accent-color: ${accentColor};"> Electronics
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" style="accent-color: ${accentColor};"> Clothing
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" style="accent-color: ${accentColor};"> Home & Garden
                        </label>
                    </div>
                </div>`;
        }

        contentHtml += `
                <button style="width: 100%; margin-top: 20px; background: ${accentColor}; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Apply Filters
                </button>
            </div>
        `;

        let wrapperClasses = ['product-filter-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}>${contentHtml}</div>`;
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(ProductFilterWidget);
