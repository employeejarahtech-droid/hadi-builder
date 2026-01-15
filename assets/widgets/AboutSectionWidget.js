/**
 * AboutSectionWidget - A specialized widget for about/introduction sections
 * Provides controls for title, description, image, and CTA button
 */
class AboutSectionWidget extends WidgetBase {
    getName() {
        return 'about-section';
    }

    getTitle() {
        return 'About Section';
    }

    getIcon() {
        return 'fa fa-info-circle';
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

    getDefaultSettings() {
        return {
            subtitle_text: 'WHAT WE DO',
            title: 'What Services we Provide for Our Customers Business',
            description: 'Our agency can only be as strong as our people our team follwing agenhave run their businesses designed.',
            image: { url: 'assets/img/team/1.jpg' },
            image_position: 'right',
            show_primary_btn: 'yes',
            primary_btn_text: 'Add to Cart',
            primary_btn_link: '#',
            show_primary_outline_btn: 'no',
            primary_outline_btn_text: 'Buy Now',
            primary_outline_btn_link: '#',
            show_secondary_btn: 'no',
            secondary_btn_text: 'Buy Now',
            secondary_btn_link: '#',
            show_secondary_outline_btn: 'no',
            secondary_outline_btn_text: 'Buy Now',
            secondary_outline_btn_link: '#',
            show_white_btn: 'no',
            white_btn_text: 'Buy Now',
            white_btn_link: '#',
            show_plain_btn: 'no',
            plain_btn_text: 'Buy Now',
            plain_btn_link: '#',
            show_play_btn: 'no'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'About Content',
            tab: 'content'
        });

        this.addControl('subtitle_text', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'WHAT WE DO',
            placeholder: 'Enter subtitle'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'What Services we Provide for Our Customers Business',
            placeholder: 'Enter title'
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Our agency can only be as strong as our people...',
            placeholder: 'Enter description'
        });

        this.addControl('image', {
            type: 'media',
            label: 'Image',
            default_value: { url: 'assets/img/team/1.jpg' }
        });

        this.endControlsSection();

        // Buttons Section
        this.startControlsSection('buttons_section', {
            label: 'Buttons',
            tab: 'content'
        });

        // Primary Button
        this.addControl('show_primary_btn', {
            type: 'select',
            label: 'Show Primary Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'yes'
        });

        this.addControl('primary_btn_text', {
            type: 'text',
            label: 'Primary Button Text',
            default_value: 'Add to Cart',
            placeholder: 'Button text'
        });

