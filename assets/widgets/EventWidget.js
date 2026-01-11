class EventWidget extends WidgetBase {
    getName() {
        return 'event';
    }
    getTitle() {
        return 'Event';
    }
    getIcon() {
        return 'fa fa-calendar-alt';
    }
    getCategories() {
        return ['events'];
    }
    getKeywords() {
        return ['event', 'card', 'calendar'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Event Title',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('date', {
            type: 'text',
            label: 'Date',
            default_value: 'Dec 25, 2024',
            placeholder: 'Enter date'
        });
        this.addControl('time', {
            type: 'text',
            label: 'Time',
            default_value: '10:00 AM',
            placeholder: 'Enter time'
        });
        this.addControl('location', {
            type: 'text',
            label: 'Location',
            default_value: 'New York',
            placeholder: 'Enter location'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Event Title');
        const date = this.getSetting('date', 'Dec 25, 2024');
        const time = this.getSetting('time', '10:00 AM');
        const location = this.getSetting('location', 'New York');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: ${accentColor}; color: white; padding: 20px;"><h3 style="font-size: 22px; font-weight: 700; margin: 0; color: white;">${this.escapeHtml(title)}</h3></div><div style="padding: 20px;"><div style="display: flex; flex-direction: column; gap: 12px;"><div style="display: flex; align-items: center; gap: 10px;"><i class="fa fa-calendar" style="color: ${accentColor}; width: 20px;"></i><span style="font-size: 14px;">${this.escapeHtml(date)}</span></div><div style="display: flex; align-items: center; gap: 10px;"><i class="fa fa-clock" style="color: ${accentColor}; width: 20px;"></i><span style="font-size: 14px;">${this.escapeHtml(time)}</span></div><div style="display: flex; align-items: center; gap: 10px;"><i class="fa fa-map-marker-alt" style="color: ${accentColor}; width: 20px;"></i><span style="font-size: 14px;">${this.escapeHtml(location)}</span></div></div><button style="width: 100%; background: ${accentColor}; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 15px;">Register Now</button></div></div>`;
        let wrapperClasses = ['event-widget'];
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
window.elementorWidgetManager.registerWidget(EventWidget);
