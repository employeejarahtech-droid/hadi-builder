/**
 * InstructorWidget - Course instructor widget
 * Displays course instructor with expertise, ratings, and stats
 */
class InstructorWidget extends WidgetBase {
    getName() {
        return 'instructor';
    }

    getTitle() {
        return 'Instructor';
    }

    getIcon() {
        return 'fa fa-chalkboard-teacher';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['instructor', 'teacher', 'course', 'education', 'trainer'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Instructor Info',
            tab: 'content'
        });

        this.addControl('instructor_image', {
            type: 'media',
            label: 'Photo',
            default_value: '',
            description: 'Instructor photo'
        });

        this.addControl('instructor_name', {
            type: 'text',
            label: 'Name',
            default_value: 'Dr. Sarah Johnson',
            placeholder: 'Enter instructor name',
            label_block: true
        });

        this.addControl('instructor_title', {
            type: 'text',
            label: 'Title',
            default_value: 'Senior Instructor',
            placeholder: 'e.g., Senior Instructor, Professor',
            label_block: true
        });

        this.addControl('instructor_expertise', {
            type: 'text',
            label: 'Expertise',
            default_value: 'Web Development, JavaScript, React',
            placeholder: 'Areas of expertise',
            label_block: true
        });

        this.addControl('instructor_bio', {
            type: 'textarea',
            label: 'Bio',
            default_value: '10+ years of experience teaching web development and helping students launch their careers.',
            placeholder: 'Enter instructor bio',
            label_block: true
        });

        this.endControlsSection();

        // Stats Section
        this.startControlsSection('stats_section', {
            label: 'Statistics',
            tab: 'content'
        });

        this.addControl('show_stats', {
            type: 'switch',
            label: 'Show Statistics',
            default_value: true
        });

        this.addControl('rating', {
            type: 'text',
            label: 'Rating',
            default_value: '4.8',
            placeholder: 'e.g., 4.8',
            condition: {
                terms: [
                    { name: 'show_stats', operator: '==', value: true }
                ]
            }
        });

        this.addControl('students', {
            type: 'text',
            label: 'Students',
            default_value: '15,000',
            placeholder: 'Number of students',
            condition: {
                terms: [
                    { name: 'show_stats', operator: '==', value: true }
                ]
            }
        });

        this.addControl('courses', {
            type: 'text',
            label: 'Courses',
            default_value: '12',
            placeholder: 'Number of courses',
            condition: {
                terms: [
                    { name: 'show_stats', operator: '==', value: true }
                ]
            }
        });

        this.endControlsSection();

        // Social Links Section
        this.startControlsSection('social_section', {
            label: 'Social Links',
            tab: 'content'
        });

