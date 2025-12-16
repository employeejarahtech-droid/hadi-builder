class PADDING {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Padding'; // Default label if not provided
        this.top = args.top || '0'; // Default top padding
        this.right = args.right || '0'; // Default right padding
        this.bottom = args.bottom || '0'; // Default bottom padding
        this.left = args.left || '0'; // Default left padding
        this.unit = args.unit || 'px'; // Default unit
        this.responsive = args.responsive || false; // Default responsive setting
        this.namePrefix = args.namePrefix || id; // Default name prefix for form fields
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <div class="dimensions-control">
                        <!-- Top Padding -->
                        <div class="dimension-field">
                            <label for="${this.id}_top" class="dimension-label">Top</label>
                            <input
                                type="number"
                                id="${this.id}_top"
                                name="${this.namePrefix}_top"
                                value="${this.top}"
                                class="dimension-input"
                                data-dimension="top"
                            />
                            <span class="unit-label">${this.unit}</span>
                        </div>

                        <!-- Right Padding -->
                        <div class="dimension-field">
                            <label for="${this.id}_right" class="dimension-label">Right</label>
                            <input
                                type="number"
                                id="${this.id}_right"
                                name="${this.namePrefix}_right"
                                value="${this.right}"
                                class="dimension-input"
                                data-dimension="right"
                            />
                            <span class="unit-label">${this.unit}</span>
                        </div>

                        <!-- Bottom Padding -->
                        <div class="dimension-field">
                            <label for="${this.id}_bottom" class="dimension-label">Bottom</label>
                            <input
                                type="number"
                                id="${this.id}_bottom"
                                name="${this.namePrefix}_bottom"
                                value="${this.bottom}"
                                class="dimension-input"
                                data-dimension="bottom"
                            />
                            <span class="unit-label">${this.unit}</span>
                        </div>

                        <!-- Left Padding -->
                        <div class="dimension-field">
                            <label for="${this.id}_left" class="dimension-label">Left</label>
                            <input
                                type="number"
                                id="${this.id}_left"
                                name="${this.namePrefix}_left"
                                value="${this.left}"
                                class="dimension-input"
                                data-dimension="left"
                            />
                            <span class="unit-label">${this.unit}</span>
                        </div>

                        <!-- Unit Selector -->
                        <div class="dimension-field unit-field">
                            <label for="${this.id}_unit" class="dimension-label">Unit</label>
                            <select
                                id="${this.id}_unit"
                                name="${this.namePrefix}_unit"
                                class="dimension-select"
                                data-dimension="unit"
                            >
                                <option value="px" ${this.unit === 'px' ? 'selected' : ''}>px</option>
                                <option value="%" ${this.unit === '%' ? 'selected' : ''}>%</option>
                                <option value="em" ${this.unit === 'em' ? 'selected' : ''}>em</option>
                                <option value="rem" ${this.unit === 'rem' ? 'selected' : ''}>rem</option>
                                <option value="vw" ${this.unit === 'vw' ? 'selected' : ''}>vw</option>
                                <option value="vh" ${this.unit === 'vh' ? 'selected' : ''}>vh</option>
                            </select>
                        </div>

                        <!-- Link/Unlink All Button -->
                        <div class="dimension-field link-field">
                            <button
                                type="button"
                                id="${this.id}_link"
                                class="dimension-link-btn"
                                title="Link all dimensions"
                            >
                                <i class="fas fa-link"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Responsive Controls (if enabled) -->
                    ${this.responsive ? this.renderResponsiveControls() : ''}
                </div>
            </div>
        `;
    }

    renderResponsiveControls() {
        return `
            <div class="responsive-controls">
                <div class="responsive-tabs">
                    <button type="button" class="responsive-tab active" data-device="desktop">
                        <i class="fas fa-desktop"></i>
                    </button>
                    <button type="button" class="responsive-tab" data-device="tablet">
                        <i class="fas fa-tablet-alt"></i>
                    </button>
                    <button type="button" class="responsive-tab" data-device="mobile">
                        <i class="fas fa-mobile-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }

    static init(args = [], selectorDiv) {
        const id = args[0];
        const instance = new PADDING(id, args[1]);
        const html = instance.render();

        // Append the generated HTML to the specified selector
        $(selectorDiv).append(html);

        // Initialize the dimension control functionality
        PADDING.initDimensionControl(id);
    }

    static initDimensionControl(id) {
        const container = $(`#${id}`).closest('.dimensions-control');
        const linkBtn = $(`#${id}_link`);
        const inputs = container.find('.dimension-input[data-dimension="top"], .dimension-input[data-dimension="right"], .dimension-input[data-dimension="bottom"], .dimension-input[data-dimension="left"]');
        const unitSelect = container.find('.dimension-select[data-dimension="unit"]');

        // Link/Unlink functionality
        let isLinked = false;
        let linkedValues = {
            top: $(`#${id}_top`).val(),
            right: $(`#${id}_right`).val(),
            bottom: $(`#${id}_bottom`).val(),
            left: $(`#${id}_left`).val()
        };

        linkBtn.on('click', function() {
            isLinked = !isLinked;
            $(this).toggleClass('linked');

            if (isLinked) {
                // Get current top value and apply to all
                const topValue = $(`#${id}_top`).val();
                inputs.each(function() {
                    $(this).val(topValue);
                });
                $(this).attr('title', 'Unlink dimensions');
                $(this).html('<i class="fas fa-unlink"></i>');
            } else {
                $(this).attr('title', 'Link all dimensions');
                $(this).html('<i class="fas fa-link"></i>');
            }
        });

        // Handle input changes when linked
        inputs.on('input', function() {
            const dimension = $(this).data('dimension');
            const value = $(this).val();

            linkedValues[dimension] = value;

            if (isLinked) {
                // When linked, update all inputs with the new value
                inputs.val(value);
            }
        });

        // Update unit labels when unit changes
        unitSelect.on('change', function() {
            const newUnit = $(this).val();
            container.find('.unit-label').text(newUnit);
        });

        // Responsive tab functionality (if responsive controls exist)
        container.find('.responsive-tab').on('click', function() {
            const device = $(this).data('device');

            // Update active tab
            container.find('.responsive-tab').removeClass('active');
            $(this).addClass('active');

            // Here you could load/save device-specific values
            // This would require additional implementation based on your needs
            console.log(`Switched to ${device} device view`);
        });
    }

    // Helper method to get current padding values
    static getValues(id) {
        return {
            top: $(`#${id}_top`).val(),
            right: $(`#${id}_right`).val(),
            bottom: $(`#${id}_bottom`).val(),
            left: $(`#${id}_left`).val(),
            unit: $(`#${id}_unit`).val()
        };
    }

    // Helper method to set padding values
    static setValues(id, values) {
        if (values.top) $(`#${id}_top`).val(values.top);
        if (values.right) $(`#${id}_right`).val(values.right);
        if (values.bottom) $(`#${id}_bottom`).val(values.bottom);
        if (values.left) $(`#${id}_left`).val(values.left);
        if (values.unit) {
            $(`#${id}_unit`).val(values.unit);
            $(`#${id}_unit`).trigger('change');
        }
    }

    // Helper method to generate CSS string
    static generateCSS(id) {
        const values = PADDING.getValues(id);
        return `${values.top}${values.unit} ${values.right}${values.unit} ${values.bottom}${values.unit} ${values.left}${values.unit}`;
    }
}

// Example usage:
// const args = [
//     'paddingId',
//     {
//         label: 'Widget Padding',
//         top: '15',
//         right: '25',
//         bottom: '15',
//         left: '25',
//         unit: 'px',
//         responsive: true,
//         namePrefix: 'widget_padding'
//     }
// ];
// PADDING.init(args, '.fields-container');