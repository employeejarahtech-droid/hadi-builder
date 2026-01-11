/**
 * SuccessStoryWidget - Success story showcase widget
 * Displays success story with before/after comparison and results
 */
class SuccessStoryWidget extends WidgetBase {
    getName() {
        return 'success_story';
    }

    getTitle() {
        return 'Success Story';
    }

    getIcon() {
        return 'fa fa-trophy';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['success', 'story', 'before', 'after', 'transformation', 'results'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Story',
            tab: 'content'
        });

        this.addControl('featured_image', {
            type: 'media',
            label: 'Featured Image',
            default_value: '',
            description: 'Main story image'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'How We Achieved 10x Growth',
            placeholder: 'Enter story title',
            label_block: true
        });

        this.addControl('subtitle', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'A journey from startup to industry leader',
            placeholder: 'Enter subtitle',
            label_block: true
        });

        this.addControl('story_text', {
            type: 'textarea',
            label: 'Story',
            default_value: 'Our transformation journey showcases how strategic planning and execution led to remarkable growth and success.',
            placeholder: 'Enter story description',
            label_block: true
        });

        this.endControlsSection();

        // Before/After Section
        this.startControlsSection('comparison_section', {
            label: 'Before & After',
            tab: 'content'
        });

        this.addControl('before_title', {
            type: 'text',
            label: 'Before Title',
            default_value: 'Before',
            placeholder: 'e.g., Before'
        });

        this.addControl('before_text', {
            type: 'textarea',
            label: 'Before Description',
            default_value: 'Struggling with manual processes and limited reach',
            placeholder: 'Describe the before state'
        });

        this.addControl('after_title', {
            type: 'text',
            label: 'After Title',
            default_value: 'After',
            placeholder: 'e.g., After'
        });

        this.addControl('after_text', {
            type: 'textarea',
            label: 'After Description',
            default_value: 'Automated workflows and global market presence',
            placeholder: 'Describe the after state'
        });

        this.endControlsSection();

        // Results Section
        this.startControlsSection('results_section', {
            label: 'Key Results',
            tab: 'content'
        });

        this.addControl('result1_number', {
            type: 'text',
            label: 'Result 1 Number',
            default_value: '500%',
            placeholder: 'e.g., 500%'
        });

        this.addControl('result1_label', {
            type: 'text',
            label: 'Result 1 Label',
            default_value: 'Revenue Increase',
            placeholder: 'e.g., Revenue Increase'
        });

        this.addControl('result2_number', {
            type: 'text',
            label: 'Result 2 Number',
            default_value: '10x',
            placeholder: 'e.g., 10x'
        });

        this.addControl('result2_label', {
            type: 'text',
            label: 'Result 2 Label',
            default_value: 'Team Growth',
            placeholder: 'e.g., Team Growth'
        });

        this.addControl('result3_number', {
            type: 'text',
            label: 'Result 3 Number',
            default_value: '50+',
            placeholder: 'e.g., 50+'
        });

        this.addControl('result3_label', {
            type: 'text',
            label: 'Result 3 Label',
            default_value: 'Countries',
            placeholder: 'e.g., Countries'
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

        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#059669'
        });

        this.addControl('before_color', {
            type: 'color',
            label: 'Before Color',
            default_value: '#dc2626'
        });

        this.addControl('after_color', {
            type: 'color',
            label: 'After Color',
            default_value: '#059669'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const featuredImage = this.getSetting('featured_image', '');
        const title = this.getSetting('title', 'How We Achieved 10x Growth');
        const subtitle = this.getSetting('subtitle', 'A journey from startup to industry leader');
        const storyText = this.getSetting('story_text', 'Our transformation journey showcases how strategic planning and execution led to remarkable growth and success.');
        const beforeTitle = this.getSetting('before_title', 'Before');
        const beforeText = this.getSetting('before_text', 'Struggling with manual processes and limited reach');
        const afterTitle = this.getSetting('after_title', 'After');
        const afterText = this.getSetting('after_text', 'Automated workflows and global market presence');
        const result1Number = this.getSetting('result1_number', '500%');
        const result1Label = this.getSetting('result1_label', 'Revenue Increase');
        const result2Number = this.getSetting('result2_number', '10x');
        const result2Label = this.getSetting('result2_label', 'Team Growth');
        const result3Number = this.getSetting('result3_number', '50+');
        const result3Label = this.getSetting('result3_label', 'Countries');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');
        const accentColor = this.getSetting('accent_color', '#059669');
        const beforeColor = this.getSetting('before_color', '#dc2626');
        const afterColor = this.getSetting('after_color', '#059669');

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

        // Build featured image
        let imageHtml = '';
        if (featuredImage) {
            imageHtml = `<img src="${this.escapeHtml(featuredImage)}" alt="${this.escapeHtml(title)}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 25px;">`;
        }

        // Build results
        const results = [
            { number: result1Number, label: result1Label },
            { number: result2Number, label: result2Label },
            { number: result3Number, label: result3Label }
        ].filter(r => r.number && r.label);

        const resultsHtml = results.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(${results.length}, 1fr); gap: 20px; margin: 25px 0;">
                ${results.map(r => `
                    <div style="text-align: center; padding: 20px; background: ${accentColor}08; border-radius: 8px;">
                        <div style="color: ${accentColor}; font-size: 36px; font-weight: 700; margin-bottom: 8px;">${this.escapeHtml(r.number)}</div>
                        <div style="color: ${textColor}; font-size: 14px; font-weight: 500;">${this.escapeHtml(r.label)}</div>
                    </div>
                `).join('')}
            </div>
        ` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                ${imageHtml}
                
                <div style="display: inline-block; background: ${accentColor}; color: white; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 12px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Success Story</div>
                
                <h2 style="color: ${titleColor}; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.3;">${this.escapeHtml(title)}</h2>
                <p style="color: ${accentColor}; font-size: 16px; font-weight: 500; margin: 0 0 20px 0;">${this.escapeHtml(subtitle)}</p>
                <p style="color: ${textColor}; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">${this.escapeHtml(storyText)}</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
                    <div style="padding: 20px; background: ${beforeColor}08; border-left: 4px solid ${beforeColor}; border-radius: 8px;">
                        <div style="color: ${beforeColor}; font-size: 14px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa fa-times-circle" style="margin-right: 6px;"></i>${this.escapeHtml(beforeTitle)}</div>
                        <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(beforeText)}</p>
                    </div>
                    <div style="padding: 20px; background: ${afterColor}08; border-left: 4px solid ${afterColor}; border-radius: 8px;">
                        <div style="color: ${afterColor}; font-size: 14px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa fa-check-circle" style="margin-right: 6px;"></i>${this.escapeHtml(afterTitle)}</div>
                        <p style="color: ${textColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(afterText)}</p>
                    </div>
                </div>

                ${resultsHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['success-story-widget'];
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

window.elementorWidgetManager.registerWidget(SuccessStoryWidget);
