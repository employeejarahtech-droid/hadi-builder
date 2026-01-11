/**
 * SpeakerWidget - Event speaker card widget
 * Displays event speaker with session info and social links
 */
class SpeakerWidget extends WidgetBase {
    getName() {
        return 'speaker';
    }

    getTitle() {
        return 'Speaker';
    }

    getIcon() {
        return 'fa fa-microphone-alt';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['speaker', 'presenter', 'event', 'conference', 'talk'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Speaker Info',
            tab: 'content'
        });

        this.addControl('speaker_image', {
            type: 'media',
            label: 'Photo',
            default_value: '',
            description: 'Speaker photo'
        });

        this.addControl('speaker_name', {
            type: 'text',
            label: 'Name',
            default_value: 'Dr. Jane Smith',
            placeholder: 'Enter speaker name',
            label_block: true
        });

        this.addControl('speaker_title', {
            type: 'text',
            label: 'Title',
            default_value: 'Keynote Speaker',
            placeholder: 'e.g., Keynote Speaker, Panelist',
            label_block: true
        });

        this.addControl('speaker_company', {
            type: 'text',
            label: 'Company/Organization',
            default_value: 'Tech Innovations Inc.',
            placeholder: 'Enter company',
            label_block: true
        });

        this.addControl('speaker_bio', {
            type: 'textarea',
            label: 'Bio',
            default_value: 'Leading expert in AI and machine learning with 15+ years of experience.',
            placeholder: 'Enter speaker bio',
            label_block: true
        });

        this.endControlsSection();

        // Session Section
        this.startControlsSection('session_section', {
            label: 'Session Details',
            tab: 'content'
        });

        this.addControl('session_title', {
            type: 'text',
            label: 'Session Title',
            default_value: '',
            placeholder: 'Enter session/talk title',
            label_block: true
        });

        this.addControl('session_time', {
            type: 'text',
            label: 'Session Time',
            default_value: '',
            placeholder: 'e.g., 2:00 PM - 3:00 PM'
        });

        this.addControl('session_track', {
            type: 'text',
            label: 'Track/Room',
            default_value: '',
            placeholder: 'e.g., Main Stage, Room A'
        });

        this.endControlsSection();

        // Social Links Section
        this.startControlsSection('social_section', {
            label: 'Social Links',
            tab: 'content'
        });

