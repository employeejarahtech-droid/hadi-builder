class BeforeAfterWidget extends WidgetBase {
    getName() {
        return 'before_after';
    }
    getTitle() {
        return 'Before/After';
    }
    getIcon() {
        return 'fa fa-sliders-h';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['before', 'after', 'slider'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('before_label', {
            type: 'text',
            label: 'Before Label',
            default_value: 'Before',
            placeholder: 'Enter label'
        });
        this.addControl('after_label', {
            type: 'text',
            label: 'After Label',
            default_value: 'After',
            placeholder: 'Enter label'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('slider_color', {
            type: 'color',
            label: 'Slider Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const beforeLabel = this.getSetting('before_label', 'Before');
        const afterLabel = this.getSetting('after_label', 'After');
        const sliderColor = this.getSetting('slider_color', '#3b82f6');
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
        const contentHtml = `<div style="position: relative; border-radius: 12px; overflow: hidden;"><div style="display: flex;"><div style="flex: 1; background: #f3f4f6; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #666;"><i class="fa fa-image" style="font-size: 32px; margin-bottom: 10px;"></i><span style="font-size: 14px; font-weight: 600;">${this.escapeHtml(beforeLabel)}</span></div><div style="flex: 1; background: #e5e7eb; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #666;"><i class="fa fa-image" style="font-size: 32px; margin-bottom: 10px;"></i><span style="font-size: 14px; font-weight: 600;">${this.escapeHtml(afterLabel)}</span></div></div><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 100%; background: ${sliderColor};"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: ${sliderColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; cursor: ew-resize;"><i class="fa fa-arrows-alt-h"></i></div></div></div>`;
        let wrapperClasses = ['before-after-widget'];
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
window.elementorWidgetManager.registerWidget(BeforeAfterWidget);
