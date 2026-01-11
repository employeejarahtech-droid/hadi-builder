class AudioWidget extends WidgetBase {
    getName() {
        return 'audio';
    }
    getTitle() {
        return 'Audio';
    }
    getIcon() {
        return 'fa fa-music';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['audio', 'music', 'player'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Audio Track',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('artist', {
            type: 'text',
            label: 'Artist',
            default_value: 'Artist Name',
            placeholder: 'Enter artist'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('player_color', {
            type: 'color',
            label: 'Player Color',
            default_value: '#3b82f6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Audio Track');
        const artist = this.getSetting('artist', 'Artist Name');
        const playerColor = this.getSetting('player_color', '#3b82f6');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;"><div style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px;"><div style="width: 60px; height: 60px; background: ${playerColor}15; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: ${playerColor}; flex-shrink: 0;"><i class="fa fa-music" style="font-size: 24px;"></i></div><div style="flex: 1;"><div style="font-size: 16px; font-weight: 700; margin-bottom: 3px;">${this.escapeHtml(title)}</div><div style="font-size: 14px; color: #666;">${this.escapeHtml(artist)}</div></div></div><div style="display: flex; align-items: center; gap: 15px;"><button style="background: ${playerColor}; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;"><i class="fa fa-play"></i></button><div style="flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; position: relative;"><div style="width: 40%; height: 100%; background: ${playerColor}; border-radius: 2px;"></div></div><span style="font-size: 12px; color: #666;">2:30</span></div></div>`;
        let wrapperClasses = ['audio-widget'];
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
window.elementorWidgetManager.registerWidget(AudioWidget);
