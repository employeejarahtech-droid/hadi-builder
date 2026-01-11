/**
 * ShortcodeWidget - WordPress-style shortcodes widget
 * Processes and renders shortcodes
 */
class ShortcodeWidget extends WidgetBase {
    getName() {
        return 'shortcode';
    }

    getTitle() {
        return 'Shortcode';
    }

    getIcon() {
        return 'fa fa-brackets-curly';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['shortcode', 'wordpress', 'dynamic', 'custom'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Shortcode',
            tab: 'content'
        });

        this.addControl('shortcode', {
            type: 'textarea',
            label: 'Shortcode',
            default_value: '[button text="Click Me" url="#" color="primary"]',
            placeholder: 'Enter shortcode, e.g., [button text="Click"]',
            label_block: true,
            description: 'Enter WordPress-style shortcode'
        });

        this.addControl('show_raw', {
            type: 'switch',
            label: 'Show Raw Shortcode',
            default_value: false,
            description: 'Display shortcode as plain text instead of processing'
        });

        this.endControlsSection();

        // Built-in Shortcodes Help
        this.startControlsSection('help_section', {
            label: 'Built-in Shortcodes',
            tab: 'content'
        });

        this.addControl('help_text', {
            type: 'text',
            label: 'Available Shortcodes',
            default_value: '',
            description: `
                [button text="Text" url="#" color="primary|secondary|success|danger"]
                [alert type="info|success|warning|danger" text="Message"]
                [year] - Current year
                [date format="Y-m-d"]
                [time format="H:i:s"]
            `,
            label_block: true
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    /**
     * Parse shortcode attributes
     */
    parseAttributes(attrString) {
        const attrs = {};
        const regex = /(\w+)=["']([^"']*)["']/g;
        let match;

        while ((match = regex.exec(attrString)) !== null) {
            attrs[match[1]] = match[2];
        }

        return attrs;
    }

    /**
     * Process shortcodes
     */
    processShortcode(shortcode) {
        // Button shortcode: [button text="Click" url="#" color="primary"]
        const buttonMatch = shortcode.match(/\[button\s+([^\]]+)\]/);
        if (buttonMatch) {
            const attrs = this.parseAttributes(buttonMatch[1]);
            const text = attrs.text || 'Button';
            const url = attrs.url || '#';
            const color = attrs.color || 'primary';

            const colorMap = {
                primary: '#3b82f6',
                secondary: '#6b7280',
                success: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
                info: '#06b6d4'
            };

            const bgColor = colorMap[color] || colorMap.primary;

            return `
                <a href="${this.escapeHtml(url)}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: ${bgColor};
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: opacity 0.3s;
                " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                    ${this.escapeHtml(text)}
                </a>
            `;
        }

        // Alert shortcode: [alert type="info" text="Message"]
        const alertMatch = shortcode.match(/\[alert\s+([^\]]+)\]/);
        if (alertMatch) {
            const attrs = this.parseAttributes(alertMatch[1]);
            const text = attrs.text || 'Alert message';
            const type = attrs.type || 'info';

            const typeMap = {
                info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
                success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
                warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
                danger: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
            };

            const colors = typeMap[type] || typeMap.info;

            return `
                <div style="
                    background-color: ${colors.bg};
                    border-left: 4px solid ${colors.border};
                    color: ${colors.text};
                    padding: 16px;
                    border-radius: 4px;
                    margin: 10px 0;
                ">
                    ${this.escapeHtml(text)}
                </div>
            `;
        }

        // Year shortcode: [year]
        if (shortcode.match(/\[year\]/)) {
            return new Date().getFullYear().toString();
        }

        // Date shortcode: [date format="Y-m-d"]
        const dateMatch = shortcode.match(/\[date(?:\s+format=["']([^"']*)["'])?\]/);
        if (dateMatch) {
            const format = dateMatch[1] || 'Y-m-d';
            const now = new Date();

            let dateStr = format;
            dateStr = dateStr.replace('Y', now.getFullYear());
            dateStr = dateStr.replace('m', String(now.getMonth() + 1).padStart(2, '0'));
            dateStr = dateStr.replace('d', String(now.getDate()).padStart(2, '0'));
            dateStr = dateStr.replace('H', String(now.getHours()).padStart(2, '0'));
            dateStr = dateStr.replace('i', String(now.getMinutes()).padStart(2, '0'));
            dateStr = dateStr.replace('s', String(now.getSeconds()).padStart(2, '0'));

            return dateStr;
        }

        // Time shortcode: [time format="H:i:s"]
        const timeMatch = shortcode.match(/\[time(?:\s+format=["']([^"']*)["'])?\]/);
        if (timeMatch) {
            const format = timeMatch[1] || 'H:i:s';
            const now = new Date();

            let timeStr = format;
            timeStr = timeStr.replace('H', String(now.getHours()).padStart(2, '0'));
            timeStr = timeStr.replace('i', String(now.getMinutes()).padStart(2, '0'));
            timeStr = timeStr.replace('s', String(now.getSeconds()).padStart(2, '0'));

            return timeStr;
        }

        // If no match, return original shortcode
        return `<span style="background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 3px; font-family: monospace; font-size: 13px;">Unknown shortcode: ${this.escapeHtml(shortcode)}</span>`;
    }

    render() {
        const shortcode = this.getSetting('shortcode', '[button text="Click Me" url="#" color="primary"]');
        const showRaw = this.getSetting('show_raw', false);

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

        // Process content
        let content;
        if (showRaw) {
            content = `<pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; font-family: monospace; font-size: 14px;">${this.escapeHtml(shortcode)}</pre>`;
        } else {
            // Process all shortcodes in the text
            const shortcodeRegex = /\[[^\]]+\]/g;
            content = shortcode.replace(shortcodeRegex, (match) => {
                return this.processShortcode(match);
            });
        }

        // Build wrapper classes
        let wrapperClasses = ['shortcode-widget'];
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

window.elementorWidgetManager.registerWidget(ShortcodeWidget);
