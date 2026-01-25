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
            subtitle_text: 'WHAT WE DO',
            section_title: 'Service Style 01',
            description: 'Our agency can only be as strong as our people our team following agenhave run their businesses designed.',

            services: [
                {
                    image: { url: 'assets/img/service-web-development.png' },
                    icon: 'fa fa-code',
                    title: 'Website Development',
                    description: 'Custom website development services tailored to your business needs, ensuring a robust and scalable online presence.',
                    link: '#',
                    button_text: 'Details',
                    hover_title: 'Web Dev',
                    hover_description: 'We build responsive, fast, and secure websites that drive growth and engagement.'
                },
                {
                    image: { url: 'assets/img/service-domain-hosting.png' },
                    icon: 'fa fa-server',
                    title: 'Domain & Hosting',
                    description: 'Reliable and secure domain registration and web hosting services with 99.9% uptime guarantee.',
                    link: '#',
                    button_text: 'Details',
                    hover_title: 'Hosting',
                    hover_description: 'Secure, fast, and scalable hosting solutions for businesses of all sizes.'
                },
                {
                    image: { url: 'assets/img/service-ecommerce.png' },
                    icon: 'fa fa-shopping-cart',
                    title: 'E-Commerce Website Development',
                    description: 'Comprehensive e-commerce solutions including custom online stores, payment gateway integration, and inventory management.',
                    link: '#',
                    button_text: 'Details',
                    hover_title: 'E-Commerce',
                    hover_description: 'Boost your sales with our high-performance e-commerce platforms designed for conversion and growth.'
                },
                {
                    image: { url: 'assets/img/service-accounting.png' },
                    icon: 'fa fa-calculator',
                    title: 'Accounting Software Solutions',
                    description: 'Streamline your financial management with our robust accounting software, featuring real-time reporting and tax automation.',
                    link: '#',
                    button_text: 'Details',
                    hover_title: 'Accounting',
                    hover_description: 'Simplify your finances with our intuitive accounting tools designed for accuracy and efficiency.'
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

        this.addControl('subtitle_text', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'WHAT WE DO',
            placeholder: 'Enter subtitle'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Service Style 01',
            placeholder: 'Enter section title'
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Our agency can only be as strong as our people our team following agenhave run their businesses designed.',
            placeholder: 'Enter description'
        });

        this.addControl('services', {
            type: 'repeater',
            label: 'Services',
            default_value: [],
            fields: [
                {
                    name: 'image',
                    type: 'media',
                    label: 'Image',
                    default_value: { url: 'https://placehold.co/50' }
                },
                {
                    name: 'icon',
                    type: 'icon',
                    label: 'Icon',
                    default_value: 'fa fa-file'
                },
                {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                    default_value: 'Business Audit',
                    placeholder: 'Enter service title'
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    default_value: 'Investment Planning Working with thousands of business companies around',
                    placeholder: 'Enter service description'
                },
                {
                    name: 'button_text',
                    type: 'text',
                    label: 'Button Text',
                    default_value: 'Details',
                    placeholder: 'Enter button text'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: '#',
                    placeholder: 'https://your-link.com'
                },
                {
                    name: 'hover_title',
                    type: 'text',
                    label: 'Hover Title',
                    default_value: 'Member Name',
                    placeholder: 'Enter hover title'
                },
                {
                    name: 'hover_description',
                    type: 'textarea',
                    label: 'Hover Description',
                    default_value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    placeholder: 'Enter hover description'
                }
            ],
            title_field: 'title'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Section Spacing',
            tab: 'style'
        });



        this.addControl('items_per_row', {
            type: 'select',
            label: 'Items Per Row',
            options: [
                { value: '12', label: '1' },
                { value: '6', label: '2' },
                { value: '4', label: '3' },
                { value: '3', label: '4' }
            ],
            default_value: '4'
        });

        this.addControl('column_gap', {
            type: 'slider',
            label: 'Gap',
            default_value: { size: 30, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 1
            },
            selectors: {
                '{{WRAPPER}} .jt-row': 'gap: {{SIZE}}{{UNIT}}; display: flex; flex-wrap: wrap;'
            }
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
                    default: ''
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
                    default: 'top-left'
                },
                {
                    name: 'width_unit',
                    type: 'select',
                    label: 'Width Unit',
                    options: [
                        { value: 'px', label: 'PX' },
                        { value: 'percent', label: '%' },
                        { value: 'vw', label: 'VW' },
                        { value: 'auto', label: 'Auto' }
                    ],
                    default: 'px'
                },
                {
                    name: 'width_value',
                    type: 'text',
                    label: 'Width Value',
                    default: '200',
                    condition: {
                        width_unit: ['px', 'percent', 'vw']
                    }
                },
                {
                    name: 'height_unit',
                    type: 'select',
                    label: 'Height Unit',
                    options: [
                        { value: 'px', label: 'PX' },
                        { value: 'percent', label: '%' },
                        { value: 'vh', label: 'VH' },
                        { value: 'auto', label: 'Auto' }
                    ],
                    default: 'auto'
                },
                {
                    name: 'height_value',
                    type: 'text',
                    label: 'Height Value',
                    default: '100',
                    condition: {
                        height_unit: ['px', 'percent', 'vh']
                    }
                },
                {
                    name: 'overflow',
                    type: 'select',
                    label: 'Overflow',
                    options: [
                        { value: 'visible', label: 'Visible' },
                        { value: 'hidden', label: 'Hidden' }
                    ],
                    default: 'visible'
                }
            ]
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    constructor() {
        super();
    }

    render() {
        const subtitleText = this.getSetting('subtitle_text', 'WHAT WE DO');
        const sectionTitle = this.getSetting('section_title', 'Service Style 01');
        const description = this.getSetting('description', '');
        const services = this.getSetting('services', []);
        const backgroundImageList = this.getSetting('background_image_list', []);

        // Get padding and margin settings
        const padding = this.getSetting('padding', { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' });
        const margin = this.getSetting('margin', { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' });

        // Build padding and margin CSS
        const paddingCSS = `padding: ${padding.top}${padding.unit} ${padding.right}${padding.unit} ${padding.bottom}${padding.unit} ${padding.left}${padding.unit};`;
        const marginCSS = `margin: ${margin.top}${margin.unit} ${margin.right}${margin.unit} ${margin.bottom}${margin.unit} ${margin.left}${margin.unit};`;

        // Generate unique ID for scoped styles
        const uid = 'services_' + Math.floor(Math.random() * 100000);

        // Process Background Images
        const backgroundImageListHTML = backgroundImageList.map((bgItem, index) => {
            if (!bgItem.image || !bgItem.image.url) return '';

            let positionStyles = '';
            switch (bgItem.position) {
                case 'top-left': positionStyles = 'top: 0; left: 0; transform: translate(0, 0);'; break;
                case 'top-center': positionStyles = 'top: 0; left: 50%; transform: translate(-50%, 0);'; break;
                case 'top-right': positionStyles = 'top: 0; right: 0; transform: translate(0, 0);'; break;
                case 'center-left': positionStyles = 'top: 50%; left: 0; transform: translate(0, -50%);'; break;
                case 'center-center': positionStyles = 'top: 50%; left: 50%; transform: translate(-50%, -50%);'; break;
                case 'center-right': positionStyles = 'top: 50%; right: 0; transform: translate(0, -50%);'; break;
                case 'bottom-left': positionStyles = 'bottom: 0; left: 0; transform: translate(0, 0);'; break;
                case 'bottom-center': positionStyles = 'bottom: 0; left: 50%; transform: translate(-50%, 0);'; break;
                case 'bottom-right': positionStyles = 'bottom: 0; right: 0; transform: translate(0, 0);'; break;
                default: positionStyles = 'top: 0; left: 0;';
            }

            // Calculate Width
            let widthStyle = 'width: auto;';
            if (bgItem.width_unit === 'auto') {
                widthStyle = 'width: auto;';
            } else {
                const widthVal = bgItem.width_value || '200';
                widthStyle = `width: ${widthVal}${bgItem.width_unit};`;
            }

            // Calculate Height
            let heightStyle = 'height: auto;';
            if (bgItem.height_unit === 'auto') {
                heightStyle = 'height: auto;';
            } else {
                const heightVal = bgItem.height_value || '100';
                heightStyle = `height: ${heightVal}${bgItem.height_unit};`;
            }

            const overflow = bgItem.overflow || 'visible';

            return `
                <div class="background-image-item" style="position: absolute; ${positionStyles} z-index: 0; pointer-events: none; overflow: ${overflow}; ${widthStyle} ${heightStyle}">
                    <img src="${bgItem.image.url}" alt="Background" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
            `;
        }).join('');

        const itemsPerRow = this.getSetting('items_per_row', '4');
        const colClass = `jt-col-${itemsPerRow}`;

        let servicesHTML = '';
        if (services && services.length > 0) {
            servicesHTML = services.map(service => {
                const imageUrl = service.image?.url || 'https://placehold.co/50';
                const iconHTML = service.icon ? `<i class="${service.icon}"></i>` : '<i class="fa fa-file"></i>';
                const title = service.title || 'Business Audit';
                const description = service.description || '';
                const buttonText = service.button_text || 'Details';
                const link = service.link || '#';
                const hoverTitle = service.hover_title || 'Member Name';
                const hoverDescription = service.hover_description || '';

                return `
                <div class="${colClass} ">
                  <div class="service-item">
                    <div class="service-figure bottom-right">
                      <img src="${imageUrl}" alt="${this.escapeHtml(title)}">
                    </div>
                    <div class="service-box-content">
                      <div class="service-content">
                        <div class="icon">
                          ${iconHTML}
                        </div>
                        <div class="service-text-content">
                          <div class="service-title">
                            <h3 class="">
                              <a href="${link}">${this.escapeHtml(title)}</a>
                            </h3>
                          </div>
                          <p>${this.escapeHtml(description)}</p>
                          <div class="service-button">
                            <a class="btn-service" href="${link}">
                              <span class="bar"></span>
                              <span>${this.escapeHtml(buttonText)}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="hover-content">
                      <div class="hover-content-inner">
                        <div class="hover-content-text">
                          <h3><a href="${link}">${this.escapeHtml(hoverTitle)}</a></h3>
                          <p>${this.escapeHtml(hoverDescription)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
            }).join('');
        }

        const outputHtml = `
<div class="service-1 ${uid}" style="${paddingCSS} ${marginCSS} position: relative;">
    <style>
        .${uid} .container {
            position: relative;
            z-index: 2; 
        }
    </style>
  ${backgroundImageListHTML}

  <div class="container">

    <div class="ebl-data-blocks" style="max-width: 800px;margin: 0 auto;">

        <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
            <div class="subtitle subtitle_1bececf">
                <h4>
                    <span class="subtitle-first-span"></span>
                    <span class="subtitle-middle-span">${this.escapeHtml(subtitleText)}</span>
                    <span class="subtitle-last-span"></span>
                </h4>
            </div>
        </div>
        <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
            <div class="title title_1bececf">
                <h2>
                    <span></span>
                    <span>${this.escapeHtml(sectionTitle)}</span>
                    <span></span>
                </h2>
            </div>
        </div>
        <div class="comingsoon-body-item block-item text-center mb-5 aos-init aos-animate" data-aos="aos-blockRubberBand">
            <div class="plain_text plain_text_1bececf">
                <p>${this.escapeHtml(description)}</p>
            </div>
        </div>
            
    </div>

    <div class="comingsoon-body-item block-item">
      <div class="service_list">
        <div class="service_wrap service-swiper">
          <div class="jt-row">
            ${servicesHTML}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    `;

        return this.wrapWithAdvancedSettings(outputHtml, 'services-section-widget');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(ServicesSectionWidget);
