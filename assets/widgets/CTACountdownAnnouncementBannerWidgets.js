// CTABox, Countdown, AnnouncementBar, Banner widgets (compact format)

class CTABoxWidget extends WidgetBase {
    getName() { return 'cta_box'; }
    getTitle() { return 'CTA Box'; }
    getIcon() { return 'fa fa-square'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['cta', 'box', 'content']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('icon', { type: 'icon', label: 'Icon', default_value: 'fa fa-rocket', placeholder: 'e.g., fa fa-rocket' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Boost Your Business', placeholder: 'Enter title', label_block: true });
        this.addControl('description', { type: 'textarea', label: 'Description', default_value: 'Get started with our premium features', placeholder: 'Enter description', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Learn More', placeholder: 'Enter button text' });
        this.addControl('button_url', { type: 'text', label: 'Button URL', default_value: '#', placeholder: 'https://example.com', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const icon = this.getSetting('icon', 'fa fa-rocket');
        const title = this.getSetting('title', 'Boost Your Business');
        const description = this.getSetting('description', 'Get started with our premium features');
        const buttonText = this.getSetting('button_text', 'Learn More');
        const buttonUrl = this.getSetting('button_url', '#');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="border: 2px solid ${accentColor}; border-radius: 12px; padding: 35px; text-align: center;"><div style="width: 70px; height: 70px; border-radius: 50%; background: ${accentColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><i class="${this.escapeHtml(icon)}" style="color: white; font-size: 32px;"></i></div><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0;">${this.escapeHtml(title)}</h3><p style="color: #666; font-size: 16px; margin: 0 0 25px 0;">${this.escapeHtml(description)}</p><a href="${this.escapeHtml(buttonUrl)}" style="display: inline-block; background: ${accentColor}; color: white; font-size: 16px; font-weight: 600; padding: 12px 32px; border-radius: 8px; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${this.escapeHtml(buttonText)}</a></div>`;
        let wrapperClasses = ['cta-box-widget'];
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
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class CountdownWidget extends WidgetBase {
    getName() { return 'countdown'; }
    getTitle() { return 'Countdown'; }
    getIcon() { return 'fa fa-clock'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['countdown', 'timer', 'clock']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Limited Time Offer', placeholder: 'Enter title', label_block: true });
        this.addControl('days', { type: 'text', label: 'Days', default_value: '5', placeholder: 'Enter days' });
        this.addControl('hours', { type: 'text', label: 'Hours', default_value: '12', placeholder: 'Enter hours' });
        this.addControl('minutes', { type: 'text', label: 'Minutes', default_value: '30', placeholder: 'Enter minutes' });
        this.addControl('seconds', { type: 'text', label: 'Seconds', default_value: '45', placeholder: 'Enter seconds' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#ef4444' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Limited Time Offer');
        const days = this.getSetting('days', '5');
        const hours = this.getSetting('hours', '12');
        const minutes = this.getSetting('minutes', '30');
        const seconds = this.getSetting('seconds', '45');
        const accentColor = this.getSetting('accent_color', '#ef4444');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const timeUnit = (value, label) => `<div style="text-align: center;"><div style="background: ${accentColor}; color: white; font-size: 36px; font-weight: 700; padding: 20px; border-radius: 8px; min-width: 80px;">${this.escapeHtml(value)}</div><div style="color: #666; font-size: 14px; margin-top: 8px; font-weight: 600;">${label}</div></div>`;
        const content = `<div style="text-align: center;"><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 25px 0;">${this.escapeHtml(title)}</h3><div style="display: flex; gap: 15px; justify-content: center;">${timeUnit(days, 'Days')}${timeUnit(hours, 'Hours')}${timeUnit(minutes, 'Minutes')}${timeUnit(seconds, 'Seconds')}</div></div>`;
        let wrapperClasses = ['countdown-widget'];
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
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class AnnouncementBarWidget extends WidgetBase {
    getName() { return 'announcement_bar'; }
    getTitle() { return 'Announcement Bar'; }
    getIcon() { return 'fa fa-info-circle'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['announcement', 'bar', 'notice']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('message', { type: 'text', label: 'Message', default_value: '🎉 Special offer: Get 20% off today!', placeholder: 'Enter message', label_block: true });
        this.addControl('link_text', { type: 'text', label: 'Link Text', default_value: 'Shop Now', placeholder: 'Enter link text' });
        this.addControl('link_url', { type: 'text', label: 'Link URL', default_value: '#', placeholder: 'https://example.com', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('background_color', { type: 'color', label: 'Background', default_value: '#1a1a1a' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#ffffff' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const message = this.getSetting('message', '🎉 Special offer: Get 20% off today!');
        const linkText = this.getSetting('link_text', 'Shop Now');
        const linkUrl = this.getSetting('link_url', '#');
        const backgroundColor = this.getSetting('background_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#ffffff');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: ${backgroundColor}; color: ${textColor}; padding: 12px 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 15px;"><span style="font-size: 14px; font-weight: 500;">${this.escapeHtml(message)}</span><a href="${this.escapeHtml(linkUrl)}" style="color: ${textColor}; font-size: 14px; font-weight: 700; text-decoration: underline;">${this.escapeHtml(linkText)}</a></div>`;
        let wrapperClasses = ['announcement-bar-widget'];
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
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class BannerWidget extends WidgetBase {
    getName() { return 'banner'; }
    getTitle() { return 'Banner'; }
    getIcon() { return 'fa fa-image'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['banner', 'marketing', 'hero']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Summer Sale', placeholder: 'Enter title', label_block: true });
        this.addControl('subtitle', { type: 'text', label: 'Subtitle', default_value: 'Up to 50% Off', placeholder: 'Enter subtitle', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Shop Now', placeholder: 'Enter button text' });
        this.addControl('button_url', { type: 'text', label: 'Button URL', default_value: '#', placeholder: 'https://example.com', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('background_color', { type: 'color', label: 'Background', default_value: '#f59e0b' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#ffffff' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Summer Sale');
        const subtitle = this.getSetting('subtitle', 'Up to 50% Off');
        const buttonText = this.getSetting('button_text', 'Shop Now');
        const buttonUrl = this.getSetting('button_url', '#');
        const backgroundColor = this.getSetting('background_color', '#f59e0b');
        const textColor = this.getSetting('text_color', '#ffffff');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}cc 100%); color: ${textColor}; padding: 80px 40px; text-align: center; border-radius: 16px;"><h1 style="color: ${textColor}; font-size: 56px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h1><p style="color: ${textColor}; font-size: 28px; margin: 0 0 35px 0; opacity: 0.95;">${this.escapeHtml(subtitle)}</p><a href="${this.escapeHtml(buttonUrl)}" style="display: inline-block; background: ${textColor}; color: ${backgroundColor}; font-size: 18px; font-weight: 600; padding: 16px 48px; border-radius: 8px; text-decoration: none; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${this.escapeHtml(buttonText)}</a></div>`;
        let wrapperClasses = ['banner-widget'];
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
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(CTABoxWidget);
window.elementorWidgetManager.registerWidget(CountdownWidget);
window.elementorWidgetManager.registerWidget(AnnouncementBarWidget);
window.elementorWidgetManager.registerWidget(BannerWidget);
