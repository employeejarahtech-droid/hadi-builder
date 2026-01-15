class SingleProductWidget extends WidgetBase {
    getName() { return 'single_product'; }
    getTitle() { return 'Single Product Details'; }
    getIcon() { return 'fas fa-info-circle'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['product', 'details', 'single', 'commerce']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Product Source', tab: 'content' });

        this.addControl('source', {
            type: 'select',
            label: 'Source',
            default_value: 'current_query',
            options: [
                { value: 'current_query', label: 'Current Query (URL Parameter)' },
                { value: 'manual', label: 'Manual Selection' }
            ]
        });

        this.addControl('product_id', {
            type: 'text',
            label: 'Product ID',
            default_value: '',
            placeholder: 'e.g. 15',
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'manual' }]
            }
        });

        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.addControl('price_color', { type: 'color', label: 'Price Color', default_value: '#3b82f6' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const source = this.getSetting('source', 'current_query');
        const productId = this.getSetting('product_id', '');
        const buttonColor = this.getSetting('button_color', '#3b82f6');
        const priceColor = this.getSetting('price_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'single-product-' + Math.random().toString(36).substr(2, 9);
        const animation = this.getSetting('animation', 'none');

        let wrapperClasses = ['single-product-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);

        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${cssId}"`;
        wrapperAttributes += ` data-container-id="${cssId}"`;

        const loadingHtml = `
            <div style="max-width: 1400px; margin: 0 auto; padding: 40px; text-align: center; color: #666;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <div style="margin-top: 10px;">Loading product details...</div>
            </div>`;

        // Store config
        window[`singleProduct_${cssId}`] = {
            source, productId, buttonColor, priceColor,
            productSlug: this.getSetting('product_slug', '')
        };

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}>${loadingHtml}</div>`;
    }

    onContentRendered() {
        const containerId = this.$el.getAttribute('data-container-id');
        if (containerId) {
            setTimeout(() => {
                this.loadProduct(containerId);
            }, 100);
        }
    }

    async loadProduct(containerId, retryCount = 0) {
        console.log(`Loading product for container: ${containerId} (Attempt ${retryCount + 1})`);

        const container = document.getElementById(containerId);
        if (!container) {
            if (retryCount < 5) {
                console.warn(`Container ${containerId} not found, retrying in 200ms...`);
                setTimeout(() => this.loadProduct(containerId, retryCount + 1), 200);
                return;
            }
            console.error('Container not found after retries:', containerId);
            return;
        }

        const config = window[`singleProduct_${containerId}`];
        if (!config) {
            console.error('Config not found for:', containerId);
            container.innerHTML = '<div class="alert alert-error">Configuration error. Please refresh.</div>';
            return;
        }

        const { source, productId, buttonColor, priceColor, productSlug } = config;

        let targetId = productId;
        let queryType = 'id';

        if (productSlug) {
            targetId = productSlug;
            queryType = 'slug';
            console.log('Using configured productSlug:', productSlug);
        } else if (source === 'current_query') {
            // Try to get from URL path first for clean URLs
            const path = window.location.pathname;
            const pathSegments = path.split('/');
            const productIndex = pathSegments.indexOf('product');

            if (productIndex !== -1 && pathSegments[productIndex + 1]) {
                targetId = pathSegments[productIndex + 1];
                queryType = 'slug';
                console.log('Detected slug from URL:', targetId);
            } else {
                // Fallback to query param
                const urlParams = new URLSearchParams(window.location.search);
                targetId = urlParams.get('id');
                console.log('Detected ID from query:', targetId);
            }
        }

        if (!targetId) {
            console.warn('No target ID/Slug found');
            container.innerHTML = `<div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #cbd5e1; margin-bottom: 20px;"></i><br>
                Product identifier not found.<br>
                <small style="font-size: 12px; color: #94a3b8;">Path: ${window.location.pathname}</small>
            </div>`;
            return;
        }

        try {
            const baseUrl = window.CMS_ROOT || '';
            const queryParam = queryType === 'slug' ? `slug=${targetId}` : `id=${targetId}`;
            const fetchUrl = `${baseUrl}/api/get-products.php?${queryParam}`;
            console.log('Fetching:', fetchUrl);

            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API Response:', data);

            if (data.success && data.product) {
                this.renderProduct(container, data.product, buttonColor, priceColor, containerId);
            } else {
                container.innerHTML = `<div style="text-align: center; padding: 40px; color: #ef4444;">
                    Product not found in database.<br>
                    <small>ID/Slug: ${targetId}</small>
                </div>`;
            }
        } catch (e) {
            console.error('Failed to load product:', e);
            container.innerHTML = `<div style="text-align: center; padding: 40px; color: #ef4444;">
                Error loading product.<br>
                <small>${e.message}</small>
            </div>`;
        }
    }

    renderProduct(container, product, buttonColor, priceColor, containerId) {
        // Safe styling
        const price = parseFloat(product.price);
        const formattedPrice = window.EcommerceManager ? window.EcommerceManager.formatPrice(price) : `$${price.toFixed(2)}`;

        const productData = {
            id: `prod_${product.id}`,
            name: product.name,
            price: formattedPrice,
            image: product.image_url
        };
        const pJson = JSON.stringify(productData).replace(/"/g, '&quot;');

        const baseUrl = window.CMS_ROOT || '';

        // Gallery Logic
        let gallery = [];
        // Add main image first
        if (product.image_url) gallery.push(product.image_url);

        // Add additional images
        if (product.gallery_images) {
            try {
                const additional = JSON.parse(product.gallery_images);
                if (Array.isArray(additional)) {
                    gallery = [...gallery, ...additional];
                }
            } catch (e) {
                console.warn('Invalid gallery_images JSON', e);
            }
        }

        // If no images, use placeholder
        if (gallery.length === 0) gallery.push('');

        const mainImageHtml = gallery[0]
            ? `<div class="main-image" style="width: 100%; aspect-ratio: 1; background-image: url('${gallery[0]}'); background-size: cover; background-position: center; border-radius: 12px; border: 1px solid #f1f5f9; transition: background-image 0.3s;"></div>`
            : `<div style="width: 100%; aspect-ratio: 1; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 64px; border-radius: 12px; border: 1px solid #e2e8f0;"><i class="fas fa-box"></i></div>`;

        let galleryThumbnails = '';
        if (gallery.length > 1) {
            galleryThumbnails = `<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 15px;">`;
            gallery.forEach((img, idx) => {
                if (!img) return;
                galleryThumbnails += `
                    <div onclick="this.closest('.product-gallery').querySelector('.main-image').style.backgroundImage = 'url(${img})'" 
                        style="aspect-ratio: 1; background-image: url('${img}'); background-size: cover; background-position: center; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s;"
                        onmouseover="this.style.borderColor='${buttonColor}'"
                        onmouseout="this.style.borderColor='transparent'"
                    ></div>
                `;
            });
            galleryThumbnails += `</div>`;
        }

        const html = `
            <div class="container">
                <a href="${(window.CMS_SETTINGS && window.CMS_SETTINGS.shopUrl) ? window.CMS_SETTINGS.shopUrl : baseUrl + '/shop'}" style="display: inline-flex; align-items: center; gap: 8px; color: #64748b; text-decoration: none; margin-bottom: 30px; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='${buttonColor}'" onmouseout="this.style.color='#64748b'">
                    <i class="fas fa-arrow-left"></i> Back to Products
                </a>
                
                <div class="product-layout" style="display: grid; grid-template-columns: 1fr 1.2fr 380px; gap: 40px; align-items: start;">
                    <!-- Column 1: Gallery -->
                    <div class="product-gallery">
                        ${mainImageHtml}
                        ${galleryThumbnails}
                    </div>
                    
                    <!-- Column 2: Product Details -->
                    <div class="product-details" style="padding: 0;">
                        <h1 style="margin: 0 0 15px 0; font-size: 32px; font-weight: 700; line-height: 1.3; color: #1e293b;">${this.escapeHtml(product.name)}</h1>
                        
                        <div style="display: flex; gap: 10px; margin-bottom: 20px; font-size: 14px; color: #64748b;">
                            <span>Brand: <strong style="color: ${buttonColor}">ZTE</strong></span>
                            <span>|</span>
                            <span>Model: <strong>U60 Pro</strong></span>
                            <span>|</span>
                            <span>SKU: <strong>${product.sku || 'B0FNN7QBHP'}</strong></span>
                        </div>
                        
                        <div style="height: 1px; background: #e2e8f0; margin-bottom: 20px;"></div>

                        <!-- Mock Specifications based on request -->
                        <div class="product-specs" style="margin-bottom: 20px;">
                            <style>
                                .spec-row { display: grid; grid-template-columns: 200px 1fr; margin-bottom: 12px; font-size: 14px; }
                                .spec-label { font-weight: 600; color: #475569; }
                                .spec-value { color: #1e293b; }
                            </style>
                            <div class="spec-row"><div class="spec-label">Frequency band class</div><div class="spec-value">Dual-Band</div></div>
                            <div class="spec-row"><div class="spec-label">Wireless Standard</div><div class="spec-value">802.11.be (WiFi 7)</div></div>
                            <div class="spec-row"><div class="spec-label">Special features</div><div class="spec-value">10000mAh Battery, 27W Fast Charging, 64 Device Connections, NFC</div></div>
                            <div class="spec-row"><div class="spec-label">Support Users</div><div class="spec-value">64</div></div>
                            <div class="spec-row"><div class="spec-label">Battery</div><div class="spec-value">10,000 mAh</div></div>
                        </div>

                        <div style="height: 1px; background: #e2e8f0; margin-bottom: 20px;"></div>

                        <div style="font-size: 16px; line-height: 1.7; color: #475569;" class="product-description">
                            <h3 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">About this item</h3>
                            ${product.long_description ? product.long_description : this.escapeHtml(product.description || 'No description available for this product.')}
                        </div>
                    </div>

                    <!-- Column 3: Buy Box -->
                    <div class="product-buy-box" style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: sticky; top: 100px;">
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; align-items: baseline; gap: 10px;">
                                <div class="product-price-display" style="font-size: 32px; font-weight: 700; color: ${priceColor};">${formattedPrice}</div>
                                ${product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price)
                ? `<div style="text-decoration: line-through; color: #94a3b8; font-size: 16px;">${window.EcommerceManager ? window.EcommerceManager.formatPrice(parseFloat(product.regular_price)) : '$' + parseFloat(product.regular_price).toFixed(2)}</div>`
                : ''}
                            </div>
                            ${product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price)
                ? `<div style="color: #ef4444; font-size: 14px; font-weight: 600; margin-top: 5px;">-17% off</div>`
                : ''}
                            <div style="color: #64748b; font-size: 14px; margin-top: 5px;">Inclusive All Tax</div>
                        </div>

                        ${this.renderVariationsUI(product, buttonColor, containerId)}

                        <div style="margin-bottom: 20px;">
                            ${product.status === 'active'
                ? `<div style="color: #166534; font-size: 18px; font-weight: 600; margin-bottom: 5px;">In Stock</div>
                   <div style="color: #64748b; font-size: 14px;">4 Available in stock</div>`
                : `<div style="color: #991b1b; font-size: 18px; font-weight: 600;">Currently Unavailable</div>`
            }
                        </div>

                        ${(!(window.CMS_SETTINGS && window.CMS_SETTINGS.enable_cart === '0')) ? `
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">
                            <div style="display: flex; gap: 10px;">
                                <div style="width: 80px;">
                                    <select style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; font-weight: 600;">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                                <button class="add-to-cart-btn" onclick="if(window.EcommerceManager) { window.EcommerceManager.addItem(${pJson}); }" 
                                    style="background: #fcd34d; color: #0f172a; border: none; padding: 12px 20px; font-size: 16px; font-weight: 600; border-radius: 25px; cursor: pointer; transition: all 0.2s; flex: 1; text-align: center;"
                                    onmouseover="this.style.background='#fbbf24'" 
                                    onmouseout="this.style.background='#fcd34d'">
                                    Add to Cart
                                </button>
                            </div>
                             <button 
                                style="background: #f97316; color: #fff; border: none; padding: 12px 20px; font-size: 16px; font-weight: 600; border-radius: 25px; cursor: pointer; transition: all 0.2s; width: 100%; margin-top: 5px;"
                                onmouseover="this.style.background='#ea580c'" 
                                onmouseout="this.style.background='#f97316'">
                                Buy Now
                            </button>
                        </div>` : ''}

                        <div style="border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 20px;">
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Shipping Method</div>
                                <div style="font-weight: 600; color: #1e293b;">Standard Delivery</div>
                                <div style="font-size: 13px; color: #166534;">14 January - At 25 AED</div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i> Deliver To</div>
                                <div style="font-weight: 600; color: #3b82f6; cursor: pointer;">Dubai</div>
                            </div>
                            
                             <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; color: #64748b; margin-top: 20px;">
                                <div style="display: flex; gap: 5px; align-items: center;"><i class="fas fa-lock"></i> Secure Transaction</div>
                                <div style="display: flex; gap: 5px; align-items: center;"><i class="fas fa-undo"></i> 7 days Returnable</div>
                                <div style="display: flex; gap: 5px; align-items: center;"><i class="fas fa-truck"></i> E Zone Delivery</div>
                                <div style="display: flex; gap: 5px; align-items: center;"><i class="fas fa-money-bill"></i> Cash on Delivery</div>
                            </div>
                        </div>

                    </div>
                    <!-- End Buy Box -->

                </div>

                ${this.renderSimilarProducts(product, buttonColor)}

            </div>
            <style>
                @media (max-width: 1024px) {
                    #${container.id} .product-layout {
                        grid-template-columns: 1fr 1fr !important;
                    }
                    #${container.id} .product-buy-box {
                        grid-column: span 2;
                        position: static !important;
                        max-width: 600px;
                        margin: 0 auto;
                        width: 100%;
                    }
                }
                @media (max-width: 768px) {
                    #${container.id} .product-layout {
                        grid-template-columns: 1fr !important;
                        gap: 30px !important;
                    }
                    #${container.id} .product-buy-box {
                        grid-column: span 1;
                    }
                    #${container.id} .similar-products-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 480px) {
                    #${container.id} .similar-products-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            </style>
        `;

        container.innerHTML = html;

        // Load and render reviews
        this.loadReviews(product.id, containerId, buttonColor);
    }

    renderSimilarProducts(product, buttonColor) {
        if (!product.similar_products_data || product.similar_products_data.length === 0) return '';

        const baseUrl = window.CMS_ROOT || '';
        let html = `
        <div style="margin-top: 80px; padding-top: 60px; border-top: 1px solid #e2e8f0; margin-left: auto; margin-right: auto;">
            <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 30px; color: #1e293b; text-align: center;">You May Also Like</h2>
            <div class="similar-products-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px;">
        `;

        product.similar_products_data.forEach(item => {
            const price = parseFloat(item.price);
            const formattedPrice = window.EcommerceManager ? window.EcommerceManager.formatPrice(price) : `$${price.toFixed(2)}`;
            const imageUrl = item.image_url || 'https://via.placeholder.com/300x300';

            html += `
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: transform 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);"
                onmouseover="this.style.transform='translateY(-5px)'"
                onmouseout="this.style.transform='translateY(0)'">
                <a href="${baseUrl}/product/${item.slug}" style="text-decoration: none; color: inherit; display: block;">
                    <div style="aspect-ratio: 1; overflow: hidden; background: #f8fafc;">
                        <img src="${imageUrl}" alt="${this.escapeHtml(item.name)}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 15px;">
                        <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${this.escapeHtml(item.name)}">${this.escapeHtml(item.name)}</h3>
                        <div style="color: ${buttonColor}; font-weight: 700; font-size: 16px;">${formattedPrice}</div>
                    </div>
                </a>
            </div>
            `;
        });

        html += `</div></div>`;
        return html;
    }

    renderVariationsUI(product, buttonColor, cssId) {
        console.log('[SingleProduct] renderVariationsUI called');
        console.log('[SingleProduct] Product:', product);
        console.log('[SingleProduct] product.variations:', product.variations);
        console.log('[SingleProduct] product.attributes:', product.attributes);

        if (!product.variations || product.variations.length === 0) {
            console.warn('[SingleProduct] No variations found, returning empty string');
            return '';
        }

        // Find attributes used for variations
        let variationAttributes = [];
        try {
            const allAttrs = JSON.parse(product.attributes || '[]');
            console.log('[SingleProduct] Parsed attributes:', allAttrs);

            // Handle both flat and grouped attribute structures
            let flatAttrs = [];
            if (allAttrs.length > 0 && allAttrs[0].group_name) {
                // Grouped structure: [{group_name: "Size", attributes: [{...}]}]
                console.log('[SingleProduct] Detected grouped attribute structure');
                allAttrs.forEach(group => {
                    if (group.attributes && Array.isArray(group.attributes)) {
                        flatAttrs = flatAttrs.concat(group.attributes);
                    }
                });
            } else {
                // Flat structure: [{name: "Color", value: "Red|Blue", is_variation: true}]
                flatAttrs = allAttrs;
            }

            console.log('[SingleProduct] Flattened attributes:', flatAttrs);

            // Check if we have the "is_variation" flag mechanism.
            // Based on our implementation, attributes is an array of objects: { name, value, is_variation, ... }
            variationAttributes = flatAttrs.filter(a => a.is_variation === true || a.is_variation === 'true');
            console.log('[SingleProduct] Variation attributes:', variationAttributes);
        } catch (e) {
            console.error('Error parsing attributes for variations', e);
        }

        if (variationAttributes.length === 0) {
            console.warn('[SingleProduct] No variation attributes found (is_variation=true), returning empty string');
            return '';
        }

        let html = '<div class="product-variations-form" style="margin-bottom: 30px;">';

        // Store variations data globally for this widget instance to access in change handlers
        window[`productVariations_${cssId}`] = product.variations;
        window[`productAttributes_${cssId}`] = variationAttributes;
        window[`currentProduct_${cssId}`] = product; // Backup original

        variationAttributes.forEach((attr, idx) => {
            const attrName = attr.name;
            const values = attr.value.split('|').map(v => v.trim());

            html += `
                <div class="variation-row" style="margin-bottom: 15px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #334155;">${this.escapeHtml(attrName)}</label>
                    <select class="variation-select" data-attribute="${this.escapeHtml(attrName)}" data-widget-id="${cssId}" onchange="window.SingleProductWidget_onVariationChange(this)" style="width: 100%; max-width: 300px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 16px; color: #1e293b; background-color: white;">
                        <option value="">Choose an option</option>
                        ${values.map(val => `<option value="${this.escapeHtml(val)}">${this.escapeHtml(val)}</option>`).join('')}
                    </select>
                </div>
             `;
        });

        html += '</div>';

        // Add global handler if not exists
        if (!window.SingleProductWidget_onVariationChange) {
            window.SingleProductWidget_onVariationChange = function (select) {
                const widgetId = select.dataset.widgetId;
                const variations = window[`productVariations_${widgetId}`];
                const attributes = window[`productAttributes_${widgetId}`];
                const originalProduct = window[`currentProduct_${widgetId}`];

                if (!variations || !attributes) return;

                // Collect current selections
                const selects = document.querySelectorAll(`#${widgetId} .variation-select`);
                let currentSelection = {};
                let allSelected = true;

                selects.forEach(sel => {
                    if (!sel.value) allSelected = false;
                    currentSelection[sel.dataset.attribute] = sel.value;
                });

                const addToCartBtn = document.querySelector(`#${widgetId} button.add-to-cart-btn`);
                const priceEl = document.querySelector(`#${widgetId} .product-price-display`);
                // Main image update - trickier, need scoped selector
                const widgetContainer = document.getElementById(widgetId);
                const mainImageEl = widgetContainer.querySelector('.main-image');

                if (!allSelected) {
                    if (addToCartBtn) {
                        addToCartBtn.disabled = true;
                        addToCartBtn.style.opacity = '0.5';
                        addToCartBtn.innerHTML = 'Select Options';
                    }
                    // Reset to base price
                    if (priceEl && originalProduct) {
                        // Assuming window.EcommerceManager exists, else fallback
                        const p = parseFloat(originalProduct.price);
                        priceEl.textContent = window.EcommerceManager ? window.EcommerceManager.formatPrice(p) : '$' + p.toFixed(2);
                    }
                    if (mainImageEl && originalProduct) {
                        mainImageEl.style.backgroundImage = `url('${originalProduct.image_url}')`;
                    }
                    return;
                }

                // Find matching variation
                const match = variations.find(v => {
                    const varAttrs = v.attributes; // Obj: { "Color": "Red", "Size": "M" }
                    // Check if every key in currentSelection matches varAttrs
                    return Object.keys(currentSelection).every(key => varAttrs[key] === currentSelection[key]);
                });

                if (match) {
                    console.log('Found Variation:', match);
                    if (addToCartBtn) {
                        addToCartBtn.disabled = false;
                        addToCartBtn.style.opacity = '1';
                        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';

                        // Update click handler to add specific Variation (TODO: Modify EcommerceManager to support variations or override ID)
                        // For now, we update the pJson used in the button using data attribute or re-binding?
                        // Easiest is to update the JSON object stored on the button or re-write the onclick attribute.

                        const newItem = {
                            id: `var_${match.id}`, // Distinct ID for cart
                            name: `${originalProduct.name} - ${Object.values(currentSelection).join(', ')}`,
                            price: match.price, // Already formatted? No, raw float usually.
                            image: match.image || originalProduct.image_url
                        };

                        // Re-bind onclick
                        const jsonStr = JSON.stringify(newItem).replace(/"/g, '&quot;');
                        addToCartBtn.setAttribute('onclick', `if(window.EcommerceManager) { window.EcommerceManager.addItem(${jsonStr}); }`);
                    }

                    if (priceEl) {
                        const p = parseFloat(match.price);
                        priceEl.textContent = window.EcommerceManager ? window.EcommerceManager.formatPrice(p) : '$' + p.toFixed(2);
                    }

                    if (mainImageEl && match.image) {
                        mainImageEl.style.backgroundImage = `url('${match.image}')`;
                    }

                } else {
                    console.warn('No matching variation found.');
                    if (addToCartBtn) {
                        addToCartBtn.disabled = true;
                        addToCartBtn.innerHTML = 'Unavailable';
                    }
                }
            };
        }

        return html;
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

    async loadReviews(productId, containerId, buttonColor) {
        const baseUrl = window.CMS_ROOT || '';
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create reviews container
        const reviewsContainer = document.createElement('div');
        reviewsContainer.id = `reviews-${productId}`;
        reviewsContainer.style.cssText = 'margin-top: 60px; padding-top: 60px; border-top: 1px solid #e2e8f0;';
        container.appendChild(reviewsContainer);

        try {
            const response = await fetch(`${baseUrl}/api/get-reviews.php?product_id=${productId}&limit=5`);
            const data = await response.json();

            if (data.success) {
                this.renderReviews(reviewsContainer, data, productId, buttonColor);
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
        }
    }

    renderReviews(container, data, productId, buttonColor) {
        const { reviews, stats } = data;
        const avgRating = stats.average_rating || 0;
        const totalReviews = stats.total_reviews || 0;

        let html = `
            <div style="max-width: 1200px; margin: 0 auto;">
                <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 30px; color: #1e293b;">Customer Reviews</h2>
                
                <!-- Rating Summary -->
                <div style="display: grid; grid-template-columns: 300px 1fr; gap: 40px; margin-bottom: 40px; padding: 30px; background: #f8fafc; border-radius: 12px;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${avgRating.toFixed(1)}</div>
                        <div style="margin-bottom: 10px;">${this.renderStars(avgRating, 24)}</div>
                        <div style="font-size: 14px; color: #64748b;">${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}</div>
                    </div>
                    
                    <div>
                        ${this.renderRatingBreakdown(stats.rating_breakdown, totalReviews, buttonColor)}
                    </div>
                </div>

                <!-- Review Form -->
                <div style="margin-bottom: 40px; padding: 30px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1e293b;">Write a Review</h3>
                    ${this.renderReviewForm(productId, buttonColor)}
                </div>

                <!-- Reviews List -->
                <div id="reviews-list-${productId}">
                    ${reviews.length > 0 ? reviews.map(review => this.renderReview(review)).join('') : '<p style="text-align: center; color: #64748b; padding: 40px;">No reviews yet. Be the first to review!</p>'}
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.attachReviewFormHandler(productId, buttonColor);
    }

    renderStars(rating, size = 16) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let html = '<div style="display: inline-flex; gap: 2px;">';

        for (let i = 0; i < fullStars; i++) {
            html += `<i class="fas fa-star" style="color: #fbbf24; font-size: ${size}px;"></i>`;
        }

        if (hasHalfStar) {
            html += `<i class="fas fa-star-half-alt" style="color: #fbbf24; font-size: ${size}px;"></i>`;
        }

        for (let i = 0; i < emptyStars; i++) {
            html += `<i class="far fa-star" style="color: #d1d5db; font-size: ${size}px;"></i>`;
        }

        html += '</div>';
        return html;
    }

    renderRatingBreakdown(breakdown, total, buttonColor) {
        let html = '';
        for (let i = 5; i >= 1; i--) {
            const count = breakdown[i] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            html += `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <span style="font-size: 14px; color: #64748b; width: 60px;">${i} stars</span>
                    <div style="flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: ${buttonColor}; width: ${percentage}%;"></div>
                    </div>
                    <span style="font-size: 14px; color: #64748b; width: 40px; text-align: right;">${count}</span>
                </div>
            `;
        }
        return html;
    }

    renderReviewForm(productId, buttonColor) {
        return `
            <form id="review-form-${productId}" style="display: grid; gap: 20px;">
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1e293b;">Your Rating *</label>
                    <div class="star-rating" id="star-rating-${productId}" style="display: flex; gap: 4px; cursor: pointer;">
                        ${[1, 2, 3, 4, 5].map(i => `<i class="far fa-star" data-rating="${i}" style="font-size: 28px; color: #d1d5db; transition: color 0.2s;"></i>`).join('')}
                    </div>
                    <input type="hidden" id="rating-input-${productId}" name="rating" value="0">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1e293b;">Name *</label>
                        <input type="text" id="name-input-${productId}" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1e293b;">Email *</label>
                        <input type="email" id="email-input-${productId}" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
                    </div>
                </div>
                
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1e293b;">Review Title</label>
                    <input type="text" id="title-input-${productId}" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
                </div>
                
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1e293b;">Your Review *</label>
                    <textarea id="review-input-${productId}" required rows="4" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
                </div>
                
                <div id="review-message-${productId}"></div>
                
                <button type="submit" style="padding: 14px 28px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    Submit Review
                </button>
            </form>
        `;
    }

    renderReview(review) {
        const date = new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        return `
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 16px; background: #fff;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div>
                        <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">${this.escapeHtml(review.user_name)}</div>
                        ${this.renderStars(review.rating, 16)}
                    </div>
                    <div style="font-size: 14px; color: #64748b;">${date}</div>
                </div>
                
                ${review.title ? `<h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #1e293b;">${this.escapeHtml(review.title)}</h4>` : ''}
                
                <p style="color: #475569; line-height: 1.6; margin: 0;">${this.escapeHtml(review.review_text)}</p>
                
                ${review.verified_purchase ? '<div style="margin-top: 12px; display: inline-block; padding: 4px 12px; background: #dcfce7; color: #166534; border-radius: 4px; font-size: 12px; font-weight: 500;"><i class="fas fa-check-circle"></i> Verified Purchase</div>' : ''}
            </div>
        `;
    }

    attachReviewFormHandler(productId, buttonColor) {
        const form = document.getElementById(`review-form-${productId}`);
        const starRating = document.getElementById(`star-rating-${productId}`);
        const ratingInput = document.getElementById(`rating-input-${productId}`);

        if (!form || !starRating) return;

        // Star rating interaction
        const stars = starRating.querySelectorAll('i');
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    s.className = i <= index ? 'fas fa-star' : 'far fa-star';
                    s.style.color = i <= index ? '#fbbf24' : '#d1d5db';
                });
            });

            star.addEventListener('click', () => {
                const rating = index + 1;
                ratingInput.value = rating;
                stars.forEach((s, i) => {
                    s.className = i < rating ? 'fas fa-star' : 'far fa-star';
                    s.style.color = i < rating ? '#fbbf24' : '#d1d5db';
                });
            });
        });

        starRating.addEventListener('mouseleave', () => {
            const currentRating = parseInt(ratingInput.value) || 0;
            stars.forEach((s, i) => {
                s.className = i < currentRating ? 'fas fa-star' : 'far fa-star';
                s.style.color = i < currentRating ? '#fbbf24' : '#d1d5db';
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const messageDiv = document.getElementById(`review-message-${productId}`);
            const submitBtn = form.querySelector('button[type="submit"]');

            const formData = {
                product_id: productId,
                user_name: document.getElementById(`name-input-${productId}`).value,
                user_email: document.getElementById(`email-input-${productId}`).value,
                rating: parseInt(ratingInput.value),
                title: document.getElementById(`title-input-${productId}`).value,
                review_text: document.getElementById(`review-input-${productId}`).value
            };

            if (formData.rating === 0) {
                messageDiv.innerHTML = '<div style="padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 6px;">Please select a star rating</div>';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                const baseUrl = window.CMS_ROOT || '';
                const response = await fetch(`${baseUrl}/api/submit-review.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    messageDiv.innerHTML = '<div style="padding: 12px; background: #dcfce7; color: #166534; border-radius: 6px;"><i class="fas fa-check-circle"></i> Review submitted successfully!</div>';

                    // Create new review object
                    const newReview = {
                        user_name: formData.user_name,
                        rating: formData.rating,
                        title: formData.title,
                        review_text: formData.review_text,
                        created_at: new Date().toISOString(),
                        verified_purchase: false,
                        helpful_count: 0
                    };

                    // Add review to the list instantly
                    const reviewsList = document.getElementById(`reviews-list-${productId}`);
                    if (reviewsList) {
                        // Check if there's a "no reviews" message
                        const noReviewsMsg = reviewsList.querySelector('p');
                        if (noReviewsMsg && noReviewsMsg.textContent.includes('No reviews yet')) {
                            reviewsList.innerHTML = '';
                        }

                        // Prepend new review
                        reviewsList.insertAdjacentHTML('afterbegin', this.renderReview(newReview));
                    }

                    // Reset form
                    form.reset();
                    ratingInput.value = 0;
                    stars.forEach(s => {
                        s.className = 'far fa-star';
                        s.style.color = '#d1d5db';
                    });

                    // Scroll to the new review
                    setTimeout(() => {
                        reviewsList.firstElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    const errors = data.errors ? data.errors.join('<br>') : data.error;
                    messageDiv.innerHTML = `<div style="padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 6px;">${errors}</div>`;
                }
            } catch (error) {
                messageDiv.innerHTML = '<div style="padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 6px;">Failed to submit review. Please try again.</div>';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            }
        });
    }
}


window.elementorWidgetManager.registerWidget(SingleProductWidget);
