/**
 * IconTimelineWidget - Timeline with icons widget
 * Displays vertical timeline with icons and events
 */
class IconTimelineWidget extends WidgetBase {
    getName() {
        return 'icon_timeline';
    }

    getTitle() {
        return 'Icon Timeline';
    }

    getIcon() {
        return 'fa fa-stream';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['timeline', 'history', 'events', 'roadmap', 'milestones'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Timeline Items',
            tab: 'content'
        });

        this.addControl('items', {
            type: 'repeater',
            label: 'Items',
            default_value: [
                { icon: 'fa fa-flag', title: 'Project Started', description: 'Initial planning and research phase', date: '2024' },
                { icon: 'fa fa-code', title: 'Development', description: 'Building the core features', date: '2024' },
                { icon: 'fa fa-rocket', title: 'Launch', description: 'Product released to public', date: '2025' }
            ],
            fields: [
                {
                    id: 'icon',
                    type: 'text',
                    label: 'Icon',
                    default_value: 'fa fa-circle',
                    placeholder: 'e.g., fa fa-circle'
                },
                {
                    id: 'title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Event',
                    placeholder: 'Enter title'
                },
                {
                    id: 'description',
                    type: 'text',
                    label: 'Description',
                    default_value: 'Event description',
                    placeholder: 'Enter description'
                },
                {
                    id: 'date',
                    type: 'text',
                    label: 'Date',
                    default_value: '2024',
                    placeholder: 'e.g., 2024'
                }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('line_color', {
            type: 'color',
            label: 'Line Color',
            default_value: '#e5e7eb'
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

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const items = this.getSetting('items', [
            { icon: 'fa fa-flag', title: 'Project Started', description: 'Initial planning and research phase', date: '2024' },
            { icon: 'fa fa-code', title: 'Development', description: 'Building the core features', date: '2024' },
            { icon: 'fa fa-rocket', title: 'Launch', description: 'Product released to public', date: '2025' }
        ]);
        const lineColor = this.getSetting('line_color', '#e5e7eb');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        // Build timeline items
        const itemsArray = Array.isArray(items) ? items : [];
        const timelineItems = itemsArray.map((item, index) => {
            const icon = item.icon || 'fa fa-circle';
            const title = item.title || 'Event';
            const description = item.description || 'Event description';
            const date = item.date || '2024';

            return `
                <div style="position: relative; padding-left: 60px; padding-bottom: ${index < itemsArray.length - 1 ? '40px' : '0'};">
                    <div style="position: absolute; left: 0; top: 0; width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}; display: flex; align-items: center; justify-content: center; z-index: 2;">
                        <i class="${this.escapeHtml(icon)}" style="color: white; font-size: 18px;"></i>
                    </div>
                    ${index < itemsArray.length - 1 ? `<div style="position: absolute; left: 19px; top: 40px; width: 2px; height: calc(100% - 40px); background: ${lineColor};"></div>` : ''}
                    <div style="padding-top: 5px;">
                        <div style="color: ${iconColor}; font-size: 12px; font-weight: 600; margin-bottom: 5px;">${this.escapeHtml(date)}</div>
                        <h4 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(title)}</h4>
                        <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p>
                    </div>
                </div>
            `;
        }).join('');

        const content = `<div>${timelineItems}</div>`;

        // Build wrapper classes
        let wrapperClasses = ['icon-timeline-widget'];
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

        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(IconTimelineWidget);
