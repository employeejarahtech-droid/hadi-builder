// Percentage, Completion, GoalTracker, FunFact, StatisticBar, DataVisualization widgets

class PercentageWidget extends WidgetBase {
    getName() { return 'percentage'; }
    getTitle() { return 'Percentage'; }
    getIcon() { return 'fa fa-percent'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['percentage', 'percent', 'rate']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('percentage', { type: 'slider', label: 'Percentage', default_value: { size: 95, unit: '%' }, range: { min: 0, max: 100, step: 1 } });
        this.addControl('label', { type: 'text', label: 'Label', default_value: 'Success Rate', placeholder: 'Enter label', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('number_color', { type: 'color', label: 'Number Color', default_value: '#059669' });
        this.addControl('label_color', { type: 'color', label: 'Label Color', default_value: '#666666' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const percentage = this.getSetting('percentage', { size: 95, unit: '%' });
        const label = this.getSetting('label', 'Success Rate');
        const numberColor = this.getSetting('number_color', '#059669');
        const labelColor = this.getSetting('label_color', '#666666');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const safePercentage = (percentage && typeof percentage === 'object' && percentage.size !== undefined) ? percentage.size : 95;
        const content = `<div style="text-align: center; padding: 20px;"><div style="color: ${numberColor}; font-size: 64px; font-weight: 700; line-height: 1;">${safePercentage}<span style="font-size: 40px;">%</span></div><div style="color: ${labelColor}; font-size: 16px; margin-top: 10px;">${this.escapeHtml(label)}</div></div>`;
        let wrapperClasses = ['percentage-widget'];
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

class CompletionWidget extends WidgetBase {
    getName() { return 'completion'; }
    getTitle() { return 'Completion'; }
    getIcon() { return 'fa fa-check-circle'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['completion', 'status', 'done']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Project Alpha', placeholder: 'Enter title', label_block: true });
        this.addControl('completed', { type: 'text', label: 'Completed', default_value: '8', placeholder: 'Enter completed' });
        this.addControl('total', { type: 'text', label: 'Total', default_value: '10', placeholder: 'Enter total' });
        this.addControl('status', { type: 'select', label: 'Status', default_value: 'in_progress', options: [{ value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }] });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('title_color', { type: 'color', label: 'Title Color', default_value: '#1a1a1a' });
        this.addControl('status_color', { type: 'color', label: 'Status Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Project Alpha');
        const completed = this.getSetting('completed', '8');
        const total = this.getSetting('total', '10');
        const status = this.getSetting('status', 'in_progress');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const statusColor = this.getSetting('status_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const statusText = status === 'completed' ? 'Completed' : 'In Progress';
        const statusIcon = status === 'completed' ? 'fa-check-circle' : 'fa-clock';
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"><h4 style="color: ${titleColor}; font-size: 16px; font-weight: 600; margin: 0;">${this.escapeHtml(title)}</h4><div style="background: ${statusColor}15; color: ${statusColor}; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px;"><i class="fa ${statusIcon}"></i> ${statusText}</div></div><div style="color: #666; font-size: 14px;">${this.escapeHtml(completed)} of ${this.escapeHtml(total)} tasks completed</div></div>`;
        let wrapperClasses = ['completion-widget'];
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

class GoalTrackerWidget extends WidgetBase {
    getName() { return 'goal_tracker'; }
    getTitle() { return 'Goal Tracker'; }
    getIcon() { return 'fa fa-bullseye'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['goal', 'tracker', 'target', 'objective']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('goal', { type: 'text', label: 'Goal', default_value: 'Annual Revenue Target', placeholder: 'Enter goal', label_block: true });
        this.addControl('current', { type: 'text', label: 'Current', default_value: '$850K', placeholder: 'Enter current value' });
        this.addControl('target', { type: 'text', label: 'Target', default_value: '$1M', placeholder: 'Enter target' });
        this.addControl('percentage', { type: 'slider', label: 'Progress %', default_value: { size: 85, unit: '%' }, range: { min: 0, max: 100, step: 1 } });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('progress_color', { type: 'color', label: 'Progress Color', default_value: '#059669' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const goal = this.getSetting('goal', 'Annual Revenue Target');
        const current = this.getSetting('current', '$850K');
        const target = this.getSetting('target', '$1M');
        const percentage = this.getSetting('percentage', { size: 85, unit: '%' });
        const progressColor = this.getSetting('progress_color', '#059669');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const safePercentage = (percentage && typeof percentage === 'object' && percentage.size !== undefined) ? percentage.size : 85;
        const content = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;"><h4 style="color: ${textColor}; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">${this.escapeHtml(goal)}</h4><div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span style="color: ${progressColor}; font-size: 24px; font-weight: 700;">${this.escapeHtml(current)}</span><span style="color: #666; font-size: 14px;">Goal: ${this.escapeHtml(target)}</span></div><div style="width: 100%; height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden; margin-bottom: 8px;"><div style="width: ${safePercentage}%; height: 100%; background: ${progressColor}; border-radius: 5px; transition: width 1s ease;"></div></div><div style="text-align: right; color: ${progressColor}; font-size: 14px; font-weight: 600;">${safePercentage}% Complete</div></div>`;
        let wrapperClasses = ['goal-tracker-widget'];
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

window.elementorWidgetManager.registerWidget(PercentageWidget);
window.elementorWidgetManager.registerWidget(CompletionWidget);
window.elementorWidgetManager.registerWidget(GoalTrackerWidget);
