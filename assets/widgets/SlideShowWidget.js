class SlideShowWidget extends WidgetBase {
    getName() {
        return 'slideshow';
    }

    getTitle() {
        return 'SlideShow';
    }

    getIcon() {
        return 'fa fa-images';
    }

    getCategories() {
        return ['media'];
    }

    getKeywords() {
        return ['slideshow', 'auto', 'carousel', 'slider'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Slides',
            tab: 'content'
        });

        this.addControl('slides', {
            type: 'repeater',
            label: 'Slides',
            default_value: [
                {
                    image: { url: '' },
                    slide_title: 'Welcome to Our Site',
                    slide_description: 'We provide the best solutions for your business.',
                    button_text: 'Learn More',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: { url: '' },
                    slide_title: 'Professional Services',
                    slide_description: 'Our team of experts is ready to help you succeed.',
                    button_text: 'Contact Us',
                    link: { url: '', is_external: false, nofollow: false }
                }
            ],
            fields: [
                {
                    id: 'image',
                    type: 'media',
                    label: 'Image',
                    default_value: { url: '' }
                },
                {
                    id: 'slide_title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Slide Title',
                    placeholder: 'Enter title'
                },
                {
                    id: 'slide_description',
                    type: 'textarea',
                    label: 'Description',
                    default_value: 'Slide description goes here.',
                    placeholder: 'Enter description'
                },
                {
                    id: 'button_text',
                    type: 'text',
                    label: 'Button Text',
                    default_value: 'Learn More',
                    placeholder: 'Leave empty to hide'
                },
                {
                    id: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: {
                        url: '',
                        is_external: false,
                        nofollow: false
                    }
                }
            ]
        });

        this.endControlsSection();

        this.startControlsSection('settings_section', {
            label: 'Settings',
            tab: 'content'
        });

        this.addControl('interval', {
            type: 'slider',
            label: 'Interval (seconds)',
            default_value: { size: 5, unit: 's' },
            range: {
                min: 1,
                max: 20,
                step: 1
            }
        });

        this.addControl('show_arrows', {
            type: 'select',
            label: 'Show Arrows',
            default_value: 'yes',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ]
        });

        this.addControl('show_dots', {
            type: 'select',
            label: 'Show Dots',
            default_value: 'yes',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ]
        });

        this.addControl('transition_effect', {
            type: 'select',
            label: 'Transition Effect',
            default_value: 'slide',
            options: [
                { value: 'slide', label: 'Slide' },
                { value: 'fade', label: 'Fade' }
            ]
        });

        this.addControl('slide_height', {
            type: 'slider',
            label: 'Slide Height',
            default_value: { size: 500, unit: 'px' },
            range: {
                min: 200,
                max: 1000,
                step: 10
            },
            selectors: {
                '{{WRAPPER}} .cms-slideshow-container': 'height: {{SIZE}}{{UNIT}};'
            }
        });

        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });


        this.addControl('title_font_size', {
            type: 'slider',
            label: 'Title Font Size (Desktop)',
            default_value: { size: 48, unit: 'px' },
            range: {
                min: 10,
                max: 100,
                step: 1
            }
        });

        this.addControl('title_font_size_tablet', {
            type: 'slider',
            label: 'Title Font Size (Tablet)',
            default_value: { size: 36, unit: 'px' },
            range: {
                min: 10,
                max: 80,
                step: 1
            }
        });

        this.addControl('title_font_size_mobile', {
            type: 'slider',
            label: 'Title Font Size (Mobile)',
            default_value: { size: 28, unit: 'px' },
            range: {
                min: 10,
                max: 60,
                step: 1
            }
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#ffffff',
            selectors: {
                '{{WRAPPER}} .cms-slide-title': 'color: {{VALUE}};'
            }
        });

        this.addControl('desc_color', {
            type: 'color',
            label: 'Description Color',
            default_value: '#f3f4f6',
            selectors: {
                '{{WRAPPER}} .cms-slide-desc': 'color: {{VALUE}};'
            }
        });

        this.addControl('button_color', {
            type: 'color',
            label: 'Button Color',
            default_value: '#3b82f6',
            selectors: {
                '{{WRAPPER}} .cms-slide-button': 'background-color: {{VALUE}};'
            }
        });

        this.addControl('button_text_color', {
            type: 'color',
            label: 'Button Text Color',
            default_value: '#ffffff',
            selectors: {
                '{{WRAPPER}} .cms-slide-button': 'color: {{VALUE}};'
            }
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            default_value: { size: 12, unit: 'px' },
            range: {
                min: 0,
                max: 50,
                step: 1
            },
            selectors: {
                '{{WRAPPER}} .cms-slideshow-container': 'border-radius: {{SIZE}}{{UNIT}};'
            }
        });

        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        console.log('SlideShowWidget render() called');
        const slides = this.getSetting('slides', []);

        const intervalValue = this.getSetting('interval', { size: 5, unit: 's' });
        const interval = typeof intervalValue === 'object' ? intervalValue.size : intervalValue;
        const showArrows = this.getSetting('show_arrows', 'yes') === 'yes';
        const showDots = this.getSetting('show_dots', 'yes') === 'yes';
        const transitionEffect = this.getSetting('transition_effect', 'slide');

        const titleFontSize = this.getSetting('title_font_size', { size: 48, unit: 'px' });
        const titleFontSizeTablet = this.getSetting('title_font_size_tablet', { size: 36, unit: 'px' });
        const titleFontSizeMobile = this.getSetting('title_font_size_mobile', { size: 28, unit: 'px' });

        // Removed dynamic connection height variable because we use a class for the container
        // But we need to support the selector replacement for custom height in registerControls
        // The control 'slide_height' targets '{{WRAPPER}} .cms-slideshow-container' which is fine.

        const uniqueId = `slideshow-${Math.random().toString(36).substr(2, 9)}`;

        // CSS Styles
        const styles = `
            <style>
                #${uniqueId}-container {
                    position: relative;
                    overflow: hidden;
                    background: #000;
                    /* Height and Border Radius are handled by widget settings selectors */
                }

                .${uniqueId}-slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    transition: opacity 0.5s ease-in-out;
                }

                .${uniqueId}-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    padding: 20px;
                    width: 100%;
                    max-width: 1200px;
                }

                .${uniqueId}-title {
                    font-size: ${titleFontSize.size}${titleFontSize.unit};
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                @media (max-width: 1024px) {
                    .${uniqueId}-title {
                        font-size: ${titleFontSizeTablet.size}${titleFontSizeTablet.unit};
                    }
                }

                @media (max-width: 767px) {
                    .${uniqueId}-title {
                        font-size: ${titleFontSizeMobile.size}${titleFontSizeMobile.unit};
                    }
                }

                /* Builder View Support */
                .canvas-wrapper.tablet .${uniqueId}-title {
                    font-size: ${titleFontSizeTablet.size}${titleFontSizeTablet.unit};
                }

                .canvas-wrapper.mobile .${uniqueId}-title {
                    font-size: ${titleFontSizeMobile.size}${titleFontSizeMobile.unit};
                }

                .${uniqueId}-desc {
                    font-size: 1.25rem;
                    max-width: 800px;
                    margin: 0 auto 2rem auto;
                    line-height: 1.6;
                }

                .${uniqueId}-button {
                    display: inline-block;
                    padding: 12px 32px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .${uniqueId}-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px rgba(0,0,0,0.2);
                }

                /* Navigation Arrows */
                .${uniqueId}-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 50px;
                    cursor: pointer;
                    transition: background 0.3s;
                    z-index: 10;
                }

                .${uniqueId}-arrow:hover {
                    background: rgba(255,255,255,0.2);
                }

                .${uniqueId}-prev { left: 20px; }
                .${uniqueId}-next { right: 20px; }

                /* Dots */
                .${uniqueId}-dots {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    z-index: 10;
                }

                .${uniqueId}-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin: 0 5px;
                    display: inline-block;
                    transition: background 0.3s;
                }
            </style>
        `;

        // Render Slides
        const slidesHtml = slides.map((slide, index) => {
            let image = '';

            // Debug: Log the slide data
            console.log('Slide', index, 'data:', slide);
            console.log('Slide', index, 'image value:', slide.image);

            // Handle different image formats
            if (slide.image) {
                if (typeof slide.image === 'string') {
                    image = slide.image;
                } else if (typeof slide.image === 'object') {
                    if (slide.image.url) {
                        image = slide.image.url;
                    }
                    else if (slide.image.id) {
                        image = slide.image.full_url || slide.image.thumbnail || slide.image.medium || '';
                    }
                }
            }

            console.log('Slide', index, 'final image URL:', image);

            // Convert relative URLs
            if (image && image.startsWith('/')) {
                const baseUrl = window.location.origin;
                image = baseUrl + image;
                console.log('Slide', index, 'converted to absolute URL:', image);
            }

            console.log('Slide', index, 'FINAL URL to be used:', image);

            const title = slide.slide_title || '';
            const desc = slide.slide_description || '';
            const btnText = slide.button_text || '';
            let linkUrl = '#';
            let target = '_self';
            let rel = '';

            if (typeof slide.link === 'string') {
                linkUrl = slide.link;
            } else if (slide.link) {
                linkUrl = slide.link.url || '#';
                target = slide.link.is_external ? '_blank' : '_self';
                rel = slide.link.nofollow ? 'nofollow noreferrer' : '';
            }

            // Dynamic styles that must remain inline
            const bgStyle = image
                ? `background-image: url('${image}');`
                : `background: linear-gradient(135deg, #1f2937, #111827);`;

            // Initial transition state
            const transitionStyle = transitionEffect === 'fade'
                ? `opacity: ${index === 0 ? '1' : '0'};`
                : `display: ${index === 0 ? 'block' : 'none'};`;

            return `
                <div class="${uniqueId}-slide cms-slide" style="${bgStyle} ${transitionStyle}">
                    <div class="${uniqueId}-content">
                        ${title ? `<h2 class="${uniqueId}-title cms-slide-title">${this.escapeHtml(title)}</h2>` : ''}
                        ${desc ? `<p class="${uniqueId}-desc cms-slide-desc">${this.escapeHtml(desc)}</p>` : ''}
                        ${btnText ? `
                            <a href="${linkUrl}" target="${target}" rel="${rel}" class="${uniqueId}-button cms-slide-button">
                                ${this.escapeHtml(btnText)}
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Navigation Arrows
        const arrowsHtml = showArrows && slides.length > 1 ? `
            <button class="${uniqueId}-arrow ${uniqueId}-prev">
                <i class="fa fa-chevron-left" style="font-size: 20px;"></i>
            </button>
            <button class="${uniqueId}-arrow ${uniqueId}-next">
                <i class="fa fa-chevron-right" style="font-size: 20px;"></i>
            </button>
        ` : '';

        // Dots Navigation
        const dotsHtml = showDots && slides.length > 1 ? `
            <div class="${uniqueId}-dots">
                ${slides.map((_, i) => `
                    <button class="${uniqueId}-dot" data-index="${i}" style="background: ${i === 0 ? 'white' : 'rgba(255,255,255,0.5)'};"></button>
                `).join('')}
            </div>
        ` : '';

        const script = `
            <script>
            (function() {
                const container = document.getElementById('${uniqueId}-container');
                if (!container) return;

                const slides = container.querySelectorAll('.${uniqueId}-slide');
                const prevBtn = container.querySelector('.${uniqueId}-prev');
                const nextBtn = container.querySelector('.${uniqueId}-next');
                const dots = container.querySelectorAll('.${uniqueId}-dot');
                
                let currentIndex = 0;
                let intervalId;
                const isFade = '${transitionEffect}' === 'fade';
                const totalSlides = slides.length;

                function showSlide(index) {
                    if (index < 0) index = totalSlides - 1;
                    if (index >= totalSlides) index = 0;
                    
                    currentIndex = index;

                    if (isFade) {
                        slides.forEach((slide, i) => {
                            slide.style.opacity = i === currentIndex ? '1' : '0';
                            slide.style.zIndex = i === currentIndex ? '1' : '0';
                        });
                    } else {
                        slides.forEach((slide, i) => {
                            slide.style.display = i === currentIndex ? 'block' : 'none';
                        });
                    }

                    // Update dots
                    if (dots.length) {
                        dots.forEach((dot, i) => {
                            dot.style.background = i === currentIndex ? 'white' : 'rgba(255,255,255,0.5)';
                        });
                    }
                }

                function nextSlide() {
                    showSlide(currentIndex + 1);
                }

                function prevSlide() {
                    showSlide(currentIndex - 1);
                }

                if (prevBtn) prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    prevSlide();
                    resetTimer();
                });

                if (nextBtn) nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    nextSlide();
                    resetTimer();
                });

                if (dots.length) {
                    dots.forEach((dot, i) => {
                        dot.addEventListener('click', (e) => {
                            e.preventDefault();
                            showSlide(i);
                            resetTimer();
                        });
                    });
                }

                function startTimer() {
                    if (${interval} > 0 && totalSlides > 1) {
                        intervalId = setInterval(nextSlide, ${interval * 1000});
                    }
                }

                function stopTimer() {
                    if (intervalId) clearInterval(intervalId);
                }

                function resetTimer() {
                    stopTimer();
                    startTimer();
                }

                container.addEventListener('mouseenter', stopTimer);
                container.addEventListener('mouseleave', startTimer);

                startTimer();
            })();
            </script>
        `;

        const contentHtml = `
            ${styles}
            <div id="${uniqueId}-container" class="cms-slideshow-container">
                ${slidesHtml}
                ${arrowsHtml}
                ${dotsHtml}
            </div>
            ${script}
        `;

        return this.wrapWithAdvancedSettings(contentHtml, 'slideshow-widget');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(SlideShowWidget);
