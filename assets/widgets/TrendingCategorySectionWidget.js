class TrendingCategorySectionWidget extends WidgetBase {
    getName() {
        return 'trending-category-section';
    }

    getTitle() {
        return 'Trending Category Section';
    }

    getIcon() {
        return 'fa fa-th-large';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['trending', 'category', 'b2b', 'products', 'grid'];
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
            default_value: 'Product Segments'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Title',
            default_value: 'Our Trading Categories'
        });

        this.addControl('section_description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'We supply a wide range of technology and electronic products tailored for wholesale, retail, and enterprise distribution.'
        });

        this.endControlsSection();

        // Categories Grid Controls
        this.startControlsSection('categories_grid_controls', {
            label: 'Categories',
            tab: 'content'
        });

        this.addControl('grid_columns', {
            type: 'select',
            label: 'Grid Columns',
            default_value: '3',
            options: [
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' }
            ]
        });

        this.addControl('categories', {
            type: 'repeater',
            label: 'Categories',
            default_value: [
                {
                    image: { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
                    title: 'Computers & IT Equipment',
                    description: 'Desktops, laptops, servers, networking devices, and IT peripherals.'
                },
                {
                    image: { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
                    title: 'Mobile Phones Trading',
                    description: 'Smartphones, tablets, accessories, and mobile technology solutions.'
                },
                {
                    image: { url: 'https://images.unsplash.com/photo-1606813902914-6a1a3f69b76d' },
                    title: 'Gaming Solutions',
                    description: 'Gaming consoles, controllers, accessories, and software titles.'
                },
                {
                    image: { url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04' },
                    title: 'Office Equipment',
                    description: 'Printers, scanners, consumables, and office productivity solutions.'
                },
                {
                    image: { url: 'https://images.unsplash.com/photo-1555617117-08a31f1b0b47' },
                    title: 'Electronics & Gadgets',
                    description: 'Consumer electronics, smart gadgets, and innovative accessories.'
                },
                {
                    image: { url: 'https://images.unsplash.com/photo-1586201375761-83865001e17c' },
                    title: 'Home Appliances',
                    description: 'Small and essential appliances for residential and commercial use.'
                }
            ],
            fields: [
                {
                    id: 'image',
                    type: 'media',
                    label: 'Image'
                },
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
    }

    render() {
        const subtitle = this.getSetting('section_subtitle', 'Product Segments');
        const title = this.getSetting('section_title', 'Our Trading Categories');
        const description = this.getSetting('section_description', 'We supply a wide range of technology and electronic products tailored for wholesale, retail, and enterprise distribution.');
        const gridColumns = parseInt(this.getSetting('grid_columns', '3'));
        const categories = this.getSetting('categories', []);

        // Generate a unique Class for scoping styles (ID gets overwritten by CMS)
        const uid = 'trending_' + Math.floor(Math.random() * 100000);

        // Debugging: Log gridColumns
        console.log('Grid Columns:', gridColumns);

        const categoriesHtml = categories.map(cat => {
            let imageUrl = '';
            if (cat.image) {
                if (typeof cat.image === 'string') {
                    imageUrl = cat.image;
                } else if (cat.image.url) {
                    imageUrl = cat.image.url;
                }
            }

            return `
                <div class="b2b-card">
                    <div class="b2b-image">
                        <img src="${imageUrl}" alt="${this.escapeHtml(cat.title)}">
                    </div>
                    <div class="b2b-content">
                        <h3>${this.escapeHtml(cat.title)}</h3>
                        <p>${this.escapeHtml(cat.description)}</p>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <style>
            /* =========================
               B2B Product Categories (Scoped: .${uid})
               ========================= */
            .${uid} {
                padding: 90px 20px;
                font-family: "Inter", sans-serif;
            }

            .${uid} .container {
                max-width: 1200px;
                margin: auto;
            }

            .${uid} .section-header {
                text-align: center;
                margin-bottom: 60px;
            }

            .${uid} .section-header span {
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .${uid} .section-header h2 {
                font-size: 38px;
                font-weight: 700;
                margin: 12px 0;
            }

            .${uid} .section-header p {
                max-width: 700px;
                margin: auto;
                font-size: 16px;
            }

            /* New Header Structure Styles */
            .${uid} .ebl-data-blocks .subtitle h4 {
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            
            .${uid} .ebl-data-blocks .title h2 {
                font-size: 38px;
                font-weight: 700;
                margin: 12px 0;
                line-height: 1.2;
            }
            
            .${uid} .ebl-data-blocks .plain_text p {
                font-size: 16px;
                margin-bottom: 25px;
                line-height: 1.6;
            }

            .${uid} .b2b-grid {
                display: grid;
                gap: 28px;
            }

            .${uid} .b2b-card {
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 16px;
                overflow: hidden;
                transition: border 0.3s ease, box-shadow 0.3s ease;
                background-color: #020617;
            }

            .${uid} .b2b-card:hover {
                border-color: rgba(56,189,248,0.6);
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            }

            .${uid} .b2b-image {
                height: 200px;
                overflow: hidden;
                background-color: #020617;
            }

            .${uid} .b2b-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .${uid} .b2b-content {
                padding: 22px;
            }

            .${uid} .b2b-content h3 {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #ffffff;
            }

            .${uid} .b2b-content p {
                font-size: 14px;
                line-height: 1.6;
                color: #cbd5f5;
            }

            /* Responsive */
            @media (max-width: 992px) {
                .${uid} .b2b-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }

            @media (max-width: 600px) {
                .${uid} .b2b-grid {
                    grid-template-columns: 1fr !important;
                }

                .${uid} .section-header h2 {
                    font-size: 30px;
                }
            }
            </style>

            <section class="b2b-categories ${uid}">
                <div class="container">

                    <div class="row align-items-center">

                        <div class="col-lg-12">

                            <div class="ebl-data-blocks mb-4">

                                <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
                                    <div class="subtitle subtitle_1bececf">
                                        <h4>
                                            <span class="subtitle-first-span"></span>
                                            <span class="subtitle-middle-span">${this.escapeHtml(subtitle)}</span>    
                                            <span class="subtitle-last-span"></span>
                                        </h4>
                                    </div>
                                </div>
                                <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
                                    <div class="title title_1bececf">
                                        <h2>
                                            <span></span>
                                            <span>${this.escapeHtml(title)}</span>
                                            <span></span>
                                        </h2>
                                    </div>
                                </div>
                                <div class="comingsoon-body-item block-item text-center aos-init aos-animate" data-aos="aos-blockRubberBand">
                                    <div class="plain_text plain_text_1bececf">
                                        <p>${this.escapeHtml(description)}</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    
                    </div>

                    <div class="b2b-grid" style="display: grid; grid-template-columns: repeat(${gridColumns}, 1fr);">
                        ${categoriesHtml}
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

window.elementorWidgetManager.registerWidget(TrendingCategorySectionWidget);
console.log('TrendingCategorySectionWidget Widget Loaded');
