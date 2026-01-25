class ProductGridWidget extends WidgetBase {
    getName() { return 'product_grid'; }
    getTitle() { return 'Product Grid'; }
    getIcon() { return 'fas fa-th'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['product', 'grid', 'catalog', 'shop']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Our Products', placeholder: 'Enter title', label_block: true });
        this.addControl('columns', { type: 'select', label: 'Columns', default_value: '4', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] });

        this.addControl('show_filters', { type: 'switcher', label: 'Show Filters', default_value: 'yes' });
        this.addControl('show_categories', { type: 'switcher', label: 'Show Categories', default_value: 'yes' });
        this.addControl('show_price_filter', { type: 'switcher', label: 'Show Price Filter', default_value: 'yes' });

        this.addControl('show_price', { type: 'switcher', label: 'Show Price', default_value: 'yes' });
        this.addControl('show_free_delivery', { type: 'switcher', label: 'Show Free Delivery Text', default_value: 'yes' });
        this.addControl('show_rating', { type: 'switcher', label: 'Show Rating', default_value: 'yes' });

        this.addControl('source', {
            type: 'select',
            label: 'Product Source',
            default_value: 'dynamic',
            options: [
                { value: 'dynamic', label: 'Dynamic (From Database)' },
                { value: 'manual', label: 'Manual (Custom Products)' }
            ]
        });

        this.addControl('posts_per_page', {
            type: 'number',
            label: 'Products Per Page',
            default_value: 20,
            min: 1,
            max: 50
        });

        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('primary_color', { type: 'color', label: 'Primary Color', default_value: '#007EFC' });
        this.addControl('discount_badge_color', { type: 'color', label: 'Discount Badge Color', default_value: '#ff4444' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Our Products');
        const columns = this.getSetting('columns', '4');
        const showFilters = this.getSetting('show_filters', 'yes');
        const showCategories = this.getSetting('show_categories', 'yes');
        const showPriceFilter = this.getSetting('show_price_filter', 'yes');
        const source = this.getSetting('source', 'dynamic');
        const showPrice = this.getSetting('show_price', 'yes');
        const showFreeDelivery = this.getSetting('show_free_delivery', 'yes');
        const showRating = this.getSetting('show_rating', 'yes');
        const postsPerPage = parseInt(this.getSetting('posts_per_page', 20)) || 20;
        const primaryColor = this.getSetting('primary_color', '#007EFC');
        const discountBadgeColor = this.getSetting('discount_badge_color', '#ff4444');

        const cssId = this.getSetting('css_id', '') || 'product-grid-' + Math.random().toString(36).substr(2, 9);

        // Store config
        window[`productGrid_${cssId}`] = {
            source, columns, postsPerPage, primaryColor, discountBadgeColor, title,
            showFilters, showCategories, showPriceFilter, showPrice, showFreeDelivery, showRating
        };


        this.waitForContainer(cssId);

        const loadingHtml = `
            <div style="padding: 0px; text-align: center;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: ${primaryColor};"></i>
                <div style="margin-top: 10px; color: #666;">Loading products...</div>
            </div>`;

        return `<div class="product-grid-widget " id="${cssId}">${loadingHtml}</div>`;
    }

    waitForContainer(containerId, attempts = 0) {
        const container = document.getElementById(containerId);
        if (container) {
            this.loadProducts(containerId, 1);
        } else if (attempts < 20) {
            setTimeout(() => this.waitForContainer(containerId, attempts + 1), 100);
        }
    }

    async loadProducts(containerId, page = 1, filters = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = window[`productGrid_${containerId}`];
        if (!config) return;

        const { source, columns, postsPerPage, primaryColor, discountBadgeColor, title, showFilters, showCategories, showPriceFilter, showPrice, showFreeDelivery, showRating } = config;

        // Show loading indicator
        const loadingHtml = `
            <div class="container">
                <div style="display: flex; gap: 30px;">
                    ${showFilters === 'yes' ? `<div style="flex: 0 0 280px;"></div>` : ''}
                    <div style="flex: 1; padding: 60px 20px; text-align: center;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: ${primaryColor}; margin-bottom: 20px;"></i>
                        <div style="font-size: 16px; color: #6b7280;">Loading products...</div>
                    </div>
                </div>
            </div>`;
        container.innerHTML = loadingHtml;

        let productsData = [];
        let totalPages = 1;
        let totalCount = 0;

        if (source === 'dynamic') {
            try {
                const baseUrl = window.CMS_ROOT || '';
                let fetchUrl = `${baseUrl}/api/get-products.php?page=${page}&limit=${postsPerPage}`;

                // Add filter parameters
                if (filters.category) fetchUrl += `&category=${filters.category}`;
                if (filters.minPrice) fetchUrl += `&min_price=${filters.minPrice}`;
                if (filters.maxPrice) fetchUrl += `&max_price=${filters.maxPrice}`;
                if (filters.sort) fetchUrl += `&sort=${filters.sort}`;

                const response = await fetch(fetchUrl);
                if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

                const data = await response.json();
                if (data.success && data.products) {
                    productsData = data.products;
                    totalPages = data.total_pages || 1;
                    totalCount = data.count || 0;
                }
            } catch (e) {
                console.error('[ProductGrid] Failed to load products:', e);
                container.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444;">Failed to load products</div>`;
                return;
            }
        }

        this.renderProductGrid(containerId, productsData, page, totalPages, totalCount, filters);

        // Load categories if enabled
        if (showCategories === 'yes' || showFilters === 'yes') {
            this.loadCategories(containerId, filters);
        }
    }

    renderProductGrid(containerId, productsData, page, totalPages, totalCount, filters = {}) {
        const container = document.getElementById(containerId);
        const config = window[`productGrid_${containerId}`];
        const { columns, primaryColor, discountBadgeColor, title, showFilters, postsPerPage, showPrice, showFreeDelivery, showRating } = config;

        const startItem = ((page - 1) * postsPerPage) + 1;
        const endItem = Math.min(page * postsPerPage, totalCount);

        // Build products HTML
        const productsHtml = productsData.map(item => {
            const imageUrl = item.image_url || 'https://placehold.co/400x400?text=No+Image';
            const price = parseFloat(item.price) || 0;
            const originalPrice = parseFloat(item.original_price || item.price) || price;
            const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
            const rating = parseFloat(item.rating) || 0;

            const baseUrl = window.CMS_ROOT || '';
            const linkUrl = item.slug ? `${baseUrl}/product/${item.slug}` : `${baseUrl}/product/${item.id}`;

            return `
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                    ${discount > 0 ? `<div style="position: absolute; top: 10px; left: 10px; background: ${discountBadgeColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; z-index: 1;">${discount}% OFF</div>` : ''}
                    <a href="${linkUrl}" style="display: block; position: relative; aspect-ratio: 1; background: #f9fafb;">
                        <img src="${imageUrl}" alt="${this.escapeHtml(item.name)}" style="width: 100%; height: 100%; object-fit: contain;" loading="lazy">
                    </a>
                    <div style="padding: 15px;">
                        <a href="${linkUrl}" style="font-size: 16px; font-weight: 500; color: #1f2937; text-decoration: none; display: block; margin-bottom: 8px; line-height: 1.4; height: 40px; overflow: hidden;">${this.escapeHtml(item.name)}</a>
                        ${showPrice === 'yes' ? `
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <div style="font-size: 18px; font-weight: 700; color: ${primaryColor};">
                                ${window.EcommerceManager ? window.EcommerceManager.formatPrice(price) : `$${price.toFixed(2)}`}
                            </div>
                            ${discount > 0 ? `<div style="font-size: 14px; color: #9ca3af; text-decoration: line-through;">${window.EcommerceManager ? window.EcommerceManager.formatPrice(originalPrice) : `$${originalPrice.toFixed(2)}`}</div>` : ''}
                        </div>` : ''}
                        ${showRating === 'yes' ? this.renderStars(rating, primaryColor) : ''}
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6;">
                            ${showFreeDelivery === 'yes' ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">🚚 Free Delivery</div>` : ''}
                            <div style="font-size: 12px; color: #10b981;">✓ In Stock</div>
                        </div>
                    </div>
                </div>`;
        }).join('');

        const paginationHtml = this.renderPagination(containerId, page, totalPages, primaryColor, filters);

        const mainHtml = `
            <div class="container">
                <div style="display: flex; gap: 30px;">
                    ${showFilters === 'yes' ? `<div id="filters-sidebar-${containerId}" style="flex: 0 0 280px;">
                        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; position: sticky; top: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h4 style="font-size: 18px; font-weight: 700; margin: 0; color: #1f2937;">Filters</h4>
                                <button onclick="window.productGridResetFilters_${containerId}()" style="background: none; border: none; color: ${primaryColor}; cursor: pointer; font-size: 16px; font-weight: 600;">Reset</button>
                            </div>
                            <div id="categories-list-${containerId}">
                                <div style="text-align: center; padding: 20px; color: #9ca3af;">
                                    <i class="fas fa-spinner fa-spin"></i> Loading...
                                </div>
                            </div>
                        </div>
                    </div>` : ''}
                    
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="font-size: 14px; color: #6b7280;">Showing ${startItem}-${endItem} of ${totalCount} items</div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <select id="sort-select-${containerId}" onchange="window['productGridSort_${containerId}'](this.value)" style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 16px; cursor: pointer;">
                                    <option value="" ${!filters.sort || filters.sort === 'newest' ? 'selected' : ''}>Sort by</option>
                                    <option value="price_asc" ${filters.sort === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                                    <option value="price_desc" ${filters.sort === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
                                    <option value="rating" ${filters.sort === 'rating' ? 'selected' : ''}>Top Rated</option>
                                    <option value="newest" ${filters.sort === 'newest' ? 'selected' : ''}>Newest</option>
                                </select>
                                <select id="perpage-select-${containerId}" onchange="window['productGridPerPage_${containerId}'](this.value)" style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 16px; cursor: pointer;">
                                    <option value="20" ${postsPerPage == 20 ? 'selected' : ''}>Show: 20</option>
                                    <option value="50" ${postsPerPage == 50 ? 'selected' : ''}>Show: 50</option>
                                    <option value="100" ${postsPerPage == 100 ? 'selected' : ''}>Show: 100</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px; margin-bottom: 30px;">
                            ${productsHtml || '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #9ca3af;">No products found</div>'}
                        </div>
                        
                        ${paginationHtml}
                    </div>
                </div>
            </div>`;

        // Setup filter functions BEFORE rendering HTML
        const self = this;
        window[`productGridResetFilters_${containerId}`] = function () {
            self.loadProducts(containerId, 1, {});
        };
        window[`productGridSort_${containerId}`] = function (sort) {
            self.loadProducts(containerId, 1, { ...filters, sort });
        };
        window[`productGridPerPage_${containerId}`] = function (perPage) {
            config.postsPerPage = parseInt(perPage);
            self.loadProducts(containerId, 1, filters);
        };

        container.innerHTML = mainHtml;
    }

    renderStars(rating, color) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHtml = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHtml += `<i class="fas fa-star" style="color: ${color}; font-size: 12px;"></i>`;
            } else if (i === fullStars && hasHalfStar) {
                starsHtml += `<i class="fas fa-star-half-alt" style="color: ${color}; font-size: 12px;"></i>`;
            } else {
                starsHtml += `<i class="far fa-star" style="color: #d1d5db; font-size: 12px;"></i>`;
            }
        }

        return `<div style="display: flex; align-items: center; gap: 4px;">
            ${starsHtml}
            <span style="font-size: 12px; color: #6b7280; margin-left: 4px;">${rating.toFixed(1)}</span>
        </div>`;
    }

    renderPagination(containerId, page, totalPages, color, filters) {
        if (totalPages <= 1) return '';

        let html = '<div style="display: flex; justify-content: center; gap: 8px;">';

        // Previous button
        if (page > 1) {
            html += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', ${page - 1}, ${JSON.stringify(filters).replace(/"/g, '&quot;')})" style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; border-radius: 6px; font-weight: 500;">&laquo;</button>`;
        }

        // Page numbers
        const maxPages = 7;
        let startPage = Math.max(1, page - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);

        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        if (startPage > 1) {
            html += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', 1, ${JSON.stringify(filters).replace(/"/g, '&quot;')})" style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; border-radius: 6px;">1</button>`;
            if (startPage > 2) html += '<span style="padding: 8px;">...</span>';
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === page;
            html += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', ${i}, ${JSON.stringify(filters).replace(/"/g, '&quot;')})" style="padding: 8px 12px; border: 1px solid ${isActive ? color : '#e5e7eb'}; background: ${isActive ? color : '#fff'}; color: ${isActive ? '#fff' : '#1f2937'}; cursor: pointer; border-radius: 6px; font-weight: ${isActive ? '700' : '500'};">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) html += '<span style="padding: 8px;">...</span>';
            html += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', ${totalPages}, ${JSON.stringify(filters).replace(/"/g, '&quot;')})" style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; border-radius: 6px;">${totalPages}</button>`;
        }

        // Next button
        if (page < totalPages) {
            html += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', ${page + 1}, ${JSON.stringify(filters).replace(/"/g, '&quot;')})" style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; border-radius: 6px; font-weight: 500;">&raquo;</button>`;
        }

        html += '</div>';
        return html;
    }

    async loadCategories(containerId, filters = {}) {
        try {
            const baseUrl = window.CMS_ROOT || '';
            const response = await fetch(`${baseUrl}/api/get-categories.php`);
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

            const data = await response.json();
            if (data.success && data.categories) {
                const categoriesList = document.getElementById(`categories-list-${containerId}`);
                if (!categoriesList) return;

                const config = window[`productGrid_${containerId}`];
                const { primaryColor } = config;

                let html = `
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <i class="fas fa-th-large" style="color: ${primaryColor};"></i>
                            <h5 style="font-size: 14px; font-weight: 700; margin: 0; color: #1f2937;">Categories</h5>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', 1, {})" style="padding: 10px 12px; background: ${!filters.category ? primaryColor + '15' : 'transparent'}; border: none; border-radius: 6px; text-align: left; cursor: pointer; font-size: 14px; color: ${!filters.category ? primaryColor : '#6b7280'}; font-weight: ${!filters.category ? '600' : '400'}; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;" onmouseover="if(!this.style.background.includes('${primaryColor}')) this.style.background='#f3f4f6'" onmouseout="if(!this.style.background.includes('${primaryColor}')) this.style.background='transparent'">
                                <span>All Products</span>
                                <span style="font-size: 12px; color: #94a3b8;">(${data.total_count || 0})</span>
                            </button>`;

                data.categories.forEach(category => {
                    const isActive = filters.category == category.id;
                    const count = category.product_count || 0;
                    html += `
                        <button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', 1, { category: ${category.id} })" style="padding: 10px 12px; background: ${isActive ? primaryColor + '15' : 'transparent'}; border: none; border-radius: 6px; text-align: left; cursor: pointer; font-size: 14px; color: ${isActive ? primaryColor : '#6b7280'}; font-weight: ${isActive ? '600' : '400'}; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;" onmouseover="if(!this.style.background.includes('${primaryColor}')) this.style.background='#f3f4f6'" onmouseout="if(!this.style.background.includes('${primaryColor}')) this.style.background='transparent'">
                            <span>${this.escapeHtml(category.name)}</span>
                            <span style="font-size: 12px; color: #94a3b8;">(${count})</span>
                        </button>`;

                    if (category.subcategories && category.subcategories.length > 0) {
                        category.subcategories.forEach(sub => {
                            const isSubActive = filters.category == sub.id;
                            const subCount = sub.product_count || 0;
                            html += `
                                <button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', 1, { category: ${sub.id} })" style="padding: 8px 12px; padding-left: 28px; background: ${isSubActive ? primaryColor + '15' : 'transparent'}; border: none; border-radius: 6px; text-align: left; cursor: pointer; font-size: 16px; color: ${isSubActive ? primaryColor : '#9ca3af'}; font-weight: ${isSubActive ? '600' : '400'}; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;" onmouseover="if(!this.style.background.includes('${primaryColor}')) this.style.background='#f3f4f6'" onmouseout="if(!this.style.background.includes('${primaryColor}')) this.style.background='transparent'">
                                    <span>${this.escapeHtml(sub.name)}</span>
                                    <span style="font-size: 11px; color: #cbd5e1;">(${subCount})</span>
                                </button>`;
                        });
                    }
                });

                html += '</div></div>';

                // Add price filter if enabled
                if (config.showPriceFilter === 'yes') {
                    const currentMinPrice = filters.minPrice || 0;
                    const currentMaxPrice = filters.maxPrice || 10000;

                    html += `
                        <div style="padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                <i class="fas fa-tag" style="color: ${primaryColor};"></i>
                                <h5 style="font-size: 14px; font-weight: 700; margin: 0; color: #1f2937;">Price Range</h5>
                            </div>
                            <div style="padding: 10px 0;">
                                <!-- Min Price -->
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; font-size: 12px; color: #6b7280; margin-bottom: 5px;">Minimum Price</label>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <input type="range" id="price-min-${containerId}" min="0" max="10000" step="100" value="${currentMinPrice}" 
                                            style="flex: 1; accent-color: ${primaryColor};" 
                                            oninput="
                                                const maxSlider = document.getElementById('price-max-${containerId}');
                                                const minInput = document.getElementById('price-min-input-${containerId}');
                                                if (parseInt(this.value) > parseInt(maxSlider.value)) {
                                                    this.value = maxSlider.value;
                                                }
                                                minInput.value = this.value;
                                            ">
                                        <input type="number" id="price-min-input-${containerId}" min="0" max="10000" step="100" value="${currentMinPrice}"
                                            style="width: 80px; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; text-align: center;"
                                            oninput="
                                                const slider = document.getElementById('price-min-${containerId}');
                                                const maxSlider = document.getElementById('price-max-${containerId}');
                                                let val = parseInt(this.value) || 0;
                                                if (val > parseInt(maxSlider.value)) val = parseInt(maxSlider.value);
                                                if (val < 0) val = 0;
                                                this.value = val;
                                                slider.value = val;
                                            ">
                                    </div>
                                </div>
                                
                                <!-- Max Price -->
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; font-size: 12px; color: #6b7280; margin-bottom: 5px;">Maximum Price</label>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <input type="range" id="price-max-${containerId}" min="0" max="10000" step="100" value="${currentMaxPrice}" 
                                            style="flex: 1; accent-color: ${primaryColor};" 
                                            oninput="
                                                const minSlider = document.getElementById('price-min-${containerId}');
                                                const maxInput = document.getElementById('price-max-input-${containerId}');
                                                if (parseInt(this.value) < parseInt(minSlider.value)) {
                                                    this.value = minSlider.value;
                                                }
                                                maxInput.value = this.value;
                                            ">
                                        <input type="number" id="price-max-input-${containerId}" min="0" max="10000" step="100" value="${currentMaxPrice}"
                                            style="width: 80px; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; text-align: center;"
                                            oninput="
                                                const slider = document.getElementById('price-max-${containerId}');
                                                const minSlider = document.getElementById('price-min-${containerId}');
                                                let val = parseInt(this.value) || 10000;
                                                if (val < parseInt(minSlider.value)) val = parseInt(minSlider.value);
                                                if (val > 10000) val = 10000;
                                                this.value = val;
                                                slider.value = val;
                                            ">
                                    </div>
                                </div>
                                
                                <!-- Current Range Display -->
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: #1f2937; font-weight: 600; padding: 8px; background: #f8fafc; border-radius: 6px;">
                                    <span>$<span id="price-display-min-${containerId}">${currentMinPrice}</span></span>
                                    <span>-</span>
                                    <span>$<span id="price-display-max-${containerId}">${currentMaxPrice}</span></span>
                                </div>
                                
                                <button onclick="
                                    const minPrice = document.getElementById('price-min-${containerId}').value;
                                    const maxPrice = document.getElementById('price-max-${containerId}').value;
                                    const currentFilters = ${JSON.stringify(filters).replace(/"/g, '&quot;')};
                                    const newFilters = { ...currentFilters, minPrice: minPrice, maxPrice: maxPrice };
                                    new (window.elementorWidgetManager.getWidgetClass('product_grid'))().loadProducts('${containerId}', 1, newFilters);
                                " style="width: 100%; margin-top: 10px; padding: 10px; background: ${primaryColor}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: opacity 0.2s;" 
                                onmouseover="this.style.opacity='0.9'" 
                                onmouseout="this.style.opacity='1'">
                                    Apply Price Filter
                                </button>
                            </div>
                        </div>
                        <script>
                            // Sync display values with sliders
                            (function() {
                                const minSlider = document.getElementById('price-min-${containerId}');
                                const maxSlider = document.getElementById('price-max-${containerId}');
                                const minInput = document.getElementById('price-min-input-${containerId}');
                                const maxInput = document.getElementById('price-max-input-${containerId}');
                                const displayMin = document.getElementById('price-display-min-${containerId}');
                                const displayMax = document.getElementById('price-display-max-${containerId}');
                                
                                function updateDisplay() {
                                    if (displayMin) displayMin.textContent = minSlider.value;
                                    if (displayMax) displayMax.textContent = maxSlider.value;
                                }
                                
                                if (minSlider) minSlider.addEventListener('input', updateDisplay);
                                if (maxSlider) maxSlider.addEventListener('input', updateDisplay);
                                if (minInput) minInput.addEventListener('input', updateDisplay);
                                if (maxInput) maxInput.addEventListener('input', updateDisplay);
                            })();
                        </script>
                    `;
                }

                categoriesList.innerHTML = html;
            }
        } catch (error) {
            console.error('[ProductGrid] Failed to load categories:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(ProductGridWidget);
console.log('[ProductGrid] Enhanced widget registered.');
