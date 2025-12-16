class TAG {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Tags'; // Default label
        this.value = args.value || args.default_value || ''; // Use value if provided; otherwise, use default_value
        this.placeholder = args.placeholder || 'Add a tag'; // Default placeholder
        this.tags = this.value ? this.value.split(',').map(tag => tag.trim()) : []; // Initialize tags from value
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <div class="tag-wrapper"> <!-- Wrapper div -->
                        <div id="tag-container-${this.id}" class="tag-container"></div>
                        <input id="${this.id}" name="${this.id}" placeholder="${this.placeholder}" />
                    </div>
                </div>
            </div>
        `;
    }

    // Method to add a tag
    addTag(tag) {
        if (tag && !this.tags.includes(tag)) {
            this.tags.push(tag);
            this.renderTags(); // Update the display after adding a tag
        }
    }

    // Method to remove a tag
    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
        this.renderTags(); // Update the display after removing a tag
    }

    // Method to render the tags
    renderTags() {
        const tagContainer = document.getElementById(`tag-container-${this.id}`);
        tagContainer.innerHTML = ''; // Clear the container

        this.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;

            // Add a click event to remove the tag
            tagElement.addEventListener('click', () => this.removeTag(tag));
            tagContainer.appendChild(tagElement);
        });
    }

    static init(args, selectorDiv) {
        const id = args[0];
        const instance = new TAG(id, args[1]);
        const html = instance.render();

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);

        // Event listener to add tags from the textarea
        const textareaField = document.getElementById(id);
        textareaField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const tagValues = textareaField.value.split('\n'); // Split by new line
                tagValues.forEach(tagValue => {
                    const trimmedValue = tagValue.trim();
                    if (trimmedValue) {
                        instance.addTag(trimmedValue);
                    }
                });
                textareaField.value = ''; // Clear the textarea
            }
        });

        // Render existing tags if any
        instance.renderTags();
    }
}
