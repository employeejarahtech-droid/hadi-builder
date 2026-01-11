/**
 * DepartmentWidget - Department showcase widget
 * Displays department information with icon, description, and stats
 */
class DepartmentWidget extends WidgetBase {
    getName() {
        return 'department';
    }

    getTitle() {
        return 'Department';
    }

    getIcon() {
        return 'fa fa-building';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['department', 'division', 'section', 'team', 'unit'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Department Info',
            tab: 'content'
        });

        this.addControl('department_icon', {
            type: 'icon',
            label: 'Icon Class',
            default_value: 'fa fa-users',
            placeholder: 'e.g., fa fa-users',
            description: 'FontAwesome icon class'
        });

        this.addControl('department_name', {
            type: 'text',
            label: 'Department Name',
            default_value: 'Sales Department',
            placeholder: 'Enter department name',
            label_block: true
        });

        this.addControl('department_description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Driving revenue growth and building lasting customer relationships.',
            placeholder: 'Enter department description',
            label_block: true
        });

        this.addControl('team_count', {
            type: 'text',
            label: 'Team Size',
            default_value: '12',
            placeholder: 'Number of team members'
        });

        this.addControl('department_head', {
            type: 'text',
            label: 'Department Head',
            default_value: '',
            placeholder: 'e.g., John Doe'
        });

        this.addControl('contact_email', {
            type: 'text',
            label: 'Contact Email',
            default_value: '',
            placeholder: 'department@example.com'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
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

        this.addControl('icon_position', {
            type: 'select',
            label: 'Icon Position',
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

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#3b82f6'
        });

        this.addControl('icon_background', {
            type: 'color',
            label: 'Icon Background',
            default_value: '#eff6ff'
        });

        this.addControl('name_color', {
            type: 'color',
            label: 'Name Color',
            default_value: '#1a1a1a'
        });

        this.addControl('description_color', {
            type: 'color',
            label: 'Description Color',
            default_value: '#666666'
        });

        this.addControl('stats_color', {
            type: 'color',
            label: 'Stats Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const departmentIcon = this.getSetting('department_icon', 'fa fa-users');
        const departmentName = this.getSetting('department_name', 'Sales Department');
        const departmentDescription = this.getSetting('department_description', 'Driving revenue growth and building lasting customer relationships.');
        const teamCount = this.getSetting('team_count', '12');
        const departmentHead = this.getSetting('department_head', '');
        const contactEmail = this.getSetting('contact_email', '');
        const cardStyle = this.getSetting('card_style', 'modern');
        const iconPosition = this.getSetting('icon_position', 'top');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const iconColor = this.getSetting('icon_color', '#3b82f6');
        const iconBackground = this.getSetting('icon_background', '#eff6ff');
        const nameColor = this.getSetting('name_color', '#1a1a1a');
        const descriptionColor = this.getSetting('description_color', '#666666');
        const statsColor = this.getSetting('stats_color', '#3b82f6');

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

        // Build icon
        const iconSize = iconPosition === 'top' ? '60px' : '50px';
        const iconHtml = `
            <div style="width: ${iconSize}; height: ${iconSize}; background: ${iconBackground}; border-radius: ${cardStyle === 'modern' ? '50%' : cardStyle === 'classic' ? '8px' : '4px'}; display: flex; align-items: center; justify-content: center; ${iconPosition === 'top' ? 'margin: 0 auto 20px;' : 'flex-shrink: 0;'}">
                <i class="${this.escapeHtml(departmentIcon)}" style="color: ${iconColor}; font-size: ${parseInt(iconSize) / 2}px;"></i>
            </div>
        `;

        // Build stats
        const statsItems = [];
        if (teamCount) {
            statsItems.push(`<div style="display: flex; align-items: center; gap: 6px;"><i class="fa fa-users" style="color: ${statsColor};"></i><span style="color: ${statsColor}; font-size: 14px; font-weight: 500;">${this.escapeHtml(teamCount)} Members</span></div>`);
        }
        if (departmentHead) {
            statsItems.push(`<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;"><i class="fa fa-user-tie" style="color: ${statsColor};"></i><span style="color: ${descriptionColor}; font-size: 13px;">${this.escapeHtml(departmentHead)}</span></div>`);
        }
        if (contactEmail) {
            statsItems.push(`<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;"><i class="fa fa-envelope" style="color: ${statsColor};"></i><a href="mailto:${this.escapeHtml(contactEmail)}" style="color: ${descriptionColor}; font-size: 13px; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${this.escapeHtml(contactEmail)}</a></div>`);
        }
        const statsHtml = statsItems.length > 0 ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">${statsItems.join('')}</div>` : '';

        // Build content
        const contentHtml = `
            <div style="flex: 1;">
                <h3 style="color: ${nameColor}; font-size: 20px; font-weight: 600; margin: 0 0 10px 0;">${this.escapeHtml(departmentName)}</h3>
                <p style="color: ${descriptionColor}; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(departmentDescription)}</p>
                ${statsHtml}
            </div>
        `;

        // Build card styles
        const shadowMap = {
            modern: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            classic: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            minimal: 'none'
        };

        const borderMap = {
            modern: 'none',
            classic: '1px solid #e5e7eb',
            minimal: '1px solid #f3f4f6'
        };

        const cardStyles = `
            background-color: ${backgroundColor};
            border: ${borderMap[cardStyle]};
            border-radius: ${cardStyle === 'modern' ? '12px' : cardStyle === 'classic' ? '8px' : '4px'};
            padding: ${cardStyle === 'modern' ? '30px' : '25px'};
            box-shadow: ${shadowMap[cardStyle]};
            text-align: ${iconPosition === 'top' ? 'center' : 'left'};
            display: flex;
            flex-direction: ${iconPosition === 'top' ? 'column' : 'row'};
            gap: ${iconPosition === 'left' ? '20px' : '0'};
            align-items: ${iconPosition === 'top' ? 'center' : 'flex-start'};
            transition: transform 0.3s, box-shadow 0.3s;
        `;

        const hoverEffect = cardStyle !== 'minimal'
            ? `onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${shadowMap[cardStyle]}'"`
            : '';

        const content = `
            <div style="${cardStyles}" ${hoverEffect}>
                ${iconHtml}
                ${contentHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['department-widget'];
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

window.elementorWidgetManager.registerWidget(DepartmentWidget);
