class SocialIconsWidget extends WidgetBase {
    getName() {
        return 'social_icons';
    }
    getTitle() {
        return 'Social Icons';
    }
    getIcon() {
        return 'fa fa-share-alt';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['social', 'icons', 'links'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('social_links', {
            type: 'repeater',
            label: 'Social Links',
            default_value: [
                { platform: 'facebook', url: 'https://facebook.com' },
                { platform: 'twitter', url: 'https://twitter.com' },
                { platform: 'instagram', url: 'https://instagram.com' },
                { platform: 'linkedin', url: 'https://linkedin.com' }
            ],
            fields: [
                {
                    id: 'platform',
                    type: 'select',
                    label: 'Platform',
                    default_value: 'facebook',
                    options: [
                        { value: 'facebook', label: 'Facebook' },
                        { value: 'twitter', label: 'Twitter' },
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'linkedin', label: 'LinkedIn' },
                        { value: 'youtube', label: 'YouTube' },
                        { value: 'pinterest', label: 'Pinterest' },
                        { value: 'tiktok', label: 'TikTok' },
                        { value: 'github', label: 'GitHub' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'telegram', label: 'Telegram' }
                    ]
                },
                {
                    id: 'url',
                    type: 'text',
                    label: 'URL',
                    default_value: '#',
                    placeholder: 'https://...'
                }
            ]
        });

        this.addControl('layout', {
            type: 'select',
            label: 'Layout',
            default_value: 'horizontal',
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
            ],
            label_block: true
        });

        this.addControl('alignment', {
            type: 'select',
            label: 'Alignment',
            default_value: 'left',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            label_block: true
        });

        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 40, unit: 'px' },
            range: {
                min: 20,
                max: 100,
                step: 1
            }
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
        });

        this.addControl('icon_spacing', {
            type: 'slider',
            label: 'Icon Spacing',
            default_value: { size: 10, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            }
        });

        this.addControl('icon_hover_color', {
            type: 'color',
            label: 'Hover Color',
            default_value: '#2563eb'
        });

        this.endControlsSection();
        this.registerAdvancedControls();
    }

    render() {
        const socialLinks = this.getSetting('social_links', [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' }
        ]);

        const iconSizeValue = this.getSetting('icon_size', { size: 40, unit: 'px' });
        const iconSize = typeof iconSizeValue === 'object' ? `${iconSizeValue.size}${iconSizeValue.unit}` : `${iconSizeValue}px`;

        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const iconHoverColor = this.getSetting('icon_hover_color', '#2563eb');
        const layout = this.getSetting('layout', 'horizontal');
        const alignment = this.getSetting('alignment', 'left');

        const spacingValue = this.getSetting('icon_spacing', { size: 10, unit: 'px' });
        const spacing = typeof spacingValue === 'object' ? `${spacingValue.size}${spacingValue.unit}` : `${spacingValue}px`;

        // Generate unique ID for hover styles
        const uniqueId = `social-icons-${Math.random().toString(36).substr(2, 9)}`;

        // Build social icons
        const socialIconsArray = Array.isArray(socialLinks) ? socialLinks : [];
        const icons = socialIconsArray.map((link, index) => {
            const platform = link.platform || 'facebook';
            const url = link.url || '#';
            const iconClass = platform === 'twitter' ? 'fab fa-x-twitter' : `fab fa-${platform}`;

            const marginStyle = layout === 'vertical'
                ? `margin-bottom: ${index < socialIconsArray.length - 1 ? spacing : '0'};`
                : `margin-right: ${index < socialIconsArray.length - 1 ? spacing : '0'};`;

            return `
                <a href="${this.escapeHtml(url)}" 
                   class="${uniqueId}-icon" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style="
                       width: ${iconSize}; 
                       height: ${iconSize}; 
                       border-radius: 50%; 
                       background: ${iconColor}; 
                       color: white; 
                       display: inline-block;
                       text-align: center;
                       line-height: ${iconSize};
                       text-decoration: none; 
                       transition: all 0.3s ease;
                       ${marginStyle}
                   ">
                    <i class="${iconClass}" style="font-size: calc(${iconSize} * 0.5);"></i>
                </a>
            `;
        }).join('');

        // Container styles based on alignment
        const containerStyle = `text-align: ${alignment};`;

        // Add hover styles
        const hoverStyles = `
            <style>
                .${uniqueId}-icon:hover {
                    background: ${iconHoverColor} !important;
                    transform: scale(1.1);
                }
            </style>
        `;

        const content = `
            ${hoverStyles}
            <div style="${containerStyle}">
                ${icons}
            </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'social-icons-widget');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(SocialIconsWidget);
