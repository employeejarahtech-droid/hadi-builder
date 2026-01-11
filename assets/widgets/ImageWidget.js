class ImageWidget extends WidgetBase {
    getName() {
        return 'image';
    }

    getTitle() {
        return 'Image';
    }

    getIcon() {
        return 'fa fa-image';
    }

    getCategories() {
        return ['content'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Image',
            tab: 'content'
        });

        this.addControl('image', {
            type: 'media',
            label: 'Choose Image',
            default_value: {
                url: 'https://via.placeholder.com/800x600?text=Placeholder+Image'
            }
        });

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'center'
        });

        this.addControl('caption', {
            type: 'text',
            label: 'Caption',
            placeholder: 'Enter caption',
            default_value: ''
        });

        this.addControl('link', {
            type: 'url',
            label: 'Link',
            placeholder: 'https://your-link.com',
            default_value: ''
        });

        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Image Style',
            tab: 'style'
        });

        // Width handled globally
        this.addControl('opacity', {
            type: 'slider',
            label: 'Opacity',
            min: 0,
            max: 1,
            step: 0.1,
            default_value: 1
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            min: 0,
            max: 100,
            default_value: 0
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        // Handle image object or string fallback
        let imgSrc = this.getSetting('image');
        if (typeof imgSrc === 'object' && imgSrc !== null) {
            imgSrc = imgSrc.url || '';
        }

        // Fix path if it is absolute but we are in a subdirectory
        if (imgSrc && imgSrc.startsWith('/') && window.CMS_ROOT && window.CMS_ROOT !== '/' && !imgSrc.startsWith(window.CMS_ROOT)) {
            imgSrc = window.CMS_ROOT + imgSrc;
        }

        const align = this.getSetting('align');
        const opacity = this.getSetting('opacity');
        const radius = this.getSetting('border_radius');
        const caption = this.getSetting('caption');
        const link = this.getSetting('link');

        const wrapperStyle = `text-align: ${align};`;

        const imageStyle = `
            width: 100%;
            border-radius: ${radius}px;
            opacity: ${opacity};
            max-width: 100%;
            height: auto;
            box-shadow: none;
        `;

        let imageHtml = `<img src="${imgSrc}" style="${imageStyle}" alt="${caption || 'Image'}">`;

        // Handle link
        if (link) {
            let linkUrl = '';
            let target = '';
            let rel = '';

            if (typeof link === 'object' && link.url) {
                linkUrl = link.url;
                if (link.is_external) target = 'target="_blank"';
                if (link.nofollow) rel = 'rel="nofollow"';
            } else if (typeof link === 'string' && link !== '') {
                linkUrl = link;
            }

            if (linkUrl) {
                imageHtml = `<a href="${linkUrl}" ${target} ${rel} style="display: inline-block; width: 100%;">${imageHtml}</a>`;
            }
        }

        const content = `
            <div style="${wrapperStyle}">
                ${imageHtml}
                ${caption ? `<figcaption style="text-align: center; margin-top: 5px; color: #666; font-size: 13px;">${caption}</figcaption>` : ''}
            </div>
        `;

        return this.wrapWithAdvancedSettings(content, 'elementor-image-widget');
    }
}

window.elementorWidgetManager.registerWidget(ImageWidget);
