/**
 * CopyrightWidget - Copyright text with auto year widget
 * Displays copyright notice with automatic year updating
 */
class CopyrightWidget extends WidgetBase {
    getName() {
        return 'copyright';
    }

    getTitle() {
        return 'Copyright';
    }

    getIcon() {
        return 'fa fa-copyright';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['copyright', 'year', 'footer', 'legal', 'notice'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Copyright',
            tab: 'content'
        });

        this.addControl('company_name', {
            type: 'text',
            label: 'Company Name',
            default_value: 'Your Company',
            placeholder: 'Enter company name',
            label_block: true
        });

        this.addControl('start_year', {
            type: 'text',
            label: 'Start Year',
            default_value: '',
            placeholder: 'e.g., 2020 (leave empty for current year only)',
            description: 'If set, displays as "2020-2025"'
        });

        this.addControl('show_symbol', {
            type: 'switch',
            label: 'Show © Symbol',
            default_value: true
        });

        this.addControl('text_before', {
            type: 'text',
            label: 'Text Before',
            default_value: '',
            placeholder: 'e.g., Copyright',
            description: 'Optional text before the copyright'
        });

        this.addControl('text_after', {
            type: 'text',
            label: 'Text After',
            default_value: 'All rights reserved.',
            placeholder: 'e.g., All rights reserved.',
            description: 'Optional text after company name'
        });

        this.addControl('link_url', {
            type: 'url',
            label: 'Link URL',
            default_value: '',
            placeholder: 'https://example.com',
            description: 'Optional link for company name'
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
            default_value: 'center',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#666666'
        });

        this.addControl('link_color', {
            type: 'color',
            label: 'Link Color',
            default_value: '#3b82f6'
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 14, unit: 'px' },
            range: {
                min: 10,
                max: 24,
                step: 1
            },
            responsive: true
        });

        this.addControl('line_height', {
            type: 'slider',
            label: 'Line Height',
            default_value: { size: 1.6, unit: '' },
            range: {
                min: 1,
                max: 3,
                step: 0.1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const companyName = this.getSetting('company_name', 'Your Company');
        const startYear = this.getSetting('start_year', '');
        const showSymbol = this.getSetting('show_symbol', true);
        const textBefore = this.getSetting('text_before', '');
        const textAfter = this.getSetting('text_after', 'All rights reserved.');
        const linkUrl = this.getSetting('link_url', '');
        const align = this.getSetting('align', 'center');
        const textColor = this.getSetting('text_color', '#666666');
        const linkColor = this.getSetting('link_color', '#3b82f6');
        const fontSize = this.getSetting('font_size', { size: 14, unit: 'px' });
        const lineHeight = this.getSetting('line_height', { size: 1.6, unit: '' });

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

        // Get current year
        const currentYear = new Date().getFullYear();

        // Build year display
        let yearDisplay = currentYear.toString();
        if (startYear && startYear.trim() !== '') {
            const start = parseInt(startYear.trim());
            if (!isNaN(start) && start < currentYear) {
                yearDisplay = `${start}-${currentYear}`;
            }
        }

        // Build copyright parts
        const parts = [];

        // Text before
        if (textBefore) {
            parts.push(this.escapeHtml(textBefore));
        }

        // Copyright symbol
        if (showSymbol) {
            parts.push('©');
        }

        // Year
        parts.push(yearDisplay);

        // Company name (with optional link)
        let companyHtml = this.escapeHtml(companyName);
        if (linkUrl) {
            companyHtml = `<a href="${this.escapeHtml(linkUrl)}" style="color: ${linkColor}; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${companyHtml}</a>`;
        }
        parts.push(companyHtml);

        // Text after
        if (textAfter) {
            parts.push(this.escapeHtml(textAfter));
        }

        // Join parts with spaces
        const copyrightText = parts.join(' ');

        // Build container styles
        const containerStyles = `
            text-align: ${align};
            color: ${textColor};
            font-size: ${fontSize.size}${fontSize.unit};
            line-height: ${lineHeight.size}${lineHeight.unit};
        `;

        const content = `<div style="${containerStyles}">${copyrightText}</div>`;

        // Build wrapper classes
        let wrapperClasses = ['copyright-widget'];
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

window.elementorWidgetManager.registerWidget(CopyrightWidget);
