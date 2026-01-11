/**
 * ValuePropositionWidget - Value proposition card widget
 * Displays value proposition with icon, headline, and benefits
 */
class ValuePropositionWidget extends WidgetBase {
    getName() {
        return 'value_proposition';
    }

    getTitle() {
        return 'Value Proposition';
    }

    getIcon() {
        return 'fa fa-bullseye';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['value', 'proposition', 'benefit', 'offer', 'promise'];
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
            default_value: 'fa fa-rocket',
            placeholder: 'e.g., fa fa-rocket',
            description: 'FontAwesome icon class'
        });

        this.addControl('headline', {
            type: 'text',
            label: 'Headline',
            default_value: 'Grow Your Business Faster',
            placeholder: 'Enter value proposition headline',
            label_block: true
        });

        this.addControl('subheadline', {
            type: 'text',
            label: 'Subheadline',
            default_value: 'Everything you need to succeed',
            placeholder: 'Enter subheadline',
            label_block: true
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Our comprehensive solution helps you achieve your goals with proven strategies and expert support.',
            placeholder: 'Enter description',
            label_block: true
        });

        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Get Started',
            placeholder: 'e.g., Get Started'
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

        this.addControl('headline_color', {
            type: 'color',
            label: 'Headline Color',
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
        const icon = this.getSetting('icon', 'fa fa-rocket');
        const headline = this.getSetting('headline', 'Grow Your Business Faster');
        const subheadline = this.getSetting('subheadline', 'Everything you need to succeed');
        const description = this.getSetting('description', 'Our comprehensive solution helps you achieve your goals with proven strategies and expert support.');
        const buttonText = this.getSetting('button_text', 'Get Started');
        const buttonUrl = this.getSetting('button_url', '#');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const headlineColor = this.getSetting('headline_color', '#1a1a1a');
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

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.05)'">
                <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, ${iconColor} 0%, ${iconColor}80 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; box-shadow: 0 8px 16px ${iconColor}30;">
                    <i class="${this.escapeHtml(icon)}" style="color: white; font-size: 42px;"></i>
                </div>
                <h2 style="color: ${headlineColor}; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.3;">${this.escapeHtml(headline)}</h2>
                <p style="color: ${iconColor}; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">${this.escapeHtml(subheadline)}</p>
                <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0 0 30px 0; max-width: 500px; margin-left: auto; margin-right: auto;">${this.escapeHtml(description)}</p>
                <a href="${this.escapeHtml(buttonUrl)}" style="display: inline-flex; align-items: center; gap: 10px; background: ${buttonColor}; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: all 0.3s; box-shadow: 0 4px 6px ${buttonColor}30;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 12px ${buttonColor}40'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px ${buttonColor}30'">
                    ${this.escapeHtml(buttonText)}
                    <i class="fa fa-arrow-right" style="font-size: 14px;"></i>
                </a>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['value-proposition-widget'];
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

window.elementorWidgetManager.registerWidget(ValuePropositionWidget);
