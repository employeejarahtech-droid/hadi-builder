/**
 * AwardWidget - Awards showcase widget
 * Displays awards, achievements, and recognitions
 */
class AwardWidget extends WidgetBase {
    getName() {
        return 'award';
    }

    getTitle() {
        return 'Award';
    }

    getIcon() {
        return 'fa fa-trophy';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['award', 'trophy', 'achievement', 'recognition', 'prize', 'medal'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Award',
            tab: 'content'
        });

        this.addControl('award_image', {
            type: 'media',
            label: 'Award Image',
            default_value: '',
            description: 'Award trophy or medal image'
        });

        this.addControl('award_title', {
            type: 'text',
            label: 'Award Title',
            default_value: 'Best Innovation Award',
            placeholder: 'Enter award title',
            label_block: true
        });

        this.addControl('award_year', {
            type: 'text',
            label: 'Year',
            default_value: '2024',
            placeholder: 'e.g., 2024'
        });

        this.addControl('organization', {
            type: 'text',
            label: 'Awarding Organization',
            default_value: 'Industry Awards',
            placeholder: 'Enter organization name',
            label_block: true
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Recognized for outstanding innovation and excellence in technology.',
            placeholder: 'Enter award description',
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

        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#fbbf24'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const awardImage = this.getSetting('award_image', '');
        const awardTitle = this.getSetting('award_title', 'Best Innovation Award');
        const awardYear = this.getSetting('award_year', '2024');
        const organization = this.getSetting('organization', 'Industry Awards');
        const description = this.getSetting('description', 'Recognized for outstanding innovation and excellence in technology.');
        const cardStyle = this.getSetting('card_style', 'modern');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');
        const accentColor = this.getSetting('accent_color', '#fbbf24');

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

        // Build award image or icon
        let imageHtml = '';
        const imageUrl = (awardImage && awardImage.url) ? awardImage.url : awardImage;

        if (imageUrl) {
            imageHtml = `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(awardTitle)}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto; border-radius: 8px;">`;
        } else {
            imageHtml = `<div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, ${accentColor} 0%, #f59e0b 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><i class="fa fa-trophy" style="color: white; font-size: 48px;"></i></div>`;
        }

        let content = '';

        if (cardStyle === 'modern') {
            content = `
                <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.05)'">
                    ${imageHtml}
                    <div style="display: inline-block; background: ${accentColor}; color: white; font-size: 14px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 15px;">${this.escapeHtml(awardYear)}</div>
                    <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(awardTitle)}</h3>
                    <div style="color: ${accentColor}; font-size: 14px; font-weight: 600; margin-bottom: 15px;">${this.escapeHtml(organization)}</div>
                    <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p>
                </div>
            `;
        } else if (cardStyle === 'classic') {
            content = `
                <div style="background: ${backgroundColor}; border: 2px solid ${accentColor}; border-radius: 8px; padding: 30px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    ${imageHtml}
                    <div style="border-top: 2px solid ${accentColor}; border-bottom: 2px solid ${accentColor}; padding: 15px 0; margin-bottom: 15px;">
                        <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 700; margin: 0;">${this.escapeHtml(awardTitle)}</h3>
                    </div>
                    <div style="color: ${accentColor}; font-size: 16px; font-weight: 700; margin-bottom: 8px;">${this.escapeHtml(awardYear)}</div>
                    <div style="color: ${textColor}; font-size: 14px; font-weight: 600; margin-bottom: 15px;">${this.escapeHtml(organization)}</div>
                    <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p>
                </div>
            `;
        } else { // minimal
            content = `
                <div style="background: ${backgroundColor}; border-left: 4px solid ${accentColor}; padding: 25px; border-radius: 4px;">
                    <div style="display: flex; align-items: flex-start; gap: 20px;">
                        <div style="flex-shrink: 0;">
                            ${imageUrl ? `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(awardTitle)}" style="width: 80px; height: 80px; object-fit: contain;">` : `<div style="width: 80px; height: 80px; border-radius: 50%; background: ${accentColor}15; display: flex; align-items: center; justify-content: center;"><i class="fa fa-trophy" style="color: ${accentColor}; font-size: 36px;"></i></div>`}
                        </div>
                        <div style="flex: 1;">
                            <div style="display: inline-block; background: ${accentColor}15; color: ${accentColor}; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 12px; margin-bottom: 10px;">${this.escapeHtml(awardYear)}</div>
                            <h3 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(awardTitle)}</h3>
                            <div style="color: ${accentColor}; font-size: 13px; font-weight: 600; margin-bottom: 10px;">${this.escapeHtml(organization)}</div>
                            <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['award-widget'];
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

window.elementorWidgetManager.registerWidget(AwardWidget);
