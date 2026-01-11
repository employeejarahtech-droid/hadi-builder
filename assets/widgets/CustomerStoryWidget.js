/**
 * CustomerStoryWidget - Case study card widget
 * Displays customer success story with metrics and testimonial
 */
class CustomerStoryWidget extends WidgetBase {
    getName() {
        return 'customer_story';
    }

    getTitle() {
        return 'Customer Story';
    }

    getIcon() {
        return 'fa fa-chart-line';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['customer', 'story', 'case study', 'success', 'testimonial', 'results'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Story',
            tab: 'content'
        });

        this.addControl('company_logo', {
            type: 'media',
            label: 'Company Logo',
            default_value: '',
            description: 'Customer company logo'
        });

        this.addControl('company_name', {
            type: 'text',
            label: 'Company Name',
            default_value: 'Acme Corporation',
            placeholder: 'Enter company name',
            label_block: true
        });

        this.addControl('industry', {
            type: 'text',
            label: 'Industry',
            default_value: 'Technology',
            placeholder: 'e.g., Technology, Healthcare',
            label_block: true
        });

        this.addControl('challenge', {
            type: 'textarea',
            label: 'Challenge',
            default_value: 'Needed to scale operations while reducing costs and improving efficiency.',
            placeholder: 'Describe the challenge',
            label_block: true
        });

        this.addControl('solution', {
            type: 'textarea',
            label: 'Solution',
            default_value: 'Implemented our platform to automate workflows and streamline processes.',
            placeholder: 'Describe the solution',
            label_block: true
        });

        this.addControl('testimonial', {
            type: 'textarea',
            label: 'Testimonial',
            default_value: 'This solution transformed our business. We saw immediate results!',
            placeholder: 'Customer quote',
            label_block: true
        });

        this.endControlsSection();

        // Metrics Section
        this.startControlsSection('metrics_section', {
            label: 'Results Metrics',
            tab: 'content'
        });

        this.addControl('metric1_value', {
            type: 'text',
            label: 'Metric 1 Value',
            default_value: '300%',
            placeholder: 'e.g., 300%'
        });

        this.addControl('metric1_label', {
            type: 'text',
            label: 'Metric 1 Label',
            default_value: 'Revenue Growth',
            placeholder: 'e.g., Revenue Growth'
        });

        this.addControl('metric2_value', {
            type: 'text',
            label: 'Metric 2 Value',
            default_value: '50%',
            placeholder: 'e.g., 50%'
        });

        this.addControl('metric2_label', {
            type: 'text',
            label: 'Metric 2 Label',
            default_value: 'Cost Reduction',
            placeholder: 'e.g., Cost Reduction'
        });

        this.addControl('metric3_value', {
            type: 'text',
            label: 'Metric 3 Value',
            default_value: '10x',
            placeholder: 'e.g., 10x'
        });

        this.addControl('metric3_label', {
            type: 'text',
            label: 'Metric 3 Label',
            default_value: 'Faster Processing',
            placeholder: 'e.g., Faster Processing'
        });

        this.endControlsSection();

        // Contact Section
        this.startControlsSection('contact_section', {
            label: 'Contact Person',
            tab: 'content'
        });

        this.addControl('contact_image', {
            type: 'media',
            label: 'Contact Photo',
            default_value: ''
        });

        this.addControl('contact_name', {
            type: 'text',
            label: 'Contact Name',
            default_value: 'Sarah Johnson',
            placeholder: 'Enter name'
        });

