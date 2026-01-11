class LinkedInWidget extends WidgetBase {
    getName() {
        return 'linkedin';
    }
    getTitle() {
        return 'LinkedIn';
    }
    getIcon() {
        return 'fab fa-linkedin';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['linkedin', 'profile', 'embed'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('profile_url', {
            type: 'text',
            label: 'Profile URL',
            default_value: 'https://linkedin.com/in/profile',
            placeholder: 'Enter profile URL',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('card_style', {
            type: 'select',
            label: 'Card Style',
            default_value: 'compact',
            options: [{
                value: 'compact',
                label: 'Compact'
            }, {
                value: 'full',
                label: 'Full'
            }]
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const profileUrl = this.getSetting('profile_url', 'https://linkedin.com/in/profile');
        const cardStyle = this.getSetting('card_style', 'compact');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: ${cardStyle === 'full' ? '20px' : '0'};"><div style="width: 60px; height: 60px; border-radius: 8px; background: #0a66c2; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px;"><i class="fab fa-linkedin-in"></i></div><div style="flex: 1;"><div style="font-size: 16px; font-weight: 700;">Professional Profile</div><div style="font-size: 12px; color: #666;">${this.escapeHtml(profileUrl)}</div></div><button style="background: #0a66c2; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Connect</button></div>${cardStyle === 'full' ? '<div style="padding-top: 15px; border-top: 1px solid #e5e7eb;"><p style="font-size: 14px; color: #666; margin: 0;">LinkedIn profile embed content</p></div>' : ''}</div>`;
        let wrapperClasses = ['linkedin-widget'];
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
window.elementorWidgetManager.registerWidget(LinkedInWidget);
