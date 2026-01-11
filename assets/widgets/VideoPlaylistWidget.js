class VideoPlaylistWidget extends WidgetBase {
    getName() {
        return 'video_playlist';
    }
    getTitle() {
        return 'Video Playlist';
    }
    getIcon() {
        return 'fa fa-list';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['video', 'playlist', 'list'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Video Playlist',
            placeholder: 'Enter title',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#ef4444'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Video Playlist');
        const accentColor = this.getSetting('accent_color', '#ef4444');
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
        const videos = ['Video 1', 'Video 2', 'Video 3'].map((v, i) => `<div style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #e5e7eb; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'"><div style="width: 120px; height: 68px; background: #f3f4f6; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: ${accentColor};"><i class="fa fa-play-circle" style="font-size: 24px;"></i></div><div style="flex: 1;"><div style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">${v}</div><div style="font-size: 12px; color: #666;">5:30</div></div></div>`).join('');
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><div style="background: ${accentColor}; color: white; padding: 15px; font-size: 18px; font-weight: 700;">${this.escapeHtml(title)}</div><div>${videos}</div></div>`;
        let wrapperClasses = ['video-playlist-widget'];
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
window.elementorWidgetManager.registerWidget(VideoPlaylistWidget);
