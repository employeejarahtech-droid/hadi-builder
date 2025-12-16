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
        return ['basic'];
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

        this.addControl('width', {
            type: 'slider',
            label: 'Width (%)',
            min: 1,
            max: 100,
            default_value: 100
        });

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
        const width = this.getSetting('width');
        const opacity = this.getSetting('opacity');
        const radius = this.getSetting('border_radius');
        const caption = this.getSetting('caption');
        const link = this.getSetting('link');

        const style = `
             max-width: ${width}%;
             opacity: ${opacity};
             border-radius: ${radius}px;
             height: auto;
             display: block;
        `;

        const wrapperStyle = `text-align: ${align};`;

        let imageHtml = `<img src="${imgSrc}" style="${style}" alt="${caption}">`;

        if (link) {
            imageHtml = `<a href="${link}" target="_blank">${imageHtml}</a>`;
        }

        return `
            <div class="elementor-image-widget" style="${wrapperStyle}">
                ${imageHtml}
                ${caption ? `<figcaption style="text-align: center; margin-top: 5px; color: #666; font-size: 13px;">${caption}</figcaption>` : ''}
            </div>
        `;
    }
}

window.elementorWidgetManager.registerWidget(ImageWidget);
