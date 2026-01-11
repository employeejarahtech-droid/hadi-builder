/**
 * ContactSectionWidget - A specialized widget for contact information sections
 * Provides controls for title, address, phone, email, and optional form
 */
class ContactSectionWidget extends WidgetBase {
    getName() {
        return 'contact-section';
    }

    getTitle() {
        return 'Contact Section';
    }

    getIcon() {
        return 'fa fa-envelope';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['contact', 'form', 'email', 'phone', 'address'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Get In Touch',
            section_subtitle: 'Contact Us',
            address: '123 Main Street, City, State 12345',
            phone: '+1 (234) 567-8900',
            email: 'info@example.com',
            show_form: 'yes'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Contact Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Get In Touch',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'Contact Us',
            placeholder: 'Enter subtitle'
        });

        this.addControl('address', {
            type: 'textarea',
            label: 'Address',
            default_value: '123 Main Street, City, State 12345',
            placeholder: 'Enter address'
        });

        this.addControl('phone', {
            type: 'text',
            label: 'Phone',
            default_value: '+1 (234) 567-8900',
            placeholder: 'Enter phone number'
        });

        this.addControl('email', {
            type: 'text',
            label: 'Email',
            default_value: 'info@example.com',
            placeholder: 'Enter email'
        });

        this.addControl('show_form', {
            type: 'select',
            label: 'Show Contact Form',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'yes'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const sectionTitle = this.getSetting('section_title', 'Get In Touch');
        const sectionSubtitle = this.getSetting('section_subtitle', 'Contact Us');
        const address = this.getSetting('address', '');
        const phone = this.getSetting('phone', '');
        const email = this.getSetting('email', '');
        const showForm = this.getSetting('show_form', 'yes');

        const formHTML = showForm === 'yes' ? `
      <div class="contact-form">
        <form action="#" method="post">
          <div class="form-group">
            <input type="text" name="name" placeholder="Your Name" required>
          </div>
          <div class="form-group">
            <input type="email" name="email" placeholder="Your Email" required>
          </div>
          <div class="form-group">
            <input type="text" name="subject" placeholder="Subject" required>
          </div>
          <div class="form-group">
            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" class="global-btn-style btn-common primary-btn">
            <span></span><span>Send Message</span><span></span>
          </button>
        </form>
      </div>
    ` : '';

        return `
<div class="contact-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="contact-wrapper">
      <div class="contact-info">
        <div class="contact-item">
          <i class="fa fa-map-marker-alt"></i>
          <div class="contact-details">
            <h4>Address</h4>
            <p>${this.escapeHtml(address)}</p>
          </div>
        </div>
        <div class="contact-item">
          <i class="fa fa-phone"></i>
          <div class="contact-details">
            <h4>Phone</h4>
            <p><a href="tel:${phone}">${this.escapeHtml(phone)}</a></p>
          </div>
        </div>
        <div class="contact-item">
          <i class="fa fa-envelope"></i>
          <div class="contact-details">
            <h4>Email</h4>
            <p><a href="mailto:${email}">${this.escapeHtml(email)}</a></p>
          </div>
        </div>
      </div>
      ${formHTML}
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

window.elementorWidgetManager.registerWidget(ContactSectionWidget);
