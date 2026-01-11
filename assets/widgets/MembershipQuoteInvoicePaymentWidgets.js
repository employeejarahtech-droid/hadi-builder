// Membership, CostCalculator, QuoteTable, Invoice, PaymentMethods widgets

class MembershipWidget extends WidgetBase {
    getName() { return 'membership'; }
    getTitle() { return 'Membership'; }
    getIcon() { return 'fa fa-id-card'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['membership', 'tier', 'level']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('tier_name', { type: 'text', label: 'Tier Name', default_value: 'Gold Member', placeholder: 'Enter tier name', label_block: true });
        this.addControl('price', { type: 'text', label: 'Price', default_value: '$199/year', placeholder: 'Enter price' });
        this.addControl('benefits', { type: 'textarea', label: 'Benefits (one per line)', default_value: 'Exclusive access\nPriority support\nMonthly webinars', placeholder: 'Enter benefits', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('tier_color', { type: 'color', label: 'Tier Color', default_value: '#fbbf24' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const tierName = this.getSetting('tier_name', 'Gold Member');
        const price = this.getSetting('price', '$199/year');
        const benefits = this.getSetting('benefits', 'Exclusive access\nPriority support\nMonthly webinars');
        const tierColor = this.getSetting('tier_color', '#fbbf24');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const benefitList = benefits.split('\n').filter(b => b.trim()).map(benefit => `<div style="margin-bottom: 10px;"><i class="fa fa-star" style="color: ${tierColor};"></i> ${this.escapeHtml(benefit)}</div>`).join('');
        const content = `<div style="border: 2px solid ${tierColor}; border-radius: 12px; padding: 25px;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;"><div style="width: 60px; height: 60px; border-radius: 50%; background: ${tierColor}; display: flex; align-items: center; justify-content: center;"><i class="fa fa-crown" style="color: white; font-size: 28px;"></i></div><div><h3 style="font-size: 22px; font-weight: 700; margin: 0;">${this.escapeHtml(tierName)}</h3><div style="color: ${tierColor}; font-size: 18px; font-weight: 600;">${this.escapeHtml(price)}</div></div></div><div style="font-size: 14px;">${benefitList}</div></div>`;
        let wrapperClasses = ['membership-widget'];
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
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class CostCalculatorWidget extends WidgetBase {
    getName() { return 'cost_calculator'; }
    getTitle() { return 'Cost Calculator'; }
    getIcon() { return 'fa fa-calculator'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['cost', 'calculator', 'price']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Estimate Your Cost', placeholder: 'Enter title', label_block: true });
        this.addControl('base_price', { type: 'text', label: 'Base Price', default_value: '100', placeholder: 'Enter base price' });
        this.addControl('description', { type: 'text', label: 'Description', default_value: 'Starting from $100', placeholder: 'Enter description', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Estimate Your Cost');
        const basePrice = this.getSetting('base_price', '100');
        const description = this.getSetting('description', 'Starting from $100');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center;"><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h3><div style="background: ${accentColor}15; padding: 20px; border-radius: 8px; margin-bottom: 15px;"><div style="font-size: 48px; font-weight: 700; color: ${accentColor};">$${this.escapeHtml(basePrice)}</div></div><p style="color: #666; font-size: 14px; margin: 0;">${this.escapeHtml(description)}</p></div>`;
        let wrapperClasses = ['cost-calculator-widget'];
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
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class QuoteTableWidget extends WidgetBase {
    getName() { return 'quote_table'; }
    getTitle() { return 'Quote Table'; }
    getIcon() { return 'fa fa-file-invoice'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['quote', 'estimate', 'proposal']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('quote_number', { type: 'text', label: 'Quote Number', default_value: 'Q-2024-001', placeholder: 'Enter quote number' });
        this.addControl('items', { type: 'textarea', label: 'Items (item, qty, price per line)', default_value: 'Web Design, 1, $2000\nDevelopment, 40, $100', placeholder: 'Enter items', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('header_color', { type: 'color', label: 'Header Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const quoteNumber = this.getSetting('quote_number', 'Q-2024-001');
        const items = this.getSetting('items', 'Web Design, 1, $2000\nDevelopment, 40, $100');
        const headerColor = this.getSetting('header_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const itemRows = items.split('\n').filter(i => i.trim()).map(item => {
            const [name, qty, price] = item.split(',').map(s => s.trim());
            return `<tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${this.escapeHtml(name || '')}</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${this.escapeHtml(qty || '')}</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${this.escapeHtml(price || '')}</td></tr>`;
        }).join('');
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: #f3f4f6; padding: 20px; border-bottom: 1px solid #e5e7eb;"><h3 style="color: ${headerColor}; font-size: 20px; font-weight: 700; margin: 0;">Quote ${this.escapeHtml(quoteNumber)}</h3></div><table style="width: 100%; border-collapse: collapse;"><thead><tr style="background: #f9fafb;"><th style="padding: 12px; text-align: left;">Item</th><th style="padding: 12px; text-align: center;">Qty</th><th style="padding: 12px; text-align: right;">Price</th></tr></thead><tbody>${itemRows}</tbody></table></div>`;
        let wrapperClasses = ['quote-table-widget'];
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
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class InvoiceWidget extends WidgetBase {
    getName() { return 'invoice'; }
    getTitle() { return 'Invoice'; }
    getIcon() { return 'fa fa-file-invoice-dollar'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['invoice', 'bill', 'payment']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('invoice_number', { type: 'text', label: 'Invoice Number', default_value: 'INV-2024-001', placeholder: 'Enter invoice number' });
        this.addControl('total', { type: 'text', label: 'Total Amount', default_value: '$1,250.00', placeholder: 'Enter total' });
        this.addControl('status', { type: 'select', label: 'Status', default_value: 'paid', options: [{ value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' }] });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const invoiceNumber = this.getSetting('invoice_number', 'INV-2024-001');
        const total = this.getSetting('total', '$1,250.00');
        const status = this.getSetting('status', 'paid');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const statusColors = { paid: '#10b981', pending: '#f59e0b', overdue: '#ef4444' };
        const statusColor = statusColors[status] || statusColors.paid;
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;"><div><h3 style="font-size: 20px; font-weight: 700; margin: 0;">Invoice</h3><div style="color: #666; font-size: 14px;">${this.escapeHtml(invoiceNumber)}</div></div><div style="background: ${statusColor}; color: white; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 12px; text-transform: uppercase;">${status}</div></div><div style="background: ${accentColor}15; padding: 20px; border-radius: 8px; text-align: center;"><div style="color: #666; font-size: 14px; margin-bottom: 5px;">Total Amount</div><div style="color: ${accentColor}; font-size: 36px; font-weight: 700;">${this.escapeHtml(total)}</div></div></div>`;
        let wrapperClasses = ['invoice-widget'];
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
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class PaymentMethodsWidget extends WidgetBase {
    getName() { return 'payment_methods'; }
    getTitle() { return 'Payment Methods'; }
    getIcon() { return 'fa fa-credit-card'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['payment', 'methods', 'cards']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'We Accept', placeholder: 'Enter title' });
        this.addControl('methods', { type: 'textarea', label: 'Methods (one per line)', default_value: 'Visa\nMastercard\nPayPal\nStripe', placeholder: 'Enter methods', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('icon_color', { type: 'color', label: 'Icon Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'We Accept');
        const methods = this.getSetting('methods', 'Visa\nMastercard\nPayPal\nStripe');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const methodIcons = methods.split('\n').filter(m => m.trim()).map(method => `<div style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;"><i class="fa fa-credit-card" style="color: ${iconColor}; font-size: 20px;"></i><span style="font-size: 14px; font-weight: 600;">${this.escapeHtml(method)}</span></div>`).join('');
        const content = `<div><h4 style="font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h4><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">${methodIcons}</div></div>`;
        let wrapperClasses = ['payment-methods-widget'];
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
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(MembershipWidget);
window.elementorWidgetManager.registerWidget(CostCalculatorWidget);
window.elementorWidgetManager.registerWidget(QuoteTableWidget);
window.elementorWidgetManager.registerWidget(InvoiceWidget);
window.elementorWidgetManager.registerWidget(PaymentMethodsWidget);
