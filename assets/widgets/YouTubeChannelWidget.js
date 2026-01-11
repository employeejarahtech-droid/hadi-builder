class YouTubeChannelWidget extends WidgetBase {
    getName() {
        return 'youtube_channel';
    }
    getTitle() {
        return 'YouTube Channel';
    }
    getIcon() {
        return 'fab fa-youtube';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['youtube', 'channel', 'embed'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('channel_name', {
            type: 'text',
            label: 'Channel Name',
            default_value: 'Channel Name',
            placeholder: 'Enter channel name',
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
        const channelName = this.getSetting('channel_name', 'Channel Name');

        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: 100%; display: flex; flex-direction: column;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;"><div style="width: 60px; height: 60px; border-radius: 50%; background: #ff0000; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px;"><i class="fab fa-youtube"></i></div><div style="flex: 1;"><div style="font-size: 18px; font-weight: 700;">${this.escapeHtml(channelName)}</div><div style="font-size: 12px; color: #666;">YouTube Channel</div></div><button style="background: #ff0000; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Subscribe</button></div><div style="flex: 1; background: #f9fafb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">YouTube Channel Embed</div></div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'youtube-channel-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(YouTubeChannelWidget);
