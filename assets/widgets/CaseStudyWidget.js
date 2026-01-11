class CaseStudyWidget extends WidgetBase {
    getName() {
        return 'case_study';
    }
    getTitle() {
        return 'Case Study';
    }
    getIcon() {
        return 'fa fa-file-alt';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['case', 'study', 'project'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Case Study Title',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('client', {
            type: 'text',
            label: 'Client',
            default_value: 'Client Name',
            placeholder: 'Enter client'
        });
        this.addControl('result', {
            type: 'text',
            label: 'Result',
            default_value: '+150% Growth',
            placeholder: 'Enter result'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#10b981'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Case Study Title');
        const client = this.getSetting('client', 'Client Name');
        const result = this.getSetting('result', '+150% Growth');
        const accentColor = this.getSetting('accent_color', '#10b981');
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
        const contentHtml = `<div style="border-left: 4px solid ${accentColor}; padding: 25px; background: #f9fafb; border-radius: 8px;"><h3 style="font-size: 22px; font-weight: 700; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h3><div style="display: flex; gap: 30px; margin-bottom: 15px;"><div><div style="font-size: 12px; color: #666; margin-bottom: 5px;">CLIENT</div><div style="font-size: 16px; font-weight: 600;">${this.escapeHtml(client)}</div></div><div><div style="font-size: 12px; color: #666; margin-bottom: 5px;">RESULT</div><div style="font-size: 16px; font-weight: 600; color: ${accentColor};">${this.escapeHtml(result)}</div></div></div><a href="#" style="color: ${accentColor}; font-size: 14px; font-weight: 600; text-decoration: none;">Read Full Case Study <i class="fa fa-arrow-right"></i></a></div>`;
        let wrapperClasses = ['case-study-widget'];
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
window.elementorWidgetManager.registerWidget(CaseStudyWidget);
