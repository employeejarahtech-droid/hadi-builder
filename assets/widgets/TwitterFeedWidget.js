class TwitterFeedWidget extends WidgetBase {
    getName() {
        return 'twitter_feed';
    }
    getTitle() {
        return 'Twitter Feed';
    }
    getIcon() {
        return 'fab fa-twitter';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['twitter', 'feed', 'timeline'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('username', {
            type: 'text',
            label: 'Username',
            default_value: '@username',
            placeholder: 'Enter username'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        // Height handled globally
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const username = this.getSetting('username', '@username');

        const tweets = [1, 2, 3].map(i => `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 10px;"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><div style="width: 40px; height: 40px; border-radius: 50%; background: #1da1f2; display: flex; align-items: center; justify-content: center; color: white;"><i class="fab fa-twitter"></i></div><div><div style="font-size: 14px; font-weight: 600;">${this.escapeHtml(username)}</div><div style="font-size: 12px; color: #666;">@username · 2h</div></div></div><p style="font-size: 14px; color: #333; margin: 0;">Sample tweet content ${i}</p></div>`).join('');
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: 100%; overflow-y: auto;"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;"><div style="width: 50px; height: 50px; border-radius: 50%; background: #1da1f2; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;"><i class="fab fa-twitter"></i></div><div><div style="font-size: 16px; font-weight: 700;">${this.escapeHtml(username)}</div><div style="font-size: 12px; color: #666;">Twitter Timeline</div></div></div>${tweets}</div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'twitter-feed-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(TwitterFeedWidget);
