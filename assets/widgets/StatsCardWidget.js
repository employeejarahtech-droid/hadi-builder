/**
 * StatsCardWidget - Statistics card widget
 */
class StatsCardWidget extends WidgetBase {
    getName() { return 'stats_card'; }
    getTitle() { return 'Stats Card'; }
    getIcon() { return 'fa fa-chart-bar'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['stats', 'statistics', 'card', 'metric']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('icon', { type: 'icon', label: 'Icon', default_value: 'fa fa-users' });
        this.addControl('value', { type: 'text', label: 'Value', default_value: '12.5K', placeholder: 'Enter value' });
        this.addControl('label', { type: 'text', label: 'Label', default_value: 'Active Users', placeholder: 'Enter label', label_block: true });
        this.addControl('trend', { type: 'text', label: 'Trend', default_value: '+12%', placeholder: 'e.g., +12%' });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('background_color', { type: 'color', label: 'Background', default_value: '#ffffff' });
        this.addControl('icon_color', { type: 'color', label: 'Icon Color', default_value: '#3b82f6' });
        this.addControl('value_color', { type: 'color', label: 'Value Color', default_value: '#1a1a1a' });
        this.addControl('trend_color', { type: 'color', label: 'Trend Color', default_value: '#059669' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    setSettings(settings) {
        // Critical Debug: precise interception of settings update
        console.log('!!! StatsCardWidget.setSettings INTERCEPT !!!', settings);
        super.setSettings(settings);
    }

    render() {
        console.log('StatsCardWidget Rendering:', {
            id: this.id || 'unknown',
            settings: this.settings,
            iconSetting: this.getSetting('icon'),
            allControls: this.controls
        });

        const icon = this.getSetting('icon', 'fa fa-users');
        const value = this.getSetting('value', '12.5K');
        const label = this.getSetting('label', 'Active Users');
        const trend = this.getSetting('trend', '+12%');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const valueColor = this.getSetting('value_color', '#1a1a1a');
        const trendColor = this.getSetting('trend_color', '#059669');

        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay : { size: 0, unit: 's' };

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                    <div style="width: 50px; height: 50px; border-radius: 10px; background: ${iconColor}15; display: flex; align-items: center; justify-content: center;">
                        <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 24px;"></i>
                    </div>
                    <div style="background: ${trendColor}15; color: ${trendColor}; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px;">${this.escapeHtml(trend)}</div>
                </div>
                <div style="color: ${valueColor}; font-size: 32px; font-weight: 700; margin-bottom: 5px;">${this.escapeHtml(value)}</div>
                <div style="color: #666; font-size: 14px;">${this.escapeHtml(label)}</div>
            </div>
        `;

        let wrapperClasses = ['stats-card-widget'];
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

window.elementorWidgetManager.registerWidget(StatsCardWidget);
