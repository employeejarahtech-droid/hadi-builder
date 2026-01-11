/**
 * USPWidget - Unique selling point widget
 * Displays unique selling point with icon and description
 */
class USPWidget extends WidgetBase {
    getName() {
        return 'usp';
    }

    getTitle() {
        return 'USP';
    }

    getIcon() {
        return 'fa fa-gem';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['usp', 'unique', 'selling', 'point', 'differentiator'];
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
            default_value: 'fa fa-shield-alt',
            placeholder: 'e.g., fa fa-shield-alt',
            description: 'FontAwesome icon class'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: '100% Money-Back Guarantee',
            placeholder: 'Enter USP title',
            label_block: true
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Try risk-free for 30 days. If you\'re not satisfied, get a full refund.',
            placeholder: 'Enter USP description',
            label_block: true
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('layout', {
            type: 'select',
            label: 'Layout',
            default_value: 'horizontal',
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
            ]
        });

        this.addControl('icon_style', {
            type: 'select',
            label: 'Icon Style',
            default_value: 'filled',
            options: [
                { value: 'filled', label: 'Filled Circle' },
                { value: 'outlined', label: 'Outlined Circle' },
                { value: 'plain', label: 'Plain' }
            ]
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#059669'
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#1a1a1a'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const icon = this.getSetting('icon', 'fa fa-shield-alt');
        const title = this.getSetting('title', '100% Money-Back Guarantee');
        const description = this.getSetting('description', 'Try risk-free for 30 days. If you\'re not satisfied, get a full refund.');
        const layout = this.getSetting('layout', 'horizontal');
        const iconStyle = this.getSetting('icon_style', 'filled');
        const iconColor = this.getSetting('icon_color', '#059669');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate animation values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        // Build icon HTML based on style
        let iconHtml = '';
        if (iconStyle === 'filled') {
            iconHtml = `<div style="width: 60px; height: 60px; border-radius: 50%; background: ${iconColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="${this.escapeHtml(icon)}" style="color: white; font-size: 28px;"></i></div>`;
        } else if (iconStyle === 'outlined') {
            iconHtml = `<div style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid ${iconColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 28px;"></i></div>`;
        } else { // plain
            iconHtml = `<div style="flex-shrink: 0;"><i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 36px;"></i></div>`;
        }

        let content = '';
        if (layout === 'horizontal') {
            content = `
                <div style="display: flex; align-items: center; gap: 20px;">
                    ${iconHtml}
                    <div style="flex: 1;">
                        <h4 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 6px 0;">${this.escapeHtml(title)}</h4>
                        <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p>
                    </div>
                </div>
            `;
        } else { // vertical
            content = `
                <div style="text-align: center;">
                    <div style="display: inline-block; margin-bottom: 15px;">
                        ${iconHtml}
                    </div>
                    <h4 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h4>
                    <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['usp-widget'];
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

        // Combine wrapper style
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(USPWidget);
