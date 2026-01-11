class FacebookPageWidget extends WidgetBase {
    getName() {
        return 'facebook_page';
    }
    getTitle() {
        return 'Facebook Page';
    }
    getIcon() {
        return 'fab fa-facebook';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['facebook', 'page', 'embed'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('page_url', {
            type: 'text',
            label: 'Page URL',
            default_value: 'https://facebook.com/page',
            placeholder: 'Enter page URL',
            label_block: true
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
        const pageUrl = this.getSetting('page_url', 'https://facebook.com/page');

        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: 100%; display: flex; flex-direction: column;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;"><div style="width: 60px; height: 60px; border-radius: 12px; background: #1877f2; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px;"><i class="fab fa-facebook-f"></i></div><div style="flex: 1;"><div style="font-size: 18px; font-weight: 700;">Facebook Page</div><div style="font-size: 12px; color: #666;">${this.escapeHtml(pageUrl)}</div></div><button style="background: #1877f2; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;"><i class="fa fa-thumbs-up"></i> Like</button></div><div style="flex: 1; background: #f9fafb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">Facebook Page Embed</div></div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'facebook-page-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(FacebookPageWidget);
