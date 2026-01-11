/**
 * VideoTestimonialWidget - Video testimonial widget
 * Displays video testimonial with customer info and description
 */
class VideoTestimonialWidget extends WidgetBase {
    getName() {
        return 'video_testimonial';
    }

    getTitle() {
        return 'Video Testimonial';
    }

    getIcon() {
        return 'fa fa-video';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['video', 'testimonial', 'review', 'customer', 'youtube', 'vimeo'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Video',
            tab: 'content'
        });

        this.addControl('video_type', {
            type: 'select',
            label: 'Video Type',
            default_value: 'youtube',
            options: [
                { value: 'youtube', label: 'YouTube' },
                { value: 'vimeo', label: 'Vimeo' },
                { value: 'hosted', label: 'Self Hosted' }
            ]
        });

        this.addControl('youtube_url', {
            type: 'text',
            label: 'YouTube URL',
            default_value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            placeholder: 'https://www.youtube.com/watch?v=...',
            label_block: true,
            condition: {
                terms: [
                    { name: 'video_type', operator: '==', value: 'youtube' }
                ]
            }
        });

        this.addControl('vimeo_url', {
            type: 'text',
            label: 'Vimeo URL',
            default_value: 'https://vimeo.com/123456789',
            placeholder: 'https://vimeo.com/...',
            label_block: true,
            condition: {
                terms: [
                    { name: 'video_type', operator: '==', value: 'vimeo' }
                ]
            }
        });

        this.addControl('hosted_url', {
            type: 'text',
            label: 'Video URL',
            default_value: '',
            placeholder: 'https://example.com/video.mp4',
            label_block: true,
            condition: {
                terms: [
                    { name: 'video_type', operator: '==', value: 'hosted' }
                ]
            }
        });

        this.addControl('testimonial_text', {
            type: 'textarea',
            label: 'Testimonial',
            default_value: 'This product changed my life! The results were immediate and exceeded all expectations.',
            placeholder: 'Enter testimonial text',
            label_block: true
        });

        this.endControlsSection();

        // Customer Section
        this.startControlsSection('customer_section', {
            label: 'Customer Info',
            tab: 'content'
        });

        this.addControl('customer_image', {
            type: 'media',
            label: 'Customer Photo',
            default_value: ''
        });

        this.addControl('customer_name', {
            type: 'text',
            label: 'Customer Name',
            default_value: 'John Anderson',
            placeholder: 'Enter customer name'
        });

        this.addControl('customer_title', {
            type: 'text',
            label: 'Customer Title',
            default_value: 'CEO, Tech Solutions',
            placeholder: 'e.g., CEO, Company Name'
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

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
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
        const videoType = this.getSetting('video_type', 'youtube');
        const youtubeUrl = this.getSetting('youtube_url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        const vimeoUrl = this.getSetting('vimeo_url', 'https://vimeo.com/123456789');
        const hostedUrl = this.getSetting('hosted_url', '');
        const testimonialText = this.getSetting('testimonial_text', 'This product changed my life! The results were immediate and exceeded all expectations.');
        const customerImage = this.getSetting('customer_image', '');
        const customerName = this.getSetting('customer_name', 'John Anderson');
        const customerTitle = this.getSetting('customer_title', 'CEO, Tech Solutions');
        const showRating = this.getSetting('show_rating', true);
        const rating = parseInt(this.getSetting('rating', '5'));
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const nameColor = this.getSetting('name_color', '#3b82f6');
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

        // Build video embed
        let videoHtml = '';
        if (videoType === 'youtube') {
            const videoId = this.extractYouTubeId(youtubeUrl);
            if (videoId) {
                videoHtml = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>`;
            }
        } else if (videoType === 'vimeo') {
            const videoId = this.extractVimeoId(vimeoUrl);
            if (videoId) {
                videoHtml = `<iframe src="https://player.vimeo.com/video/${videoId}" width="100%" height="400" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>`;
            }
        } else if (videoType === 'hosted' && hostedUrl) {
            videoHtml = `<video controls width="100%" height="400" style="border-radius: 8px;"><source src="${this.escapeHtml(hostedUrl)}" type="video/mp4">Your browser does not support the video tag.</video>`;
        }

        // Build rating stars
        let ratingHtml = '';
        if (showRating) {
            const stars = Array.from({ length: 5 }, (_, i) => {
                const filled = i < rating;
                return `<i class="fa fa-star${filled ? '' : '-o'}" style="color: ${filled ? starColor : '#d1d5db'}; font-size: 16px;"></i>`;
            }).join(' ');
            ratingHtml = `<div style="margin-bottom: 15px;">${stars}</div>`;
        }

        // Build customer image
        let customerImageHtml = '';
        if (customerImage) {
            customerImageHtml = `<img src="${this.escapeHtml(customerImage)}" alt="${this.escapeHtml(customerName)}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 15px;">`;
        } else {
            const initials = customerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            customerImageHtml = `<div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">${initials}</div>`;
        }

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                ${videoHtml}
                <div style="margin-top: 25px;">
                    ${ratingHtml}
                    <p style="color: ${textColor}; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">"${this.escapeHtml(testimonialText)}"</p>
                    <div style="display: flex; align-items: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        ${customerImageHtml}
                        <div>
                            <div style="color: ${nameColor}; font-size: 16px; font-weight: 600;">${this.escapeHtml(customerName)}</div>
                            <div style="color: #666666; font-size: 14px;">${this.escapeHtml(customerTitle)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['video-testimonial-widget'];
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

    extractYouTubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    extractVimeoId(url) {
        const regExp = /vimeo.*\/(\d+)/i;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(VideoTestimonialWidget);
