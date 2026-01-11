/**
 * BoardMembersWidget - Board members widget
 * Displays board members with credentials and affiliations
 */
console.log('Loading BoardMembersWidget.js...');

class BoardMembersWidget extends WidgetBase {
    getName() {
        return 'board_members';
    }

    getTitle() {
        return 'Board Members';
    }
    // ... (omitting unchanged lines for brevity in tool call, but conceptually replacing the class definition)

    getIcon() {
        return 'fa fa-user-graduate';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['advisory', 'board', 'advisors', 'council', 'committee'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Board Members',
            tab: 'content'
        });

        this.addControl('members', {
            type: 'repeater',
            label: 'Members',
            default_value: [
                { name: 'Dr. James Wilson', title: 'Strategic Advisor', credentials: 'PhD, MBA', affiliation: 'Stanford University', image: '', linkedin: '' },
                { name: 'Prof. Maria Garcia', title: 'Technology Advisor', credentials: 'PhD, Computer Science', affiliation: 'MIT', image: '', linkedin: '' },
                { name: 'Robert Chen', title: 'Financial Advisor', credentials: 'CFA, MBA', affiliation: 'Goldman Sachs', image: '', linkedin: '' }
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
                    default_value: 'Board Member',
                    placeholder: 'Enter name'
                },
                {
                    id: 'title',
                    type: 'text',
                    label: 'Advisory Title',
                    default_value: 'Advisor',
                    placeholder: 'e.g., Strategic Advisor'
                },
                {
                    id: 'credentials',
                    type: 'text',
                    label: 'Credentials',
                    default_value: '',
                    placeholder: 'e.g., PhD, MBA, CFA'
                },
                {
                    id: 'affiliation',
                    type: 'text',
                    label: 'Affiliation',
                    default_value: '',
                    placeholder: 'Company or institution'
                },
                {
                    id: 'linkedin',
                    type: 'url',
                    label: 'LinkedIn',
                    default_value: '',
                    placeholder: 'LinkedIn profile URL'
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
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' }
            ]
        });

        this.addControl('show_credentials', {
            type: 'switch',
            label: 'Show Credentials',
            default_value: true
        });

        this.addControl('show_affiliation', {
            type: 'switch',
            label: 'Show Affiliation',
            default_value: true
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('card_background', {
            type: 'color',
            label: 'Card Background',
            default_value: '#ffffff'
        });

        this.addControl('card_border', {
            type: 'color',
            label: 'Card Border',
            default_value: '#e5e7eb'
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#1a1a1a'
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#3b82f6'
        });

        this.addControl('credentials_color', {
            type: 'color',
            label: 'Credentials Color',
            default_value: '#059669'
        });

        this.addControl('affiliation_color', {
            type: 'color',
            label: 'Affiliation Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const members = this.getSetting('members', [
            { name: 'Dr. James Wilson', title: 'Strategic Advisor', credentials: 'PhD, MBA', affiliation: 'Stanford University', image: '', linkedin: '' },
            { name: 'Prof. Maria Garcia', title: 'Technology Advisor', credentials: 'PhD, Computer Science', affiliation: 'MIT', image: '', linkedin: '' },
            { name: 'Robert Chen', title: 'Financial Advisor', credentials: 'CFA, MBA', affiliation: 'Goldman Sachs', image: '', linkedin: '' }
        ]);
        const columns = this.getSetting('columns', '3');
        const showCredentials = this.getSetting('show_credentials', true);
        const showAffiliation = this.getSetting('show_affiliation', true);
        const cardBackground = this.getSetting('card_background', '#ffffff');
        const cardBorder = this.getSetting('card_border', '#e5e7eb');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const titleColor = this.getSetting('title_color', '#3b82f6');
        const credentialsColor = this.getSetting('credentials_color', '#059669');
        const affiliationColor = this.getSetting('affiliation_color', '#666666');

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

        // Build member cards
        const membersArray = Array.isArray(members) ? members : [];
        const memberCards = membersArray.map(member => {
            const name = member.name || 'Board Member';
            const title = member.title || 'Advisor';
            const credentials = member.credentials || '';
            const affiliation = member.affiliation || '';
            const linkedin = member.linkedin || '';
            const image = member.image || '';

            // Build image
            let imageHtml = '';
            // Handle media object from repeater
            const imageUrl = (image && image.url) ? image.url : image;

            if (imageUrl) {
                imageHtml = `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(name)}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px; border: 3px solid ${cardBorder};">`;
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                imageHtml = `<div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold; margin: 0 auto 15px; border: 3px solid ${cardBorder};">${initials}</div>`;
            }

            const credentialsHtml = showCredentials && credentials ? `<div style="display: inline-block; background: ${credentialsColor}15; color: ${credentialsColor}; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px; margin-top: 8px;">${this.escapeHtml(credentials)}</div>` : '';

            const affiliationHtml = showAffiliation && affiliation ? `<div style="color: ${affiliationColor}; font-size: 13px; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px;"><i class="fas fa-building" style="font-size: 11px;"></i><span>${this.escapeHtml(affiliation)}</span></div>` : '';

            const linkedinHtml = linkedin ? `<div style="margin-top: 12px;"><a href="${this.escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="LinkedIn"><i class="fab fa-linkedin"></i></a></div>` : '';

            return `
                <div style="background: ${cardBackground}; border: 1px solid ${cardBorder}; border-radius: 8px; padding: 25px 20px; text-align: center; transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    ${imageHtml}
                    <h3 style="color: ${nameColor}; font-size: 18px; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(name)}</h3>
                    <p style="color: ${titleColor}; font-size: 14px; font-weight: 500; margin: 0;">${this.escapeHtml(title)}</p>
                    ${credentialsHtml}
                    ${affiliationHtml}
                    ${linkedinHtml}
                </div>
            `;
        }).join('');

        const content = `
            <div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 25px;">
                ${memberCards}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['advisory-board-widget'];
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

console.log('Registering BoardMembersWidget...');
window.elementorWidgetManager.registerWidget(BoardMembersWidget);
