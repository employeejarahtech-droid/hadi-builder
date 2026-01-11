class TikTokWidget extends WidgetBase {
    getName() {
        return 'tiktok';
    }
    getTitle() {
        return 'TikTok';
    }
    getIcon() {
        return 'fab fa-tiktok';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['tiktok', 'video', 'embed'];
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

        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: 100%; display: flex; flex-direction: column;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;"><div style="width: 50px; height: 50px; border-radius: 50%; background: #000000; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;"><i class="fab fa-tiktok"></i></div><div style="flex: 1;"><div style="font-size: 16px; font-weight: 700;">${this.escapeHtml(username)}</div><div style="font-size: 12px; color: #666;">TikTok</div></div><button style="background: #fe2c55; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Follow</button></div><div style="flex: 1; background: linear-gradient(135deg, #fe2c55 0%, #000000 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;"><i class="fab fa-tiktok"></i></div></div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'tiktok-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(TikTokWidget);
