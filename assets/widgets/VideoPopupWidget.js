class VideoPopupWidget extends WidgetBase {
    getName() {
        return 'video_popup';
    }
    getTitle() {
        return 'Video Popup';
    }
    getIcon() {
        return 'fa fa-play-circle';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['video', 'popup', 'modal'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('thumbnail_text', {
            type: 'text',
            label: 'Thumbnail Text',
            default_value: 'Play Video',
            placeholder: 'Enter text'
        });
        this.addControl('video_url', {
            type: 'text',
            label: 'Video URL',
            default_value: 'https://example.com/video.mp4',
            placeholder: 'Enter video URL',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('play_color', {
            type: 'color',
            label: 'Play Button Color',
            default_value: '#ef4444'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const thumbnailText = this.getSetting('thumbnail_text', 'Play Video');
        const videoUrl = this.getSetting('video_url', 'https://example.com/video.mp4');
        const playColor = this.getSetting('play_color', '#ef4444');
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
        const uniqueId = `videopop-${this.id}`;
        const contentHtml = `<div><div onclick="document.getElementById('${uniqueId}').style.display='flex'" style="position: relative; background: #f3f4f6; border-radius: 12px; aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;"><div style="width: 80px; height: 80px; background: ${playColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><i class="fa fa-play" style="color: white; font-size: 32px; margin-left: 5px;"></i></div><span style="font-size: 16px; font-weight: 600; color: #666;">${this.escapeHtml(thumbnailText)}</span></div><div id="${uniqueId}" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); align-items: center; justify-content: center; z-index: 9999;"><div style="position: relative; max-width: 90%; max-height: 90%;"><button onclick="document.getElementById('${uniqueId}').style.display='none'" style="position: absolute; top: -40px; right: 0; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px;">×</button><div style="background: #1a1a1a; width: 800px; height: 450px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 48px;"><i class="fa fa-play-circle"></i></div></div></div></div>`;
        let wrapperClasses = ['video-popup-widget'];
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
window.elementorWidgetManager.registerWidget(VideoPopupWidget);
