class UploadWidget extends WidgetBase {
    getName() {
        return 'upload';
    }
    getTitle() {
        return 'Upload';
    }
    getIcon() {
        return 'fa fa-upload';
    }
    getCategories() {
        return ['forms'];
    }
    getKeywords() {
        return ['upload', 'file', 'attach'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Upload Files',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('description', {
            type: 'text',
            label: 'Description',
            default_value: 'Drag & drop or click to upload',
            placeholder: 'Enter description',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('upload_color', {
            type: 'color',
            label: 'Upload Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Upload Files');
        const description = this.getSetting('description', 'Drag & drop or click to upload');
        const uploadColor = this.getSetting('upload_color', '#3b82f6');
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
        const contentHtml = `<div style="border: 2px dashed #e5e7eb; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='${uploadColor}'; this.style.background='${uploadColor}10'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'"><div style="width: 80px; height: 80px; border-radius: 50%; background: ${uploadColor}15; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;"><i class="fa fa-cloud-upload-alt" style="font-size: 36px; color: ${uploadColor};"></i></div><h4 style="font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(title)}</h4><p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">${this.escapeHtml(description)}</p><button style="background: ${uploadColor}; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Browse Files</button><div style="margin-top: 15px; font-size: 12px; color: #999;">Supported: PDF, DOC, JPG, PNG (Max 10MB)</div></div>`;
        let wrapperClasses = ['upload-widget'];
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
window.elementorWidgetManager.registerWidget(UploadWidget);
