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
            type: 'textarea',
            label: 'Paragraph 1',
            default_value: '<strong>Tech Zone – F.Z.C</strong> is a global trading and distribution company specializing in high-quality technology and electronic products. We serve retailers, wholesalers, and business partners across multiple regions with consistent supply and competitive pricing.'
        });

        this.addControl('content_paragraph_2', {
            type: 'textarea',
            label: 'Paragraph 2',
            default_value: 'Our product portfolio includes IT equipment, mobile devices, consumer electronics, gaming solutions, office equipment, and home appliances—making us a one-stop destination for modern technology needs.'
        });

        this.addControl('content_paragraph_3', {
            type: 'textarea',
            label: 'Paragraph 3',
            default_value: 'Built on transparency, efficiency, and long-term partnerships, we bridge the gap between manufacturers and markets through reliable sourcing, efficient logistics, and strong after-sales support.'
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
    }

    render() {
        const subtitle = this.getSetting('section_subtitle', 'Who We Are');
        const title = this.getSetting('section_title', 'Tech Zone – F.Z.C');
        const headerDesc = this.getSetting('section_description', 'A dynamic and fast-growing international trading company delivering premium technology, electronics, and mobility solutions worldwide.');

        const p1 = this.getSetting('content_paragraph_1', '<strong>Tech Zone – F.Z.C</strong> is a global trading and distribution company specializing in high-quality technology and electronic products. We serve retailers, wholesalers, and business partners across multiple regions with consistent supply and competitive pricing.');
        const p2 = this.getSetting('content_paragraph_2', 'Our product portfolio includes IT equipment, mobile devices, consumer electronics, gaming solutions, office equipment, and home appliances—making us a one-stop destination for modern technology needs.');
        const p3 = this.getSetting('content_paragraph_3', 'Built on transparency, efficiency, and long-term partnerships, we bridge the gap between manufacturers and markets through reliable sourcing, efficient logistics, and strong after-sales support.');

        const stats = this.getSetting('stats', []);
        const profileImage = this.getSetting('profile_image', { url: '' });

        const statsHtml = stats.map(stat => `
            <div class="stat">
                <h3>${this.escapeHtml(stat.title)}</h3>
                <p>${this.escapeHtml(stat.description)}</p>
            </div>
        `).join('');

        const imageHtml = profileImage.url ? `
            <div class="profile-image-container" style="margin-bottom: 30px;">
                <img src="${profileImage.url}" alt="${this.escapeHtml(title)}" style="width: 100%; border-radius: 16px; object-fit: cover;">
            </div>
        ` : '';

        return `
            <style>
                /* Scoped Styles for Company Profile Section */
                .company-profile * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .company-profile {
                    font-family: "Inter", sans-serif;
                    line-height: 1.6;
                    padding: 80px 20px;
                }

                .company-profile .container {
                    max-width: 1200px;
                    margin: auto;
                }

                .company-profile .profile-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .company-profile .profile-header .subtitle {
                    display: inline-block;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }

                .company-profile .profile-header h2 {
                    font-size: 42px;
                    font-weight: 700;
                    margin-bottom: 15px;
                }

                .company-profile .profile-header p {
                    max-width: 750px;
                    margin: auto;
                    font-size: 16px;
                }

                /* New Header Styles */
   
              
                .company-profile .profile-content {
                    display: grid;
                    grid-template-columns: 1.3fr 1fr;
                    gap: 50px;
                    align-items: start;
                }

                .company-profile .profile-text p {
                    font-size: 16px;
                    margin-bottom: 18px;
                }

                .company-profile .profile-text strong {
                }

                .company-profile .profile-stats {
                    display: grid;
                    gap: 22px;
                }

                .company-profile .stat {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 28px;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    background-color: #020617;
                }

                .company-profile .stat:hover {
                    transform: translateY(-6px);
                    background: rgba(56, 189, 248, 0.1);
                }

                .company-profile .stat h3 {
                    font-size: 20px;
                    margin-bottom: 10px;
                    color: #fff;
                }

                .company-profile .stat p {
                    font-size: 14px;
                    color: #fff;
                }

                /* Responsive Design */
                @media (max-width: 900px) {
                    .company-profile .profile-content {
                        grid-template-columns: 1fr;
                    }

                    .company-profile .profile-header h2 {
                        font-size: 32px;
                    }
                }
            </style>

            <section class="company-profile">
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
                    <p>${this.escapeHtml(headerDesc)}</p>
                </div>
            </div>
        </div>
    </div>
</div>

                  <div class="profile-content">
                    <div class="profile-text">
                      <p>${p1}</p>
                      <p>${p2}</p>
                      <p>${p3}</p>
                    </div>

                    <div class="profile-right-column">
                        ${imageHtml}
                        <div class="profile-stats">
                            ${statsHtml}
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

window.elementorWidgetManager.registerWidget(CompanyProfileSection);
console.log('CompanyProfileSection Widget Loaded');
