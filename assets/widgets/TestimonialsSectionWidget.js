/**
 * TestimonialsSectionWidget - A specialized widget for testimonials/reviews sections
 * Provides a repeater control for testimonial items with name, role, company, avatar, quote, and rating
 */
class TestimonialsSectionWidget extends WidgetBase {
    getName() {
        return 'testimonials-section';
    }

    getTitle() {
        return 'Testimonials Section';
    }

    getIcon() {
        return 'fa fa-quote-right';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['testimonials', 'reviews', 'feedback', 'quotes', 'customers'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'What Our Clients Say',
            section_subtitle: 'Testimonials',
            testimonials: [
                {
                    name: 'John Doe',
                    role: 'CEO',
                    company: 'Tech Corp',
                    avatar: { url: 'https://i.pravatar.cc/150?img=1' },
                    quote: 'Working with this team has been an absolute pleasure. They delivered exceptional results and exceeded our expectations.',
                    rating: 5
                },
                {
                    name: 'Jane Smith',
                    role: 'Marketing Director',
                    company: 'Digital Agency',
                    avatar: { url: 'https://i.pravatar.cc/150?img=5' },
                    quote: 'Professional, creative, and reliable. I highly recommend their services to anyone looking for quality work.',
                    rating: 5
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Testimonials Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'What Our Clients Say',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'Testimonials',
            placeholder: 'Enter subtitle'
        });

        this.addControl('testimonials', {
            type: 'repeater',
            label: 'Testimonials',
            default_value: [],
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    default_value: 'John Doe',
                    placeholder: 'Enter name'
                },
                {
                    name: 'role',
                    type: 'text',
                    label: 'Role/Position',
                    default_value: 'CEO',
                    placeholder: 'Enter role'
                },
                {
                    name: 'company',
                    type: 'text',
                    label: 'Company',
                    default_value: 'Company Name',
                    placeholder: 'Enter company'
                },
                {
                    name: 'avatar',
                    type: 'media',
                    label: 'Avatar',
                    default_value: { url: 'https://i.pravatar.cc/150?img=1' }
                },
                {
                    name: 'quote',
                    type: 'textarea',
                    label: 'Quote',
                    default_value: 'This is a testimonial quote.',
                    placeholder: 'Enter testimonial quote'
                },
                {
                    name: 'rating',
                    type: 'select',
                    label: 'Rating',
                    options: [
                        { value: '5', label: '5 Stars' },
                        { value: '4', label: '4 Stars' },
                        { value: '3', label: '3 Stars' },
                        { value: '2', label: '2 Stars' },
                        { value: '1', label: '1 Star' }
                    ],
                    default_value: '5'
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
        const sectionTitle = this.getSetting('section_title', 'What Our Clients Say');
        const sectionSubtitle = this.getSetting('section_subtitle', 'Testimonials');
        const testimonials = this.getSetting('testimonials', []);

        let testimonialsHTML = '';
        if (testimonials && testimonials.length > 0) {
            testimonialsHTML = testimonials.map(testimonial => {
                const rating = parseInt(testimonial.rating || 5);
                const starsHTML = Array(5).fill(0).map((_, i) =>
                    `<i class="fa${i < rating ? 's' : 'r'} fa-star"></i>`
                ).join('');

                return `
          <div class="testimonial-item">
            <div class="testimonial-rating">${starsHTML}</div>
            <p class="testimonial-quote">"${this.escapeHtml(testimonial.quote || '')}"</p>
            <div class="testimonial-author">
              <img src="${testimonial.avatar?.url || 'https://i.pravatar.cc/150'}" alt="${this.escapeHtml(testimonial.name || '')}" class="testimonial-avatar">
              <div class="testimonial-info">
                <h4 class="testimonial-name">${this.escapeHtml(testimonial.name || 'Anonymous')}</h4>
                <p class="testimonial-role">${this.escapeHtml(testimonial.role || '')}${testimonial.company ? ` at ${this.escapeHtml(testimonial.company)}` : ''}</p>
              </div>
            </div>
          </div>
        `;
            }).join('');
        }

        return `
<div class="testimonials-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="testimonials-grid">
      ${testimonialsHTML}
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

window.elementorWidgetManager.registerWidget(TestimonialsSectionWidget);
