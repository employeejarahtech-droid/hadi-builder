/**
 * TopbarSectionWidget - A specialized widget for topbar sections
 * Provides controls for CTA links and social icons
 */
class TopbarSectionWidget extends WidgetBase {
    getName() {
        return 'topbar-section';
    }

    getTitle() {
        return 'Topbar Section';
    }

    getIcon() {
        return 'fa fa-bars';
    }

    getCategories() {
        return ['section', 'layout'];
    }

    getKeywords() {
        return ['topbar', 'section', 'top', 'header', 'cta', 'social'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            topbar_cta_links: [
                {
                    icon: 'fa fa-phone',
                    text: 'Call Us: +1 234 567 890',
                    link: 'tel:+1234567890'
                },
                {
                    icon: 'fa fa-envelope',
                    text: 'Email: info@example.com',
                    link: 'mailto:info@example.com'
                }
            ],
            social_icons: [
                {
                    icon: 'fab fa-facebook-f',
                    link: 'https://facebook.com',
                    label: 'Facebook'
                },
                {
                    icon: 'fab fa-twitter',
                    link: 'https://twitter.com',
                    label: 'Twitter'
                },
                {
                    icon: 'fab fa-instagram',
                    link: 'https://instagram.com',
                    label: 'Instagram'
                },
                {
                    icon: 'fab fa-linkedin-in',
                    link: 'https://linkedin.com',
                    label: 'LinkedIn'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Topbar Content',
            tab: 'content'
        });

        // 1. Topbar CTA Links Repeater
        this.addControl('topbar_cta_links', {
            type: 'repeater',
            label: 'CTA Links',
            default_value: [],
            fields: [
                {
                    name: 'icon',
                    type: 'icon',
                    label: 'Icon',
                    default_value: 'fa fa-phone'
                },
                {
                    name: 'text',
                    type: 'text',
                    label: 'Text',
                    default_value: 'Contact Us',
                    placeholder: 'Enter text'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: '#',
                    placeholder: 'https://your-link.com'
                }
            ],
            title_field: 'text'
        });

        // 2. Social Icons Repeater
        this.addControl('social_icons', {
            type: 'repeater',
            label: 'Social Icons',
            default_value: [],
            fields: [
                {
                    name: 'icon',
                    type: 'icon',
                    label: 'Icon',
                    default_value: 'fab fa-facebook-f'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Link',
                    default_value: '#',
                    placeholder: 'https://facebook.com/yourpage'
                },
                {
                    name: 'label',
                    type: 'text',
                    label: 'Label (for accessibility)',
                    default_value: 'Facebook',
                    placeholder: 'Social network name'
                }
            ],
            title_field: 'label'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        // Get control values
        const ctaLinks = this.getSetting('topbar_cta_links', []);
        const socialIcons = this.getSetting('social_icons', []);

        // Build CTA Links HTML
        let ctaLinksHTML = '';
        if (ctaLinks && ctaLinks.length > 0) {
            ctaLinksHTML = ctaLinks.map(item => {
                const iconHTML = item.icon ? `<i class="${item.icon}"></i>` : '';

                // Handle link: check if object (from URL control) or string (legacy)
                let href = '#';
                let target = '';
                let rel = '';

                if (item.link) {
                    if (typeof item.link === 'object') {
                        href = item.link.url || '#';
                        if (item.link.is_external) target = 'target="_blank"';
                        if (item.link.nofollow) rel = 'rel="nofollow"';
                    } else {
                        href = item.link;
                    }
                }

                // If no link provided, just text
                if (href === '#' || !href) {
                    return `<div class="header-item">${iconHTML}${item.text || 'Link'}</div>`;
                }

                return `<a href="${href}" ${target} ${rel} class="header-item">${iconHTML}${item.text || 'Link'}</a>`;
            }).join('');
        }

        // Build Social Icons HTML
        let socialIconsHTML = '';
        if (socialIcons && socialIcons.length > 0) {
            socialIconsHTML = socialIcons.map(item => {
                const iconHTML = item.icon ? `<i class="${item.icon}"></i>` : '<i class="fab fa-link"></i>';
                const label = item.label || 'Social Link';

                // Handle link
                let href = '#';
                let target = '_blank'; // Default to blank for social
                let rel = '';

                if (item.link) {
                    if (typeof item.link === 'object') {
                        href = item.link.url || '#';
                        if (item.link.is_external) target = 'target="_blank"'; // Respect setting if present, or keep default? Usually social is external.
                        // Actually, let's respect the control if it's explicitly set, otherwise default to blank for social implies we might want to force it?
                        // Let's rely on the control. If user unchecks external, it should be self.
                        // BUT, classic social icons usually default to new tab.
                        // Let's just use the control value if object.
                        target = item.link.is_external ? 'target="_blank"' : '';
                        if (item.link.nofollow) rel = 'rel="nofollow"';
                    } else {
                        href = item.link;
                    }
                }

                return `<a href="${href}" ${target} ${rel} aria-label="${label}" title="${label}">${iconHTML}</a>`;
            }).join('');
        }

        // Return the complete topbar HTML structure
        return `
<div class="topbar">
  <div class="container">
    <div class="d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between">
      <div class="topbar-left">
        ${ctaLinksHTML}
      </div>
      <div class="topbar-right">
        <div class="topbar-social">
          ${socialIconsHTML}
        </div>
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

window.elementorWidgetManager.registerWidget(TopbarSectionWidget);
