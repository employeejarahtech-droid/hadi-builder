/**
 * TeamCarouselWidget - Rotating team slider widget
 * Displays team members in a carousel/slider format
 */
class TeamCarouselWidget extends WidgetBase {
    getName() {
        return 'team_carousel';
    }

    getTitle() {
        return 'Team Carousel';
    }

    getIcon() {
        return 'fa fa-users-cog';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['team', 'carousel', 'slider', 'members', 'rotating', 'slideshow'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Team Members',
            tab: 'content'
        });

        this.addControl('members', {
            type: 'repeater',
            label: 'Members',
            default_value: [
                { name: 'John Doe', position: 'CEO', image: '', bio: 'Leading the company vision.' },
                { name: 'Jane Smith', position: 'CTO', image: '', bio: 'Driving technical innovation.' },
                { name: 'Mike Johnson', position: 'CFO', image: '', bio: 'Managing financial strategy.' }
            ],
            fields: [
                {
                    id: 'image',
                    type: 'media',
                    label: 'Photo',
                    default_value: ''
                },
                {
                    id: 'name',
                    type: 'text',
                    label: 'Name',
                    default_value: 'Team Member',
                    placeholder: 'Enter name'
                },
                {
                    id: 'position',
                    type: 'text',
                    label: 'Position',
                    default_value: 'Position',
                    placeholder: 'Enter position'
                },
                {
                    id: 'bio',
                    type: 'textarea',
                    label: 'Bio',
                    default_value: '',
                    placeholder: 'Short bio'
                }
            ]
        });

        this.endControlsSection();

        // Carousel Settings Section
        this.startControlsSection('carousel_section', {
            label: 'Carousel Settings',
            tab: 'content'
        });

        this.addControl('autoplay', {
            type: 'switch',
            label: 'Autoplay',
            default_value: true
        });

        this.addControl('autoplay_speed', {
            type: 'slider',
            label: 'Autoplay Speed (ms)',
            default_value: { size: 3000, unit: 'ms' },
            range: {
                min: 1000,
                max: 10000,
                step: 500
            },
            condition: {
                terms: [
                    { name: 'autoplay', operator: '==', value: true }
                ]
            }
        });

