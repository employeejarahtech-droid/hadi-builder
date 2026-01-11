class OrderConfirmationWidget extends WidgetBase {
    getName() { return 'order_confirmation'; }
    getTitle() { return 'Order Confirmation'; }
    getIcon() { return 'fas fa-check-circle'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['order', 'success', 'thank you']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('message', { type: 'text', label: 'Message', default_value: 'Thank you for your order!' });
        this.addControl('sub_message', { type: 'textarea', label: 'Sub Message', default_value: 'We have received your order and are processing it.' });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('color', { type: 'color', label: 'Color', default_value: '#10b981' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const message = this.getSetting('message', 'Thank you for your order!');
        const subMessage = this.getSetting('sub_message', 'We have received your order and are processing it.');
        const color = this.getSetting('color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'order-confirm-' + Math.random().toString(36).substr(2, 9);

        // Auto-clear cart if this widget is rendered?
        // Let's attach a script to do it.
        const orderId = '#ORD-' + Math.floor(100000 + Math.random() * 900000);

        setTimeout(() => {
            if (window.EcommerceManager) {
                // Only clear if cart has items, to prevent clearing on random refresh if empty
                if (window.EcommerceManager.getItemCount() > 0) {
                    window.EcommerceManager.clearCart();
                }
            }
        }, 500);

        let wrapperClasses = ['order-confirmation-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);

        return `
            <div id="${cssId}" class="${wrapperClasses.join(' ')}" style="text-align: center; padding: 40px; border: 1px dashed ${color}; border-radius: 12px; background: ${color}0a;">
                <div style="font-size: 48px; color: ${color}; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 10px; color: #333;">${this.escapeHtml(message)}</h2>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px;">${this.escapeHtml(subMessage)}</p>
                <div style="font-weight: 600; color: #333; font-size: 18px;">Order ID: ${orderId}</div>
                <button onclick="window.location.href='/'" style="margin-top: 30px; background: ${color}; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;">Continue Shopping</button>
            </div>
        `;
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(OrderConfirmationWidget);
