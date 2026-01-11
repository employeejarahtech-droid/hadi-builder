/**
 * TestimonialGridWidget - Testimonial grid widget
 * Displays testimonials in a responsive grid layout
 */
class TestimonialGridWidget extends WidgetBase {
    getName() {
        return 'testimonial_grid';
    }

    getTitle() {
        return 'Testimonial Grid';
    }

    getIcon() {
        return 'fa fa-th';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['testimonial', 'grid', 'reviews', 'feedback', 'masonry'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Testimonials',
            tab: 'content'
        });

        this.addControl('testimonials', {
            type: 'repeater',
            label: 'Testimonials',
            default_value: [
                { text: 'Exceptional quality and service. Highly recommend to anyone!', author_name: 'Sarah Johnson', author_title: 'CEO, Tech Corp', author_image: '', rating: '5' },
                { text: 'Game changer for our business. ROI exceeded expectations.', author_name: 'Michael Chen', author_title: 'CTO, Innovation Labs', author_image: '', rating: '5' },
                { text: 'Professional team, outstanding results. Will use again!', author_name: 'Emily Davis', author_title: 'Marketing Director', author_image: '', rating: '4' },
                { text: 'Best decision we made this year. Fantastic experience!', author_name: 'Robert Wilson', author_title: 'Founder, StartupXYZ', author_image: '', rating: '5' }
            ],
            fields: [
                {
                    id: 'text',
                    type: 'textarea',
                    label: 'Testimonial',
                    default_value: 'Great product!',
                    placeholder: 'Enter testimonial text'
                },
                {
                    id: 'author_image',
                    type: 'media',
                    label: 'Author Photo',
                    default_value: ''
                },
                {
                    id: 'author_name',
                    type: 'text',
                    label: 'Author Name',
                    default_value: 'Customer Name',
                    placeholder: 'Enter name'
                },
                {
                    id: 'author_title',
                    type: 'text',
                    label: 'Author Title',
                    default_value: 'Position, Company',
                    placeholder: 'e.g., CEO, Company'
                },
                {
                    id: 'rating',
                    type: 'select',
                    label: 'Rating',
                    default_value: '5',
                    options: [
                        { value: '1', label: '1 Star' },
                        { value: '2', label: '2 Stars' },
                        { value: '3', label: '3 Stars' },
                        { value: '4', label: '4 Stars' },
                        { value: '5', label: '5 Stars' }
                    ]
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
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' }
            ]
        });

        this.addControl('show_rating', {
            type: 'switch',
            label: 'Show Rating',
            default_value: true
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Card Background',
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
        const testimonials = this.getSetting('testimonials', [
            { text: 'Exceptional quality and service. Highly recommend to anyone!', author_name: 'Sarah Johnson', author_title: 'CEO, Tech Corp', author_image: '', rating: '5' },
            { text: 'Game changer for our business. ROI exceeded expectations.', author_name: 'Michael Chen', author_title: 'CTO, Innovation Labs', author_image: '', rating: '5' },
            { text: 'Professional team, outstanding results. Will use again!', author_name: 'Emily Davis', author_title: 'Marketing Director', author_image: '', rating: '4' },
            { text: 'Best decision we made this year. Fantastic experience!', author_name: 'Robert Wilson', author_title: 'Founder, StartupXYZ', author_image: '', rating: '5' }
        ]);
        const columns = this.getSetting('columns', '3');
        const showRating = this.getSetting('show_rating', true);
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const authorColor = this.getSetting('author_color', '#3b82f6');
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

        // Build testimonial cards
        const testimonialsArray = Array.isArray(testimonials) ? testimonials : [];
        const cards = testimonialsArray.map((testimonial, index) => {
            const text = testimonial.text || 'Great product!';
            const authorName = testimonial.author_name || 'Customer Name';
            const authorTitle = testimonial.author_title || 'Position, Company';
            const authorImage = testimonial.author_image || '';
            const rating = parseInt(testimonial.rating || '5');

            // Build stars
            let starsHtml = '';
            if (showRating) {
                const stars = Array.from({ length: 5 }, (_, i) => {
                    const filled = i < rating;
                    return `<i class="fa fa-star${filled ? '' : '-o'}" style="color: ${filled ? starColor : '#d1d5db'}; font-size: 14px;"></i>`;
                }).join(' ');
                starsHtml = `<div style="margin-bottom: 12px;">${stars}</div>`;
            }

            // Build author image
            let authorImageHtml = '';
            if (authorImage) {
                authorImageHtml = `<img src="${this.escapeHtml(authorImage)}" alt="${this.escapeHtml(authorName)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 12px;">`;
            } else {
                const initials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                authorImageHtml = `<div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initials}</div>`;
            }

            return `
                <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'">
                    ${starsHtml}
                    <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0 0 15px 0;">"${this.escapeHtml(text)}"</p>
                    <div style="display: flex; align-items: center; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                        ${authorImageHtml}
                        <div>
                            <div style="color: ${authorColor}; font-size: 14px; font-weight: 600;">${this.escapeHtml(authorName)}</div>
                            <div style="color: #666666; font-size: 13px;">${this.escapeHtml(authorTitle)}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const content = `
            <div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 25px;">
                ${cards}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['testimonial-grid-widget'];
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

window.elementorWidgetManager.registerWidget(TestimonialGridWidget);