        this.addControl('show_arrows', {
            type: 'switch',
            label: 'Show Arrows',
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

        this.addControl('image_shape', {
            type: 'select',
            label: 'Image Shape',
            default_value: 'circle',
            options: [
                { value: 'square', label: 'Square' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'circle', label: 'Circle' }
            ]
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#1a1a1a'
        });

        this.addControl('position_color', {
            type: 'color',
            label: 'Position Color',
            default_value: '#3b82f6'
        });

        this.addControl('bio_color', {
            type: 'color',
            label: 'Bio Color',
            default_value: '#666666'
        });

        this.addControl('arrow_color', {
            type: 'color',
            label: 'Arrow Color',
            default_value: '#3b82f6'
        });

        this.addControl('dot_color', {
            type: 'color',
            label: 'Dot Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const members = this.getSetting('members', [
            { name: 'John Doe', position: 'CEO', image: '', bio: 'Leading the company vision.' },
            { name: 'Jane Smith', position: 'CTO', image: '', bio: 'Driving technical innovation.' },
            { name: 'Mike Johnson', position: 'CFO', image: '', bio: 'Managing financial strategy.' }
        ]);
        const autoplay = this.getSetting('autoplay', true);
        const autoplaySpeed = this.getSetting('autoplay_speed', { size: 3000, unit: 'ms' });
        const showArrows = this.getSetting('show_arrows', true);
        const showDots = this.getSetting('show_dots', true);
        const imageShape = this.getSetting('image_shape', 'circle');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const positionColor = this.getSetting('position_color', '#3b82f6');
        const bioColor = this.getSetting('bio_color', '#666666');
        const arrowColor = this.getSetting('arrow_color', '#3b82f6');
        const dotColor = this.getSetting('dot_color', '#3b82f6');

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
        const uniqueId = `team-carousel-${Math.random().toString(36).substr(2, 9)}`;

        // Determine border radius based on shape
        const borderRadiusMap = {
            square: '0',
            rounded: '12px',
            circle: '50%'
        };
        const imageBorderRadius = borderRadiusMap[imageShape] || borderRadiusMap.circle;

        // Build member slides
        const membersArray = Array.isArray(members) ? members : [];
        const slides = membersArray.map((member, index) => {
            const name = member.name || 'Team Member';
            const position = member.position || 'Position';
            const bio = member.bio || '';
            const image = member.image || '';

            // Build image HTML
            let imageHtml = '';
            if (image) {
                imageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(name)}" style="width: 150px; height: 150px; border-radius: ${imageBorderRadius}; object-fit: cover; margin: 0 auto 20px;">`;
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                imageHtml = `<div style="width: 150px; height: 150px; border-radius: ${imageBorderRadius}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 50px; font-weight: bold; margin: 0 auto 20px;">${initials}</div>`;
            }

            const bioHtml = bio ? `<p style="color: ${bioColor}; font-size: 14px; line-height: 1.6; margin: 12px 0 0 0; max-width: 600px; margin-left: auto; margin-right: auto;">${this.escapeHtml(bio)}</p>` : '';

            return `
                <div class="${uniqueId}-slide" style="display: ${index === 0 ? 'block' : 'none'}; text-align: center; padding: 30px;">
                    ${imageHtml}
                    <h3 style="color: ${nameColor}; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">${this.escapeHtml(name)}</h3>
                    <p style="color: ${positionColor}; font-size: 16px; font-weight: 500; margin: 0;">${this.escapeHtml(position)}</p>
                    ${bioHtml}
                </div>
            `;
        }).join('');

        // Build navigation arrows
        const arrowsHtml = showArrows ? `
            <button class="${uniqueId}-prev" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: white; border: 2px solid ${arrowColor}; color: ${arrowColor}; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; z-index: 10;" onmouseover="this.style.background='${arrowColor}'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='${arrowColor}'">
                ‹
            </button>
            <button class="${uniqueId}-next" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: white; border: 2px solid ${arrowColor}; color: ${arrowColor}; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; z-index: 10;" onmouseover="this.style.background='${arrowColor}'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='${arrowColor}'">
                ›
            </button>
        ` : '';

        // Build dots
        const dotsHtml = showDots ? `
            <div class="${uniqueId}-dots" style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
                ${membersArray.map((_, index) => `
                    <button class="${uniqueId}-dot" data-index="${index}" style="width: 12px; height: 12px; border-radius: 50%; border: none; background: ${index === 0 ? dotColor : '#d1d5db'}; cursor: pointer; transition: background 0.3s;"></button>
                `).join('')}
            </div>
        ` : '';

        // Build carousel JavaScript
        const carouselScript = `
            <script>
            (function() {
                const carousel = document.querySelector('.${uniqueId}');
                if (!carousel) return;
                
                const slides = carousel.querySelectorAll('.${uniqueId}-slide');
                const dots = carousel.querySelectorAll('.${uniqueId}-dot');
                const prevBtn = carousel.querySelector('.${uniqueId}-prev');
                const nextBtn = carousel.querySelector('.${uniqueId}-next');
                let currentIndex = 0;
                let autoplayInterval;

                function showSlide(index) {
                    slides.forEach((slide, i) => {
                        slide.style.display = i === index ? 'block' : 'none';
                    });
                    dots.forEach((dot, i) => {
                        dot.style.background = i === index ? '${dotColor}' : '#d1d5db';
                    });
                    currentIndex = index;
                }

                function nextSlide() {
                    const next = (currentIndex + 1) % slides.length;
                    showSlide(next);
                }

                function prevSlide() {
                    const prev = (currentIndex - 1 + slides.length) % slides.length;
                    showSlide(prev);
                }

                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);
                
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => showSlide(index));
                });

                ${autoplay ? `
                function startAutoplay() {
                    autoplayInterval = setInterval(nextSlide, ${autoplaySpeed.size});
                }
                
                function stopAutoplay() {
                    clearInterval(autoplayInterval);
                }

                startAutoplay();
                carousel.addEventListener('mouseenter', stopAutoplay);
                carousel.addEventListener('mouseleave', startAutoplay);
                ` : ''}
            })();
            </script>
        `;

        const content = `
            <div class="${uniqueId}" style="position: relative; max-width: 800px; margin: 0 auto;">
                ${slides}
                ${arrowsHtml}
                ${dotsHtml}
            </div>
            ${carouselScript}
        `;

        // Build wrapper classes
        let wrapperClasses = ['team-carousel-widget'];
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

window.elementorWidgetManager.registerWidget(TeamCarouselWidget);