        this.addControl('twitter', {
            type: 'url',
            label: 'Twitter',
            default_value: '',
            placeholder: 'https://twitter.com/username'
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

        this.addControl('card_style', {
            type: 'select',
            label: 'Card Style',
            default_value: 'modern',
            options: [
                { value: 'modern', label: 'Modern' },
                { value: 'classic', label: 'Classic' },
                { value: 'minimal', label: 'Minimal' }
            ]
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

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const speakerImage = this.getSetting('speaker_image', '');
        const speakerName = this.getSetting('speaker_name', 'Dr. Jane Smith');
        const speakerTitle = this.getSetting('speaker_title', 'Keynote Speaker');
        const speakerCompany = this.getSetting('speaker_company', 'Tech Innovations Inc.');
        const speakerBio = this.getSetting('speaker_bio', 'Leading expert in AI and machine learning with 15+ years of experience.');
        const sessionTitle = this.getSetting('session_title', '');
        const sessionTime = this.getSetting('session_time', '');
        const sessionTrack = this.getSetting('session_track', '');
        const twitter = this.getSetting('twitter', '');
        const linkedin = this.getSetting('linkedin', '');
        const website = this.getSetting('website', '');
        const cardStyle = this.getSetting('card_style', 'modern');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const titleColor = this.getSetting('title_color', '#3b82f6');
        const infoColor = this.getSetting('info_color', '#666666');

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

        // Build speaker image
        let imageHtml = '';
        if (speakerImage) {
            imageHtml = `<img src="${this.escapeHtml(speakerImage)}" alt="${this.escapeHtml(speakerName)}" style="width: 100%; height: 250px; object-fit: cover; border-radius: ${cardStyle === 'modern' ? '8px 8px 0 0' : cardStyle === 'classic' ? '4px 4px 0 0' : '0'};">`;
        } else {
            const initials = speakerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            imageHtml = `<div style="width: 100%; height: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 60px; font-weight: bold; border-radius: ${cardStyle === 'modern' ? '8px 8px 0 0' : cardStyle === 'classic' ? '4px 4px 0 0' : '0'};">${initials}</div>`;
        }

        // Build session info
        const sessionItems = [];
        if (sessionTitle) {
            sessionItems.push(`<div style="background: ${titleColor}15; color: ${titleColor}; padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid ${titleColor};"><strong style="display: block; margin-bottom: 4px;">Session:</strong>${this.escapeHtml(sessionTitle)}</div>`);
        }
        if (sessionTime) {
            sessionItems.push(`<div style="display: flex; align-items: center; gap: 8px; color: ${infoColor}; font-size: 14px; margin-bottom: 8px;"><i class="fa fa-clock" style="color: ${titleColor};"></i><span>${this.escapeHtml(sessionTime)}</span></div>`);
        }
        if (sessionTrack) {
            sessionItems.push(`<div style="display: flex; align-items: center; gap: 8px; color: ${infoColor}; font-size: 14px; margin-bottom: 8px;"><i class="fa fa-map-marker-alt" style="color: ${titleColor};"></i><span>${this.escapeHtml(sessionTrack)}</span></div>`);
        }
        const sessionHtml = sessionItems.length > 0 ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">${sessionItems.join('')}</div>` : '';

        // Build social links
        const socialLinks = [];
        if (twitter) {
            socialLinks.push(`<a href="${this.escapeHtml(twitter)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Twitter"><i class="fa fa-twitter"></i></a>`);
        }
        if (linkedin) {
            socialLinks.push(`<a href="${this.escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="LinkedIn"><i class="fa fa-linkedin"></i></a>`);
        }
        if (website) {
            socialLinks.push(`<a href="${this.escapeHtml(website)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 18px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Website"><i class="fa fa-globe"></i></a>`);
        }
        const socialHtml = socialLinks.length > 0 ? `<div style="display: flex; gap: 15px; margin-top: 15px;">${socialLinks.join('')}</div>` : '';

        // Build card styles
        const shadowMap = {
            modern: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            classic: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            minimal: 'none'
        };

        const borderMap = {
            modern: 'none',
            classic: '1px solid #e5e7eb',
            minimal: '1px solid #f3f4f6'
        };

        const cardStyles = `
            background-color: ${backgroundColor};
            border: ${borderMap[cardStyle]};
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'classic' ? '4px' : '0'};
            overflow: hidden;
            box-shadow: ${shadowMap[cardStyle]};
            transition: transform 0.3s, box-shadow 0.3s;
            max-width: 400px;
        `;

        const hoverEffect = cardStyle !== 'minimal'
            ? `onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${shadowMap[cardStyle]}'"`
            : '';

        const content = `
            <div style="${cardStyles}" ${hoverEffect}>
                ${imageHtml}
                <div style="padding: 25px;">
                    <h3 style="color: ${nameColor}; font-size: 22px; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(speakerName)}</h3>
                    <p style="color: ${titleColor}; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">${this.escapeHtml(speakerTitle)}</p>
                    <p style="color: ${infoColor}; font-size: 13px; margin: 0 0 12px 0;"><i class="fa fa-building" style="margin-right: 6px;"></i>${this.escapeHtml(speakerCompany)}</p>
                    <p style="color: ${infoColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(speakerBio)}</p>
                    ${sessionHtml}
                    ${socialHtml}
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['speaker-widget'];
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

window.elementorWidgetManager.registerWidget(SpeakerWidget);
