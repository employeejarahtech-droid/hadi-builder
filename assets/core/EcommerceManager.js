/**
 * EcommerceManager - Global state management for ecommerce widgets
 * Handles cart operations and events
 */
class EcommerceManager extends EventEmitter {
    constructor() {
        super();
        this.cart = this.loadCart();
        this.currency = '$'; // Default

        // Use global setting if available, otherwise fetch
        if (window.CMS_SETTINGS && window.CMS_SETTINGS.currency) {
            this.currency = window.CMS_SETTINGS.currency;
        } else {
            this.fetchCurrency();
        }

        // Auto-save on updates
        this.on('cart:updated', () => this.saveCart());
        this.on('cart:cleared', () => this.saveCart());

        console.log('EcommerceManager initialized', this.cart);
    }

    /**
     * Fetch currency from settings
     */
    async fetchCurrency() {
        try {
            const response = await fetch('../api/get-currency.php');
            const data = await response.json();
            if (data.success && data.currency) {
                this.currency = data.currency;
                console.log('Currency loaded:', this.currency);
                this.emit('currency:updated', this.currency);
            }
        } catch (e) {
            console.error('Failed to load currency, using default ($)', e);
        }
    }

    /**
     * Load cart from localStorage
     */
    loadCart() {
        try {
            const saved = localStorage.getItem('cms_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load cart', e);
            return [];
        }
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        try {
            localStorage.setItem('cms_cart', JSON.stringify(this.cart));
        } catch (e) {
            console.error('Failed to save cart', e);
        }
    }

    /**
     * Add item to cart
     * @param {Object} product - { id, name, price, image, ... }
     * @param {number} qty - Quantity to add
     */
    addItem(product, qty = 1) {
        // Check if cart is enabled
        if (window.CMS_SETTINGS && window.CMS_SETTINGS.enable_cart === '0') {
            this.notify('Shopping cart is currently disabled.');
            return;
        }

        const existing = this.cart.find(item => item.id === product.id);

        if (existing) {
            existing.qty += qty;
        } else {
            this.cart.push({
                ...product,
                qty: qty
            });
        }

        this.emit('cart:updated', this.cart);
        this.notify(`Added ${product.name} to cart`);
    }

    /**
     * Remove item from cart
     * @param {string|number} productId 
     */
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.emit('cart:updated', this.cart);
    }

    /**
     * Update item quantity
     * @param {string|number} productId 
     * @param {number} qty 
     */
    updateQuantity(productId, qty) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.qty = Math.max(1, qty);
            this.emit('cart:updated', this.cart);
        }
    }

    /**
     * Clear cart
     */
    clearCart() {
        this.cart = [];
        this.emit('cart:cleared');
        this.emit('cart:updated', this.cart);
    }

    /**
     * Get current cart items
     */
    getCart() {
        return this.cart;
    }

    /**
     * Get cart total value
     */
    getTotal() {
        return this.cart.reduce((total, item) => {
            // Remove currency symbol and parse float
            const price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ''));
            return total + (price * item.qty);
        }, 0);
    }

    /**
     * Get cart total items count
     */
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.qty, 0);
    }

    /**
     * Parse price string directly
     */
    formatPrice(amount) {
        return this.currency + amount.toFixed(2);
    }

    /**
     * Show visible toast notification
     */
    notify(message) {
        console.log('Notification:', message);
        window.dispatchEvent(new CustomEvent('cms:notify', { detail: { message } }));

        // Create toast container if not exists
        let toastContainer = document.getElementById('cms-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'cms-toast-container';
            toastContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = 'background: #333; color: white; padding: 12px 24px; border-radius: 6px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transform: translateX(100%); transition: transform 0.3s ease-out;';
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize and export globally
window.EcommerceManager = new EcommerceManager();
