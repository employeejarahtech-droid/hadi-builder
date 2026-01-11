/**
 * EndorsementWidget - Professional endorsements widget
 * Displays professional endorsements and recommendations
 */
class EndorsementWidget extends WidgetBase {
    getName() {
        return 'endorsement';
    }

    getTitle() {
        return 'Endorsement';
    }

    getIcon() {
        return 'fa fa-thumbs-up';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['endorsement', 'recommendation', 'testimonial', 'linkedin', 'professional'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Endorsement',
            tab: 'content'
        });

        this.addControl('endorsement_text', {
            type: 'textarea',
            label: 'Endorsement',
            default_value: 'I highly recommend this professional. Their expertise and dedication are exceptional.',
            placeholder: 'Enter endorsement text',
            label_block: true
        });

        this.addControl('skill_endorsed', {
            type: 'text',
            label: 'Skill/Area Endorsed',
            default_value: 'Project Management',
            placeholder: 'e.g., Leadership, Marketing',
            label_block: true
        });

        this.endControlsSection();

        // Endorser Section
        this.startControlsSection('endorser_section', {
            label: 'Endorser Info',
            tab: 'content'
        });

        this.addControl('endorser_image', {
            type: 'media',
            label: 'Endorser Photo',
            default_value: ''
        });

        this.addControl('endorser_name', {
            type: 'text',
            label: 'Endorser Name',
            default_value: 'Sarah Johnson',
            placeholder: 'Enter endorser name'
        });

        this.addControl('endorser_title', {
            type: 'text',
            label: 'Endorser Title',
            default_value: 'Senior Director, Tech Corp',
            placeholder: 'e.g., CEO, Company Name',
            label_block: true
        });

        this.addControl('relationship', {
            type: 'text',
            label: 'Relationship',
            default_value: 'Worked together at Tech Corp',
            placeholder: 'e.g., Former colleague, Manager',
            label_block: true
        });

        this.addControl('linkedin_url', {
            type: 'text',
            label: 'LinkedIn Profile',
            default_value: '',
            placeholder: 'https://linkedin.com/in/...',
            label_block: true,
            description: 'Optional LinkedIn profile link'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#ffffff'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#1a1a1a'
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#3b82f6'
        });

        this.addControl('skill_color', {
            type: 'color',
            label: 'Skill Badge Color',
            default_value: '#059669'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const endorsementText = this.getSetting('endorsement_text', 'I highly recommend this professional. Their expertise and dedication are exceptional.');
        const skillEndorsed = this.getSetting('skill_endorsed', 'Project Management');
        const endorserImage = this.getSetting('endorser_image', '');
        const endorserName = this.getSetting('endorser_name', 'Sarah Johnson');
        const endorserTitle = this.getSetting('endorser_title', 'Senior Director, Tech Corp');
        const relationship = this.getSetting('relationship', 'Worked together at Tech Corp');
        const linkedinUrl = this.getSetting('linkedin_url', '');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const nameColor = this.getSetting('name_color', '#3b82f6');
        const skillColor = this.getSetting('skill_color', '#059669');

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

        // Build endorser image
        let endorserImageHtml = '';

        // Handle media control value which might be an object
        let endorserImageUrl = '';
        if (typeof endorserImage === 'object' && endorserImage !== null && endorserImage.url) {
            endorserImageUrl = endorserImage.url;
        } else if (typeof endorserImage === 'string') {
            endorserImageUrl = endorserImage;
        }

        if (endorserImageUrl) {
            endorserImageHtml = `<img src="${this.escapeHtml(endorserImageUrl)}" alt="${this.escapeHtml(endorserName)}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 15px;">`;
        } else {
            const initials = endorserName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            endorserImageHtml = `<div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">${initials}</div>`;
        }

        // Build LinkedIn link
        const linkedinLink = linkedinUrl ? `
            <a href="${this.escapeHtml(linkedinUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; color: #0077b5; font-size: 13px; font-weight: 600; text-decoration: none; margin-top: 8px;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                <i class="fab fa-linkedin" style="font-size: 16px;"></i>
                View LinkedIn Profile
            </a>
        ` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-left: 4px solid ${skillColor}; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
                    <i class="fa fa-thumbs-up" style="color: ${skillColor}; font-size: 20px;"></i>
                    <div style="display: inline-block; background: ${skillColor}15; color: ${skillColor}; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Endorsed for ${this.escapeHtml(skillEndorsed)}</div>
                </div>

                <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0; font-style: italic;">"${this.escapeHtml(endorsementText)}"</p>

                <div style="display: flex; align-items: flex-start; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    ${endorserImageHtml}
                    <div style="flex: 1;">
                        <div style="color: ${nameColor}; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(endorserName)}</div>
                        <div style="color: #666666; font-size: 14px; margin-bottom: 4px;">${this.escapeHtml(endorserTitle)}</div>
                        <div style="color: #999999; font-size: 13px; font-style: italic;">${this.escapeHtml(relationship)}</div>
                        ${linkedinLink}
                    </div>
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['endorsement-widget'];
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

window.elementorWidgetManager.registerWidget(EndorsementWidget);
