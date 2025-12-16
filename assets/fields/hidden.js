class HIDDEN {
    constructor(name, value) {
        this.name = name;
        this.value = value || ''; // Default to an empty string if no value is provided
    }

    render() {
        return `<input type="hidden" name="${this.name}" value="${this.value}" />`;
    }

    static init(args, selectorDiv) {
        const name = args[0];
        const value = args[1] || '';
        const instance = new HIDDEN(name, value);
        const hiddenInputHtml = instance.render();

        // Append the generated HTML to the specified selector
        $(selectorDiv).append(hiddenInputHtml);
    }
}

// Example usage:
// HIDDEN.init(['hiddenFieldName', 'hiddenValue'], '#yourDiv');
