/**
 * HeaderSectionWidget - A specialized container widget for header sections
 * Provides a flexible container optimized for building header layouts
 */
class HeaderSectionWidget extends WidgetBase {
  getName() {
    return 'header-section';
  }

  getTitle() {
    return 'Header Section';
  }

  getIcon() {
    return 'fa fa-window-maximize';
  }

  getCategories() {
    return ['section', 'layout'];
  }

  getKeywords() {
    return ['header', 'section', 'container', 'top', 'navigation', 'navbar'];
  }

  // Is this a container widget?
  isContainer() {
    return true;
  }

  getDefaultSettings() {
    return {
      html_tag: 'header',
      min_height: { size: 80, unit: 'px' },
      max_width: { size: '', unit: 'px' },
      width: { size: 100, unit: '%' },
      background_color: '#ffffff',
      padding: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: false },
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true },
      border_width: 0,
      border_color: '#e2e8f0',
      border_radius: 0,
      box_shadow: 'sm',
      position: 'relative',
      z_index: 100,
      flex_display: 'flex',
      flex_direction: 'row',
      justify_content: 'space-between',
      align_items: 'center',
      flex_wrap: 'nowrap',
      flex_gap: { size: 20, unit: 'px' },
      logo_url: '/'
    };
  }

  registerControls() {
    // Content Section
    this.startControlsSection('content_section', {
      label: 'Header Settings',
      tab: 'content'
    });

    // 1. Logo Media Control
    this.addControl('logo', {
      type: 'media',
      label: 'Logo',
      default_value: { url: 'https://placehold.elementor-bundle.com/180x80' }
    });

    // 1.5 Logo URL Control
    this.addControl('logo_url', {
      type: 'url',
      label: 'Logo Link',
      default_value: '/',
      placeholder: 'https://your-site.com'
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
      default_value: 'Item #1',
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
        px: { min: 0, max: 100, step: 1 },
        em: { min: 0, max: 10, step: 0.1 },
        rem: { min: 0, max: 10, step: 0.1 }
      },
      selectors: {
        '{{WRAPPER}} .nav-main ul li': 'margin-right: {{SIZE}}{{UNIT}};',
        '{{WRAPPER}} .nav-main ul li:last-child': 'margin-right: 0;'
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
    const logoUrl = this.getSetting('logo_url', '/');
    const menu = this.getSetting('menu', []);
    const showSearch = this.getSetting('show_search', 'yes');
    const showCart = this.getSetting('show_cart', 'yes');
    const buttonText = this.getSetting('button_text', 'Item #1');
    const buttonLink = this.getSetting('button_link', '#');
    const menuGap = this.getSetting('menu_gap', { size: 30, unit: 'px' });

    // Calculate menu gap value
    const menuGapValue = menuGap && typeof menuGap === 'object' && menuGap.size !== ''
      ? `${menuGap.size}${menuGap.unit}`
      : '10px';
    // Calculate menu gap value - No longer needed for inline style, CSS generation handles it
    // const menuGapValue = menuGap && typeof menuGap === 'object' && menuGap.size !== ''
    //   ? `${menuGap.size}${menuGap.unit}`
    //   : '10px';

    // Build menu HTML from menu control
    let menuHTML = '';
    if (menu && menu.length > 0) {
      menuHTML = menu.map((item, index) => {
        const hasSubmenu = item.has_submenu && item.submenu_items && item.submenu_items.length > 0;
        // const isLastItem = index === menu.length - 1; // Removed
        // const gapStyle = !isLastItem ? `margin-right: ${menuGapValue};` : ''; // Removed

        if (hasSubmenu) {
          // Menu item with dropdown
          const submenuHTML = item.submenu_items.map(subItem =>
            `<li><a href="${subItem.url || '#'}"><span>${subItem.text || 'Menu Item'}</span></a></li>`
          ).join('');

          return `
            <li class="menu-item-has-children">
              <a href="${item.url || '#'}">
                <span>${item.text || 'Menu Item'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 9.17a1 1 0 0 0-1.41 0L12 12.71L8.46 9.17a1 1 0 0 0-1.41 0a1 1 0 0 0 0 1.42l4.24 4.24a1 1 0 0 0 1.42 0L17 10.59a1 1 0 0 0 0-1.42"></path>
                </svg>
              </a>
              <div class="dropdown-box">
                <ul>${submenuHTML}</ul>
              </div>
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
        <li><a href="#">Our Team</a></li>
      `;
    }

    // Search HTML (conditionally rendered)
    const searchHTML = showSearch === 'yes' ? `
      <div class="item-search">
        <div class="search-block search_evt search_evt_inline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"></path>
          </svg>
        </div>
        <div class="search-box" style="display: none; top: 36px">
          <div class="search-form">
            <form action="" method="get">
              <input type="text" placeholder="Type your keyword" name="s"><button class="btn-search">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    ` : '';

    // Cart HTML (conditionally rendered)
    const enableCart = !(window.CMS_SETTINGS && window.CMS_SETTINGS.enable_cart === '0');
    // Only show if globally enabled AND enabled in widget settings
    // If showCart setting is missing (old widgets), default to 'yes' (logic handled by getSetting default)
    const shouldShowCart = enableCart && (showCart === 'yes');

    const cartHTML = shouldShowCart ? `
              <a class="cart-button" href="${(window.CMS_SETTINGS && window.CMS_SETTINGS.cartUrl) ? window.CMS_SETTINGS.cartUrl : '/cart'}" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 8px; background: #f8fafc; color: #64748b; text-decoration: none; transition: all 0.2s; margin-right: 10px;" onmouseover="this.style.background='#3b82f6'; this.style.color='#fff';" onmouseout="this.style.background='#f8fafc'; this.style.color='#64748b';">
                <i class="fas fa-shopping-cart" style="font-size: 18px;"></i>
                <span class="cart-count" style="position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; font-size: 11px; font-weight: 700; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">0</span>
              </a>` : '';

    // Return the complete header HTML structure
    return `
    <div class="main-header">
      <div class="header-top">
        <div class="container">
          <div class="header-top-content">
            <div class="header-brand">
              <a href="${logoUrl}" class="logo">
                <img src="${logo.url || 'https://placehold.elementor-bundle.com/180x80'}" alt="">
              </a>
            </div>
            <div class="nav-wrapper">
              <nav class="nav-main">
                <ul>
                  ${menuHTML}
                </ul>
              </nav>
            </div>
            <div class="header-top-right">
              ${searchHTML}
              ${cartHTML}
              <a class="global-btn-style btn-common primary-btn header-btn" href="${buttonLink}"><span></span><span>${buttonText}</span><span></span></a>

              <div class="mobile-menu-toggle">
                <div class="line line1"></div>
                <div class="line line2"></div>
                <div class="line line3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
        `;
  }

  onContentRendered() {
    // Update cart count when EcommerceManager is available
    if (window.EcommerceManager) {
      const updateCartCount = () => {
        const cartCountEl = this.$el.querySelector('.cart-count');
        if (cartCountEl) {
          const cart = window.EcommerceManager.getCart();
          const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
          cartCountEl.textContent = totalItems;
          cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
        }
      };

      // Initial update
      updateCartCount();

      // Subscribe to cart updates
      window.EcommerceManager.on('cart:updated', updateCartCount);
    }
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

window.elementorWidgetManager.registerWidget(HeaderSectionWidget);
