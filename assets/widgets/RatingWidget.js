/**
 * RatingWidget - Star rating display widget
 * Displays star rating with score and optional label
 */
class RatingWidget extends WidgetBase {
    getName() {
        return 'rating';
    }

    getTitle() {
        return 'Rating';
    }

    getIcon() {
        return 'fa fa-star';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['rating', 'stars', 'score', 'review', 'feedback'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Rating',
            tab: 'content'
        });

        this.addControl('rating', {
            type: 'slider',
            label: 'Rating',
            default_value: { size: 4.5, unit: '' },
            range: {
                min: 0,
                max: 5,
                step: 0.1
            }
        });

        this.addControl('show_score', {
            type: 'switch',
            label: 'Show Score',
            default_value: true
        });

        this.addControl('show_label', {
            type: 'switch',
            label: 'Show Label',
            default_value: true
        });

        this.addControl('label_text', {
            type: 'text',
            label: 'Label Text',
            default_value: 'out of 5',
            placeholder: 'e.g., out of 5',
            condition: {
                terms: [
                    { name: 'show_label', operator: '==', value: true }
                ]
            }
        });

        this.addControl('scale', {
            type: 'select',
            label: 'Star Scale',
            default_value: '5',
            options: [
                { value: '5', label: '5 Stars' },
                { value: '10', label: '10 Stars' }
            ]
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('alignment', {
            type: 'select',
            label: 'Alignment',
            default_value: 'left',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        });

        this.addControl('star_size', {
            type: 'slider',
            label: 'Star Size',
            default_value: { size: 24, unit: 'px' },
            range: {
                min: 12,
                max: 60,
                step: 2
            }
        });

        this.addControl('filled_color', {
            type: 'color',
            label: 'Filled Star Color',
            default_value: '#fbbf24'
        });

        this.addControl('empty_color', {
            type: 'color',
            label: 'Empty Star Color',
            default_value: '#d1d5db'
        });

        this.addControl('score_color', {
            type: 'color',
            label: 'Score Color',
            default_value: '#1a1a1a'
        });

        this.addControl('label_color', {
            type: 'color',
            label: 'Label Color',
            default_value: '#666666'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const rating = this.getSetting('rating', { size: 4.5, unit: '' });
        const showScore = this.getSetting('show_score', true);
        const showLabel = this.getSetting('show_label', true);
        const labelText = this.getSetting('label_text', 'out of 5');
        const scale = parseInt(this.getSetting('scale', '5'));
        const alignment = this.getSetting('alignment', 'left');
        const starSize = this.getSetting('star_size', { size: 24, unit: 'px' });
        const filledColor = this.getSetting('filled_color', '#fbbf24');
        const emptyColor = this.getSetting('empty_color', '#d1d5db');
        const scoreColor = this.getSetting('score_color', '#1a1a1a');
        const labelColor = this.getSetting('label_color', '#666666');

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate animation values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        // Calculate rating value
        const ratingValue = rating && typeof rating === 'object' ? rating.size : 4.5;
        const maxRating = scale;
        const normalizedRating = (ratingValue / maxRating) * 5; // Normalize to 5-star scale for display

        // Build stars
        const stars = Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            let starClass = 'fa-star-o'; // Empty
            let starColor = emptyColor;

            if (normalizedRating >= starValue) {
                starClass = 'fa-star'; // Full
                starColor = filledColor;
            } else if (normalizedRating > starValue - 1) {
                starClass = 'fa-star-half-alt'; // Half
                starColor = filledColor;
            }

            return `<i class="fa ${starClass}" style="color: ${starColor}; font-size: ${starSize.size}${starSize.unit};"></i>`;
        }).join(' ');

        // Build score display
        const scoreHtml = showScore ? `<span style="color: ${scoreColor}; font-size: ${starSize.size}${starSize.unit}; font-weight: 600; margin-left: 10px;">${ratingValue.toFixed(1)}</span>` : '';

        // Build label display
        const labelHtml = showLabel ? `<span style="color: ${labelColor}; font-size: ${Math.max(12, starSize.size * 0.6)}${starSize.unit}; margin-left: 6px;">${this.escapeHtml(labelText)}</span>` : '';

        const alignmentMap = {
            left: 'flex-start',
            center: 'center',
            right: 'flex-end'
        };

        const content = `
            <div style="display: flex; align-items: center; justify-content: ${alignmentMap[alignment]}; gap: 2px;">
                ${stars}
                ${scoreHtml}
                ${labelHtml}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['rating-widget'];
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

        // Combine wrapper style
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(RatingWidget);
