/**
 * FeedbackWidget - Customer feedback widget
 * Displays customer feedback with sentiment and category
 */
class FeedbackWidget extends WidgetBase {
    getName() {
        return 'feedback';
    }

    getTitle() {
        return 'Feedback';
    }

    getIcon() {
        return 'fa fa-comment-dots';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['feedback', 'comment', 'review', 'customer', 'opinion'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Feedback',
            tab: 'content'
        });

        this.addControl('feedback_text', {
            type: 'textarea',
            label: 'Feedback',
            default_value: 'The customer service was outstanding! They went above and beyond to help me.',
            placeholder: 'Enter feedback text',
            label_block: true
        });

        this.addControl('sentiment', {
            type: 'select',
            label: 'Sentiment',
            default_value: 'positive',
            options: [
                { value: 'positive', label: 'Positive' },
                { value: 'neutral', label: 'Neutral' },
                { value: 'negative', label: 'Negative' }
            ]
        });

        this.addControl('category', {
            type: 'text',
            label: 'Category',
            default_value: 'Customer Service',
            placeholder: 'e.g., Product Quality, Support'
        });

        this.addControl('date', {
            type: 'text',
            label: 'Date',
            default_value: 'December 20, 2024',
            placeholder: 'e.g., December 20, 2024'
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
            default_value: 'Jane Smith',
            placeholder: 'Enter customer name'
        });

        this.addControl('customer_location', {
            type: 'text',
            label: 'Location',
            default_value: 'New York, USA',
            placeholder: 'e.g., New York, USA'
        });

        this.addControl('verified', {
            type: 'switch',
            label: 'Verified Customer',
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

        this.addControl('meta_color', {
            type: 'color',
            label: 'Meta Color',
            default_value: '#666666'
        });

        this.addControl('positive_color', {
            type: 'color',
            label: 'Positive Color',
            default_value: '#059669'
        });

        this.addControl('neutral_color', {
            type: 'color',
            label: 'Neutral Color',
            default_value: '#3b82f6'
        });

        this.addControl('negative_color', {
            type: 'color',
            label: 'Negative Color',
            default_value: '#dc2626'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const feedbackText = this.getSetting('feedback_text', 'The customer service was outstanding! They went above and beyond to help me.');
        const sentiment = this.getSetting('sentiment', 'positive');
        const category = this.getSetting('category', 'Customer Service');
        const date = this.getSetting('date', 'December 20, 2024');
        const customerImage = this.getSetting('customer_image', '');
        const customerName = this.getSetting('customer_name', 'Jane Smith');
        const customerLocation = this.getSetting('customer_location', 'New York, USA');
        const verified = this.getSetting('verified', true);
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const textColor = this.getSetting('text_color', '#1a1a1a');
        const metaColor = this.getSetting('meta_color', '#666666');
        const positiveColor = this.getSetting('positive_color', '#059669');
        const neutralColor = this.getSetting('neutral_color', '#3b82f6');
        const negativeColor = this.getSetting('negative_color', '#dc2626');

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

        // Determine sentiment color and icon
        const sentimentConfig = {
            positive: { color: positiveColor, icon: 'fa-smile', label: 'Positive' },
            neutral: { color: neutralColor, icon: 'fa-meh', label: 'Neutral' },
            negative: { color: negativeColor, icon: 'fa-frown', label: 'Negative' }
        };

        const currentSentiment = sentimentConfig[sentiment] || sentimentConfig.positive;

        // Build customer image
        let customerImageHtml = '';
        if (customerImage) {
            customerImageHtml = `<img src="${this.escapeHtml(customerImage)}" alt="${this.escapeHtml(customerName)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 12px;">`;
        } else {
            const initials = customerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            customerImageHtml = `<div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initials}</div>`;
        }

        const verifiedBadge = verified ? `<span style="display: inline-block; background: ${positiveColor}15; color: ${positiveColor}; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 10px; margin-left: 8px;"><i class="fa fa-check-circle" style="margin-right: 4px;"></i>Verified</span>` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                    <div style="display: inline-block; background: ${currentSentiment.color}15; color: ${currentSentiment.color}; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 12px;">
                        <i class="fa ${currentSentiment.icon}" style="margin-right: 6px;"></i>${currentSentiment.label}
                    </div>
                    <div style="color: ${metaColor}; font-size: 13px;">${this.escapeHtml(date)}</div>
                </div>

                <div style="display: inline-block; background: #f3f4f6; color: ${metaColor}; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 10px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">${this.escapeHtml(category)}</div>

                <p style="color: ${textColor}; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">"${this.escapeHtml(feedbackText)}"</p>

                <div style="display: flex; align-items: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    ${customerImageHtml}
                    <div>
                        <div style="color: ${textColor}; font-size: 15px; font-weight: 600;">${this.escapeHtml(customerName)}${verifiedBadge}</div>
                        <div style="color: ${metaColor}; font-size: 13px;"><i class="fa fa-map-marker-alt" style="margin-right: 6px;"></i>${this.escapeHtml(customerLocation)}</div>
                    </div>
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['feedback-widget'];
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

window.elementorWidgetManager.registerWidget(FeedbackWidget);
