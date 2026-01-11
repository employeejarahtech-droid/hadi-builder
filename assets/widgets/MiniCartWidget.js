class MiniCartWidget extends WidgetBase {
    getName() { return 'mini_cart'; }
    getTitle() { return 'Mini Cart'; }
    getIcon() { return 'fas fa-shopping-basket'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['cart', 'mini', 'header']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Settings', tab: 'content' });
        this.addControl('checkout_link', {
            type: 'url',
            label: 'Checkout Page Link',
            default_value: '#',
            placeholder: 'https://your-site.com/checkout',
            label_block: true
        });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('icon_color', { type: 'color', label: 'Icon Color', default_value: '#333333' });
        this.addControl('badge_color', { type: 'color', label: 'Badge Color', default_value: '#ef4444' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }

    render() {
        let checkoutLink = this.getSetting('checkout_link', { url: '#' });
        if (typeof checkoutLink === 'string') {
            checkoutLink = { url: checkoutLink };
        }
        const iconColor = this.getSetting('icon_color', '#333333');
        const badgeColor = this.getSetting('badge_color', '#ef4444');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'mini-cart-' + Math.random().toString(36).substr(2, 9);
        const animation = this.getSetting('animation', 'none');

        setTimeout(() => {
            this.initMiniCart(cssId);
        }, 100);

        let wrapperClasses = ['mini-cart-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);

        return `
            <div id="${cssId}" class="${wrapperClasses.join(' ')}" style="display: inline-block; position: relative;">
                <button class="mini-cart-btn" style="background: none; border: none; cursor: pointer; position: relative; padding: 5px;">
                    <i class="fas fa-shopping-cart" style="font-size: 24px; color: ${iconColor};"></i>
                    <span class="cart-badge" style="position: absolute; top: -5px; right: -5px; background: ${badgeColor}; color: white; font-size: 11px; font-weight: bold; height: 18px; min-width: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; display: none;">0</span>
                </button>
                
                <!-- Dropdown Preview -->
                <div class="mini-cart-dropdown" style="position: absolute; top: 100%; right: 0; width: 300px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: none; z-index: 50; flex-direction: column;">
                    <div class="mini-cart-items" style="max-height: 300px; overflow-y: auto; padding: 10px;">
                        <!-- Items will be injected here -->
                    </div>
                    <div class="mini-cart-footer" style="padding: 15px; border-top: 1px solid #e5e7eb; background: #f9fafb; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 700;">
                            <span>Total:</span>
                            <span class="mini-cart-total">$0.00</span>
                        </div>
                        <a href="${checkoutLink.url}" target="${checkoutLink.is_external ? '_blank' : '_self'}" style="display: block; text-align: center; text-decoration: none; width: 100%; background: ${iconColor}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: 600;">Checkout</a>
                    </div>
                </div>
            </div>
        `;
    }

    initMiniCart(id) {
        console.log('MiniCartWidget.initMiniCart called for:', id);
        if (!window.EcommerceManager) {
            console.error('EcommerceManager not available');
            return;
        }
        console.log('EcommerceManager found:', window.EcommerceManager);

        const checkElement = () => document.getElementById(id);
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
            const btn = container.querySelector('.mini-cart-btn');
            const dropdown = container.querySelector('.mini-cart-dropdown');
            const itemsContainer = container.querySelector('.mini-cart-items');
            const badge = container.querySelector('.cart-badge');
            const totalEl = container.querySelector('.mini-cart-total');

            // Toggle dropdown
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = dropdown.style.display === 'none';
                dropdown.style.display = isHidden ? 'flex' : 'none';
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });

            const updateView = () => {
                console.log('MiniCartWidget.updateView called');
                if (!document.getElementById(id)) {
                    console.log('Element removed, unsubscribing');
                    window.EcommerceManager.off('cart:updated', updateView);
                    return;
                }

                const cart = window.EcommerceManager.getCart();
                const count = window.EcommerceManager.getItemCount();
                const total = window.EcommerceManager.getTotal();

                console.log('Cart updated:', { cart, count, total });

                // Update badge
                if (badge) {
                    badge.textContent = count;
                    badge.style.display = count > 0 ? 'flex' : 'none';
                }

                // Update Total
                if (totalEl) totalEl.textContent = window.EcommerceManager.formatPrice(total);

                // Update Items
                if (cart.length === 0) {
                    itemsContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Cart is empty</div>';
                } else {
                    itemsContainer.innerHTML = cart.map(item => `
                        <div style="display: flex; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6;">
                            <div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af;">
                                <i class="fas fa-box" style="font-size: 12px;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 13px; font-weight: 600; margin-bottom: 2px;">${this.escapeHtml(item.name)}</div>
                                <div style="font-size: 11px; color: #666;">${item.qty} x ${typeof item.price === 'string' ? item.price : window.EcommerceManager.formatPrice(parseFloat(item.price))}</div>
                            </div>
                            <button onclick="window.EcommerceManager.removeItem('${item.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('');
                }
            };

            // Init
            console.log('Subscribing to cart:updated event');
            updateView();
            window.EcommerceManager.on('cart:updated', updateView);
            console.log('MiniCartWidget initialized successfully');
        };
    }
}

window.elementorWidgetManager.registerWidget(MiniCartWidget);
