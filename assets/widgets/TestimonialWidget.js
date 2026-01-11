/**
 * TestimonialWidget - Single testimonial widget
 * Displays a single testimonial with author info and rating
 */
class TestimonialWidget extends WidgetBase {
    getName() {
        return 'testimonial';
    }

    getTitle() {
        return 'Testimonial';
    }

    getIcon() {
        return 'fa fa-quote-left';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['testimonial', 'review', 'feedback', 'quote', 'customer'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Testimonial',
            tab: 'content'
        });

        this.addControl('testimonial_text', {
            type: 'textarea',
            label: 'Testimonial',
            default_value: 'This product completely transformed our business. The results exceeded our expectations!',
            placeholder: 'Enter testimonial text',
            label_block: true
        });

        this.addControl('author_image', {
            type: 'media',
            label: 'Author Photo',
            default_value: '',
            description: 'Author profile photo'
        });

        this.addControl('author_name', {
            type: 'text',
            label: 'Author Name',
            default_value: 'Sarah Johnson',
            placeholder: 'Enter author name',
            label_block: true
        });

        this.addControl('author_title', {
            type: 'text',
            label: 'Author Title',
            default_value: 'CEO, Tech Corp',
            placeholder: 'e.g., CEO, Company Name',
            label_block: true
        });

        this.addControl('show_rating', {
            type: 'switch',
            label: 'Show Rating',
            default_value: true
        });

        this.addControl('rating', {
            type: 'select',
            label: 'Rating',
            default_value: '5',
            options: [
                { value: '1', label: '1 Star' },
                { value: '2', label: '2 Stars' },
                { value: '3', label: '3 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '5', label: '5 Stars' }
            ],
            condition: {
                terms: [
                    { name: 'show_rating', operator: '==', value: true }
                ]
            }
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
            default_value: 'card',
            options: [
                { value: 'card', label: 'Card' },
                { value: 'bubble', label: 'Bubble' },
                { value: 'minimal', label: 'Minimal' }
            ]
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

        this.addControl('author_color', {
            type: 'color',
            label: 'Author Color',
            default_value: '#3b82f6'
        });

        this.addControl('quote_color', {
            type: 'color',
            label: 'Quote Icon Color',
            default_value: '#e5e7eb'
        });

        this.addControl('star_color', {
            type: 'color',
            label: 'Star Color',
            default_value: '#fbbf24'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const testimonialText = this.getSetting('testimonial_text', 'This product completely transformed our business. The results exceeded our expectations!');
        const authorImage = this.getSetting('author_image', '');
        const authorName = this.getSetting('author_name', 'Sarah Johnson');
        const authorTitle = this.getSetting('author_title', 'CEO, Tech Corp');
        const showRating = this.getSetting('show_rating', true);
        const rating = parseInt(this.getSetting('rating', '5'));
        const layout = this.getSetting('layout', 'card');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const authorColor = this.getSetting('author_color', '#3b82f6');
        const quoteColor = this.getSetting('quote_color', '#e5e7eb');
        const starColor = this.getSetting('star_color', '#fbbf24');

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

        // Build rating stars
        let ratingHtml = '';
        if (showRating) {
            const stars = Array.from({ length: 5 }, (_, i) => {
                const filled = i < rating;
                return `<i class="fa fa-star${filled ? '' : '-o'}" style="color: ${filled ? starColor : '#d1d5db'}; font-size: 16px;"></i>`;
            }).join(' ');
            ratingHtml = `<div style="margin-bottom: 15px;">${stars}</div>`;
        }

        // Build author image
        let authorImageHtml = '';
        if (authorImage) {
            authorImageHtml = `<img src="${this.escapeHtml(authorImage)}" alt="${this.escapeHtml(authorName)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 12px;">`;
        } else {
            const initials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            authorImageHtml = `<div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initials}</div>`;
        }

        // Build quote icon
        const quoteIcon = `<i class="fa fa-quote-left" style="color: ${quoteColor}; font-size: 40px; opacity: 0.3; position: absolute; top: 20px; left: 20px;"></i>`;

        // Build content based on layout
        let content = '';

        if (layout === 'card') {
            content = `
                <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    ${quoteIcon}
                    ${ratingHtml}
                    <p style="color: ${textColor}; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0; position: relative; z-index: 1;">"${this.escapeHtml(testimonialText)}"</p>
                    <div style="display: flex; align-items: center;">
                        ${authorImageHtml}
                        <div>
                            <div style="color: ${authorColor}; font-size: 16px; font-weight: 600;">${this.escapeHtml(authorName)}</div>
                            <div style="color: #666666; font-size: 14px;">${this.escapeHtml(authorTitle)}</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (layout === 'bubble') {
            content = `
                <div style="max-width: 600px;">
                    <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 16px; padding: 25px; position: relative; margin-bottom: 15px;">
                        ${ratingHtml}
                        <p style="color: ${textColor}; font-size: 16px; line-height: 1.8; margin: 0;">"${this.escapeHtml(testimonialText)}"</p>
                        <div style="position: absolute; bottom: -10px; left: 30px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid ${backgroundColor};"></div>
                    </div>
                    <div style="display: flex; align-items: center; padding-left: 10px;">
                        ${authorImageHtml}
                        <div>
                            <div style="color: ${authorColor}; font-size: 16px; font-weight: 600;">${this.escapeHtml(authorName)}</div>
                            <div style="color: #666666; font-size: 14px;">${this.escapeHtml(authorTitle)}</div>
                        </div>
                    </div>
                </div>
            `;
        } else { // minimal
            content = `
                <div style="border-left: 4px solid ${authorColor}; padding-left: 20px;">
                    ${ratingHtml}
                    <p style="color: ${textColor}; font-size: 18px; line-height: 1.8; font-style: italic; margin: 0 0 15px 0;">"${this.escapeHtml(testimonialText)}"</p>
                    <div style="color: ${authorColor}; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(authorName)}</div>
                    <div style="color: #666666; font-size: 14px;">${this.escapeHtml(authorTitle)}</div>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['testimonial-widget'];
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

window.elementorWidgetManager.registerWidget(TestimonialWidget);
