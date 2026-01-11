/**
 * AnimatedIconWidget - Animated icons widget
 * Displays icon with CSS animations
 */
console.log('Loading AnimatedIconWidget.js...');

class AnimatedIconWidget extends WidgetBase {
    getName() {
        return 'animated_icon';
    }

    getTitle() {
        return 'Animated Icon';
    }

    getIcon() {
        return 'fa fa-magic';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['icon', 'animated', 'animation', 'effect'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Icon',
            tab: 'content'
        });

        this.addControl('icon', {
            type: 'icon',
            label: 'Icon Class',
            default_value: 'fa fa-heart',
            placeholder: 'e.g., fa fa-heart',
            description: 'FontAwesome icon class'
        });

        this.addControl('icon_animation', {
            type: 'select',
            label: 'Animation Type',
            default_value: 'pulse',
            options: [
                { value: 'pulse', label: 'Pulse' },
                { value: 'bounce', label: 'Bounce' },
                { value: 'spin', label: 'Spin' },
                { value: 'shake', label: 'Shake' },
                { value: 'float', label: 'Float' }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 64, unit: 'px' },
            range: {
                min: 24,
                max: 150,
                step: 1
            }
        });

        this.addControl('icon_color', {
            type: 'color',
            label: 'Icon Color',
            default_value: '#ef4444'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: 'transparent'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const icon = this.getSetting('icon', 'fa fa-heart');
        const iconAnimation = this.getSetting('icon_animation', 'pulse');
        const iconSize = this.getSetting('icon_size', { size: 64, unit: 'px' });
        const iconColor = this.getSetting('icon_color', '#ef4444');
        const backgroundColor = this.getSetting('background_color', 'transparent');

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        const safeIconSize = (iconSize && typeof iconSize === 'object' && iconSize.size !== undefined && iconSize.unit !== undefined) ? iconSize : { size: 64, unit: 'px' };

        // Generate unique ID for keyframes
        const uniqueId = `anim-${Math.random().toString(36).substr(2, 9)}`;

        // Build animation keyframes
        let keyframes = '';
        if (iconAnimation === 'pulse') {
            keyframes = `<style>@keyframes ${uniqueId} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }</style>`;
        } else if (iconAnimation === 'bounce') {
            keyframes = `<style>@keyframes ${uniqueId} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }</style>`;
        } else if (iconAnimation === 'spin') {
            keyframes = `<style>@keyframes ${uniqueId} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>`;
        } else if (iconAnimation === 'shake') {
            keyframes = `<style>@keyframes ${uniqueId} { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }</style>`;
        } else if (iconAnimation === 'float') {
            keyframes = `<style>@keyframes ${uniqueId} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }</style>`;
        }

        const content = `
            ${keyframes}
            <div style="text-align: center; padding: 20px; background: ${backgroundColor};">
                <i class="${this.escapeHtml(icon)}" style="color: ${iconColor}; font-size: ${safeIconSize.size}${safeIconSize.unit}; animation: ${uniqueId} 2s ease-in-out infinite;"></i>
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['animated-icon-widget'];
        if (cssClasses) {
            wrapperClasses.push(cssClasses);
        }
        if (animation !== 'none') {
            wrapperClasses.push('animated', animation);
        }

        // Build wrapper attributes
        let wrapperAttributes = '';
        if (cssId) {
            wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        }

        // Build animation styles
        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }

        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(AnimatedIconWidget);
