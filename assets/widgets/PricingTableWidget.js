/**
 * PricingTableWidget - Pricing plan card widget
 */
class PricingTableWidget extends WidgetBase {
    getName() { return 'pricing_table'; }
    getTitle() { return 'Pricing Table'; }
    getIcon() { return 'fa fa-dollar-sign'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['pricing', 'price', 'plan', 'subscription']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('plan_name', { type: 'text', label: 'Plan Name', default_value: 'Professional', placeholder: 'Enter plan name' });
        this.addControl('price', { type: 'text', label: 'Price', default_value: '49', placeholder: 'Enter price' });
        this.addControl('currency', { type: 'text', label: 'Currency', default_value: '$', placeholder: 'e.g., $' });
        this.addControl('period', { type: 'text', label: 'Period', default_value: '/month', placeholder: 'e.g., /month' });
        this.addControl('features', { type: 'textarea', label: 'Features (one per line)', default_value: 'Unlimited projects\n50GB storage\nPriority support\nAdvanced analytics', placeholder: 'Enter features', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Get Started', placeholder: 'Enter button text' });
        this.addControl('button_url', { type: 'text', label: 'Button URL', default_value: '#', placeholder: 'https://example.com', label_block: true });
        this.addControl('featured', { type: 'select', label: 'Featured', default_value: 'no', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('background_color', { type: 'color', label: 'Background', default_value: '#ffffff' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const planName = this.getSetting('plan_name', 'Professional');
        const price = this.getSetting('price', '49');
        const currency = this.getSetting('currency', '$');
        const period = this.getSetting('period', '/month');
        const features = this.getSetting('features', 'Unlimited projects\n50GB storage\nPriority support\nAdvanced analytics');
        const buttonText = this.getSetting('button_text', 'Get Started');
        const buttonUrl = this.getSetting('button_url', '#');
        const featured = this.getSetting('featured', 'no');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const textColor = this.getSetting('text_color', '#1a1a1a');

        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };

        const featureList = features.split('\n').filter(f => f.trim()).map(feature =>
            `<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;"><i class="fa fa-check-circle" style="color: ${accentColor}; font-size: 16px;"></i><span style="color: ${textColor}; font-size: 14px;">${this.escapeHtml(feature)}</span></div>`
        ).join('');

        const featuredBadge = featured === 'yes' ? `<div style="background: ${accentColor}; color: white; font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 20px; position: absolute; top: -12px; right: 20px;">POPULAR</div>` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: ${featured === 'yes' ? `3px solid ${accentColor}` : '1px solid #e5e7eb'}; border-radius: 16px; padding: 35px 30px; text-align: center; position: relative; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                ${featuredBadge}
                <h3 style="color: ${textColor}; font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(planName)}</h3>
                <div style="margin-bottom: 30px;">
                    <span style="color: ${accentColor}; font-size: 48px; font-weight: 700;">${this.escapeHtml(currency)}${this.escapeHtml(price)}</span>
                    <span style="color: #666; font-size: 16px;">${this.escapeHtml(period)}</span>
                </div>
                <div style="text-align: left; margin-bottom: 30px;">${featureList}</div>
                <a href="${this.escapeHtml(buttonUrl)}" style="display: block; background: ${accentColor}; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${this.escapeHtml(buttonText)}</a>
            </div>
        `;

        let wrapperClasses = ['pricing-table-widget'];
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(PricingTableWidget);
