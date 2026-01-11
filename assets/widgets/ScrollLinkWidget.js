/**
 * ScrollLinkWidget - Scroll anchor points widget
 * Creates invisible anchor points for smooth scrolling navigation
 */
console.log('Loading ScrollLinkWidget.js...');

class ScrollLinkWidget extends WidgetBase {
    getName() {
        return 'scroll_link';
    }

    getTitle() {
        return 'Scroll Link';
    }

    getIcon() {
        return 'fa fa-anchor';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['anchor', 'scroll', 'navigation', 'jump', 'link'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Anchor',
            tab: 'content'
        });

        this.addControl('anchor_id', {
            type: 'text',
            label: 'Anchor ID',
            default_value: 'section-1',
            placeholder: 'e.g., about-us',
            label_block: true,
            description: 'Unique ID for this anchor (use lowercase, hyphens, no spaces)'
        });

        this.addControl('show_indicator', {
            type: 'switch',
            label: 'Show Visual Indicator',
            default_value: true,
            description: 'Display a visual marker (useful in editor mode)'
        });

        this.addControl('offset', {
            type: 'slider',
            label: 'Scroll Offset',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: -200,
                max: 200,
                step: 1
            },
            description: 'Adjust scroll position (useful for fixed headers)'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Indicator Style',
            tab: 'style'
        });

        this.addControl('indicator_color', {
            type: 'color',
            label: 'Indicator Color',
            default_value: '#3b82f6',
            condition: {
                terms: [
                    { name: 'show_indicator', operator: '==', value: true }
                ]
            }
        });

        this.addControl('indicator_size', {
            type: 'slider',
            label: 'Indicator Size',
            default_value: { size: 8, unit: 'px' },
            range: {
                min: 4,
                max: 20,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'show_indicator', operator: '==', value: true }
                ]
            }
        });

        this.addControl('indicator_text', {
            type: 'text',
            label: 'Indicator Label',
            default_value: '',
            placeholder: 'Optional label',
            condition: {
                terms: [
                    { name: 'show_indicator', operator: '==', value: true }
                ]
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const anchorId = this.getSetting('anchor_id', 'section-1');
        const showIndicator = this.getSetting('show_indicator', true);
        const offset = this.getSetting('offset', { size: 0, unit: 'px' });
        const indicatorColor = this.getSetting('indicator_color', '#3b82f6');
        const indicatorSize = this.getSetting('indicator_size', { size: 8, unit: 'px' });
        const indicatorText = this.getSetting('indicator_text', '');

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

        // Sanitize anchor ID (remove spaces, special chars, make lowercase)
        const sanitizedAnchorId = anchorId.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/--+/g, '-');

        // Build anchor element with offset
        const anchorStyles = `
            position: relative;
            top: ${offset.size}${offset.unit};
            display: block;
            height: 0;
            overflow: hidden;
            visibility: hidden;
        `;

        let content = `<div id="${this.escapeHtml(sanitizedAnchorId)}" style="${anchorStyles}"></div>`;

        // Add visual indicator if enabled
        if (showIndicator) {
            const indicatorStyles = `
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background-color: ${indicatorColor}20;
                border-left: 4px solid ${indicatorColor};
                border-radius: 4px;
                font-size: 13px;
                color: ${indicatorColor};
                font-family: monospace;
                margin: 10px 0;
            `;

            const dotStyles = `
                width: ${indicatorSize.size}${indicatorSize.unit};
                height: ${indicatorSize.size}${indicatorSize.unit};
                background-color: ${indicatorColor};
                border-radius: 50%;
                display: inline-block;
            `;

            const labelText = indicatorText || `Anchor: #${sanitizedAnchorId}`;

            content += `
                <div style="${indicatorStyles}">
                    <span style="${dotStyles}"></span>
                    <span>${this.escapeHtml(labelText)}</span>
                </div>
            `;
        }

        // Add usage hint
        const hintStyles = `
            font-size: 12px;
            color: #666;
            font-style: italic;
            margin-top: 5px;
            display: ${showIndicator ? 'block' : 'none'};
        `;

        content += `<div style="${hintStyles}">Link to this anchor: #${this.escapeHtml(sanitizedAnchorId)}</div>`;

        // Build wrapper classes
        let wrapperClasses = ['anchor-widget'];
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

window.elementorWidgetManager.registerWidget(ScrollLinkWidget);
