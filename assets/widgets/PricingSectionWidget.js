/**
 * PricingSectionWidget - A specialized widget for pricing plans sections
 * Provides a repeater control for pricing plans with features, prices, and CTA buttons
 */
class PricingSectionWidget extends WidgetBase {
    getName() {
        return 'pricing-section';
    }

    getTitle() {
        return 'Pricing Section';
    }

    getIcon() {
        return 'fa fa-tags';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['pricing', 'plans', 'packages', 'subscription', 'price'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Pricing Plans',
            section_subtitle: 'Choose Your Plan',
            plans: [
                {
                    name: 'Basic',
                    price: '29',
                    currency: '$',
                    period: 'month',
                    features: 'Feature 1\nFeature 2\nFeature 3',
                    button_text: 'Get Started',
                    button_link: '#',
                    featured: 'no'
                },
                {
                    name: 'Pro',
                    price: '79',
                    currency: '$',
                    period: 'month',
                    features: 'All Basic Features\nFeature 4\nFeature 5\nPriority Support',
                    button_text: 'Get Started',
                    button_link: '#',
                    featured: 'yes'
                },
                {
                    name: 'Enterprise',
                    price: '199',
                    currency: '$',
                    period: 'month',
                    features: 'All Pro Features\nFeature 6\nFeature 7\nDedicated Support',
                    button_text: 'Contact Us',
                    button_link: '#',
                    featured: 'no'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Pricing Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Pricing Plans',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'Choose Your Plan',
            placeholder: 'Enter subtitle'
        });

        this.addControl('plans', {
            type: 'repeater',
            label: 'Pricing Plans',
            default_value: [],
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    label: 'Plan Name',
                    default_value: 'Basic',
                    placeholder: 'Enter plan name'
                },
                {
                    name: 'price',
                    type: 'text',
                    label: 'Price',
                    default_value: '29',
                    placeholder: '29'
                },
                {
                    name: 'currency',
                    type: 'text',
                    label: 'Currency Symbol',
                    default_value: '$',
                    placeholder: '$'
                },
                {
                    name: 'period',
                    type: 'text',
                    label: 'Period',
                    default_value: 'month',
                    placeholder: 'month, year, etc.'
                },
                {
                    name: 'features',
                    type: 'textarea',
                    label: 'Features (one per line)',
                    default_value: 'Feature 1\nFeature 2\nFeature 3',
                    placeholder: 'Enter features, one per line'
                },
                {
                    name: 'button_text',
                    type: 'text',
                    label: 'Button Text',
                    default_value: 'Get Started',
                    placeholder: 'Button text'
                },
                {
                    name: 'button_link',
                    type: 'url',
                    label: 'Button Link',
                    default_value: '#',
                    placeholder: 'https://your-link.com'
                },
                {
                    name: 'featured',
                    type: 'select',
                    label: 'Featured Plan',
                    options: [
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' }
                    ],
                    default_value: 'no'
                }
            ],
            title_field: 'name'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const sectionTitle = this.getSetting('section_title', 'Pricing Plans');
        const sectionSubtitle = this.getSetting('section_subtitle', 'Choose Your Plan');
        const plans = this.getSetting('plans', []);

        let plansHTML = '';
        if (plans && plans.length > 0) {
            plansHTML = plans.map(plan => {
                const featuredClass = plan.featured === 'yes' ? 'featured' : '';
                const featuresArray = (plan.features || '').split('\n').filter(f => f.trim());
                const featuresHTML = featuresArray.map(feature =>
                    `<li><i class="fa fa-check"></i> ${this.escapeHtml(feature.trim())}</li>`
                ).join('');

                return `
          <div class="pricing-plan ${featuredClass}">
            ${plan.featured === 'yes' ? '<div class="pricing-badge">Popular</div>' : ''}
            <h3 class="plan-name">${this.escapeHtml(plan.name || 'Plan')}</h3>
            <div class="plan-price">
              <span class="currency">${this.escapeHtml(plan.currency || '$')}</span>
              <span class="amount">${this.escapeHtml(plan.price || '0')}</span>
              <span class="period">/${this.escapeHtml(plan.period || 'month')}</span>
            </div>
            <ul class="plan-features">
              ${featuresHTML}
            </ul>
            <a href="${plan.button_link || '#'}" class="global-btn-style btn-common ${featuredClass ? 'primary-btn' : 'secondary-btn'}">
              <span></span><span>${this.escapeHtml(plan.button_text || 'Get Started')}</span><span></span>
            </a>
          </div>
        `;
            }).join('');
        }

        return `
<div class="pricing-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="pricing-grid">
      ${plansHTML}
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

window.elementorWidgetManager.registerWidget(PricingSectionWidget);
