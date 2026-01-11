// Tooltip, Popover, Dropdown, MegaMenu, Offcanvas, Drawer, Collapsible, Expandable widgets (compact)

class TooltipWidget extends WidgetBase {
    getName() { return 'tooltip'; }
    getTitle() { return 'Tooltip'; }
    getIcon() { return 'fa fa-comment'; }
    getCategories() { return ['interactive']; }
    getKeywords() { return ['tooltip', 'hover', 'hint']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('text', { type: 'text', label: 'Text', default_value: 'Hover me', placeholder: 'Enter text' });
        this.addControl('tooltip', { type: 'text', label: 'Tooltip', default_value: 'Tooltip text', placeholder: 'Enter tooltip', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('tooltip_color', { type: 'color', label: 'Tooltip Color', default_value: '#1a1a1a' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const text = this.getSetting('text', 'Hover me');
        const tooltip = this.getSetting('tooltip', 'Tooltip text');
        const tooltipColor = this.getSetting('tooltip_color', '#1a1a1a');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const contentHtml = `<div style="position: relative; display: inline-block;"><span style="border-bottom: 1px dashed #666; cursor: help;">${this.escapeHtml(text)}</span><div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: ${tooltipColor}; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.3s; margin-bottom: 5px;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0'">${this.escapeHtml(tooltip)}</div></div>`;
        let wrapperClasses = ['tooltip-widget'];
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
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class PopoverWidget extends WidgetBase {
    getName() { return 'popover'; }
    getTitle() { return 'Popover'; }
    getIcon() { return 'fa fa-info-circle'; }
    getCategories() { return ['interactive']; }
    getKeywords() { return ['popover', 'click', 'info']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Click me', placeholder: 'Enter text' });
        this.addControl('popover_content', { type: 'textarea', label: 'Popover Content', default_value: 'Popover content', placeholder: 'Enter content', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const buttonText = this.getSetting('button_text', 'Click me');
        const popoverContent = this.getSetting('popover_content', 'Popover content');
        const buttonColor = this.getSetting('button_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const uniqueId = `popover-${this.id}`;
        const contentHtml = `<div style="position: relative; display: inline-block;"><button onclick="document.getElementById('${uniqueId}').style.display = document.getElementById('${uniqueId}').style.display === 'none' ? 'block' : 'none'" style="background: ${buttonColor}; color: white; font-size: 14px; font-weight: 600; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">${this.escapeHtml(buttonText)}</button><div id="${uniqueId}" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-top: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 200px; z-index: 100;"><div style="color: #666; font-size: 14px; line-height: 1.6;">${this.escapeHtml(popoverContent)}</div></div></div>`;
        let wrapperClasses = ['popover-widget'];
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
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class DropdownWidget extends WidgetBase {
    getName() { return 'dropdown'; }
    getTitle() { return 'Dropdown'; }
    getIcon() { return 'fa fa-caret-down'; }
    getCategories() { return ['interactive']; }
    getKeywords() { return ['dropdown', 'menu', 'select']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Dropdown', placeholder: 'Enter text' });
        this.addControl('items', { type: 'textarea', label: 'Items (one per line)', default_value: 'Item 1\nItem 2\nItem 3', placeholder: 'Enter items', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const buttonText = this.getSetting('button_text', 'Dropdown');
        const items = this.getSetting('items', 'Item 1\nItem 2\nItem 3');
        const buttonColor = this.getSetting('button_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const uniqueId = `dropdown-${this.id}`;
        const itemList = items.split('\n').filter(i => i.trim()).map(item => `<div style="padding: 10px 15px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'">${this.escapeHtml(item)}</div>`).join('');
        const contentHtml = `<div style="position: relative; display: inline-block;"><button onclick="document.getElementById('${uniqueId}').style.display = document.getElementById('${uniqueId}').style.display === 'none' ? 'block' : 'none'" style="background: ${buttonColor}; color: white; font-size: 14px; font-weight: 600; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;">${this.escapeHtml(buttonText)} <i class="fa fa-chevron-down"></i></button><div id="${uniqueId}" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 150px; z-index: 100;">${itemList}</div></div>`;
        let wrapperClasses = ['dropdown-widget'];
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
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(TooltipWidget);
window.elementorWidgetManager.registerWidget(PopoverWidget);
window.elementorWidgetManager.registerWidget(DropdownWidget);
