class NUMBER {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Number'; // Default label
        this.defaultValue = args.default_value || ''; // Default value for the number input
        this.value = args.value !== undefined ? args.value : this.defaultValue; // Use provided value or default
    }

    render() {
        return `
            <div class="block-col">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <input type="number" id="${this.id}" name="${this.id}" placeholder="${this.label}" value="${this.value}">
                </div>
            </div>
        `;
    }

    static init(args, selectorDiv) {
        const id = args[0];
        const instance = new NUMBER(id, args[1]);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);
    }
}

// Example usage
// const args = [
//     'numberId',
//     {
//         label: 'Enter a Number',
//         default_value: 10, // Default value for the number input
//         value: 20 // Optional value, can be set to customize the input
//     }
// ];
// const selectorDiv = '#form-container'; // Ensure this is the correct container
// NUMBER.init(args, selectorDiv);


