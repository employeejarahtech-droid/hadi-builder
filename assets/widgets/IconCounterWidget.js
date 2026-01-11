/**
 * IconCounterWidget - Icon with counter widget
 * Displays icon with animated counter
 */
class IconCounterWidget extends WidgetBase {
    getName() {
        return 'icon_counter';
    }

    getTitle() {
        return 'Icon Counter';
    }

    getIcon() {
        return 'fa fa-sort-numeric-up';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['icon', 'counter', 'number', 'statistic', 'count'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('icon', {
            type: 'text',
            label: 'Icon Class',
            default_value: 'fa fa-users',
            placeholder: 'e.g., fa fa-users',
            description: 'FontAwesome icon class'
        });

        this.addControl('counter_value', {
            type: 'text',
            label: 'Counter Value',
            default_value: '1250',
            placeholder: 'e.g., 1250'
        });

        this.addControl('counter_suffix', {
            type: 'text',
            label: 'Suffix',
            default_value: '+',
            placeholder: 'e.g., +, K, M'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Happy Customers',
            placeholder: 'Enter title',
            label_block: true
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
        });

        this.addControl('counter_color', {
            type: 'color',
            label: 'Counter Color',
            default_value: '#1a1a1a'
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const icon = this.getSetting('icon', 'fa fa-users');
        const counterValue = this.getSetting('counter_value', '1250');
        const counterSuffix = this.getSetting('counter_suffix', '+');
        const title = this.getSetting('title', 'Happy Customers');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const counterColor = this.getSetting('counter_color', '#1a1a1a');
        const titleColor = this.getSetting('title_color', '#666666');

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        const content = `
            <div style="text-align: center; padding: 30px;">
                <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 48px; display: block; margin-bottom: 20px;"></i>
                <div style="color: ${counterColor}; font-size: 42px; font-weight: 700; line-height: 1; margin-bottom: 10px;">
                    ${this.escapeHtml(counterValue)}<span style="font-size: 32px;">${this.escapeHtml(counterSuffix)}</span>
                </div>
                <div style="color: ${titleColor}; font-size: 16px; font-weight: 500;">${this.escapeHtml(title)}</div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['icon-counter-widget'];
        if (cssClasses) {
            wrapperClasses.push(cssClasses);
        }
        if (animation !== 'none') {
            wrapperClasses.push('animated', animation);
        }

        // Build wrapper attributes
        let wrapperAttributes = '';
        if (cssId) {
            wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        }

        // Build animation styles
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

window.elementorWidgetManager.registerWidget(IconCounterWidget);
