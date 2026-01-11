/**
 * TopbarCTAWidget - Topbar Contact Information Widget
 * Displays contact information (location, email, phone) in the topbar
 */
class TopbarCTAWidget extends WidgetBase {
    getName() {
        return 'topbar_cta';
    }

    getTitle() {
        return 'Topbar CTA';
    }

    getIcon() {
        return 'fa fa-phone';
    }

    getCategories() {
        return ['basic', 'contact', 'topbar'];
    }

    getKeywords() {
        return ['topbar', 'contact', 'cta', 'phone', 'email', 'location', 'address'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Contact Items',
            tab: 'content'
        });

        this.addControl('items', {
            type: 'repeater',
            label: 'Contact Items',
            default_value: [
                {
                    type: 'location',
                    icon: 'icon-location-dot',
                    text: 'Burdubai, Dubai-UAE',
                    link: '#'
                },
                {
                    type: 'email',
                    icon: 'fal fa-envelope',
                    text: 'sales@truewayuae.com',
                    link: 'mailto:sales@truewayuae.com'
                },
                {
                    type: 'phone',
                    icon: 'fal fa-phone',
                    text: '+971 56 712 8665',
                    link: 'tel:+971 56 712 8665'
                }
            ],
            fields: [
                {
                    name: 'type',
                    type: 'select',
                    label: 'Type',
                    default: 'phone',
                    options: [
                        { value: 'location', label: 'Location' },
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone' },
                        { value: 'custom', label: 'Custom' }
                    ]
                },
                {
                    name: 'icon',
                    type: 'icon',
                    label: 'Icon Class',
                    default: 'fal fa-phone'
                },
                {
                    name: 'text',
                    type: 'text',
                    label: 'Text',
                    default: '+971 56 712 8665',
                    placeholder: 'Enter contact text'
                },
                {
                    name: 'link',
                    type: 'text',
                    label: 'Link',
                    default: 'tel:+971 56 712 8665',
                    placeholder: 'Enter URL (e.g., tel:+971..., mailto:..., https://...)'
                }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('alignment', {
            type: 'select',
            label: 'Alignment',
            default_value: 'flex-end',
            options: [
                { value: 'flex-start', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'Right' },
                { value: 'space-between', label: 'Space Between' },
                { value: 'space-around', label: 'Space Around' }
            ]
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#ffffff'
        });

        this.addControl('text_hover_color', {
            type: 'color',
            label: 'Text Hover Color',
            default_value: '#f0f0f0'
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#ffffff'
        });

        this.addControl('text_size', {
            type: 'slider',
            label: 'Text Size',
            default_value: { size: 14, unit: 'px' },
            range: {
                min: 10,
                max: 20,
                step: 1
            }
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 14, unit: 'px' },
            range: {
                min: 10,
                max: 24,
                step: 1
            }
        });

        this.addControl('item_spacing', {
            type: 'slider',
            label: 'Item Spacing',
            default_value: { size: 20, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            }
        });

        this.addControl('icon_spacing', {
            type: 'slider',
            label: 'Icon Spacing',
            default_value: { size: 8, unit: 'px' },
            range: {
                min: 0,
                max: 20,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const items = this.getSetting('items', [
            {
                type: 'location',
                icon: 'icon-location-dot',
                text: 'Burdubai, Dubai-UAE',
                link: '#'
            },
            {
                type: 'email',
                icon: 'fal fa-envelope',
                text: 'sales@truewayuae.com',
                link: 'mailto:sales@truewayuae.com'
            },
            {
                type: 'phone',
                icon: 'fal fa-phone',
                text: '+971 56 712 8665',
                link: 'tel:+971 56 712 8665'
            }
        ]);

        const textColor = this.getSetting('text_color', '#ffffff');
        const textHoverColor = this.getSetting('text_hover_color', '#f0f0f0');
        const iconColor = this.getSetting('icon_color', '#ffffff');
        const textSize = this.getSetting('text_size', { size: 14, unit: 'px' });
        const iconSize = this.getSetting('icon_size', { size: 14, unit: 'px' });
        const itemSpacing = this.getSetting('item_spacing', { size: 20, unit: 'px' });
        const iconSpacing = this.getSetting('icon_spacing', { size: 8, unit: 'px' });
        const alignment = this.getSetting('alignment', 'flex-end');

        // Validate sizes
        const safeTextSize = (textSize && typeof textSize === 'object' && textSize.size !== undefined && textSize.unit !== undefined)
            ? textSize
            : { size: 14, unit: 'px' };

        const safeIconSize = (iconSize && typeof iconSize === 'object' && iconSize.size !== undefined && iconSize.unit !== undefined)
            ? iconSize
            : { size: 14, unit: 'px' };

        const safeItemSpacing = (itemSpacing && typeof itemSpacing === 'object' && itemSpacing.size !== undefined && itemSpacing.unit !== undefined)
            ? itemSpacing
            : { size: 20, unit: 'px' };

        const safeIconSpacing = (iconSpacing && typeof iconSpacing === 'object' && iconSpacing.size !== undefined && iconSpacing.unit !== undefined)
            ? iconSpacing
            : { size: 8, unit: 'px' };

        // Generate unique ID for hover styles
        const uniqueId = `topbar-cta-${Math.random().toString(36).substr(2, 9)}`;

        // Build list items
        const itemsArray = Array.isArray(items) ? items : [];
        const listItems = itemsArray.map((item, index) => {
            const text = item.text || 'Contact';
            const icon = item.icon || 'fal fa-phone';

            // Get link URL
            const linkUrl = item.link || '#';

            return `
                <li style="margin-right: ${index < itemsArray.length - 1 ? safeItemSpacing.size + safeItemSpacing.unit : '0'};">
                    <a href="${this.escapeHtml(linkUrl)}" class="topbar-cta-link">
                        <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: ${safeIconSize.size}${safeIconSize.unit}; margin-right: ${safeIconSpacing.size}${safeIconSpacing.unit};"></i>${this.escapeHtml(text)}
                    </a>
                </li>
            `;
        }).join('');

        // Add inline styles for hover effect
        const hoverStyles = `
            <style>
                .header-cta .${uniqueId} {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: ${alignment};
                }
                .header-cta a {
                    color: ${textColor};
                    font-size: ${safeTextSize.size}${safeTextSize.unit};
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    transition: color 0.3s ease;
                }
                .header-cta a:hover {
                    color: ${textHoverColor};
                }
            </style>
        `;

        const content = `
            ${hoverStyles}
            <ul class="${uniqueId}">
                ${listItems}
            </ul>
        `;

        return this.wrapWithAdvancedSettings(content, 'header-cta');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(TopbarCTAWidget);
