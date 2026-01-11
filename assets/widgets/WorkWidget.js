class WorkWidget extends WidgetBase {
    getName() {
        return 'work';
    }
    getTitle() {
        return 'Work';
    }
    getIcon() {
        return 'fa fa-briefcase';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['work', 'sample', 'portfolio'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Work Sample',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('tags', {
            type: 'text',
            label: 'Tags',
            default_value: 'Design, Development',
            placeholder: 'Enter tags',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('tag_color', {
            type: 'color',
            label: 'Tag Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Work Sample');
        const tags = this.getSetting('tags', 'Design, Development');
        const tagColor = this.getSetting('tag_color', '#3b82f6');
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
        const tagElements = tags.split(',').map(tag => `<span style="background: ${tagColor}15; color: ${tagColor}; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px; margin-right: 5px;">${this.escapeHtml(tag.trim())}</span>`).join('');
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'"><div style="background: #f3f4f6; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-image"></i></div><div style="padding: 15px;"><h4 style="font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h4><div>${tagElements}</div></div></div>`;
        let wrapperClasses = ['work-widget'];
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
window.elementorWidgetManager.registerWidget(WorkWidget);
