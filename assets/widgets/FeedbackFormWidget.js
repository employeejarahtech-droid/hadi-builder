class FeedbackFormWidget extends WidgetBase {
    getName() {
        return 'feedback_form';
    }
    getTitle() {
        return 'Feedback Form';
    }
    getIcon() {
        return 'fa fa-comment-dots';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['feedback', 'form', 'review'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Share Your Feedback',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('button_color', {
            type: 'color',
            label: 'Button Color',
            default_value: '#f59e0b'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Share Your Feedback');
        const buttonColor = this.getSetting('button_color', '#f59e0b');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px;"><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3><form><div style="margin-bottom: 15px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">How would you rate us?</label><div style="display: flex; gap: 10px;">${[1, 2, 3, 4, 5].map(i => `<button type="button" style="width: 40px; height: 40px; border: 1px solid #e5e7eb; border-radius: 50%; background: white; cursor: pointer; font-size: 18px;" onmouseover="this.style.background='${buttonColor}'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#666'"><i class="fa fa-star"></i></button>`).join('')}</div></div><div style="margin-bottom: 15px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Your Feedback</label><textarea placeholder="Tell us what you think..." rows="4" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea></div><button type="submit" style="background: ${buttonColor}; color: white; border: none; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Submit Feedback</button></form></div>`;
        let wrapperClasses = ['feedback-form-widget'];
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
window.elementorWidgetManager.registerWidget(FeedbackFormWidget);
