/**
 * ProcessStepWidget - Process step with icon widget
 * Displays numbered process step with icon and description
 */
class ProcessStepWidget extends WidgetBase {
    getName() {
        return 'process_step';
    }

    getTitle() {
        return 'Process Step';
    }

    getIcon() {
        return 'fa fa-tasks';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['process', 'step', 'workflow', 'procedure', 'how-to'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('step_number', {
            type: 'text',
            label: 'Step Number',
            default_value: '01',
            placeholder: 'e.g., 01, 1, Step 1'
        });

        this.addControl('icon', {
            type: 'text',
            label: 'Icon Class',
            default_value: 'fa fa-lightbulb',
            placeholder: 'e.g., fa fa-lightbulb',
            description: 'FontAwesome icon class'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Plan & Strategy',
            placeholder: 'Enter step title',
            label_block: true
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'We analyze your requirements and create a comprehensive strategy.',
            placeholder: 'Enter step description',
            label_block: true
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('layout', {
            type: 'select',
            label: 'Layout',
            default_value: 'vertical',
            options: [
                { value: 'vertical', label: 'Vertical' },
                { value: 'horizontal', label: 'Horizontal' }
            ]
        });

        this.addControl('number_position', {
            type: 'select',
            label: 'Number Position',
            default_value: 'top',
            options: [
                { value: 'top', label: 'Top' },
                { value: 'badge', label: 'Badge' }
            ]
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#ffffff'
        });

        this.addControl('number_color', {
            type: 'color',
            label: 'Number Color',
            default_value: '#3b82f6'
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
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

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const stepNumber = this.getSetting('step_number', '01');
        const icon = this.getSetting('icon', 'fa fa-lightbulb');
        const title = this.getSetting('title', 'Plan & Strategy');
        const description = this.getSetting('description', 'We analyze your requirements and create a comprehensive strategy.');
        const layout = this.getSetting('layout', 'vertical');
        const numberPosition = this.getSetting('number_position', 'top');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const numberColor = this.getSetting('number_color', '#3b82f6');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');

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

        let content = '';

        if (layout === 'vertical') {
            if (numberPosition === 'top') {
                content = `
                    <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div style="color: ${numberColor}; font-size: 48px; font-weight: 700; line-height: 1; margin-bottom: 20px; opacity: 0.2;">${this.escapeHtml(stepNumber)}</div>
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 36px;"></i>
                        </div>
                        <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">${this.escapeHtml(title)}</h3>
                        <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                    </div>
                `;
            } else { // badge
                content = `
                    <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center; position: relative; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: ${numberColor}; color: white; font-size: 18px; font-weight: 700; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${this.escapeHtml(stepNumber)}</div>
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; margin: 20px auto 20px;">
                            <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 36px;"></i>
                        </div>
                        <h3 style="color: ${titleColor}; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">${this.escapeHtml(title)}</h3>
                        <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                    </div>
                `;
            }
        } else { // horizontal
            content = `
                <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                    <div style="display: flex; align-items: flex-start; gap: 20px;">
                        <div style="flex-shrink: 0; position: relative;">
                            <div style="width: 70px; height: 70px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center;">
                                <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: 32px;"></i>
                            </div>
                            <div style="position: absolute; top: -8px; right: -8px; background: ${numberColor}; color: white; font-size: 14px; font-weight: 700; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${this.escapeHtml(stepNumber)}</div>
                        </div>
                        <div style="flex: 1;">
                            <h3 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h3>
                            <p style="color: ${textColor}; font-size: 14px; line-height: 1.7; margin: 0;">${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['process-step-widget'];
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

window.elementorWidgetManager.registerWidget(ProcessStepWidget);
