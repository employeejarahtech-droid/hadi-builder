class QuizWidget extends WidgetBase {
    getName() {
        return 'quiz';
    }
    getTitle() {
        return 'Quiz';
    }
    getIcon() {
        return 'fa fa-question-circle';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['quiz', 'questionnaire', 'test'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Quick Quiz',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('quiz_color', {
            type: 'color',
            label: 'Quiz Color',
            default_value: '#8b5cf6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Quick Quiz');
        const quizColor = this.getSetting('quiz_color', '#8b5cf6');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;"><div style="width: 60px; height: 60px; border-radius: 50%; background: ${quizColor}; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;"><i class="fa fa-question"></i></div><div><h3 style="font-size: 22px; font-weight: 700; margin: 0;">${this.escapeHtml(title)}</h3><p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Test your knowledge</p></div></div><div style="margin-bottom: 20px;"><div style="font-size: 16px; font-weight: 600; margin-bottom: 15px;">Question 1: Sample question?</div><div style="display: flex; flex-direction: column; gap: 10px;">${['A', 'B', 'C', 'D'].map(opt => `<button style="padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; background: white; text-align: left; cursor: pointer; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.borderColor='${quizColor}'; this.style.background='${quizColor}15'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">${opt}. Answer option</button>`).join('')}</div></div><button style="background: ${quizColor}; color: white; border: none; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Submit Answer</button></div>`;
        let wrapperClasses = ['quiz-widget'];
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
window.elementorWidgetManager.registerWidget(QuizWidget);
