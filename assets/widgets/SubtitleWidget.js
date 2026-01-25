/**
 * SubtitleWidget - Subtitle widget
 * Displays a customizable subtitle with specific structure
 */
class SubtitleWidget extends WidgetBase {
    getName() {
        return 'subtitle';
    }

    getTitle() {
        return 'Subtitle';
    }

    getIcon() {
        return 'fa fa-quote-right';
    }

    getCategories() {
        return ['content'];
    }

    getKeywords() {
        return ['subtitle', 'text', 'heading', 'decoration'];
    }

    getDefaultSettings() {
        return {
            subtitle_text: 'Your Subtitle Here',
            // Add margin and padding defaults
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                unit: 'px'
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                unit: 'px'
            },

            css_classes: '',
            css_id: '',
            animation: 'none',
            animation_duration: { size: 0.5, unit: 's' },
            animation_delay: { size: 0, unit: 's' },
            responsive_display: 'show-all'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('subtitle_text', {
            type: 'text',
            label: 'Subtitle Text',
            default_value: 'Your Subtitle Here',
            placeholder: 'Enter subtitle text',
            label_block: true
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
            default_value: 'text-left',
            options: [
                { value: 'text-left', label: 'Left' },
                { value: 'text-center', label: 'Center' },
                { value: 'text-right', label: 'Right' },
                { value: 'text-justify', label: 'Justify' }
            ]
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        console.log('SubtitleWidget rendering', { settings: this.settings });
        const subtitleText = this.getSetting('subtitle_text', 'Your Subtitle Here');
        const align = this.getSetting('align', 'text-left');
        const fontSize = this.getSetting('font_size', { size: 18, unit: 'px' });

        // Handle font_size - can be object with size/unit or responsive values
        let safeFontSize = { size: 18, unit: 'px' };
        if (fontSize) {
            if (typeof fontSize === 'object' && fontSize.size !== undefined) {
                safeFontSize = {
                    size: parseFloat(fontSize.size) || 18,
                    unit: fontSize.unit || 'px',
                    tablet_size: fontSize.tablet_size !== undefined ? parseFloat(fontSize.tablet_size) : null,
                    mobile_size: fontSize.mobile_size !== undefined ? parseFloat(fontSize.mobile_size) : null
                };
            } else if (typeof fontSize === 'number') {
                safeFontSize = { size: fontSize, unit: 'px' };
            } else if (typeof fontSize === 'string') {
                const match = fontSize.match(/^([\d.]+)(px|em|rem|%)$/);
                if (match) {
                    safeFontSize = { size: parseFloat(match[1]), unit: match[2] };
                } else {
                    const numValue = parseFloat(fontSize);
                    if (!isNaN(numValue)) {
                        safeFontSize = { size: numValue, unit: 'px' };
                    }
                }
            }
        }

        // Apply responsive font sizes using CSS custom properties
        let responsiveStyle = '';
        if (safeFontSize.tablet_size !== null && safeFontSize.tablet_size !== undefined) {
            responsiveStyle += ` --tablet-font-size: ${safeFontSize.tablet_size}${safeFontSize.unit};`;
        }
        if (safeFontSize.mobile_size !== null && safeFontSize.mobile_size !== undefined) {
            responsiveStyle += ` --mobile-font-size: ${safeFontSize.mobile_size}${safeFontSize.unit};`;
        }

        const stylesWithResponsive = responsiveStyle;

        // Generate a unique Class for scoping styles
        const uid = 'subtitle_' + Math.floor(Math.random() * 100000);

        // Using the user-specified HTML structure with injected styles
        const content = `
        <div class="${uid} ebl-data-blocks">
            <div class="comingsoon-body-item block-item ${align} aos-init aos-animate" data-aos="aos-blockRubberBand">
                <div class="subtitle">
                    <h4 style="${stylesWithResponsive}" class="heading-responsive-font">
                        <span class="subtitle-first-span"></span>
                        <span class="subtitle-middle-span">${this.escapeHtml(subtitleText)}</span>
                        <span class="subtitle-last-span"></span>
                    </h4>
                </div>
            </div>
        </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'subtitle-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}


window.elementorWidgetManager.registerWidget(SubtitleWidget);
console.log('SubtitleWidget Script Loaded');
