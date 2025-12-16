class COLOR {
    constructor(id, label, defaultValue, value) {
        this.id = id;
        this.label = label || 'Color';
        this.defaultValue = defaultValue || '#000000';
        this.value = value ? `#${value.replace(/^#/, '')}` : this.defaultValue; // Normalize the value to hex
    }

    render() {
        return `
            <div class="block-col">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <input id="${this.id}" name="${this.id}" type="hidden" value="${this.value}">
                    <div id="${this.id}_picker" class="color-picker"></div> <!-- Added class for styling -->
                </div>
            </div>
        `;
    }

    static init(args = []) {
        const id = args[0];
        const label = args[1].label;
        const defaultValue = `#${args[1].default_value || '000000'}`;
        const value = args[1].value ? `#${args[1].value.replace(/^#/, '')}` : defaultValue; // Normalize the value
        const instance = new COLOR(id, label, defaultValue, value);
        const html = instance.render();

        document.body.insertAdjacentHTML('beforeend', html); // Appending the rendered HTML to the body or any other selector
        instance.setupListeners(); // Setup listeners after appending
    }

    setupListeners() {
        this.colorPicker(this.id, this.value); // Use current value for the picker
    }

    colorPicker(name, defaultColor) {
        const picker = `${name}`; // Use the correct div ID
        const pick = `${name}_picker`; // Use the correct div ID
        const element = document.getElementById(pick); // Target the color picker div directly

        console.log('element', element);

        if (!element) {
            console.error(`Element with ID "${pick}" not found.`);
            return;
        }

        new Picker({
            parent: element,
            popup: 'center',
            color: defaultColor, // Use the default color
            onChange: (color) => {
                const hexColor = rgba2hex(color.rgbaString);
                element.style.backgroundColor = hexColor; // Change background color if necessary
                document.getElementById(name).value = hexColor; // Update hidden input value
            }
        });
    }

    getColor() {
        return document.getElementById(this.id).value; // Retrieve the current color value
    }
}

// Simple rgba2hex function
function rgba2hex(rgba) {
    // Extract numeric values from the RGBA string
    const rgbaValues = rgba.match(/\d+(\.\d+)?/g); // Matches both integers and decimals
    if (!rgbaValues) return '#00000000'; // Return black if parsing fails

    // Get the RGB values and convert them to hex
    const hex = rgbaValues.slice(0, 3) // Get the first three values (R, G, B)
        .map((x) => {
            const hexValue = Math.round(parseFloat(x)).toString(16); // Round and convert to hex
            return hexValue.length === 1 ? '0' + hexValue : hexValue; // Ensure two digits
        })
        .join('');

    // Convert alpha value to hex (0-255 range)
    const alpha = Math.round(parseFloat(rgbaValues[3]) * 255).toString(16); // Convert alpha to hex
    const alphaHex = alpha.length === 1 ? '0' + alpha : alpha; // Ensure two digits

    return `#${hex}${alphaHex}`; // Return the hex color with alpha
}

// Example usage:
// COLOR.init([
//     'colorId', // Unique identifier for the color input
//     { 
//         label: 'Pick a Color',
//         default_value: 'ff0000', // No '#' needed here, it's added in the init
//         value: '00ff00' // Provide an initial color value
// ]); // Will append to the body by default

// To retrieve the color
// const colorInstance = new COLOR('colorId', 'Pick a Color', 'ff0000', '00ff00');
// console.log(colorInstance.getColor());
