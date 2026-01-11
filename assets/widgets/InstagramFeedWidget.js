class InstagramFeedWidget extends WidgetBase {
    getName() {
        return 'instagram_feed';
    }
    getTitle() {
        return 'Instagram Feed';
    }
    getIcon() {
        return 'fab fa-instagram';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['instagram', 'feed', 'embed'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('username', {
            type: 'text',
            label: 'Username',
            default_value: '@username',
            placeholder: 'Enter username'
        });
        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            default_value: '3',
            options: [{
                value: '2',
                label: '2'
            }, {
                value: '3',
                label: '3'
            }, {
                value: '4',
                label: '4'
            }]
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('gap', {
            type: 'text',
            label: 'Gap (px)',
            default_value: '10',
            placeholder: 'e.g., 10'
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const username = this.getSetting('username', '@username');
        const columns = this.getSetting('columns', '3');
        const gap = this.getSetting('gap', '10');
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
        const images = Array.from({
            length: 6
        }, () => `<div style="background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;"><i class="fab fa-instagram"></i></div>`).join('');
        const contentHtml = `<div><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;"><div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); display: flex; align-items: center; justify-content: center; color: white;"><i class="fab fa-instagram"></i></div><div><div style="font-size: 16px; font-weight: 700;">${this.escapeHtml(username)}</div><div style="font-size: 12px; color: #666;">Follow on Instagram</div></div></div><div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px;">${images}</div></div>`;
        let wrapperClasses = ['instagram-feed-widget'];
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
window.elementorWidgetManager.registerWidget(InstagramFeedWidget);
