class URLinput {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'URL';
        this.defaultValue = args.default_value || ''; // Default value for the URL input
        this.value = args.value || this.defaultValue; // Current value, falling back to default
        this.openInNewTab = args.open_in_new_tab || false; // Default for checkbox
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}[url]">${this.label}</label>
                </div>
                <div class="field field-group">
                    <input type="url" id="${this.id}[url]" name="${this.id}[url]" value="${this.value}" placeholder="https://example.com">
                    <div class="check-input">
                        <label for="${this.id}[target]">Open in new tab</label>
                        <input type="checkbox" id="${this.id}[target]" name="${this.id}[target]" ${this.openInNewTab ? 'checked' : ''}>
                    </div>
                </div>
            </div>
        `;
    }

    static init(args) {
        const id = args[0];
        const instance = new URLinput(id, args[1]);
        const html = instance.render();

        // Return the generated HTML instead of appending it
        return html;
    }
}

// // Example usage
// const args = [
//     'urlId',
//     {
//         label: 'Website URL',
//         default_value: 'https://default.com', // Example default value
//         value: 'https://example.com', // Example current value
//         open_in_new_tab: true // Example setting for opening in a new tab
//     }
// ];

// // Get the generated HTML (without using selectorDiv)
// const urlHtml = URL.init(args);
