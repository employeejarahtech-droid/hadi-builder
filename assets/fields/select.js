class SELECT {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Select'; // Default label if not provided
        this.defaultValue = args.default_value || ''; // Default selected value
        this.placeholder = args.placeholder || 'Select an option'; // Default placeholder
        this.options = args.options || []; // Options for the select element
        this.labelBlock = args.label_block || false; // Default to false
    }

    render() {
        // Generate HTML for the select options
        const optionsHtml = this.options.map(option => {
            const isSelected = option.value === this.defaultValue ? 'selected' : '';
            return `<option value="${option.value}" ${isSelected}>${option.label}</option>`;
        }).join('');

        // Generate the full HTML for the select input
        return `
            <div class="block-col ${this.labelBlock ? 'block-row' : ''}">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <select name="${this.id}" id="${this.id}">
                        <option value="" disabled ${!this.defaultValue ? 'selected' : ''}>${this.placeholder}</option>
                        ${optionsHtml}
                    </select>
                </div>
            </div>
        `;
    }

    static init(args) {
        const id = args[0];
        const instance = new SELECT(id, args[1]);
        const html = instance.render();

        // Return the generated HTML
        return html;
    }
}

// Example usage:
// const args = [
//     'selectId',
//     {
//         label: 'Choose a Vehicle',
//         default_value: 'saab', // Default selected value
//         placeholder: 'Select a vehicle',
//         options: [
//             { value: 'volvo', label: 'Volvo' },
//             { value: 'saab', label: 'Saab' },
//             { value: 'mercedes', label: 'Mercedes' },
//             { value: 'audi', label: 'Audi' }
//         ],
//         label_block: true // Enable block-style label
//     }
// ];

// // Get the generated HTML
// const selectHtml = SELECT.init(args);

// // Append the HTML to a specific container
// $('#form-container').append(selectHtml); // Can be any container you want
