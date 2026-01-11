/**
 * ServiceBoxWidget - Service card widget
 * Displays service with icon, title, description, and call-to-action
 */
class ServiceBoxWidget extends WidgetBase {
    getName() {
        return 'service_box';
    }

    getTitle() {
        return 'Service Box';
    }

    getIcon() {
        return 'fa fa-briefcase';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['service', 'box', 'card', 'feature', 'offering'];
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
            default_value: 'fa fa-cog',
            placeholder: 'e.g., fa fa-cog',
            description: 'FontAwesome icon class'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Web Development',
            placeholder: 'Enter service title',
            label_block: true
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Professional web development services tailored to your business needs.',
            placeholder: 'Enter service description',
            label_block: true
        });

        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Learn More',
            placeholder: 'e.g., Learn More'
        });

        this.addControl('button_url', {
            type: 'text',
            label: 'Button URL',
            default_value: '#',
            placeholder: 'https://example.com',
            label_block: true
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('card_style', {
            type: 'select',
            label: 'Card Style',
            default_value: 'modern',
            options: [
                { value: 'modern', label: 'Modern' },
                { value: 'classic', label: 'Classic' },
                { value: 'minimal', label: 'Minimal' }
            ]
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#ffffff'
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
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

        this.addControl('button_color', {
            type: 'color',
            label: 'Button Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const icon = this.getSetting('icon', 'fa fa-cog');
        const title = this.getSetting('title', 'Web Development');
        const description = this.getSetting('description', 'Professional web development services tailored to your business needs.');
        const buttonText = this.getSetting('button_text', 'Learn More');
        const buttonUrl = this.getSetting('button_url', '#');
        const cardStyle = this.getSetting('card_style', 'modern');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');
        const buttonColor = this.getSetting('button_color', '#3b82f6');

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

        if (cardStyle === 'modern') {
            content = `
                <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 16px; padding: 35px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1)'; this.querySelector('.service-icon').style.transform='scale(1.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.05)'; this.querySelector('.service-icon').style.transform='scale(1)'">
                    <div class="service-icon" style="width: 80px; height: 80px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; transition: transform 0.3s;">
                        <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 36px;"></i>
                    </div>
                    <h3 style="color: ${titleColor}; font-size: 22px; font-weight: 700; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h3>
                    <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">${this.escapeHtml(description)}</p>
                    <a href="${this.escapeHtml(buttonUrl)}" style="display: inline-flex; align-items: center; gap: 8px; background: ${buttonColor}; color: white; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                        ${this.escapeHtml(buttonText)}
                        <i class="fa fa-arrow-right" style="font-size: 12px;"></i>
                    </a>
                </div>
            `;
        } else if (cardStyle === 'classic') {
            content = `
                <div style="background: ${backgroundColor}; border: 2px solid ${iconColor}30; border-radius: 8px; padding: 30px; text-align: center; transition: all 0.3s;" onmouseover="this.style.borderColor='${iconColor}'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.borderColor='${iconColor}30'; this.style.boxShadow='none'">
                    <div style="width: 70px; height: 70px; border-radius: 8px; background: ${iconColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 4px 6px ${iconColor}40;">
                        <i class="${this.escapeHtml(icon)}" style="color: white; font-size: 32px;"></i>
                    </div>
                    <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">${this.escapeHtml(title)}</h3>
                    <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0 0 20px 0;">${this.escapeHtml(description)}</p>
                    <a href="${this.escapeHtml(buttonUrl)}" style="color: ${buttonColor}; font-size: 14px; font-weight: 600; text-decoration: none; border-bottom: 2px solid ${buttonColor}; padding-bottom: 2px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                        ${this.escapeHtml(buttonText)} →
                    </a>
                </div>
            `;
        } else { // minimal
            content = `
                <div style="background: ${backgroundColor}; padding: 25px; border-left: 4px solid ${iconColor}; border-radius: 4px; transition: all 0.3s;" onmouseover="this.style.paddingLeft='30px'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.paddingLeft='25px'; this.style.boxShadow='none'">
                    <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 20px;">
                        <div style="flex-shrink: 0;">
                            <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 40px;"></i>
                        </div>
                        <div style="flex: 1;">
                            <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h3>
                            <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                    <a href="${this.escapeHtml(buttonUrl)}" style="display: inline-flex; align-items: center; gap: 6px; color: ${buttonColor}; font-size: 14px; font-weight: 600; text-decoration: none; transition: gap 0.3s;" onmouseover="this.style.gap='10px'" onmouseout="this.style.gap='6px'">
                        ${this.escapeHtml(buttonText)}
                        <i class="fa fa-arrow-right" style="font-size: 12px;"></i>
                    </a>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['service-box-widget'];
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

window.elementorWidgetManager.registerWidget(ServiceBoxWidget);
