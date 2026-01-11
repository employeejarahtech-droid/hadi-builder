/**
 * TestimonialSliderWidget - Rotating testimonials widget
 * Displays testimonials in a rotating slider/carousel
 */
class TestimonialSliderWidget extends WidgetBase {
    getName() {
        return 'testimonial_slider';
    }

    getTitle() {
        return 'Testimonial Slider';
    }

    getIcon() {
        return 'fa fa-comments';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['testimonial', 'slider', 'carousel', 'reviews', 'feedback', 'rotating'];
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
                { text: 'This product completely transformed our business. Highly recommended!', author_name: 'Sarah Johnson', author_title: 'CEO, Tech Corp', author_image: '', rating: '5' },
                { text: 'Outstanding service and support. The team went above and beyond.', author_name: 'Michael Chen', author_title: 'CTO, Innovation Labs', author_image: '', rating: '5' },
                { text: 'Best investment we made this year. Results exceeded expectations.', author_name: 'Emily Davis', author_title: 'Director, Marketing', author_image: '', rating: '4' }
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

        // Slider Settings Section
        this.startControlsSection('slider_section', {
            label: 'Slider Settings',
            tab: 'content'
        });

        this.addControl('autoplay', {
            type: 'switch',
            label: 'Autoplay',
            default_value: true
        });

        this.addControl('autoplay_speed', {
            type: 'slider',
            label: 'Autoplay Speed (seconds)',
            default_value: { size: 5, unit: 's' },
            range: {
                min: 2,
                max: 10,
                step: 1
            },
            condition: {
                terms: [
                    { name: 'autoplay', operator: '==', value: true }
                ]
            }
        });

        this.addControl('show_navigation', {
            type: 'switch',
            label: 'Show Navigation Arrows',
            default_value: true
        });

        this.addControl('show_dots', {
            type: 'switch',
            label: 'Show Dots',
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
            { text: 'This product completely transformed our business. Highly recommended!', author_name: 'Sarah Johnson', author_title: 'CEO, Tech Corp', author_image: '', rating: '5' },
            { text: 'Outstanding service and support. The team went above and beyond.', author_name: 'Michael Chen', author_title: 'CTO, Innovation Labs', author_image: '', rating: '5' },
            { text: 'Best investment we made this year. Results exceeded expectations.', author_name: 'Emily Davis', author_title: 'Director, Marketing', author_image: '', rating: '4' }
        ]);
        const autoplay = this.getSetting('autoplay', true);
        const autoplaySpeed = this.getSetting('autoplay_speed', { size: 5, unit: 's' });
        const showNavigation = this.getSetting('show_navigation', true);
        const showDots = this.getSetting('show_dots', true);
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

        // Generate unique ID
        const uniqueId = `testimonial-slider-${Math.random().toString(36).substr(2, 9)}`;

        // Build testimonial slides
        const testimonialsArray = Array.isArray(testimonials) ? testimonials : [];
        const slides = testimonialsArray.map((testimonial, index) => {
            const text = testimonial.text || 'Great product!';
            const authorName = testimonial.author_name || 'Customer Name';
            const authorTitle = testimonial.author_title || 'Position, Company';
            const authorImage = testimonial.author_image || '';
            const rating = parseInt(testimonial.rating || '5');

            // Build stars
            const stars = Array.from({ length: 5 }, (_, i) => {
                const filled = i < rating;
                return `<i class="fa fa-star${filled ? '' : '-o'}" style="color: ${filled ? starColor : '#d1d5db'}; font-size: 16px;"></i>`;
            }).join(' ');

            // Build author image
            let authorImageHtml = '';
            if (authorImage) {
                authorImageHtml = `<img src="${this.escapeHtml(authorImage)}" alt="${this.escapeHtml(authorName)}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px;">`;
            } else {
                const initials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                authorImageHtml = `<div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: bold; margin: 0 auto 15px;">${initials}</div>`;
            }

            return `
                <div class="${uniqueId}-slide" style="display: none; text-align: center; padding: 40px 20px;">
                    ${authorImageHtml}
                    <div style="margin-bottom: 15px;">${stars}</div>
                    <p style="color: ${textColor}; font-size: 18px; line-height: 1.8; font-style: italic; margin: 0 0 20px 0; max-width: 700px; margin-left: auto; margin-right: auto;">"${this.escapeHtml(text)}"</p>
                    <div style="color: ${authorColor}; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(authorName)}</div>
                    <div style="color: #666666; font-size: 14px;">${this.escapeHtml(authorTitle)}</div>
                </div>
            `;
        }).join('');

        // Build navigation arrows
        const navigationHtml = showNavigation ? `
            <button class="${uniqueId}-prev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: 1px solid #e5e7eb; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.3s;" onmouseover="this.style.background='#ffffff'" onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                <i class="fa fa-chevron-left" style="color: #1a1a1a;"></i>
            </button>
            <button class="${uniqueId}-next" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: 1px solid #e5e7eb; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.3s;" onmouseover="this.style.background='#ffffff'" onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                <i class="fa fa-chevron-right" style="color: #1a1a1a;"></i>
            </button>
        ` : '';

        // Build dots
        const dotsHtml = showDots ? `
            <div class="${uniqueId}-dots" style="display: flex; justify-content: center; gap: 8px; margin-top: 20px;">
                ${testimonialsArray.map((_, i) => `<div class="${uniqueId}-dot" data-index="${i}" style="width: 10px; height: 10px; border-radius: 50%; background: #d1d5db; cursor: pointer; transition: background 0.3s;"></div>`).join('')}
            </div>
        ` : '';

        // Build slider script
        const sliderScript = `
            <script>
            (function() {
                const slides = document.querySelectorAll('.${uniqueId}-slide');
                const dots = document.querySelectorAll('.${uniqueId}-dot');
                let currentIndex = 0;
                let autoplayInterval;

                function showSlide(index) {
                    slides.forEach((slide, i) => {
                        slide.style.display = i === index ? 'block' : 'none';
                    });
                    dots.forEach((dot, i) => {
                        dot.style.background = i === index ? '${authorColor}' : '#d1d5db';
                    });
                    currentIndex = index;
                }

                function nextSlide() {
                    currentIndex = (currentIndex + 1) % slides.length;
                    showSlide(currentIndex);
                }

                function prevSlide() {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    showSlide(currentIndex);
                }

                ${showNavigation ? `
                const prevBtn = document.querySelector('.${uniqueId}-prev');
                const nextBtn = document.querySelector('.${uniqueId}-next');
                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);
                ` : ''}

                ${showDots ? `
                dots.forEach((dot, i) => {
                    dot.addEventListener('click', () => showSlide(i));
                });
                ` : ''}

                ${autoplay ? `
                autoplayInterval = setInterval(nextSlide, ${autoplaySpeed.size * 1000});
                const container = document.querySelector('.${uniqueId}');
                if (container) {
                    container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
                    container.addEventListener('mouseleave', () => {
                        autoplayInterval = setInterval(nextSlide, ${autoplaySpeed.size * 1000});
                    });
                }
                ` : ''}

                showSlide(0);
            })();
            </script>
        `;

        const content = `
            <div class="${uniqueId}" style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${slides}
                ${navigationHtml}
                ${dotsHtml}
            </div>
            ${sliderScript}
        `;

        // Build wrapper classes
        let wrapperClasses = ['testimonial-slider-widget'];
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

window.elementorWidgetManager.registerWidget(TestimonialSliderWidget);
