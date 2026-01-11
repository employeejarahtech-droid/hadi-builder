/**
 * TeamGridWidget - Team member grid widget
 * Displays multiple team members in a responsive grid
 */
class TeamGridWidget extends WidgetBase {
    getName() {
        return 'team_grid';
    }

    getTitle() {
        return 'Team Grid';
    }

    getIcon() {
        return 'fa fa-users';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['team', 'grid', 'members', 'staff', 'employees', 'people'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Team Members',
            tab: 'content'
        });

        this.addControl('members', {
            type: 'repeater',
            label: 'Members',
            default_value: [
                { name: 'John Doe', position: 'CEO', image: '', bio: 'Leading the company vision.' },
                { name: 'Jane Smith', position: 'CTO', image: '', bio: 'Driving technical innovation.' },
                { name: 'Mike Johnson', position: 'CFO', image: '', bio: 'Managing financial strategy.' }
            ],
            fields: [
                {
                    id: 'image',
                    type: 'media',
                    label: 'Photo',
                    default_value: ''
                },
                {
                    id: 'name',
                    type: 'text',
                    label: 'Name',
                    default_value: 'Team Member',
                    placeholder: 'Enter name'
                },
                {
                    id: 'position',
                    type: 'text',
                    label: 'Position',
                    default_value: 'Position',
                    placeholder: 'Enter position'
                },
                {
                    id: 'bio',
                    type: 'textarea',
                    label: 'Bio',
                    default_value: '',
                    placeholder: 'Short bio (optional)'
                }
            ]
        });

        this.endControlsSection();

        // Layout Section
        this.startControlsSection('layout_section', {
            label: 'Layout',
            tab: 'content'
        });

        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            default_value: '3',
            options: [
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' },
                { value: '5', label: '5 Columns' }
            ],
            responsive: true
        });

        this.addControl('gap', {
            type: 'slider',
            label: 'Gap',
            default_value: { size: 30, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 5
            }
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Card Style',
            tab: 'style'
        });

        this.addControl('image_shape', {
            type: 'select',
            label: 'Image Shape',
            default_value: 'circle',
            options: [
                { value: 'square', label: 'Square' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'circle', label: 'Circle' }
            ]
        });

        this.addControl('card_background', {
            type: 'color',
            label: 'Card Background',
            default_value: '#ffffff'
        });

        this.addControl('card_padding', {
            type: 'slider',
            label: 'Card Padding',
            default_value: { size: 30, unit: 'px' },
            range: {
                min: 0,
                max: 60,
                step: 5
            }
        });

        this.addControl('card_border', {
            type: 'switch',
            label: 'Show Border',
            default_value: true
        });

        this.addControl('card_shadow', {
            type: 'switch',
            label: 'Show Shadow',
            default_value: true
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#1a1a1a'
        });

        this.addControl('position_color', {
            type: 'color',
            label: 'Position Color',
            default_value: '#3b82f6'
        });

        this.addControl('bio_color', {
            type: 'color',
            label: 'Bio Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const members = this.getSetting('members', [
            { name: 'John Doe', position: 'CEO', image: '', bio: 'Leading the company vision.' },
            { name: 'Jane Smith', position: 'CTO', image: '', bio: 'Driving technical innovation.' },
            { name: 'Mike Johnson', position: 'CFO', image: '', bio: 'Managing financial strategy.' }
        ]);
        const columns = this.getSetting('columns', '3');
        const gap = this.getSetting('gap', { size: 30, unit: 'px' });
        const imageShape = this.getSetting('image_shape', 'circle');
        const cardBackground = this.getSetting('card_background', '#ffffff');
        const cardPadding = this.getSetting('card_padding', { size: 30, unit: 'px' });
        const cardBorder = this.getSetting('card_border', true);
        const cardShadow = this.getSetting('card_shadow', true);
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const positionColor = this.getSetting('position_color', '#3b82f6');
        const bioColor = this.getSetting('bio_color', '#666666');

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
        const uniqueId = `team-grid-${Math.random().toString(36).substr(2, 9)}`;

        // Determine border radius based on shape
        const borderRadiusMap = {
            square: '0',
            rounded: '12px',
            circle: '50%'
        };
        const imageBorderRadius = borderRadiusMap[imageShape] || borderRadiusMap.circle;

        // Build grid styles
        const gridStyles = `
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            gap: ${gap.size}${gap.unit};
        `;

        // Build card styles
        const cardStyles = `
            background-color: ${cardBackground};
            padding: ${cardPadding.size}${cardPadding.unit};
            border-radius: 8px;
            text-align: center;
            ${cardBorder ? 'border: 1px solid #e5e7eb;' : ''}
            ${cardShadow ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);' : ''}
            transition: transform 0.3s, box-shadow 0.3s;
        `;

        const cardHoverStyle = cardShadow
            ? 'onmouseover="this.style.transform=\'translateY(-5px)\'; this.style.boxShadow=\'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)\'" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)\'"'
            : '';

        // Build member cards
        const membersArray = Array.isArray(members) ? members : [];
        const memberCards = membersArray.map(member => {
            const name = member.name || 'Team Member';
            const position = member.position || 'Position';
            const bio = member.bio || '';
            const image = member.image || '';

            // Build image HTML
            let imageHtml = '';
            if (image) {
                imageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(name)}" style="width: 120px; height: 120px; border-radius: ${imageBorderRadius}; object-fit: cover; margin: 0 auto 20px;">`;
            } else {
                // Gradient placeholder with initials
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                imageHtml = `<div style="width: 120px; height: 120px; border-radius: ${imageBorderRadius}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; font-weight: bold; margin: 0 auto 20px;">${initials}</div>`;
            }

            const bioHtml = bio ? `<p style="color: ${bioColor}; font-size: 14px; line-height: 1.6; margin: 12px 0 0 0;">${this.escapeHtml(bio)}</p>` : '';

            return `
                <div style="${cardStyles}" ${cardHoverStyle}>
                    ${imageHtml}
                    <h3 style="color: ${nameColor}; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">${this.escapeHtml(name)}</h3>
                    <p style="color: ${positionColor}; font-size: 14px; font-weight: 500; margin: 0;">${this.escapeHtml(position)}</p>
                    ${bioHtml}
                </div>
            `;
        }).join('');

        const content = `
            <div class="${uniqueId}" style="${gridStyles}">
                ${memberCards}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['team-grid-widget'];
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

window.elementorWidgetManager.registerWidget(TeamGridWidget);
