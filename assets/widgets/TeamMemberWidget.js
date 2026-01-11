/**
 * TeamMemberWidget - Individual team card widget
 * Displays team member profile with photo, info, and social links
 */
class TeamMemberWidget extends WidgetBase {
    getName() {
        return 'team_member';
    }

    getTitle() {
        return 'Team Member';
    }

    getIcon() {
        return 'fa fa-user';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['team', 'member', 'profile', 'staff', 'employee', 'person'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Member Info',
            tab: 'content'
        });

        this.addControl('image', {
            type: 'media',
            label: 'Photo',
            default_value: '',
            description: 'Team member photo'
        });

        this.addControl('name', {
            type: 'text',
            label: 'Name',
            default_value: 'John Doe',
            placeholder: 'Enter name',
            label_block: true
        });

        this.addControl('position', {
            type: 'text',
            label: 'Position',
            default_value: 'CEO & Founder',
            placeholder: 'Enter position/title',
            label_block: true
        });

        this.addControl('bio', {
            type: 'textarea',
            label: 'Bio',
            default_value: 'Passionate about innovation and leading teams to success.',
            placeholder: 'Enter short bio',
            label_block: true
        });

        this.endControlsSection();

        // Social Links Section
        this.startControlsSection('social_section', {
            label: 'Social Links',
            tab: 'content'
        });

        this.addControl('email', {
            type: 'text',
            label: 'Email',
            default_value: '',
            placeholder: 'email@example.com'
        });

        this.addControl('linkedin', {
            type: 'url',
            label: 'LinkedIn',
            default_value: '',
            placeholder: 'https://linkedin.com/in/username'
        });

        this.addControl('twitter', {
            type: 'url',
            label: 'Twitter',
            default_value: '',
            placeholder: 'https://twitter.com/username'
        });

        this.addControl('facebook', {
            type: 'url',
            label: 'Facebook',
            default_value: '',
            placeholder: 'https://facebook.com/username'
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

        this.addControl('image_size', {
            type: 'slider',
            label: 'Image Size',
            default_value: { size: 150, unit: 'px' },
            range: {
                min: 80,
                max: 300,
                step: 10
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

        this.addControl('social_color', {
            type: 'color',
            label: 'Social Icons Color',
            default_value: '#999999'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const image = this.getSetting('image', '');
        const name = this.getSetting('name', 'John Doe');
        const position = this.getSetting('position', 'CEO & Founder');
        const bio = this.getSetting('bio', 'Passionate about innovation and leading teams to success.');
        const email = this.getSetting('email', '');
        const linkedin = this.getSetting('linkedin', '');
        const twitter = this.getSetting('twitter', '');
        const facebook = this.getSetting('facebook', '');
        const align = this.getSetting('align', 'center');
        const imageShape = this.getSetting('image_shape', 'circle');
        const imageSize = this.getSetting('image_size', { size: 150, unit: 'px' });
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const positionColor = this.getSetting('position_color', '#3b82f6');
        const bioColor = this.getSetting('bio_color', '#666666');
        const socialColor = this.getSetting('social_color', '#999999');

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
        const borderRadius = borderRadiusMap[imageShape] || borderRadiusMap.circle;

        // Build image HTML
        let imageHtml = '';
        if (image) {
            const imageStyles = `
                width: ${imageSize.size}${imageSize.unit};
                height: ${imageSize.size}${imageSize.unit};
                border-radius: ${borderRadius};
                object-fit: cover;
                margin-bottom: 20px;
            `;
            imageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(name)}" style="${imageStyles}">`;
        } else {
            // Placeholder
            const placeholderStyles = `
                width: ${imageSize.size}${imageSize.unit};
                height: ${imageSize.size}${imageSize.unit};
                border-radius: ${borderRadius};
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: ${imageSize.size / 3}${imageSize.unit};
                font-weight: bold;
                margin-bottom: 20px;
            `;
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            imageHtml = `<div style="${placeholderStyles}">${initials}</div>`;
        }

        // Build social links
        const socialLinks = [];
        if (email) {
            socialLinks.push(`<a href="mailto:${this.escapeHtml(email)}" style="color: ${socialColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Email"><i class="fa fa-envelope"></i></a>`);
        }
        if (linkedin) {
            socialLinks.push(`<a href="${this.escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" style="color: ${socialColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="LinkedIn"><i class="fa fa-linkedin"></i></a>`);
        }
        if (twitter) {
            socialLinks.push(`<a href="${this.escapeHtml(twitter)}" target="_blank" rel="noopener noreferrer" style="color: ${socialColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Twitter"><i class="fa fa-twitter"></i></a>`);
        }
        if (facebook) {
            socialLinks.push(`<a href="${this.escapeHtml(facebook)}" target="_blank" rel="noopener noreferrer" style="color: ${socialColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Facebook"><i class="fa fa-facebook"></i></a>`);
        }

        const socialHtml = socialLinks.length > 0
            ? `<div style="display: flex; gap: 15px; justify-content: ${align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'}; margin-top: 15px;">${socialLinks.join('')}</div>`
            : '';

        // Build card content
        const cardStyles = `
            text-align: ${align};
            display: flex;
            flex-direction: column;
            align-items: ${align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'};
        `;

        const nameStyles = `
            color: ${nameColor};
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 8px 0;
        `;

        const positionStyles = `
            color: ${positionColor};
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 12px 0;
        `;

        const bioStyles = `
            color: ${bioColor};
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
        `;

        const content = `
            <div style="${cardStyles}">
                ${imageHtml}
                <h3 style="${nameStyles}">${this.escapeHtml(name)}</h3>
                <p style="${positionStyles}">${this.escapeHtml(position)}</p>
                <p style="${bioStyles}">${this.escapeHtml(bio)}</p>
                ${socialHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['team-member-widget'];
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

window.elementorWidgetManager.registerWidget(TeamMemberWidget);
