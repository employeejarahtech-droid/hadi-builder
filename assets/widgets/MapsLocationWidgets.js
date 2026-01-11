// GoogleMap, Mapbox, Location, StoreLocator, Directions widgets

class GoogleMapWidget extends WidgetBase {
    getName() { return 'google_map'; }
    getTitle() { return 'Google Map'; }
    getIcon() { return 'fa fa-map-marked-alt'; }
    getCategories() { return ['maps']; }
    getKeywords() { return ['google', 'map', 'location']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('address', {
            type: 'text',
            label: 'Address',
            default_value: 'New York, NY',
            placeholder: 'Enter address',
            label_block: true
        });
        this.addControl('zoom', {
            type: 'text',
            label: 'Zoom Level',
            default_value: '12',
            placeholder: 'e.g., 12'
        });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        // Height handled globally
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const address = this.getSetting('address', 'New York, NY');
        const zoom = this.getSetting('zoom', '12');

        const contentHtml = `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; height: 100%;">
                <div style="background: #f3f4f6; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666;">
                    <i class="fa fa-map-marked-alt" style="font-size: 64px; margin-bottom: 15px;"></i>
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">Google Maps</div>
                    <div style="font-size: 14px;">${this.escapeHtml(address)}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">Zoom: ${this.escapeHtml(zoom)}</div>
                </div>
            </div>
        `;

        return this.wrapWithAdvancedSettings(contentHtml, 'google-map-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

class MapboxWidget extends WidgetBase {
    getName() { return 'mapbox'; }
    getTitle() { return 'Mapbox'; }
    getIcon() { return 'fa fa-map'; }
    getCategories() { return ['maps']; }
    getKeywords() { return ['mapbox', 'map', 'location']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('latitude', {
            type: 'text',
            label: 'Latitude',
            default_value: '40.7128',
            placeholder: 'e.g., 40.7128'
        });
        this.addControl('longitude', {
            type: 'text',
            label: 'Longitude',
            default_value: '-74.0060',
            placeholder: 'e.g., -74.0060'
        });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        // Height handled globally
        this.addControl('map_style', {
            type: 'select',
            label: 'Map Style',
            default_value: 'streets',
            options: [
                { value: 'streets', label: 'Streets' },
                { value: 'satellite', label: 'Satellite' },
                { value: 'dark', label: 'Dark' }
            ]
        });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const latitude = this.getSetting('latitude', '40.7128');
        const longitude = this.getSetting('longitude', '-74.0060');
        const mapStyle = this.getSetting('map_style', 'streets');

        const contentHtml = `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; height: 100%;">
                <div style="background: linear-gradient(135deg, #4264fb 0%, #6c8aff 100%); height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
                    <i class="fa fa-map" style="font-size: 64px; margin-bottom: 15px;"></i>
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">Mapbox</div>
                    <div style="font-size: 14px; opacity: 0.9;">Lat: ${this.escapeHtml(latitude)}, Lng: ${this.escapeHtml(longitude)}</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Style: ${this.escapeHtml(mapStyle)}</div>
                </div>
            </div>
        `;

        return this.wrapWithAdvancedSettings(contentHtml, 'mapbox-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

class LocationWidget extends WidgetBase {
    getName() { return 'location'; }
    getTitle() { return 'Location'; }
    getIcon() { return 'fa fa-map-marker-alt'; }
    getCategories() { return ['maps']; }
    getKeywords() { return ['location', 'address', 'place']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Our Location', placeholder: 'Enter title', label_block: true });
        this.addControl('address', { type: 'textarea', label: 'Address', default_value: '123 Main Street\nNew York, NY 10001', placeholder: 'Enter address', label_block: true });
        this.addControl('phone', { type: 'text', label: 'Phone', default_value: '+1 (555) 123-4567', placeholder: 'Enter phone' });
        this.addControl('email', { type: 'text', label: 'Email', default_value: 'info@example.com', placeholder: 'Enter email' });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('icon_color', { type: 'color', label: 'Icon Color', default_value: '#ef4444' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Our Location');
        const address = this.getSetting('address', '123 Main Street\nNew York, NY 10001');
        const phone = this.getSetting('phone', '+1 (555) 123-4567');
        const email = this.getSetting('email', 'info@example.com');
        const iconColor = this.getSetting('icon_color', '#ef4444');

        const contentHtml = `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;">
                <h3 style="font-size: 22px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="display: flex; gap: 15px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fa fa-map-marker-alt" style="color: ${iconColor}; font-size: 18px;"></i>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">ADDRESS</div>
                            <div style="font-size: 14px; line-height: 1.6; white-space: pre-line;">${this.escapeHtml(address)}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fa fa-phone" style="color: ${iconColor}; font-size: 18px;"></i>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">PHONE</div>
                            <div style="font-size: 14px;">${this.escapeHtml(phone)}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}15; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fa fa-envelope" style="color: ${iconColor}; font-size: 18px;"></i>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">EMAIL</div>
                            <div style="font-size: 14px;">${this.escapeHtml(email)}</div>
                        </div>
                    </div>
                </div>
            </div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'location-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

class StoreLocatorWidget extends WidgetBase {
    getName() { return 'store_locator'; }
    getTitle() { return 'Store Locator'; }
    getIcon() { return 'fa fa-store'; }
    getCategories() { return ['maps']; }
    getKeywords() { return ['store', 'locator', 'finder']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Find a Store', placeholder: 'Enter title', label_block: true });
        this.addControl('placeholder', { type: 'text', label: 'Search Placeholder', default_value: 'Enter your location', placeholder: 'Enter placeholder', label_block: true });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Find a Store');
        const placeholder = this.getSetting('placeholder', 'Enter your location');
        const buttonColor = this.getSetting('button_color', '#3b82f6');

        const stores = [{ name: 'Downtown Store', address: '123 Main St, New York', distance: '0.5 mi' }, { name: 'Uptown Store', address: '456 Park Ave, New York', distance: '1.2 mi' }].map(store => `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; cursor: pointer; transition: all 0.2s;"
                 onmouseover="this.style.borderColor='${buttonColor}'; this.style.background='#f9fafb'"
                 onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div style="font-size: 16px; font-weight: 600;">${store.name}</div>
                    <div style="background: ${buttonColor}15; color: ${buttonColor}; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px;">${store.distance}</div>
                </div>
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;"><i class="fa fa-map-marker-alt" style="margin-right: 5px;"></i>${store.address}</div>
                <a href="#" style="color: ${buttonColor}; font-size: 14px; font-weight: 600; text-decoration: none;">Get Directions <i class="fa fa-arrow-right"></i></a>
            </div>`).join('');

        const contentHtml = `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;">
                <h3 style="font-size: 22px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3>
                <form style="margin-bottom: 20px;">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" placeholder="${this.escapeHtml(placeholder)}" style="flex: 1; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;">
                        <button type="submit" style="background: ${buttonColor}; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Search</button>
                    </div>
                </form>
                <div style="display: flex; flex-direction: column; gap: 10px;">${stores}</div>
            </div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'store-locator-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

class DirectionsWidget extends WidgetBase {
    getName() { return 'directions'; }
    getTitle() { return 'Directions'; }
    getIcon() { return 'fa fa-directions'; }
    getCategories() { return ['maps']; }
    getKeywords() { return ['directions', 'route', 'navigation']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Get Directions', placeholder: 'Enter title', label_block: true });
        this.addControl('destination', { type: 'text', label: 'Destination', default_value: '123 Main St, New York', placeholder: 'Enter destination', label_block: true });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#10b981' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Get Directions');
        const destination = this.getSetting('destination', '123 Main St, New York');
        const buttonColor = this.getSetting('button_color', '#10b981');

        const steps = ['Head north on Main St', 'Turn right onto Park Ave', 'Destination will be on the left'].map((step, i) => `
            <div style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 30px; height: 30px; border-radius: 50%; background: ${buttonColor}; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; flex-shrink: 0;">${i + 1}</div>
                <div style="flex: 1;"><div style="font-size: 14px; color: #666;">${step}</div></div>
            </div>`).join('');

        const contentHtml = `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <div style="padding: 25px; border-bottom: 1px solid #e5e7eb;">
                    <h3 style="font-size: 22px; font-weight: 700; margin: 0 0 15px 0;">${this.escapeHtml(title)}</h3>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <i class="fa fa-map-marker-alt" style="color: ${buttonColor}; font-size: 18px;"></i>
                        <div style="font-size: 14px; color: #666;">${this.escapeHtml(destination)}</div>
                    </div>
                    <button style="width: 100%; background: ${buttonColor}; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;"><i class="fa fa-directions"></i> Open in Maps</button>
                </div>
                <div>${steps}</div>
                <div style="padding: 15px; background: #f9fafb; text-align: center; font-size: 12px; color: #666;">Estimated time: 15 min · Distance: 2.5 mi</div>
            </div>`;

        return this.wrapWithAdvancedSettings(contentHtml, 'directions-widget');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(GoogleMapWidget);
window.elementorWidgetManager.registerWidget(MapboxWidget);
window.elementorWidgetManager.registerWidget(LocationWidget);
window.elementorWidgetManager.registerWidget(StoreLocatorWidget);
window.elementorWidgetManager.registerWidget(DirectionsWidget);
