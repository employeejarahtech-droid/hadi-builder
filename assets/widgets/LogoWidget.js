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
        return ['basic'];
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

        this.startControlsSection('advanced_section', {
            label: 'Advanced',
            tab: 'advanced'
        });

        this.addControl('lazy_load', {
            type: 'switch',
            label: 'Lazy Load',
            default_value: true
        });

        this.addControl('css_classes', {
            type: 'text',
            label: 'Custom CSS Classes',
            placeholder: 'my-custom-class another-class'
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
     * Generate responsive styles
     * @returns {object}
     */
    generateStyles() {
        const width = parseInt(this.getSetting('width')) || 150;
        const height = this.getSetting('height');
        const align = this.getSetting('align') || 'left';
        const spacing = this.getSetting('spacing') || {};
        const lazyLoad = this.getSetting('lazy_load') !== false;

        const styles = {
            wrapper: {
                textAlign: align === 'inline' ? 'left' : align,
                margin: `${spacing.top || 0}px ${spacing.right || 0}px ${spacing.bottom || 10}px ${spacing.left || 0}px`
            },
            image: {
                maxWidth: '100%',
                height: height ? `${height}px` : 'auto',
                display: align === 'inline' ? 'inline-block' : 'block',
                transition: 'opacity 0.3s ease'
            }
        };

        // Set width only if specified, otherwise use responsive sizing
        if (width > 0) {
            if (align === 'inline') {
                styles.image.width = `${width}px`;
            } else {
                styles.image.maxWidth = `${width}px`;
                styles.image.width = 'auto';
            }
        }

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
        const cssClasses = this.getSetting('css_classes');

        const styles = this.generateStyles();
        const wrapperStyle = this.stylesToString(styles.wrapper);
        const imageStyle = this.stylesToString(styles.image);

        const sanitizedImgSrc = this.sanitizeAttribute(imgSrc);
        const sanitizedAltText = this.sanitizeAttribute(altText);
        const sanitizedCssClasses = this.sanitizeAttribute(cssClasses);

        const lazyLoadAttr = lazyLoad ? 'loading="lazy"' : '';
        const targetAttr = link && openNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        const linkAttr = link ? this.sanitizeAttribute(link) : '';

        let contentHtml = `<img src="${sanitizedImgSrc}"
                                 style="${imageStyle}"
                                 alt="${sanitizedAltText}"
                                 ${lazyLoadAttr}
                                 onerror="this.style.opacity='0.5'; this.onerror=null;">`;

        if (link) {
            contentHtml = `<a href="${linkAttr}" ${targetAttr}>${contentHtml}</a>`;
        }

        const wrapperClasses = ['logo-widget'];
        if (sanitizedCssClasses) {
            wrapperClasses.push(sanitizedCssClasses);
        }

        return `
            <div class="${wrapperClasses.join(' ')}" style="${wrapperStyle}">
                ${contentHtml}
            </div>
        `;
    }
}

window.elementorWidgetManager.registerWidget(LogoWidget);
