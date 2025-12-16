class DATETIMELOCAL {
    constructor(id, label, defaultValue, value) {
        this.id = id;
        this.label = label || 'Date and Time'; // Default label if not provided
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
                    <input type="datetime-local" id="${this.id}" value="${this.value}">
                </div>
            </div>
        `;
    }

    static init(args = [], selectorDiv) {
        const id = args[0];
        const label = args[1].label;
        const defaultValue = args[1].default_value || ''; // Use default_value if provided
        const value = args[1].value !== undefined && args[1].value !== null ? args[1].value : defaultValue; // Use provided value or default_value
        const instance = new DATETIMELOCAL(id, label, defaultValue, value);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);
    }
}

// Example usage
// const args = [
//     'datetimeId',
//     {
//         label: 'Select Date and Time',
//         default_value: '2023-10-27T14:30', // Default date and time value in YYYY-MM-DDTHH:MM format
//         value: '2023-10-01T10:00' // Specific value to set, can be different from default
//     }
// ];
// const selectorDiv = '#form-container'; // Ensure this is the correct container
// DATETIMELOCAL.init(args, selectorDiv);

