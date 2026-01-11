class ProductWidget extends WidgetBase {
    getName() { return 'product'; }
    getTitle() { return 'Product'; }
    getIcon() { return 'fas fa-box'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['product', 'card', 'shop']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('product_name', { type: 'text', label: 'Product Name', default_value: 'Product Name', placeholder: 'Enter name', label_block: true });
        this.addControl('price', { type: 'text', label: 'Price', default_value: '$99.00', placeholder: 'Enter price' });
        this.addControl('rating', { type: 'text', label: 'Rating', default_value: '4.5', placeholder: 'e.g., 4.5' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#10b981' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const productName = this.getSetting('product_name', 'Product Name');
        const price = this.getSetting('price', '$99.00');
        const rating = this.getSetting('rating', '4.5');
        const buttonColor = this.getSetting('button_color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const stars = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star" style="color: ${i < Math.floor(parseFloat(rating)) ? '#f59e0b' : '#e5e7eb'}; font-size: 14px;"></i>`).join('');

        // Product data for cart
        const productData = {
            id: 'product_' + Math.random().toString(36).substr(2, 9),
            name: productName,
            price: price,
            image: '' // Placeholder
        };
        const productJson = JSON.stringify(productData).replace(/"/g, '&quot;');

        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: box-shadow 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'"><div style="background: #f3f4f6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fas fa-box"></i></div><div style="padding: 20px;"><h4 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(productName)}</h4><div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">${stars}<span style="font-size: 12px; color: #666; margin-left: 5px;">(${this.escapeHtml(rating)})</span></div><div style="font-size: 24px; font-weight: 700; color: ${buttonColor}; margin-bottom: 15px;">${this.escapeHtml(price)}</div><button onclick="if(window.EcommerceManager) { window.EcommerceManager.addItem(${productJson}); } else { console.error('EcommerceManager not found'); }" style="width: 100%; background: ${buttonColor}; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;"><i class="fas fa-shopping-cart"></i> Add to Cart</button></div></div>`;
        let wrapperClasses = ['product-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);
        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${contentHtml}</div>`;
    }
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(ProductWidget);
