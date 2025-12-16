class TEXT {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Text'; // Default label
        this.value = args.value || args.default_value || ''; // Use value if provided; otherwise, use default_value
        this.placeholder = args.placeholder || this.label; // Default placeholder is the label if not provided
        this.labelBlock = args.label_block || false; // Default to false
    }

    render() {
        const labelClass = this.labelBlock ? 'block-row' : '';

        return `
            <div class="block-col ${labelClass}">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <input type="text" id="${this.id}" name="${this.id}" placeholder="${this.placeholder}" value="${this.value}">
                </div>
            </div>
        `;
    }

    static init(args) {
        const id = args[0];
        const instance = new TEXT(id, args[1]);
        return instance.render(); // Return the generated HTML string
    }
}

// Example usage:
// const args = [
//     'textId',
//     {
//         label: 'Enter Your Name',
//         default_value: 'John Doe', // Default value for the input
//         value: 'Jane Smith', // Example dynamic value
//         placeholder: 'Type your name here...', // Custom placeholder
//         label_block: false // Setting label_block to false
//     }
// ];

// const html = TEXT.init(args);
// console.log(html); // This will log the generated HTML string
