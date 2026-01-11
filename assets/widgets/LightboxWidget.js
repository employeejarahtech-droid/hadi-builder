class LightboxWidget extends WidgetBase {
    getName() {
        return 'lightbox';
    }
    getTitle() {
        return 'Lightbox';
    }
    getIcon() {
        return 'fa fa-expand';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['lightbox', 'viewer', 'popup'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('thumbnail_text', {
            type: 'text',
            label: 'Thumbnail Text',
            default_value: 'Click to view',
            placeholder: 'Enter text'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('thumbnail_size', {
            type: 'text',
            label: 'Thumbnail Size (px)',
            default_value: '200',
            placeholder: 'e.g., 200'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const thumbnailText = this.getSetting('thumbnail_text', 'Click to view');
        const thumbnailSize = this.getSetting('thumbnail_size', '200');
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
        const uniqueId = `lightbox-${this.id}`;
        const contentHtml = `<div><div onclick="document.getElementById('${uniqueId}').style.display='flex'" style="width: ${thumbnailSize}px; height: ${thumbnailSize}px; background: #f3f4f6; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"><i class="fa fa-search-plus" style="font-size: 32px; color: #666; margin-bottom: 10px;"></i><span style="font-size: 14px; color: #666;">${this.escapeHtml(thumbnailText)}</span></div><div id="${uniqueId}" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); align-items: center; justify-content: center; z-index: 9999;"><div style="position: relative; max-width: 90%; max-height: 90%; background: #f3f4f6; border-radius: 8px; padding: 40px;"><button onclick="document.getElementById('${uniqueId}').style.display='none'" style="position: absolute; top: 10px; right: 10px; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px;">×</button><div style="width: 600px; height: 400px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-image"></i></div></div></div></div>`;
        let wrapperClasses = ['lightbox-widget'];
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
window.elementorWidgetManager.registerWidget(LightboxWidget);
