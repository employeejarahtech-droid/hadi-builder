class HTML {
    constructor(id, label, value, placeholder) {
        this.id = id;
        this.randid = `html_${Math.random().toString(36).substr(2, 9)}`; // Generate a unique random ID
        this.label = label || 'HTML'; // Default label if not provided
        this.value = value !== undefined && value !== null ? value : ''; // Default to an empty string if no value is provided
        this.placeholder = placeholder || ''; // Default placeholder if not provided
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <textarea id="${this.id}" data-id="${this.randid}" name="${this.id}" placeholder="${this.placeholder}">${this.value}</textarea>
                </div>
            </div>
        `;
    }

    static init(args = [], selectorDiv) {
        const id = args[0];
        const label = args[1].label;
        const value = args[1].default_value !== undefined && args[1].default_value !== null ? args[1].default_value : ''; // Use default_value if provided
        const placeholder = args[1].placeholder || ''; // Get placeholder if provided
        const instance = new CODE(id, label, value, placeholder);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);

        // Call setupListeners
        instance.setupListeners();
    }

    setupListeners() {
        const $textarea = $(`[data-id="${this.randid}"]`); // Use data-id to select the textarea

        // Check if the textarea was found
        if ($textarea.length === 0) {
            console.error(`Textarea with data-id ${this.randid} not found.`);
            return;
        }

        // Listener for input changes
        $textarea.on('input', (event) => {
            const textarea = event.target; // Get the textarea element
            // Auto-resize logic
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = (textarea.scrollHeight) + "px"; // Set new height
        });
    }
}


// Example usage
// document.addEventListener('DOMContentLoaded', () => {
//     const args = [
//         'textarea-id',
//         {
//             label: 'Your Input',
//             value: 'Default text goes here' // Default value for the textarea
//         }
//     ];
//     const selectorDiv = '#form-container'; // Change to your target container
//     HTML.init(args, selectorDiv); // Initialize and append to the specified selector
// });
