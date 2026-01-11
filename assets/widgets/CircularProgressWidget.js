/**
 * CircularProgressWidget - Circular progress indicator widget
 */
class CircularProgressWidget extends WidgetBase {
    getName() { return 'circular_progress'; }
    getTitle() { return 'Circular Progress'; }
    getIcon() { return 'fa fa-circle-notch'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['circular', 'progress', 'circle', 'percentage']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('percentage', { type: 'slider', label: 'Percentage', default_value: { size: 75, unit: '%' }, range: { min: 0, max: 100, step: 1 } });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Completion', placeholder: 'Enter title', label_block: true });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('size', { type: 'slider', label: 'Size', default_value: { size: 150, unit: 'px' }, range: { min: 100, max: 300, step: 10 } });
        this.addControl('progress_color', { type: 'color', label: 'Progress Color', default_value: '#3b82f6' });
        this.addControl('track_color', { type: 'color', label: 'Track Color', default_value: '#e5e7eb' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const percentage = this.getSetting('percentage', { size: 75, unit: '%' });
        const title = this.getSetting('title', 'Completion');
        const size = this.getSetting('size', { size: 150, unit: 'px' });
        const progressColor = this.getSetting('progress_color', '#3b82f6');
        const trackColor = this.getSetting('track_color', '#e5e7eb');
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
        const safeSize = (size && typeof size === 'object' && size.size !== undefined && size.unit !== undefined) ? size : { size: 150, unit: 'px' };

        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (safePercentage / 100) * circumference;

        const content = `
            <div style="text-align: center;">
                <svg width="${safeSize.size}" height="${safeSize.size}" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${trackColor}" stroke-width="8"/>
                    <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${progressColor}" stroke-width="8" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 1s ease;"/>
                    <text x="50" y="50" text-anchor="middle" dy="7" fill="${textColor}" font-size="20" font-weight="700">${safePercentage}%</text>
                </svg>
                <div style="color: ${textColor}; font-size: 14px; font-weight: 500; margin-top: 10px;">${this.escapeHtml(title)}</div>
            </div>
        `;

        let wrapperClasses = ['circular-progress-widget'];
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

window.elementorWidgetManager.registerWidget(CircularProgressWidget);
