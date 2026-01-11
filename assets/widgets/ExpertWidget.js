/**
 * ExpertWidget - Expert profile widget
 * Displays expert profile with certifications and specializations
 */
class ExpertWidget extends WidgetBase {
    getName() {
        return 'expert';
    }

    getTitle() {
        return 'Expert';
    }

    getIcon() {
        return 'fa fa-user-check';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['expert', 'specialist', 'professional', 'consultant', 'authority'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Expert Info',
            tab: 'content'
        });

        this.addControl('expert_image', {
            type: 'media',
            label: 'Photo',
            default_value: '',
            description: 'Expert photo'
        });

        this.addControl('expert_name', {
            type: 'text',
            label: 'Name',
            default_value: 'Dr. Michael Chen',
            placeholder: 'Enter expert name',
            label_block: true
        });

        this.addControl('expert_title', {
            type: 'text',
            label: 'Title',
            default_value: 'Senior Consultant',
            placeholder: 'e.g., Senior Consultant, Expert',
            label_block: true
        });

        this.addControl('expert_specialization', {
            type: 'text',
            label: 'Specialization',
            default_value: 'AI & Machine Learning',
            placeholder: 'Area of expertise',
            label_block: true
        });

        this.addControl('expert_bio', {
            type: 'textarea',
            label: 'Bio',
            default_value: '15+ years of experience in AI research and implementation across Fortune 500 companies.',
            placeholder: 'Enter expert bio',
            label_block: true
        });

        this.addControl('certifications', {
            type: 'text',
            label: 'Certifications',
            default_value: 'PhD Computer Science, AWS Certified, Google Cloud Professional',
            placeholder: 'Comma-separated certifications',
            label_block: true
        });

        this.endControlsSection();

        // Achievements Section
        this.startControlsSection('achievements_section', {
            label: 'Achievements',
            tab: 'content'
        });

        this.addControl('show_achievements', {
            type: 'switch',
            label: 'Show Achievements',
            default_value: true
        });

        this.addControl('years_experience', {
            type: 'text',
            label: 'Years of Experience',
            default_value: '15+',
            placeholder: 'e.g., 15+',
            condition: {
                terms: [
                    { name: 'show_achievements', operator: '==', value: true }
                ]
            }
        });

        this.addControl('projects_completed', {
            type: 'text',
            label: 'Projects Completed',
            default_value: '200+',
            placeholder: 'e.g., 200+',
            condition: {
                terms: [
                    { name: 'show_achievements', operator: '==', value: true }
                ]
            }
        });

        this.addControl('clients_served', {
            type: 'text',
            label: 'Clients Served',
            default_value: '50+',
            placeholder: 'e.g., 50+',
            condition: {
                terms: [
                    { name: 'show_achievements', operator: '==', value: true }
                ]
            }
        });

        this.endControlsSection();

        // Contact Section
        this.startControlsSection('contact_section', {
            label: 'Contact',
            tab: 'content'
        });

        this.addControl('email', {
            type: 'text',
            label: 'Email',
            default_value: '',
            placeholder: 'expert@example.com'
        });

        this.addControl('linkedin', {
            type: 'url',
            label: 'LinkedIn',
            default_value: '',
            placeholder: 'https://linkedin.com/in/username'
        });

