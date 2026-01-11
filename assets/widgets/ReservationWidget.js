class ReservationWidget extends WidgetBase {
    getName() {
        return 'reservation';
    }
    getTitle() {
        return 'Reservation';
    }
    getIcon() {
        return 'fa fa-utensils';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['reservation', 'booking', 'table'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Make a Reservation',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('button_color', {
            type: 'color',
            label: 'Button Color',
            default_value: '#ef4444'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Make a Reservation');
        const buttonColor = this.getSetting('button_color', '#ef4444');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', {
            size: 0.5,
            unit: 's'
        });
        const animationDelay = this.getSetting('animation_delay', {
            size: 0,
            unit: 's'
        });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : {
            size: 0.5,
            unit: 's'
        };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : {
            size: 0,
            unit: 's'
        };
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px;"><h3 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">${this.escapeHtml(title)}</h3><form><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;"><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Date</label><input type="date" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Time</label><select style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"><option>6:00 PM</option><option>7:00 PM</option><option>8:00 PM</option></select></div></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;"><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Guests</label><select style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"><option>1-2</option><option>3-4</option><option>5+</option></select></div><div><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Phone</label><input type="tel" placeholder="Phone number" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></div></div><button type="submit" style="width: 100%; background: ${buttonColor}; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Reserve Table</button></form></div>`;
        let wrapperClasses = ['reservation-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);
        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${contentHtml}</div>`;
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
window.elementorWidgetManager.registerWidget(ReservationWidget);
