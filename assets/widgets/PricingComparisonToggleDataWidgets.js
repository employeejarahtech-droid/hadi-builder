// Pricing Comparison, Toggle, DataTable, Feature Comparison widgets (compact format)

class PricingComparisonWidget extends WidgetBase {
    getName() { return 'pricing_comparison'; }
    getTitle() { return 'Pricing Comparison'; }
    getIcon() { return 'fa fa-columns'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['pricing', 'comparison', 'plans']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Choose Your Plan', placeholder: 'Enter title', label_block: true });
        this.addControl('plans', {
            type: 'repeater', label: 'Plans', default_value: [
                { name: 'Basic', price: '19', features: 'Feature 1\nFeature 2' },
                { name: 'Pro', price: '49', features: 'Feature 1\nFeature 2\nFeature 3' }
            ], fields: [
                { id: 'name', type: 'text', label: 'Plan Name', default_value: 'Plan' },
                { id: 'price', type: 'text', label: 'Price', default_value: '29' },
                { id: 'features', type: 'textarea', label: 'Features', default_value: 'Feature 1\nFeature 2' }
            ]
        });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Choose Your Plan');
        const plans = this.getSetting('plans', [{ name: 'Basic', price: '19', features: 'Feature 1\nFeature 2' }]);
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const plansArray = Array.isArray(plans) ? plans : [];
        const planCards = plansArray.map(plan => {
            const features = (plan.features || '').split('\n').filter(f => f.trim()).map(f => `<div style="margin-bottom: 8px;"><i class="fa fa-check" style="color: ${accentColor};"></i> ${this.escapeHtml(f)}</div>`).join('');
            return `<div style="flex: 1; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; text-align: center;"><h4 style="font-size: 20px; margin: 0 0 15px 0;">${this.escapeHtml(plan.name || 'Plan')}</h4><div style="font-size: 36px; font-weight: 700; color: ${accentColor}; margin-bottom: 20px;">$${this.escapeHtml(plan.price || '0')}</div><div style="text-align: left; font-size: 14px;">${features}</div></div>`;
        }).join('');
        const content = `<div><h3 style="text-align: center; font-size: 28px; margin: 0 0 30px 0;">${this.escapeHtml(title)}</h3><div style="display: flex; gap: 20px;">${planCards}</div></div>`;
        let wrapperClasses = ['pricing-comparison-widget'];
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

class PricingToggleWidget extends WidgetBase {
    getName() { return 'pricing_toggle'; }
    getTitle() { return 'Pricing Toggle'; }
    getIcon() { return 'fa fa-toggle-on'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['pricing', 'toggle', 'switch']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('label_monthly', { type: 'text', label: 'Monthly Label', default_value: 'Monthly', placeholder: 'Enter label' });
        this.addControl('label_yearly', { type: 'text', label: 'Yearly Label', default_value: 'Yearly', placeholder: 'Enter label' });
        this.addControl('discount_text', { type: 'text', label: 'Discount Text', default_value: 'Save 20%', placeholder: 'e.g., Save 20%' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('toggle_color', { type: 'color', label: 'Toggle Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const labelMonthly = this.getSetting('label_monthly', 'Monthly');
        const labelYearly = this.getSetting('label_yearly', 'Yearly');
        const discountText = this.getSetting('discount_text', 'Save 20%');
        const toggleColor = this.getSetting('toggle_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="display: flex; align-items: center; justify-content: center; gap: 15px; padding: 20px;"><span style="font-size: 16px; font-weight: 600;">${this.escapeHtml(labelMonthly)}</span><div style="width: 60px; height: 30px; background: ${toggleColor}; border-radius: 15px; position: relative; cursor: pointer;"><div style="width: 26px; height: 26px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.3s;"></div></div><span style="font-size: 16px; font-weight: 600;">${this.escapeHtml(labelYearly)}</span><span style="background: #10b981; color: white; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px;">${this.escapeHtml(discountText)}</span></div>`;
        let wrapperClasses = ['pricing-toggle-widget'];
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

class DataTableWidget extends WidgetBase {
    getName() { return 'data_table'; }
    getTitle() { return 'Data Table'; }
    getIcon() { return 'fa fa-table'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['table', 'data', 'grid']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('headers', { type: 'text', label: 'Headers (comma-separated)', default_value: 'Name,Email,Role', placeholder: 'e.g., Name,Email,Role', label_block: true });
        this.addControl('rows', { type: 'textarea', label: 'Rows (one per line, comma-separated)', default_value: 'John Doe,john@example.com,Admin\nJane Smith,jane@example.com,User', placeholder: 'Enter rows', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('header_color', { type: 'color', label: 'Header Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const headers = this.getSetting('headers', 'Name,Email,Role');
        const rows = this.getSetting('rows', 'John Doe,john@example.com,Admin\nJane Smith,jane@example.com,User');
        const headerColor = this.getSetting('header_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const headerCells = headers.split(',').map(h => `<th style="background: ${headerColor}; color: white; padding: 12px; text-align: left; font-weight: 600;">${this.escapeHtml(h.trim())}</th>`).join('');
        const bodyRows = rows.split('\n').filter(r => r.trim()).map((row, i) => {
            const cells = row.split(',').map(c => `<td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${this.escapeHtml(c.trim())}</td>`).join('');
            return `<tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">${cells}</tr>`;
        }).join('');
        const content = `<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
        let wrapperClasses = ['data-table-widget'];
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

class FeatureComparisonWidget extends WidgetBase {
    getName() { return 'feature_comparison'; }
    getTitle() { return 'Feature Comparison'; }
    getIcon() { return 'fa fa-th-list'; }
    getCategories() { return ['pricing']; }
    getKeywords() { return ['feature', 'comparison', 'matrix']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('features', { type: 'textarea', label: 'Features (one per line)', default_value: 'Feature A\nFeature B\nFeature C', placeholder: 'Enter features', label_block: true });
        this.addControl('plan1', { type: 'text', label: 'Plan 1 Name', default_value: 'Basic' });
        this.addControl('plan2', { type: 'text', label: 'Plan 2 Name', default_value: 'Pro' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('check_color', { type: 'color', label: 'Check Color', default_value: '#10b981' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const features = this.getSetting('features', 'Feature A\nFeature B\nFeature C');
        const plan1 = this.getSetting('plan1', 'Basic');
        const plan2 = this.getSetting('plan2', 'Pro');
        const checkColor = this.getSetting('check_color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const featureRows = features.split('\n').filter(f => f.trim()).map((f, i) => `<tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};"><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${this.escapeHtml(f)}</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;"><i class="fa fa-check" style="color: ${checkColor};"></i></td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;"><i class="fa fa-check" style="color: ${checkColor};"></i></td></tr>`).join('');
        const content = `<table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;"><thead><tr style="background: #f3f4f6;"><th style="padding: 12px; text-align: left;">Feature</th><th style="padding: 12px; text-align: center;">${this.escapeHtml(plan1)}</th><th style="padding: 12px; text-align: center;">${this.escapeHtml(plan2)}</th></tr></thead><tbody>${featureRows}</tbody></table>`;
        let wrapperClasses = ['feature-comparison-widget'];
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

window.elementorWidgetManager.registerWidget(PricingComparisonWidget);
window.elementorWidgetManager.registerWidget(PricingToggleWidget);
window.elementorWidgetManager.registerWidget(DataTableWidget);
window.elementorWidgetManager.registerWidget(FeatureComparisonWidget);
