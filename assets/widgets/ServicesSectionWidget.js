/**
 * ServicesSectionWidget - A specialized widget for services sections
 * Provides a repeater control for service items with icons, titles, descriptions, and links
 */
class ServicesSectionWidget extends WidgetBase {
    getName() {
        return 'services-section';
    }

    getTitle() {
        return 'Services Section';
    }

    getIcon() {
        return 'fa fa-briefcase';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['services', 'section', 'offerings', 'solutions'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Our Services',
            section_subtitle: 'What We Do',
            services: [
                {
                    icon: 'fa fa-code',
                    title: 'Web Development',
                    description: 'Custom web applications built with modern technologies and best practices.',
                    link: '#'
                },
                {
                    icon: 'fa fa-paint-brush',
                    title: 'UI/UX Design',
                    description: 'Beautiful, intuitive designs that enhance user experience and engagement.',
                    link: '#'
                },
                {
                    icon: 'fa fa-chart-line',
                    title: 'Digital Marketing',
                    description: 'Strategic marketing campaigns to grow your online presence and reach.',
                    link: '#'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Services Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Our Services',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'What We Do',
            placeholder: 'Enter subtitle'
        });

        this.addControl('services', {
            type: 'repeater',
            label: 'Services',
            default_value: [],
            fields: [
                {
                    name: 'icon',
                    type: 'icon',
                    label: 'Icon',
                    default_value: 'fa fa-star'
                },
                {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Service Title',
                    placeholder: 'Enter service title'
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    default_value: 'Service description goes here.',
                    placeholder: 'Enter service description'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: '#',
                    placeholder: 'https://your-link.com'
                }
            ],
            title_field: 'title'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const sectionTitle = this.getSetting('section_title', 'Our Services');
        const sectionSubtitle = this.getSetting('section_subtitle', 'What We Do');
        const services = this.getSetting('services', []);

        let servicesHTML = '';
        if (services && services.length > 0) {
            servicesHTML = services.map(service => {
                const iconHTML = service.icon ? `<i class="${service.icon}"></i>` : '<i class="fa fa-star"></i>';
                return `
          <div class="service-item">
            <div class="service-icon">${iconHTML}</div>
            <h3 class="service-title">${this.escapeHtml(service.title || 'Service Title')}</h3>
            <p class="service-description">${this.escapeHtml(service.description || '')}</p>
            <a href="${service.link || '#'}" class="service-link">Learn More →</a>
          </div>
        `;
            }).join('');
        }

        return `
<div class="services-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="services-grid">
      ${servicesHTML}
    </div>
  </div>
</div>
    `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(ServicesSectionWidget);
