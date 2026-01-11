// ProductTable, ScheduleTable, PriceList, Package, Subscription widgets

class ProductTableWidget extends WidgetBase {
    getName() { return 'product_table'; }
    getTitle() { return 'Product Table'; }
    getIcon() { return 'fa fa-box'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['product', 'table', 'specs']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('product_name', { type: 'text', label: 'Product Name', default_value: 'Premium Widget', placeholder: 'Enter product name', label_block: true });
        this.addControl('specs', { type: 'textarea', label: 'Specs (key: value per line)', default_value: 'Dimensions: 10x5x3 inches\nWeight: 2.5 lbs\nMaterial: Aluminum', placeholder: 'Enter specs', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('header_color', { type: 'color', label: 'Header Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const productName = this.getSetting('product_name', 'Premium Widget');
        const specs = this.getSetting('specs', 'Dimensions: 10x5x3 inches\nWeight: 2.5 lbs\nMaterial: Aluminum');
        const headerColor = this.getSetting('header_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const specRows = specs.split('\n').filter(s => s.trim()).map((spec, i) => {
            const [key, value] = spec.split(':').map(s => s.trim());
            return `<tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};"><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${this.escapeHtml(key || '')}</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${this.escapeHtml(value || '')}</td></tr>`;
        }).join('');
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: #f3f4f6; padding: 20px; border-bottom: 1px solid #e5e7eb;"><h3 style="color: ${headerColor}; font-size: 20px; font-weight: 700; margin: 0;">${this.escapeHtml(productName)}</h3></div><table style="width: 100%; border-collapse: collapse;"><tbody>${specRows}</tbody></table></div>`;
        let wrapperClasses = ['product-table-widget'];
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

class ScheduleTableWidget extends WidgetBase {
    getName() { return 'schedule_table'; }
    getTitle() { return 'Schedule Table'; }
    getIcon() { return 'fa fa-calendar-alt'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['schedule', 'timetable', 'calendar']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Weekly Schedule', placeholder: 'Enter title', label_block: true });
        this.addControl('schedule', { type: 'textarea', label: 'Schedule (time, event per line)', default_value: '9:00 AM, Morning Meeting\n11:00 AM, Project Review\n2:00 PM, Team Standup', placeholder: 'Enter schedule', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Weekly Schedule');
        const schedule = this.getSetting('schedule', '9:00 AM, Morning Meeting\n11:00 AM, Project Review\n2:00 PM, Team Standup');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const scheduleItems = schedule.split('\n').filter(s => s.trim()).map(item => {
            const [time, event] = item.split(',').map(s => s.trim());
            return `<div style="display: flex; gap: 20px; padding: 15px; border-bottom: 1px solid #e5e7eb;"><div style="color: ${accentColor}; font-weight: 600; min-width: 100px;">${this.escapeHtml(time || '')}</div><div style="flex: 1;">${this.escapeHtml(event || '')}</div></div>`;
        }).join('');
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: ${accentColor}; color: white; padding: 15px; font-size: 18px; font-weight: 700;">${this.escapeHtml(title)}</div><div>${scheduleItems}</div></div>`;
        let wrapperClasses = ['schedule-table-widget'];
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

class PriceListWidget extends WidgetBase {
    getName() { return 'price_list'; }
    getTitle() { return 'Price List'; }
    getIcon() { return 'fa fa-list-ul'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['price', 'list', 'menu']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('items', { type: 'textarea', label: 'Items (service, price per line)', default_value: 'Haircut, $25\nColor Treatment, $75\nStyling, $40', placeholder: 'Enter items', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('price_color', { type: 'color', label: 'Price Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const items = this.getSetting('items', 'Haircut, $25\nColor Treatment, $75\nStyling, $40');
        const priceColor = this.getSetting('price_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const priceItems = items.split('\n').filter(i => i.trim()).map(item => {
            const [service, price] = item.split(',').map(s => s.trim());
            return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #e5e7eb;"><span style="font-size: 16px;">${this.escapeHtml(service || '')}</span><span style="color: ${priceColor}; font-size: 18px; font-weight: 700;">${this.escapeHtml(price || '')}</span></div>`;
        }).join('');
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">${priceItems}</div>`;
        let wrapperClasses = ['price-list-widget'];
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

class PackageWidget extends WidgetBase {
    getName() { return 'package'; }
    getTitle() { return 'Package'; }
    getIcon() { return 'fa fa-box-open'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['package', 'bundle', 'deal']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('package_name', { type: 'text', label: 'Package Name', default_value: 'Starter Bundle', placeholder: 'Enter package name', label_block: true });
        this.addControl('price', { type: 'text', label: 'Price', default_value: '$99', placeholder: 'Enter price' });
        this.addControl('savings', { type: 'text', label: 'Savings', default_value: 'Save $20', placeholder: 'e.g., Save $20' });
        this.addControl('includes', { type: 'textarea', label: 'Includes (one per line)', default_value: 'Item 1\nItem 2\nItem 3', placeholder: 'Enter items', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#10b981' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const packageName = this.getSetting('package_name', 'Starter Bundle');
        const price = this.getSetting('price', '$99');
        const savings = this.getSetting('savings', 'Save $20');
        const includes = this.getSetting('includes', 'Item 1\nItem 2\nItem 3');
        const accentColor = this.getSetting('accent_color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const itemList = includes.split('\n').filter(i => i.trim()).map(item => `<div style="margin-bottom: 8px;"><i class="fa fa-check-circle" style="color: ${accentColor};"></i> ${this.escapeHtml(item)}</div>`).join('');
        const content = `<div style="border: 2px solid ${accentColor}; border-radius: 12px; padding: 25px; position: relative;"><div style="position: absolute; top: -12px; right: 20px; background: ${accentColor}; color: white; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 12px;">${this.escapeHtml(savings)}</div><h3 style="font-size: 22px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(packageName)}</h3><div style="font-size: 36px; font-weight: 700; color: ${accentColor}; margin-bottom: 20px;">${this.escapeHtml(price)}</div><div style="font-size: 14px;">${itemList}</div></div>`;
        let wrapperClasses = ['package-widget'];
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

class SubscriptionWidget extends WidgetBase {
    getName() { return 'subscription'; }
    getTitle() { return 'Subscription'; }
    getIcon() { return 'fa fa-sync-alt'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['subscription', 'recurring', 'plan']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('plan_name', { type: 'text', label: 'Plan Name', default_value: 'Monthly Subscription', placeholder: 'Enter plan name', label_block: true });
        this.addControl('price', { type: 'text', label: 'Price', default_value: '$29', placeholder: 'Enter price' });
        this.addControl('billing_cycle', { type: 'text', label: 'Billing Cycle', default_value: 'per month', placeholder: 'e.g., per month' });
        this.addControl('trial', { type: 'text', label: 'Trial Period', default_value: '14-day free trial', placeholder: 'e.g., 14-day free trial' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#8b5cf6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const planName = this.getSetting('plan_name', 'Monthly Subscription');
        const price = this.getSetting('price', '$29');
        const billingCycle = this.getSetting('billing_cycle', 'per month');
        const trial = this.getSetting('trial', '14-day free trial');
        const accentColor = this.getSetting('accent_color', '#8b5cf6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}80 100%); color: white; border-radius: 12px; padding: 30px; text-align: center;"><div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">${this.escapeHtml(planName)}</div><div style="font-size: 48px; font-weight: 700; margin-bottom: 5px;">${this.escapeHtml(price)}</div><div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">${this.escapeHtml(billingCycle)}</div><div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; font-size: 14px; font-weight: 600;"><i class="fa fa-gift"></i> ${this.escapeHtml(trial)}</div></div>`;
        let wrapperClasses = ['subscription-widget'];
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

window.elementorWidgetManager.registerWidget(ProductTableWidget);
window.elementorWidgetManager.registerWidget(ScheduleTableWidget);
window.elementorWidgetManager.registerWidget(PriceListWidget);
window.elementorWidgetManager.registerWidget(PackageWidget);
window.elementorWidgetManager.registerWidget(SubscriptionWidget);
