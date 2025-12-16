class ICON {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'Icon'; // Default label
        this.defaultValue = args.default_value || ''; // Default icon class
        this.value = args.value || this.defaultValue; // Use the provided value or default_value if not set
        this.randid = Math.random().toString(36).substr(2, 9); // Generate a random ID
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <div class="icon-box">
                        <input type="hidden" class="icon-${this.randid}" id="${this.id}" name="${this.id}" value="${this.value}" />
                        <span class="icon-trashs"><i class="fa fa-trash"></i></span>
                        <div class="icon-selected">
                            <i class="${this.value || this.defaultValue}"></i>
                        </div>
                        <div class="icon-hover" rand-id="${this.randid}">
                            <div>Choose Icon</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static init(args) {
        const id = args[0];
        const instance = new ICON(id, args[1]);
        const html = instance.render();

        // Initialize icon selection behavior
        $(document).ready(function() {
            $(".icon-hover").on("click", function(event) {
                const currentitem = $(event.currentTarget).attr('rand-id'); // Get the unique identifier from the button
                let currentitemval = $('.icon-' + currentitem).val();

                const values = {
                    selectedFiles: currentitemval, // Comma-separated string
                    popType: 'single_select', // Change as needed
                    popFileType: 'icon', // Change as needed
                    dataSelector: '.icon-' + currentitem,
                    dataFor: 'icon', // icon / else
                };
                myModalIcon.open(values); // Function to open modal for selecting icons
            });
        });

        // Event listener for removing the icon
        $(document).on("click", ".icon-trashs", function() {
            const iconBox = $(this).closest('.icon-box');
            iconBox.find('input[type="hidden"]').val(''); // Clear the hidden input
            iconBox.find('.icon-selected i').attr('class', ''); // Clear the displayed icon class

            $('#editor-form').trigger('change');
        });

        // Return the generated HTML (instead of appending it to a specific container)
        return html;
    }
}



// const args = [
//     'iconId', // Unique ID for the icon
//     {
//         label: 'Select an Icon',
//         default_value: 'fa fa-star', // Default icon class
//         value: 'fa fa-heart', // Current icon value if needed
//         label_block: true // Set to true if the label should be block-level
//     }
// ];

// // Get the HTML for the icon field
// const iconHtml = ICON.init(args);

// // Append the generated HTML to your desired container
// $('#icon-container').append(iconHtml);
