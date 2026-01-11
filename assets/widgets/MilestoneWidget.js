/**
 * MilestoneWidget - Milestone tracker widget
 */
class MilestoneWidget extends WidgetBase {
    getName() { return 'milestone'; }
    getTitle() { return 'Milestone'; }
    getIcon() { return 'fa fa-flag-checkered'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['milestone', 'achievement', 'goal', 'target']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('icon', { type: 'text', label: 'Icon', default_value: 'fa fa-trophy', placeholder: 'e.g., fa fa-trophy' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: '1 Million Users', placeholder: 'Enter title', label_block: true });
        this.addControl('date', { type: 'text', label: 'Date', default_value: 'December 2024', placeholder: 'Enter date' });
        this.addControl('description', { type: 'textarea', label: 'Description', default_value: 'Reached our first million users milestone', placeholder: 'Enter description', label_block: true });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('icon_color', { type: 'color', label: 'Icon Color', default_value: '#fbbf24' });
        this.addControl('title_color', { type: 'color', label: 'Title Color', default_value: '#1a1a1a' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#666666' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const icon = this.getSetting('icon', 'fa fa-trophy');
        const title = this.getSetting('title', '1 Million Users');
        const date = this.getSetting('date', 'December 2024');
        const description = this.getSetting('description', 'Reached our first million users milestone');
        const iconColor = this.getSetting('icon_color', '#fbbf24');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');

        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay : { size: 0, unit: 's' };

        const content = `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;">
                <div style="display: flex; align-items: flex-start; gap: 20px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 28px;"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="color: ${iconColor}; font-size: 12px; font-weight: 600; margin-bottom: 5px;">${this.escapeHtml(date)}</div>
                        <h4 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h4>
                        <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p>
                    </div>
                </div>
            </div>
        `;

        let wrapperClasses = ['milestone-widget'];
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

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(MilestoneWidget);
