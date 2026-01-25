class CompanyProfileSection extends WidgetBase {
    getName() {
        return 'company-profile';
    }

    getTitle() {
        return 'Company Profile';
    }

    getIcon() {
        return 'fa fa-building';
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

    registerControls() {
        // Section Header Controls
        this.startControlsSection('section_header_controls', {
            label: 'Section Header',
            tab: 'content'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'Who We Are'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Title',
            default_value: 'Tech Zone – F.Z.C'
        });

        this.addControl('section_description', {
            type: 'textarea',
            label: 'Header Description',
            default_value: 'A dynamic and fast-growing international trading company delivering premium technology, electronics, and mobility solutions worldwide.'
        });

        this.endControlsSection();

        // Main Content Controls
        this.startControlsSection('content_section_controls', {
            label: 'Main Content',
            tab: 'content'
        });

        this.addControl('content_paragraph_1', {
            type: 'summernote',
            label: 'Paragraph 1',
            height: '250px',
            toolbar: 'basic',
            default_value: '<p><b>Tech Zone – F.Z.C </b>is a global trading and distribution company specializing in high-quality technology and electronic products. We serve retailers, wholesalers, and business partners across multiple regions with consistent supply and competitive pricing.</p><p>Our product portfolio includes IT equipment, mobile devices, consumer electronics, gaming solutions, office equipment, and home appliances—making us a one-stop destination for modern technology needs.</p><p>Built on transparency, efficiency, and long-term partnerships, we bridge the gap between manufacturers and markets through reliable sourcing, efficient logistics, and strong after-sales support.</p>'
        });

        this.endControlsSection();

        // Stats/Features Grid Controls
        this.startControlsSection('stats_grid_controls', {
            label: 'Stats & Features',
            tab: 'content'
        });

        this.addControl('stats', {
            type: 'repeater',
            label: 'Features',
            default_value: [
                {
                    title: 'Global Reach',
                    description: 'Serving partners across multiple international markets'
                },
                {
                    title: 'Premium Brands',
                    description: 'Authorized sourcing from world-leading manufacturers'
                },
                {
                    title: 'Reliable Distribution',
                    description: 'Efficient logistics, transparent operations, and professional service'
                }
            ],
            fields: [
                {
                    id: 'title',
                    type: 'text',
                    label: 'Title'
                },
                {
                    id: 'description',
                    type: 'textarea',
                    label: 'Description'
                }
            ]
        });

        this.endControlsSection();

        // Style Section - Layout
        this.startControlsSection('style_section', {
            label: 'Layout',
            tab: 'style'
        });

        this.addControl('grid_columns', {
            type: 'select',
            label: 'Grid Columns (Desktop)',
            default_value: '2',
            options: [
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' }
            ]
        });

        this.addControl('grid_columns_tablet', {
            type: 'select',
            label: 'Grid Columns (Tablet)',
            default_value: '2',
            options: [
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' }
            ]
        });

        this.addControl('grid_columns_mobile', {
            type: 'select',
            label: 'Grid Columns (Mobile)',
            default_value: '1',
            options: [
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' }
            ]
        });

        this.addControl('column_gap', {
            type: 'slider',
            label: 'Column Gap',
            default_value: { size: 30, unit: 'px' },
            range: {
                min: 0,
                max: 100,
                step: 1
            }
        });

        this.endControlsSection();



        this.addControl('section_background', {
            type: 'color',
            label: 'Background Color',
            default_value: ''
        });

        this.addControl('section_text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: ''
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

    render() {
        const subtitle = this.getSetting('section_subtitle', 'Who We Are');
        const title = this.getSetting('section_title', 'Tech Zone – F.Z.C');
        const headerDesc = this.getSetting('section_description', 'A dynamic and fast-growing international trading company delivering premium technology, electronics, and mobility solutions worldwide.');

        const p1 = this.getSetting('content_paragraph_1', '<p><b>Tech Zone – F.Z.C </b>is a global trading and distribution company specializing in high-quality technology and electronic products. We serve retailers, wholesalers, and business partners across multiple regions with consistent supply and competitive pricing.</p><p>Our product portfolio includes IT equipment, mobile devices, consumer electronics, gaming solutions, office equipment, and home appliances—making us a one-stop destination for modern technology needs.</p><p>Built on transparency, efficiency, and long-term partnerships, we bridge the gap between manufacturers and markets through reliable sourcing, efficient logistics, and strong after-sales support.</p>');

        const stats = this.getSetting('stats', []);
        const columnLayout = this.getSetting('column_layout', '6-6');
        const imagePosition = this.getSetting('image_position', 'right');

        // Grid Settings
        const gridColumns = parseInt(this.getSetting('grid_columns', '2'));
        const gridColumnsTablet = parseInt(this.getSetting('grid_columns_tablet', '2'));
        const gridColumnsMobile = parseInt(this.getSetting('grid_columns_mobile', '1'));
        const gridGap = this.getSetting('grid_gap', { size: 30, unit: 'px' });
        const columnGap = this.getSetting('column_gap', { size: 30, unit: 'px' });

        const backgroundImageList = this.getSetting('background_image_list', []);

        const bgColor = this.getSetting('section_background', '');
        const textColor = this.getSetting('section_text_color', '');


        // Parse column sizes
        const [leftColSize, rightColSize] = columnLayout.split('-');

        let imageColClass, contentColClass;
        if (imagePosition === 'left') {
            imageColClass = `col-lg-${leftColSize}`;
            contentColClass = `col-lg-${rightColSize}`;
        } else {
            contentColClass = `col-lg-${leftColSize}`;
            imageColClass = `col-lg-${rightColSize}`;
        }

        // Generate a unique Class for scoping styles
        const uid = 'company_' + Math.floor(Math.random() * 100000);

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
                    case 'bottom-center': positionStyles = 'bottom: 0; left: 50%; translateX(-50%);'; break;
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

                return `<div class="company-bg-image" style="position: absolute; ${positionStyles} z-index: 0; pointer-events: none; overflow: ${overflow};">
                    <img src="${item.image.url}" alt="Background" style="${widthStyle} ${heightStyle} opacity: 1; max-width: none;">
                </div>`;
            }).join('');
        }



        const statsHtml = stats.map(stat => `
            <div class="stat">
                <h3>${this.escapeHtml(stat.title)}</h3>
                <p>${this.escapeHtml(stat.description)}</p>
            </div>
        `).join('');

        const headerContentHtml = `
                ${subtitle ? `
                <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
                    <div class="subtitle subtitle_1bececf max-width-700">
                        <h4>
                            <span class="subtitle-first-span"></span>
                            <span class="subtitle-middle-span">${this.escapeHtml(subtitle)}</span>
                            <span class="subtitle-last-span"></span>
                        </h4>
                    </div>
                </div>
                ` : ''}
                ${title ? `
                <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
                    <div class="title title_1bececf max-width-700">
                        <h2>
                            <span></span>
                            <span>${this.escapeHtml(title)}</span>
                            <span></span>
                        </h2>
                    </div>
                </div>
                ` : ''}
                <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
                    <div class="plain_text plain_text_1bececf max-width-700">
                        ${headerDesc}
                    </div>
                </div>
            `;

        const outputHtml = `
            <style>
                /* Scoped Styles for Company Profile Section */
                .${uid} * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .${uid} {
                    position: relative; /* For absolute background images */
                    font-family: "Inter", sans-serif;
                    line-height: 1.6;
                    padding-left: 20px;
                    padding-right: 20px;
                    background-color: ${bgColor};
                    color: ${textColor};
                }

                .${uid} .container {
                    position: relative; /* Ensure content is above background */
                    z-index: 1;
                    margin: auto;
                }

                .${uid} .profile-header {
                    text-align: center;
                }

                .${uid} .profile-header .subtitle {
                    display: inline-block;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }

                .${uid} .profile-header h2 {
                    font-size: 42px;
                    font-weight: 700;
                }

                .${uid} .profile-header p {
                    max-width: 750px;
                    margin: 0 auto;
                    font-size: 18px;
                    color: inherit;
                    opacity: 0.8;
                }

                .${uid} .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(${gridColumns}, 1fr);
                    column-gap: ${columnGap.size}${columnGap.unit};
                    row-gap: ${gridGap.size}${gridGap.unit};
                    gap: 20px;
                }

                /* Main Layout Grid */
                .${uid} .row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    column-gap: ${columnGap.size}${columnGap.unit};
                    margin-left: 0;
                    margin-right: 0;
                }
                
                /* Reset standard Bootstrap col widths inside our grid row */
                .${uid} .row > [class*="col-"] {
                    width: 100%;
                    max-width: 100%;
                    padding-left: 0;
                    padding-right: 0;
                }

                @media (max-width: 991px) {
                    .${uid} .row {
                        grid-template-columns: 1fr;
                        row-gap: 30px; /* Default stack gap */
                    }
                }

                .${uid} .stat {
                    background: rgba(255,255,255,0.05); /* Slight transparency */
                    padding: 25px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background-color: var(--color-primary);
                }

                .${uid} .stat h3 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: white;
                }

                .${uid} .stat p {
                    font-size: 15px;
                    opacity: 0.8;
                    color: white;
                }

                 /* Responsive - Standard Media Queries */
                @media (max-width: 1024px) {
                    .${uid} .stats-grid {
                        grid-template-columns: repeat(${gridColumnsTablet}, 1fr) !important;
                    }
                }

                @media (max-width: 767px) {
                    .${uid} .stats-grid {
                        grid-template-columns: repeat(${gridColumnsMobile}, 1fr) !important;
                    }
                }

                /* Responsive - Builder View Support */
                .canvas-wrapper.tablet .${uid} .stats-grid {
                    grid-template-columns: repeat(${gridColumnsTablet}, 1fr) !important;
                }

                .canvas-wrapper.mobile .${uid} .stats-grid {
                    grid-template-columns: repeat(${gridColumnsMobile}, 1fr) !important;
                }
            </style>

            <div class="company-profile ${uid}">
                ${backgroundImageListHTML}
                <div class="container">
                    <div class="ebl-data-blocks text-content">
                        ${headerContentHtml}
                        <div class="row align-items-center">
                            <div class="col-lg-6">
                                <div class="mb-2">${p1}</div>
                            </div>
                            <div class="col-lg-6">
                                <div class="stats-grid">
                                    ${statsHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return this.wrapWithAdvancedSettings(outputHtml, 'company-profile-widget');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(CompanyProfileSection);
