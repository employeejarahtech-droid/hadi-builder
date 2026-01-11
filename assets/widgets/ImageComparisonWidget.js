class ImageComparisonWidget extends WidgetBase {
    getName() {
        return 'image_comparison';
    }
    getTitle() {
        return 'Image Comparison';
    }
    getIcon() {
        return 'fa fa-exchange-alt';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['image', 'comparison', 'compare'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Compare Images',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('divider_color', {
            type: 'color',
            label: 'Divider Color',
            default_value: '#ffffff'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Compare Images');
        const dividerColor = this.getSetting('divider_color', '#ffffff');
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
        const contentHtml = `<div><h4 style="font-size: 18px; font-weight: 700; margin: 0 0 15px 0; text-align: center;">${this.escapeHtml(title)}</h4><div style="position: relative; border-radius: 12px; overflow: hidden;"><div style="display: grid; grid-template-columns: 1fr 1fr;"><div style="background: #f3f4f6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: #666; font-size: 32px;"><i class="fa fa-image"></i></div><div style="background: #e5e7eb; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: #666; font-size: 32px;"><i class="fa fa-image"></i></div></div><div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: ${dividerColor};"></div></div></div>`;
        let wrapperClasses = ['image-comparison-widget'];
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
window.elementorWidgetManager.registerWidget(ImageComparisonWidget);
