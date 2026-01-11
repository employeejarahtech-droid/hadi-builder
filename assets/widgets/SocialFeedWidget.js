class SocialFeedWidget extends WidgetBase {
    getName() {
        return 'social_feed';
    }
    getTitle() {
        return 'Social Feed';
    }
    getIcon() {
        return 'fa fa-rss';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['social', 'feed', 'aggregated'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Social Feed',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('feed_color', {
            type: 'color',
            label: 'Feed Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Social Feed');
        const feedColor = this.getSetting('feed_color', '#3b82f6');
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
        const posts = [1, 2, 3].map(i => `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 10px;"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: ${feedColor}; display: flex; align-items: center; justify-content: center; color: white;"><i class="fab fa-twitter"></i></div><div><div style="font-size: 14px; font-weight: 600;">@username</div><div style="font-size: 12px; color: #666;">2 hours ago</div></div></div><p style="font-size: 14px; color: #333; margin: 0;">Sample social media post content ${i}</p></div>`).join('');
        const contentHtml = `<div><h3 style="font-size: 20px; font-weight: 700; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h3>${posts}</div>`;
        let wrapperClasses = ['social-feed-widget'];
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
window.elementorWidgetManager.registerWidget(SocialFeedWidget);
