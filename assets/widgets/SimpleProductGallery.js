class SimpleProductGalleryWidget extends WidgetBase {
    getName() { return 'simple_product_gallery'; }
    getTitle() { return 'Simple Product Gallery'; }
    getIcon() { return 'fas fa-images'; }
    getCategories() { return ['ecommerce']; }
    getKeywords() { return ['product', 'gallery', 'repeater', 'shop']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Product Gallery', placeholder: 'Enter title', label_block: true });
        this.addControl('columns', { type: 'select', label: 'Columns (Desktop)', default_value: '4', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] });
        this.addControl('columns_tablet', { type: 'select', label: 'Columns (Tablet)', default_value: '2', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }] });
        this.addControl('columns_mobile', { type: 'select', label: 'Columns (Mobile)', default_value: '1', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }] });

        this.addControl('products_list', {
            type: 'repeater',
            label: 'Products',
            fields: [
                { name: 'name', type: 'text', label: 'Product Name', default_value: 'Product Name', label_block: true },
                { name: 'image', type: 'media', label: 'Image' },
                { name: 'price', type: 'text', label: 'Price', default_value: '0' },
                { name: 'original_price', type: 'text', label: 'Original Price', default_value: '0' },
                { name: 'rating', type: 'text', label: 'Rating', default_value: '5' },
                { name: 'link', type: 'url', label: 'Link', placeholder: 'https://your-link.com' },
                { name: 'badge_text', type: 'text', label: 'Badge Text', placeholder: 'e.g. New, Hot' },
                { name: 'description', type: 'textarea', label: 'Short Description', placeholder: 'Enter short description' },
                { name: 'stock_status', type: 'text', label: 'Stock Status', default_value: 'In Stock', placeholder: 'In Stock / Out of Stock' }
            ],
            title_field: '{{{ name }}}',
            default_value: [
                { name: 'Product 1', price: 99, original_price: 120, rating: 5 },
                { name: 'Product 2', price: 149, original_price: 180, rating: 4 }
            ]
        });

        this.addControl('show_price', { type: 'switcher', label: 'Show Price', default_value: 'yes' });
        this.addControl('show_rating', { type: 'switcher', label: 'Show Rating', default_value: 'yes' });
        this.addControl('show_badge', { type: 'switcher', label: 'Show Badge', default_value: 'yes' });

        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('primary_color', { type: 'color', label: 'Primary Color', default_value: '#007EFC' });
        this.addControl('discount_badge_color', { type: 'color', label: 'Discount Badge Color', default_value: '#ff4444' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Product Gallery');
        const columns = this.getSetting('columns', '4') || '4';
        const columnsTablet = this.getSetting('columns_tablet', '2') || '2';
        const columnsMobile = this.getSetting('columns_mobile', '1') || '1';
        const showPrice = this.getSetting('show_price', 'yes');
        const showRating = this.getSetting('show_rating', 'yes');
        const showBadge = this.getSetting('show_badge', 'yes');
        const primaryColor = this.getSetting('primary_color', '#007EFC');
        const discountBadgeColor = this.getSetting('discount_badge_color', '#ff4444');
        const productsList = this.getSetting('products_list', []);

        const cssId = this.getSetting('css_id', '') || 'simple-product-gallery-' + Math.random().toString(36).substr(2, 9);

        const productsHtml = productsList.map(item => {
            const imageUrl = item.image && item.image.url ? item.image.url : 'https://placehold.co/400x400?text=No+Image';
            const hasPrice = item.price !== '' && item.price !== undefined && item.price !== null;
            const hasOriginalPrice = item.original_price !== '' && item.original_price !== undefined && item.original_price !== null;
            const hasRating = item.rating !== '' && item.rating !== undefined && item.rating !== null;

            const price = hasPrice ? parseFloat(item.price) : 0;
            const originalPrice = hasOriginalPrice ? parseFloat(item.original_price) : 0;
            const discount = (hasPrice && hasOriginalPrice && originalPrice > price) ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
            const rating = hasRating ? parseFloat(item.rating) : 0;
            const linkUrl = item.link && item.link.url ? item.link.url : '#';
            const badgeText = item.badge_text || '';

            return `
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff; transition: box-shadow 0.2s; position: relative;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                    ${showBadge === 'yes' && badgeText ? `<div style="position: absolute; top: 10px; left: 10px; background: ${discountBadgeColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; z-index: 1;">${badgeText}</div>` :
                    (discount > 0 ? `<div style="position: absolute; top: 10px; left: 10px; background: ${discountBadgeColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; z-index: 1;">${discount}% OFF</div>` : '')
                }
                    <a href="${linkUrl}" style="display: block; position: relative; aspect-ratio: 1; background: #f9fafb;">
                        <img src="${imageUrl}" alt="${this.escapeHtml(item.name)}" style="width: 100%; height: 100%; object-fit: contain;" loading="lazy">
                    </a>
                    <div style="padding: 15px;">
                        <a href="${linkUrl}" style="font-size: 16px; font-weight: 500; color: #1f2937; text-decoration: none; display: block; margin-bottom: 8px; line-height: 1.4; height: 40px; overflow: hidden;">${this.escapeHtml(item.name)}</a>
                        ${item.description ? `<div style="font-size: 14px; color: #6b7280; margin-bottom: 10px; line-height: 1.5;">${this.escapeHtml(item.description)}</div>` : ''}
                        ${showPrice === 'yes' && hasPrice ? `
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <div style="font-size: 18px; font-weight: 700; color: ${primaryColor};">
                                $${price.toFixed(2)}
                            </div>
                            ${hasOriginalPrice && originalPrice > price ? `<div style="font-size: 14px; color: #9ca3af; text-decoration: line-through;">$${originalPrice.toFixed(2)}</div>` : ''}
                        </div>` : ''}
                        ${showRating === 'yes' && hasRating ? this.renderStars(rating, primaryColor) : ''}
                        ${item.stock_status ?
                    `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6;">
                            <div style="font-size: 12px; color: ${item.stock_status.toLowerCase().includes('out') ? '#ef4444' : '#10b981'};">
                                ${item.stock_status === 'In Stock' ? '✓ ' : ''}${this.escapeHtml(item.stock_status)}
                            </div>
                        </div>` : ''}
                    </div>
                </div>`;
        }).join('');

        return `
            <div class="simple-product-gallery-widget" id="${cssId}">
                <style>
                    #${cssId} .gallery-grid {
                        display: grid;
                        grid-template-columns: repeat(${columns}, 1fr);
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    @media (max-width: 1024px) {
                        #${cssId} .gallery-grid {
                            grid-template-columns: repeat(${columnsTablet}, 1fr);
                        }
                    }
                    @media (max-width: 767px) {
                        #${cssId} .gallery-grid {
                            grid-template-columns: repeat(${columnsMobile}, 1fr);
                        }
                    }
                </style>
                <div class="container">
                    ${title ? `<h3 style="font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #111;">${title}</h3>` : ''}
                    <div class="gallery-grid">
                        ${productsHtml || '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #9ca3af;">No products added</div>'}
                    </div>
                </div>
            </div>`;
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(SimpleProductGalleryWidget);
console.log('[SimpleProductGallery] Widget registered.');
