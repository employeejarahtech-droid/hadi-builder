/**
 * OrganizationChartWidget - Org chart diagram widget
 * Displays organizational hierarchy in a tree structure
 */
class OrganizationChartWidget extends WidgetBase {
    getName() {
        return 'organization_chart';
    }

    getTitle() {
        return 'Organization Chart';
    }

    getIcon() {
        return 'fa fa-sitemap';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['organization', 'chart', 'hierarchy', 'org', 'structure', 'tree'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Organization Structure',
            tab: 'content'
        });

        this.addControl('chart_data', {
            type: 'repeater',
            label: 'Positions',
            default_value: [
                { name: 'CEO', title: 'Chief Executive Officer', level: '1', parent: '', image: '' },
                { name: 'CTO', title: 'Chief Technology Officer', level: '2', parent: 'CEO', image: '' },
                { name: 'CFO', title: 'Chief Financial Officer', level: '2', parent: 'CEO', image: '' },
                { name: 'Dev Manager', title: 'Development Manager', level: '3', parent: 'CTO', image: '' }
            ],
            fields: [
                {
                    id: 'name',
                    type: 'text',
                    label: 'Name',
                    default_value: 'Position',
                    placeholder: 'Enter name'
                },
                {
                    id: 'title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Title',
                    placeholder: 'Enter job title'
                },
                {
                    id: 'level',
                    type: 'text',
                    label: 'Level',
                    default_value: '1',
                    placeholder: '1, 2, 3...'
                },
                {
                    id: 'parent',
                    type: 'text',
                    label: 'Reports To',
                    default_value: '',
                    placeholder: 'Parent name (leave empty for top level)'
                },
                {
                    id: 'image',
                    type: 'media',
                    label: 'Photo',
                    default_value: ''
                }
            ]
        });

        this.endControlsSection();

        // Layout Section
        this.startControlsSection('layout_section', {
            label: 'Layout',
            tab: 'content'
        });

        this.addControl('orientation', {
            type: 'select',
            label: 'Orientation',
            default_value: 'vertical',
            options: [
                { value: 'vertical', label: 'Vertical (Top to Bottom)' },
                { value: 'horizontal', label: 'Horizontal (Left to Right)' }
            ]
        });

        this.addControl('spacing', {
            type: 'slider',
            label: 'Node Spacing',
            default_value: { size: 40, unit: 'px' },
            range: {
                min: 20,
                max: 100,
                step: 10
            }
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Node Style',
            tab: 'style'
        });

        this.addControl('node_background', {
            type: 'color',
            label: 'Node Background',
            default_value: '#ffffff'
        });

        this.addControl('node_border', {
            type: 'color',
            label: 'Node Border',
            default_value: '#3b82f6'
        });

        this.addControl('line_color', {
            type: 'color',
            label: 'Connection Line Color',
            default_value: '#d1d5db'
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#1a1a1a'
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const chartData = this.getSetting('chart_data', [
            { name: 'CEO', title: 'Chief Executive Officer', level: '1', parent: '', image: '' },
            { name: 'CTO', title: 'Chief Technology Officer', level: '2', parent: 'CEO', image: '' },
            { name: 'CFO', title: 'Chief Financial Officer', level: '2', parent: 'CEO', image: '' },
            { name: 'Dev Manager', title: 'Development Manager', level: '3', parent: 'CTO', image: '' }
        ]);
        const orientation = this.getSetting('orientation', 'vertical');
        const spacing = this.getSetting('spacing', { size: 40, unit: 'px' });
        const nodeBackground = this.getSetting('node_background', '#ffffff');
        const nodeBorder = this.getSetting('node_border', '#3b82f6');
        const lineColor = this.getSetting('line_color', '#d1d5db');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const titleColor = this.getSetting('title_color', '#666666');

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

        // Generate unique ID
        const uniqueId = `org-chart-${Math.random().toString(36).substr(2, 9)}`;

        // Organize data by levels
        const dataArray = Array.isArray(chartData) ? chartData : [];
        const levels = {};
        dataArray.forEach(item => {
            const level = item.level || '1';
            if (!levels[level]) levels[level] = [];
            levels[level].push(item);
        });

        // Build node HTML
        const buildNode = (item) => {
            const name = item.name || 'Position';
            const title = item.title || 'Title';
            const image = item.image || '';

            let imageHtml = '';
            if (image) {
                imageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(name)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">`;
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                imageHtml = `<div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-bottom: 10px;">${initials}</div>`;
            }

            return `
                <div class="${uniqueId}-node" data-name="${this.escapeHtml(name)}" style="background: ${nodeBackground}; border: 2px solid ${nodeBorder}; border-radius: 8px; padding: 15px; min-width: 150px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                    ${imageHtml}
                    <div style="color: ${nameColor}; font-size: 14px; font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(name)}</div>
                    <div style="color: ${titleColor}; font-size: 12px;">${this.escapeHtml(title)}</div>
                </div>
            `;
        };

        // Build chart by levels
        const sortedLevels = Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b));
        const chartHtml = sortedLevels.map(level => {
            const nodes = levels[level].map(item => buildNode(item)).join('');
            return `
                <div class="${uniqueId}-level" style="display: flex; justify-content: center; gap: ${spacing.size}${spacing.unit}; flex-wrap: wrap; position: relative;">
                    ${nodes}
                </div>
            `;
        }).join(`<div style="height: ${spacing.size}${spacing.unit}; position: relative; display: flex; justify-content: center;"><div style="width: 2px; background: ${lineColor}; height: 100%;"></div></div>`);

        // Build styles
        const chartStyles = `
            <style>
                .${uniqueId} {
                    display: flex;
                    flex-direction: ${orientation === 'vertical' ? 'column' : 'row'};
                    align-items: ${orientation === 'vertical' ? 'center' : 'flex-start'};
                    gap: ${spacing.size}${spacing.unit};
                    padding: 20px;
                    overflow-x: auto;
                }
            </style>
        `;

        const content = `
            ${chartStyles}
            <div class="${uniqueId}">
                ${chartHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['organization-chart-widget'];
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

window.elementorWidgetManager.registerWidget(OrganizationChartWidget);
