/**
 * HTMLWidget - Custom HTML embed widget
 * Allows embedding custom HTML code
 */
class HTMLWidget extends WidgetBase {
    getName() {
        return 'html';
    }

    getTitle() {
        return 'HTML';
    }

    getIcon() {
        return 'fa fa-code';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['html', 'custom', 'embed', 'code', 'raw'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'HTML Code',
            tab: 'content'
        });

        this.addControl('html_code', {
            type: 'textarea',
            label: 'HTML Code',
            default_value: '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">\n    <h3>Custom HTML</h3>\n    <p>You can add any HTML here!</p>\n</div>',
            placeholder: 'Enter your HTML code',
            label_block: true,
            description: 'Enter custom HTML code to embed'
        });

        this.addControl('show_warning', {
            type: 'switch',
            label: 'Show Security Warning',
            default_value: true,
            description: 'Display a warning about untrusted HTML'
        });

        this.endControlsSection();

        // Settings Section
        this.startControlsSection('settings_section', {
            label: 'Settings',
            tab: 'content'
        });

        this.addControl('sanitize_html', {
            type: 'switch',
            label: 'Sanitize HTML',
            default_value: false,
            description: 'Remove potentially dangerous tags and attributes'
        });

        this.addControl('wrap_content', {
            type: 'switch',
            label: 'Wrap in Container',
            default_value: false,
            description: 'Wrap HTML in a styled container'
        });

        this.addControl('container_padding', {
            type: 'slider',
            label: 'Container Padding',
            default_value: { size: 0, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'wrap_content', operator: '==', value: true }
                ]
            }
        });

        this.addControl('container_background', {
            type: 'color',
            label: 'Container Background',
            default_value: 'transparent',
            condition: {
                terms: [
                    { name: 'wrap_content', operator: '==', value: true }
                ]
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    /**
     * Basic HTML sanitization
     * Removes potentially dangerous tags and attributes
     */
    sanitizeHTML(html) {
        // Remove script tags
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // Remove event handlers
        html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        html = html.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

        // Remove javascript: protocol
        html = html.replace(/javascript:/gi, '');

        // Remove iframe (optional - can be dangerous)
        // html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

        // Remove object and embed tags
        html = html.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
        html = html.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

        return html;
    }

    render() {
        const htmlCode = this.getSetting('html_code', '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">\n    <h3>Custom HTML</h3>\n    <p>You can add any HTML here!</p>\n</div>');
        const showWarning = this.getSetting('show_warning', true);
        const sanitizeHtml = this.getSetting('sanitize_html', false);
        const wrapContent = this.getSetting('wrap_content', false);
        const containerPadding = this.getSetting('container_padding', { size: 0, unit: 'px' });
        const containerBackground = this.getSetting('container_background', 'transparent');

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

        // Process HTML
        let processedHtml = htmlCode;
        if (sanitizeHtml) {
            processedHtml = this.sanitizeHTML(processedHtml);
        }

        // Warning message
        let warningHtml = '';
        if (showWarning && !sanitizeHtml) {
            warningHtml = `
                <div style="background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 12px; margin-bottom: 15px; border-radius: 4px; font-size: 13px;">
                    <strong>⚠️ Security Warning:</strong> This widget contains custom HTML. Only use HTML from trusted sources.
                </div>
            `;
        }

        // Wrap in container if enabled
        let content = processedHtml;
        if (wrapContent) {
            const containerStyles = `
                padding: ${containerPadding.size}${containerPadding.unit};
                background-color: ${containerBackground};
            `;
            content = `<div style="${containerStyles}">${processedHtml}</div>`;
        }

        const finalContent = `${warningHtml}${content}`;

        // Build wrapper classes
        let wrapperClasses = ['html-widget'];
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

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${finalContent}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(HTMLWidget);
