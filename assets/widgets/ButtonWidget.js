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
    }

    render() {
        const text = this.getSetting('text', 'Click Me');
        const link = this.getSetting('link', '#');
        const icon = this.getSetting('icon', '');
        const iconPosition = this.getSetting('icon_position', 'left');
        const align = this.getSetting('align', 'left');
        const buttonType = this.getSetting('button_type', 'primary');
        const bgColor = this.getSetting('bg_color', '#3b82f6');
        const textColor = this.getSetting('text_color', '#ffffff');
        const padding = this.getSetting('padding', { size: 15, unit: 'px' });
        const borderRadius = this.getSetting('border_radius', { size: 4, unit: 'px' });

        const buttonStyles = `
            display: inline-block;
            padding: ${padding.size}${padding.unit} ${padding.size * 2}${padding.unit};
            background-color: ${bgColor};
            color: ${textColor};
            border: ${buttonType === 'outline' ? `2px solid ${bgColor}` : 'none'};
            border-radius: ${borderRadius.size}${borderRadius.unit};
            text-decoration: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        const wrapperStyles = `
            text-align: ${align};
            padding: 10px 0;
        `;

        let iconHtml = '';
        if (icon) {
            iconHtml = `<i class="${icon}" style="margin-${iconPosition === 'left' ? 'right' : 'left'}: 8px;"></i>`;
        }

        const buttonContent = iconPosition === 'left'
            ? `${iconHtml}${this.escapeHtml(text)}`
            : `${this.escapeHtml(text)}${iconHtml}`;

        return `
            <div class="button-widget" style="${wrapperStyles}">
                <a href="${this.escapeHtml(link)}" class="button-widget-link" style="${buttonStyles}">
                    ${buttonContent}
                </a>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(ButtonWidget);
