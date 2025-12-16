class NOTICE {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Notice'; // Default label if not provided
        this.value = args.default_value || ''; // Default value for the URL input
        this.paragraph = args.paragraph || ''; // Default paragraph if not provided
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <p>${this.paragraph}</p> <!-- Render the paragraph here -->
                </div>
            </div>
        `;
    }

    static init(args, selectorDiv) {
        const id = args[0];
        const instance = new NOTICE(id, args[1]);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);
    }
}

// Example usage
// const args = [
//     'noticeId',
//     {
//         label: 'Important Notice',
//         default_value: 'This is a notice.', // Example default value
//         paragraph: 'This is the detailed information provided in the notice.' // Example paragraph text
//     }
// ];
// const selectorDiv = '#form-container'; // Ensure this is the correct container
// NOTICE.init(args, selectorDiv);
