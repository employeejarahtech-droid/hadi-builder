class CartWidget extends WidgetBase {
    getName() { return 'cart'; }
    getTitle() { return 'Cart'; }
    getIcon() { return 'fas fa-shopping-cart'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['cart', 'shopping', 'basket']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Shopping Cart', placeholder: 'Enter title', label_block: true });
        this.addControl('checkout_link', {
            type: 'url',
            label: 'Checkout Page Link',
            default_value: '#',
            placeholder: '/checkout',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Shopping Cart');
        const buttonColor = this.getSetting('button_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'cart-widget-' + Math.random().toString(36).substr(2, 9);
        const animation = this.getSetting('animation', 'none');

        let checkoutLink = this.getSetting('checkout_link', { url: '#' });
        if (typeof checkoutLink === 'string') {
            checkoutLink = { url: checkoutLink };
        }

        // Override with global setting if available
        if (window.CMS_SETTINGS && window.CMS_SETTINGS.checkoutUrl) {
            checkoutLink.url = window.CMS_SETTINGS.checkoutUrl;
        }

        // We render an empty container first, then populate it via JS
        // This allows us to subscribe to events and update without full re-renders of the widget wrapper
        // However, in this CMS, render() might be called only once.
        // We'll attach a script to handle the dynamic updates.

        setTimeout(() => {
            this.initCartLogic(cssId, buttonColor);
        }, 100);

        let wrapperClasses = ['cart-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);

        return `
            <div id="${cssId}" class="${wrapperClasses.join(' ')}" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <div style="background: ${buttonColor}; color: white; padding: 15px;">
                    <h3 style="font-size: 20px; font-weight: 700; margin: 0; color: white;">${this.escapeHtml(title)}</h3>
                </div>
                <div class="cart-items-container" style="min-height: 100px;">
                    <!-- Items rendered here -->
                    <div style="padding: 20px; text-align: center; color: #666;">Loading cart...</div>
                </div>
                <div class="cart-footer" style="padding: 20px; background: #f9fafb;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="font-size: 16px; font-weight: 600;">Total:</span>
                        <span class="cart-total" style="font-size: 18px; font-weight: 700;">$0.00</span>
                    </div>
                    <a href="${checkoutLink.url}" target="${checkoutLink.is_external ? '_blank' : '_self'}" style="display: block; text-align: center; text-decoration: none; width: 100%; background: ${buttonColor}; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Proceed to Checkout</a>
                    <button onclick="if(window.EcommerceManager) window.EcommerceManager.clearCart()" style="width: 100%; margin-top: 10px; background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">Clear Cart</button>
                </div>
            </div>
        `;
    }

    initCartLogic(id, buttonColor) {
        if (!window.EcommerceManager) return;

        const checkElement = () => document.getElementById(id);

        // Retry finding element if not immediately available (beyond the initial timeout)
        let attempts = 0;
        const waitForElement = setInterval(() => {
            attempts++;
            if (checkElement()) {
                clearInterval(waitForElement);
                setup();
            } else if (attempts > 20) {
                clearInterval(waitForElement);
            }
        }, 100);

        const setup = () => {
            const container = checkElement();
            const itemsContainer = container.querySelector('.cart-items-container');
            const totalEl = container.querySelector('.cart-total');

            const updateView = () => {
                // Self-cleanup: If widget removed from DOM, remove listener
                if (!document.getElementById(id)) {
                    window.EcommerceManager.off('cart:updated', updateView);
                    return;
                }

                const cart = window.EcommerceManager.getCart();
                const total = window.EcommerceManager.getTotal();

                if (totalEl) totalEl.textContent = window.EcommerceManager.formatPrice(total);

                if (cart.length === 0) {
                    itemsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Your cart is empty</div>';
                    return;
                }

                itemsContainer.innerHTML = cart.map(item => `
                    <div style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        <div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #666;">
                            <i class="fas fa-box"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-size: 15px; font-weight: 700; margin-bottom: 4px;">${this.escapeHtml(item.name)}</div>
                            <div style="font-size: 13px; color: #666;">
                                Qty: ${item.qty} &times; ${item.price}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <button onclick="window.EcommerceManager.removeItem('${item.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            };

            // Initial render
            updateView();

            // Subscribe to updates
            window.EcommerceManager.on('cart:updated', updateView);
        };
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(CartWidget);
