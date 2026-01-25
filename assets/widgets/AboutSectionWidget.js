/**
 * AboutSectionWidget - A specialized widget for about/introduction sections
 * Provides controls for title, description, image, and CTA button
 */
class AboutSectionWidget extends WidgetBase {
    getName() {
        return 'about-section';
    }

    getTitle() {
        return 'About Section';
    }

    getIcon() {
        return 'fa fa-info-circle';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['about', 'section', 'introduction', 'company', 'story'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            subtitle_text: 'WHAT WE DO',
            title: 'What Services we Provide for Our Customers Business',
            description: 'Our agency can only be as strong as our people our team follwing agenhave run their businesses designed.',
            image: { url: 'assets/img/team/1.jpg' },
            image_position: 'right',
            show_primary_btn: 'yes',
            primary_btn_text: 'Add to Cart',
            primary_btn_link: '#',
            show_primary_outline_btn: 'no',
            primary_outline_btn_text: 'Buy Now',
            primary_outline_btn_link: '#',
            show_secondary_btn: 'no',
            secondary_btn_text: 'Buy Now',
            secondary_btn_link: '#',
            show_secondary_outline_btn: 'no',
            secondary_outline_btn_text: 'Buy Now',
            secondary_outline_btn_link: '#',
            show_white_btn: 'no',
            white_btn_text: 'Buy Now',
            white_btn_link: '#',
            show_plain_btn: 'no',
            plain_btn_text: 'Buy Now',
            plain_btn_link: '#',
            show_play_btn: 'no'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'About Content',
            tab: 'content'
        });

