/**
 * PlainTextWidget - Plain Text widget
 * Displays a customizable paragraph with specific structure
 */
class PlainTextWidget extends WidgetBase {
    getName() {
        return 'plain-text';
    }

    getTitle() {
        return 'Plain Text';
    }

    getIcon() {
        return 'fa fa-paragraph';
    }

    getCategories() {
        return ['content'];
    }

    getKeywords() {
        return ['text', 'paragraph', 'description', 'plain'];
    }

    getDefaultSettings() {
        return {
            content: 'We supply a wide range of technology and electronic products tailored for wholesale, retail, and enterprise distribution.',
            align: 'text-left',

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

        this.addControl('content', {
            type: 'textarea',
            label: 'Text Content',
            default_value: 'We supply a wide range of technology and electronic products tailored for wholesale, retail, and enterprise distribution.',
            placeholder: 'Enter content here',
            rows: 5,
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
            default_value: 'text-center',
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
        console.log('PlainTextWidget rendering', { settings: this.settings });
        const contentText = this.getSetting('content', 'We supply a wide range of technology and electronic products tailored for wholesale, retail, and enterprise distribution.');
        const align = this.getSetting('align', 'text-center');
        const fontSize = this.getSetting('font_size', { size: 16, unit: 'px' });

        // Handle font_size
        let safeFontSize = { size: 16, unit: 'px' };
        if (fontSize) {
            if (typeof fontSize === 'object' && fontSize.size !== undefined) {
                safeFontSize = {
                    size: parseFloat(fontSize.size) || 16,
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

        // Apply responsive font sizes
        let responsiveStyle = '';
        if (safeFontSize.tablet_size !== null && safeFontSize.tablet_size !== undefined) {
            responsiveStyle += ` --tablet-font-size: ${safeFontSize.tablet_size}${safeFontSize.unit};`;
        }
        if (safeFontSize.mobile_size !== null && safeFontSize.mobile_size !== undefined) {
            responsiveStyle += ` --mobile-font-size: ${safeFontSize.mobile_size}${safeFontSize.unit};`;
        }

        const stylesWithResponsive = responsiveStyle;

        // Generate a unique Class for scoping styles
        const uid = 'plain_text_' + Math.floor(Math.random() * 100000);

        // Using user-specified HTML with injected Styles
        const content = `
        <style>
            .${uid} .plain_text p {
                font-size: 16px;
                margin-bottom: 0;
                line-height: 1.6;
                /* Ensure visibility */
                opacity: 1;
                visibility: visible;
            }
        </style>
        <div class="${uid} ebl-data-blocks">
            <div class="comingsoon-body-item block-item ${align} aos-init aos-animate" data-aos="aos-blockRubberBand">
                <div class="plain_text plain_text_1bececf">
                    <p style="${stylesWithResponsive}">${this.escapeHtml(contentText)}</p>
                </div>
            </div>
        </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'plain-text-widget');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(PlainTextWidget);
console.log('PlainTextWidget Script Loaded');
