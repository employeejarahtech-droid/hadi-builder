class SocialShareWidget extends WidgetBase {
    getName() {
        return 'social_share';
    }
    getTitle() {
        return 'Social Share';
    }
    getIcon() {
        return 'fa fa-share-alt-square';
    }
    getCategories() {
        return ['social'];
    }
    getKeywords() {
        return ['social', 'share', 'buttons'];
    }
    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });
        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Share this:',
            placeholder: 'Enter title'
        });
        this.endControlsSection();
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });
        this.addControl('button_style', {
            type: 'select',
            label: 'Button Style',
            default_value: 'filled',
            options: [{
                value: 'filled',
                label: 'Filled'
            }, {
                value: 'outline',
                label: 'Outline'
            }]
        });
        this.endControlsSection();
        this.registerAdvancedControls();
    }
    render() {
        const title = this.getSetting('title', 'Share this:');
        const buttonStyle = this.getSetting('button_style', 'filled');
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
        const shares = [{
            name: 'Facebook',
            color: '#1877f2',
            icon: 'facebook-f'
        }, {
            name: 'Twitter',
            color: '#1da1f2',
            icon: 'twitter'
        }, {
            name: 'LinkedIn',
            color: '#0a66c2',
            icon: 'linkedin-in'
        }].map(s => buttonStyle === 'filled' ? `<button style="background: ${s.color}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px;"><i class="fab fa-${s.icon}"></i> ${s.name}</button>` : `<button style="background: white; color: ${s.color}; border: 2px solid ${s.color}; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px;"><i class="fab fa-${s.icon}"></i> ${s.name}</button>`).join('');
        const contentHtml = `<div><div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">${this.escapeHtml(title)}</div><div style="display: flex; gap: 10px; flex-wrap: wrap;">${shares}</div></div>`;
        let wrapperClasses = ['social-share-widget'];
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
window.elementorWidgetManager.registerWidget(SocialShareWidget);
