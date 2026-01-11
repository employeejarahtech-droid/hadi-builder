/**
 * FeaturesSectionWidget - A specialized widget for features sections
 * Provides a repeater control for feature items with icons, titles, and descriptions
 */
class FeaturesSectionWidget extends WidgetBase {
    getName() {
        return 'features-section';
    }

    getTitle() {
        return 'Features Section';
    }

    getIcon() {
        return 'fa fa-th-large';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['features', 'section', 'benefits', 'services', 'grid'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Our Features',
            section_subtitle: 'What We Offer',
            features: [
                {
                    icon: 'fa fa-rocket',
                    title: 'Fast Performance',
                    description: 'Lightning-fast load times and optimal performance for your users.'
                },
                {
                    icon: 'fa fa-shield-alt',
                    title: 'Secure & Reliable',
                    description: 'Enterprise-grade security to keep your data safe and protected.'
                },
                {
                    icon: 'fa fa-mobile-alt',
                    title: 'Mobile Responsive',
                    description: 'Fully responsive design that works perfectly on all devices.'
                },
                {
                    icon: 'fa fa-headset',
                    title: '24/7 Support',
                    description: 'Round-the-clock customer support to help you whenever you need.'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Features Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Our Features',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'What We Offer',
            placeholder: 'Enter subtitle'
        });

        this.addControl('features', {
            type: 'repeater',
            label: 'Features',
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
                    default_value: 'Feature Title',
                    placeholder: 'Enter feature title'
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    default_value: 'Feature description goes here.',
                    placeholder: 'Enter feature description'
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
        const sectionTitle = this.getSetting('section_title', 'Our Features');
        const sectionSubtitle = this.getSetting('section_subtitle', 'What We Offer');
        const features = this.getSetting('features', []);

        let featuresHTML = '';
        if (features && features.length > 0) {
            featuresHTML = features.map(feature => {
                const iconHTML = feature.icon ? `<i class="${feature.icon}"></i>` : '<i class="fa fa-star"></i>';
                return `
          <div class="feature-item">
            <div class="feature-icon">${iconHTML}</div>
            <h3 class="feature-title">${this.escapeHtml(feature.title || 'Feature Title')}</h3>
            <p class="feature-description">${this.escapeHtml(feature.description || '')}</p>
          </div>
        `;
            }).join('');
        }

        return `
<div class="features-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="features-grid">
      ${featuresHTML}
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

window.elementorWidgetManager.registerWidget(FeaturesSectionWidget);
