class VideoWidget extends WidgetBase {
    getName() {
        return 'video';
    }

    getTitle() {
        return 'Video';
    }

    getIcon() {
        return 'fa fa-play-circle';
    }

    getCategories() {
        return ['basic'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Video',
            tab: 'content'
        });

        this.addControl('url', {
            type: 'url',
            label: 'Link',
            placeholder: 'Paste YouTube link',
            default_value: 'https://www.youtube.com/watch?v=XHOmBV4js_E'
        });

        this.addControl('aspect_ratio', {
            type: 'select',
            label: 'Aspect Ratio',
            options: [
                { value: '16:9', label: '16:9' },
                { value: '4:3', label: '4:3' },
                { value: '1:1', label: '1:1' }
            ],
            default_value: '16:9'
        });

        this.endControlsSection();
    }

    render() {
        const url = this.getSetting('url') || '';
        let embedUrl = '';

        // Simple Youtube ID extractor
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            embedUrl = 'https://www.youtube.com/embed/' + match[2];
        } else {
            embedUrl = url; // Fallback or assume already embedded
        }

        const aspectRatio = this.getSetting('aspect_ratio');
        let paddingBottom = '56.25%'; // 16:9
        if (aspectRatio === '4:3') paddingBottom = '75%';
        if (aspectRatio === '1:1') paddingBottom = '100%';

        if (!embedUrl) {
            return '<div style="background:#eee; padding:20px; text-align:center;">Please enter a valid video URL</div>';
        }

        return `
            <div class="elementor-video-widget">
                <div class="video-container" style="position: relative; padding-bottom: ${paddingBottom}; height: 0; overflow: hidden;">
                     <iframe 
                        src="${embedUrl}" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
    }
}

window.elementorWidgetManager.registerWidget(VideoWidget);
