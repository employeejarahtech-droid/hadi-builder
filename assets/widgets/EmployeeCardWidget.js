/**
 * EmployeeCardWidget - Employee profile card widget
 * Displays individual employee profile in a card format
 */
class EmployeeCardWidget extends WidgetBase {
    getName() {
        return 'employee_card';
    }

    getTitle() {
        return 'Employee Card';
    }

    getIcon() {
        return 'fa fa-id-card';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['employee', 'card', 'profile', 'staff', 'business', 'contact'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Employee Info',
            tab: 'content'
        });

        this.addControl('employee_image', {
            type: 'media',
            label: 'Photo',
            default_value: '',
            description: 'Employee profile photo'
        });

        this.addControl('employee_name', {
            type: 'text',
            label: 'Name',
            default_value: 'John Doe',
            placeholder: 'Enter employee name',
            label_block: true
        });

        this.addControl('employee_position', {
            type: 'text',
            label: 'Position',
            default_value: 'Senior Manager',
            placeholder: 'Enter position/title',
            label_block: true
        });

        this.addControl('employee_department', {
            type: 'text',
            label: 'Department',
            default_value: 'Sales',
            placeholder: 'Enter department',
            label_block: true
        });

        this.addControl('employee_bio', {
            type: 'textarea',
            label: 'Bio',
            default_value: '',
            placeholder: 'Short bio or description (optional)',
            label_block: true
        });

        this.endControlsSection();

        // Contact Section
        this.startControlsSection('contact_section', {
            label: 'Contact Info',
            tab: 'content'
        });

        this.addControl('employee_email', {
            type: 'text',
            label: 'Email',
            default_value: '',
            placeholder: 'employee@example.com'
        });

        this.addControl('employee_phone', {
            type: 'text',
            label: 'Phone',
            default_value: '',
            placeholder: '+1 234 567 8900'
        });

        this.addControl('employee_location', {
            type: 'text',
            label: 'Location',
            default_value: '',
            placeholder: 'Office location'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Card Style',
            tab: 'style'
        });

        this.addControl('card_style', {
            type: 'select',
            label: 'Card Style',
            default_value: 'modern',
            options: [
                { value: 'modern', label: 'Modern' },
                { value: 'classic', label: 'Classic' },
                { value: 'minimal', label: 'Minimal' }
            ]
        });

        this.addControl('image_position', {
            type: 'select',
            label: 'Image Position',
            default_value: 'top',
            options: [
                { value: 'top', label: 'Top' },
                { value: 'left', label: 'Left' }
            ]
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#ffffff'
        });

