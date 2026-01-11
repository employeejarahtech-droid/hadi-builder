/**
 * ListWidget - Bulleted/numbered lists widget
 * Displays customizable lists with various styles
 */
class ListWidget extends WidgetBase {
    getName() {
        return 'list';
    }

    getTitle() {
        return 'List';
    }

    getIcon() {
        return 'fa fa-list';
    }

    getCategories() {
        return ['content'];
    }

    getKeywords() {
        return ['list', 'bullet', 'numbered', 'items', 'ul', 'ol'];
    }

    getDefaultSettings() {
        return {
            list_items: [
                { text: 'List Item 1' },
                { text: 'List Item 2' },
                { text: 'List Item 3' }
            ],
            list_type: 'unordered',
            marker_style: 'disc',
            text_color: '#333333',
            marker_color: '#3b82f6',
            font_size: { size: 16, unit: 'px' },
            item_spacing: { size: 10, unit: 'px' },
            css_classes: '',
            css_id: '',
            animation: 'none',
            animation_duration: { size: 0.5, unit: 's' },
            animation_delay: { size: 0, unit: 's' }
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'List Items',
            tab: 'content'
        });

        this.addControl('list_items', {
            type: 'repeater',
            label: 'Items',
            default_value: [
                { text: 'List Item 1' },
                { text: 'List Item 2' },
                { text: 'List Item 3' }
            ],
            fields: [
                {
                    id: 'text',
                    type: 'text',
                    label: 'Text',
                    default_value: 'List Item',
                    placeholder: 'Enter list item text'
                }
            ]
        });

        this.addControl('list_type', {
            type: 'select',
            label: 'List Type',
            default_value: 'unordered',
            options: [
                { value: 'unordered', label: 'Bulleted (ul)' },
                { value: 'ordered', label: 'Numbered (ol)' }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('marker_style', {
            type: 'select',
            label: 'Marker Style',
            default_value: 'disc',
            options: [
                { value: 'disc', label: 'Disc' },
                { value: 'circle', label: 'Circle' },
                { value: 'square', label: 'Square' },
                { value: 'decimal', label: 'Decimal (1, 2, 3)' },
                { value: 'decimal-leading-zero', label: 'Decimal Leading Zero (01, 02)' },
                { value: 'lower-alpha', label: 'Lower Alpha (a, b, c)' },
                { value: 'upper-alpha', label: 'Upper Alpha (A, B, C)' },
                { value: 'lower-roman', label: 'Lower Roman (i, ii, iii)' },
                { value: 'upper-roman', label: 'Upper Roman (I, II, III)' },
                { value: 'none', label: 'None' }
            ]
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#333333'
        });

        this.addControl('marker_color', {
            type: 'color',
            label: 'Marker Color',
            default_value: '#3b82f6'
        });

        this.addControl('font_size', {
            type: 'slider',
            label: 'Font Size',
            default_value: { size: 16, unit: 'px' },
            range: {
                min: 10,
                max: 50,
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

        this.addControl('item_spacing', {
            type: 'slider',
            label: 'Item Spacing',
            default_value: { size: 10, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            },
            description: 'Space between list items'
        });

        this.addControl('indent', {
            type: 'slider',
            label: 'Indent',
            default_value: { size: 20, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 1
            },
            description: 'Left padding/indent for list'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const listItems = this.getSetting('list_items', [
            { text: 'List Item 1' },
            { text: 'List Item 2' },
            { text: 'List Item 3' }
        ]);
        const listType = this.getSetting('list_type', 'unordered');
        const markerStyle = this.getSetting('marker_style', 'disc');
        const textColor = this.getSetting('text_color', '#333333');
        const markerColor = this.getSetting('marker_color', '#3b82f6');
        const fontSize = this.getSetting('font_size', { size: 16, unit: 'px' });
        const lineHeight = this.getSetting('line_height', { size: 1.6, unit: '' });
        const itemSpacing = this.getSetting('item_spacing', { size: 10, unit: 'px' });
        const indent = this.getSetting('indent', { size: 20, unit: 'px' });

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

        // Build list styles
        const listTag = listType === 'ordered' ? 'ol' : 'ul';
        const listStyles = `
            list-style-type: ${markerStyle};
            color: ${textColor};
            font-size: ${fontSize.size}${fontSize.unit};
            line-height: ${lineHeight.size}${lineHeight.unit};
            padding-left: ${indent.size}${indent.unit};
            margin: 0;
        `;

        // Generate unique ID for marker color
        const uniqueId = `list-${Math.random().toString(36).substr(2, 9)}`;

        // Add marker color styles
        const markerStyles = `
            <style>
                .${uniqueId} li::marker {
                    color: ${markerColor};
                }
                .${uniqueId} li {
                    margin-bottom: ${itemSpacing.size}${itemSpacing.unit};
                }
                .${uniqueId} li:last-child {
                    margin-bottom: 0;
                }
            </style>
        `;

        // Build list items
        const items = Array.isArray(listItems) ? listItems : [];
        const listItemsHtml = items.map(item => {
            const text = item.text || 'List Item';
            return `<li>${this.escapeHtml(text)}</li>`;
        }).join('');

        const content = `
            ${markerStyles}
            <${listTag} class="${uniqueId}" style="${listStyles}">
                ${listItemsHtml}
            </${listTag}>
        `;

        // Build wrapper classes
        let wrapperClasses = ['list-widget'];
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

window.elementorWidgetManager.registerWidget(ListWidget);
