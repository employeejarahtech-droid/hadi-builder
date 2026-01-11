/**
 * QuoteSliderWidget - Quote carousel widget
 * Displays rotating quotes with authors in a slider
 */
class QuoteSliderWidget extends WidgetBase {
    getName() {
        return 'quote_slider';
    }

    getTitle() {
        return 'Quote Slider';
    }

    getIcon() {
        return 'fa fa-quote-right';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['quote', 'slider', 'carousel', 'testimonial', 'rotating'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Quotes',
            tab: 'content'
        });

        this.addControl('quotes', {
            type: 'repeater',
            label: 'Quotes',
            default_value: [
                { quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', title: 'Former Prime Minister' },
                { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', title: 'Co-founder, Apple' },
                { quote: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs', title: 'Co-founder, Apple' }
            ],
            fields: [
                {
                    id: 'quote',
                    type: 'textarea',
                    label: 'Quote',
                    default_value: 'Your quote here',
                    placeholder: 'Enter quote text'
                },
                {
                    id: 'author',
                    type: 'text',
                    label: 'Author',
                    default_value: 'Author Name',
                    placeholder: 'Enter author name'
                },
                {
                    id: 'title',
                    type: 'text',
                    label: 'Author Title',
                    default_value: '',
                    placeholder: 'e.g., CEO, Author'
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
            default_value: { size: 6, unit: 's' },
            range: {
                min: 3,
                max: 15,
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
            default_value: '#f9fafb'
        });

        this.addControl('quote_color', {
            type: 'color',
            label: 'Quote Color',
            default_value: '#1a1a1a'
        });

        this.addControl('author_color', {
            type: 'color',
            label: 'Author Color',
            default_value: '#3b82f6'
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Quote Icon Color',
            default_value: '#e5e7eb'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const quotes = this.getSetting('quotes', [
            { quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', title: 'Former Prime Minister' },
            { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', title: 'Co-founder, Apple' },
            { quote: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs', title: 'Co-founder, Apple' }
        ]);
        const autoplay = this.getSetting('autoplay', true);
        const autoplaySpeed = this.getSetting('autoplay_speed', { size: 6, unit: 's' });
        const showNavigation = this.getSetting('show_navigation', true);
        const showDots = this.getSetting('show_dots', true);
        const backgroundColor = this.getSetting('background_color', '#f9fafb');
        const quoteColor = this.getSetting('quote_color', '#1a1a1a');
        const authorColor = this.getSetting('author_color', '#3b82f6');
        const iconColor = this.getSetting('icon_color', '#e5e7eb');

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
        const uniqueId = `quote-slider-${Math.random().toString(36).substr(2, 9)}`;

        // Build quote slides
        const quotesArray = Array.isArray(quotes) ? quotes : [];
        const slides = quotesArray.map((item, index) => {
            const quote = item.quote || 'Your quote here';
            const author = item.author || 'Author Name';
            const title = item.title || '';

            return `
                <div class="${uniqueId}-slide" style="display: none; text-align: center; padding: 50px 30px; position: relative;">
                    <i class="fa fa-quote-left" style="color: ${iconColor}; font-size: 60px; opacity: 0.2; position: absolute; top: 20px; left: 50%; transform: translateX(-50%);"></i>
                    <p style="color: ${quoteColor}; font-size: 22px; line-height: 1.7; font-style: italic; margin: 40px 0 30px 0; max-width: 800px; margin-left: auto; margin-right: auto; position: relative; z-index: 1;">"${this.escapeHtml(quote)}"</p>
                    <div style="color: ${authorColor}; font-size: 18px; font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(author)}</div>
                    ${title ? `<div style="color: #666666; font-size: 14px;">${this.escapeHtml(title)}</div>` : ''}
                </div>
            `;
        }).join('');

        // Build navigation arrows
        const navigationHtml = showNavigation ? `
            <button class="${uniqueId}-prev" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: white; border: 1px solid #e5e7eb; border-radius: 50%; width: 45px; height: 45px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" onmouseover="this.style.background='#f9fafb'; this.style.transform='translateY(-50%) scale(1.1)'" onmouseout="this.style.background='white'; this.style.transform='translateY(-50%) scale(1)'">
                <i class="fa fa-chevron-left" style="color: ${authorColor};"></i>
            </button>
            <button class="${uniqueId}-next" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: white; border: 1px solid #e5e7eb; border-radius: 50%; width: 45px; height: 45px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" onmouseover="this.style.background='#f9fafb'; this.style.transform='translateY(-50%) scale(1.1)'" onmouseout="this.style.background='white'; this.style.transform='translateY(-50%) scale(1)'">
                <i class="fa fa-chevron-right" style="color: ${authorColor};"></i>
            </button>
        ` : '';

        // Build dots
        const dotsHtml = showDots ? `
            <div class="${uniqueId}-dots" style="display: flex; justify-content: center; gap: 10px; margin-top: 30px;">
                ${quotesArray.map((_, i) => `<div class="${uniqueId}-dot" data-index="${i}" style="width: 12px; height: 12px; border-radius: 50%; background: #d1d5db; cursor: pointer; transition: all 0.3s;"></div>`).join('')}
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
                        dot.style.transform = i === index ? 'scale(1.2)' : 'scale(1)';
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
            <div class="${uniqueId}" style="background: ${backgroundColor}; border-radius: 12px; padding: 20px; position: relative; min-height: 300px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                ${slides}
                ${navigationHtml}
                ${dotsHtml}
            </div>
            ${sliderScript}
        `;

        // Build wrapper classes
        let wrapperClasses = ['quote-slider-widget'];
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

window.elementorWidgetManager.registerWidget(QuoteSliderWidget);
