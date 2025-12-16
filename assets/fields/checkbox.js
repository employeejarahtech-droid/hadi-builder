class CHECKBOX {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Checkbox';
        this.isChecked = args.isChecked || false; // Default to false if not provided
    }

    render() {
        return `
            <div class="block-col">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <p class="onoff">
                        <input type="checkbox" value="1" id="${this.id}" ${this.isChecked ? 'checked' : ''}>
                        <label for="${this.id}"></label>
                    </p>
                </div>
            </div>
        `;
    }

    static init(args) {
        const id = args[0];
        const instance = new CHECKBOX(id, args[1]);
        const html = instance.render();

        // Return the generated HTML
        return html;
    }
}

// Example Usage:
// const args = [
//     `${this.data.id}[checkbox]`, 
//     { 
//         label: 'Enable Feature',
//         isChecked: this.data.checkbox || false // Adjust this based on your data structure
//     }
// ];

// // Get the generated HTML (without using selectorDiv)
// const checkboxHtml = CHECKBOX.init(args);

// // Now you can append the HTML wherever you want in your DOM
// $('#form-container').append(checkboxHtml); // Example usage of appending
