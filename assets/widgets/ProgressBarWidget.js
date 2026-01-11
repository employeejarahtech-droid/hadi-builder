/**
 * ProgressBarWidget - Horizontal progress bar widget
 */
class ProgressBarWidget extends WidgetBase {
    getName() { return 'progress_bar'; }
    getTitle() { return 'Progress Bar'; }
    getIcon() { return 'fa fa-tasks'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['progress', 'bar', 'percentage', 'completion']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Project Progress', placeholder: 'Enter title', label_block: true });
        this.addControl('percentage', { type: 'slider', label: 'Percentage', default_value: { size: 75, unit: '%' }, range: { min: 0, max: 100, step: 1 } });
        this.addControl('show_percentage', { type: 'select', label: 'Show Percentage', default_value: 'yes', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('bar_color', { type: 'color', label: 'Bar Color', default_value: '#3b82f6' });
        this.addControl('background_color', { type: 'color', label: 'Background Color', default_value: '#e5e7eb' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Project Progress');
        const percentage = this.getSetting('percentage', { size: 75, unit: '%' });
        const showPercentage = this.getSetting('show_percentage', 'yes');
        const barColor = this.getSetting('bar_color', '#3b82f6');
        const backgroundColor = this.getSetting('background_color', '#e5e7eb');
        const textColor = this.getSetting('text_color', '#1a1a1a');

        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay : { size: 0, unit: 's' };

        const safePercentage = (percentage && typeof percentage === 'object' && percentage.size !== undefined) ? percentage.size : 75;

        const content = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: ${textColor}; font-size: 14px; font-weight: 600;">${this.escapeHtml(title)}</span>
                    ${showPercentage === 'yes' ? `<span style="color: ${textColor}; font-size: 14px; font-weight: 600;">${safePercentage}%</span>` : ''}
                </div>
                <div style="width: 100%; height: 12px; background: ${backgroundColor}; border-radius: 6px; overflow: hidden;">
                    <div style="width: ${safePercentage}%; height: 100%; background: ${barColor}; border-radius: 6px; transition: width 1s ease;"></div>
                </div>
            </div>
        `;

        let wrapperClasses = ['progress-bar-widget'];
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

window.elementorWidgetManager.registerWidget(ProgressBarWidget);
