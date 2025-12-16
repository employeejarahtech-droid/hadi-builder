class SVG {
    constructor(id, args) {
        this.id = id;
        this.label = args.label || 'SVG Icon';
        this.defaultValue = args.default_value || '';
        this.value = args.value || this.defaultValue;
        this.randid = Math.random().toString(36).substr(2, 9);
    }

    render() {
        return `
            <div class="block-col block-row">
                <div class="label">
                    <label for="${this.id}">${this.label}</label>
                </div>
                <div class="field">
                    <div class="svg-box">
                        <input type="hidden" class="svg-${this.randid}" id="${this.id}" name="${this.id}" value="${this.value}" />
                        <span class="svg-trashs" aria-label="Remove SVG"><i class="fa fa-trash"></i></span>
                        <div class="svg-selected">
                            <svg class="${this.value || this.defaultValue}"></svg>
                        </div>
                        <div class="svg-hover" rand-id="${this.randid}" role="button" tabindex="0" aria-label="Choose SVG Icon">
                            <div>Choose SVG Icon</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static init(args, selectorDiv) {
        const id = args[0];
        const instance = new SVG(id, args[1]);
        const html = instance.render();

        $(selectorDiv).append(html);

        // Initialize SVG selection behavior
        $(document).on("click", ".svg-hover", function(event) {
            const currentitem = $(event.currentTarget).attr('rand-id');
            let currentitemval = $('.svg-' + currentitem).val();

            const values = {
                selectedFiles: currentitemval,
                popType: 'single_select',
                popFileType: 'svg',
                dataSelector: '.svg-' + currentitem,
                dataFor: 'svg',
            };
            myModalSVG.open(values);
        });

        // Event listener for removing the SVG
        $(document).on("click", ".svg-trashs", function() {
            const iconBox = $(this).closest('.svg-box'); // Update to correct class
            iconBox.find('input[type="hidden"]').val(''); // Clear the hidden input
            iconBox.find('.svg-selected svg').attr('class', ''); // Clear the displayed SVG class
        });
    }
}

// Example Usage
// const args = [
//     'svgId',
//     {
//         label: 'Select an SVG Icon',
//         default_value: 'svg-class-name',
//         value: 'current-svg-class-name',
//         label_block: true
//     }
// ];
// const selectorDiv = '#svg-container';
// SVG.init(args, selectorDiv);
