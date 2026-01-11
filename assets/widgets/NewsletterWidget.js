class NewsletterWidget extends WidgetBase {
    getName() {
        return 'newsletter';
    }
    getTitle() {
        return 'Newsletter';
    }
    getIcon() {
        return 'fa fa-newspaper';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['newsletter', 'email', 'signup'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Subscribe to Newsletter',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Get updates delivered to your inbox',
            placeholder: 'Enter description',
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
        const title = this.getSetting('title', 'Subscribe to Newsletter');
        const description = this.getSetting('description', 'Get updates delivered to your inbox');
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
        const contentHtml = `<div style="background: linear-gradient(135deg, ${buttonColor} 0%, ${buttonColor}dd 100%); border-radius: 12px; padding: 30px; text-align: center; color: white;"><i class="fa fa-envelope" style="font-size: 48px; margin-bottom: 15px;"></i><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 10px 0; color: white;">${this.escapeHtml(title)}</h3><p style="font-size: 14px; margin: 0 0 20px 0; opacity: 0.9; color: white;">${this.escapeHtml(description)}</p><form style="display: flex; gap: 10px; max-width: 400px; margin: 0 auto;"><input type="email" placeholder="Enter your email" style="flex: 1; padding: 12px 15px; border: none; border-radius: 6px; font-size: 14px;"><button type="submit" style="background: white; color: ${buttonColor}; border: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Subscribe</button></form></div>`;
        let wrapperClasses = ['newsletter-widget'];
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
window.elementorWidgetManager.registerWidget(NewsletterWidget);
