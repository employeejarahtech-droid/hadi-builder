class DATE {
    constructor(id, label, defaultValue, value) {
        this.id = id;
        this.label = label || 'Date'; // Default label if not provided
        this.defaultValue = defaultValue || ''; // Default to an empty string if no default value is provided
        this.value = value !== undefined && value !== null ? value : this.defaultValue; // Use provided value or defaultValue
    }

    render() {
        return `
            <div class="block-col">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <input type="date" id="${this.id}" value="${this.value}">
                </div>
            </div>
        `;
    }

    static init(args = [], selectorDiv) {
        const id = args[0];
        const label = args[1].label;
        const defaultValue = args[1].default_value || ''; // Use default_value if provided
        const value = args[1].value !== undefined && args[1].value !== null ? args[1].value : defaultValue; // Use provided value or default_value
        const instance = new DATE(id, label, defaultValue, value);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);
    }
}

// Example usage
// const args = [
//     'dateId',
//     {
//         label: 'Select Date',
//         default_value: '2023-10-27', // Default date value in YYYY-MM-DD format
//         value: '2023-10-01' // Specific value to set, can be different from default
//     }
// ];
// const selectorDiv = '#form-container'; // Ensure this is the correct container
// DATE.init(args, selectorDiv);


