class ImageHotspotWidget extends WidgetBase {
    getName() {
        return 'image_hotspot';
    }
    getTitle() {
        return 'Image Hotspot';
    }
    getIcon() {
        return 'fa fa-map-marker-alt';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['image', 'hotspot', 'interactive'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('hotspot_text', {
            type: 'text',
            label: 'Hotspot Text',
            default_value: 'Click here',
            placeholder: 'Enter text'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('hotspot_color', {
            type: 'color',
            label: 'Hotspot Color',
            default_value: '#ef4444'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const hotspotText = this.getSetting('hotspot_text', 'Click here');
        const hotspotColor = this.getSetting('hotspot_color', '#ef4444');
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
        const contentHtml = `<div style="position: relative; border-radius: 12px; overflow: hidden;"><div style="background: #f3f4f6; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-image"></i></div><div style="position: absolute; top: 30%; left: 40%; width: 30px; height: 30px; background: ${hotspotColor}; border-radius: 50%; cursor: pointer; animation: pulse 2s infinite;" title="${this.escapeHtml(hotspotText)}"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background: white; border-radius: 50%;"></div></div></div><style>@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } }</style>`;
        let wrapperClasses = ['image-hotspot-widget'];
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
window.elementorWidgetManager.registerWidget(ImageHotspotWidget);
