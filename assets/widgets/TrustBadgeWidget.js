/**
 * TrustBadgeWidget - Trust/certification badges widget
 * Displays trust badges, certifications, and security seals
 */
class TrustBadgeWidget extends WidgetBase {
    getName() {
        return 'trust_badge';
    }

    getTitle() {
        return 'Trust Badge';
    }

    getIcon() {
        return 'fa fa-shield-alt';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['trust', 'badge', 'certification', 'security', 'seal', 'verified'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Badges',
            tab: 'content'
        });

        this.addControl('badges', {
            type: 'repeater',
            label: 'Trust Badges',
            default_value: [
                { image: '', title: 'SSL Secured', description: '256-bit Encryption' },
                { image: '', title: 'Money Back', description: '30-Day Guarantee' },
                { image: '', title: 'Certified', description: 'ISO 9001:2015' }
            ],
            fields: [
                {
                    id: 'image',
                    type: 'media',
                    label: 'Badge Image',
                    default_value: ''
                },
                {
                    id: 'title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Trust Badge',
                    placeholder: 'Enter badge title'
                },
                {
                    id: 'description',
                    type: 'text',
                    label: 'Description',
                    default_value: '',
                    placeholder: 'Enter description'
                }
            ]
        });

        this.endControlsSection();

        // Layout Section
        this.startControlsSection('layout_section', {
            label: 'Layout',
            tab: 'content'
        });

        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            default_value: '3',
            options: [
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' },
                { value: '5', label: '5 Columns' }
            ]
        });

        this.addControl('alignment', {
            type: 'select',
            label: 'Alignment',
            default_value: 'center',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
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

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const badges = this.getSetting('badges', [
            { image: '', title: 'SSL Secured', description: '256-bit Encryption' },
            { image: '', title: 'Money Back', description: '30-Day Guarantee' },
            { image: '', title: 'Certified', description: 'ISO 9001:2015' }
        ]);
        const columns = this.getSetting('columns', '3');
        const alignment = this.getSetting('alignment', 'center');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const descriptionColor = this.getSetting('description_color', '#666666');
        const iconColor = this.getSetting('icon_color', '#3b82f6');

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

        // Build badge items
        const badgesArray = Array.isArray(badges) ? badges : [];
        const badgeItems = badgesArray.map((badge, index) => {
            const image = badge.image || '';
            const title = badge.title || 'Trust Badge';
            const description = badge.description || '';

            // Build badge image or icon
            let badgeImageHtml = '';
            if (image) {
                badgeImageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(title)}" style="width: 60px; height: 60px; object-fit: contain; margin-bottom: 12px;">`;
            } else {
                badgeImageHtml = `<div style="width: 60px; height: 60px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;"><i class="fa fa-shield-alt" style="color: ${iconColor}; font-size: 28px;"></i></div>`;
            }

            return `
                <div style="text-align: center; padding: 20px;">
                    ${badgeImageHtml}
                    <div style="color: ${titleColor}; font-size: 15px; font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(title)}</div>
                    ${description ? `<div style="color: ${descriptionColor}; font-size: 13px;">${this.escapeHtml(description)}</div>` : ''}
                </div>
            `;
        }).join('');

        const alignmentMap = {
            left: 'flex-start',
            center: 'center',
            right: 'flex-end'
        };

        const content = `
            <div style="background: ${backgroundColor}; padding: 20px; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px; justify-items: ${alignmentMap[alignment]};">
                    ${badgeItems}
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['trust-badge-widget'];
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

window.elementorWidgetManager.registerWidget(TrustBadgeWidget);
