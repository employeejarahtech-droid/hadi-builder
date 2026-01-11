class BackgroundVideoWidget extends WidgetBase {
    getName() {
        return 'background_video';
    }
    getTitle() {
        return 'Background Video';
    }
    getIcon() {
        return 'fa fa-video';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['background', 'video', 'media'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('video_url', {
            type: 'text',
            label: 'Video URL',
            default_value: 'https://example.com/video.mp4',
            placeholder: 'Enter video URL',
            label_block: true
        });
        this.addControl('overlay_text', {
            type: 'text',
            label: 'Overlay Text',
            default_value: 'Welcome',
            placeholder: 'Enter text',
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
        const videoUrl = this.getSetting('video_url', 'https://example.com/video.mp4');
        const overlayText = this.getSetting('overlay_text', 'Welcome');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');

        // Use height: 100% to fill the global wrapper
        const contentHtml = `<div style="position: relative; height: 100%; background: #1a1a1a; border-radius: 12px; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-play-circle"></i></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center; z-index: 1;"><h2 style="font-size: 48px; font-weight: 700; margin: 0; color: white;">${this.escapeHtml(overlayText)}</h2></div>
        </div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'background-video-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(BackgroundVideoWidget);
