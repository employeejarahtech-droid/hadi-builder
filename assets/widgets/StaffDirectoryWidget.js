/**
 * StaffDirectoryWidget - Searchable directory widget
 * Displays staff members with search and filter functionality
 */
class StaffDirectoryWidget extends WidgetBase {
    getName() {
        return 'staff_directory';
    }

    getTitle() {
        return 'Staff Directory';
    }

    getIcon() {
        return 'fa fa-address-book';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['staff', 'directory', 'search', 'filter', 'employees', 'team'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Staff Members',
            tab: 'content'
        });

        this.addControl('members', {
            type: 'repeater',
            label: 'Members',
            default_value: [
                { name: 'John Doe', position: 'CEO', department: 'Executive', email: 'john@example.com', phone: '+1 234 567 8900', image: '' },
                { name: 'Jane Smith', position: 'CTO', department: 'Technology', email: 'jane@example.com', phone: '+1 234 567 8901', image: '' },
                { name: 'Mike Johnson', position: 'CFO', department: 'Finance', email: 'mike@example.com', phone: '+1 234 567 8902', image: '' }
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
                    default_value: 'Staff Member',
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
                    id: 'department',
                    type: 'text',
                    label: 'Department',
                    default_value: 'Department',
                    placeholder: 'Enter department'
                },
                {
                    id: 'email',
                    type: 'text',
                    label: 'Email',
                    default_value: '',
                    placeholder: 'email@example.com'
                },
                {
                    id: 'phone',
                    type: 'text',
                    label: 'Phone',
                    default_value: '',
                    placeholder: '+1 234 567 8900'
                }
            ]
        });

        this.endControlsSection();

        // Search Settings Section
        this.startControlsSection('search_section', {
            label: 'Search & Filter',
            tab: 'content'
        });

        this.addControl('show_search', {
            type: 'switch',
            label: 'Show Search',
            default_value: true
        });

        this.addControl('search_placeholder', {
            type: 'text',
            label: 'Search Placeholder',
            default_value: 'Search by name, position, or department...',
            condition: {
                terms: [
                    { name: 'show_search', operator: '==', value: true }
                ]
            }
        });

        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            default_value: '3',
            options: [
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('card_background', {
            type: 'color',
            label: 'Card Background',
            default_value: '#ffffff'
        });

        this.addControl('card_border', {
            type: 'color',
            label: 'Card Border',
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
        const members = this.getSetting('members', [
            { name: 'John Doe', position: 'CEO', department: 'Executive', email: 'john@example.com', phone: '+1 234 567 8900', image: '' },
            { name: 'Jane Smith', position: 'CTO', department: 'Technology', email: 'jane@example.com', phone: '+1 234 567 8901', image: '' },
            { name: 'Mike Johnson', position: 'CFO', department: 'Finance', email: 'mike@example.com', phone: '+1 234 567 8902', image: '' }
        ]);
        const showSearch = this.getSetting('show_search', true);
        const searchPlaceholder = this.getSetting('search_placeholder', 'Search by name, position, or department...');
        const columns = this.getSetting('columns', '3');
        const cardBackground = this.getSetting('card_background', '#ffffff');
        const cardBorder = this.getSetting('card_border', '#e5e7eb');
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

        // Generate unique ID
        const uniqueId = `staff-directory-${Math.random().toString(36).substr(2, 9)}`;

        // Build search box
        const searchHtml = showSearch ? `
            <div style="margin-bottom: 30px;">
                <input type="text" class="${uniqueId}-search" placeholder="${this.escapeHtml(searchPlaceholder)}" style="width: 100%; padding: 12px 20px; border: 2px solid ${cardBorder}; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.3s;" onfocus="this.style.borderColor='${positionColor}'" onblur="this.style.borderColor='${cardBorder}'">
            </div>
        ` : '';

        // Build member cards
        const membersArray = Array.isArray(members) ? members : [];
        const memberCards = membersArray.map((member, index) => {
            const name = member.name || 'Staff Member';
            const position = member.position || 'Position';
            const department = member.department || 'Department';
            const email = member.email || '';
            const phone = member.phone || '';
            const image = member.image || '';

            // Build image
            let imageHtml = '';
            if (image) {
                imageHtml = `<img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(name)}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px;">`;
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                imageHtml = `<div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold; margin: 0 auto 15px;">${initials}</div>`;
            }

            const emailHtml = email ? `<div style="color: ${infoColor}; font-size: 13px; margin-top: 8px;"><i class="fa fa-envelope"></i> <a href="mailto:${this.escapeHtml(email)}" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${this.escapeHtml(email)}</a></div>` : '';
            const phoneHtml = phone ? `<div style="color: ${infoColor}; font-size: 13px; margin-top: 6px;"><i class="fa fa-phone"></i> ${this.escapeHtml(phone)}</div>` : '';

            return `
                <div class="${uniqueId}-card" data-name="${this.escapeHtml(name.toLowerCase())}" data-position="${this.escapeHtml(position.toLowerCase())}" data-department="${this.escapeHtml(department.toLowerCase())}" style="background: ${cardBackground}; border: 1px solid ${cardBorder}; border-radius: 8px; padding: 20px; text-align: center; transition: box-shadow 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                    ${imageHtml}
                    <h3 style="color: ${nameColor}; font-size: 18px; font-weight: 600; margin: 0 0 6px 0;">${this.escapeHtml(name)}</h3>
                    <p style="color: ${positionColor}; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">${this.escapeHtml(position)}</p>
                    <p style="color: ${infoColor}; font-size: 13px; margin: 0;">${this.escapeHtml(department)}</p>
                    ${emailHtml}
                    ${phoneHtml}
                </div>
            `;
        }).join('');

        // Build grid
        const gridHtml = `
            <div class="${uniqueId}-grid" style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 25px;">
                ${memberCards}
            </div>
        `;

        // Build search script
        const searchScript = showSearch ? `
            <script>
            (function() {
                const searchInput = document.querySelector('.${uniqueId}-search');
                const cards = document.querySelectorAll('.${uniqueId}-card');
                
                if (searchInput && cards.length > 0) {
                    searchInput.addEventListener('input', function(e) {
                        const searchTerm = e.target.value.toLowerCase();
                        
                        cards.forEach(card => {
                            const name = card.dataset.name || '';
                            const position = card.dataset.position || '';
                            const department = card.dataset.department || '';
                            
                            const matches = name.includes(searchTerm) || 
                                          position.includes(searchTerm) || 
                                          department.includes(searchTerm);
                            
                            card.style.display = matches ? 'block' : 'none';
                        });
                    });
                }
            })();
            </script>
        ` : '';

        const content = `
            ${searchHtml}
            ${gridHtml}
            ${searchScript}
        `;

        // Build wrapper classes
        let wrapperClasses = ['staff-directory-widget'];
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

window.elementorWidgetManager.registerWidget(StaffDirectoryWidget);
