class ProjectWidget extends WidgetBase {
    getName() {
        return 'project';
    }
    getTitle() {
        return 'Project';
    }
    getIcon() {
        return 'fa fa-project-diagram';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['project', 'showcase', 'work'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Project Name',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Project description',
            placeholder: 'Enter description',
            label_block: true
        });
        this.addControl('link_text', {
            type: 'text',
            label: 'Link Text',
            default_value: 'View Project',
            placeholder: 'Enter link text'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Project Name');
        const description = this.getSetting('description', 'Project description');
        const linkText = this.getSetting('link_text', 'View Project');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: #f3f4f6; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-image"></i></div><div style="padding: 20px;"><h3 style="font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h3><p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">${this.escapeHtml(description)}</p><a href="#" style="color: ${accentColor}; font-size: 14px; font-weight: 600; text-decoration: none;">${this.escapeHtml(linkText)} <i class="fa fa-arrow-right"></i></a></div></div>`;
        let wrapperClasses = ['project-widget'];
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
window.elementorWidgetManager.registerWidget(ProjectWidget);
