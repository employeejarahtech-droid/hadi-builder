/**
 * ExecutiveTeamWidget - Leadership team widget
 * Displays executive/leadership team members in a premium format
 */
class ExecutiveTeamWidget extends WidgetBase {
    getName() {
        return 'executive_team';
    }

    getTitle() {
        return 'Executive Team';
    }

    getIcon() {
        return 'fa fa-user-tie';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['executive', 'leadership', 'management', 'c-suite', 'board'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Team Members',
            tab: 'content'
        });

        this.addControl('executives', {
            type: 'repeater',
            label: 'Executives',
            default_value: [
                { name: 'Sarah Johnson', title: 'Chief Executive Officer', image: '', bio: 'Leading the company vision with 20+ years of experience.', linkedin: '' },
                { name: 'Michael Chen', title: 'Chief Technology Officer', image: '', bio: 'Driving innovation and technical excellence.', linkedin: '' },
                { name: 'Emily Davis', title: 'Chief Financial Officer', image: '', bio: 'Managing financial strategy and growth.', linkedin: '' }
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
                    default_value: 'Executive Name',
                    placeholder: 'Enter name'
                },
                {
                    id: 'title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Executive Title',
                    placeholder: 'Enter title'
                },
                {
                    id: 'bio',
                    type: 'textarea',
                    label: 'Bio',
                    default_value: '',
                    placeholder: 'Short bio'
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

        this.addControl('layout_style', {
            type: 'select',
            label: 'Layout Style',
            default_value: 'grid',
            options: [
                { value: 'grid', label: 'Grid' },
                { value: 'list', label: 'List' },
                { value: 'featured', label: 'Featured (Large First)' }
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
                    { name: 'layout_style', operator: '==', value: 'grid' }
                ]
            }
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

        this.addControl('overlay_color', {
            type: 'color',
            label: 'Overlay Color',
            default_value: '#1a1a1a'
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#ffffff'
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#3b82f6'
        });

        this.addControl('bio_color', {
            type: 'color',
            label: 'Bio Color',
            default_value: '#e5e7eb'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const executives = this.getSetting('executives', [
            { name: 'Sarah Johnson', title: 'Chief Executive Officer', image: '', bio: 'Leading the company vision with 20+ years of experience.', linkedin: '' },
            { name: 'Michael Chen', title: 'Chief Technology Officer', image: '', bio: 'Driving innovation and technical excellence.', linkedin: '' },
            { name: 'Emily Davis', title: 'Chief Financial Officer', image: '', bio: 'Managing financial strategy and growth.', linkedin: '' }
        ]);
        const layoutStyle = this.getSetting('layout_style', 'grid');
        const columns = this.getSetting('columns', '3');
        const cardBackground = this.getSetting('card_background', '#ffffff');
        const overlayColor = this.getSetting('overlay_color', '#1a1a1a');
        const nameColor = this.getSetting('name_color', '#ffffff');
        const titleColor = this.getSetting('title_color', '#3b82f6');
        const bioColor = this.getSetting('bio_color', '#e5e7eb');

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
        const uniqueId = `executive-team-${Math.random().toString(36).substr(2, 9)}`;

        // Build executive cards
        const executivesArray = Array.isArray(executives) ? executives : [];
        const buildCard = (exec, index, isFeatured = false) => {
            const name = exec.name || 'Executive Name';
            const title = exec.title || 'Executive Title';
            const bio = exec.bio || '';
            const linkedin = exec.linkedin || '';
            const image = exec.image || '';

            const cardSize = isFeatured ? '400px' : '300px';
            const imageHeight = isFeatured ? '500px' : '350px';

            // Build image or placeholder
            let imageHtml = '';
            if (image) {
                imageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(name)}" style="width: 100%; height: ${imageHeight}; object-fit: cover;">`;
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                imageHtml = `<div style="width: 100%; height: ${imageHeight}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: ${isFeatured ? '80px' : '60px'}; font-weight: bold;">${initials}</div>`;
            }

            const linkedinHtml = linkedin ? `<a href="${this.escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="LinkedIn"><i class="fa fa-linkedin"></i></a>` : '';

            return `
                <div style="position: relative; overflow: hidden; border-radius: 8px; background: ${cardBackground}; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    ${imageHtml}
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, ${overlayColor}ee, ${overlayColor}00); padding: 30px 20px 20px;">
                        <h3 style="color: ${nameColor}; font-size: ${isFeatured ? '24px' : '20px'}; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(name)}</h3>
                        <p style="color: ${titleColor}; font-size: ${isFeatured ? '16px' : '14px'}; font-weight: 500; margin: 0 0 ${bio ? '10px' : '0'} 0;">${this.escapeHtml(title)}</p>
                        ${bio ? `<p style="color: ${bioColor}; font-size: ${isFeatured ? '14px' : '13px'}; line-height: 1.5; margin: 0 0 ${linkedin ? '12px' : '0'} 0;">${this.escapeHtml(bio)}</p>` : ''}
                        ${linkedinHtml}
                    </div>
                </div>
            `;
        };

        let content = '';

        if (layoutStyle === 'grid') {
            const cards = executivesArray.map((exec, index) => buildCard(exec, index)).join('');
            content = `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 30px;">${cards}</div>`;
        } else if (layoutStyle === 'list') {
            const cards = executivesArray.map((exec, index) => buildCard(exec, index)).join('');
            content = `<div style="display: flex; flex-direction: column; gap: 30px;">${cards}</div>`;
        } else if (layoutStyle === 'featured') {
            const featuredCard = executivesArray.length > 0 ? buildCard(executivesArray[0], 0, true) : '';
            const otherCards = executivesArray.slice(1).map((exec, index) => buildCard(exec, index + 1)).join('');
            content = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start;">
                    ${featuredCard}
                    <div style="display: grid; grid-template-columns: 1fr; gap: 30px;">
                        ${otherCards}
                    </div>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['executive-team-widget'];
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

window.elementorWidgetManager.registerWidget(ExecutiveTeamWidget);
