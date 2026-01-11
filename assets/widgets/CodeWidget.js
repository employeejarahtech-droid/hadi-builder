/**
 * CodeWidget - Code snippet widget
 * Displays code with syntax highlighting
 */
class CodeWidget extends WidgetBase {
    getName() {
        return 'code';
    }

    getTitle() {
        return 'Code';
    }

    getIcon() {
        return 'fa fa-code';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['code', 'snippet', 'syntax', 'programming', 'pre'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Code',
            tab: 'content'
        });

        this.addControl('code', {
            type: 'textarea',
            label: 'Code',
            default_value: 'function hello() {\n    console.log("Hello World!");\n}',
            placeholder: 'Enter your code',
            label_block: true,
            description: 'Enter your code snippet'
        });

        this.addControl('language', {
            type: 'select',
            label: 'Language',
            default_value: 'javascript',
            options: [
                { value: 'javascript', label: 'JavaScript' },
                { value: 'html', label: 'HTML' },
                { value: 'css', label: 'CSS' },
                { value: 'php', label: 'PHP' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
                { value: 'cpp', label: 'C++' },
                { value: 'csharp', label: 'C#' },
                { value: 'ruby', label: 'Ruby' },
                { value: 'go', label: 'Go' },
                { value: 'sql', label: 'SQL' },
                { value: 'json', label: 'JSON' },
                { value: 'xml', label: 'XML' },
                { value: 'bash', label: 'Bash' },
                { value: 'plaintext', label: 'Plain Text' }
            ]
        });

        this.addControl('show_language_label', {
            type: 'switch',
            label: 'Show Language Label',
            default_value: true,
            description: 'Display language name in top-right corner'
        });

        this.addControl('show_line_numbers', {
            type: 'switch',
            label: 'Show Line Numbers',
            default_value: false
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('theme', {
            type: 'select',
            label: 'Theme',
            default_value: 'light',
            options: [
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' }
            ]
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Custom Background',
            default_value: '',
            description: 'Override theme background color'
        });

        // Add text color control
        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '',
            description: 'Override theme text color'
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 14, unit: 'px' },
            range: {
                min: 10,
                max: 24,
                step: 1
            }
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

        this.addControl('padding', {
            type: 'slider',
            label: 'Padding',
            default_value: { size: 20, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            }
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            default_value: { size: 8, unit: 'px' },
            range: {
                min: 0,
                max: 30,
                step: 1
            }
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const code = this.getSetting('code', 'function hello() {\n    console.log("Hello World!");\n}');
        const language = this.getSetting('language', 'javascript');
        const showLanguageLabel = this.getSetting('show_language_label', true);
        const showLineNumbers = this.getSetting('show_line_numbers', false);
        const theme = this.getSetting('theme', 'light');
        const customBgColor = this.getSetting('background_color', '');
        const customTextColor = this.getSetting('text_color', '');
        const fontSize = this.getSetting('font_size', { size: 14, unit: 'px' });
        const lineHeight = this.getSetting('line_height', { size: 1.6, unit: '' });
        const padding = this.getSetting('padding', { size: 20, unit: 'px' });
        const borderRadius = this.getSetting('border_radius', { size: 8, unit: 'px' });

        // Helper to ensure valid size/unit
        const getSafeValue = (val, defaultSize, defaultUnit) => {
            if (!val) return { size: defaultSize, unit: defaultUnit };
            const size = (val.size !== undefined && val.size !== null) ? val.size : defaultSize;
            const unit = (val.unit !== undefined) ? val.unit : defaultUnit;
            return { size, unit };
        };

        const safeFontSize = getSafeValue(fontSize, 14, 'px');
        const safeLineHeight = getSafeValue(lineHeight, 1.6, '');
        const safePadding = getSafeValue(padding, 20, 'px');
        const safeBorderRadius = getSafeValue(borderRadius, 8, 'px');

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

        // Theme colors
        const themeColors = theme === 'dark' ? {
            background: '#1e1e1e',
            text: '#d4d4d4',
            keyword: '#569cd6',
            string: '#ce9178',
            comment: '#6a9955',
            function: '#dcdcaa',
            number: '#b5cea8',
            lineNumberBg: '#252526',
            lineNumberText: '#858585',
            labelBg: '#2d2d2d',
            labelText: '#cccccc'
        } : {
            background: '#ffffff',
            text: '#333333',
            keyword: '#0000ff',
            string: '#a31515',
            comment: '#008000',
            function: '#795e26',
            number: '#098658',
            lineNumberBg: '#e8e8e8',
            lineNumberText: '#666666',
            labelBg: '#e0e0e0',
            labelText: '#333333'
        };

        // Generate unique ID
        const uniqueId = `code-${Math.random().toString(36).substr(2, 9)}`;

        // Build container styles
        const containerStyles = `
            position: relative;
            background-color: ${customBgColor || themeColors.background};
            border-radius: ${safeBorderRadius.size}${safeBorderRadius.unit};
            overflow: hidden;
            font-family: 'Courier New', Courier, monospace;
        `;

        // Build language label
        let languageLabelHtml = '';
        if (showLanguageLabel) {
            const labelStyles = `
                position: absolute;
                top: 0;
                right: 0;
                background-color: ${themeColors.labelBg};
                color: ${themeColors.labelText};
                padding: 4px 12px;
                border-bottom-left-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                z-index: 1;
            `;
            languageLabelHtml = `<div style="${labelStyles}">${this.escapeHtml(language)}</div>`;
        }

        // Process code with line numbers if enabled
        let codeHtml = '';
        const lines = code.split('\n');

        if (showLineNumbers) {
            const lineNumberStyles = `
                display: inline-block;
                width: 40px;
                text-align: right;
                padding-right: 15px;
                margin-right: 15px;
                color: ${themeColors.lineNumberText};
                background-color: ${themeColors.lineNumberBg};
                user-select: none;
                border-right: 1px solid ${themeColors.lineNumberText};
            `;

            codeHtml = lines.map((line, index) => {
                return `<div style="display: flex;"><span style="${lineNumberStyles}">${index + 1}</span><span style="flex: 1;">${this.escapeHtml(line) || ' '}</span></div>`;
            }).join('');
        } else {
            codeHtml = this.escapeHtml(code);
        }

        // Build pre/code styles
        const preStyles = `
            margin: 0;
            padding: ${safePadding.size}${safePadding.unit};
            ${showLanguageLabel ? 'padding-top: 45px;' : ''}
            overflow-x: auto;
        `;

        const codeStyles = `
            color: ${customTextColor || themeColors.text};
            font-size: ${safeFontSize.size}${safeFontSize.unit};
            line-height: ${safeLineHeight.size}${safeLineHeight.unit};
            display: block;
            white-space: pre;
            word-wrap: normal;
        `;

        const content = `
            <div class="${uniqueId}" style="${containerStyles}">
                ${languageLabelHtml}
                <pre style="${preStyles}"><code style="${codeStyles}">${codeHtml}</code></pre>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['code-widget'];
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

window.elementorWidgetManager.registerWidget(CodeWidget);
