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
            <div style="padding: 40px; text-align: center; color: #666;">
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
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <a href="${(window.CMS_SETTINGS && window.CMS_SETTINGS.shopUrl) ? window.CMS_SETTINGS.shopUrl : baseUrl + '/shop'}" style="display: inline-flex; align-items: center; gap: 8px; color: #64748b; text-decoration: none; margin-bottom: 30px; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='${buttonColor}'" onmouseout="this.style.color='#64748b'">
                    <i class="fas fa-arrow-left"></i> Back to Products
                </a>
                
                <div class="product-layout" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: start;">
                    <div class="product-gallery">
                        ${mainImageHtml}
                        ${galleryThumbnails}
                    </div>
                    
                    <div style="padding-top: 10px;">
                        <h1 style="margin: 0 0 15px 0; font-size: 42px; font-weight: 800; line-height: 1.1; color: #1e293b; letter-spacing: -0.025em;">${this.escapeHtml(product.name)}</h1>
                        
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                            <div style="display: flex; flex-direction: column;">
                                ${product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price)
                ? `<div style="text-decoration: line-through; color: #94a3b8; font-size: 18px; margin-bottom: -4px;">${window.EcommerceManager ? window.EcommerceManager.formatPrice(parseFloat(product.regular_price)) : '$' + parseFloat(product.regular_price).toFixed(2)}</div>`
                : ''}
                                <div class="product-price-display" style="font-size: 32px; font-weight: 700; color: ${priceColor};">${formattedPrice}</div>
                            </div>
                            
                            ${product.status === 'active'
                ? `<span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; align-self: flex-start; margin-top: 8px;">In Stock</span>`
                : `<span style="background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; align-self: flex-start; margin-top: 8px;">Unavailable</span>`
            }
                        </div>
                        
                        <div style="font-size: 18px; line-height: 1.7; color: #475569; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;" class="product-description">
                            ${product.long_description ? product.long_description : this.escapeHtml(product.description || 'No description available for this product.')}
                        </div>

                        ${this.renderVariationsUI(product, buttonColor, containerId)}

                        <div style="display: flex; gap: 20px; align-items: center; margin-top: 20px;">
                            ${(!(window.CMS_SETTINGS && window.CMS_SETTINGS.enable_cart === '0')) ? `
                            <button class="add-to-cart-btn" onclick="if(window.EcommerceManager) { window.EcommerceManager.addItem(${pJson}); }" 
                                style="background: ${buttonColor}; color: #fff; border: none; padding: 18px 48px; font-size: 18px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s; box-shadow: 0 10px 20px -10px ${buttonColor}80; flex: 1; max-width: 300px; display: flex; align-items: center; justify-content: center; gap: 10px;"
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 20px 25px -15px ${buttonColor}80'" 
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 20px -10px ${buttonColor}80'">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>` : ''}
                            
                            <button style="width: 54px; height: 54px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: all 0.2s;"
                                onmouseover="this.style.borderColor='${buttonColor}'; this.style.color='${buttonColor}'" 
                                onmouseout="this.style.borderColor='#e2e8f0'; this.style.color='#64748b'">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
                </div>

                ${this.renderSimilarProducts(product, buttonColor)}

            </div>
            <style>
                @media (max-width: 960px) {
                    #${container.id} .product-layout {
                        grid-template-columns: 1fr !important;
                        gap: 30px !important;
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
    }

    renderSimilarProducts(product, buttonColor) {
        if (!product.similar_products_data || product.similar_products_data.length === 0) return '';

        const baseUrl = window.CMS_ROOT || '';
        let html = `
        <div style="margin-top: 80px; padding-top: 60px; border-top: 1px solid #e2e8f0; max-width: 1200px; margin-left: auto; margin-right: auto; padding-left: 20px; padding-right: 20px;">
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
}

window.elementorWidgetManager.registerWidget(SingleProductWidget);
