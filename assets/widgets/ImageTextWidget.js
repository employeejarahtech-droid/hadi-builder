class ImageTextWidget extends WidgetBase {
    getName() {
        return 'image_text';
    }
    getTitle() {
        return 'Image Text';
    }
    getIcon() {
        return 'fa fa-image';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['image', 'text', 'overlay'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Image Title',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('subtitle', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'Image subtitle',
            placeholder: 'Enter subtitle',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('overlay_color', {
            type: 'color',
            label: 'Overlay Color',
            default_value: '#000000'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Image Title');
        const subtitle = this.getSetting('subtitle', 'Image subtitle');
        const overlayColor = this.getSetting('overlay_color', '#000000');
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
        const contentHtml = `<div style="position: relative; border-radius: 12px; overflow: hidden;"><div style="background: #f3f4f6; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-image"></i></div><div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, ${overlayColor} 0%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px; color: white;"><h3 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: white;">${this.escapeHtml(title)}</h3><p style="font-size: 16px; margin: 0; opacity: 0.9; color: white;">${this.escapeHtml(subtitle)}</p></div></div>`;
        let wrapperClasses = ['image-text-widget'];
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
window.elementorWidgetManager.registerWidget(ImageTextWidget);
