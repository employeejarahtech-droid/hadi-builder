/**
 * BrandsSectionWidget - A specialized widget for displaying brand logos
 * Provides a repeater control for brand items with images and links
 */
class BrandsSectionWidget extends WidgetBase {
    getName() {
        return 'brands-section';
    }

    getTitle() {
        return 'Brands Section';
    }

    getIcon() {
        return 'fa fa-copyright';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['brands', 'partners', 'logos', 'clients', 'carousel', 'grid'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Trusted by Top Companies',
            section_description: 'We work with the best in the industry to deliver exceptional results.',
            brands: [
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 1',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 2',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 3',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 4',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 5',
                    link: '#'
                }
            ],
            layout_type: 'carousel', // carousel or grid
            items_per_row: 5,
            padding: { top: 60, right: 0, bottom: 60, left: 0, unit: 'px', isLinked: false }
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Brands Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Trusted by Top Companies',
            placeholder: 'Enter section title'
        });

        this.addControl('section_description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'We work with the best in the industry to deliver exceptional results.',
            placeholder: 'Enter description',
            condition: {
                section_title: '!empty'
            }
        });

        this.addControl('brands', {
            type: 'repeater',
            label: 'Brands',
            default_value: [
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 1',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 2',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 3',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 4',
                    link: '#'
                },
                {
                    image: { url: 'https://placehold.co/150x80' },
                    name: 'Brand 5',
                    link: '#'
                }
            ],
            fields: [
                {
                    name: 'image',
                    type: 'media',
                    label: 'Logo',
                    default_value: { url: 'https://placehold.co/150x80' }
                },
                {
                    name: 'name',
                    type: 'text',
                    label: 'Brand Name',
                    default_value: 'Brand Name',
                    placeholder: 'Enter brand name'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: '#',
                    placeholder: 'https://brand-site.com'
                }
            ],
            title_field: 'name'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Layout & Style',
            tab: 'style'
        });

        this.addControl('items_per_row', {
            type: 'slider',
            label: 'Items Per Row',
            default_value: { size: 5, unit: '' },
            range: {
                min: 2,
                max: 6,
                step: 1
            }
        });

        this.addControl('logo_max_width', {
            type: 'slider',
            label: 'Logo Max Width',
            default_value: { size: 100, unit: '%' },
            range: {
                min: 10,
                max: 100,
                step: 1
            },
            selectors: {
                '{{WRAPPER}} .brand-logo': 'max-width: {{SIZE}}{{UNIT}};'
            }
        });

        this.addControl('logo_height', {
            type: 'slider',
            label: 'Logo Height',
            default_value: { size: 80, unit: 'px' },
            range: {
                min: 20,
                max: 200,
                step: 1
            },
            selectors: {
                '{{WRAPPER}} .brand-logo': 'max-height: {{SIZE}}{{UNIT}};'
            }
        });

        this.addControl('logo_opacity', {
            type: 'slider',
            label: 'Opacity',
            default_value: { size: 0.6, unit: '' },
            range: {
                min: 0,
                max: 1,
                step: 0.1
            },
            selectors: {
                '{{WRAPPER}} .brand-item': 'opacity: {{SIZE}};'
            }
        });

        this.addControl('logo_opacity_hover', {
            type: 'slider',
            label: 'Hover Opacity',
            default_value: { size: 1, unit: '' },
            range: {
                min: 0,
                max: 1,
                step: 0.1
            },
            selectors: {
                '{{WRAPPER}} .brand-item:hover': 'opacity: {{SIZE}};'
            }
        });

        this.addControl('padding', {
            type: 'dimensions',
            label: 'Section Padding',
            units: ['px', 'em', '%'],
            default_value: { top: 60, right: 0, bottom: 60, left: 0, unit: 'px', isLinked: false }
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const title = this.getSetting('section_title', '');
        const description = this.getSetting('section_description', '');

        const defaultBrands = [
            { image: { url: 'https://placehold.co/150x80' }, name: 'Brand 1', link: '#' },
            { image: { url: 'https://placehold.co/150x80' }, name: 'Brand 2', link: '#' },
            { image: { url: 'https://placehold.co/150x80' }, name: 'Brand 3', link: '#' },
            { image: { url: 'https://placehold.co/150x80' }, name: 'Brand 4', link: '#' },
            { image: { url: 'https://placehold.co/150x80' }, name: 'Brand 5', link: '#' }
        ];

        let brands = this.getSetting('brands', []);

        // Handle case where repeater data comes as an object
        if (brands && typeof brands === 'object' && !Array.isArray(brands)) {
            try {
                brands = Object.values(brands);
            } catch (e) {
                brands = [];
            }
        }

        // Ensure brands is an array
        if (!Array.isArray(brands)) {
            brands = [];
        }

        // Filter out null/undefined items
        brands = brands.filter(item => item);

        // If no brands are set or empty after filtering, use defaults
        if (brands.length === 0) {
            brands = defaultBrands;
        }

        const itemsPerRowSetting = this.getSetting('items_per_row', 5);
        let itemsPerRow = (typeof itemsPerRowSetting === 'object' && itemsPerRowSetting !== null && itemsPerRowSetting.size)
            ? parseInt(itemsPerRowSetting.size)
            : parseInt(itemsPerRowSetting);

        if (isNaN(itemsPerRow) || itemsPerRow < 1) {
            itemsPerRow = 5;
        }

        const logoMaxWidth = this.getSetting('logo_max_width', { size: 100, unit: '%' });
        const logoHeight = this.getSetting('logo_height', { size: 80, unit: 'px' });
        const logoOpacity = this.getSetting('logo_opacity', { size: 1, unit: '' });
        const logoOpacityHover = this.getSetting('logo_opacity_hover', { size: 1, unit: '' });

        const padding = this.getSetting('padding', { top: 60, right: 0, bottom: 60, left: 0, unit: 'px' });

        const paddingStyle = `padding: ${padding.top}${padding.unit} ${padding.right}${padding.unit} ${padding.bottom}${padding.unit} ${padding.left}${padding.unit};`;

        if (!brands || !brands.length) {
            return '';
        }

        const brandsHtml = brands.map(brand => {
            if (!brand) return '';
            const imageUrl = brand.image?.url || 'https://placehold.co/150x80';
            const name = brand.name || '';
            let link = brand.link || '#';

            // Fix handle link object
            if (typeof link === 'object' && link.url) {
                link = link.url;
            }

            const content = `
                <div class="brand-item">
                     <a href="${link}" class="brand-link" title="${this.escapeHtml(name)}">
                        <div class="brand-logo-wrapper">
                            <img src="${imageUrl}" alt="${this.escapeHtml(name)}" class="brand-logo">
                        </div>
                     </a>
                </div>
            `;

            return `<div class="grid-item">${content}</div>`;
        }).join('');

        // Unique class name
        const uniqueClass = 'brands-' + Math.random().toString(36).substr(2, 9);

        const cssVariables = `
            --items-per-row: ${itemsPerRow};
            --logo-max-width: ${logoMaxWidth.size}${logoMaxWidth.unit};
            --logo-height: ${logoHeight.size}${logoHeight.unit};
            --logo-opacity: ${logoOpacity.size !== undefined ? logoOpacity.size : logoOpacity};
            --logo-opacity-hover: ${logoOpacityHover.size !== undefined ? logoOpacityHover.size : logoOpacityHover};
        `;

        return `
            <style>
                .${uniqueClass} {
                    ${paddingStyle}
                    ${cssVariables}
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                }
                
                /* Decorative background elements */
                .${uniqueClass}::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -10%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                
                .${uniqueClass}::after {
                    content: '';
                    position: absolute;
                    bottom: -30%;
                    left: -5%;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(236, 72, 153, 0.04) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                
                .${uniqueClass} .container {
                    margin: 0 auto;
                    padding: 0 15px;
                    position: relative;
                    z-index: 2;
                }
                
                .${uniqueClass} .section-header {
                    text-align: center;
                    margin-bottom: 50px;
                    animation: fadeInUp 0.6s ease-out;
                }
                
                .${uniqueClass} .section-title {
                    font-size: 36px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    color: #1a1a1a;
                    background: linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.5px;
                }
                
                .${uniqueClass} .section-description {
                    font-size: 17px;
                    color: #64748b;
                    max-width: 650px;
                    margin: 0 auto;
                    line-height: 1.7;
                }
                
                .${uniqueClass} .brands-grid {
                    width: 100%;
                }
                
                .${uniqueClass} .grid-wrapper {
                    display: grid;
                    grid-template-columns: repeat(${itemsPerRow}, 1fr);
                    gap: 25px;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                .${uniqueClass} .grid-item {
                    animation: fadeInScale 0.5s ease-out backwards;
                }
                
                /* Stagger animation for grid items */
                .${uniqueClass} .grid-item:nth-child(1) { animation-delay: 0.1s; }
                .${uniqueClass} .grid-item:nth-child(2) { animation-delay: 0.15s; }
                .${uniqueClass} .grid-item:nth-child(3) { animation-delay: 0.2s; }
                .${uniqueClass} .grid-item:nth-child(4) { animation-delay: 0.25s; }
                .${uniqueClass} .grid-item:nth-child(5) { animation-delay: 0.3s; }
                .${uniqueClass} .grid-item:nth-child(6) { animation-delay: 0.35s; }
                
                .${uniqueClass} .brand-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 25px;
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                
                /* Shine effect on hover */
                .${uniqueClass} .brand-item::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
                    transform: translateX(-100%) translateY(-100%) rotate(45deg);
                    transition: transform 0.6s;
                }
                
                .${uniqueClass} .brand-link {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                
                .${uniqueClass} .brand-logo-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    transition: all 0.4s ease;
                }
                
                .${uniqueClass} .brand-item:hover .brand-logo-wrapper {
                    filter: grayscale(0%) brightness(1);
                    opacity: var(--logo-opacity-hover, 1);
                }
                
                .${uniqueClass} .brand-logo {
                    max-width: var(--logo-max-width, 100%);
                    max-height: var(--logo-height, 80px);
                    object-fit: contain;
                    transition: transform 0.4s ease;
                }
                
                .${uniqueClass} .brand-item:hover .brand-logo {
                    transform: scale(1.05);
                }
                
                /* Animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* Responsive Layout */
                @media (max-width: 1024px) {
                    .${uniqueClass} .grid-wrapper {
                        grid-template-columns: repeat(${Math.min(itemsPerRow, 4)}, 1fr) !important;
                        gap: 20px !important;
                    }
                    .${uniqueClass} .section-title {
                        font-size: 32px;
                    }
                }
                
                @media (max-width: 768px) {
                    .${uniqueClass} .grid-wrapper {
                        grid-template-columns: repeat(3, 1fr) !important;
                        gap: 15px !important;
                    }
                    .${uniqueClass} .brand-item {
                        padding: 20px;
                    }
                    .${uniqueClass} .section-title {
                        font-size: 28px;
                    }
                    .${uniqueClass} .section-description {
                        font-size: 16px;
                    }
                }
                
                @media (max-width: 480px) {
                    .${uniqueClass} .grid-wrapper {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                    }
                    .${uniqueClass} .brand-item {
                        padding: 15px;
                    }
                    .${uniqueClass} .section-title {
                        font-size: 24px;
                    }
                }
            </style>

            <div class="${uniqueClass} brands-section-widget">
                <div class="container">
                    ${title || description ? `
                    <div class="section-header">
                        ${title ? `<h2 class="section-title">${this.escapeHtml(title)}</h2>` : ''}
                        ${description ? `<p class="section-description">${this.escapeHtml(description)}</p>` : ''}
                    </div>
                    ` : ''}

                    <div class="brands-grid">
                        <div class="grid-wrapper">
                            ${brandsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

window.elementorWidgetManager.registerWidget(BrandsSectionWidget);
