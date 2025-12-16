class GALLERY {
    constructor(args, selectorDiv) {
        this.id = args[0];
        this.label = args[1].label;
        this.randid = args[1].selector_id;
        this.imagesList = []; // Array to hold selected image data specific to this instance

        this.initGallery(selectorDiv);
        this.initEventListeners();
    }

    initGallery(selectorDiv) {
        const galleryHtml = `
            <div class="block-col block-row" id="custom-gallery-${this.randid}">
                <div class="label inline-items">
                    <label for="${this.id}">${this.label}</label>
                    <button id="open-modal-${this.randid}" rand-id="${this.randid}" type="button">Select Images</button>
                </div>
                <div class="field">
                    <input type="hidden" class="rand-${this.randid}" id="${this.id}" name="${this.id}" />
                    <div id="gallery-preview-${this.randid}" class="gallery-box"></div>
                </div>
            </div>
        `;

        $(selectorDiv).append(galleryHtml);

        
    }

    initEventListeners() {
        // Open the modal when the button is clicked
        $(document).on('click', `#open-modal-${this.randid}`, (event) => {
            const currentitem = $(event.currentTarget).attr('rand-id'); // Get the unique identifier from the button
            const existingImages = $('.rand-' + currentitem).val().split(',').filter(Boolean);

            const values = {
                selectedFiles: existingImages, // Comma-separated string
                popType: 'multiple_select', // Change as needed
                popFileType: 'image', // Change as needed
                dataSelector: '.rand-'  + currentitem,
                dataFor: 'gallery', // media / gallery / else
            };
            myModal.open(values);

        });

    }

    static init(args, selectorDiv) {
        new GALLERY(args, selectorDiv);
    }
}

// Example usage
// document.addEventListener('DOMContentLoaded', () => {
//     const selectorDiv = '#form-container'; // Change to your target container

//     const argsgallery = ['gallery-id', { label: 'My Gallery', selector_id: 'random-selector-id' }];
//     GALLERY.init(argsgallery, selectorDiv);

//     const argsgalleryy = ['gallery-id-2', { label: 'My Gallery', selector_id: 'random-selector-id-2' }];
//     GALLERY.init(argsgalleryy, selectorDiv);
// });
