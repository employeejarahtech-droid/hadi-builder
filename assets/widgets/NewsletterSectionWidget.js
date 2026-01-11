/**
 * NewsletterSectionWidget - A specialized widget for newsletter subscription sections
 * Provides controls for title, description, and email subscription form
 */
class NewsletterSectionWidget extends WidgetBase {
    getName() {
        return 'newsletter-section';
    }

    getTitle() {
        return 'Newsletter Section';
    }

    getIcon() {
        return 'fa fa-paper-plane';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['newsletter', 'subscribe', 'email', 'subscription', 'signup'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            title: 'Subscribe to Our Newsletter',
            description: 'Get the latest updates, news, and exclusive offers delivered to your inbox.',
            placeholder_text: 'Enter your email',
            button_text: 'Subscribe',
            privacy_text: 'We respect your privacy. Unsubscribe at any time.',
            background_color: '#f8fafc'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Newsletter Content',
            tab: 'content'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Subscribe to Our Newsletter',
            placeholder: 'Enter title'
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Get the latest updates...',
            placeholder: 'Enter description'
        });

        this.addControl('placeholder_text', {
            type: 'text',
            label: 'Placeholder Text',
            default_value: 'Enter your email',
            placeholder: 'Placeholder for email input'
        });

        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Subscribe',
            placeholder: 'Button text'
        });

        this.addControl('privacy_text', {
            type: 'text',
            label: 'Privacy Text',
            default_value: 'We respect your privacy. Unsubscribe at any time.',
            placeholder: 'Privacy notice'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Newsletter Style',
            tab: 'style'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#f8fafc'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const title = this.getSetting('title', 'Subscribe to Our Newsletter');
        const description = this.getSetting('description', '');
        const placeholderText = this.getSetting('placeholder_text', 'Enter your email');
        const buttonText = this.getSetting('button_text', 'Subscribe');
        const privacyText = this.getSetting('privacy_text', '');
        const backgroundColor = this.getSetting('background_color', '#f8fafc');

        return `
<div class="newsletter-section" style="background-color: ${backgroundColor};">
  <div class="container">
    <div class="newsletter-content text-center">
      <h2 class="newsletter-title">${this.escapeHtml(title)}</h2>
      <p class="newsletter-description">${this.escapeHtml(description)}</p>
      <form class="newsletter-form" action="#" method="post">
        <div class="form-group">
          <input type="email" name="email" placeholder="${this.escapeHtml(placeholderText)}" required>
          <button type="submit" class="global-btn-style btn-common primary-btn">
            <span></span><span>${this.escapeHtml(buttonText)}</span><span></span>
          </button>
        </div>
      </form>
      ${privacyText ? `<p class="newsletter-privacy">${this.escapeHtml(privacyText)}</p>` : ''}
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

window.elementorWidgetManager.registerWidget(NewsletterSectionWidget);
