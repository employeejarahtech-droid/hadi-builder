/**
 * MarkdownWidget - Markdown content renderer widget
 * Renders markdown syntax as formatted HTML
 */
class MarkdownWidget extends WidgetBase {
    getName() {
        return 'markdown';
    }

    getTitle() {
        return 'Markdown';
    }

    getIcon() {
        return 'fa fa-markdown';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['markdown', 'md', 'text', 'formatting', 'content'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('markdown', {
            type: 'textarea',
            label: 'Markdown Content',
            default_value: '# Heading 1\n\nThis is **bold** and this is *italic*.\n\n- List item 1\n- List item 2\n- List item 3\n\n[Link text](https://example.com)',
            placeholder: 'Enter markdown content',
            label_block: true,
            description: 'Write your content using markdown syntax'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#333333'
        });

        this.addControl('link_color', {
            type: 'color',
            label: 'Link Color',
            default_value: '#3b82f6'
        });

        this.addControl('heading_color', {
            type: 'color',
            label: 'Heading Color',
            default_value: '#1a1a1a'
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Base Font Size',
            default_value: { size: 16, unit: 'px' },
            range: {
                min: 12,
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

    /**
     * Simple markdown parser
     * Converts basic markdown syntax to HTML
     */
    parseMarkdown(markdown) {
        let html = markdown;

        // Escape HTML first
        html = this.escapeHtml(html);

        // Headers (must be before other replacements)
        html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
        html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
        html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // Strikethrough
        html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

        // Inline code
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');

        // Links
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Images
        html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr>');
        html = html.replace(/^\*\*\*$/gm, '<hr>');

        // Blockquotes
        html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');

        // Unordered lists
        const lines = html.split('\n');
        let inList = false;
        let result = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const listMatch = line.match(/^[-*+]\s+(.+)$/);

            if (listMatch) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                }
                result.push(`<li>${listMatch[1]}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                result.push(line);
            }
        }

        if (inList) {
            result.push('</ul>');
        }

        html = result.join('\n');

        // Ordered lists
        lines.length = 0;
        result.length = 0;
        const newLines = html.split('\n');
        inList = false;

        for (let i = 0; i < newLines.length; i++) {
            const line = newLines[i];
            const listMatch = line.match(/^\d+\.\s+(.+)$/);

            if (listMatch) {
                if (!inList) {
                    result.push('<ol>');
                    inList = true;
                }
                result.push(`<li>${listMatch[1]}</li>`);
            } else {
                if (inList) {
                    result.push('</ol>');
                    inList = false;
                }
                result.push(line);
            }
        }

        if (inList) {
            result.push('</ol>');
        }

        html = result.join('\n');

        // Paragraphs (wrap non-tag lines)
        html = html.split('\n').map(line => {
            line = line.trim();
            if (line === '') return '<br>';
            if (line.match(/^<(h[1-6]|ul|ol|li|blockquote|hr|img)/)) return line;
            if (line.match(/^<\/(ul|ol|blockquote)>/)) return line;
            return `<p>${line}</p>`;
        }).join('\n');

        return html;
    }

    render() {
        const markdown = this.getSetting('markdown', '# Heading 1\n\nThis is **bold** and this is *italic*.\n\n- List item 1\n- List item 2\n- List item 3\n\n[Link text](https://example.com)');
        const textColor = this.getSetting('text_color', '#333333');
        const linkColor = this.getSetting('link_color', '#3b82f6');
        const headingColor = this.getSetting('heading_color', '#1a1a1a');
        const fontSize = this.getSetting('font_size', { size: 16, unit: 'px' });
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

        // Parse markdown to HTML
        const htmlContent = this.parseMarkdown(markdown);

        // Generate unique ID for styles
        const uniqueId = `markdown-${Math.random().toString(36).substr(2, 9)}`;

        // Build styles
        const styles = `
            <style>
                .${uniqueId} {
                    color: ${textColor};
                    font-size: ${fontSize.size}${fontSize.unit};
                    line-height: ${lineHeight.size}${lineHeight.unit};
                }
                .${uniqueId} h1, .${uniqueId} h2, .${uniqueId} h3, 
                .${uniqueId} h4, .${uniqueId} h5, .${uniqueId} h6 {
                    color: ${headingColor};
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    font-weight: 600;
                }
                .${uniqueId} h1 { font-size: 2em; }
                .${uniqueId} h2 { font-size: 1.5em; }
                .${uniqueId} h3 { font-size: 1.25em; }
                .${uniqueId} h4 { font-size: 1.1em; }
                .${uniqueId} h5 { font-size: 1em; }
                .${uniqueId} h6 { font-size: 0.9em; }
                .${uniqueId} a {
                    color: ${linkColor};
                    text-decoration: underline;
                }
                .${uniqueId} a:hover {
                    opacity: 0.8;
                }
                .${uniqueId} p {
                    margin: 0.5em 0;
                }
                .${uniqueId} ul, .${uniqueId} ol {
                    margin: 1em 0;
                    padding-left: 2em;
                }
                .${uniqueId} li {
                    margin: 0.25em 0;
                }
                .${uniqueId} code {
                    background-color: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 0.9em;
                }
                .${uniqueId} blockquote {
                    border-left: 4px solid ${linkColor};
                    padding-left: 1em;
                    margin: 1em 0;
                    font-style: italic;
                    opacity: 0.8;
                }
                .${uniqueId} hr {
                    border: none;
                    border-top: 2px solid #e0e0e0;
                    margin: 2em 0;
                }
                .${uniqueId} img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 1em 0;
                }
            </style>
        `;

        const content = `
            ${styles}
            <div class="${uniqueId}">
                ${htmlContent}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['markdown-widget'];
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

window.elementorWidgetManager.registerWidget(MarkdownWidget);
