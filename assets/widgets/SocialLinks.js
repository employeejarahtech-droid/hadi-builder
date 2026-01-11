class SocialLinksWidget extends WidgetBase {
    getName() {
        return 'social-links';
    }

    getTitle() {
        return 'Social Links';
    }

    getIcon() {
        return 'fa fa-share-alt';
    }

    getCategories() {
        return ['basic'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Networks',
            tab: 'content'
        });


        this.addControl('links', {
            type: 'repeater',
            label: 'Social Links',
            item_label: 'Link',
            title_field: 'network',

            fields: [
                {
                    name: 'network',
                    label: 'Network',
                    type: 'select',
                    options: [
                        { value: 'facebook', label: 'Facebook' },
                        { value: 'twitter', label: 'Twitter' },
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'linkedin', label: 'LinkedIn' },
                        { value: 'youtube', label: 'YouTube' },
                        { value: 'custom', label: 'Custom' }
                    ],
                    default: 'facebook'
                },
                {
                    name: 'url',
                    type: 'text',
                    label: 'Link URL',
                    placeholder: 'https://your-profile.com',
                    default: ''
                },
                {
                    name: 'icon',
                    type: 'icon',
                    label: 'Icon',
                    default: 'fab fa-facebook-f'
                },
                {
                    name: 'color',
                    type: 'color',
                    label: 'Custom Color',
                    default: '#333333'
                }
            ],

            default_value: [
                { network: 'facebook', url: '#', icon: 'fab fa-facebook-f', color: '#1877f2' },
                { network: 'twitter', url: '#', icon: 'fab fa-twitter', color: '#1da1f2' },
                { network: 'instagram', url: '#', icon: 'fab fa-instagram', color: '#e1306c' }
            ]
        });


        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Style Settings',
            tab: 'style'
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size (px)',
            min: 10,
            max: 50,
            default_value: 18,
            responsive: true
        });

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'left'
        });

        this.addControl('gap', {
            type: 'slider',
            label: 'Gap (px)',
            min: 0,
            max: 50,
            default_value: 10
        });

        this.addControl('shape', {
            type: 'select',
            label: 'Shape',
            options: [
                { value: 'square', label: 'Square' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'circle', label: 'Circle' }
            ],
            default_value: 'rounded'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const links = this.getSetting('links') || [];
        const align = this.getSetting('align') || 'left';
        const gap = this.getSetting('gap') || 10;
        const size = this.getSetting('icon_size') || 18;
        const shape = this.getSetting('shape') || 'rounded';

        let borderRadius = '4px';
        if (shape === 'circle') borderRadius = '50%';
        if (shape === 'square') borderRadius = '0';

        const wrapperStyle = `
            text-align: ${align};
            display: flex;
            justify-content: ${align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'};
            gap: ${gap}px;
            flex-wrap: wrap;
        `;

        const iconStyle = `
            width: ${size * 2}px;
            height: ${size * 2}px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eee;
            color: #555;
            font-size: ${size}px;
            text-decoration: none;
            transition: all 0.3s;
            border-radius: ${borderRadius};
        `;

        let iconsHtml = '';

        links.forEach(linkItem => {
            const url = linkItem.url;
            const iconClass = linkItem.icon || 'fa fa-link';

            // Determine color: use custom color if set, or default network colors if no custom provided?
            // Since we have a color picker in the repeater, use that.
            // If user wants default colors, they can pick them or we can implement logic.
            // For simplicity, use the color from the item.

            let itemColor = linkItem.color;
            if (!itemColor) {
                // Fallback map if color missing
                const colorMap = {
                    'facebook': '#1877f2',
                    'twitter': '#1da1f2',
                    'instagram': '#e1306c',
                    'linkedin': '#0077b5',
                    'youtube': '#ff0000'
                };
                itemColor = colorMap[linkItem.network] || '#333';
            }

            if (url) {
                // Use widget-link class to prevent clicks in editor
                iconsHtml += `
                    <a href="${url}" class="social-icon widget-link" target="_blank" style="${iconStyle}; color: white; background-color: ${itemColor};">
                        <i class="${iconClass}"></i>
                    </a>
                `;
            }
        });

        if (!iconsHtml) {
            iconsHtml = '<div style="opacity:0.5; padding: 10px; border: 1px dashed #ccc;">Add social links in settings</div>';
        }

        const content = `
            <div class="social-links-widget" style="${wrapperStyle}">
                ${iconsHtml}
            </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'social-links-widget-wrapper');
    }
}

window.elementorWidgetManager.registerWidget(SocialLinksWidget);
