/**
 * DIMENSIONS Control - Refactored to extend BaseControl
 * Multi-input control for margin, padding, and other dimensional properties
 *
 * Example usage:
 * const dimensionsControl = new DIMENSIONS('my_dimensions', {
 *     label: 'Dimensions',
 *     default_value: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' },
 *     allowed_dimensions: ['top', 'right', 'bottom', 'left'],
 *     min_value: -200,
 *     max_value: 200,
 *     units: ['px', 'rem', '%']
 * });
 */
class DIMENSIONS extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);

        // DIMENSIONS-specific properties
        this.allowedDimensions = args.allowed_dimensions || ['top', 'right', 'bottom', 'left'];
        this.minValue = args.min_value || -200;
        this.maxValue = args.max_value || 200;
        this.units = args.units || ['px', 'rem', '%'];

        // Initialize value with defaults
        const defaults = args.default_value || {};
        this.value = {
            top: defaults.top || 0,
            right: defaults.right || 0,
            bottom: defaults.bottom || 0,
            left: defaults.left || 0,
            unit: defaults.unit || 'px'
        };

        // CSS is handled by page-builder.php
    }

    /**
     * Render the dimension input control
     * @returns {string} HTML string
     */
    render() {
        const attributes = [
            `id="${this.id}"`,
            `name="${this.id}"`,
            `class="elementor-control-dimensions"`,
            this.disabled ? 'disabled' : ''
        ].filter(Boolean).join(' ');

        // Build dimension rows using existing CSS classes
        const dimensionRows = this.allowedDimensions.map(side => {
            const label = side.charAt(0).toUpperCase() + side.slice(1);
            const inputAttributes = [
                `type="number"`,
                `id="${this.id}_${side}"`,
                `name="${this.id}_${side}"`,
                `min="${this.minValue}"`,
                `max="${this.maxValue}"`,
                `value="${this.value[side]}"`,
                `placeholder="0"`,
                this.disabled ? 'disabled' : ''
            ].filter(Boolean).join(' ');

            return `
                <div class="elementor-dimension-item">
                    <div class="elementor-dimension-input-group">
                        <div class="elementor-dimension-label">${this.escapeHtml(label)}</div>
                        <input ${inputAttributes} />
                    </div>
                </div>
            `;
        }).join('');

        // Build unit selector using existing CSS classes
        const unitOptions = this.units.map(unit => {
            const selected = this.value.unit === unit ? 'selected' : '';
            return `<option value="${unit}" ${selected}>${unit}</option>`;
        }).join('');

        return `
            <div ${attributes}>
                <div class="elementor-dimensions-header">
                    <div class="elementor-dimensions-title">
                        <span class="icon">⊡</span>
                        ${this.escapeHtml(this.label || 'Dimensions')}
                    </div>
                </div>
                <div class="elementor-dimensions-content">
                    <div class="elementor-dimensions-wrapper">
                        ${dimensionRows}
                    </div>
                    <div class="elementor-dimension-controls">
                        <div class="elementor-dimensions-link">
                            <span>🔗</span>
                        </div>
                        <div class="elementor-dimension-unit">
                            <select id="${this.id}_unit" name="${this.id}_unit" ${this.disabled ? 'disabled' : ''}>
                                ${unitOptions}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupListeners() {
        super.setupListeners();

        // Handle dimension input changes
        this.allowedDimensions.forEach(side => {
            const $input = $(`#${this.id}_${side}`);

            $input.on('input', (e) => {
                const newValue = e.target.value;
                const oldValue = this.value[side];

                // Convert to number
                const numValue = parseFloat(newValue) || 0;

                // Update internal value
                this.value[side] = numValue;

                // Handle responsive values if needed
                if (this.responsive) {
                    if (!this.deviceValues[this.currentDevice]) {
                        this.deviceValues[this.currentDevice] = { ...this.value };
                    }
                    this.deviceValues[this.currentDevice][side] = numValue;
                }

                this.handleChange(this.value, { [side]: oldValue });
            });

            // Validate on blur
            $input.on('blur', () => {
                this.validateDimension(side);
            });
        });

        // Handle unit change
        const $unitSelect = $(`#${this.id}_unit`);
        $unitSelect.on('change', (e) => {
            const newUnit = e.target.value;
            const oldUnit = this.value.unit;

            this.value.unit = newUnit;

            if (this.responsive) {
                if (!this.deviceValues[this.currentDevice]) {
                    this.deviceValues[this.currentDevice] = { ...this.value };
                }
                this.deviceValues[this.currentDevice].unit = newUnit;
            }

            this.handleChange(this.value, { unit: oldUnit });
        });
    }

    /**
     * Get the current value
     * @returns {object} Current dimension value
     */
    getValue() {
        // Get current values from DOM to ensure consistency
        const currentValue = { ...this.value };

        this.allowedDimensions.forEach(side => {
            const $input = $(`#${this.id}_${side}`);
            if ($input.length) {
                currentValue[side] = parseFloat($input.val()) || 0;
            }
        });

        const $unitSelect = $(`#${this.id}_unit`);
        if ($unitSelect.length) {
            currentValue.unit = $unitSelect.val();
        }

        return currentValue;
    }

    /**
     * Set a new value
     * @param {object} newValue - New dimension value
     * @param {boolean} silent - Don't emit change event
     */
    setValue(newValue, silent = false) {
        const oldValue = { ...this.value };

        // Update internal value
        this.value = { ...this.value, ...newValue };

        if (this.responsive) {
            this.deviceValues[this.currentDevice] = { ...this.value };
        }

        // Update DOM elements
        this.allowedDimensions.forEach(side => {
            if (this.value[side] !== undefined) {
                const $input = $(`#${this.id}_${side}`);
                if ($input.length) {
                    $input.val(this.value[side]);
                }
            }
        });

        if (this.value.unit !== undefined) {
            const $unitSelect = $(`#${this.id}_unit`);
            if ($unitSelect.length) {
                $unitSelect.val(this.value.unit);
            }
        }

        if (!silent) {
            this.handleChange(this.value, oldValue);
        }
    }

    /**
     * Validate a specific dimension
     * @param {string} dimension - Dimension name (top, right, bottom, left)
     * @returns {boolean} Validation result
     */
    validateDimension(dimension) {
        const $input = $(`#${this.id}_${dimension}`);
        const value = parseFloat($input.val()) || 0;

        // Check min/max constraints
        if (value < this.minValue || value > this.maxValue) {
            $input.addClass('validation-error');
            return false;
        }

        $input.removeClass('validation-error');
        return true;
    }

    /**
     * Validate all dimensions
     * @returns {boolean} Overall validation result
     */
    validate() {
        let isValid = true;
        this.allowedDimensions.forEach(side => {
            if (!this.validateDimension(side)) {
                isValid = false;
            }
        });
        return isValid;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    /**
     * Static factory method (backward compatibility)
     * @param {array} args - [id, options]
     * @returns {string} Rendered HTML
     */
    static init(args) {
        const id = args[0];
        const options = args[1] || {};
        const instance = new DIMENSIONS(id, options);

        // Auto-register with control manager if available
        if (window.elementorControlManager) {
            window.elementorControlManager.registerControl(instance);
        }

        return instance.renderWithWrapper();
    }
}

