class ContactFormWidget extends WidgetBase {
    getName() {
        return 'contact_form';
    }
    getTitle() {
        return 'Contact Form';
    }
    getIcon() {
        return 'fa fa-envelope';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['contact', 'form', 'email'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Contact Us',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Send Message',
            placeholder: 'Enter button text'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('button_color', {
            type: 'color',
            label: 'Button Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Contact Us');
        const buttonText = this.getSetting('button_text', 'Send Message');
        const buttonColor = this.getSetting('button_color', '#3b82f6');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px;"><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3><form><div style="margin-bottom: 15px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Name</label><input type="text" placeholder="Your name" style="width: 100%; padding: 10px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div><div style="margin-bottom: 15px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Email</label><input type="email" placeholder="your@email.com" style="width: 100%; padding: 10px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div><div style="margin-bottom: 20px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Message</label><textarea placeholder="Your message" rows="4" style="width: 100%; padding: 10px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea></div><button type="submit" style="background: ${buttonColor}; color: white; border: none; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">${this.escapeHtml(buttonText)}</button></form></div>`;
        let wrapperClasses = ['contact-form-widget'];
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
window.elementorWidgetManager.registerWidget(ContactFormWidget);
