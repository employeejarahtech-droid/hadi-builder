class SearchWidget extends WidgetBase {
    getName() {
        return 'search';
    }
    getTitle() {
        return 'Search';
    }
    getIcon() {
        return 'fa fa-search';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['search', 'bar', 'find'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('placeholder', {
            type: 'text',
            label: 'Placeholder',
            default_value: 'Search...',
            placeholder: 'Enter placeholder',
            label_block: true
        });
        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Search',
            placeholder: 'Enter button text'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('search_color', {
            type: 'color',
            label: 'Search Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const placeholder = this.getSetting('placeholder', 'Search...');
        const buttonText = this.getSetting('button_text', 'Search');
        const searchColor = this.getSetting('search_color', '#3b82f6');
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
        const contentHtml = `<form style="display: flex; gap: 10px;"><div style="flex: 1; position: relative;"><input type="text" placeholder="${this.escapeHtml(placeholder)}" style="width: 100%; padding: 12px 45px 12px 15px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;"><i class="fa fa-search" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #666;"></i></div><button type="submit" style="background: ${searchColor}; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">${this.escapeHtml(buttonText)}</button></form>`;
        let wrapperClasses = ['search-widget'];
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
window.elementorWidgetManager.registerWidget(SearchWidget);