        this.addControl('website', {
            type: 'url',
            label: 'Website',
            default_value: '',
            placeholder: 'https://example.com'
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

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('layout', {
            type: 'select',
            label: 'Layout',
            default_value: 'horizontal',
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
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

        this.addControl('stats_color', {
            type: 'color',
            label: 'Stats Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const instructorImage = this.getSetting('instructor_image', '');
        const instructorName = this.getSetting('instructor_name', 'Dr. Sarah Johnson');
        const instructorTitle = this.getSetting('instructor_title', 'Senior Instructor');
        const instructorExpertise = this.getSetting('instructor_expertise', 'Web Development, JavaScript, React');
        const instructorBio = this.getSetting('instructor_bio', '10+ years of experience teaching web development and helping students launch their careers.');
        const showStats = this.getSetting('show_stats', true);
        const rating = this.getSetting('rating', '4.8');
        const students = this.getSetting('students', '15,000');
        const courses = this.getSetting('courses', '12');
        const website = this.getSetting('website', '');
        const linkedin = this.getSetting('linkedin', '');
        const twitter = this.getSetting('twitter', '');
        const layout = this.getSetting('layout', 'horizontal');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const titleColor = this.getSetting('title_color', '#3b82f6');
        const infoColor = this.getSetting('info_color', '#666666');
        const statsColor = this.getSetting('stats_color', '#3b82f6');

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

        // Build instructor image
        const imageSize = layout === 'vertical' ? '120px' : '100px';
        let imageHtml = '';
        if (instructorImage) {
            imageHtml = `<img src="${this.escapeHtml(instructorImage)}" alt="${this.escapeHtml(instructorName)}" style="width: ${imageSize}; height: ${imageSize}; border-radius: 50%; object-fit: cover; ${layout === 'vertical' ? 'margin: 0 auto 20px;' : ''}">`;
        } else {
            const initials = instructorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            imageHtml = `<div style="width: ${imageSize}; height: ${imageSize}; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: ${parseInt(imageSize) / 3}px; font-weight: bold; ${layout === 'vertical' ? 'margin: 0 auto 20px;' : ''}">${initials}</div>`;
        }

        // Build stats
        let statsHtml = '';
        if (showStats) {
            const statsItems = [];
            if (rating) {
                statsItems.push(`<div style="text-align: center;"><div style="color: ${statsColor}; font-size: 24px; font-weight: 600;">${this.escapeHtml(rating)}</div><div style="color: ${infoColor}; font-size: 12px; margin-top: 2px;">⭐ Rating</div></div>`);
            }
            if (students) {
                statsItems.push(`<div style="text-align: center;"><div style="color: ${statsColor}; font-size: 24px; font-weight: 600;">${this.escapeHtml(students)}</div><div style="color: ${infoColor}; font-size: 12px; margin-top: 2px;">Students</div></div>`);
            }
            if (courses) {
                statsItems.push(`<div style="text-align: center;"><div style="color: ${statsColor}; font-size: 24px; font-weight: 600;">${this.escapeHtml(courses)}</div><div style="color: ${infoColor}; font-size: 12px; margin-top: 2px;">Courses</div></div>`);
            }
            if (statsItems.length > 0) {
                statsHtml = `<div style="display: grid; grid-template-columns: repeat(${statsItems.length}, 1fr); gap: 20px; padding: 20px; background: #f9fafb; border-radius: 8px; margin-top: 15px;">${statsItems.join('')}</div>`;
            }
        }

        // Build social links
        const socialLinks = [];
        if (website) {
            socialLinks.push(`<a href="${this.escapeHtml(website)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Website"><i class="fa fa-globe"></i></a>`);
        }
        if (linkedin) {
            socialLinks.push(`<a href="${this.escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="LinkedIn"><i class="fa fa-linkedin"></i></a>`);
        }
        if (twitter) {
            socialLinks.push(`<a href="${this.escapeHtml(twitter)}" target="_blank" rel="noopener noreferrer" style="color: ${titleColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Twitter"><i class="fa fa-twitter"></i></a>`);
        }
        const socialHtml = socialLinks.length > 0 ? `<div style="display: flex; gap: 12px; margin-top: 12px; ${layout === 'vertical' ? 'justify-content: center;' : ''}">${socialLinks.join('')}</div>` : '';

        // Build content
        const contentHtml = `
            <div style="flex: 1;">
                <h3 style="color: ${nameColor}; font-size: 22px; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(instructorName)}</h3>
                <p style="color: ${titleColor}; font-size: 14px; font-weight: 500; margin: 0 0 8px 0;">${this.escapeHtml(instructorTitle)}</p>
                <p style="color: ${infoColor}; font-size: 13px; margin: 0 0 10px 0;"><i class="fa fa-award" style="margin-right: 6px; color: ${titleColor};"></i>${this.escapeHtml(instructorExpertise)}</p>
                <p style="color: ${infoColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(instructorBio)}</p>
                ${socialHtml}
                ${statsHtml}
            </div>
        `;

        const cardStyles = `
            background-color: ${backgroundColor};
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 25px;
            display: flex;
            flex-direction: ${layout === 'vertical' ? 'column' : 'row'};
            gap: ${layout === 'vertical' ? '0' : '20px'};
            align-items: ${layout === 'vertical' ? 'center' : 'flex-start'};
            text-align: ${layout === 'vertical' ? 'center' : 'left'};
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        `;

        const content = `
            <div style="${cardStyles}" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                ${imageHtml}
                ${contentHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['instructor-widget'];
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

window.elementorWidgetManager.registerWidget(InstructorWidget);
