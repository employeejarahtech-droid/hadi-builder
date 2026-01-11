class TimelineWidget extends WidgetBase {
    getName() {
        return 'timeline';
    }
    getTitle() {
        return 'Timeline';
    }
    getIcon() {
        return 'fa fa-stream';
    }
    getCategories() {
        return ['events'];
    }
    getKeywords() {
        return ['timeline', 'history', 'events'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('layout', {
            type: 'select',
            label: 'Layout',
            default_value: 'vertical',
            options: [{
                value: 'vertical',
                label: 'Vertical'
            }, {
                value: 'horizontal',
                label: 'Horizontal'
            }]
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('line_color', {
            type: 'color',
            label: 'Line Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const layout = this.getSetting('layout', 'vertical');
        const lineColor = this.getSetting('line_color', '#3b82f6');
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
            year: '2024',
            title: 'Event 1',
            desc: 'Description'
        }, {
            year: '2023',
            title: 'Event 2',
            desc: 'Description'
        }, {
            year: '2022',
            title: 'Event 3',
            desc: 'Description'
        }];
        const contentHtml = layout === 'vertical' ? `<div style="position: relative; padding-left: 40px;"><div style="position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: ${lineColor};"></div>${items.map(item => `<div style="position: relative; margin-bottom: 30px;"><div style="position: absolute; left: -32px; width: 12px; height: 12px; border-radius: 50%; background: ${lineColor}; border: 3px solid white; box-shadow: 0 0 0 2px ${lineColor};"></div><div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;"><div style="font-size: 12px; font-weight: 600; color: ${lineColor}; margin-bottom: 5px;">${item.year}</div><div style="font-size: 16px; font-weight: 700; margin-bottom: 5px;">${item.title}</div><div style="font-size: 14px; color: #666;">${item.desc}</div></div></div>`).join('')}</div>` : `<div style="display: flex; gap: 20px; overflow-x: auto; padding: 20px 0;"><div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: ${lineColor};"></div>${items.map(item => `<div style="position: relative; min-width: 200px;"><div style="position: absolute; top: -6px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; border-radius: 50%; background: ${lineColor}; border: 3px solid white; box-shadow: 0 0 0 2px ${lineColor};"></div><div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-top: 20px;"><div style="font-size: 12px; font-weight: 600; color: ${lineColor}; margin-bottom: 5px;">${item.year}</div><div style="font-size: 16px; font-weight: 700; margin-bottom: 5px;">${item.title}</div><div style="font-size: 14px; color: #666;">${item.desc}</div></div></div>`).join('')}</div>`;
        let wrapperClasses = ['timeline-widget'];
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
window.elementorWidgetManager.registerWidget(TimelineWidget);
