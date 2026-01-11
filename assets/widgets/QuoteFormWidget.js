class QuoteFormWidget extends WidgetBase {
    getName() {
        return 'quote_form';
    }
    getTitle() {
        return 'Quote Form';
    }
    getIcon() {
        return 'fa fa-file-invoice';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['quote', 'request', 'estimate'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Request a Quote',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('button_color', {
            type: 'color',
            label: 'Button Color',
            default_value: '#10b981'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Request a Quote');
        const buttonColor = this.getSetting('button_color', '#10b981');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px;"><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3><form><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;"><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Company</label><input type="text" placeholder="Company name" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Contact Person</label><input type="text" placeholder="Your name" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;"><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Email</label><input type="email" placeholder="your@email.com" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Service</label><select style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"><option>Web Design</option><option>Development</option><option>Marketing</option></select></div></div><div style="margin-bottom: 20px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Project Details</label><textarea placeholder="Describe your project" rows="4" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea></div><button type="submit" style="background: ${buttonColor}; color: white; border: none; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Get Quote</button></form></div>`;
        let wrapperClasses = ['quote-form-widget'];
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
window.elementorWidgetManager.registerWidget(QuoteFormWidget);
