class ProductCategoryWidget extends WidgetBase {
    getName() { return 'product_category'; }
    getTitle() { return 'Product Categories'; }
    getIcon() { return 'fas fa-tags'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['category', 'list', 'shop']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Categories', placeholder: 'Enter title' });

        // Simulating categories via repeater-like logic or just fixed options for now as repeater might be heavy
        // For simplicity in this demo, we'll use a text area to define comma-separated categories
        this.addControl('categories', { type: 'textarea', label: 'Categories (comma separated)', default_value: 'Electronics, Clothing, Home & Garden, Sports, Toys', description: 'Enter category names separated by commas.' });

        this.addControl('layout', { type: 'select', label: 'Layout', default_value: 'grid', options: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }] });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('color', { type: 'color', label: 'Color', default_value: '#3b82f6' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Categories');
        const categoriesStr = this.getSetting('categories', 'Electronics, Clothing, Home & Garden, Sports, Toys');
        const layout = this.getSetting('layout', 'grid');
        const color = this.getSetting('color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');

        const categories = categoriesStr.split(',').map(c => c.trim()).filter(c => c);

        let itemsHtml = '';
        if (layout === 'grid') {
            itemsHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px;">
                ${categories.map(cat => `
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='${color}20'; this.style.color='${color}'" onmouseout="this.style.background='#f3f4f6'; this.style.color='inherit'">
                        <div style="font-size: 24px; margin-bottom: 10px; color: ${color};"><i class="fas fa-tag"></i></div>
                        <div style="font-weight: 600;">${this.escapeHtml(cat)}</div>
                    </div>
                `).join('')}
            </div>`;
        } else {
            itemsHtml = `<div style="display: flex; flex-direction: column; gap: 10px;">
                ${categories.map(cat => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='${color}'" onmouseout="this.style.borderColor='#e5e7eb'">
                        <span style="font-weight: 600;">${this.escapeHtml(cat)}</span>
                        <i class="fas fa-chevron-right" style="color: #9ca3af; font-size: 14px;"></i>
                    </div>
                `).join('')}
            </div>`;
        }

        const contentHtml = `
            <div>
                <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h3>
                ${itemsHtml}
            </div>
        `;

        let wrapperClasses = ['product-category-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);
        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}>${contentHtml}</div>`;
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(ProductCategoryWidget);
