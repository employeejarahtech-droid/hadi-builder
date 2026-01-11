/**
 * ReviewCardWidget - Product review widget
 * Displays product review with rating, pros/cons, and reviewer info
 */
class ReviewCardWidget extends WidgetBase {
    getName() {
        return 'review_card';
    }

    getTitle() {
        return 'Review Card';
    }

    getIcon() {
        return 'fa fa-star-half-alt';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['review', 'product', 'rating', 'feedback', 'evaluation'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Review',
            tab: 'content'
        });

        this.addControl('review_title', {
            type: 'text',
            label: 'Review Title',
            default_value: 'Excellent Product!',
            placeholder: 'Enter review title',
            label_block: true
        });

        this.addControl('review_text', {
            type: 'textarea',
            label: 'Review',
            default_value: 'This product exceeded my expectations. The quality is outstanding and it works exactly as described.',
            placeholder: 'Enter review text',
            label_block: true
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
            ]
        });

        this.addControl('pros', {
            type: 'textarea',
            label: 'Pros (one per line)',
            default_value: 'High quality materials\nEasy to use\nGreat value for money',
            placeholder: 'Enter pros, one per line',
            label_block: true
        });

        this.addControl('cons', {
            type: 'textarea',
            label: 'Cons (one per line)',
            default_value: 'Slightly expensive\nLimited color options',
            placeholder: 'Enter cons, one per line',
            label_block: true
        });

        this.endControlsSection();

        // Reviewer Section
        this.startControlsSection('reviewer_section', {
            label: 'Reviewer Info',
            tab: 'content'
        });

        this.addControl('reviewer_image', {
            type: 'media',
            label: 'Reviewer Photo',
            default_value: ''
        });

        this.addControl('reviewer_name', {
            type: 'text',
            label: 'Reviewer Name',
            default_value: 'John Doe',
            placeholder: 'Enter reviewer name'
        });

        this.addControl('verified_purchase', {
            type: 'switch',
            label: 'Verified Purchase',
            default_value: true
        });

        this.addControl('review_date', {
            type: 'text',
            label: 'Review Date',
            default_value: 'December 20, 2024',
            placeholder: 'e.g., December 20, 2024'
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

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#1a1a1a'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#666666'
        });

        this.addControl('star_color', {
            type: 'color',
            label: 'Star Color',
            default_value: '#fbbf24'
        });

        this.addControl('pros_color', {
            type: 'color',
            label: 'Pros Color',
            default_value: '#059669'
        });

        this.addControl('cons_color', {
            type: 'color',
            label: 'Cons Color',
            default_value: '#dc2626'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const reviewTitle = this.getSetting('review_title', 'Excellent Product!');
        const reviewText = this.getSetting('review_text', 'This product exceeded my expectations. The quality is outstanding and it works exactly as described.');
        const rating = parseInt(this.getSetting('rating', '5'));
        const pros = this.getSetting('pros', 'High quality materials\nEasy to use\nGreat value for money');
        const cons = this.getSetting('cons', 'Slightly expensive\nLimited color options');
        const reviewerImage = this.getSetting('reviewer_image', '');
        const reviewerName = this.getSetting('reviewer_name', 'John Doe');
        const verifiedPurchase = this.getSetting('verified_purchase', true);
        const reviewDate = this.getSetting('review_date', 'December 20, 2024');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');
        const starColor = this.getSetting('star_color', '#fbbf24');
        const prosColor = this.getSetting('pros_color', '#059669');
        const consColor = this.getSetting('cons_color', '#dc2626');

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

        // Build stars
        const stars = Array.from({ length: 5 }, (_, i) => {
            const filled = i < rating;
            return `<i class="fa fa-star${filled ? '' : '-o'}" style="color: ${filled ? starColor : '#d1d5db'}; font-size: 18px;"></i>`;
        }).join(' ');

        // Build reviewer image
        let reviewerImageHtml = '';
        if (reviewerImage) {
            reviewerImageHtml = `<img src="${this.escapeHtml(reviewerImage)}" alt="${this.escapeHtml(reviewerName)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 12px;">`;
        } else {
            const initials = reviewerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            reviewerImageHtml = `<div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initials}</div>`;
        }

        // Build pros list
        const prosArray = pros.split('\n').filter(p => p.trim());
        const prosHtml = prosArray.length > 0 ? `
            <div style="margin-top: 15px;">
                <div style="color: ${prosColor}; font-size: 14px; font-weight: 600; margin-bottom: 8px;"><i class="fa fa-check-circle" style="margin-right: 6px;"></i>Pros</div>
                <ul style="margin: 0; padding-left: 20px; color: ${textColor}; font-size: 14px; line-height: 1.8;">
                    ${prosArray.map(pro => `<li>${this.escapeHtml(pro.trim())}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        // Build cons list
        const consArray = cons.split('\n').filter(c => c.trim());
        const consHtml = consArray.length > 0 ? `
            <div style="margin-top: 15px;">
                <div style="color: ${consColor}; font-size: 14px; font-weight: 600; margin-bottom: 8px;"><i class="fa fa-times-circle" style="margin-right: 6px;"></i>Cons</div>
                <ul style="margin: 0; padding-left: 20px; color: ${textColor}; font-size: 14px; line-height: 1.8;">
                    ${consArray.map(con => `<li>${this.escapeHtml(con.trim())}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        const verifiedBadge = verifiedPurchase ? `<span style="display: inline-block; background: ${prosColor}15; color: ${prosColor}; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 10px; margin-left: 8px;"><i class="fa fa-check" style="margin-right: 4px;"></i>Verified Purchase</span>` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                    <div>${stars}</div>
                    <div style="color: ${textColor}; font-size: 13px;">${this.escapeHtml(reviewDate)}</div>
                </div>
                <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">${this.escapeHtml(reviewTitle)}</h3>
                <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0 0 15px 0;">${this.escapeHtml(reviewText)}</p>
                ${prosHtml}
                ${consHtml}
                <div style="display: flex; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    ${reviewerImageHtml}
                    <div>
                        <div style="color: ${titleColor}; font-size: 15px; font-weight: 600;">${this.escapeHtml(reviewerName)}${verifiedBadge}</div>
                    </div>
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['review-card-widget'];
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

window.elementorWidgetManager.registerWidget(ReviewCardWidget);
