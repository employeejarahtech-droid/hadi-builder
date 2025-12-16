class HEADING {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Heading'; // Default label if not provided
        this.title = args.title || ''; // Default title if not provided
        this.paragraph = args.paragraph || ''; // Default paragraph if not provided
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <div>
                        <h5 id="${this.id}_title">${this.title}</h5>
                        <p style="text-decoration: italic;">
                            ${this.paragraph}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    static init(args = [], selectorDiv) {
        const id = args[0];
        const instance = new HEADING(id, args[1]);
        const html = instance.render();
        
        // Append the generated HTML to the specified selector
        $(selectorDiv).append(html);
    }
}

// Example usage
// const args = [
//     'headingId',
//     {
//         label: 'Section Title',
//         title: 'Welcome to the Page', // Title to be displayed in the heading
//         paragraph: 'This is an introductory paragraph providing context for the section.' // Paragraph text
//     }
// ];
// HEADING.init(args, selectorDiv);

