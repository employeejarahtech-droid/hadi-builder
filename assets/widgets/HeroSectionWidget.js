/**
 * HeroSectionWidget - A specialized widget for hero/banner sections
 * Provides controls for headline, subheadline, description, CTA buttons, and background
 */
class HeroSectionWidget extends WidgetBase {
    getName() {
        return 'hero-section';
    }

    getTitle() {
        return 'Hero Section';
    }

    getIcon() {
        return 'fa fa-star';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['hero', 'banner', 'section', 'header', 'cta', 'jumbotron'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            title: 'Welcome to Our Website',
            subtitle: 'Your Success Starts Here',
            description: 'We provide innovative solutions to help your business grow and succeed in the digital world.',
            primary_button_text: 'Get Started',
            primary_button_link: '#',
            secondary_button_text: 'Learn More',
            secondary_button_link: '#',
            show_secondary_button: 'yes',
            background_image: { url: '' },
            text_alignment: 'center'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Hero Content',
            tab: 'content'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Welcome to Our Website',
            placeholder: 'Enter hero title'
        });

        this.addControl('subtitle', {
            type: 'text',
            label: 'Subtitle',
            default_value: 'Your Success Starts Here',
            placeholder: 'Enter subtitle'
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'We provide innovative solutions to help your business grow and succeed in the digital world.',
            placeholder: 'Enter description'
        });

        this.addControl('primary_button_text', {
            type: 'text',
            label: 'Primary Button Text',
            default_value: 'Get Started',
            placeholder: 'Button text'
        });

        this.addControl('primary_button_link', {
            type: 'url',
            label: 'Primary Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        this.addControl('show_secondary_button', {
            type: 'select',
            label: 'Show Secondary Button',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'yes'
        });

        this.addControl('secondary_button_text', {
            type: 'text',
            label: 'Secondary Button Text',
            default_value: 'Learn More',
            placeholder: 'Button text'
        });

        this.addControl('secondary_button_link', {
            type: 'url',
            label: 'Secondary Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Hero Style',
            tab: 'style'
        });

        this.addControl('background_image', {
            type: 'media',
            label: 'Background Image',
            default_value: { url: '' }
        });

        this.addControl('text_alignment', {
            type: 'select',
            label: 'Text Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'center'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const title = this.getSetting('title', 'Welcome to Our Website');
        const subtitle = this.getSetting('subtitle', 'Your Success Starts Here');
        const description = this.getSetting('description', '');
        const primaryBtnText = this.getSetting('primary_button_text', 'Get Started');
        const primaryBtnLink = this.getSetting('primary_button_link', '#');
        const showSecondaryBtn = this.getSetting('show_secondary_button', 'yes');
        const secondaryBtnText = this.getSetting('secondary_button_text', 'Learn More');
        const secondaryBtnLink = this.getSetting('secondary_button_link', '#');
        const backgroundImage = this.getSetting('background_image', { url: '' });
        const textAlignment = this.getSetting('text_alignment', 'center');

        const bgStyle = backgroundImage.url ? `background-image: url('${backgroundImage.url}');` : '';
        const alignClass = `text-${textAlignment}`;

        const secondaryButtonHTML = showSecondaryBtn === 'yes' ? `
      <a class="global-btn-style btn-common secondary-btn" href="${secondaryBtnLink}">
        <span></span><span>${this.escapeHtml(secondaryBtnText)}</span><span></span>
      </a>
    ` : '';

        return `
<div class="hero-section" style="${bgStyle}">
  <div class="container">
    <div class="hero-content ${alignClass}">
      <h1 class="hero-title">${this.escapeHtml(title)}</h1>
      <h2 class="hero-subtitle">${this.escapeHtml(subtitle)}</h2>
      <p class="hero-description">${this.escapeHtml(description)}</p>
      <div class="hero-buttons">
        <a class="global-btn-style btn-common primary-btn" href="${primaryBtnLink}">
          <span></span><span>${this.escapeHtml(primaryBtnText)}</span><span></span>
        </a>
        ${secondaryButtonHTML}
      </div>
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

window.elementorWidgetManager.registerWidget(HeroSectionWidget);
