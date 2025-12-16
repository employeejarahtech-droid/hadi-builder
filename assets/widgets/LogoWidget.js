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

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Logo Settings',
            tab: 'content'
        });

        this.addControl('image', {
            type: 'media',
            label: 'Logo Widget Image Box',
            trigger: {
                icon: 'fa fa-image',
                text: 'Select Image'
            },
            default_value: {
                url: 'assets/img/logo.png' // Default placeholder, user should change this
            }
        });

        this.addControl('link', {
            type: 'url',
            label: 'Link',
            placeholder: 'https://your-site.com',
            default_value: '/'
        });

        this.addControl('width', {
            type: 'slider',
            label: 'Width (px)',
            min: 50,
            max: 500,
            default_value: 150
        });

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'left'
        });

        this.endControlsSection();
    }

    render() {
        console.log('LogoWidget.render called', this.settings);
        let imgSrc = this.getSetting('image');

        if (typeof imgSrc === 'object' && imgSrc !== null) {
            imgSrc = imgSrc.url || '';
        }

        // Fix path if it is absolute but we are in a subdirectory
        if (imgSrc && imgSrc.startsWith('/') && window.CMS_ROOT && window.CMS_ROOT !== '/' && !imgSrc.startsWith(window.CMS_ROOT)) {
            imgSrc = window.CMS_ROOT + imgSrc;
        }

        // If no image is selected, show a placeholder
        if (!imgSrc) {
            imgSrc = 'https://via.placeholder.com/150x50?text=Logo';
        }

        const width = this.getSetting('width');
        const link = this.getSetting('link');
        const align = this.getSetting('align');

        const style = `width: ${width}px; height: auto; display: block;`;
        const wrapperStyle = `text-align: ${align};`;

        let contentHtml = `<img src="${imgSrc}" style="${style}" alt="Site Logo" onerror="console.error('Logo image failed to load:', this.src);">`;

        if (link) {
            contentHtml = `<a href="${link}">${contentHtml}</a>`;
        }

        return `
            <div class="logo-widget" style="${wrapperStyle}">
                ${contentHtml}
            </div>
        `;
    }
}

window.elementorWidgetManager.registerWidget(LogoWidget);
