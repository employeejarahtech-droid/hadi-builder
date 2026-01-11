/**
 * QuoteWidget - Blockquote widget
 * Displays styled quotes with optional author attribution
 */
class QuoteWidget extends WidgetBase {
    getName() {
        return 'quote';
    }

    getTitle() {
        return 'Quote';
    }

    getIcon() {
        return 'fa fa-quote-left';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['quote', 'blockquote', 'testimonial', 'citation'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Quote',
            tab: 'content'
        });

        this.addControl('quote_text', {
            type: 'textarea',
            label: 'Quote Text',
            default_value: 'This is a beautiful quote that inspires and motivates.',
            placeholder: 'Enter your quote',
            label_block: true
        });

        this.addControl('author', {
            type: 'text',
            label: 'Author',
            default_value: 'John Doe',
            placeholder: 'Quote author name',
            label_block: true
        });

        this.addControl('author_title', {
            type: 'text',
            label: 'Author Title',
            default_value: '',
            placeholder: 'CEO, Company Name',
            label_block: true,
            description: 'Optional author title or position'
        });

        this.addControl('show_quote_icon', {
            type: 'switch',
            label: 'Show Quote Icon',
            default_value: true
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

        this.addControl('quote_color', {
            type: 'color',
            label: 'Quote Color',
            default_value: '#333333'
        });

        this.addControl('quote_size', {
            type: 'slider',
            label: 'Quote Size',
            default_value: { size: 20, unit: 'px' },
            range: {
                min: 12,
                max: 60,
                step: 1
            },
            responsive: true
        });

        this.addControl('quote_weight', {
            type: 'select',
            label: 'Quote Weight',
            default_value: '400',
            options: [
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' }
            ]
        });

        this.addControl('quote_style', {
            type: 'select',
            label: 'Quote Style',
            default_value: 'normal',
            options: [
                { value: 'normal', label: 'Normal' },
                { value: 'italic', label: 'Italic' }
            ]
        });

        this.addControl('author_color', {
            type: 'color',
            label: 'Author Color',
            default_value: '#666666'
        });

        this.addControl('author_size', {
            type: 'slider',
            label: 'Author Size',
            default_value: { size: 16, unit: 'px' },
            range: {
                min: 10,
                max: 30,
                step: 1
            }
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6',
            condition: {
                terms: [
                    { name: 'show_quote_icon', operator: '==', value: true }
                ]
            }
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 40, unit: 'px' },
            range: {
                min: 20,
                max: 100,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'show_quote_icon', operator: '==', value: true }
                ]
            }
        });

        this.addControl('border_color', {
            type: 'color',
            label: 'Border Color',
            default_value: '#3b82f6'
        });

        this.addControl('border_width', {
            type: 'slider',
            label: 'Border Width',
            default_value: { size: 4, unit: 'px' },
            range: {
                min: 0,
                max: 20,
                step: 1
            }
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#f8f9fa'
        });

        this.addControl('padding', {
            type: 'slider',
            label: 'Padding',
            default_value: { size: 30, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const quoteText = this.getSetting('quote_text', 'This is a beautiful quote that inspires and motivates.');
        const author = this.getSetting('author', 'John Doe');
        const authorTitle = this.getSetting('author_title', '');
        const showQuoteIcon = this.getSetting('show_quote_icon', true);
        const align = this.getSetting('align', 'left');
        const quoteColor = this.getSetting('quote_color', '#333333');
        const quoteSize = this.getSetting('quote_size', { size: 20, unit: 'px' });
        const quoteWeight = this.getSetting('quote_weight', '400');
        const quoteStyle = this.getSetting('quote_style', 'normal');
        const authorColor = this.getSetting('author_color', '#666666');
        const authorSize = this.getSetting('author_size', { size: 16, unit: 'px' });
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const iconSize = this.getSetting('icon_size', { size: 40, unit: 'px' });
        const borderColor = this.getSetting('border_color', '#3b82f6');
        const borderWidth = this.getSetting('border_width', { size: 4, unit: 'px' });
        const backgroundColor = this.getSetting('background_color', '#f8f9fa');
        const padding = this.getSetting('padding', { size: 30, unit: 'px' });

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

        // Build blockquote styles
        const blockquoteStyles = `
            background-color: ${backgroundColor};
            border-left: ${borderWidth.size}${borderWidth.unit} solid ${borderColor};
            padding: ${padding.size}${padding.unit};
            margin: 0;
            position: relative;
            text-align: ${align};
        `;

        // Build quote icon HTML
        let quoteIconHtml = '';
        if (showQuoteIcon) {
            const iconStyles = `
                color: ${iconColor};
                font-size: ${iconSize.size}${iconSize.unit};
                opacity: 0.3;
                margin-bottom: 15px;
                display: block;
            `;
            quoteIconHtml = `<i class="fa fa-quote-left" style="${iconStyles}"></i>`;
        }

        // Build quote text styles
        const quoteTextStyles = `
            color: ${quoteColor};
            font-size: ${quoteSize.size}${quoteSize.unit};
            font-weight: ${quoteWeight};
            font-style: ${quoteStyle};
            line-height: 1.6;
            margin: 0 0 15px 0;
        `;

        // Build author styles
        const authorStyles = `
            color: ${authorColor};
            font-size: ${authorSize.size}${authorSize.unit};
            font-weight: 600;
            margin: 0;
        `;

        // Format quote text (convert line breaks to <br>)
        const formattedQuote = this.escapeHtml(quoteText).replace(/\n/g, '<br>');

        // Build author HTML
        let authorHtml = '';
        if (author) {
            const authorTitleHtml = authorTitle ? `<span style="font-weight: 400; opacity: 0.8;"> — ${this.escapeHtml(authorTitle)}</span>` : '';
            authorHtml = `<cite style="${authorStyles}">— ${this.escapeHtml(author)}${authorTitleHtml}</cite>`;
        }

        const content = `
            <blockquote style="${blockquoteStyles}">
                ${quoteIconHtml}
                <p style="${quoteTextStyles}">${formattedQuote}</p>
                ${authorHtml}
            </blockquote>
        `;

        // Build wrapper classes
        let wrapperClasses = ['quote-widget'];
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

window.elementorWidgetManager.registerWidget(QuoteWidget);
