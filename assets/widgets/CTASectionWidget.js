/**
 * CTASectionWidget - A specialized widget for call-to-action sections
 * Provides controls for title, description, button, and background
 */
class CTASectionWidget extends WidgetBase {
    getName() {
        return 'cta-section';
    }

    getTitle() {
        return 'CTA Section';
    }

    getIcon() {
        return 'fa fa-bullhorn';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['cta', 'call to action', 'banner', 'conversion'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            title: 'Ready to Get Started?',
            description: 'Join thousands of satisfied customers and take your business to the next level today.',
            button_text: 'Get Started Now',
            button_link: '#',
            background_color: '#3b82f6',
            text_color: '#ffffff'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'CTA Content',
            tab: 'content'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Ready to Get Started?',
            placeholder: 'Enter title'
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Join thousands of satisfied customers...',
            placeholder: 'Enter description'
        });

        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Get Started Now',
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
            label: 'CTA Style',
            tab: 'style'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#3b82f6'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#ffffff'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const title = this.getSetting('title', 'Ready to Get Started?');
        const description = this.getSetting('description', '');
        const buttonText = this.getSetting('button_text', 'Get Started Now');
        const buttonLink = this.getSetting('button_link', '#');
        const backgroundColor = this.getSetting('background_color', '#3b82f6');
        const textColor = this.getSetting('text_color', '#ffffff');

        return `
<div class="cta-section" style="background-color: ${backgroundColor}; color: ${textColor};">
  <div class="container">
    <div class="cta-content text-center">
      <h2 class="cta-title">${this.escapeHtml(title)}</h2>
      <p class="cta-description">${this.escapeHtml(description)}</p>
      <a href="${buttonLink}" class="global-btn-style btn-common primary-btn cta-button">
        <span></span><span>${this.escapeHtml(buttonText)}</span><span></span>
      </a>
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

window.elementorWidgetManager.registerWidget(CTASectionWidget);
