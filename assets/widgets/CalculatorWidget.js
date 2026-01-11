class CalculatorWidget extends WidgetBase {
    getName() {
        return 'calculator';
    }
    getTitle() {
        return 'Calculator';
    }
    getIcon() {
        return 'fa fa-calculator';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['calculator', 'compute', 'calculate'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Calculator',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('calc_color', {
            type: 'color',
            label: 'Calculator Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Calculator');
        const calcColor = this.getSetting('calc_color', '#3b82f6');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; max-width: 400px; margin: 0 auto;"><h4 style="font-size: 20px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">${this.escapeHtml(title)}</h4><div style="margin-bottom: 15px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Value 1</label><input type="number" placeholder="0" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div><div style="margin-bottom: 15px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Value 2</label><input type="number" placeholder="0" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div><button style="width: 100%; background: ${calcColor}; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 15px;">Calculate</button><div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;"><div style="font-size: 14px; color: #666; margin-bottom: 5px;">Result</div><div style="font-size: 32px; font-weight: 700; color: ${calcColor};">0</div></div></div>`;
        let wrapperClasses = ['calculator-widget'];
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
window.elementorWidgetManager.registerWidget(CalculatorWidget);
