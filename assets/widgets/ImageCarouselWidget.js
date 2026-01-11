class ImageCarouselWidget extends WidgetBase {
    getName() {
        return 'image_carousel';
    }
    getTitle() {
        return 'Image Carousel';
    }
    getIcon() {
        return 'fa fa-images';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['carousel', 'slider', 'images'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('autoplay', {
            type: 'select',
            label: 'Autoplay',
            default_value: 'yes',
            options: [{
                value: 'yes',
                label: 'Yes'
            }, {
                value: 'no',
                label: 'No'
            }]
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
        const autoplay = this.getSetting('autoplay', 'yes');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');

        const uniqueId = `carousel-${this.id}`;
        // Use height: 100% to fill the global wrapper
        const contentHtml = `<div style="position: relative; height: 100%; background: #f3f4f6; border-radius: 12px; overflow: hidden;">
            <div id="${uniqueId}" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 48px;"><i class="fa fa-image"></i></div>
            <button onclick="alert('Previous')" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;"><i class="fa fa-chevron-left"></i></button>
            <button onclick="alert('Next')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;"><i class="fa fa-chevron-right"></i></button>
        </div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'image-carousel-widget');
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(ImageCarouselWidget);
