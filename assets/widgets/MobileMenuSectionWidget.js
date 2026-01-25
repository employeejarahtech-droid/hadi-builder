/**
 * MobileMenuSectionWidget - Widget for the Mobile Menu layout
 * Based on HeaderSectionWidget
 */
class MobileMenuSectionWidget extends WidgetBase {
    getName() {
        return 'mobile-menu-section';
    }

    getTitle() {
        return 'Mobile Menu Section';
    }

    getIcon() {
        return 'fa fa-bars';
    }

    getCategories() {
        return ['section', 'layout'];
    }

    getKeywords() {
        return ['mobile', 'menu', 'section', 'navigation', 'drawer'];
    }

    // Is this a container widget?
    isContainer() {
        return true;
    }

    getDefaultSettings() {
        return {
            html_tag: 'div',
            min_height: { size: 100, unit: 'vh' },
            width: { size: 100, unit: '%' },
            background_color: '#ffffff',
            padding: { top: 20, right: 20, bottom: 20, left: 20, unit: 'px', isLinked: true },
            margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true },
            border_width: 0,
            border_color: '#e2e8f0',
            border_radius: 0,
            box_shadow: 'none',
            position: 'relative',
            z_index: 9999,
            flex_display: 'flex',
            flex_direction: 'column',
            justify_content: 'flex-start',
            align_items: 'stretch',
            flex_gap: { size: 20, unit: 'px' }
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Mobile Menu Settings',
            tab: 'content'
        });

        // 1. Logo Media Control
        this.addControl('logo', {
            type: 'media',
            label: 'Logo',
            default_value: { url: 'https://placehold.elementor-bundle.com/180x80' }
        });

        // 2. Menu Control
        this.addControl('menu', {
            type: 'menu',
            label: 'Navigation Menu',
            default_value: []
        });

        // 3. Search Toggle
        this.addControl('show_search', {
            type: 'select',
            label: 'Show Search',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'yes'
        });

        // 3.5 Cart Toggle
        this.addControl('show_cart', {
            type: 'select',
            label: 'Show Cart',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'yes'
        });

        // 4. Button Text and Link
        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Contact Us',
            placeholder: 'Enter button text'
        });

        this.addControl('button_link', {
            type: 'url',
            label: 'Button Link',
            default_value: '#',
            placeholder: 'https://your-link.com'
        });

        this.endControlsSection();

        // Style Section - Menu Styling
        this.startControlsSection('menu_style_section', {
            label: 'Menu Styling',
            tab: 'style'
        });

        this.addControl('menu_gap', {
            type: 'slider',
            label: 'Menu Gap',
            units: ['px', 'em', 'rem'],
            default_value: { size: 10, unit: 'px' },
            range: {
                px: { min: 0, max: 50, step: 1 },
            },
            selectors: {
                '{{WRAPPER}} .mobile-nav-main ul li': 'margin-bottom: {{SIZE}}{{UNIT}};',
                '{{WRAPPER}} .mobile-nav-main ul li:last-child': 'margin-bottom: 0;'
            }
        });

        this.endControlsSection();
    }

    constructor() {
        super();
        this.useFlexControls = true;
    }

    render() {
        // Get control values
        const logo = this.getSetting('logo', { url: 'https://placehold.elementor-bundle.com/180x80' });
        const menu = this.getSetting('menu', []);
        const showSearch = this.getSetting('show_search', 'yes');
        const showCart = this.getSetting('show_cart', 'yes');
        const buttonText = this.getSetting('button_text', 'Contact Us');
        const buttonLink = this.getSetting('button_link', '#');
        const menuGap = this.getSetting('menu_gap', { size: 10, unit: 'px' });

        // Build menu HTML from menu control
        let menuHTML = '';
        if (menu && menu.length > 0) {
            menuHTML = menu.map((item, index) => {
                const hasSubmenu = item.has_submenu && item.submenu_items && item.submenu_items.length > 0;

                if (hasSubmenu) {
                    // Menu item with dropdown
                    const submenuHTML = item.submenu_items.map(subItem =>
                        `<li><a href="${subItem.url || '#'}"><span>${subItem.text || 'Menu Item'}</span></a></li>`
                    ).join('');

                    return `
            <li class="menu-item-has-children">
              <div class="mobile-menu-item-header">
                <a href="${item.url || '#'}"><span>${item.text || 'Menu Item'}</span></a>
                <span class="mobile-submenu-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6 1.41-1.41z"></path>
                    </svg>
                </span>
              </div>
              <ul class="mobile-submenu" style="display: none; padding-left: 15px;">${submenuHTML}</ul>
            </li>`;
                } else {
                    // Simple menu item
                    const activeClass = item.url === '/' ? 'active' : '';
                    const iconHTML = item.icon ? `<i class="${item.icon}"></i> ` : '';
                    const liClass = activeClass ? ` class="${activeClass}"` : '';
                    return `<li${liClass}><a href="${item.url || '#'}">${iconHTML}${item.text || 'Menu Item'}</a></li>`;
                }
            }).join('');
        } else {
            // Default menu if none configured
            menuHTML = `
        <li class="active"><a href="/">Home</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      `;
        }

        // Search HTML (conditionally rendered)
        const searchHTML = showSearch === 'yes' ? `
      <div class="mobile-item-search" style="margin-bottom: 20px;">
        <div class="search-form">
            <form action="" method="get" style="position: relative; display: flex;">
              <input type="text" placeholder="Search..." name="s" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <button class="btn-search" style="position: absolute; right: 0; top: 0; height: 100%; width: 40px; background: none; border: none; cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"></path>
                </svg>
              </button>
            </form>
        </div>
      </div>
    ` : '';

        // Cart HTML (conditionally rendered)
        const enableCart = !(window.CMS_SETTINGS && window.CMS_SETTINGS.enable_cart === '0');
        const shouldShowCart = enableCart && (showCart === 'yes');

        const cartHTML = shouldShowCart ? `
              <div class="mobile-cart-wrapper" style="margin-bottom: 20px;">
                <a class="cart-button" href="${(window.CMS_SETTINGS && window.CMS_SETTINGS.cartUrl) ? window.CMS_SETTINGS.cartUrl : '/cart'}" style="display: flex; align-items: center; gap: 10px; color: #333; text-decoration: none;">
                    <span style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #f1f1f1; border-radius: 50%;">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count" style="position: absolute; top: -5px; right: -5px; background: #ff0000; color: white; font-size: 10px; padding: 2px 5px; border-radius: 10px;">0</span>
                    </span>
                    <span>View Cart</span>
                </a>
              </div>` : '';

        // Return the mobile menu structure
        return `
    <div class="mobile-menu-section">
      <div class="mobile-menu-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div class="mobile-brand">
          <a href="#" class="logo">
            <img src="${logo.url || 'https://placehold.elementor-bundle.com/180x80'}" alt="Logo" style="max-height: 50px;">
          </a>
        </div>
      </div>

      <div class="mobile-menu-content">
        ${searchHTML}
        
        <nav class="mobile-nav-main" style="margin-bottom: 20px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${menuHTML}
            </ul>
        </nav>

        ${cartHTML}

        ${buttonText ? `<a class="global-btn-style btn-common primary-btn mobile-menu-btn" href="${buttonLink}" style="display: block; text-align: center; padding: 10px; background: #333; color: white; text-decoration: none; border-radius: 4px;">${buttonText}</a>` : ''}
      </div>
    </div>
    
    <script>
    (function(){
        // Simple toggle for submenus in builder preview
        // Note: In real frontend, this should be handled by theme JS
        const container = document.currentScript.parentElement;
        const toggles = container.querySelectorAll('.mobile-submenu-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.closest('li').querySelector('.mobile-submenu');
                if(submenu) {
                    submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
                }
            });
        });
    })();
    </script>
    `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(MobileMenuSectionWidget);
