class CalendarWidget extends WidgetBase {
    getName() {
        return 'calendar';
    }
    getTitle() {
        return 'Calendar';
    }
    getIcon() {
        return 'fa fa-calendar';
    }
    getCategories() {
        return ['events'];
    }
    getKeywords() {
        return ['calendar', 'date', 'month'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('month', {
            type: 'text',
            label: 'Month',
            default_value: 'December 2024',
            placeholder: 'Enter month',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('calendar_color', {
            type: 'color',
            label: 'Calendar Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const month = this.getSetting('month', 'December 2024');
        const calendarColor = this.getSetting('calendar_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', {
            size: 0.5,
            unit: 's'
        });
        const animationDelay = this.getSetting('animation_delay', {
            size: 0,
            unit: 's'
        });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : {
            size: 0.5,
            unit: 's'
        };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : {
            size: 0,
            unit: 's'
        };
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div style="text-align: center; font-size: 12px; font-weight: 600; color: #666; padding: 8px;">${d}</div>`).join('');
        const dates = Array.from({
            length: 35
        }, (_, i) => i < 5 ? '' : i - 4).map((d, i) => `<div style="text-align: center; padding: 10px; border-radius: 6px; cursor: pointer; ${d === 25 ? `background: ${calendarColor}; color: white; font-weight: 700;` : 'color: #333;'}" ${d && d !== 25 ? `onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'"` : ''}>${d || ''}</div>`).join('');
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: ${calendarColor}; color: white; padding: 15px; text-align: center;"><h4 style="font-size: 18px; font-weight: 700; margin: 0; color: white;">${this.escapeHtml(month)}</h4></div><div style="padding: 15px;"><div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin-bottom: 5px;">${days}</div><div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;">${dates}</div></div></div>`;
        let wrapperClasses = ['calendar-widget'];
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
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${contentHtml}</div>`;
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(CalendarWidget);
