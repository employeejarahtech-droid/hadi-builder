/**
 * AuthorBoxWidget - Blog author info widget
 * Displays author information with photo, bio, and social links
 */
class AuthorBoxWidget extends WidgetBase {
    getName() {
        return 'author_box';
    }

    getTitle() {
        return 'Author Box';
    }

    getIcon() {
        return 'fa fa-user-edit';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['author', 'blog', 'writer', 'bio', 'profile', 'post'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Author Info',
            tab: 'content'
        });

        this.addControl('author_image', {
            type: 'media',
            label: 'Author Photo',
            default_value: '',
            description: 'Author profile photo'
        });

        this.addControl('author_name', {
            type: 'text',
            label: 'Name',
            default_value: 'John Doe',
            placeholder: 'Enter author name',
            label_block: true
        });

        this.addControl('author_title', {
            type: 'text',
            label: 'Title',
            default_value: 'Senior Writer',
            placeholder: 'e.g., Senior Writer, Contributor',
            label_block: true
        });

        this.addControl('author_bio', {
            type: 'textarea',
            label: 'Bio',
            default_value: 'Passionate writer with 10+ years of experience in technology and innovation.',
            placeholder: 'Enter author bio',
            label_block: true
        });

        this.addControl('show_prefix', {
            type: 'switch',
            label: 'Show "About" Prefix',
            default_value: true
        });

        this.addControl('prefix_text', {
            type: 'text',
            label: 'Prefix Text',
            default_value: 'About the Author',
            condition: {
                terms: [
                    { name: 'show_prefix', operator: '==', value: true }
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

        this.addControl('email', {
            type: 'text',
            label: 'Email',
            default_value: '',
            placeholder: 'author@example.com'
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
            default_value: '#f9fafb'
        });

        this.addControl('border_color', {
            type: 'color',
            label: 'Border Color',
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
        const authorImage = this.getSetting('author_image', '');
        const authorName = this.getSetting('author_name', 'John Doe');
        const authorTitle = this.getSetting('author_title', 'Senior Writer');
        const authorBio = this.getSetting('author_bio', 'Passionate writer with 10+ years of experience in technology and innovation.');
        const showPrefix = this.getSetting('show_prefix', true);
        const prefixText = this.getSetting('prefix_text', 'About the Author');
        const website = this.getSetting('website', '');
        const twitter = this.getSetting('twitter', '');
        const linkedin = this.getSetting('linkedin', '');
        const email = this.getSetting('email', '');
        const layout = this.getSetting('layout', 'horizontal');
        const backgroundColor = this.getSetting('background_color', '#f9fafb');
        const borderColor = this.getSetting('border_color', '#e5e7eb');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const titleColor = this.getSetting('title_color', '#3b82f6');
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

        // Build prefix
        const prefixHtml = showPrefix ? `<div style="color: ${titleColor}; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">${this.escapeHtml(prefixText)}</div>` : '';

        // Build author image
        let imageHtml = '';
        // Handle media object (url property) or direct string
        const imageUrl = (authorImage && authorImage.url) ? authorImage.url : authorImage;

        if (imageUrl) {
            imageHtml = `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(authorName)}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; ${layout === 'vertical' ? 'margin: 0 auto 20px;' : ''}">`;
        } else {
            const initials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            imageHtml = `<div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold; ${layout === 'vertical' ? 'margin: 0 auto 20px;' : ''}">${initials}</div>`;
        }

        // Build social links
        const socialLinks = [];
        if (website) {
            socialLinks.push(`<a href="${this.escapeHtml(website)}" target="_blank" rel="noopener noreferrer" style="color: ${socialColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Website"><i class="fas fa-globe"></i></a>`);
        }
        if (twitter) {
            socialLinks.push(`<a href="${this.escapeHtml(twitter)}" target="_blank" rel="noopener noreferrer" style="color: ${socialColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Twitter"><i class="fab fa-twitter"></i></a>`);
        }
        if (linkedin) {
            socialLinks.push(`<a href="${this.escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" style="color: ${socialColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`);
        }
        if (email) {
            socialLinks.push(`<a href="mailto:${this.escapeHtml(email)}" style="color: ${socialColor}; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'" title="Email"><i class="fas fa-envelope"></i></a>`);
        }

        const socialHtml = socialLinks.length > 0
            ? `<div style="display: flex; gap: 15px; margin-top: 15px; ${layout === 'vertical' ? 'justify-content: center;' : ''}">${socialLinks.join('')}</div>`
            : '';

        // Build content
        const contentHtml = `
            <div style="flex: 1; ${layout === 'vertical' ? 'text-align: center;' : ''}">
                <h3 style="color: ${nameColor}; font-size: 20px; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(authorName)}</h3>
                <p style="color: ${titleColor}; font-size: 14px; font-weight: 500; margin: 0 0 12px 0;">${this.escapeHtml(authorTitle)}</p>
                <p style="color: ${bioColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(authorBio)}</p>
                ${socialHtml}
            </div>
        `;

        // Build box layout
        const boxStyles = `
            background-color: ${backgroundColor};
            border: 1px solid ${borderColor};
            border-radius: 8px;
            padding: 25px;
            display: flex;
            gap: 20px;
            flex-direction: ${layout === 'vertical' ? 'column' : 'row'};
            align-items: ${layout === 'vertical' ? 'center' : 'flex-start'};
        `;

        const content = `
            ${prefixHtml}
            <div style="${boxStyles}">
                ${imageHtml}
                ${contentHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['author-box-widget'];
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

window.elementorWidgetManager.registerWidget(AuthorBoxWidget);
