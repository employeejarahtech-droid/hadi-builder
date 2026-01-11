/**
 * FooterSectionWidget - Comprehensive footer with brand, widgets, and bottom bar
 * Based on reference structure with brand section, 3 widget columns, and bottom bar
 * 
 * FIXED (2026-01-08):
 * - Device-switcher now works correctly for .main-footer element
 * - Replaced viewport-based @media queries with device-class-based CSS
 * - Footer now responds to .canvas-wrapper.tablet and .canvas-wrapper.mobile classes
 * - Responsive behavior adapts when device-switcher buttons are clicked
 */
class FooterSectionWidget extends WidgetBase {
  getName() {
    return 'footer-section';
  }

  getTitle() {
    return 'Footer Section';
  }

  getIcon() {
    return 'fa fa-th-large';
  }

  getCategories() {
    return ['section', 'footer'];
  }

  getKeywords() {
    return ['footer', 'section', 'brand', 'bottom'];
  }

  isContainer() {
    return false;
  }

  getDefaultSettings() {
    return {
      // Brand Section
      brand_logo: { url: 'https://placehold.co/180x60' },
      brand_description: 'We are a leading company dedicated to providing exceptional services and solutions to our clients worldwide.',
      brand_read_more_text: 'Read More',
      brand_read_more_url: '#',
      show_brand: true,

      // Column 1 - Links
      col1_title: 'Company',
      col1_menu: [],
      show_arrow_icons: true,

      // Column 2 - Gallery
      col2_title: 'Gallery',
      gallery_images: [],

      // Column 3 - Contact
      col3_title: 'Contact Us',
      contact_address: '123 Main Street, City, State 12345',
      contact_phone: '+1 (234) 567-8900',
      contact_email: 'info@example.com',
      social_links: [
        { icon: 'fab fa-facebook-f', url: 'https://facebook.com', label: 'Facebook' },
        { icon: 'fab fa-twitter', url: 'https://twitter.com', label: 'Twitter' },
        { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com', label: 'LinkedIn' }
      ],

      // Bottom Bar
      copyright_text: 'Copyright © 2024 Company Name. All rights reserved.',
      payment_text: "We're using safe payment for",
      payment_image: { url: '' },
      show_bottom_bar: true,

      // Style
      background_color: '#1e293b',
      text_color: '#e2e8f0',
      heading_color: '#ffffff',
      link_hover_color: '#60a5fa',
      background_image_list: []
    };
  }

  registerControls() {
    // ===== BRAND SECTION =====
    this.startControlsSection('brand_section', {
      label: 'Brand Section',
      tab: 'content'
    });

    this.addControl('show_brand', {
      type: 'select',
      label: 'Show Brand Section',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      default_value: true
    });

    this.addControl('brand_logo', {
      type: 'media',
      label: 'Logo',
      default_value: { url: 'https://placehold.co/180x60' }
    });

    this.addControl('brand_description', {
      type: 'textarea',
      label: 'Description',
      default_value: 'Company description...',
      placeholder: 'Enter brand description'
    });

    this.addControl('brand_read_more_text', {
      type: 'text',
      label: 'Read More Text',
      default_value: 'Read More',
      placeholder: 'Read More'
    });

    this.addControl('brand_read_more_url', {
      type: 'url',
      label: 'Read More URL',
      default_value: '#',
      placeholder: '#'
    });

    this.endControlsSection();

    // ===== COLUMN 1 - LINKS =====
    this.startControlsSection('column1_section', {
      label: 'Column 1 - Links',
      tab: 'content'
    });

    this.addControl('col1_title', {
      type: 'text',
      label: 'Title',
      default_value: 'Company',
      placeholder: 'Enter title'
    });

    this.addControl('col1_menu', {
      type: 'menu',
      label: 'Menu',
      default_value: '',
      placeholder: 'Select menu'
    });

    this.addControl('show_arrow_icons', {
      type: 'select',
      label: 'Show Arrow Icons',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      default_value: true
    });

    this.endControlsSection();

    // ===== COLUMN 2 - GALLERY =====
    this.startControlsSection('column2_section', {
      label: 'Column 2 - Gallery',
      tab: 'content'
    });

    this.addControl('col2_title', {
      type: 'text',
      label: 'Title',
      default_value: 'Gallery',
      placeholder: 'Enter title'
    });

    this.addControl('gallery_images', {
      type: 'repeater',
      label: 'Gallery Images',
      default_value: [],
      fields: [
        {
          name: 'image',
          type: 'media',
          label: 'Image',
          default_value: ''
        },
        {
          name: 'link',
          type: 'url',
          label: 'Link',
          default_value: '#'
        }
      ],
      title_field: 'link'
    });

    this.endControlsSection();

    // ===== COLUMN 3 - CONTACT =====
    this.startControlsSection('column3_section', {
      label: 'Column 3 - Contact',
      tab: 'content'
    });

    this.addControl('col3_title', {
      type: 'text',
      label: 'Title',
      default_value: 'Contact Us',
      placeholder: 'Enter title'
    });

    this.addControl('contact_address', {
      type: 'textarea',
      label: 'Address',
      default_value: '123 Main Street\nCity, State 12345',
      placeholder: 'Enter address'
    });

    this.addControl('contact_phone', {
      type: 'text',
      label: 'Phone',
      default_value: '+1 (234) 567-8900',
      placeholder: '+1 234 567 890'
    });

    this.addControl('contact_email', {
      type: 'text',
      label: 'Email',
      default_value: 'info@example.com',
      placeholder: 'info@example.com'
    });

    this.addControl('social_links', {
      type: 'repeater',
      label: 'Social Links',
      default_value: [
        { icon: 'fab fa-facebook-f', url: 'https://facebook.com', label: 'Facebook' },
        { icon: 'fab fa-twitter', url: 'https://twitter.com', label: 'Twitter' },
        { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com', label: 'LinkedIn' }
      ],
      fields: [
        {
          name: 'icon',
          type: 'icon',
          label: 'Icon',
          default_value: 'fab fa-facebook-f'
        },
        {
          name: 'url',
          type: 'url',
          label: 'URL',
          default_value: '#'
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          default_value: 'Social'
        }
      ],
      title_field: 'label'
    });

    this.endControlsSection();

    // ===== BOTTOM BAR =====
    this.startControlsSection('bottom_bar_section', {
      label: 'Bottom Bar',
      tab: 'content'
    });

    this.addControl('show_bottom_bar', {
      type: 'select',
      label: 'Show Bottom Bar',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      default_value: true
    });

    this.addControl('copyright_text', {
      type: 'text',
      label: 'Copyright Text',
      default_value: 'Copyright © 2024 Company Name. All rights reserved.',
      placeholder: 'Copyright text'
    });

    this.addControl('payment_text', {
      type: 'text',
      label: 'Payment Text',
      default_value: "We're using safe payment for",
      placeholder: 'Payment text'
    });

    this.addControl('payment_image', {
      type: 'media',
      label: 'Payment Image',
      default_value: { url: '' }
    });

    this.endControlsSection();

    // ===== STYLE =====
    this.startControlsSection('style_section', {
      label: 'Footer Style',
      tab: 'style'
    });

    this.addControl('background_color', {
      type: 'color',
      label: 'Background Color',
      default_value: '#1e293b'
    });

    this.addControl('text_color', {
      type: 'color',
      label: 'Text Color',
      default_value: '#e2e8f0'
    });

    this.addControl('heading_color', {
      type: 'color',
      label: 'Heading Color',
      default_value: '#ffffff'
    });

    this.addControl('link_hover_color', {
      type: 'color',
      label: 'Link Hover Color',
      default_value: '#60a5fa'
    });

    this.addControl('background_image_list', {
      type: 'repeater',
      label: 'Background Images',
      default_value: [],
      fields: [
        {
          name: 'image',
          type: 'media',
          label: 'Image',
          default_value: ''
        },
        {
          name: 'position',
          type: 'select',
          label: 'Position',
          options: [
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-center', label: 'Top Center' },
            { value: 'top-right', label: 'Top Right' },
            { value: 'center-left', label: 'Center Left' },
            { value: 'center-center', label: 'Center Center' },
            { value: 'center-right', label: 'Center Right' },
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-center', label: 'Bottom Center' },
            { value: 'bottom-right', label: 'Bottom Right' }
          ],
          default_value: 'top-left'
        }
      ]
    });

    this.endControlsSection();
  }

  constructor() {
    super();
  }

  render() {
    // Get all settings
    const showBrand = this.getSetting('show_brand', true);
    const brandLogo = this.getSetting('brand_logo', { url: '' });
    const brandDescription = this.getSetting('brand_description', '');
    const brandReadMoreText = this.getSetting('brand_read_more_text', 'Read More');
    const brandReadMoreUrl = this.getSetting('brand_read_more_url', '#');

    const col1Title = this.getSetting('col1_title', 'Company');
    const col1Menu = this.getSetting('col1_menu', []);
    const showArrowIcons = this.getSetting('show_arrow_icons', true);

    const col2Title = this.getSetting('col2_title', 'Gallery');
    const galleryImages = this.getSetting('gallery_images', []);

    const col3Title = this.getSetting('col3_title', 'Contact Us');
    const contactAddress = this.getSetting('contact_address', '');
    const contactPhone = this.getSetting('contact_phone', '');
    const contactEmail = this.getSetting('contact_email', '');
    const socialLinks = this.getSetting('social_links', []);

    const showBottomBar = this.getSetting('show_bottom_bar', true);
    let copyrightText = this.getSetting('copyright_text', '');
    if (copyrightText) {
      copyrightText = copyrightText.replace(/{year}/g, new Date().getFullYear());
    }
    const paymentText = this.getSetting('payment_text', '');
    const paymentImage = this.getSetting('payment_image', { url: '' });

    const backgroundColor = this.getSetting('background_color', '#1e293b');
    const textColor = this.getSetting('text_color', '#e2e8f0');
    const headingColor = this.getSetting('heading_color', '#ffffff');
    const linkHoverColor = this.getSetting('link_hover_color', '#60a5fa');
    const backgroundImageList = this.getSetting('background_image_list', []);

    // Build Column 1 menu
    let col1MenuHTML = '';
    if (col1Menu && col1Menu.length > 0) {
      col1MenuHTML = col1Menu.map(item => {
        const arrowIcon = showArrowIcons ? '<i class="fa fa-angle-right"></i> ' : '';
        return `<li><a href="${item.url || '#'}">${arrowIcon}<span>${this.escapeHtml(item.text || 'Link')}</span></a></li>`;
      }).join('');
    }

    // Build Gallery
    let galleryHTML = '';
    if (galleryImages && galleryImages.length > 0) {
      galleryHTML = galleryImages.map(item => {
        if (!item.image || !item.image.url) return '';
        return `<a href="${item.link || '#'}"><img src="${item.image.url}" alt="Gallery image" loading="lazy"></a>`;
      }).join('');
    }

    // Build Social Links
    let socialLinksHTML = '';
    if (socialLinks && socialLinks.length > 0) {
      socialLinksHTML = socialLinks.map(link => {
        const iconHTML = link.icon ? `<i class="${link.icon}"></i>` : '<i class="fab fa-link"></i>';
        return `<a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="${this.escapeHtml(link.label || 'Social')}">${iconHTML}</a>`;
      }).join('');
    }

    // Build Background Images
    let backgroundImageListHTML = '';
    if (backgroundImageList && backgroundImageList.length > 0) {
      backgroundImageListHTML = backgroundImageList.map((item, index) => {
        if (!item.image || !item.image.url) return '';

        const position = item.position || 'top-left';
        let positionStyles = '';

        switch (position) {
          case 'top-left': positionStyles = 'top: 0; left: 0;'; break;
          case 'top-center': positionStyles = 'top: 0; left: 50%; transform: translateX(-50%);'; break;
          case 'top-right': positionStyles = 'top: 0; right: 0;'; break;
          case 'center-left': positionStyles = 'top: 50%; left: 0; transform: translateY(-50%);'; break;
          case 'center-center': positionStyles = 'top: 50%; left: 50%; transform: translate(-50%, -50%);'; break;
          case 'center-right': positionStyles = 'top: 50%; right: 0; transform: translateY(-50%);'; break;
          case 'bottom-left': positionStyles = 'bottom: 0; left: 0;'; break;
          case 'bottom-center': positionStyles = 'bottom: 0; left: 50%; transform: translateX(-50%);'; break;
          case 'bottom-right': positionStyles = 'bottom: 0; right: 0;'; break;
          default: positionStyles = 'top: 0; left: 0;';
        }

        return `<div class="footer-bg-image" style="position: absolute; ${positionStyles} z-index: 0; pointer-events: none;">
          <img src="${item.image.url}" alt="Background" style="max-width: 200px; opacity: 0.3;">
        </div>`;
      }).join('');
    }

    return `
<footer class="main-footer" style="background-color: ${backgroundColor}; color: ${textColor};">
  ${backgroundImageListHTML}
  
  <div class="container" style="position: relative; z-index: 1;">
    <div class="footer-top">
      ${showBrand ? `
      <div class="footer-brand">
        ${brandLogo.url ? `<div class="footer-logo"><img src="${brandLogo.url}" alt="Logo"></div>` : ''}
        <p class="footer-desc">
          ${this.escapeHtml(brandDescription)}
          ${brandReadMoreText ? `<a href="${brandReadMoreUrl}">${this.escapeHtml(brandReadMoreText)}</a>` : ''}
        </p>
      </div>
      ` : ''}
      
      <div class="footer-top-widgets">
        <!-- Column 1: Links -->
        <div class="footer-widget">
          <h3 style="color: ${headingColor};">${this.escapeHtml(col1Title)}</h3>
          ${col1MenuHTML ? `<div class="footer-menu"><ul>${col1MenuHTML}</ul></div>` : ''}
        </div>
        
        <!-- Column 2: Gallery -->
        <div class="footer-widget">
          <h3 style="color: ${headingColor};">${this.escapeHtml(col2Title)}</h3>
          ${galleryHTML ? `<div class="footer-gallery">${galleryHTML}</div>` : ''}
        </div>
        
        <!-- Column 3: Contact -->
        <div class="footer-widget">
          <h3 style="color: ${headingColor};">${this.escapeHtml(col3Title)}</h3>
          <ul class="corporate-address">
            ${contactAddress ? `
            <li>
              <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="${linkHoverColor}" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"></path>
                </svg>
                <span>${this.escapeHtml(contactAddress).replace(/\n/g, '<br>')}</span>
              </a>
            </li>
            ` : ''}
            ${contactPhone ? `
            <li>
              <a href="tel:${contactPhone}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="${linkHoverColor}" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"></path>
                </svg>
                <span>${this.escapeHtml(contactPhone)}</span>
              </a>
            </li>
            ` : ''}
            ${contactEmail ? `
            <li>
              <a href="mailto:${contactEmail}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="${linkHoverColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.357 7.714l6.98 4.654c.963.641 1.444.962 1.964 1.087c.46.11.939.11 1.398 0c.52-.125 1.001-.446 1.964-1.087l6.98-4.654M7.157 19.5h9.686c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.31-1.311c.328-.642.328-1.482.328-3.162V9.3c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311c-.642-.327-1.482-.327-3.162-.327H7.157c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.31 1.311c-.328.642-.328 1.482-.328 3.162v5.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327"></path>
                </svg>
                <span>${this.escapeHtml(contactEmail)}</span>
              </a>
            </li>
            ` : ''}
          </ul>
          ${socialLinksHTML ? `<div class="footer-socials">${socialLinksHTML}</div>` : ''}
        </div>
      </div>
    </div>
    
    ${showBottomBar ? `
    <div class="footer-bottom">
      <div class="footer-bottom-left">
        <p class="copyright-text">${this.escapeHtml(copyrightText)}</p>
      </div>
      <div class="footer-bottom-right">
        ${paymentText ? `<p>${this.escapeHtml(paymentText)}</p>` : ''}
        ${paymentImage.url ? `<img src="${paymentImage.url}" alt="Payment methods">` : ''}
      </div>
    </div>
    ` : ''}
  </div>
    `;

    /* 
    * Styles are now handled by external footer.css to ensure consistency and responsiveness.
    * Dynamic styles (colors, images) are applied via inline styles in the HTML above.
    */

  }


  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

window.elementorWidgetManager.registerWidget(FooterSectionWidget);
