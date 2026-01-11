class DisqusWidget extends WidgetBase {
    getName() { return 'disqus'; }
    getTitle() { return 'Disqus'; }
    getIcon() { return 'fab fa-discourse'; }
    getCategories() { return ['social']; }
    getKeywords() { return ['disqus', 'comments', 'discussion']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('shortname', { type: 'text', label: 'Shortname', default_value: 'my-site', placeholder: 'Enter shortname', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        // Height handled globally
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const shortname = this.getSetting('shortname', 'my-site');

        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: 100%;"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;"><div style="width: 40px; height: 40px; border-radius: 50%; background: #2e9fff; display: flex; align-items: center; justify-content: center; color: white;"><i class="fa fa-comments"></i></div><div style="flex: 1;"><div style="font-size: 16px; font-weight: 700;">Disqus Comments</div><div style="font-size: 12px; color: #666;">${this.escapeHtml(shortname)}</div></div></div><div style="background: #f9fafb; border-radius: 8px; padding: 20px; text-align: center; color: #666;">Disqus Comments Embed</div></div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'disqus-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(DisqusWidget);

window.elementorWidgetManager.registerWidget(DisqusWidget);
