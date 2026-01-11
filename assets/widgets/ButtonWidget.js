/**
 * ButtonWidget - Button widget
 * Displays a customizable button with link
 */
class ButtonWidget extends WidgetBase {
    getName() {
        return 'button';
    }

    getTitle() {
        return 'Button';
    }

    getIcon() {
        return 'fa fa-hand-pointer';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['button', 'link', 'cta', 'click'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Click Me',
            placeholder: 'Enter button text',
            label_block: true
        });

        this.addControl('link', {
            type: 'url',
            label: 'Link',
            default_value: '#',
            placeholder: 'https://your-link.com',
            label_block: true
        });

        this.addControl('icon', {
            type: 'icon',
            label: 'Icon',
            default_value: ''
        });

        this.addControl('icon_position', {
            type: 'select',
            label: 'Icon Position',
            default_value: 'left',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' }
            ],
            condition: {
                name: 'icon',
                operator: 'not_empty'
            }
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            default_value: 'left',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        });

        this.addControl('button_type', {
            type: 'select',
            label: 'Button Type',
            default_value: 'primary',
            options: [
                { value: 'primary', label: 'Primary' },
                { value: 'secondary', label: 'Secondary' },
                { value: 'outline', label: 'Outline' },
                { value: 'text', label: 'Text' }
            ]
        });

        this.addControl('bg_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#3b82f6'
        });

        this.addControl('hover_bg_color', {
            type: 'color',
            label: 'Hover Background Color',
            default_value: '#2563eb'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#ffffff'
        });

        this.addControl('padding', {
            type: 'slider',
            label: 'Padding',
            default_value: { size: 15, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            }
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            default_value: { size: 4, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const text = this.getSetting('text', 'Click Me');
        const linkValue = this.getSetting('link', '#');
        const icon = this.getSetting('icon', '');
        const iconPosition = this.getSetting('icon_position', 'left');
        const align = this.getSetting('align', 'left');
        const buttonType = this.getSetting('button_type', 'primary');
        const bgColor = this.getSetting('bg_color', '#3b82f6');
        const hoverBgColor = this.getSetting('hover_bg_color', '#2563eb');
        const textColor = this.getSetting('text_color', '#ffffff');
        const padding = this.getSetting('padding', { size: 15, unit: 'px' });
        const borderRadius = this.getSetting('border_radius', { size: 4, unit: 'px' });

        // Handle URL control - it returns an object with url, is_external, nofollow
        let link = '#';
        let target = '_self';
        let rel = '';

        if (typeof linkValue === 'string') {
            link = linkValue;
        } else if (linkValue && typeof linkValue === 'object') {
            link = linkValue.url || '#';
            target = linkValue.is_external ? '_blank' : '_self';
            rel = linkValue.nofollow ? 'nofollow' : '';
        }

        // Initialize styles
        let wrapperStyles = `text-align: ${align};`;

        let initialShadow = '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)';
        let hoverShadow = '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)';

        if (buttonType === 'outline' || buttonType === 'text') {
            initialShadow = 'none';
            hoverShadow = '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)';
            if (buttonType === 'text') hoverShadow = 'none';
        }

        let buttonStyles = `
            display: inline-block;
            padding: 10px 24px;
            background-color: ${bgColor};
            color: ${textColor};
            border-radius: ${borderRadius.size}${borderRadius.unit};
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.5px;
            box-shadow: ${initialShadow};
            vertical-align: middle;
        `;

        if (buttonType === 'outline') {
            buttonStyles += `background-color: transparent; border: 2px solid ${bgColor}; color: ${bgColor};`;
        } else if (buttonType === 'text') {
            buttonStyles += `background-color: transparent; color: ${bgColor}; padding: 0; box-shadow: none;`;
        }

        // Build content with icon
        let buttonContent = `<span style="vertical-align: middle;">${this.escapeHtml(text)}</span>`;
        if (icon) {
            const iconHtml = `<i class="${this.escapeHtml(icon)}" style="margin-${iconPosition === 'left' ? 'right' : 'left'}: 8px; vertical-align: middle;"></i>`;
            buttonContent = iconPosition === 'left' ? iconHtml + buttonContent : buttonContent + iconHtml;
        }

        const hoverAttr = (buttonType === 'primary' || buttonType === 'secondary')
            ? `onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='${hoverShadow}'; this.style.backgroundColor='${hoverBgColor}'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${initialShadow}'; this.style.backgroundColor='${bgColor}'"`
            : `onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"`;

        const content = `
            <div style="${wrapperStyles}">
                <a href="${this.escapeHtml(link)}" target="${target}" rel="${rel}" class="button-widget-link" style="${buttonStyles}" ${hoverAttr}>
                    ${buttonContent}
                </a>
            </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'button-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(ButtonWidget);
