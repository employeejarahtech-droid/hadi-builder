class EventListWidget extends WidgetBase {
    getName() {
        return 'event_list';
    }
    getTitle() {
        return 'Event List';
    }
    getIcon() {
        return 'fa fa-list';
    }
    getCategories() {
        return ['events'];
    }
    getKeywords() {
        return ['event', 'list', 'events'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Events',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#8b5cf6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Events');
        const accentColor = this.getSetting('accent_color', '#8b5cf6');
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
        const events = [{
            title: 'Event 1',
            date: 'Dec 25',
            time: '10:00 AM'
        }, {
            title: 'Event 2',
            date: 'Dec 26',
            time: '2:00 PM'
        }, {
            title: 'Event 3',
            date: 'Dec 27',
            time: '5:00 PM'
        }].map(e => `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; display: flex; gap: 15px; align-items: center;"><div style="width: 60px; height: 60px; background: ${accentColor}; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; flex-shrink: 0;"><div style="font-size: 20px; font-weight: 700; line-height: 1;">${e.date.split(' ')[1]}</div><div style="font-size: 12px; opacity: 0.9;">${e.date.split(' ')[0]}</div></div><div style="flex: 1;"><div style="font-size: 16px; font-weight: 700; margin-bottom: 3px;">${e.title}</div><div style="font-size: 14px; color: #666;"><i class="fa fa-clock"></i> ${e.time}</div></div><button style="background: ${accentColor}15; color: ${accentColor}; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">View</button></div>`).join('');
        const contentHtml = `<div><h3 style="font-size: 22px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3><div style="display: flex; flex-direction: column; gap: 10px;">${events}</div></div>`;
        let wrapperClasses = ['event-list-widget'];
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
window.elementorWidgetManager.registerWidget(EventListWidget);
