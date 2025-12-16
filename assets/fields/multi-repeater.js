class MULTIREPEATER {
    static init(args, selectorDiv) {
        this.args = args;
        this.fields = args[1].items_field;

        const settings = this.args[1];
        const items = settings.value || [];

        const html = `
        <div class="repeater-control-multi-${settings.item_selector}" id="${settings.item_selector}">
            <div class="repeater-title-multi">${settings.label}</div>
            <div class="repeater-items-multi">
                ${items.map((item, index) => this.renderItem(item, index)).join('')}
            </div>
            <div class="add-more-btn">
                <button class="add-item-multi">Add Item</button>
            </div>
        </div>
        `;

        $(selectorDiv).append(html);
        this.initEventListeners(settings.item_selector);
        this.initDragAndDrop(settings.item_selector);
    }

    static initEventListeners(controlId) {
        $(document).ready(function () {
            $(document).on('click', `.add-item-multi`, function (e) {
                e.preventDefault();
                const $repeater = $(this).closest(`.repeater-control-multi-${controlId}`);
                const $itemsContainer = $repeater.find(`.repeater-items-multi`);
                const itemIndex = $itemsContainer.children().length;
    
                let $newItem = MULTIREPEATER.renderNewItem(itemIndex);
                $itemsContainer.append($newItem);
                MULTIREPEATER.initDragAndDrop(controlId); // Reinitialize drag-and-drop after adding a new item
            });
    
            // Toggle nested items
            $(document).on('click', `.toggle-nested`, function (e) {
                e.preventDefault();
                const $currentItem = $(this).closest('.repeater-item-multi-slider_id_selector');
                const $nestedItemsContainer = $currentItem.find('.nested-repeater-content');
    
                // Hide all other nested containers in sibling items
                $currentItem.siblings('.repeater-item-multi-slider_id_selector').each(function() {
                    const $siblingNestedContainer = $(this).find('.nested-repeater-content');
                    $siblingNestedContainer.hide(); // Hide the nested content
                    $(this).find('.toggle-nested').text('+'); // Reset toggle button to '+'
                });
    
                // Toggle the current nested container
                const isVisible = $nestedItemsContainer.is(':visible');
                $nestedItemsContainer.toggle(!isVisible);
                $(this).text(isVisible ? '+' : '-'); // Update the toggle button text
            });
    
            // Event listeners for adding and removing nested items
            $(document).on('click', `.add-nested-item-multi-button-list`, function (e) {
                e.preventDefault();
                const $nestedItemsContainer = $(this).siblings('.nested-items-multi');
                const nestedIndex = $nestedItemsContainer.children().length;
    
                let $newNestedItem = MULTIREPEATER.renderNestedItem({}, nestedIndex);
                $nestedItemsContainer.append($newNestedItem);
            });
    
            $(document).on('click', `.add-nested-item-multi-image-list`, function (e) {
                e.preventDefault();
                const $nestedItemsContainer = $(this).siblings('.nested-items-multi');
                const nestedIndex = $nestedItemsContainer.children().length;
    
                let $newNestedImageItem = MULTIREPEATER.renderNestedImageItem({}, nestedIndex);
                $nestedItemsContainer.append($newNestedImageItem);
            });
    
            $(document).on('click', `.remove-item-multi`, function () {
                $(this).closest(`.repeater-item-multi-${controlId}`).remove();
            });
    
            $(document).on('click', `.remove-nested-item`, function (e) {
                e.preventDefault();
                $(this).closest('.nested-item-multi').remove();
            });

            // Initialize media selection behavior
            $(document).on("click", ".media-hover", function(event) {
                const currentitem = $(event.currentTarget).attr('rand-id'); // Get the unique identifier from the button
                let currentitemval = $('.media-' + currentitem).val();

                const values = {
                    selectedFiles: currentitemval, // Comma-separated string
                    popType: 'single_select', // Change as needed
                    popFileType: 'image', // Change as needed
                    dataSelector: '.media-' + currentitem,
                    dataFor: 'media', // media / gallery / else
                };
                myModal.open(values);
            });

            // Event listener for removing the media item
            $(document).on("click", ".media-trash", function() {
                const mediaBox = $(this).closest('.media-box');
                mediaBox.find('input[type="hidden"]').val(''); // Clear the hidden input
                mediaBox.find('.media-selected-image img').attr('src', ''); // Clear the displayed image
            });

        });

    }
    

    static initDragAndDrop(controlId) {
        const $itemsContainer = $(`.repeater-items-multi`);
    
        $itemsContainer.on('dragstart', '.repeater-item-multi', function (e) {
            e.originalEvent.dataTransfer.setData('text/plain', $(this).index());
            $(this).addClass('dragging');
        });
    
        $itemsContainer.on('dragend', '.repeater-item-multi', function () {
            $(this).removeClass('dragging');
        });
    
        $itemsContainer.on('dragover', '.repeater-item-multi', function (e) {
            e.preventDefault(); // Prevent default to allow drop
            const draggingItem = $itemsContainer.find('.dragging');
            const currentItem = $(this);
    
            if (draggingItem.index() < currentItem.index()) {
                currentItem.after(draggingItem);
            } else {
                currentItem.before(draggingItem);
            }
        });
    
        $itemsContainer.on('drop', '.repeater-item-multi', function (e) {
            e.preventDefault();
            const index = e.originalEvent.dataTransfer.getData('text/plain');
            const draggingItem = $itemsContainer.children().eq(index);
            $(this).removeClass('dragging'); // Clear class on drop
        });
    
        // Optional: Add visual feedback on drag over
        $itemsContainer.on('dragenter', '.repeater-item-multi', function () {
            $(this).addClass('drag-over');
        });
    
        $itemsContainer.on('dragleave', '.repeater-item-multi', function () {
            $(this).removeClass('drag-over');
        });
    }
    

    static renderItem(item, index) {
        return `
            <div class="repeater-item-multi-${this.args[1].item_selector}" draggable="true">
                <div class="item-title-bar">
                    <label class="item-title-multi">${item.title || `Item ${index + 1}`}</label>
                    <button class="toggle-nested">+</button>
                </div>
                <div class="nested-repeater-content" style="display:none;">
                    <div class="repeater-content-multi">
                        ${this.fields.map(field => this.renderField(field, item, index)).join('')}
                        ${this.renderNestedRepeaters(item)}
                        <button class="remove-item-multi">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }

    static renderNestedRepeaters(item) {
        return `
            <div class="nested-repeater-button-list-multi">
                <div class="nested-title">Slider Button List</div>
                <div class="nested-items-multi">
                    ${item.slider_button_list ? item.slider_button_list.map((nestedItem, nestedIndex) => this.renderNestedItem(nestedItem, nestedIndex)).join('') : ''}
                </div>
                <button class="add-nested-item-multi-button-list">Add Nested Button</button>
            </div>
            <div class="nested-repeater-image-list-multi">
                <div class="nested-title">Slider Image List</div>
                <div class="nested-items-multi">
                    ${item.slider_images_list ? item.slider_images_list.map((nestedItem, nestedIndex) => this.renderNestedImageItem(nestedItem, nestedIndex)).join('') : ''}
                </div>
                <button class="add-nested-item-multi-image-list">Add Nested Image</button>
            </div>
        `;
    }

    static renderNestedItem(nestedItem, nestedIndex) {
        const buttonTitle = nestedItem.button_title || `Nested Button ${nestedIndex + 1}`;
        const buttonLink = nestedItem.button_link || '';
        const buttonTypeOptions = this.renderSelectOptions(nestedItem.button_type);
    
        let additionalFields = '';
    
        // Conditionally render additional fields based on nestedItem properties
        if (nestedItem.someOtherProperty) {
            additionalFields += `
                <label class="item-title-multi">Some Other Property</label>
                <input type="text" placeholder="Enter value" value="${nestedItem.someOtherProperty || ''}">
            `;
        }
    
        if (nestedItem.anotherProperty) {
            additionalFields += `
                <label class="item-title-multi">Another Property</label>
                <textarea placeholder="Enter details">${nestedItem.anotherProperty || ''}</textarea>
            `;
        }
    
        return `
            <div class="nested-item-multi">
                <label class="item-title-multi">${buttonTitle}</label>
                <input type="text" placeholder="Enter button title" value="${buttonTitle}">
                <label class="item-title-multi">${buttonLink ? 'Link' : ''}</label>
                <textarea placeholder="Enter link">${buttonLink}</textarea>
                <label class="item-title-multi">Button Type</label>
                <select>
                    ${buttonTypeOptions}
                </select>
                ${additionalFields}
                <button class="remove-nested-item">Remove Nested Item</button>
            </div>
        `;
    }
    

    static renderNestedImageItem(nestedItem, nestedIndex) {
        const mediaName = nestedItem.slider_media || `Nested Media ${nestedIndex + 1}`;
        const animationTypeOptions = this.renderAnimationOptions(nestedItem.animation_type);
    
        // Media field rendering
        const mediaField = `
            <div class="block-col block-row">
                <div class="label">
                    <label for="slider_media_${nestedIndex}">Upload Image</label>
                </div>
                <div class="field">
                    <div class="media-box">
                        <input type="hidden" class="media-${nestedIndex}" id="slider_media_${nestedIndex}" name="slider_media_${nestedIndex}" value="${nestedItem.slider_media || ''}" />
                        <span class="media-trash"><i class="fa fa-trash"></i></span>
                        <div class="media-selected-image">
                            <img src="${nestedItem.slider_media || 'default_image.jpg'}" alt="Selected Image" />
                        </div>
                        <div class="media-hover" rand-id="${nestedIndex}">
                            <div>Choose Image</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        // Additional fields (if any)
        const additionalFields = [];
        if (nestedItem.someOtherProperty) {
            additionalFields.push(`
                <label class="item-title-multi">Some Other Property</label>
                <input type="text" placeholder="Enter value" value="${nestedItem.someOtherProperty || ''}">
            `);
        }
    
        if (nestedItem.anotherProperty) {
            additionalFields.push(`
                <label class="item-title-multi">Another Property</label>
                <textarea placeholder="Enter details">${nestedItem.anotherProperty || ''}</textarea>
            `);
        }
    
        return `
            <div class="nested-item-multi">
                ${mediaField}
                <label class="item-title-multi">Button Type</label>
                <select>
                    ${animationTypeOptions}
                </select>
                ${additionalFields.join('')}
                <button class="remove-nested-item">Remove Nested Image</button>
            </div>
        `;
    }
    
    // Helper function to render select options
    static renderSelectOptions(selectedValue) {
        const options = [
            { id: 'primary-btn', name: 'Primary Button' },
            { id: 'primary-btn-outline', name: 'Primary Button Outline' },
            { id: 'secondary-btn', name: 'Secondary Button' },
            { id: 'secondary-btn-outline', name: 'Secondary Button Outline' },
            { id: 'btn-bg-white', name: 'Button Bg White' },
            { id: 'btn-plain', name: 'Plain Button' },
            { id: 'btn-play', name: 'Play Button' },
        ];
        return options.map(option => `
            <option value="${option.id}" ${option.id === selectedValue ? 'selected' : ''}>${option.name}</option>
        `).join('');
    }

    static renderAnimationOptions(selectedValue) {
        const options = [
            { id: 'fade-in', name: 'Fade In' },
            { id: 'zoom-in', name: 'Zoom In' },
            { id: 'from-top', name: 'From Top' },
            { id: 'from-left', name: 'From Left' },
            { id: 'from-right', name: 'From Right' },
            { id: 'from-bottom', name: 'From Bottom' },
        ];
        return options.map(option => `
            <option value="${option.id}" ${option.id === selectedValue ? 'selected' : ''}>${option.name}</option>
        `).join('');
    }


    static renderField(field, item, index) {
        const fieldId = field.id;
        const value = item[fieldId] || '';
        const defaultValue = field.defaultValue || ''; // You can define a default value if needed
    
        switch (field.type) {
            case 'text':
                return `
                    <label for="${index}_${fieldId}">${field.label}</label>
                    <input type="text" id="${index}_${fieldId}" name="${index}_${fieldId}" placeholder="${field.placeholder}" value="${value}">
                `;
            case 'textarea':
                return `
                    <label for="${index}_${fieldId}">${field.label}</label>
                    <textarea id="${index}_${fieldId}" name="${index}_${fieldId}" placeholder="${field.placeholder}">${value}</textarea>
                `;
            case 'select':
                const options = field.select_items.map(option => `
                    <option value="${option.id}" ${option.id === value ? 'selected' : ''}>${option.name}</option>
                `).join('');
                return `
                    <label for="${index}_${fieldId}">${field.label}</label>
                    <select id="${index}_${fieldId}" name="${index}_${fieldId}">
                        ${options}
                    </select>
                `;
            case 'media':
                return `
                    <div class="block-col block-row">
                        <div class="label">
                            <label for="${fieldId}">${field.label}</label>
                        </div>
                        <div class="field">
                            <div class="media-box">
                                <input type="hidden" class="media-${index}" id="${fieldId}" name="${fieldId}" value="${value}" />
                                <span class="media-trash"><i class="fa fa-trash"></i></span>
                                <div class="media-selected-image">
                                    <img src="${value || defaultValue}" alt="" />
                                </div>
                                <div class="media-hover" rand-id="${index}">
                                    <div>Choose Image</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return '';
        }
    }
    
    

    static renderNewItem(itemIndex) {
        return `
            <div class="repeater-item-multi-${this.args[1].item_selector}" draggable="true">
                <div class="item-title-bar">
                    <label class="item-title-multi">Item ${itemIndex + 1}</label>
                    <button class="toggle-nested">+</button>
                </div>
                <div class="nested-repeater-content" style="display:none;">
                    <div class="repeater-content-multi">
                        ${this.fields.map(field => this.renderField(field, {}, itemIndex)).join('')}
                        ${this.renderNestedRepeaters({})}
                        <button class="remove-item-multi">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }
}