        this.addControl('primary_btn_link', {
            type: 'url',
            label: 'Primary Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        // Primary Outline Button
        this.addControl('show_primary_outline_btn', {
            type: 'select',
            label: 'Show Primary Outline Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'no'
        });

        this.addControl('primary_outline_btn_text', {
            type: 'text',
            label: 'Primary Outline Button Text',
            default_value: 'Buy Now',
            placeholder: 'Button text'
        });

        this.addControl('primary_outline_btn_link', {
            type: 'url',
            label: 'Primary Outline Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        // Secondary Button
        this.addControl('show_secondary_btn', {
            type: 'select',
            label: 'Show Secondary Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'no'
        });

        this.addControl('secondary_btn_text', {
            type: 'text',
            label: 'Secondary Button Text',
            default_value: 'Buy Now',
            placeholder: 'Button text'
        });

        this.addControl('secondary_btn_link', {
            type: 'url',
            label: 'Secondary Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        // Secondary Outline Button
        this.addControl('show_secondary_outline_btn', {
            type: 'select',
            label: 'Show Secondary Outline Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'no'
        });

        this.addControl('secondary_outline_btn_text', {
            type: 'text',
            label: 'Secondary Outline Button Text',
            default_value: 'Buy Now',
            placeholder: 'Button text'
        });

        this.addControl('secondary_outline_btn_link', {
            type: 'url',
            label: 'Secondary Outline Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        // White Button
        this.addControl('show_white_btn', {
            type: 'select',
            label: 'Show White Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'no'
        });

        this.addControl('white_btn_text', {
            type: 'text',
            label: 'White Button Text',
            default_value: 'Buy Now',
            placeholder: 'Button text'
        });

        this.addControl('white_btn_link', {
            type: 'url',
            label: 'White Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        // Plain Button
        this.addControl('show_plain_btn', {
            type: 'select',
            label: 'Show Plain Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'no'
        });

        this.addControl('plain_btn_text', {
            type: 'text',
            label: 'Plain Button Text',
            default_value: 'Buy Now',
            placeholder: 'Button text'
        });

        this.addControl('plain_btn_link', {
            type: 'url',
            label: 'Plain Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        // Play Button
        this.addControl('show_play_btn', {
            type: 'select',
            label: 'Show Play Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'no'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Layout',
            tab: 'style'
        });

        this.addControl('image_position', {
            type: 'select',
            label: 'Image Position',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'right'
        });

        this.addControl('flex_direction', {
            type: 'select',
            label: 'Flex Direction',
            options: [
                { value: 'row', label: 'Left to Right' },
                { value: 'row-reverse', label: 'Right to Left' }
            ],
            default_value: 'row'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const subtitleText = this.getSetting('subtitle_text', 'WHAT WE DO');
        const title = this.getSetting('title', 'What Services we Provide for Our Customers Business');
        const description = this.getSetting('description', '');
        const image = this.getSetting('image', { url: 'assets/img/team/1.jpg' });
        const imagePosition = this.getSetting('image_position', 'right');
        const flexDirection = this.getSetting('flex_direction', 'row');

        // Get button settings
        const showPrimaryBtn = this.getSetting('show_primary_btn', 'yes');
        const primaryBtnText = this.getSetting('primary_btn_text', 'Add to Cart');
        const primaryBtnLink = this.getSetting('primary_btn_link', '#');

        const showPrimaryOutlineBtn = this.getSetting('show_primary_outline_btn', 'no');
        const primaryOutlineBtnText = this.getSetting('primary_outline_btn_text', 'Buy Now');
        const primaryOutlineBtnLink = this.getSetting('primary_outline_btn_link', '#');

        const showSecondaryBtn = this.getSetting('show_secondary_btn', 'no');
        const secondaryBtnText = this.getSetting('secondary_btn_text', 'Buy Now');
        const secondaryBtnLink = this.getSetting('secondary_btn_link', '#');

        const showSecondaryOutlineBtn = this.getSetting('show_secondary_outline_btn', 'no');
        const secondaryOutlineBtnText = this.getSetting('secondary_outline_btn_text', 'Buy Now');
        const secondaryOutlineBtnLink = this.getSetting('secondary_outline_btn_link', '#');

        const showWhiteBtn = this.getSetting('show_white_btn', 'no');
        const whiteBtnText = this.getSetting('white_btn_text', 'Buy Now');
        const whiteBtnLink = this.getSetting('white_btn_link', '#');

        const showPlainBtn = this.getSetting('show_plain_btn', 'no');
        const plainBtnText = this.getSetting('plain_btn_text', 'Buy Now');
        const plainBtnLink = this.getSetting('plain_btn_link', '#');

        const showPlayBtn = this.getSetting('show_play_btn', 'no');

        // Build buttons HTML
        let buttonsHTML = '';

        if (showPrimaryBtn === 'yes') {
            buttonsHTML += `
                <a href="${primaryBtnLink}" class="btn-common primary-btn">
                    <span>${this.escapeHtml(primaryBtnText)}</span>
                </a>
            `;
        }

        if (showPrimaryOutlineBtn === 'yes') {
            buttonsHTML += `
                <a href="${primaryOutlineBtnLink}" class="btn-common primary-btn-outline">
                    <span>${this.escapeHtml(primaryOutlineBtnText)}</span>
                </a>
            `;
        }

        if (showSecondaryBtn === 'yes') {
            buttonsHTML += `
                <a href="${secondaryBtnLink}" class="btn-common secondary-btn">
                    <span>${this.escapeHtml(secondaryBtnText)}</span>
                </a>
            `;
        }

        if (showSecondaryOutlineBtn === 'yes') {
            buttonsHTML += `
                <a href="${secondaryOutlineBtnLink}" class="btn-common secondary-btn-outline">
                    <span>${this.escapeHtml(secondaryOutlineBtnText)}</span>
                </a>
            `;
        }

        if (showWhiteBtn === 'yes') {
            buttonsHTML += `
                <a href="${whiteBtnLink}" class="btn-common btn-bg-white">
                    <span>${this.escapeHtml(whiteBtnText)}</span>
                </a>
            `;
        }

        if (showPlainBtn === 'yes') {
            buttonsHTML += `
                <a href="${plainBtnLink}" class="btn-common btn-plain">
                    <span>${this.escapeHtml(plainBtnText)}</span>
                </a>
            `;
        }

        if (showPlayBtn === 'yes') {
            buttonsHTML += `
                <a href="#" class="btn-common btn-play">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
                            <path fill="var(--color-primary)" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128"></path>
                        </svg>
                    </span>
                </a>
            `;
        }

        // Content column
        const contentColumn = `
            <div class="col-lg-6">
                <div class="ebl-data-blocks">
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="subtitle subtitle_1bececf">
                            <h4>
                                <span class="subtitle-first-span"></span>
                                <span class="subtitle-middle-span">${this.escapeHtml(subtitleText)}</span>
                                <span class="subtitle-last-span"></span>
                            </h4>
                        </div>
                    </div>
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="title title_1bececf">
                            <h2>
                                <span></span>
                                <span>${this.escapeHtml(title)}</span>
                                <span></span>
                            </h2>
                        </div>
                    </div>
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="plain_text plain_text_1bececf">
                            <p>${this.escapeHtml(description)}</p>
                        </div>
                    </div>
                    ${buttonsHTML ? `
                    <div class="comingsoon-body-item block-item aos-init aos-animate" data-aos="aos-blockRubberBand">
                        <div class="button_list button_list_1bececf">
                            ${buttonsHTML}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Image column
        const imageColumn = `
            <div class="col-lg-6">
                <div class="img-relative text-end single-img-wrapper aos-init aos-animate" data-aos="aos-blockRubberBand">
                    <div class="img-anim-one bg-img-effect">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <a href="#"><img src="${image.url}" alt="${this.escapeHtml(title)}"></a>
                </div>
            </div>
        `;

        return `
<div class="demo-block pt-60 pb-60">
    <div class="container">
        <div class="row align-items-center" style="flex-direction: ${flexDirection};">
            ${imagePosition === 'left' ? imageColumn + contentColumn : contentColumn + imageColumn}
        </div>
    </div>
</div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(AboutSectionWidget);
