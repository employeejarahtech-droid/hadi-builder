/**
 * ContributorWidget - Contributors list widget
 * Displays project/content contributors with roles and links
 */
class ContributorWidget extends WidgetBase {
    getName() {
        return 'contributor';
    }

    getTitle() {
        return 'Contributor';
    }

    getIcon() {
        return 'fa fa-hands-helping';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['contributor', 'author', 'collaborator', 'participant', 'credit'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Contributors',
            tab: 'content'
        });

        this.addControl('contributors', {
            type: 'repeater',
            label: 'Contributors',
            default_value: [
                { name: 'Alex Thompson', role: 'Lead Developer', contribution: '150 commits', image: '', website: '', github: '' },
                { name: 'Sarah Miller', role: 'Designer', contribution: '45 designs', image: '', website: '', github: '' },
                { name: 'David Lee', role: 'Documentation', contribution: '30 articles', image: '', website: '', github: '' }
            ],
            fields: [
                {
                    id: 'image',
                    type: 'media',
                    label: 'Avatar',
                    default_value: ''
                },
                {
                    id: 'name',
                    type: 'text',
                    label: 'Name',
                    default_value: 'Contributor',
                    placeholder: 'Enter name'
                },
                {
                    id: 'role',
                    type: 'text',
                    label: 'Role',
                    default_value: 'Contributor',
                    placeholder: 'e.g., Developer, Designer'
                },
                {
                    id: 'contribution',
                    type: 'text',
                    label: 'Contribution',
                    default_value: '',
                    placeholder: 'e.g., 100 commits, 20 designs'
                },
                {
                    id: 'website',
                    type: 'url',
                    label: 'Website',
                    default_value: '',
                    placeholder: 'https://example.com'
                },
                {
                    id: 'github',
                    type: 'url',
                    label: 'GitHub',
                    default_value: '',
                    placeholder: 'https://github.com/username'
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
            default_value: 'compact',
            options: [
                { value: 'compact', label: 'Compact List' },
                { value: 'cards', label: 'Cards Grid' },
                { value: 'inline', label: 'Inline Avatars' }
            ]
        });

        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            default_value: '3',
            options: [
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' }
            ],
            condition: {
                terms: [
                    { name: 'layout_style', operator: '==', value: 'cards' }
                ]
            }
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#1a1a1a'
        });

        this.addControl('role_color', {
            type: 'color',
            label: 'Role Color',
            default_value: '#3b82f6'
        });

        this.addControl('contribution_color', {
            type: 'color',
            label: 'Contribution Color',
            default_value: '#666666'
        });

        this.addControl('link_color', {
            type: 'color',
            label: 'Link Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const contributors = this.getSetting('contributors', [
            { name: 'Alex Thompson', role: 'Lead Developer', contribution: '150 commits', image: '', website: '', github: '' },
            { name: 'Sarah Miller', role: 'Designer', contribution: '45 designs', image: '', website: '', github: '' },
            { name: 'David Lee', role: 'Documentation', contribution: '30 articles', image: '', website: '', github: '' }
        ]);
        const layoutStyle = this.getSetting('layout_style', 'compact');
        const columns = this.getSetting('columns', '3');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const roleColor = this.getSetting('role_color', '#3b82f6');
        const contributionColor = this.getSetting('contribution_color', '#666666');
        const linkColor = this.getSetting('link_color', '#3b82f6');

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

        const contributorsArray = Array.isArray(contributors) ? contributors : [];

        let content = '';

        if (layoutStyle === 'compact') {
            // Compact list layout
            const items = contributorsArray.map(contributor => {
                const name = contributor.name || 'Contributor';
                const role = contributor.role || 'Contributor';
                const contribution = contributor.contribution || '';
                const website = contributor.website || '';
                const github = contributor.github || '';
                const image = contributor.image;
                const imageUrl = (image && image.url) ? image.url : image;

                const avatarSize = '50px';
                let avatarHtml = '';
                if (imageUrl) {
                    avatarHtml = `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(name)}" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; object-fit: cover;">`;
                } else {
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    avatarHtml = `<div style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">${initials}</div>`;
                }

                const links = [];
                if (website) links.push(`<a href="${this.escapeHtml(website)}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; font-size: 14px;" title="Website"><i class="fas fa-globe"></i></a>`);
                if (github) links.push(`<a href="${this.escapeHtml(github)}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; font-size: 14px;" title="GitHub"><i class="fab fa-github"></i></a>`);
                const linksHtml = links.length > 0 ? `<div style="display: flex; gap: 10px;">${links.join('')}</div>` : '';

                return `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        ${avatarHtml}
                        <div style="flex: 1;">
                            <div style="color: ${nameColor}; font-size: 16px; font-weight: 600;">${this.escapeHtml(name)}</div>
                            <div style="color: ${roleColor}; font-size: 13px; margin-top: 2px;">${this.escapeHtml(role)}</div>
                            ${contribution ? `<div style="color: ${contributionColor}; font-size: 12px; margin-top: 4px;">${this.escapeHtml(contribution)}</div>` : ''}
                        </div>
                        ${linksHtml}
                    </div>
                `;
            }).join('');
            content = `<div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">${items}</div>`;

        } else if (layoutStyle === 'cards') {
            // Cards grid layout
            const cards = contributorsArray.map(contributor => {
                const name = contributor.name || 'Contributor';
                const role = contributor.role || 'Contributor';
                const contribution = contributor.contribution || '';
                const website = contributor.website || '';
                const github = contributor.github || '';
                const image = contributor.image;
                const imageUrl = (image && image.url) ? image.url : image;

                let avatarHtml = '';
                if (imageUrl) {
                    avatarHtml = `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(name)}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px;">`;
                } else {
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    avatarHtml = `<div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold; margin: 0 auto 15px;">${initials}</div>`;
                }

                const links = [];
                if (website) links.push(`<a href="${this.escapeHtml(website)}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; font-size: 16px;" title="Website"><i class="fas fa-globe"></i></a>`);
                if (github) links.push(`<a href="${this.escapeHtml(github)}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; font-size: 16px;" title="GitHub"><i class="fab fa-github"></i></a>`);
                const linksHtml = links.length > 0 ? `<div style="display: flex; gap: 12px; justify-content: center; margin-top: 12px;">${links.join('')}</div>` : '';

                return `
                    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        ${avatarHtml}
                        <div style="color: ${nameColor}; font-size: 16px; font-weight: 600;">${this.escapeHtml(name)}</div>
                        <div style="color: ${roleColor}; font-size: 13px; margin-top: 4px;">${this.escapeHtml(role)}</div>
                        ${contribution ? `<div style="color: ${contributionColor}; font-size: 12px; margin-top: 6px;">${this.escapeHtml(contribution)}</div>` : ''}
                        ${linksHtml}
                    </div>
                `;
            }).join('');
            content = `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px;">${cards}</div>`;

        } else if (layoutStyle === 'inline') {
            // Inline avatars layout
            const avatars = contributorsArray.map(contributor => {
                const name = contributor.name || 'Contributor';
                const image = contributor.image;
                const imageUrl = (image && image.url) ? image.url : image;

                if (imageUrl) {
                    return `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(name)}" title="${this.escapeHtml(name)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
                } else {
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    return `<div title="${this.escapeHtml(name)}" style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${initials}</div>`;
                }
            }).join('');
            content = `<div style="display: flex; flex-wrap: wrap; gap: -10px;">${avatars}</div>`;
        }

        // Build wrapper classes
        let wrapperClasses = ['contributor-widget'];
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

window.elementorWidgetManager.registerWidget(ContributorWidget);
