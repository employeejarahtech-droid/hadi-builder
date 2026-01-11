class FacebookCommentsWidget extends WidgetBase {
    getName() { return 'facebook_comments'; }
    getTitle() { return 'Facebook Comments'; }
    getIcon() { return 'fa fa-comments'; }
    getCategories() { return ['social']; }
    getKeywords() { return ['facebook', 'comments', 'fb']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('url', { type: 'text', label: 'URL', default_value: 'https://example.com', placeholder: 'Enter URL', label_block: true });
        this.addControl('num_posts', { type: 'text', label: 'Number of Posts', default_value: '5', placeholder: 'e.g., 5' });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        // Height handled globally
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const url = this.getSetting('url', 'https://example.com');
        const numPosts = this.getSetting('num_posts', '5');

        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: 100%;"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;"><div style="width: 40px; height: 40px; border-radius: 50%; background: #1877f2; display: flex; align-items: center; justify-content: center; color: white;"><i class="fab fa-facebook-f"></i></div><div style="flex: 1;"><div style="font-size: 16px; font-weight: 700;">Facebook Comments</div><div style="font-size: 12px; color: #666;">${numPosts} comments</div></div></div><div style="background: #f9fafb; border-radius: 8px; padding: 20px; text-align: center; color: #666;">Facebook Comments Plugin<br><small>${this.escapeHtml(url)}</small></div></div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'facebook-comments-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(FacebookCommentsWidget);

window.elementorWidgetManager.registerWidget(FacebookCommentsWidget);
