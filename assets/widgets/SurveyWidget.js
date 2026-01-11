class SurveyWidget extends WidgetBase {
    getName() {
        return 'survey';
    }
    getTitle() {
        return 'Survey';
    }
    getIcon() {
        return 'fa fa-poll';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['survey', 'poll', 'questionnaire'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('question', {
            type: 'text',
            label: 'Question',
            default_value: 'What is your opinion?',
            placeholder: 'Enter question',
            label_block: true
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
        const question = this.getSetting('question', 'What is your opinion?');
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
        const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(opt => `<label style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'"><input type="radio" name="survey" style="width: 18px; height: 18px; accent-color: ${accentColor};"><span style="font-size: 14px;">${opt}</span></label>`).join('');
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;"><h4 style="font-size: 18px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(question)}</h4><form><div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">${options}</div><button type="submit" style="background: ${accentColor}; color: white; border: none; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Submit Vote</button></form></div>`;
        let wrapperClasses = ['survey-widget'];
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
window.elementorWidgetManager.registerWidget(SurveyWidget);
