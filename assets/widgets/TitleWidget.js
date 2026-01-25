/**
 * TitleWidget - Title widget
 * Displays a customizable title with specific structure
 */
class TitleWidget extends WidgetBase {
    getName() {
        return 'title';
    }

    getTitle() {
        return 'Title';
    }

    getIcon() {
        return 'fa fa-heading';
    }

    getCategories() {
        return ['content'];
    }

    getKeywords() {
        return ['title', 'heading', 'text', 'h2'];
    }

    getDefaultSettings() {
        return {
            title_text: 'Your Title Here',
            align: 'text-center',
            // Add margin and padding defaults
            margin: {
                top: 0,
                right: 0,
                bottom: 10,
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

        this.addControl('title_text', {
            type: 'text',
            label: 'Title Text',
            default_value: 'Your Title Here',
            placeholder: 'Enter title text',
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
        console.log('TitleWidget rendering', { settings: this.settings });
        const titleText = this.getSetting('title_text', 'Your Title Here');
        const align = this.getSetting('align', 'text-left');

        const fontSize = this.getSetting('font_size', { size: 38, unit: 'px' });

        // Handle font_size
        let safeFontSize = { size: 38, unit: 'px' };
        if (fontSize) {
            if (typeof fontSize === 'object' && fontSize.size !== undefined) {
                safeFontSize = {
                    size: parseFloat(fontSize.size) || 38,
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
        const uid = 'title_' + Math.floor(Math.random() * 100000);

        // Using user-specified HTML with injected Styles
        const content = `
        <style>
            .${uid} .title h2 {
                font-size: 38px;
                font-weight: 700;
                line-height: 1.2;
                margin-bottom: 0;
                /* Ensure visibility */
                opacity: 1; 
                visibility: visible;
            }
            .${uid} .title span {
                display: inline-block;
            }
        </style>
        <div class="${uid} ebl-data-blocks">
            <div class="comingsoon-body-item block-item ${align} aos-init aos-animate" data-aos="aos-blockRubberBand">
                <div class="title title_1bececf">
                    <h2 style="${stylesWithResponsive}">
                        <span></span>
                        <span>${this.escapeHtml(titleText)}</span>
                        <span></span>
                    </h2>
                </div>
            </div>
        </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'title-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(TitleWidget);
console.log('TitleWidget Script Loaded');
