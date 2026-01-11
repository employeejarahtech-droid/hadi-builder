class CheckoutWidget extends WidgetBase {
    getName() { return 'checkout'; }
    getTitle() { return 'Checkout'; }
    getIcon() { return 'fas fa-credit-card'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['checkout', 'payment', 'form']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Checkout', placeholder: 'Enter title', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#10b981' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Checkout');
        const buttonColor = this.getSetting('button_color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'checkout-widget-' + Math.random().toString(36).substr(2, 9);
        const animation = this.getSetting('animation', 'none');

        setTimeout(() => {
            this.initCheckoutLogic(cssId);
        }, 100);

        let wrapperClasses = ['checkout-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);

        return `
            <div id="${cssId}" class="${wrapperClasses.join(' ')}" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px;">
                <h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3>
                <form class="checkout-form">
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-size: 16px; font-weight: 700; margin: 0 0 15px 0;">Billing Information</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div>
                                <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">First Name</label>
                                <input type="text" name="first_name" placeholder="First name" required style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Last Name</label>
                                <input type="text" name="last_name" placeholder="Last name" required style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Email</label>
                            <input type="email" name="email" placeholder="your@email.com" required style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Mobile Number</label>
                            <input type="tel" name="phone" placeholder="+1 234 567 8900" required style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Address</label>
                            <input type="text" name="address" placeholder="Street address" required style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>


                    <div style="margin-bottom: 20px;">
                        <h4 style="font-size: 16px; font-weight: 700; margin: 0 0 15px 0;">Payment Method</h4>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <label style="display: flex; align-items: center; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; cursor: pointer; transition: all 0.2s;" class="payment-option">
                                <input type="radio" name="payment_method" value="cash_on_delivery" checked style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 14px;">Cash on Delivery</div>
                                    <div style="font-size: 12px; color: #6b7280;">Pay when you receive your order</div>
                                </div>
                            </label>
                            <label style="display: flex; align-items: center; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; cursor: pointer; transition: all 0.2s;" class="payment-option">
                                <input type="radio" name="payment_method" value="card" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 14px;">Credit/Debit Card</div>
                                    <div style="font-size: 12px; color: #6b7280;">Pay securely with your card</div>
                                </div>
                            </label>
                            <label style="display: flex; align-items: center; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; cursor: pointer; transition: all 0.2s;" class="payment-option">
                                <input type="radio" name="payment_method" value="paypal" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 14px;">PayPal</div>
                                    <div style="font-size: 12px; color: #6b7280;">Pay with your PayPal account</div>
                                </div>
                            </label>
                            <label style="display: flex; align-items: center; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; cursor: pointer; transition: all 0.2s;" class="payment-option">
                                <input type="radio" name="payment_method" value="stripe" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 14px;">Stripe</div>
                                    <div style="font-size: 12px; color: #6b7280;">Pay via Stripe payment gateway</div>
                                </div>
                            </label>
                        </div>

                        
                        <!-- Card Payment Fields (shown only when card is selected) -->
                        <div class="card-payment-fields" style="display: none; margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                            <h5 style="font-size: 14px; font-weight: 700; margin: 0 0 15px 0;">Card Details</h5>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Card Number</label>
                                <input type="text" class="card-number" placeholder="1234 5678 9012 3456" maxlength="19" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div>
                                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Expiry Date</label>
                                    <input type="text" class="card-expiry" placeholder="MM/YY" maxlength="5" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                                </div>
                                <div>
                                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">CVV</label>
                                    <input type="text" class="card-cvv" placeholder="123" maxlength="4" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                                </div>
                            </div>
                        </div>
                        
                        <!-- PayPal Email Field (shown only when PayPal is selected) -->
                        <div class="paypal-payment-fields" style="display: none; margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                            <h5 style="font-size: 14px; font-weight: 700; margin: 0 0 15px 0;">PayPal Account</h5>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">PayPal Email</label>
                                <input type="email" class="paypal-email" placeholder="your-paypal@email.com" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                            </div>
                            <p style="font-size: 12px; color: #6b7280; margin: 0;">You will be redirected to PayPal to complete your payment.</p>
                        </div>
                        
                        <!-- Stripe Payment Fields (shown only when Stripe is selected) -->
                        <div class="stripe-payment-fields" style="display: none; margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                            <h5 style="font-size: 14px; font-weight: 700; margin: 0 0 15px 0;">Stripe Payment</h5>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Card Number</label>
                                <input type="text" class="stripe-card-number" placeholder="1234 5678 9012 3456" maxlength="19" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div>
                                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Expiry Date</label>
                                    <input type="text" class="stripe-expiry" placeholder="MM/YY" maxlength="5" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                                </div>
                                <div>
                                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">CVC</label>
                                    <input type="text" class="stripe-cvc" placeholder="123" maxlength="4" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="order-summary" style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 14px;">Subtotal:</span>
                            <span class="checkout-subtotal" style="font-size: 14px; font-weight: 600;">$0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 14px;">Shipping:</span>
                            <span style="font-size: 14px; font-weight: 600;">$10.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                            <span style="font-size: 16px; font-weight: 700;">Total:</span>
                            <span class="checkout-total" style="font-size: 18px; font-weight: 700; color: ${buttonColor};">$10.00</span>
                        </div>
                    </div>

                    <div class="checkout-message" style="display: none; padding: 15px; border-radius: 6px; margin-bottom: 15px;"></div>

                    <button type="submit" class="checkout-submit-btn" style="width: 100%; background: ${buttonColor}; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Complete Purchase</button>
                </form>
            </div>
        `;
    }

    initCheckoutLogic(id) {
        if (!window.EcommerceManager) return;

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
            const subtotalEl = container.querySelector('.checkout-subtotal');
            const totalEl = container.querySelector('.checkout-total');
            const form = container.querySelector('.checkout-form');
            const messageEl = container.querySelector('.checkout-message');
            const submitBtn = container.querySelector('.checkout-submit-btn');
            const shipping = 10.00;

            const updateView = () => {
                // Self-cleanup
                if (!document.getElementById(id)) {
                    window.EcommerceManager.off('cart:updated', updateView);
                    return;
                }

                const total = window.EcommerceManager.getTotal();
                if (subtotalEl) subtotalEl.textContent = window.EcommerceManager.formatPrice(total);
                if (totalEl) totalEl.textContent = window.EcommerceManager.formatPrice(total + shipping);
            };

            const showMessage = (message, type = 'success') => {
                if (!messageEl) return;
                messageEl.style.display = 'block';
                messageEl.style.background = type === 'success' ? '#dcfce7' : '#fee2e2';
                messageEl.style.color = type === 'success' ? '#166534' : '#991b1b';
                messageEl.textContent = message;
            };

            // Add visual feedback for payment method selection
            const initPaymentOptions = () => {
                const paymentOptions = container.querySelectorAll('.payment-option');
                const cardFields = container.querySelector('.card-payment-fields');
                const paypalFields = container.querySelector('.paypal-payment-fields');
                const stripeFields = container.querySelector('.stripe-payment-fields');
                const buttonColor = this.getSetting('button_color', '#10b981');

                const togglePaymentFields = (paymentMethod) => {
                    if (cardFields) {
                        cardFields.style.display = paymentMethod === 'card' ? 'block' : 'none';
                    }
                    if (paypalFields) {
                        paypalFields.style.display = paymentMethod === 'paypal' ? 'block' : 'none';
                    }
                    if (stripeFields) {
                        stripeFields.style.display = paymentMethod === 'stripe' ? 'block' : 'none';
                    }
                };

                paymentOptions.forEach(option => {
                    const radio = option.querySelector('input[type="radio"]');
                    if (!radio) return;

                    radio.addEventListener('change', () => {
                        paymentOptions.forEach(opt => {
                            opt.style.borderColor = '#e5e7eb';
                            opt.style.background = 'transparent';
                        });
                        if (radio.checked) {
                            option.style.borderColor = buttonColor;
                            option.style.background = buttonColor + '10';
                            togglePaymentFields(radio.value);
                        }
                    });

                    // Set initial state
                    if (radio.checked) {
                        option.style.borderColor = buttonColor;
                        option.style.background = buttonColor + '10';
                        togglePaymentFields(radio.value);
                    }
                });
            };

            // Initialize payment options after a short delay to ensure DOM is ready
            setTimeout(initPaymentOptions, 100);

            // Handle form submission
            if (form) {

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    // Get form data
                    const formData = new FormData(form);
                    const cartItems = window.EcommerceManager.getCart();

                    if (cartItems.length === 0) {
                        showMessage('Your cart is empty!', 'error');
                        return;
                    }

                    // Prepare order data
                    const orderData = {
                        customer_first_name: formData.get('first_name'),
                        customer_last_name: formData.get('last_name'),
                        customer_email: formData.get('email'),
                        customer_phone: formData.get('phone'),
                        customer_address: formData.get('address'),
                        payment_method: formData.get('payment_method'),
                        shipping: shipping,
                        items: cartItems.map(item => ({
                            id: typeof item.id === 'string' ? parseInt(item.id.replace(/\D/g, '')) || 0 : item.id,
                            name: item.name,
                            price: parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')),
                            quantity: item.qty
                        }))
                    };

                    // Disable submit button
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Processing...';

                    try {
                        const response = await fetch('/api/orders/create.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(orderData)
                        });

                        const result = await response.json();

                        if (result.success) {
                            showMessage(`Order #${result.order_number} placed successfully! Total: $${result.total.toFixed(2)}`, 'success');
                            form.reset();
                            window.EcommerceManager.clearCart();

                            // Scroll to message
                            messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

                            // Redirect to success page if configured
                            if (window.CMS_SETTINGS && window.CMS_SETTINGS.successUrl) {
                                setTimeout(() => {
                                    window.location.href = window.CMS_SETTINGS.successUrl;
                                }, 1500);
                            }
                        } else {
                            showMessage(result.message || 'Error placing order', 'error');
                        }
                    } catch (error) {
                        showMessage('Network error. Please try again.', 'error');
                        console.error('Checkout error:', error);
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Complete Purchase';
                    }
                });
            }

            updateView();
            window.EcommerceManager.on('cart:updated', updateView);
        };
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(CheckoutWidget);

