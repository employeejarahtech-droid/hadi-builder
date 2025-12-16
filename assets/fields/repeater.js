class REPEATER {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Repeater'; // Default label if not provided
        this.placeholder = args.placeholder || 'Add new item'; // Placeholder for the add button
        this.fields = args.fields || []; // Fields inside each repeater item (e.g., text, select)
        this.labelBlock = args.label_block || false; // Whether the label should be block style
    }

    render() {
        // Generate HTML for the repeater
        let html = `
            <div class="repeater-container" id="${this.id}">
                <div class="repeater-label">
                    <label>${this.label}</label>
                </div>
                <div class="repeater-items">
                    <!-- Items will be dynamically added here -->
                </div>
                <button class="repeater-add-item">${this.placeholder}</button>
            </div>
        `;

        return html;
    }

    renderItem(itemIndex) {
        // Render HTML for a single repeater item
        let itemHtml = `<div class="repeater-item" data-index="${itemIndex}">
            <div class="repeater-item-title-bar">
                <label class="repeater-item-title">Item ${itemIndex + 1}</label>
                <button class="repeater-remove-item">Remove</button>
            </div>
            <div class="repeater-item-fields">`;

            console.log(this.fields);

        // Render fields inside each repeater item
        this.fields.forEach(field => {
            const args = [
                `${this.id}[${itemIndex}][${field.id}]`, // Field id with itemIndex
                {
                    label: field.label,
                    placeholder: field.placeholder || '',
                    value: field.value || '',
                    label_block: field.label_block !== undefined ? field.label_block : this.labelBlock,
                    options: field.options || []
                }
            ];

            switch (field.type) {
                case 'text':
                    itemHtml += TEXT.init(args); // Use the existing TEXT class
                    break;

                case 'select':
                    itemHtml += SELECT.init(args); // Use the existing SELECT class
                    break;

                case 'textarea':
                    itemHtml += TEXTAREA.init(args); // Use the existing TEXTAREA class
                    break;

                case 'checkbox':
                    itemHtml += CHECKBOX.init(args); // Assuming you have a CHECKBOX class
                    break;

                // Add more field types here as needed, like 'media', 'icon', etc.
                default:
                    console.warn(`Unsupported field type: ${field.type}`);
            }
        });

        itemHtml += `</div> <!-- End of fields --> 
        </div> <!-- End of repeater-item -->`;

        return itemHtml;
    }

    static init(args) {
        const id = args[0];
        const instance = new REPEATER(id, args[1]);
        const html = instance.render();

        // Return the generated HTML
        return html;
    }
}