        this.addControl('website', {
            type: 'url',
            label: 'Website',
            default_value: '',
            placeholder: 'https://example.com'
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

        this.addControl('info_color', {
            type: 'color',
            label: 'Info Color',
            default_value: '#666666'
        });

        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#059669'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const expertImage = this.getSetting('expert_image', '');
        const expertName = this.getSetting('expert_name', 'Dr. Michael Chen');
        const expertTitle = this.getSetting('expert_title', 'Senior Consultant');
        const expertSpecialization = this.getSetting('expert_specialization', 'AI & Machine Learning');
        const expertBio = this.getSetting('expert_bio', '15+ years of experience in AI research and implementation across Fortune 500 companies.');
        const certifications = this.getSetting('certifications', 'PhD Computer Science, AWS Certified, Google Cloud Professional');
        const showAchievements = this.getSetting('show_achievements', true);
        const yearsExperience = this.getSetting('years_experience', '15+');
        const projectsCompleted = this.getSetting('projects_completed', '200+');
        const clientsServed = this.getSetting('clients_served', '50+');
        const email = this.getSetting('email', '');
        const linkedin = this.getSetting('linkedin', '');
        const website = this.getSetting('website', '');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const titleColor = this.getSetting('title_color', '#3b82f6');
        const infoColor = this.getSetting('info_color', '#666666');
        const accentColor = this.getSetting('accent_color', '#059669');

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

        // Build expert image
        let imageHtml = '';
        if (expertImage) {
            imageHtml = `<img src="${this.escapeHtml(expertImage)}" alt="${this.escapeHtml(expertName)}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid ${accentColor};">`;
        } else {
            const initials = expertName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            imageHtml = `<div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; font-weight: bold; border: 4px solid ${accentColor};">${initials}</div>`;
        }

        // Build certifications badges
        const certBadges = certifications.split(',').map(cert => {
            const trimmed = cert.trim();
            if (!trimmed) return '';
            return `<span style="display: inline-block; background: ${accentColor}15; color: ${accentColor}; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px; margin: 4px 4px 4px 0;">${this.escapeHtml(trimmed)}</span>`;
        }).join('');

        // Build achievements
        let achievementsHtml = '';
        if (showAchievements) {
            const achievementItems = [];
            if (yearsExperience) {
                achievementItems.push(`<div style="text-align: center;"><div style="color: ${accentColor}; font-size: 28px; font-weight: 700;">${this.escapeHtml(yearsExperience)}</div><div style="color: ${infoColor}; font-size: 12px; margin-top: 4px;">Years Experience</div></div>`);
            }
            if (projectsCompleted) {
                achievementItems.push(`<div style="text-align: center;"><div style="color: ${accentColor}; font-size: 28px; font-weight: 700;">${this.escapeHtml(projectsCompleted)}</div><div style="color: ${infoColor}; font-size: 12px; margin-top: 4px;">Projects</div></div>`);
            }
            if (clientsServed) {
                achievementItems.push(`<div style="text-align: center;"><div style="color: ${accentColor}; font-size: 28px; font-weight: 700;">${this.escapeHtml(clientsServed)}</div><div style="color: ${infoColor}; font-size: 12px; margin-top: 4px;">Clients</div></div>`);
            }
            if (achievementItems.length > 0) {
                achievementsHtml = `<div style="display: grid; grid-template-columns: repeat(${achievementItems.length}, 1fr); gap: 20px; padding: 20px; background: #f9fafb; border-radius: 8px; margin-top: 20px;">${achievementItems.join('')}</div>`;
            }
        }

        // Build contact links
        const contactLinks = [];
        if (email) {
            contactLinks.push(`<a href="mailto:${this.escapeHtml(email)}" style="color: ${titleColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Email"><i class="fa fa-envelope"></i></a>`);
        }
        if (linkedin) {
            contactLinks.push(`<a href="${this.escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="LinkedIn"><i class="fa fa-linkedin"></i></a>`);
        }
        if (website) {
            contactLinks.push(`<a href="${this.escapeHtml(website)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Website"><i class="fa fa-globe"></i></a>`);
        }
        const contactHtml = contactLinks.length > 0 ? `<div style="display: flex; gap: 12px; margin-top: 15px;">${contactLinks.join('')}</div>` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                ${imageHtml}
                <h3 style="color: ${nameColor}; font-size: 24px; font-weight: 600; margin: 20px 0 6px 0;">${this.escapeHtml(expertName)}</h3>
                <p style="color: ${titleColor}; font-size: 16px; font-weight: 500; margin: 0 0 8px 0;">${this.escapeHtml(expertTitle)}</p>
                <p style="color: ${accentColor}; font-size: 14px; font-weight: 600; margin: 0 0 15px 0;"><i class="fa fa-certificate" style="margin-right: 6px;"></i>${this.escapeHtml(expertSpecialization)}</p>
                <p style="color: ${infoColor}; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">${this.escapeHtml(expertBio)}</p>
                ${certBadges ? `<div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #e5e7eb;">${certBadges}</div>` : ''}
                ${contactHtml}
                ${achievementsHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['expert-widget'];
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

window.elementorWidgetManager.registerWidget(ExpertWidget);