        this.addControl('contact_title', {
            type: 'text',
            label: 'Contact Title',
            default_value: 'CEO',
            placeholder: 'e.g., CEO, CTO'
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

        this.addControl('heading_color', {
            type: 'color',
            label: 'Heading Color',
            default_value: '#1a1a1a'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#666666'
        });

        this.addControl('metric_color', {
            type: 'color',
            label: 'Metric Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const companyLogo = this.getSetting('company_logo', '');
        const companyName = this.getSetting('company_name', 'Acme Corporation');
        const industry = this.getSetting('industry', 'Technology');
        const challenge = this.getSetting('challenge', 'Needed to scale operations while reducing costs and improving efficiency.');
        const solution = this.getSetting('solution', 'Implemented our platform to automate workflows and streamline processes.');
        const testimonial = this.getSetting('testimonial', 'This solution transformed our business. We saw immediate results!');
        const metric1Value = this.getSetting('metric1_value', '300%');
        const metric1Label = this.getSetting('metric1_label', 'Revenue Growth');
        const metric2Value = this.getSetting('metric2_value', '50%');
        const metric2Label = this.getSetting('metric2_label', 'Cost Reduction');
        const metric3Value = this.getSetting('metric3_value', '10x');
        const metric3Label = this.getSetting('metric3_label', 'Faster Processing');
        const contactImage = this.getSetting('contact_image', '');
        const contactName = this.getSetting('contact_name', 'Sarah Johnson');
        const contactTitle = this.getSetting('contact_title', 'CEO');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const headingColor = this.getSetting('heading_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');
        const metricColor = this.getSetting('metric_color', '#3b82f6');

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

        // Build company logo
        let logoHtml = '';
        const companyLogoUrl = (companyLogo && companyLogo.url) ? companyLogo.url : companyLogo;
        if (companyLogoUrl) {
            logoHtml = `<img src="${this.escapeHtml(companyLogoUrl)}" alt="${this.escapeHtml(companyName)}" style="width: auto; height: 50px; object-fit: contain; display: block;">`;
        } else {
            logoHtml = `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 6px; font-size: 18px; font-weight: bold; display: inline-block;">${this.escapeHtml(companyName)}</div>`;
        }

        // Build contact image
        let contactImageHtml = '';
        const contactImageUrl = (contactImage && contactImage.url) ? contactImage.url : contactImage;
        if (contactImageUrl) {
            contactImageHtml = `<img src="${this.escapeHtml(contactImageUrl)}" alt="${this.escapeHtml(contactName)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 12px;">`;
        } else {
            const initials = contactName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            contactImageHtml = `<div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initials}</div>`;
        }

        // Build metrics
        const metrics = [
            { value: metric1Value, label: metric1Label },
            { value: metric2Value, label: metric2Label },
            { value: metric3Value, label: metric3Label }
        ].filter(m => m.value && m.label);

        const metricsHtml = metrics.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(${metrics.length}, 1fr); gap: 20px; padding: 25px; background: #f9fafb; border-radius: 8px; margin: 20px 0;">
                ${metrics.map(m => `
                    <div style="text-align: center;">
                        <div style="color: ${metricColor}; font-size: 32px; font-weight: 700; margin-bottom: 6px;">${this.escapeHtml(m.value)}</div>
                        <div style="color: ${textColor}; font-size: 13px;">${this.escapeHtml(m.label)}</div>
                    </div>
                `).join('')}
            </div>
        ` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
                    <div style="flex: 1; padding-right: 20px;">
                        ${logoHtml}
                    </div>
                    <div style="background: ${metricColor}15; color: ${metricColor}; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 20px; white-space: nowrap;">${this.escapeHtml(industry)}</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: ${headingColor}; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Challenge</h4>
                    <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0;">${this.escapeHtml(challenge)}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="color: ${headingColor}; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Solution</h4>
                    <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0;">${this.escapeHtml(solution)}</p>
                </div>

                ${metricsHtml}

                <div style="background: ${metricColor}08; border-left: 3px solid ${metricColor}; padding: 15px 20px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; font-style: italic; margin: 0;">"${this.escapeHtml(testimonial)}"</p>
                </div>

                <div style="display: flex; align-items: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    ${contactImageHtml}
                    <div>
                        <div style="color: ${headingColor}; font-size: 15px; font-weight: 600;">${this.escapeHtml(contactName)}</div>
                        <div style="color: ${textColor}; font-size: 13px;">${this.escapeHtml(contactTitle)}, ${this.escapeHtml(companyName)}</div>
                    </div>
                </div>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['customer-story-widget'];
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

window.elementorWidgetManager.registerWidget(CustomerStoryWidget);
