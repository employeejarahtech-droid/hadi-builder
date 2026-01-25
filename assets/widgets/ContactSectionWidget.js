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
      default_value: 'Contact Us 1',
      placeholder: 'Enter section title'
    });

    this.addControl('section_description', {
      type: 'textarea',
      label: 'Description',
      default_value: 'The automated process starts as soon as your clothes go into the machine.',
      placeholder: 'Enter description'
    });

    this.addControl('address', {
      type: 'textarea',
      label: 'Address',
      default_value: '198 West 21th Street, Suite 721 New York NY 10016',
      placeholder: 'Enter address'
    });

    this.addControl('email', {
      type: 'text',
      label: 'Email',
      default_value: 'info@jarahtech.com',
      placeholder: 'Enter email'
    });

    this.addControl('phone', {
      type: 'text',
      label: 'Phone',
      default_value: '+1 123 456 7890',
      placeholder: 'Enter phone number'
    });

    this.addControl('website', {
      type: 'text',
      label: 'Website',
      default_value: 'www.jarahtech.com',
      placeholder: 'Enter website URL'
    });

    this.endControlsSection();

    // Style Section
    this.startControlsSection('style_section', {
      label: 'Layout',
      tab: 'style'
    });

    this.addControl('column_layout', {
      type: 'select',
      label: 'Column Layout (Info/Form)',
      options: [
        { value: '3-9', label: '3 / 9' },
        { value: '4-8', label: '4 / 8' },
        { value: '5-7', label: '5 / 7' },
        { value: '6-6', label: '6 / 6' },
        { value: '7-5', label: '7 / 5' },
        { value: '8-4', label: '8 / 4' },
        { value: '9-3', label: '9 / 3' }
      ],
      default_value: '5-7'
    });

    this.addControl('image_position', {
      type: 'select',
      label: 'Info Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' }
      ],
      default_value: 'left'
    });

    this.addControl('flex_direction', {
      type: 'select',
      label: 'Flex Direction',
      options: [
        { value: 'row', label: 'Left to Right' },
        { value: 'row-reverse', label: 'Right to Left' }
      ],
      default_value: 'row'
    });

    this.addControl('gap', {
      type: 'slider',
      label: 'Column Gap',
      default_value: { size: 30, unit: 'px' },
      range: {
        min: 0,
        max: 100,
        step: 5
      }
    });

    this.addControl('title_font_size', {
      type: 'slider',
      label: 'Title Font Size (Desktop)',
      default_value: { size: 36, unit: 'px' },
      range: {
        min: 10,
        max: 100,
        step: 1
      }
    });

    this.addControl('title_font_size_tablet', {
      type: 'slider',
      label: 'Title Font Size (Tablet)',
      default_value: { size: 28, unit: 'px' },
      range: {
        min: 10,
        max: 80,
        step: 1
      }
    });

    this.addControl('title_font_size_mobile', {
      type: 'slider',
      label: 'Title Font Size (Mobile)',
      default_value: { size: 24, unit: 'px' },
      range: {
        min: 10,
        max: 60,
        step: 1
      }
    });

    this.endControlsSection();
  }

  constructor() {
    super();
  }

  render() {
    const title = this.getSetting('section_title', 'Contact Us 1');
    const description = this.getSetting('section_description', 'The automated process starts as soon as your clothes go into the machine.');
    const address = this.getSetting('address', '198 West 21th Street, Suite 721 New York NY 10016');
    const email = this.getSetting('email', 'info@jarahtech.com');
    const phone = this.getSetting('phone', '+1 123 456 7890');
    const website = this.getSetting('website', 'www.jarahtech.com');

    const flexDirection = this.getSetting('flex_direction', 'row');
    const gap = this.getSetting('gap', { size: 30, unit: 'px' });
    const columnLayout = this.getSetting('column_layout', '5-7');
    const infoPosition = this.getSetting('image_position', 'left'); // Using image_position key for consistency or add new key? Using existing key from AboutSectionWidget pattern but label changed.

    const titleFontSize = this.getSetting('title_font_size', { size: 36, unit: 'px' });
    const titleFontSizeTablet = this.getSetting('title_font_size_tablet', { size: 28, unit: 'px' });
    const titleFontSizeMobile = this.getSetting('title_font_size_mobile', { size: 24, unit: 'px' });

    // Generate a unique Class for scoping styles
    const uid = 'contact_' + Math.floor(Math.random() * 100000);

    // Parse column sizes
    const [leftColSize, rightColSize] = columnLayout.split('-');

    let infoColClass, formColClass;

    if (infoPosition === 'left') {
      infoColClass = `col-lg-${leftColSize}`;
      formColClass = `col-lg-${rightColSize}`;
    } else {
      formColClass = `col-lg-${leftColSize}`;
      infoColClass = `col-lg-${rightColSize}`;
    }

    const style = `
        <style>
            .${uid} .title h2 {
                font-size: ${titleFontSize.size}${titleFontSize.unit};
            }

            .${uid} .row {
                transition: flex-direction 0.3s;
            }

            /* Responsive Design */
            @media (max-width: 992px) {
                /* Force bootstrap columns to stack */
                .${uid} .row > div {
                    width: 100% !important;
                    margin-bottom: 30px;
                }

                .${uid} .title h2 {
                    font-size: ${titleFontSizeTablet.size}${titleFontSizeTablet.unit};
                }
            }

            @media (max-width: 767px) {
                .${uid} .title h2 {
                    font-size: ${titleFontSizeMobile.size}${titleFontSizeMobile.unit};
                }
            }

            /* Builder View Support - Tablet & Mobile */
            .canvas-wrapper.tablet .${uid} .row > div,
            .canvas-wrapper.mobile .${uid} .row > div {
                width: 100% !important;
                margin-bottom: 30px;
            }

            .canvas-wrapper.tablet .${uid} .title h2 {
                font-size: ${titleFontSizeTablet.size}${titleFontSizeTablet.unit};
            }

            .canvas-wrapper.mobile .${uid} .title h2 {
                font-size: ${titleFontSizeMobile.size}${titleFontSizeMobile.unit};
            }
        </style>
    `;

    const infoColumn = `
        <div class="${infoColClass}">
            <div class="contact-info mb-5 mb-lg-0">
              <div class="contact-info-single">
                <div class="icon">
                  <i class="fa fa-map-marker-alt"></i>
                </div>
                <div class="contact-text">
                  <div class="contact-heading">Address:</div>
                  <div>
                    ${this.escapeHtml(address)}
                  </div>
                </div>
              </div>
              <div class="contact-info-single">
                <div class="icon">
                  <i class="fa fa-envelope"></i>
                </div>
                <div class="contact-text">
                  <div class="contact-heading">Email:</div>
                  <div>${this.escapeHtml(email)}</div>
                </div>
              </div>
              <div class="contact-info-single">
                <div class="icon">
                  <i class="fa fa-phone-alt"></i>
                </div>
                <div class="contact-text">
                  <div class="contact-heading">Phone:</div>
                  <div>${this.escapeHtml(phone)}</div>
                </div>
              </div>
              <div class="contact-info-single">
                <div class="icon">
                  <i class="fa fa-globe"></i>
                </div>
                <div class="contact-text">
                  <div class="contact-heading">Website:</div>
                  <div>
                    <a href="https://${website}">${this.escapeHtml(website)}</a>
                  </div>
                </div>
              </div>
            </div>
        </div>
    `;

    const formColumn = `
        <div class="${formColClass}">
            <div class="contact-form">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label for="fname">First Name</label>
                      <input type="text" class="form-control" id="fname" placeholder="First Name" required="">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label for="lname">Last Name</label>
                      <input type="text" class="form-control" id="lname" placeholder="Last Name" required="">
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group mb-3">
                      <label for="email">Email</label>
                      <input type="email" class="form-control" id="email" placeholder="Email" required="">
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group mb-3">
                      <label for="phone">Phone</label>
                      <input type="text" class="form-control" id="phone" placeholder="Phone Number" required="">
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group mb-3">
                      <label for="subject">Subject</label>
                      <input type="text" class="form-control" id="subject" placeholder="Subject" required="">
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group mb-3">
                      <label for="message">Message</label>
                      <textarea class="form-control" id="message" rows="3" placeholder="Message" required=""></textarea>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group text-center">
                      <button type="submit" class="global-btn-style btn-common primary-btn">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
        </div>
    `;

    return `
    ${style}
    <section class="contact-1 pt-60 pb-60 ${uid}">
      <div class="container">
        <div class="comingsoon-body-item block-item text-center">
          <div class="title title_1bececf">
            <h2>
              <span></span>
              <span>${this.escapeHtml(title)}</span>
              <span></span>
            </h2>
          </div>
        </div>
        <div class="comingsoon-body-item block-item text-center">
          <div class="plain_text plain_text_1bececf">
            <p>
              ${this.escapeHtml(description)}
            </p>
          </div>
        </div>
        <div class="comingsoon-body-item block-item">
          <div class="contact-wrap mt-5">
            <div class="row align-items-center" style="flex-direction: ${flexDirection}; --bs-gutter-x: ${gap.size}${gap.unit};">
                ${infoPosition === 'left' ? infoColumn + formColumn : formColumn + infoColumn}
            </div>
          </div>
        </div>
      </div>
    </section>
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
