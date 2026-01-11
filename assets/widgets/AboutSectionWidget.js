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
            title: 'About Us',
            subtitle: 'Who We Are',
            description: 'We are a team of passionate professionals dedicated to delivering exceptional results. With years of experience and a commitment to excellence, we help businesses achieve their goals and reach new heights.',
            image: { url: 'https://placehold.co/600x400' },
            button_text: 'Learn More',
            button_link: '#',
            show_button: 'yes',
            image_position: 'right'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'About Content',
            tab: 'content'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'About Us',
            placeholder: 'Enter title'
        });

        this.addControl('subtitle', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'Who We Are',
            placeholder: 'Enter subtitle'
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'We are a team of passionate professionals...',
            placeholder: 'Enter description'
        });

        this.addControl('image', {
            type: 'media',
            label: 'Image',
            default_value: { url: 'https://placehold.co/600x400' }
        });

        this.addControl('show_button', {
            type: 'select',
            label: 'Show Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'yes'
        });

        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Learn More',
            placeholder: 'Button text'
        });

        this.addControl('button_link', {
            type: 'url',
            label: 'Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
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

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const title = this.getSetting('title', 'About Us');
        const subtitle = this.getSetting('subtitle', 'Who We Are');
        const description = this.getSetting('description', '');
        const image = this.getSetting('image', { url: 'https://placehold.co/600x400' });
        const showButton = this.getSetting('show_button', 'yes');
        const buttonText = this.getSetting('button_text', 'Learn More');
        const buttonLink = this.getSetting('button_link', '#');
        const imagePosition = this.getSetting('image_position', 'right');

        const buttonHTML = showButton === 'yes' ? `
      <a class="global-btn-style btn-common primary-btn" href="${buttonLink}">
        <span></span><span>${this.escapeHtml(buttonText)}</span><span></span>
      </a>
    ` : '';

        const contentHTML = `
      <div class="about-content">
        <h2 class="about-title">${this.escapeHtml(title)}</h2>
        <p class="about-subtitle">${this.escapeHtml(subtitle)}</p>
        <p class="about-description">${this.escapeHtml(description)}</p>
        ${buttonHTML}
      </div>
    `;

        const imageHTML = `
      <div class="about-image">
        <img src="${image.url}" alt="${this.escapeHtml(title)}">
      </div>
    `;

        const layoutClass = imagePosition === 'left' ? 'image-left' : 'image-right';

        return `
<div class="about-section ${layoutClass}">
  <div class="container">
    <div class="about-wrapper">
      ${imagePosition === 'left' ? imageHTML + contentHTML : contentHTML + imageHTML}
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
