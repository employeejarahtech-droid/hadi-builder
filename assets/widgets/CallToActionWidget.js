/**
 * CallToActionWidget - CTA banner widget
 */
class CallToActionWidget extends WidgetBase {
    getName() { return 'call_to_action'; }
    getTitle() { return 'Call to Action'; }
    getIcon() { return 'fa fa-bullhorn'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['cta', 'call', 'action', 'banner']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Ready to Get Started?', placeholder: 'Enter title', label_block: true });
        this.addControl('description', { type: 'textarea', label: 'Description', default_value: 'Join thousands of satisfied customers today', placeholder: 'Enter description', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Get Started Now', placeholder: 'Enter button text' });
        this.addControl('button_url', { type: 'text', label: 'Button URL', default_value: '#', placeholder: 'https://example.com', label_block: true });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('background_color', { type: 'color', label: 'Background', default_value: '#3b82f6' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#ffffff' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#ffffff' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Ready to Get Started?');
        const description = this.getSetting('description', 'Join thousands of satisfied customers today');
        const buttonText = this.getSetting('button_text', 'Get Started Now');
        const buttonUrl = this.getSetting('button_url', '#');
        const backgroundColor = this.getSetting('background_color', '#3b82f6');
        const textColor = this.getSetting('text_color', '#ffffff');
        const buttonColor = this.getSetting('button_color', '#ffffff');

        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };

        const content = `
            <div style="background: ${backgroundColor}; color: ${textColor}; padding: 60px 40px; text-align: center; border-radius: 16px;">
                <h2 style="color: ${textColor}; font-size: 36px; font-weight: 700; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h2>
                <p style="color: ${textColor}; font-size: 18px; margin: 0 0 30px 0; opacity: 0.95;">${this.escapeHtml(description)}</p>
                <a href="${this.escapeHtml(buttonUrl)}" style="display: inline-block; background: ${buttonColor}; color: ${backgroundColor}; font-size: 18px; font-weight: 600; padding: 16px 40px; border-radius: 8px; text-decoration: none; transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">${this.escapeHtml(buttonText)}</a>
            </div>
        `;

        let wrapperClasses = ['call-to-action-widget'];
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

window.elementorWidgetManager.registerWidget(CallToActionWidget);
