/**
 * PartnersSectionWidget - A specialized widget for partners/clients logo sections
 * Provides a repeater control for partner logos with names and links
 */
class PartnersSectionWidget extends WidgetBase {
    getName() {
        return 'partners-section';
    }

    getTitle() {
        return 'Partners Section';
    }

    getIcon() {
        return 'fa fa-handshake';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['partners', 'clients', 'logos', 'brands', 'sponsors'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Our Partners',
            section_subtitle: 'Trusted By Leading Brands',
            partners: [
                {
                    logo: { url: 'https://placehold.co/200x80/e2e8f0/64748b?text=Partner+1' },
                    name: 'Partner 1',
                    link: '#'
                },
                {
                    logo: { url: 'https://placehold.co/200x80/e2e8f0/64748b?text=Partner+2' },
                    name: 'Partner 2',
                    link: '#'
                },
                {
                    logo: { url: 'https://placehold.co/200x80/e2e8f0/64748b?text=Partner+3' },
                    name: 'Partner 3',
                    link: '#'
                },
                {
                    logo: { url: 'https://placehold.co/200x80/e2e8f0/64748b?text=Partner+4' },
                    name: 'Partner 4',
                    link: '#'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Partners Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Our Partners',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'Trusted By Leading Brands',
            placeholder: 'Enter subtitle'
        });

        this.addControl('partners', {
            type: 'repeater',
            label: 'Partners',
            default_value: [],
            fields: [
                {
                    name: 'logo',
                    type: 'media',
                    label: 'Logo',
                    default_value: { url: 'https://placehold.co/200x80' }
                },
                {
                    name: 'name',
                    type: 'text',
                    label: 'Partner Name',
                    default_value: 'Partner Name',
                    placeholder: 'Enter partner name'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: '#',
                    placeholder: 'https://partner-website.com'
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
        const sectionTitle = this.getSetting('section_title', 'Our Partners');
        const sectionSubtitle = this.getSetting('section_subtitle', 'Trusted By Leading Brands');
        const partners = this.getSetting('partners', []);

        let partnersHTML = '';
        if (partners && partners.length > 0) {
            partnersHTML = partners.map(partner => {
                const logoUrl = partner.logo?.url || 'https://placehold.co/200x80';
                const partnerName = this.escapeHtml(partner.name || 'Partner');
                const link = partner.link || '#';

                return `
          <div class="partner-item">
            <a href="${link}" target="_blank" rel="noopener noreferrer" title="${partnerName}">
              <img src="${logoUrl}" alt="${partnerName}" class="partner-logo">
            </a>
          </div>
        `;
            }).join('');
        }

        return `
<div class="partners-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="partners-grid">
      ${partnersHTML}
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

window.elementorWidgetManager.registerWidget(PartnersSectionWidget);
