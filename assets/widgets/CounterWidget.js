/**
 * CounterWidget - Animated number counter widget
 * Displays animated counting number
 */
class CounterWidget extends WidgetBase {
    getName() {
        return 'counter';
    }

    getTitle() {
        return 'Counter';
    }

    getIcon() {
        return 'fa fa-sort-numeric-up';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['counter', 'number', 'count', 'animated', 'statistic'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Counter',
            tab: 'content'
        });

        this.addControl('end_value', {
            type: 'text',
            label: 'End Value',
            default_value: '5000',
            placeholder: 'e.g., 5000'
        });

        this.addControl('prefix', {
            type: 'text',
            label: 'Prefix',
            default_value: '',
            placeholder: 'e.g., $'
        });

        this.addControl('suffix', {
            type: 'text',
            label: 'Suffix',
            default_value: '+',
            placeholder: 'e.g., +, K'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Projects Completed',
            placeholder: 'Enter title',
            label_block: true
        });

        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('number_color', {
            type: 'color',
            label: 'Number Color',
            default_value: '#3b82f6'
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#1a1a1a'
        });

        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const endValue = this.getSetting('end_value', '5000');
        const prefix = this.getSetting('prefix', '');
        const suffix = this.getSetting('suffix', '+');
        const title = this.getSetting('title', 'Projects Completed');
        const numberColor = this.getSetting('number_color', '#3b82f6');
        const titleColor = this.getSetting('title_color', '#1a1a1a');

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
            <div style="text-align: center; padding: 20px;">
                <div style="color: ${numberColor}; font-size: 48px; font-weight: 700; line-height: 1; margin-bottom: 10px;">
                    <span style="font-size: 36px;">${this.escapeHtml(prefix)}</span>${this.escapeHtml(endValue)}<span style="font-size: 36px;">${this.escapeHtml(suffix)}</span>
                </div>
                <div style="color: ${titleColor}; font-size: 16px; font-weight: 500;">${this.escapeHtml(title)}</div>
            </div>
        `;

        let wrapperClasses = ['counter-widget'];
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

window.elementorWidgetManager.registerWidget(CounterWidget);
