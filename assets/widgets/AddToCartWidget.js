class AddToCartWidget extends WidgetBase {
    getName() { return 'add_to_cart'; }
    getTitle() { return 'Add to Cart'; }
    getIcon() { return 'fas fa-cart-plus'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['add', 'cart', 'button']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Add to Cart', placeholder: 'Enter text', label_block: true });
        this.addControl('show_quantity', { type: 'select', label: 'Show Quantity', default_value: 'yes', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#10b981' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const buttonText = this.getSetting('button_text', 'Add to Cart');
        const showQuantity = this.getSetting('show_quantity', 'yes');
        const buttonColor = this.getSetting('button_color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };

        // Generic product for this button
        const productData = {
            id: 'generic_' + Math.random().toString(36).substr(2, 9),
            name: 'Generic Item',
            price: '$10.00',
            image: ''
        };
        const productJson = JSON.stringify(productData).replace(/"/g, '&quot;');

        const contentHtml = `<div style="display: flex; gap: 10px; align-items: center;">${showQuantity === 'yes' ? `<div style="display: flex; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"><button style="background: white; border: none; padding: 10px 15px; cursor: pointer; font-size: 16px; font-weight: 600;">-</button><input type="number" value="1" min="1" style="width: 60px; border: none; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; text-align: center; font-size: 14px; font-weight: 600;"><button style="background: white; border: none; padding: 10px 15px; cursor: pointer; font-size: 16px; font-weight: 600;">+</button></div>` : ''}<button onclick="if(window.EcommerceManager) { window.EcommerceManager.addItem(${productJson}); }" style="flex: 1; background: ${buttonColor}; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;"><i class="fas fa-shopping-cart"></i> ${this.escapeHtml(buttonText)}</button></div>`;
        let wrapperClasses = ['add-to-cart-widget'];
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

window.elementorWidgetManager.registerWidget(AddToCartWidget);
