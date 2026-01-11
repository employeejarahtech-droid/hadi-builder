/**
 * PortfolioSectionWidget - A specialized widget for portfolio/gallery sections
 * Provides a repeater control for portfolio items with images, titles, categories, and links
 */
class PortfolioSectionWidget extends WidgetBase {
    getName() {
        return 'portfolio-section';
    }

    getTitle() {
        return 'Portfolio Section';
    }

    getIcon() {
        return 'fa fa-images';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['portfolio', 'gallery', 'projects', 'work', 'showcase'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Our Portfolio',
            section_subtitle: 'Recent Projects',
            portfolio_items: [
                {
                    image: { url: 'https://placehold.co/600x400' },
                    title: 'Project Name 1',
                    category: 'Web Design',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/600x400' },
                    title: 'Project Name 2',
                    category: 'Branding',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/600x400' },
                    title: 'Project Name 3',
                    category: 'Development',
                    link: '#'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Portfolio Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Our Portfolio',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'Recent Projects',
            placeholder: 'Enter subtitle'
        });

        this.addControl('portfolio_items', {
            type: 'repeater',
            label: 'Portfolio Items',
            default_value: [],
            fields: [
                {
                    name: 'image',
                    type: 'media',
                    label: 'Image',
                    default_value: { url: 'https://placehold.co/600x400' }
                },
                {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Project Name',
                    placeholder: 'Enter project title'
                },
                {
                    name: 'category',
                    type: 'text',
                    label: 'Category',
                    default_value: 'Category',
                    placeholder: 'Enter category'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: '#',
                    placeholder: 'https://project-link.com'
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
        const sectionTitle = this.getSetting('section_title', 'Our Portfolio');
        const sectionSubtitle = this.getSetting('section_subtitle', 'Recent Projects');
        const portfolioItems = this.getSetting('portfolio_items', []);

        let portfolioHTML = '';
        if (portfolioItems && portfolioItems.length > 0) {
            portfolioHTML = portfolioItems.map(item => {
                return `
          <div class="portfolio-item">
            <a href="${item.link || '#'}" class="portfolio-link">
              <div class="portfolio-image">
                <img src="${item.image?.url || 'https://placehold.co/600x400'}" alt="${this.escapeHtml(item.title || '')}">
                <div class="portfolio-overlay">
                  <div class="portfolio-info">
                    <h3 class="portfolio-title">${this.escapeHtml(item.title || 'Project')}</h3>
                    <p class="portfolio-category">${this.escapeHtml(item.category || '')}</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        `;
            }).join('');
        }

        return `
<div class="portfolio-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="portfolio-grid">
      ${portfolioHTML}
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

window.elementorWidgetManager.registerWidget(PortfolioSectionWidget);
