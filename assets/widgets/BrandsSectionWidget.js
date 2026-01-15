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
        const logoOpacity = this.getSetting('logo_opacity', { size: 0.6, unit: '' });
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
                        <img src="${imageUrl}" alt="${this.escapeHtml(name)}" class="brand-logo">
                     </a>
                </div>
            `;

            return `<div class="grid-item">${content}</div>`;
        }).join('');

        // Unique ID for scoped styles
        const uniqueId = 'brands-' + Math.random().toString(36).substr(2, 9);

        const cssVariables = `
            --items-per-row: ${itemsPerRow};
            --logo-max-width: ${logoMaxWidth.size}${logoMaxWidth.unit};
            --logo-height: ${logoHeight.size}${logoHeight.unit};
            --logo-opacity: ${logoOpacity.size !== undefined ? logoOpacity.size : logoOpacity};
            --logo-opacity-hover: ${logoOpacityHover.size !== undefined ? logoOpacityHover.size : logoOpacityHover};
        `;

        // Scoped class name instead of ID
        const uniqueClass = 'brands-' + Math.random().toString(36).substr(2, 9);

        return `
            <style>
                .${uniqueClass} {
                    ${paddingStyle}
                    ${cssVariables}
                    background-color: #fff;
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                }
                .${uniqueClass} .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 15px;
                }
                .${uniqueClass} .section-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .${uniqueClass} .section-title {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #1a1a1a;
                }
                .${uniqueClass} .section-description {
                    font-size: 16px;
                    color: #666;
                    max-width: 700px;
                    margin: 0 auto;
                }
                
                .${uniqueClass} .brand-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    filter: grayscale(100%);
                    opacity: var(--logo-opacity, 0.6);
                    height: 100%;
                }
                .${uniqueClass} .brand-item:hover {
                    filter: grayscale(0%);
                    opacity: var(--logo-opacity-hover, 1);
                    transform: translateY(-5px);
                }
                .${uniqueClass} .brand-logo {
                    max-width: var(--logo-max-width, 100%);
                    max-height: var(--logo-height, 80px);
                    object-fit: contain;
                }

                /* Responsive Layout Overrides */
                @media (max-width: 768px) {
                    .${uniqueClass} .brands-grid .grid-wrapper {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 15px !important;
                    }
                }
                @media (max-width: 480px) {
                    .${uniqueClass} .brands-grid .grid-wrapper {
                        grid-template-columns: repeat(1, 1fr) !important;
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

                    <div class="brands-grid" style="width: 100%;">
                        <div class="grid-wrapper" style="display: grid; grid-template-columns: repeat(${itemsPerRow}, 1fr); gap: 30px; width: 100%; box-sizing: border-box;">
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
