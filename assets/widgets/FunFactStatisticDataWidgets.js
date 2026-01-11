// FunFact, StatisticBar, DataVisualization widgets

class FunFactWidget extends WidgetBase {
    getName() { return 'fun_fact'; }
    getTitle() { return 'Fun Fact'; }
    getIcon() { return 'fa fa-lightbulb'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['fun', 'fact', 'trivia', 'statistic']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('number', { type: 'text', label: 'Number', default_value: '99.9', placeholder: 'Enter number' });
        this.addControl('suffix', { type: 'text', label: 'Suffix', default_value: '%', placeholder: 'e.g., %, K, M' });
        this.addControl('fact', { type: 'text', label: 'Fact', default_value: 'Customer Satisfaction Rate', placeholder: 'Enter fact', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('number_color', { type: 'color', label: 'Number Color', default_value: '#fbbf24' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const number = this.getSetting('number', '99.9');
        const suffix = this.getSetting('suffix', '%');
        const fact = this.getSetting('fact', 'Customer Satisfaction Rate');
        const numberColor = this.getSetting('number_color', '#fbbf24');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="text-align: center; padding: 30px; background: linear-gradient(135deg, ${numberColor}15 0%, ${numberColor}05 100%); border-radius: 12px;"><div style="color: ${numberColor}; font-size: 56px; font-weight: 700; line-height: 1; margin-bottom: 15px;">${this.escapeHtml(number)}<span style="font-size: 36px;">${this.escapeHtml(suffix)}</span></div><div style="color: ${textColor}; font-size: 16px; font-weight: 500;">${this.escapeHtml(fact)}</div></div>`;
        let wrapperClasses = ['fun-fact-widget'];
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

class StatisticBarWidget extends WidgetBase {
    getName() { return 'statistic_bar'; }
    getTitle() { return 'Statistic Bar'; }
    getIcon() { return 'fa fa-chart-bar'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['statistic', 'bar', 'comparison', 'chart']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('stats', {
            type: 'repeater',
            label: 'Statistics',
            default_value: [
                { label: 'Product A', value: { size: 85, unit: '%' } },
                { label: 'Product B', value: { size: 65, unit: '%' } },
                { label: 'Product C', value: { size: 45, unit: '%' } }
            ],
            fields: [
                { id: 'label', type: 'text', label: 'Label', default_value: 'Item', placeholder: 'Enter label' },
                { id: 'value', type: 'slider', label: 'Value', default_value: { size: 50, unit: '%' }, range: { min: 0, max: 100, step: 1 } }
            ]
        });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('bar_color', { type: 'color', label: 'Bar Color', default_value: '#3b82f6' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const stats = this.getSetting('stats', [
            { label: 'Product A', value: { size: 85, unit: '%' } },
            { label: 'Product B', value: { size: 65, unit: '%' } },
            { label: 'Product C', value: { size: 45, unit: '%' } }
        ]);
        const barColor = this.getSetting('bar_color', '#3b82f6');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const statsArray = Array.isArray(stats) ? stats : [];
        const statBars = statsArray.map((item, index) => {
            const label = item.label || 'Item';
            const value = (item.value && typeof item.value === 'object' && item.value.size !== undefined) ? item.value.size : 50;
            return `<div style="margin-bottom: ${index < statsArray.length - 1 ? '15px' : '0'};"><div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span style="color: ${textColor}; font-size: 14px; font-weight: 500;">${this.escapeHtml(label)}</span><span style="color: ${textColor}; font-size: 14px; font-weight: 600;">${value}%</span></div><div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;"><div style="width: ${value}%; height: 100%; background: ${barColor}; border-radius: 4px; transition: width 1s ease;"></div></div></div>`;
        }).join('');
        const content = `<div>${statBars}</div>`;
        let wrapperClasses = ['statistic-bar-widget'];
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

class DataVisualizationWidget extends WidgetBase {
    getName() { return 'data_visualization'; }
    getTitle() { return 'Data Visualization'; }
    getIcon() { return 'fa fa-chart-pie'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['data', 'visualization', 'chart', 'graph']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Sales Distribution', placeholder: 'Enter title', label_block: true });
        this.addControl('data_items', {
            type: 'repeater',
            label: 'Data Items',
            default_value: [
                { label: 'Q1', value: '25', color: '#3b82f6' },
                { label: 'Q2', value: '30', color: '#10b981' },
                { label: 'Q3', value: '20', color: '#f59e0b' },
                { label: 'Q4', value: '25', color: '#ef4444' }
            ],
            fields: [
                { id: 'label', type: 'text', label: 'Label', default_value: 'Item', placeholder: 'Enter label' },
                { id: 'value', type: 'text', label: 'Value', default_value: '25', placeholder: 'Enter value' },
                { id: 'color', type: 'color', label: 'Color', default_value: '#3b82f6' }
            ]
        });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('title_color', { type: 'color', label: 'Title Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Sales Distribution');
        const dataItems = this.getSetting('data_items', [
            { label: 'Q1', value: '25', color: '#3b82f6' },
            { label: 'Q2', value: '30', color: '#10b981' },
            { label: 'Q3', value: '20', color: '#f59e0b' },
            { label: 'Q4', value: '25', color: '#ef4444' }
        ]);
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const dataArray = Array.isArray(dataItems) ? dataItems : [];
        const total = dataArray.reduce((sum, item) => sum + parseFloat(item.value || 0), 0);
        const dataLegend = dataArray.map(item => {
            const label = item.label || 'Item';
            const value = item.value || '0';
            const color = item.color || '#3b82f6';
            const percentage = total > 0 ? ((parseFloat(value) / total) * 100).toFixed(1) : 0;
            return `<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;"><div style="width: 16px; height: 16px; border-radius: 3px; background: ${color};"></div><span style="color: #666; font-size: 14px; flex: 1;">${this.escapeHtml(label)}</span><span style="color: #1a1a1a; font-size: 14px; font-weight: 600;">${percentage}%</span></div>`;
        }).join('');
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;"><h4 style="color: ${titleColor}; font-size: 16px; font-weight: 600; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h4><div>${dataLegend}</div></div>`;
        let wrapperClasses = ['data-visualization-widget'];
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

window.elementorWidgetManager.registerWidget(FunFactWidget);
window.elementorWidgetManager.registerWidget(StatisticBarWidget);
window.elementorWidgetManager.registerWidget(DataVisualizationWidget);
