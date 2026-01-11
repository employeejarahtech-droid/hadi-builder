class LogoWidget extends WidgetBase {
    getName() {
        return 'logo';
    }

    getTitle() {
        return 'Logo';
    }

    getIcon() {
        return 'fa fa-cube';
    }

    getCategories() {
        return ['media'];
    }

    getKeywords() {
        return ['logo', 'brand', 'image', 'header'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Logo Settings',
            tab: 'content'
        });

        this.addControl('image', {
            type: 'media',
            label: 'Logo Image',
            trigger: {
                icon: 'fa fa-image',
                text: 'Select Image'
            },
            default_value: {
                url: 'assets/img/logo.png'
            }
        });

        this.addControl('alt_text', {
            type: 'text',
            label: 'Alt Text',
            placeholder: 'Site name or description',
            default_value: 'Site Logo'
        });

        this.addControl('link', {
            type: 'url',
            label: 'Link URL',
            placeholder: 'https://your-site.com',
            default_value: '/'
        });

        this.addControl('open_new_tab', {
            type: 'switch',
            label: 'Open in New Tab',
            default_value: false
        });

        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Style Settings',
            tab: 'style'
        });

        this.addControl('width', {
            type: 'slider',
            label: 'Width (px)',
            min: 20,
            max: 800,
            default_value: 150,
            responsive: true
        });

        this.addControl('height', {
            type: 'slider',
            label: 'Height (px)',
            min: 20,
            max: 400,
            default_value: null
        });

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
                { value: 'inline', label: 'Inline' }
            ],
            default_value: 'left',
            responsive: true
        });

        this.addControl('spacing', {
            type: 'dimensions',
            label: 'Margin',
            default_value: {
                top: '0px',
                right: '0px',
                bottom: '10px',
                left: '0px',
                unit: 'px'
            }
        });

        this.endControlsSection();

        // Add standard advanced controls
        this.registerAdvancedControls();

        // Add logo-specific advanced controls
        this.startControlsSection('logo_advanced_section', {
            label: 'Logo Advanced',
            tab: 'advanced'
        });

        this.addControl('lazy_load', {
            type: 'switch',
            label: 'Lazy Load',
            default_value: true
        });

        this.endControlsSection();
    }

    /**
     * Sanitize HTML attribute value to prevent XSS
     * @param {string} value
     * @returns {string}
     */
    sanitizeAttribute(value) {
        if (!value) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Get properly formatted image URL
     * @returns {string}
     */
    getImageUrl() {
        let imgSrc = this.getSetting('image');

        if (typeof imgSrc === 'object' && imgSrc !== null) {
            imgSrc = imgSrc.url || '';
        }

        if (!imgSrc) {
            return 'https://via.placeholder.com/150x50?text=Logo';
        }

        // Fix path for subdirectory installations
        if (imgSrc.startsWith('/') && window.CMS_ROOT && window.CMS_ROOT !== '/' && !imgSrc.startsWith(window.CMS_ROOT)) {
            imgSrc = window.CMS_ROOT + imgSrc;
        }

        return imgSrc;
    }

    /**
     * Get dimension with unit
     * @param {string|number} value
     * @param {string} defaultValue
     * @returns {string}
     */
    getDimension(value, defaultValue = '0px') {
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }
        // If it already has a unit (non-digit characters at end), return as is
        if (String(value).match(/[a-z%]+$/i)) {
            return value;
        }
        return value + 'px';
    }

    /**
     * Generate responsive styles
     * @returns {object}
     */
    generateStyles() {
        const align = this.getSetting('align') || 'left';
        const spacing = this.getSetting('spacing') || {};
        const lazyLoad = this.getSetting('lazy_load') !== false;

        const styles = {
            wrapper: {
                textAlign: align === 'inline' ? 'left' : align,
                // Check if values have units, otherwise append px
                margin: `${this.getDimension(spacing.top, '0px')} ${this.getDimension(spacing.right, '0px')} ${this.getDimension(spacing.bottom, '10px')} ${this.getDimension(spacing.left, '0px')}`
            },
            image: {
                maxWidth: '100%',
                height: 'auto',
                display: align === 'inline' ? 'inline-block' : 'block',
                transition: 'opacity 0.3s ease'
            }
        };

        return styles;
    }

    /**
     * Generate CSS string from styles object
     * @param {object} styles
     * @returns {string}
     */
    stylesToString(styles) {
        return Object.entries(styles)
            .map(([prop, value]) => {
                const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${cssProp}: ${value}`;
            })
            .join('; ');
    }

    render() {
        const imgSrc = this.getImageUrl();
        const altText = this.getSetting('alt_text') || 'Site Logo';
        const link = this.getSetting('link');
        const openNewTab = this.getSetting('open_new_tab');
        const lazyLoad = this.getSetting('lazy_load') !== false;

        const styles = this.generateStyles();
        const wrapperStyle = this.stylesToString(styles.wrapper);
        const imageStyle = this.stylesToString(styles.image);

        const sanitizedImgSrc = this.sanitizeAttribute(imgSrc);
        const sanitizedAltText = this.sanitizeAttribute(altText);

        const lazyLoadAttr = lazyLoad ? 'loading="lazy"' : '';
        const targetAttr = link && openNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        const linkAttr = link ? this.sanitizeAttribute(link) : '';

        let contentHtml = `<img src="${sanitizedImgSrc}"
                                 style="${imageStyle}"
                                 alt="${sanitizedAltText}"
                                 ${lazyLoadAttr}
                                 onerror="this.style.opacity='0.5'; this.onerror=null;">`;

        if (link) {
            contentHtml = `<a href="${linkAttr}" ${targetAttr} class="widget-link">${contentHtml}</a>`;
        }

        const content = `
            <div style="${wrapperStyle}">
                ${contentHtml}
            </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'logo-widget');
    }
}

window.elementorWidgetManager.registerWidget(LogoWidget);
