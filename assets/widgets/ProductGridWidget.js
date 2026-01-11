class ProductGridWidget extends WidgetBase {
    getName() { return 'product_grid'; }
    getTitle() { return 'Product Grid'; }
    getIcon() { return 'fas fa-th'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['product', 'grid', 'catalog']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Our Products', placeholder: 'Enter title', label_block: true });
        this.addControl('columns', { type: 'select', label: 'Columns', default_value: '3', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] });

        this.addControl('source', {
            type: 'select',
            label: 'Product Source',
            default_value: 'dynamic',
            options: [
                { value: 'dynamic', label: 'Dynamic (From Database)' },
                { value: 'manual', label: 'Manual (Custom Products)' }
            ]
        });

        this.addControl('details_page_url', {
            type: 'text',
            label: 'Details Page URL',
            default_value: '',
            placeholder: '/product-details',
            label_block: true,
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'dynamic' }]
            }
        });

        this.addControl('limit', {
            type: 'slider',
            label: 'Products Limit',
            default_value: { size: 6, unit: '' },
            range: { min: 1, max: 50, step: 1 },
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'dynamic' }]
            }
        });

        this.addControl('posts_per_page', {
            type: 'number',
            label: 'Posts Per Page',
            default_value: 6,
            min: 1,
            max: 50,
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'dynamic' }]
            }
        });

        this.addControl('pagination_type', {
            type: 'select',
            label: 'Pagination',
            default_value: 'numbers',
            options: [
                { value: 'none', label: 'None' },
                { value: 'numbers', label: 'Numbers' },
                { value: 'load_more', label: 'Load More' }
            ],
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'dynamic' }]
            }
        });

        // Products Repeater (only for manual mode)
        this.addControl('products', {
            type: 'repeater',
            label: 'Products',
            fields: [
                { name: 'name', label: 'Product Name', type: 'text', default_value: 'New Product' },
                { name: 'price', label: 'Price (numeric value)', type: 'text', default_value: '10.00', placeholder: '10.00' },
                { name: 'image', label: 'Image', type: 'media', default_value: { url: '' } },
                { name: 'link', label: 'Link', type: 'text', default_value: '' }
            ],
            default_value: [
                { name: 'Product 1', price: '10.00', image: { url: '' }, link: '' },
                { name: 'Product 2', price: '20.00', image: { url: '' }, link: '' },
                { name: 'Product 3', price: '30.00', image: { url: '' }, link: '' }
            ],
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'manual' }]
            }
        });

        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.addControl('pagination_color', { type: 'color', label: 'Pagination Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        console.log('[ProductGrid] Render called!');
        const title = this.getSetting('title', 'Our Products');
        // ... (rest of settings) ...
        const columns = this.getSetting('columns', '3');
        const source = this.getSetting('source', 'dynamic');
        // ... ensure you copy all settings ...
        const limit = this.getSetting('limit', { size: 6 });
        const postsPerPage = this.getSetting('posts_per_page', 6);
        const paginationType = this.getSetting('pagination_type', 'numbers');
        const productsList = this.getSetting('products', []);
        const buttonColor = this.getSetting('button_color', '#3b82f6');
        const paginationColor = this.getSetting('pagination_color', '#3b82f6');
        const detailsPageUrl = this.getSetting('details_page_url', '');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'product-grid-' + Math.random().toString(36).substr(2, 9);
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };

        // Store config for this instance
        window[`productGrid_${cssId}`] = {
            source, limit, manualProducts: productsList, buttonColor, columns, postsPerPage, paginationType, paginationColor, title, detailsPageUrl
        };

        // Initialize with polling to ensure DOM is ready
        this.waitForContainer(cssId);

        let wrapperClasses = ['product-grid-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);
        let wrapperAttributes = ` data-widget-type="product_grid"`; // Debug attribute
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        // ... rest of wrapper setup ...
        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        const loadingHtml = `<div><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3><div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px;"><div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #666;"><i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i><div style="margin-top: 10px;">Loading products... (Rendered)</div><div class="loading-status" style="margin-top:5px; font-size:12px; color:#999;">Initializing...</div></div></div></div>`;

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${loadingHtml}</div>`;
    }

    waitForContainer(containerId, attempts = 0) {
        const container = document.getElementById(containerId);
        if (container) {
            console.log(`[ProductGrid] Container ${containerId} found after ${attempts} attempts`);
            this.loadProducts(containerId, 1);
        } else if (attempts < 20) {
            // Retry every 100ms for 2 seconds
            setTimeout(() => this.waitForContainer(containerId, attempts + 1), 100);
        } else {
            console.error(`[ProductGrid] timeout: Container ${containerId} not found in DOM`);
        }
    }

    async loadProducts(containerId, page = 1) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Helper to update status text
        const setStatus = (msg) => {
            const statusEl = container.querySelector('.loading-status');
            if (statusEl) statusEl.textContent = msg;
        };

        setStatus('Container Found. Initializing...');

        const config = window[`productGrid_${containerId}`];
        if (!config) {
            setStatus('Error: Config missing');
            return;
        }

        const { source, limit, manualProducts, buttonColor, columns, postsPerPage, paginationType, paginationColor, title, detailsPageUrl } = config;

        let productsData = [];
        let totalPages = 1;

        if (source === 'dynamic') {
            try {
                // Use posts_per_page for dynamic limit if set, otherwise use limit slider
                let effectiveLimit = postsPerPage || (limit.size || 6);

                // Apply global shop setting for products per page if available
                if (window.CMS_SETTINGS && window.CMS_SETTINGS.products_per_page) {
                    effectiveLimit = parseInt(window.CMS_SETTINGS.products_per_page);
                }
                const baseUrl = window.CMS_ROOT || ''; // Use CMS_ROOT for path resolution
                const fetchUrl = `${baseUrl}/api/get-products.php?page=${page}&limit=${effectiveLimit}`;

                setStatus(`Fetching: ${fetchUrl}`);
                console.log('[ProductGrid] Fetching:', fetchUrl);

                const response = await fetch(fetchUrl);
                setStatus(`HTTP Status: ${response.status}`);
                console.log('[ProductGrid] Response Status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }

                const text = await response.text();
                // setStatus('Parsing JSON...');

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('[ProductGrid] JSON Parse Error:', e);
                    throw new Error('Invalid JSON Response');
                }

                if (data.success && data.products) {
                    productsData = data.products;
                    totalPages = data.total_pages || 1;
                    setStatus(`Loaded ${productsData.length} products. Rendering...`);
                    console.log('[ProductGrid] Loaded products (Full Data):', productsData);
                } else {
                    setStatus('API returned success=false');
                    console.warn('[ProductGrid] API returned failed or empty:', data);
                }
            } catch (e) {
                console.error('[ProductGrid] Failed to load products:', e);
                const errorHtml = `<div><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3><div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px;"><div style="grid-column: 1/-1; padding: 20px; text-align: center; color: #ef4444;">Failed to load products: ${e.message}</div></div></div>`;
                container.innerHTML = errorHtml;
                return;
            }
        } else {
            productsData = Array.isArray(manualProducts) ? manualProducts : [];
            totalPages = 1;
        }

        try {
            const products = productsData.map((item, i) => {
                const imageUrl = source === 'dynamic'
                    ? (item.image_url || '')
                    : (item.image && item.image.url ? item.image.url : '');

                // Format price using EcommerceManager for dynamic currency
                // Sanitize price (remove currency symbols for parsing)
                const rawPrice = String(item.price || '0').replace(/[^0-9.-]+/g, '');
                const priceValue = parseFloat(rawPrice) || 0;

                let formattedPrice;
                if (window.EcommerceManager) {
                    formattedPrice = window.EcommerceManager.formatPrice(priceValue);
                } else {
                    formattedPrice = `$${priceValue.toFixed(2)}`;
                }

                const pData = {
                    id: source === 'dynamic' ? item.id : `grid_prod_${i}_${Math.random().toString(36).substr(2, 5)}`,
                    name: item.name || `Product ${i + 1}`,
                    price: formattedPrice,
                    image: imageUrl
                };
                const pJson = JSON.stringify(pData).replace(/"/g, '&quot;');

                // Link logic
                let linkUrl = '#';
                if (source === 'dynamic') {
                    const baseUrl = window.CMS_ROOT || '';
                    if (item.slug) {
                        linkUrl = `${baseUrl}/product/${item.slug}`;
                    } else if (detailsPageUrl) {
                        linkUrl = `${detailsPageUrl}?id=${item.id}`;
                    } else {
                        linkUrl = `${baseUrl}/product/${item.id}`;
                    }
                } else if (source === 'manual' && item.link) {
                    linkUrl = item.link;
                }

                const imageStyle = imageUrl
                    ? `background-image: url('${imageUrl}'); background-size: cover; background-position: center;`
                    : `background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #666; font-size: 32px;`;

                const imageContent = imageUrl ? '' : '<i class="fas fa-box"></i>';

                const imageHtml = `<a href="${linkUrl}" style="display: block; aspect-ratio: 1; ${imageStyle} text-decoration: none;">${imageContent}</a>`;

                return `<div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
                    ${imageHtml}
                    <div style="padding: 15px; flex: 1; display: flex; flex-direction: column;">
                        <a href="${linkUrl}" style="font-size: 16px; font-weight: 700; margin-bottom: 5px; text-decoration: none; color: inherit; display: block;">${this.escapeHtml(pData.name)}</a>
                        <div style="font-size: 18px; font-weight: 700; color: ${buttonColor}; margin-bottom: 10px;">${this.escapeHtml(pData.price)}</div>
                        ${(!(window.CMS_SETTINGS && window.CMS_SETTINGS.enable_cart === '0')) ?
                        `<button onclick="if(window.EcommerceManager) { window.EcommerceManager.addItem(${pJson}); }" style="margin-top: auto; width: 100%; background: ${buttonColor}15; color: ${buttonColor}; border: none; padding: 8px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Add to Cart</button>` : ''}
                    </div>
                </div>`;
            }).join(''); // Ensure array is joined to string

            const productsHtml = products || '<div style="grid-column: 1/-1; padding: 20px; text-align: center;">No products available</div>';

            // Generate Pagination HTML
            let paginationHtml = '';
            if (source === 'dynamic' && paginationType === 'numbers' && totalPages > 1) {
                paginationHtml = `<div style="margin-top: 30px; display: flex; justify-content: center; gap: 8px;">`;

                // Previous Button
                if (page > 1) {
                    paginationHtml += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().changePage('${containerId}', ${page - 1})" style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; border-radius: 4px;">&laquo;</button>`;
                }

                // Page Numbers
                for (let i = 1; i <= totalPages; i++) {
                    const activeStyle = i === page ? `background: ${paginationColor}; color: #fff; border-color: ${paginationColor};` : `background: #fff; color: #333; border: 1px solid #e2e8f0;`;
                    paginationHtml += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().changePage('${containerId}', ${i})" style="padding: 8px 12px; cursor: pointer; border-radius: 4px; ${activeStyle}">${i}</button>`;
                }

                // Next Button
                if (page < totalPages) {
                    paginationHtml += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('product_grid'))().changePage('${containerId}', ${page + 1})" style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; border-radius: 4px;">&raquo;</button>`;
                }

                paginationHtml += `</div>`;
            }

            const finalHtml = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3>
                <div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px;">${productsHtml}</div>
                ${paginationHtml}
            </div>`;
            container.innerHTML = finalHtml;
        } catch (renderError) {
            console.error('[ProductGrid] Render Error:', renderError);
            setStatus(`Render Error: ${renderError.message}`);
        }
    }

    changePage(containerId, page) {
        this.loadProducts(containerId, page);
        // Scroll to top of widget
        const container = document.getElementById(containerId);
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(ProductGridWidget);
console.log('[ProductGrid] Script file executed and widget registered.');
