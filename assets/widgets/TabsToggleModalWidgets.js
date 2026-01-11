// Tabs, Toggle, Modal, Tooltip, Popover, Dropdown widgets (compact format)

class TabsWidget extends WidgetBase {
    getName() { return 'tabs'; }
    getTitle() { return 'Tabs'; }
    getIcon() { return 'fa fa-folder'; }
    getCategories() { return ['interactive']; }
    getKeywords() { return ['tabs', 'tabbed', 'content']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('tabs', {
            type: 'repeater', label: 'Tabs', default_value: [
                { title: 'Tab 1', content: 'Content 1' },
                { title: 'Tab 2', content: 'Content 2' }
            ], fields: [
                { id: 'title', type: 'text', label: 'Title', default_value: 'Tab' },
                { id: 'content', type: 'textarea', label: 'Content', default_value: 'Content' }
            ]
        });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('active_color', { type: 'color', label: 'Active Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const tabs = this.getSetting('tabs', [{ title: 'Tab 1', content: 'Content 1' }]);
        const activeColor = this.getSetting('active_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const tabsArray = Array.isArray(tabs) ? tabs : [];
        const tabButtons = tabsArray.map((tab, i) => `<button onclick="Array.from(document.querySelectorAll('.tab-content-${this.id}')).forEach(el => el.style.display='none'); document.getElementById('tab-${this.id}-${i}').style.display='block'; Array.from(this.parentElement.children).forEach(btn => btn.style.borderBottom='2px solid transparent'); this.style.borderBottom='2px solid ${activeColor}'" style="background: none; border: none; border-bottom: 2px solid ${i === 0 ? activeColor : 'transparent'}; padding: 12px 20px; font-size: 16px; font-weight: 600; cursor: pointer; color: ${i === 0 ? activeColor : '#666'};">${this.escapeHtml(tab.title || 'Tab')}</button>`).join('');
        const tabContents = tabsArray.map((tab, i) => `<div id="tab-${this.id}-${i}" class="tab-content-${this.id}" style="display: ${i === 0 ? 'block' : 'none'}; padding: 20px; color: #666; font-size: 14px; line-height: 1.6;">${this.escapeHtml(tab.content || '')}</div>`).join('');
        const content = `<div><div style="border-bottom: 1px solid #e5e7eb; margin-bottom: 20px;">${tabButtons}</div>${tabContents}</div>`;
        let wrapperClasses = ['tabs-widget'];
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
        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }
    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

class ToggleWidget extends WidgetBase {
    getName() { return 'toggle'; }
    getTitle() { return 'Toggle'; }
    getIcon() { return 'fa fa-toggle-on'; }
    getCategories() { return ['interactive']; }
    getKeywords() { return ['toggle', 'switch', 'content']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Click to toggle', placeholder: 'Enter title', label_block: true });
        this.addControl('content', { type: 'textarea', label: 'Content', default_value: 'Hidden content here', placeholder: 'Enter content', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('toggle_color', { type: 'color', label: 'Toggle Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Click to toggle');
        const content = this.getSetting('content', 'Hidden content here');
        const toggleColor = this.getSetting('toggle_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const uniqueId = `toggle-${this.id}`;
        const contentHtml = `<div><div onclick="document.getElementById('${uniqueId}').style.display = document.getElementById('${uniqueId}').style.display === 'none' ? 'block' : 'none'" style="background: ${toggleColor}; color: white; padding: 15px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;"><span>${this.escapeHtml(title)}</span><i class="fa fa-chevron-down"></i></div><div id="${uniqueId}" style="display: none; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; color: #666; font-size: 14px; line-height: 1.6;">${this.escapeHtml(content)}</div></div>`;
        let wrapperClasses = ['toggle-widget'];
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

class ModalWidget extends WidgetBase {
    getName() { return 'modal'; }
    getTitle() { return 'Modal'; }
    getIcon() { return 'fa fa-window-maximize'; }
    getCategories() { return ['interactive']; }
    getKeywords() { return ['modal', 'popup', 'dialog']; }
    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('button_text', { type: 'text', label: 'Button Text', default_value: 'Open Modal', placeholder: 'Enter button text' });
        this.addControl('modal_title', { type: 'text', label: 'Modal Title', default_value: 'Modal Title', placeholder: 'Enter title', label_block: true });
        this.addControl('modal_content', { type: 'textarea', label: 'Modal Content', default_value: 'Modal content here', placeholder: 'Enter content', label_block: true });
        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const buttonText = this.getSetting('button_text', 'Open Modal');
        const modalTitle = this.getSetting('modal_title', 'Modal Title');
        const modalContent = this.getSetting('modal_content', 'Modal content here');
        const buttonColor = this.getSetting('button_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined) ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined) ? animationDelay : { size: 0, unit: 's' };
        const uniqueId = `modal-${this.id}`;
        const contentHtml = `<div><button onclick="document.getElementById('${uniqueId}').style.display='flex'" style="background: ${buttonColor}; color: white; font-size: 16px; font-weight: 600; padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer;">${this.escapeHtml(buttonText)}</button><div id="${uniqueId}" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 9999;"><div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;"><h3 style="margin: 0; font-size: 20px; font-weight: 700;">${this.escapeHtml(modalTitle)}</h3><button onclick="document.getElementById('${uniqueId}').style.display='none'" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button></div><div style="color: #666; font-size: 14px; line-height: 1.6;">${this.escapeHtml(modalContent)}</div></div></div></div>`;
        let wrapperClasses = ['modal-widget'];
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

window.elementorWidgetManager.registerWidget(TabsWidget);
window.elementorWidgetManager.registerWidget(ToggleWidget);
window.elementorWidgetManager.registerWidget(ModalWidget);
