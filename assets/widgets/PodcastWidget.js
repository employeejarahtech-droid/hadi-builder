class PodcastWidget extends WidgetBase {
    getName() {
        return 'podcast';
    }
    getTitle() {
        return 'Podcast';
    }
    getIcon() {
        return 'fa fa-podcast';
    }
    getCategories() {
        return ['media'];
    }
    getKeywords() {
        return ['podcast', 'audio', 'episode'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('episode_title', {
            type: 'text',
            label: 'Episode Title',
            default_value: 'Episode 1: Introduction',
            placeholder: 'Enter title',
            label_block: true
        });
        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'Episode description',
            placeholder: 'Enter description',
            label_block: true
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('podcast_color', {
            type: 'color',
            label: 'Podcast Color',
            default_value: '#8b5cf6'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const episodeTitle = this.getSetting('episode_title', 'Episode 1: Introduction');
        const description = this.getSetting('description', 'Episode description');
        const podcastColor = this.getSetting('podcast_color', '#8b5cf6');
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
        const contentHtml = `<div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;"><div style="display: flex; gap: 20px; margin-bottom: 20px;"><div style="width: 100px; height: 100px; background: ${podcastColor}; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;"><i class="fa fa-podcast" style="font-size: 40px;"></i></div><div style="flex: 1;"><h3 style="font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">${this.escapeHtml(episodeTitle)}</h3><p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">${this.escapeHtml(description)}</p></div></div><div style="display: flex; align-items: center; gap: 15px;"><button style="background: ${podcastColor}; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;"><i class="fa fa-play"></i></button><div style="flex: 1;"><div style="height: 4px; background: #e5e7eb; border-radius: 2px; position: relative; margin-bottom: 5px;"><div style="width: 30%; height: 100%; background: ${podcastColor}; border-radius: 2px;"></div></div><div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;"><span>12:30</span><span>42:00</span></div></div></div></div>`;
        let wrapperClasses = ['podcast-widget'];
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
window.elementorWidgetManager.registerWidget(PodcastWidget);
