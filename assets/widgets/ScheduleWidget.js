class ScheduleWidget extends WidgetBase {
    getName() {
        return 'schedule';
    }
    getTitle() {
        return 'Schedule';
    }
    getIcon() {
        return 'fa fa-clipboard-list';
    }
    getCategories() {
        return ['events'];
    }
    getKeywords() {
        return ['schedule', 'agenda', 'timetable'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Schedule',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('time_color', {
            type: 'color',
            label: 'Time Color',
            default_value: '#10b981'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Schedule');
        const timeColor = this.getSetting('time_color', '#10b981');
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
        const items = [{
            time: '9:00 AM',
            title: 'Opening Keynote',
            speaker: 'John Doe'
        }, {
            time: '10:30 AM',
            title: 'Workshop Session',
            speaker: 'Jane Smith'
        }, {
            time: '12:00 PM',
            title: 'Lunch Break',
            speaker: ''
        }].map(item => `<div style="display: flex; gap: 20px; padding: 20px; border-bottom: 1px solid #e5e7eb;"><div style="width: 100px; flex-shrink: 0;"><div style="background: ${timeColor}15; color: ${timeColor}; font-size: 14px; font-weight: 700; padding: 8px 12px; border-radius: 6px; text-align: center;">${item.time}</div></div><div style="flex: 1;"><div style="font-size: 16px; font-weight: 700; margin-bottom: 3px;">${item.title}</div>${item.speaker ? `<div style="font-size: 14px; color: #666;"><i class="fa fa-user"></i> ${item.speaker}</div>` : ''}</div></div>`).join('');
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: ${timeColor}; color: white; padding: 15px;"><h3 style="font-size: 20px; font-weight: 700; margin: 0; color: white;">${this.escapeHtml(title)}</h3></div>${items}</div>`;
        let wrapperClasses = ['schedule-widget'];
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
window.elementorWidgetManager.registerWidget(ScheduleWidget);
