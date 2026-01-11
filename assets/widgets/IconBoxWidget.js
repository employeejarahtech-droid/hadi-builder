/**
 * IconBoxWidget - Icon + text combo widget
 * Displays icon with title and description
 */
class IconBoxWidget extends WidgetBase {
    getName() {
        return 'icon_box';
    }

    getTitle() {
        return 'Icon Box';
    }

    getIcon() {
        return 'fa fa-star';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['icon', 'box', 'feature', 'service', 'info'];
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
            default_value: 'fa fa-star',
            placeholder: 'e.g., fa fa-heart',
            description: 'FontAwesome icon class'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Amazing Feature',
            placeholder: 'Enter title',
            label_block: true
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'This is a powerful feature that will help you achieve your goals.',
            placeholder: 'Enter description',
            label_block: true
        });

        this.addControl('link_url', {
            type: 'text',
            label: 'Link URL',
            default_value: '',
            placeholder: 'https://example.com',
            label_block: true,
            description: 'Optional link for the entire box'
        });

        this.endControlsSection();

        // Icon Style Section
        this.startControlsSection('icon_style_section', {
            label: 'Icon',
            tab: 'style'
        });

        this.addControl('icon_position', {
            type: 'select',
            label: 'Icon Position',
            default_value: 'top',
            options: [
                { value: 'top', label: 'Top' },
                { value: 'left', label: 'Left' }
            ]
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 48, unit: 'px' },
            range: {
                min: 20,
                max: 120,
                step: 1
            }
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
        });

        this.addControl('icon_background', {
            type: 'color',
            label: 'Icon Background',
            default_value: '#eff6ff'
        });

        this.addControl('icon_shape', {
            type: 'select',
            label: 'Icon Shape',
            default_value: 'circle',
            options: [
                { value: 'none', label: 'None' },
                { value: 'circle', label: 'Circle' },
                { value: 'square', label: 'Square' }
            ]
        });

        this.endControlsSection();

        // Content Style Section
        this.startControlsSection('content_style_section', {
            label: 'Content',
            tab: 'style'
        });

        this.addControl('text_align', {
            type: 'select',
            label: 'Text Alignment',
            default_value: 'center',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
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

        this.addControl('description_color', {
            type: 'color',
            label: 'Description Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const icon = this.getSetting('icon', 'fa fa-star');
        const title = this.getSetting('title', 'Amazing Feature');
        const description = this.getSetting('description', 'This is a powerful feature that will help you achieve your goals.');
        const linkUrl = this.getSetting('link_url', '');
        const iconPosition = this.getSetting('icon_position', 'top');
        const iconSize = this.getSetting('icon_size', { size: 48, unit: 'px' });
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const iconBackground = this.getSetting('icon_background', '#eff6ff');
        const iconShape = this.getSetting('icon_shape', 'circle');
        const textAlign = this.getSetting('text_align', 'center');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const descriptionColor = this.getSetting('description_color', '#666666');

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

        // Validate icon size
        const safeIconSize = (iconSize && typeof iconSize === 'object' && iconSize.size !== undefined && iconSize.unit !== undefined)
            ? iconSize
            : { size: 48, unit: 'px' };

        // Build icon shape styles
        let iconShapeStyles = '';
        if (iconShape === 'circle') {
            iconShapeStyles = `background: ${iconBackground}; border-radius: 50%; width: ${safeIconSize.size * 1.8}${safeIconSize.unit}; height: ${safeIconSize.size * 1.8}${safeIconSize.unit}; display: flex; align-items: center; justify-content: center;`;
        } else if (iconShape === 'square') {
            iconShapeStyles = `background: ${iconBackground}; border-radius: 8px; width: ${safeIconSize.size * 1.8}${safeIconSize.unit}; height: ${safeIconSize.size * 1.8}${safeIconSize.unit}; display: flex; align-items: center; justify-content: center;`;
        }

        // Build icon HTML
        const iconHtml = iconShape === 'none'
            ? `<i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: ${safeIconSize.size}${safeIconSize.unit};"></i>`
            : `<div style="${iconShapeStyles}"><i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: ${safeIconSize.size}${safeIconSize.unit};"></i></div>`;

        // Build content based on icon position
        let content = '';
        if (iconPosition === 'top') {
            content = `
                <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: ${textAlign}; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'">
                    <div style="margin-bottom: 20px; display: inline-block;">
                        ${iconHtml}
                    </div>
                    <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">${this.escapeHtml(title)}</h3>
                    <p style="color: ${descriptionColor}; font-size: 15px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                </div>
            `;
        } else { // left
            content = `
                <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'">
                    <div style="display: flex; align-items: flex-start; gap: 20px; text-align: ${textAlign};">
                        <div style="flex-shrink: 0;">
                            ${iconHtml}
                        </div>
                        <div style="flex: 1;">
                            <h3 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h3>
                            <p style="color: ${descriptionColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Wrap with link if URL provided
        if (linkUrl) {
            content = `<a href="${this.escapeHtml(linkUrl)}" style="text-decoration: none; display: block;">${content}</a>`;
        }

        // Build wrapper classes
        let wrapperClasses = ['icon-box-widget'];
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

window.elementorWidgetManager.registerWidget(IconBoxWidget);
