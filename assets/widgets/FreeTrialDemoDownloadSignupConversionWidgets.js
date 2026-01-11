// FreeTrial, DemoRequest, Download, Signup, Conversion widgets

class FreeTrialWidget extends WidgetBase {
    getName() { return 'free_trial'; }
    getTitle() { return 'Free Trial'; }
    getIcon() { return 'fa fa-gift'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['free', 'trial', 'cta']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Start Your Free Trial', placeholder: 'Enter title', label_block: true });
        this.addControl('subtitle', { type: 'text', label: 'Subtitle', default_value: 'No credit card required', placeholder: 'Enter subtitle', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Start Free Trial', placeholder: 'Enter button text' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Start Your Free Trial');
        const subtitle = this.getSetting('subtitle', 'No credit card required');
        const buttonText = this.getSetting('button_text', 'Start Free Trial');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%); border: 1px solid ${accentColor}40; border-radius: 12px; padding: 40px; text-align: center;"><h3 style="font-size: 28px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h3><p style="color: #666; font-size: 16px; margin: 0 0 25px 0;">${this.escapeHtml(subtitle)}</p><button style="background: ${accentColor}; color: white; font-size: 18px; font-weight: 600; padding: 14px 40px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px ${accentColor}40;">${this.escapeHtml(buttonText)}</button></div>`;
        let wrapperClasses = ['free-trial-widget'];
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

class DemoRequestWidget extends WidgetBase {
    getName() { return 'demo_request'; }
    getTitle() { return 'Demo Request'; }
    getIcon() { return 'fa fa-play-circle'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['demo', 'request', 'cta']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Request a Demo', placeholder: 'Enter title', label_block: true });
        this.addControl('description', { type: 'text', label: 'Description', default_value: 'See how it works in action', placeholder: 'Enter description', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Schedule Demo', placeholder: 'Enter button text' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#8b5cf6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Request a Demo');
        const description = this.getSetting('description', 'See how it works in action');
        const buttonText = this.getSetting('button_text', 'Schedule Demo');
        const accentColor = this.getSetting('accent_color', '#8b5cf6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="border: 2px solid ${accentColor}; border-radius: 12px; padding: 35px;"><div style="display: flex; align-items: center; gap: 25px;"><div style="width: 80px; height: 80px; border-radius: 50%; background: ${accentColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fa fa-play" style="color: white; font-size: 32px; margin-left: 4px;"></i></div><div style="flex: 1;"><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h3><p style="color: #666; font-size: 16px; margin: 0 0 18px 0;">${this.escapeHtml(description)}</p><button style="background: ${accentColor}; color: white; font-size: 16px; font-weight: 600; padding: 12px 28px; border: none; border-radius: 8px; cursor: pointer;">${this.escapeHtml(buttonText)}</button></div></div></div>`;
        let wrapperClasses = ['demo-request-widget'];
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

class DownloadWidget extends WidgetBase {
    getName() { return 'download'; }
    getTitle() { return 'Download'; }
    getIcon() { return 'fa fa-download'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['download', 'file', 'cta']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Download Now', placeholder: 'Enter title', label_block: true });
        this.addControl('file_name', { type: 'text', label: 'File Name', default_value: 'guide.pdf', placeholder: 'e.g., guide.pdf' });
        this.addControl('file_size', { type: 'text', label: 'File Size', default_value: '2.5 MB', placeholder: 'e.g., 2.5 MB' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('download_color', { type: 'color', label: 'Download Color', default_value: '#10b981' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Download Now');
        const fileName = this.getSetting('file_name', 'guide.pdf');
        const fileSize = this.getSetting('file_size', '2.5 MB');
        const downloadColor = this.getSetting('download_color', '#10b981');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: ${downloadColor}; color: white; border-radius: 12px; padding: 30px; text-align: center;"><i class="fa fa-file-pdf" style="font-size: 48px; margin-bottom: 15px;"></i><h3 style="color: white; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h3><div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">${this.escapeHtml(fileName)} • ${this.escapeHtml(fileSize)}</div><button style="background: white; color: ${downloadColor}; font-size: 16px; font-weight: 600; padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer;"><i class="fa fa-download"></i> Download</button></div>`;
        let wrapperClasses = ['download-widget'];
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

class SignupWidget extends WidgetBase {
    getName() { return 'signup'; }
    getTitle() { return 'Signup'; }
    getIcon() { return 'fa fa-user-plus'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['signup', 'register', 'cta']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Join Us Today', placeholder: 'Enter title', label_block: true });
        this.addControl('description', { type: 'text', label: 'Description', default_value: 'Create your free account', placeholder: 'Enter description', label_block: true });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Sign Up Free', placeholder: 'Enter button text' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#06b6d4' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Join Us Today');
        const description = this.getSetting('description', 'Create your free account');
        const buttonText = this.getSetting('button_text', 'Sign Up Free');
        const accentColor = this.getSetting('accent_color', '#06b6d4');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 35px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"><div style="width: 70px; height: 70px; border-radius: 50%; background: ${accentColor}15; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><i class="fa fa-user-plus" style="color: ${accentColor}; font-size: 32px;"></i></div><h3 style="font-size: 26px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h3><p style="color: #666; font-size: 16px; margin: 0 0 25px 0;">${this.escapeHtml(description)}</p><button style="background: ${accentColor}; color: white; font-size: 16px; font-weight: 600; padding: 14px 36px; border: none; border-radius: 8px; cursor: pointer; width: 100%;">${this.escapeHtml(buttonText)}</button></div>`;
        let wrapperClasses = ['signup-widget'];
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

class ConversionWidget extends WidgetBase {
    getName() { return 'conversion'; }
    getTitle() { return 'Conversion'; }
    getIcon() { return 'fa fa-chart-line'; }
    getCategories() { return ['cta']; }
    getKeywords() { return ['conversion', 'cta', 'action']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('headline', { type: 'text', label: 'Headline', default_value: 'Ready to Transform Your Business?', placeholder: 'Enter headline', label_block: true });
        this.addControl('subheadline', { type: 'text', label: 'Subheadline', default_value: 'Join 10,000+ companies already growing', placeholder: 'Enter subheadline', label_block: true });
        this.addControl('primary_button', { type: 'text', label: 'Primary Button', default_value: 'Get Started', placeholder: 'Enter button text' });
        this.addControl('secondary_button', { type: 'text', label: 'Secondary Button', default_value: 'Learn More', placeholder: 'Enter button text' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('primary_color', { type: 'color', label: 'Primary Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const headline = this.getSetting('headline', 'Ready to Transform Your Business?');
        const subheadline = this.getSetting('subheadline', 'Join 10,000+ companies already growing');
        const primaryButton = this.getSetting('primary_button', 'Get Started');
        const secondaryButton = this.getSetting('secondary_button', 'Learn More');
        const primaryColor = this.getSetting('primary_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const content = `<div style="background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%); color: white; padding: 60px 40px; text-align: center; border-radius: 16px; box-shadow: 0 20px 40px ${primaryColor}30;"><h2 style="color: white; font-size: 40px; font-weight: 700; margin: 0 0 12px 0;">${this.escapeHtml(headline)}</h2><p style="color: white; font-size: 18px; margin: 0 0 35px 0; opacity: 0.95;">${this.escapeHtml(subheadline)}</p><div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"><button style="background: white; color: ${primaryColor}; font-size: 18px; font-weight: 600; padding: 16px 40px; border: none; border-radius: 8px; cursor: pointer;">${this.escapeHtml(primaryButton)}</button><button style="background: transparent; color: white; font-size: 18px; font-weight: 600; padding: 16px 40px; border: 2px solid white; border-radius: 8px; cursor: pointer;">${this.escapeHtml(secondaryButton)}</button></div></div>`;
        let wrapperClasses = ['conversion-widget'];
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

window.elementorWidgetManager.registerWidget(FreeTrialWidget);
window.elementorWidgetManager.registerWidget(DemoRequestWidget);
window.elementorWidgetManager.registerWidget(DownloadWidget);
window.elementorWidgetManager.registerWidget(SignupWidget);
window.elementorWidgetManager.registerWidget(ConversionWidget);
