/**
 * LottieWidget - Lottie animations widget
 * Displays Lottie JSON animations
 */
class LottieWidget extends WidgetBase {
    getName() {
        return 'lottie';
    }

    getTitle() {
        return 'Lottie';
    }

    getIcon() {
        return 'fa fa-film';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['lottie', 'animation', 'json', 'animated'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Animation',
            tab: 'content'
        });

        this.addControl('lottie_url', {
            type: 'text',
            label: 'Lottie JSON URL',
            default_value: '',
            placeholder: 'https://example.com/animation.json',
            label_block: true,
            description: 'URL to Lottie JSON file'
        });

        this.addControl('loop', {
            type: 'select',
            label: 'Loop',
            default_value: 'true',
            options: [
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' }
            ]
        });

        this.addControl('autoplay', {
            type: 'select',
            label: 'Autoplay',
            default_value: 'true',
            options: [
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        // Width handled globally

        this.addControl('align', {
            type: 'select',
            label: 'Alignment',
            default_value: 'center',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const lottieUrl = this.getSetting('lottie_url', '');
        const loop = this.getSetting('loop', 'true');
        const autoplay = this.getSetting('autoplay', 'true');
        const width = this.getSetting('width', { size: 300, unit: 'px' });
        const align = this.getSetting('align', 'center');

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

        const safeWidth = (width && typeof width === 'object' && width.size !== undefined && width.unit !== undefined) ? width : { size: 300, unit: 'px' };

        // Generate unique ID for Lottie container
        const uniqueId = `lottie-${Math.random().toString(36).substr(2, 9)}`;

        let content = '';
        if (lottieUrl) {
            content = `
                <div style="text-align: ${align};">
                    <div id="${uniqueId}" style="width: ${safeWidth.size}${safeWidth.unit}; display: inline-block;"></div>
                </div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
                <script>
                    (function() {
                        if (typeof lottie !== 'undefined') {
                            lottie.loadAnimation({
                                container: document.getElementById('${uniqueId}'),
                                renderer: 'svg',
                                loop: ${loop},
                                autoplay: ${autoplay},
                                path: '${this.escapeHtml(lottieUrl)}'
                            });
                        }
                    })();
                </script>
            `;
        } else {
            content = `
                <div style="text-align: center; padding: 40px; background: #f3f4f6; border-radius: 8px; color: #666;">
                    <i class="fa fa-film" style="font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                    <p style="margin: 0; font-size: 14px;">Please enter a Lottie JSON URL</p>
                </div>
            `;
        }

        // Build wrapper classes
        let wrapperClasses = ['lottie-widget'];
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

window.elementorWidgetManager.registerWidget(LottieWidget);