        this.addControl('subtitle_text', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'WHAT WE DO',
            placeholder: 'Enter subtitle'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'What Services we Provide for Our Customers Business',
            placeholder: 'Enter title'
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

        this.addControl('content_paragraph_1', {
            type: 'summernote',
            label: 'Paragraph 1',
            height: '250px',
            toolbar: 'basic',
            default_value: '<strong>Tech Zone – F.Z.C</strong> is a global trading and distribution company specializing in high-quality technology and electronic products. We serve retailers, wholesalers, and business partners across multiple regions with consistent supply and competitive pricing.'
        });

        this.addControl('images_list', {
            type: 'repeater',
            label: 'Images List',
            fields: [
                {
                    name: 'image_file',
                    label: 'Image',
                    type: 'media',
                    default: { url: 'assets/img/team/1.jpg' }
                },
                {
                    name: 'image_link',
                    label: 'Link',
                    type: 'url',
                    default: '#'
                }
            ],
            default: [
                {
                    image_file: { url: 'assets/img/team/1.jpg' },
                    image_link: '#'
                }
            ]
        });

        this.endControlsSection();

        // Buttons Section
        this.startControlsSection('buttons_section', {
            label: 'Buttons',
            tab: 'content'
        });

        // Buttons Repeater
        this.addControl('buttons_list', {
            type: 'repeater',
            label: 'Buttons',
            fields: [
                {
                    name: 'button_text',
                    label: 'Text',
                    type: 'text',
                    default: 'Button Text',
                    condition: { 'button_style!': 'btn-play' }
                },
                {
                    name: 'button_link',
                    label: 'Link',
                    type: 'url',
                    default: '#'
                },
                {
                    name: 'button_style',
                    label: 'Style',
                    type: 'select',
                    options: [
                        { value: 'primary-btn', label: 'Primary' },
                        { value: 'primary-btn-outline', label: 'Primary Outline' },
                        { value: 'secondary-btn', label: 'Secondary' },
                        { value: 'secondary-btn-outline', label: 'Secondary Outline' },
                        { value: 'btn-bg-white', label: 'White' },
                        { value: 'btn-plain', label: 'Plain' },
                        { value: 'btn-play', label: 'Play Button' }
                    ],
                    default: 'primary-btn'
                }
            ],
            default: [
                {
                    button_text: 'Add to Cart',
                    button_link: '#',
                    button_style: 'primary-btn'
                }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Layout',
            tab: 'style'
        });

        this.addControl('column_layout', {
            type: 'select',
            label: 'Column Layout (Left/Right)',
            options: [
                { value: '3-9', label: '3 / 9' },
                { value: '4-8', label: '4 / 8' },
                { value: '5-7', label: '5 / 7' },
                { value: '6-6', label: '6 / 6' },
                { value: '7-5', label: '7 / 5' },
                { value: '8-4', label: '8 / 4' },
                { value: '9-3', label: '9 / 3' }
            ],
            default_value: '6-6'
        });

        this.addControl('image_position', {
            type: 'select',
            label: 'Image Position',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'right'
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
        const title = this.getSetting('title', 'What Services we Provide for Our Customers Business');
        const description = this.getSetting('content_paragraph_1') || '<strong>Tech Zone – F.Z.C</strong> is a global trading and distribution company specializing in high-quality technology and electronic products. We serve retailers, wholesalers, and business partners across multiple regions with consistent supply and competitive pricing.';

        const imagesList = this.getSetting('images_list', []);
        const imagePosition = this.getSetting('image_position', 'right');

        const flexDirection = this.getSetting('flex_direction', 'row');
        const gap = this.getSetting('gap', { size: 30, unit: 'px' });
        const columnLayout = this.getSetting('column_layout', '6-6');
        const backgroundImageList = this.getSetting('background_image_list', []);

        const titleFontSize = this.getSetting('title_font_size', { size: 36, unit: 'px' });
        const titleFontSizeTablet = this.getSetting('title_font_size_tablet', { size: 28, unit: 'px' });
        const titleFontSizeMobile = this.getSetting('title_font_size_mobile', { size: 24, unit: 'px' });

        // Generate a unique Class for scoping styles
        const uid = 'about_' + Math.floor(Math.random() * 100000);

        // Parse column sizes
        const [leftColSize, rightColSize] = columnLayout.split('-');

        // Determine classes based on image position
        // If image is left: Image gets leftColSize, Content gets rightColSize
        // If image is right: Content gets leftColSize, Image gets rightColSize
        let imageColClass, contentColClass;

        if (imagePosition === 'left') {
            imageColClass = `col-lg-${leftColSize}`;
            contentColClass = `col-lg-${rightColSize}`;
        } else {
            contentColClass = `col-lg-${leftColSize}`;
            imageColClass = `col-lg-${rightColSize}`;
        }

        const buttonsList = this.getSetting('buttons_list', []);

        // Build buttons HTML
        let buttonsHTML = '';

        if (buttonsList && buttonsList.length > 0) {
            buttonsList.forEach(button => {
                const style = button.button_style || 'primary-btn';
                const link = button.button_link || '#';
                const text = button.button_text || 'Button';

                if (style === 'btn-play') {
                    buttonsHTML += `
                        <a href="${link}" class="btn-common btn-play">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
                                    <path fill="var(--color-primary)" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128"></path>
                                </svg>
                            </span>
                        </a>
                    `;
                } else {
                    buttonsHTML += `
                        <a href="${link}" class="global-btn-style btn-common ${style}">
                            <span>${this.escapeHtml(text)}</span>
                        </a>
                    `;
                }
            });
        }

        // Content column
        const contentColumn = `
            <div class="${contentColClass}">
                <div class="ebl-data-blocks">
                    ${subtitleText ? `
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="subtitle subtitle_1bececf">
                            <h4>
                                <span class="subtitle-first-span"></span>
                                <span class="subtitle-middle-span">${this.escapeHtml(subtitleText)}</span>
                                <span class="subtitle-last-span"></span>
                            </h4>
                        </div>
                    </div>
                    ` : ''}
                    ${title ? `
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="title title_1bececf">
                            <h2>
                                <span></span>
                                <span>${this.escapeHtml(title)}</span>
                                <span></span>
                            </h2>
                        </div>
                    </div>
                    ` : ''}
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="plain_text plain_text_1bececf">
                            ${description}
                        </div>
                    </div>
                    ${buttonsHTML ? `
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="button_list button_list_1bececf">
                            ${buttonsHTML}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Image list processing for Dynamic Gallery
        const imageCount = Math.min(imagesList.length, 6); // Cap at 6 for layout classes
        const galleryClass = `count-${imageCount}`;

        // Image column
        const imageColumn = `
            <div class="${imageColClass}">
                <div class="gallery-container aos-init aos-animate" data-aos="aos-blockRubberBand">
                    <div class="image-list ${galleryClass}">
                        ${imagesList.slice(0, 6).map((item, index) => `
                            <div class="img-wrapper img-${index + 1}" onclick="window.location.href='${item.image_link || '#'}'">
                                <img src="${item.image_file.url}" alt="${this.escapeHtml(title)}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

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

                // Process Width
                const widthUnit = item.width_unit || 'px';
                const widthVal = item.width_value || '200';
                let realWidthUnit = widthUnit;
                if (widthUnit === 'percent') realWidthUnit = '%';

                const widthStyle = widthUnit === 'auto' ? 'width: auto;' : `width: ${widthVal}${realWidthUnit};`;

                // Process Height
                const heightUnit = item.height_unit || 'auto';
                const heightVal = item.height_value || '100';
                let realHeightUnit = heightUnit;
                if (heightUnit === 'percent') realHeightUnit = '%';

                const heightStyle = heightUnit === 'auto' ? 'height: auto;' : `height: ${heightVal}${realHeightUnit};`;

                const overflow = item.overflow || 'visible';

                /* 
                 * Overflow is applied to the wrapper div.
                 * Width/Height are applied to the img element to control its size.
                 * If overflow is hidden, and img is larger than wrapper, it will be clipped.
                 */

                return `<div class="about-bg-image" style="position: absolute; ${positionStyles} z-index: 0; pointer-events: none; overflow: ${overflow};">
                    <img src="${item.image.url}" alt="Background" style="${widthStyle} ${heightStyle} opacity: 1; max-width: none;">
                </div>`;
            }).join('');
        }

        const outputHtml = `
            ${style}
        <div class="demo-block pt-60 pb-60 ${uid}" style="position: relative;">
            ${backgroundImageListHTML}
            <div class="container" style="position: relative; z-index: 1;">
                <div class="row align-items-center" style="flex-direction: ${flexDirection}; --bs-gutter-x: ${gap.size}${gap.unit};">
                    ${imagePosition === 'left' ? imageColumn + contentColumn : contentColumn + imageColumn}
                </div>
            </div>
        </div>
        `;

        return this.wrapWithAdvancedSettings(outputHtml, 'about-section-widget');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(AboutSectionWidget);
