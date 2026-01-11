class ParallaxImageWidget extends WidgetBase {
    getName() {
        return 'parallax_image';
    }
    getTitle() {
        return 'Parallax Image';
    }
    getIcon() {
        return 'fa fa-layer-group';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['parallax', 'image', 'scroll'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        // Height handled globally
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('overlay_opacity', {
            type: 'text',
            label: 'Overlay Opacity',
            default_value: '0.3',
            placeholder: 'e.g., 0.3'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const overlayOpacity = this.getSetting('overlay_opacity', '0.3');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');

        const contentHtml = `<div style="position: relative; height: 100%; overflow: hidden; border-radius: 12px;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-image"></i></div>
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,${overlayOpacity});"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center; z-index: 1;"><h2 style="font-size: 36px; font-weight: 700; margin: 0; color: white;">Parallax Effect</h2></div>
        </div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'parallax-image-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(ParallaxImageWidget);
