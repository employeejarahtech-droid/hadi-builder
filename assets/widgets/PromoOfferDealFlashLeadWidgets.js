// PromoBox, Offer, Deal, FlashSale, LeadMagnet widgets

class PromoBoxWidget extends WidgetBase {
    getName() { return 'promo_box'; }
    getTitle() { return 'Promo Box'; }
    getIcon() { return 'fa fa-gift'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['promo', 'promotion', 'box']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('badge', { type: 'text', label: 'Badge', default_value: 'NEW', placeholder: 'e.g., NEW, SALE' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Exclusive Offer', placeholder: 'Enter title', label_block: true });
        this.addControl('description', { type: 'text', label: 'Description', default_value: 'Limited time only', placeholder: 'Enter description', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Claim Now', placeholder: 'Enter button text' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#8b5cf6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const badge = this.getSetting('badge', 'NEW');
        const title = this.getSetting('title', 'Exclusive Offer');
        const description = this.getSetting('description', 'Limited time only');
        const buttonText = this.getSetting('button_text', 'Claim Now');
        const accentColor = this.getSetting('accent_color', '#8b5cf6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: ${accentColor}15; border: 2px dashed ${accentColor}; border-radius: 12px; padding: 30px; text-align: center; position: relative;"><div style="position: absolute; top: -12px; left: 20px; background: ${accentColor}; color: white; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">${this.escapeHtml(badge)}</div><h3 style="color: ${accentColor}; font-size: 28px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h3><p style="color: #666; font-size: 16px; margin: 0 0 20px 0;">${this.escapeHtml(description)}</p><button style="background: ${accentColor}; color: white; font-size: 16px; font-weight: 600; padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer;">${this.escapeHtml(buttonText)}</button></div>`;
        let wrapperClasses = ['promo-box-widget'];
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

class OfferWidget extends WidgetBase {
    getName() { return 'offer'; }
    getTitle() { return 'Offer'; }
    getIcon() { return 'fa fa-tag'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['offer', 'special', 'deal']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('discount', { type: 'text', label: 'Discount', default_value: '50%', placeholder: 'e.g., 50%' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'OFF', placeholder: 'Enter title' });
        this.addControl('description', { type: 'text', label: 'Description', default_value: 'All Products', placeholder: 'Enter description', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('offer_color', { type: 'color', label: 'Offer Color', default_value: '#ef4444' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const discount = this.getSetting('discount', '50%');
        const title = this.getSetting('title', 'OFF');
        const description = this.getSetting('description', 'All Products');
        const offerColor = this.getSetting('offer_color', '#ef4444');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: ${offerColor}; color: white; padding: 40px; text-align: center; border-radius: 12px; transform: rotate(-2deg);"><div style="font-size: 64px; font-weight: 700; line-height: 1;">${this.escapeHtml(discount)}</div><div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">${this.escapeHtml(title)}</div><div style="font-size: 18px; opacity: 0.95;">${this.escapeHtml(description)}</div></div>`;
        let wrapperClasses = ['offer-widget'];
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

class DealWidget extends WidgetBase {
    getName() { return 'deal'; }
    getTitle() { return 'Deal'; }
    getIcon() { return 'fa fa-fire'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['deal', 'discount', 'sale']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Hot Deal', placeholder: 'Enter title', label_block: true });
        this.addControl('original_price', { type: 'text', label: 'Original Price', default_value: '$99', placeholder: 'e.g., $99' });
        this.addControl('sale_price', { type: 'text', label: 'Sale Price', default_value: '$49', placeholder: 'e.g., $49' });
        this.addControl('savings', { type: 'text', label: 'Savings', default_value: 'Save $50', placeholder: 'e.g., Save $50' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('deal_color', { type: 'color', label: 'Deal Color', default_value: '#f59e0b' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Hot Deal');
        const originalPrice = this.getSetting('original_price', '$99');
        const salePrice = this.getSetting('sale_price', '$49');
        const savings = this.getSetting('savings', 'Save $50');
        const dealColor = this.getSetting('deal_color', '#f59e0b');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="border: 3px solid ${dealColor}; border-radius: 12px; padding: 25px; text-align: center; position: relative;"><div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: ${dealColor}; color: white; font-size: 14px; font-weight: 700; padding: 6px 20px; border-radius: 20px;"><i class="fa fa-fire"></i> ${this.escapeHtml(title)}</div><div style="margin-top: 10px;"><span style="color: #999; font-size: 24px; text-decoration: line-through;">${this.escapeHtml(originalPrice)}</span></div><div style="color: ${dealColor}; font-size: 48px; font-weight: 700; margin: 10px 0;">${this.escapeHtml(salePrice)}</div><div style="background: ${dealColor}15; color: ${dealColor}; font-size: 14px; font-weight: 600; padding: 8px; border-radius: 6px;">${this.escapeHtml(savings)}</div></div>`;
        let wrapperClasses = ['deal-widget'];
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

class FlashSaleWidget extends WidgetBase {
    getName() { return 'flash_sale'; }
    getTitle() { return 'Flash Sale'; }
    getIcon() { return 'fa fa-bolt'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['flash', 'sale', 'timer']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Flash Sale!', placeholder: 'Enter title', label_block: true });
        this.addControl('discount', { type: 'text', label: 'Discount', default_value: '70% OFF', placeholder: 'e.g., 70% OFF' });
        this.addControl('time_left', { type: 'text', label: 'Time Left', default_value: '2:30:45', placeholder: 'e.g., 2:30:45' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('flash_color', { type: 'color', label: 'Flash Color', default_value: '#dc2626' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Flash Sale!');
        const discount = this.getSetting('discount', '70% OFF');
        const timeLeft = this.getSetting('time_left', '2:30:45');
        const flashColor = this.getSetting('flash_color', '#dc2626');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: linear-gradient(135deg, ${flashColor} 0%, ${flashColor}dd 100%); color: white; padding: 35px; text-align: center; border-radius: 12px; box-shadow: 0 8px 16px ${flashColor}40;"><div style="font-size: 14px; font-weight: 600; margin-bottom: 10px;"><i class="fa fa-bolt"></i> ${this.escapeHtml(title)}</div><div style="font-size: 56px; font-weight: 700; line-height: 1; margin-bottom: 15px;">${this.escapeHtml(discount)}</div><div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; font-size: 24px; font-weight: 700;"><i class="fa fa-clock"></i> ${this.escapeHtml(timeLeft)}</div></div>`;
        let wrapperClasses = ['flash-sale-widget'];
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

class LeadMagnetWidget extends WidgetBase {
    getName() { return 'lead_magnet'; }
    getTitle() { return 'Lead Magnet'; }
    getIcon() { return 'fa fa-magnet'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['lead', 'magnet', 'download']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Free eBook Download', placeholder: 'Enter title', label_block: true });
        this.addControl('description', { type: 'text', label: 'Description', default_value: 'Get your free guide now', placeholder: 'Enter description', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Download Free', placeholder: 'Enter button text' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#10b981' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Free eBook Download');
        const description = this.getSetting('description', 'Get your free guide now');
        const buttonText = this.getSetting('button_text', 'Download Free');
        const accentColor = this.getSetting('accent_color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: ${accentColor}10; border-left: 4px solid ${accentColor}; padding: 30px; border-radius: 8px;"><div style="display: flex; align-items: center; gap: 20px;"><div style="width: 60px; height: 60px; border-radius: 50%; background: ${accentColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fa fa-download" style="color: white; font-size: 24px;"></i></div><div style="flex: 1;"><h3 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h3><p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">${this.escapeHtml(description)}</p><button style="background: ${accentColor}; color: white; font-size: 14px; font-weight: 600; padding: 10px 24px; border: none; border-radius: 6px; cursor: pointer;">${this.escapeHtml(buttonText)}</button></div></div></div>`;
        let wrapperClasses = ['lead-magnet-widget'];
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

window.elementorWidgetManager.registerWidget(PromoBoxWidget);
window.elementorWidgetManager.registerWidget(OfferWidget);
window.elementorWidgetManager.registerWidget(DealWidget);
window.elementorWidgetManager.registerWidget(FlashSaleWidget);
window.elementorWidgetManager.registerWidget(LeadMagnetWidget);
