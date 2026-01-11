class GalleryWidget extends WidgetBase {
    getName() {
        return 'gallery';
    }
    getTitle() {
        return 'Gallery';
    }
    getIcon() {
        return 'fa fa-images';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['gallery', 'images', 'grid'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            default_value: '3',
            options: [{
                value: '2',
                label: '2'
            }, {
                value: '3',
                label: '3'
            }, {
                value: '4',
                label: '4'
            }]
        });
        this.addControl('gap', {
            type: 'text',
            label: 'Gap (px)',
            default_value: '10',
            placeholder: 'e.g., 10'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('border_radius', {
            type: 'text',
            label: 'Border Radius (px)',
            default_value: '8',
            placeholder: 'e.g., 8'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const columns = this.getSetting('columns', '3');
        const gap = this.getSetting('gap', '10');
        const borderRadius = this.getSetting('border_radius', '8');
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
        const images = Array.from({
            length: 6
        }, (_, i) => `<div style="background: #f3f4f6; border-radius: ${borderRadius}px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: #666;"><i class="fa fa-image" style="font-size: 32px;"></i></div>`).join('');
        const contentHtml = `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px;">${images}</div>`;
        let wrapperClasses = ['gallery-widget'];
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
window.elementorWidgetManager.registerWidget(GalleryWidget);
