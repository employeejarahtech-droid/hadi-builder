class SLIDER {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Slider';
        this.min = args.range.min || 0;
        this.max = args.range.max || 100;
        this.step = args.range.step || 1;
        this.default = args.default || { size: 50, unit: '' };
        this.randid = Math.random().toString(36).substr(2, 9);
    }

    render() {
        const defaultSize = this.default.size;
        const defaultUnit = this.default.unit;

        return `
            <div class="block-col">
                <div class="label">
                    <label for='${this.id}'>${this.label}</label>
                </div>
                <div class="field">
                    <span class='slider-value slider-${this.randid}'>${defaultSize} ${defaultUnit}</span>
                    <input type='range' data-id='slider-${this.randid}' id='${this.id}' 
                           name='${this.id}' 
                           min='${this.min}' 
                           max='${this.max}' 
                           step='${this.step}' 
                           value='${defaultSize}' 
                           class='slider-input'>
                </div>
            </div>
        `;
    }

    getValue() {
        const sliderInput = $(`#${this.id}`);
        if (sliderInput.length === 0) return this.default;

        const size = parseFloat(sliderInput.val()) || 0;
        return { size, unit: this.default.unit };
    }

    setValue(value) {
        if (typeof value === 'object' && value.size !== undefined) {
            const sliderInput = $(`#${this.id}`);
            const valueDisplay = $(`.slider-${this.randid}`);

            if (sliderInput.length > 0) {
                sliderInput.val(value.size);
                valueDisplay.text(`${value.size} ${value.unit || this.default.unit}`);
            }
        }
    }

    setupListeners() {
        const defaultUnit = this.default.unit;
        const valueDisplay = $(`.slider-${this.randid}`);

        // Initialize display value
        valueDisplay.text(`${this.default.size} ${defaultUnit}`);

        // Update display value on input change using data-id
        $(document).on('input', `[data-id='slider-${this.randid}']`, function() {
            const value = $(this).val();
            valueDisplay.text(`${value} ${defaultUnit}`);
        });
    }

    static init(args, selectorDiv) {
        const id = args[0];
        const instance = new SLIDER(id, args[1]);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);

        // Set up the listeners
        instance.setupListeners();
    }
}

// Example usage
// const args = [
//     'sliderId',
//     {
//         label: 'Adjust Volume',
//         range: {
//             min: 0,
//             max: 100,
//             step: 1
//         },
//         default: {
//             size: 50, // Default value for the slider
//             unit: '%' // Unit for the slider value
//         }
//     }
// ];

// const selectorDiv = '#form-container'; // Ensure this is the correct container
// SLIDER.init(args, selectorDiv);
