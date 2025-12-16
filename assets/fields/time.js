class TIME {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Time'; // Default label
        this.defaultValue = args.default_value || ''; // Default value for the time input
        this.value = args.value || this.defaultValue; // Current value, falling back to default
    }

    render() {
        return `
            <div class="block-col">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <input type="time" id="${this.id}" value="${this.value}">
                </div>
            </div>
        `;
    }

    static init(args, selectorDiv) {
        const id = args[0];
        const instance = new TIME(id, args[1]);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);
    }
}

// Example usage
// const args = [
//     'timeId',
//     {
//         label: 'Select Time',
//         default_value: '12:30', // Example default value
//         value: '14:00' // Example current value
//     }
// ];

// const selectorDiv = '#form-container'; // Ensure this is the correct container
// TIME.init(args, selectorDiv);
