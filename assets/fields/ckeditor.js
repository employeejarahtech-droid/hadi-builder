class CKEditor {
    constructor(id, args) {
        this.id = id;  // The unique ID for the CKEditor instance
        this.label = args.label || 'Editor'; // Default label
        this.value = args.value || args.default_value || ''; // Use value if provided; otherwise, default_value
        this.placeholder = args.placeholder || this.label; // Default placeholder is the label if not provided
        this.labelBlock = args.label_block || false; // Default to false for label styling
        this.height = args.height || '200px'; // Optional: define height of the CKEditor
        this.randId = this.generateRandId();  // Generate a unique rand_id

    }

    // Generate a unique rand_id similar to PHP uniqid('ckeditor_', true)
    generateRandId() {
        return `ckeditor_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    }

    render() {
        const labelClass = this.labelBlock ? 'block-row' : '';

        // Render the HTML for the CKEditor
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <textarea id="${this.id}" class="ckeditor" data-id="${this.randId}" name="${this.id}" placeholder="${this.placeholder}" style="height: ${this.height};">${this.value}</textarea>
                </div>
            </div>
        `;
    }

    static init(args) {
        const id = args[0];
        const instance = new CKEditor(id, args[1]);
        const html = instance.render(); // Render the HTML

        // Include the CKEditor script dynamically
        const script = document.createElement('script');
        script.src = '/vendor/jquery/ck-editor/ckeditor.js';  // Path to CKEditor script
        script.onload = () => {
            CKEDITOR.disableAutoInline = true;

            // Use setTimeout to ensure the HTML is rendered before initializing CKEditor
            setTimeout(() => {
                // Initialize CKEditor using the rand_id stored in data-id
                let chedit = document.querySelector(`[data-id='${instance.randId}']`);
                let editor = CKEDITOR.replace(chedit);

                // Listen for changes in the CKEditor content
                editor.on("change", function () {
                    // Get data from CKEditor and update the original textarea
                    chedit.value = editor.getData(); // Correct way to get data from CKEditor instance
                });
            }, 100);
        };

        // Append the script to the head of the document
        document.head.appendChild(script);

        return html;  // Return the generated HTML string
    }
}

// Example usage:
// const args = [
//     'editorId', // Unique ID for the CKEditor
//     {
//         label: 'Content Editor',  // Label for the CKEditor
//         default_value: 'This is some default content...',  // Default content
//         placeholder: 'Start typing your content here...',  // Placeholder text
//         label_block: true,  // Optional: Add 'block-row' class to the label
//         height: '300px'  // Optional: Set custom height for the CKEditor
//     }
// ];

// // Generate the HTML and initialize CKEditor
// const html = CKEditor.init(args);
// console.log(html);  // This will log the generated HTML string
