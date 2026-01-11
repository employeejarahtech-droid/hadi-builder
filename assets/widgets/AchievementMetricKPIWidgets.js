// Achievement, Metric, KPI, Percentage, Completion, GoalTracker, FunFact, StatisticBar, DataVisualization widgets
// Creating compact versions to save space

class AchievementWidget extends WidgetBase {
    getName() { return 'achievement'; }
    getTitle() { return 'Achievement'; }
    getIcon() { return 'fa fa-medal'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['achievement', 'badge', 'award']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('icon', { type: 'icon', label: 'Icon', default_value: 'fa fa-star', placeholder: 'e.g., fa fa-star' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Top Performer', placeholder: 'Enter title', label_block: true });
        this.addControl('description', { type: 'text', label: 'Description', default_value: 'Achieved excellence in Q4 2024', placeholder: 'Enter description', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('badge_color', { type: 'color', label: 'Badge Color', default_value: '#fbbf24' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const icon = this.getSetting('icon', 'fa fa-star');
        const title = this.getSetting('title', 'Top Performer');
        const description = this.getSetting('description', 'Achieved excellence in Q4 2024');
        const badgeColor = this.getSetting('badge_color', '#fbbf24');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="text-align: center; padding: 25px;"><div style="width: 80px; height: 80px; border-radius: 50%; background: ${badgeColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 4px 6px ${badgeColor}40;"><i class="${this.escapeHtml(icon)}" style="color: white; font-size: 36px;"></i></div><h4 style="color: ${textColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h4><p style="color: #666; font-size: 14px; margin: 0;">${this.escapeHtml(description)}</p></div>`;
        let wrapperClasses = ['achievement-widget'];
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

class MetricWidget extends WidgetBase {
    getName() { return 'metric'; }
    getTitle() { return 'Metric'; }
    getIcon() { return 'fa fa-tachometer-alt'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['metric', 'kpi', 'measurement']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('label', { type: 'text', label: 'Label', default_value: 'Revenue', placeholder: 'Enter label' });
        this.addControl('value', { type: 'text', label: 'Value', default_value: '$125K', placeholder: 'Enter value' });
        this.addControl('change', { type: 'text', label: 'Change', default_value: '+15%', placeholder: 'e.g., +15%' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('value_color', { type: 'color', label: 'Value Color', default_value: '#1a1a1a' });
        this.addControl('change_color', { type: 'color', label: 'Change Color', default_value: '#059669' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const label = this.getSetting('label', 'Revenue');
        const value = this.getSetting('value', '$125K');
        const change = this.getSetting('change', '+15%');
        const valueColor = this.getSetting('value_color', '#1a1a1a');
        const changeColor = this.getSetting('change_color', '#059669');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="padding: 20px;"><div style="color: #666; font-size: 13px; margin-bottom: 8px;">${this.escapeHtml(label)}</div><div style="display: flex; align-items: baseline; gap: 10px;"><span style="color: ${valueColor}; font-size: 32px; font-weight: 700;">${this.escapeHtml(value)}</span><span style="color: ${changeColor}; font-size: 14px; font-weight: 600;">${this.escapeHtml(change)}</span></div></div>`;
        let wrapperClasses = ['metric-widget'];
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

class KPIWidget extends WidgetBase {
    getName() { return 'kpi'; }
    getTitle() { return 'KPI'; }
    getIcon() { return 'fa fa-chart-line'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['kpi', 'dashboard', 'metric']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Monthly Sales', placeholder: 'Enter title', label_block: true });
        this.addControl('current', { type: 'text', label: 'Current Value', default_value: '85K', placeholder: 'Enter current value' });
        this.addControl('target', { type: 'text', label: 'Target', default_value: '100K', placeholder: 'Enter target' });
        this.addControl('percentage', { type: 'slider', label: 'Progress %', default_value: { size: 85, unit: '%' }, range: { min: 0, max: 100, step: 1 } });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('progress_color', { type: 'color', label: 'Progress Color', default_value: '#3b82f6' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Monthly Sales');
        const current = this.getSetting('current', '85K');
        const target = this.getSetting('target', '100K');
        const percentage = this.getSetting('percentage', { size: 85, unit: '%' });
        const progressColor = this.getSetting('progress_color', '#3b82f6');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const safePercentage = (percentage && typeof percentage === 'object' && percentage.size !== undefined) ? percentage.size : 85;
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;"><h4 style="color: ${textColor}; font-size: 14px; font-weight: 600; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h4><div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span style="color: ${textColor}; font-size: 24px; font-weight: 700;">${this.escapeHtml(current)}</span><span style="color: #666; font-size: 14px;">Target: ${this.escapeHtml(target)}</span></div><div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;"><div style="width: ${safePercentage}%; height: 100%; background: ${progressColor}; border-radius: 4px; transition: width 1s ease;"></div></div></div>`;
        let wrapperClasses = ['kpi-widget'];
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

window.elementorWidgetManager.registerWidget(AchievementWidget);
window.elementorWidgetManager.registerWidget(MetricWidget);
window.elementorWidgetManager.registerWidget(KPIWidget);
