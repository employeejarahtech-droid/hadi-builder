class View360Widget extends WidgetBase {
    getName() {
        return 'view_360';
    }
    getTitle() {
        return '360° View';
    }
    getIcon() {
        return 'fa fa-sync-alt';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['360', 'view', 'product'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('product_name', {
            type: 'text',
            label: 'Product Name',
            default_value: 'Product 360° View',
            placeholder: 'Enter name',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('size', {
            type: 'text',
            label: 'Size (px)',
            default_value: '400',
            placeholder: 'e.g., 400'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const productName = this.getSetting('product_name', 'Product 360° View');
        const size = this.getSetting('size', '400');
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
        const contentHtml = `<div style="text-align: center;"><div style="width: ${size}px; height: ${size}px; background: #f3f4f6; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 15px; cursor: grab; position: relative;"><i class="fa fa-cube" style="font-size: 64px; color: #666; margin-bottom: 15px;"></i><div style="font-size: 14px; color: #666; font-weight: 600;"><i class="fa fa-sync-alt"></i> Drag to rotate</div><div style="position: absolute; top: 15px; right: 15px; background: #3b82f6; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">360°</div></div><h4 style="font-size: 16px; font-weight: 700; margin: 0;">${this.escapeHtml(productName)}</h4></div>`;
        let wrapperClasses = ['view-360-widget'];
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
window.elementorWidgetManager.registerWidget(View360Widget);