        this.addControl('border_color', {
            type: 'color',
            label: 'Border Color',
            default_value: '#e5e7eb'
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

        this.addControl('info_color', {
            type: 'color',
            label: 'Info Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const employeeImage = this.getSetting('employee_image', '');
        const employeeName = this.getSetting('employee_name', 'John Doe');
        const employeePosition = this.getSetting('employee_position', 'Senior Manager');
        const employeeDepartment = this.getSetting('employee_department', 'Sales');
        const employeeBio = this.getSetting('employee_bio', '');
        const employeeEmail = this.getSetting('employee_email', '');
        const employeePhone = this.getSetting('employee_phone', '');
        const employeeLocation = this.getSetting('employee_location', '');
        const cardStyle = this.getSetting('card_style', 'modern');
        const imagePosition = this.getSetting('image_position', 'top');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const borderColor = this.getSetting('border_color', '#e5e7eb');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const positionColor = this.getSetting('position_color', '#3b82f6');
        const infoColor = this.getSetting('info_color', '#666666');

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

        // Build employee image
        let imageHtml = '';
        const imageSize = imagePosition === 'top' ? '120px' : '100px';

        // Handle media control value which might be an object
        let imageUrl = '';
        if (typeof employeeImage === 'object' && employeeImage !== null && employeeImage.url) {
            imageUrl = employeeImage.url;
        } else if (typeof employeeImage === 'string') {
            imageUrl = employeeImage;
        }

        if (imageUrl) {
            imageHtml = `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(employeeName)}" style="width: ${imageSize}; height: ${imageSize}; border-radius: ${cardStyle === 'modern' ? '50%' : cardStyle === 'classic' ? '8px' : '4px'}; object-fit: cover; ${imagePosition === 'top' ? 'margin: 0 auto 20px;' : ''}">`;
        } else {
            const initials = employeeName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            imageHtml = `<div style="width: ${imageSize}; height: ${imageSize}; border-radius: ${cardStyle === 'modern' ? '50%' : cardStyle === 'classic' ? '8px' : '4px'}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: ${parseInt(imageSize) / 3}px; font-weight: bold; ${imagePosition === 'top' ? 'margin: 0 auto 20px;' : ''}">${initials}</div>`;
        }

        // Build contact info
        const contactItems = [];
        if (employeeEmail) {
            contactItems.push(`<div style="display: flex; align-items: center; gap: 8px; margin-top: 10px;"><i class="fa fa-envelope" style="color: ${positionColor}; width: 16px;"></i><a href="mailto:${this.escapeHtml(employeeEmail)}" style="color: ${infoColor}; text-decoration: none; font-size: 13px;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${this.escapeHtml(employeeEmail)}</a></div>`);
        }
        if (employeePhone) {
            contactItems.push(`<div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;"><i class="fa fa-phone" style="color: ${positionColor}; width: 16px;"></i><span style="color: ${infoColor}; font-size: 13px;">${this.escapeHtml(employeePhone)}</span></div>`);
        }
        if (employeeLocation) {
            contactItems.push(`<div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;"><i class="fa fa-map-marker-alt" style="color: ${positionColor}; width: 16px;"></i><span style="color: ${infoColor}; font-size: 13px;">${this.escapeHtml(employeeLocation)}</span></div>`);
        }
        const contactHtml = contactItems.join('');

        // Build bio
        const bioHtml = employeeBio ? `<p style="color: ${infoColor}; font-size: 14px; line-height: 1.6; margin: 15px 0 0 0;">${this.escapeHtml(employeeBio)}</p>` : '';

        // Build content section
        const contentHtml = `
            <div style="flex: 1;">
                <h3 style="color: ${nameColor}; font-size: 20px; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(employeeName)}</h3>
                <p style="color: ${positionColor}; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">${this.escapeHtml(employeePosition)}</p>
                <p style="color: ${infoColor}; font-size: 13px; margin: 0;">${this.escapeHtml(employeeDepartment)}</p>
                ${bioHtml}
                ${contactHtml}
            </div>
        `;

        // Build card styles based on style type
        const shadowMap = {
            modern: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            classic: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            minimal: 'none'
        };

        const cardStyles = `
            background-color: ${backgroundColor};
            border: ${cardStyle === 'minimal' ? 'none' : `1px solid ${borderColor}`};
            border-radius: ${cardStyle === 'modern' ? '12px' : cardStyle === 'classic' ? '8px' : '4px'};
            padding: ${cardStyle === 'modern' ? '30px' : '25px'};
            box-shadow: ${shadowMap[cardStyle]};
            text-align: ${imagePosition === 'top' ? 'center' : 'left'};
            display: flex;
            flex-direction: ${imagePosition === 'top' ? 'column' : 'row'};
            gap: ${imagePosition === 'left' ? '20px' : '0'};
            align-items: ${imagePosition === 'top' ? 'center' : 'flex-start'};
            transition: transform 0.3s, box-shadow 0.3s;
            max-width: ${imagePosition === 'top' ? '350px' : '100%'};
        `;

        const hoverEffect = cardStyle !== 'minimal'
            ? `onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${shadowMap[cardStyle]}'"`
            : '';

        const content = `
            <div style="${cardStyles}" ${hoverEffect}>
                ${imageHtml}
                ${contentHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['employee-card-widget'];
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

window.elementorWidgetManager.registerWidget(EmployeeCardWidget);
