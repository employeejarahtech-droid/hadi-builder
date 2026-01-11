/**
 * BenefitBoxWidget - Benefit highlight widget
 * Displays benefit with icon and description
 */
class BenefitBoxWidget extends WidgetBase {
    getName() {
        return 'benefit_box';
    }

    getTitle() {
        return 'Benefit Box';
    }

    getIcon() {
        return 'fa fa-gift';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['benefit', 'advantage', 'feature', 'value', 'perk'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('icon', {
            type: 'icon',
            label: 'Icon Class',
            default_value: 'fa fa-check-circle',
            placeholder: 'e.g., fa fa-check-circle',
            description: 'FontAwesome icon class'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Save Time & Money',
            placeholder: 'Enter benefit title',
            label_block: true
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Automate your workflow and reduce operational costs by up to 50%.',
            placeholder: 'Enter benefit description',
            label_block: true
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('box_style', {
            type: 'select',
            label: 'Box Style',
            default_value: 'modern',
            options: [
                { value: 'modern', label: 'Modern' },
                { value: 'outlined', label: 'Outlined' },
                { value: 'minimal', label: 'Minimal' }
            ]
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#f0fdf4'
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
        const icon = this.getSetting('icon', 'fa fa-check-circle');
        const title = this.getSetting('title', 'Save Time & Money');
        const description = this.getSetting('description', 'Automate your workflow and reduce operational costs by up to 50%.');
        const boxStyle = this.getSetting('box_style', 'modern');
        const backgroundColor = this.getSetting('background_color', '#f0fdf4');
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

        let content = '';

        if (boxStyle === 'modern') {
            content = `
                <div style="background: ${backgroundColor}; border-radius: 12px; padding: 25px; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <div style="display: flex; align-items: flex-start; gap: 15px;">
                        <div style="flex-shrink: 0;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 24px;"></i>
                            </div>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h4>
                            <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (boxStyle === 'outlined') {
            content = `
                <div style="background: white; border: 2px solid ${iconColor}; border-radius: 12px; padding: 25px; transition: all 0.3s;" onmouseover="this.style.backgroundColor='${backgroundColor}'; this.style.borderWidth='3px'" onmouseout="this.style.backgroundColor='white'; this.style.borderWidth='2px'">
                    <div style="display: flex; align-items: flex-start; gap: 15px;">
                        <div style="flex-shrink: 0;">
                            <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 32px;"></i>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h4>
                            <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                </div>
            `;
        } else { // minimal
            content = `
                <div style="padding: 20px; border-left: 4px solid ${iconColor}; transition: all 0.3s;" onmouseover="this.style.paddingLeft='25px'; this.style.backgroundColor='${backgroundColor}'" onmouseout="this.style.paddingLeft='20px'; this.style.backgroundColor='transparent'">
                    <div style="display: flex; align-items: flex-start; gap: 15px;">
                        <div style="flex-shrink: 0;">
                            <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 28px;"></i>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="color: ${titleColor}; font-size: 17px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h4>
                            <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['benefit-box-widget'];
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

window.elementorWidgetManager.registerWidget(BenefitBoxWidget);
