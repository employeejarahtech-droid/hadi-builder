/**
 * TeamListWidget - List view of team widget
 * Displays team members in a vertical list format
 */
class TeamListWidget extends WidgetBase {
    getName() {
        return 'team_list';
    }

    getTitle() {
        return 'Team List';
    }

    getIcon() {
        return 'fa fa-list-ul';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['team', 'list', 'members', 'vertical', 'staff'];
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
                { name: 'John Doe', position: 'CEO', image: '', bio: 'Leading the company with vision and passion.' },
                { name: 'Jane Smith', position: 'CTO', image: '', bio: 'Driving technical innovation and excellence.' }
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
                    placeholder: 'Short bio'
                },
                {
                    id: 'email',
                    type: 'text',
                    label: 'Email',
                    default_value: '',
                    placeholder: 'email@example.com'
                }
            ]
        });

        this.endControlsSection();

        // Layout Section
        this.startControlsSection('layout_section', {
            label: 'Layout',
            tab: 'content'
        });

        this.addControl('layout_style', {
            type: 'select',
            label: 'Layout Style',
            default_value: 'alternating',
            options: [
                { value: 'left', label: 'Image Left' },
                { value: 'right', label: 'Image Right' },
                { value: 'alternating', label: 'Alternating' }
            ]
        });

        this.addControl('image_size', {
            type: 'slider',
            label: 'Image Size',
            default_value: { size: 100, unit: 'px' },
            range: {
                min: 60,
                max: 200,
                step: 10
            }
        });

        this.addControl('spacing', {
            type: 'slider',
            label: 'Item Spacing',
            default_value: { size: 30, unit: 'px' },
            range: {
                min: 10,
                max: 80,
                step: 5
            }
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
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

        this.addControl('show_divider', {
            type: 'switch',
            label: 'Show Divider',
            default_value: true
        });

        this.addControl('divider_color', {
            type: 'color',
            label: 'Divider Color',
            default_value: '#e5e7eb',
            condition: {
                terms: [
                    { name: 'show_divider', operator: '==', value: true }
                ]
            }
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
            { name: 'John Doe', position: 'CEO', image: '', bio: 'Leading the company with vision and passion.' },
            { name: 'Jane Smith', position: 'CTO', image: '', bio: 'Driving technical innovation and excellence.' }
        ]);
        const layoutStyle = this.getSetting('layout_style', 'alternating');
        const imageSize = this.getSetting('image_size', { size: 100, unit: 'px' });
        const spacing = this.getSetting('spacing', { size: 30, unit: 'px' });
        const imageShape = this.getSetting('image_shape', 'circle');
        const showDivider = this.getSetting('show_divider', true);
        const dividerColor = this.getSetting('divider_color', '#e5e7eb');
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

        // Determine border radius based on shape
        const borderRadiusMap = {
            square: '0',
            rounded: '12px',
            circle: '50%'
        };
        const imageBorderRadius = borderRadiusMap[imageShape] || borderRadiusMap.circle;

        // Build member items
        const membersArray = Array.isArray(members) ? members : [];
        const memberItems = membersArray.map((member, index) => {
            const name = member.name || 'Team Member';
            const position = member.position || 'Position';
            const bio = member.bio || '';
            const email = member.email || '';
            const image = member.image || '';

            // Determine layout direction
            let imagePosition = layoutStyle;
            if (layoutStyle === 'alternating') {
                imagePosition = index % 2 === 0 ? 'left' : 'right';
            }

            // Build image HTML
            let imageHtml = '';
            if (image) {
                imageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(name)}" style="width: ${imageSize.size}${imageSize.unit}; height: ${imageSize.size}${imageSize.unit}; border-radius: ${imageBorderRadius}; object-fit: cover; flex-shrink: 0;">`;
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                imageHtml = `<div style="width: ${imageSize.size}${imageSize.unit}; height: ${imageSize.size}${imageSize.unit}; border-radius: ${imageBorderRadius}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: ${imageSize.size / 3}${imageSize.unit}; font-weight: bold; flex-shrink: 0;">${initials}</div>`;
            }

            // Build email link
            const emailHtml = email ? `<a href="mailto:${this.escapeHtml(email)}" style="color: ${positionColor}; text-decoration: none; font-size: 14px; margin-top: 8px; display: inline-block;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'"><i class="fa fa-envelope"></i> ${this.escapeHtml(email)}</a>` : '';

            // Build content
            const contentHtml = `
                <div style="flex: 1;">
                    <h3 style="color: ${nameColor}; font-size: 20px; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(name)}</h3>
                    <p style="color: ${positionColor}; font-size: 14px; font-weight: 500; margin: 0 0 10px 0;">${this.escapeHtml(position)}</p>
                    ${bio ? `<p style="color: ${bioColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(bio)}</p>` : ''}
                    ${emailHtml}
                </div>
            `;

            // Build item layout
            const itemStyles = `
                display: flex;
                gap: 25px;
                align-items: ${bio ? 'flex-start' : 'center'};
                flex-direction: ${imagePosition === 'right' ? 'row-reverse' : 'row'};
                padding-bottom: ${spacing.size}${spacing.unit};
                margin-bottom: ${spacing.size}${spacing.unit};
                ${showDivider && index < membersArray.length - 1 ? `border-bottom: 1px solid ${dividerColor};` : ''}
            `;

            return `
                <div style="${itemStyles}">
                    ${imageHtml}
                    ${contentHtml}
                </div>
            `;
        }).join('');

        const content = `<div>${memberItems}</div>`;

        // Build wrapper classes
        let wrapperClasses = ['team-list-widget'];
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

window.elementorWidgetManager.registerWidget(TeamListWidget);
