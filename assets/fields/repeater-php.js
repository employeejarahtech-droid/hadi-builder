$(document).ready(function () {
    
    $(document).on('click', '.add-item', function (e) {
        e.preventDefault();   
    
        const $repeater = $(this).closest('.repeater-control');
        const $itemsContainer = $repeater.find('.repeater-items');
        const itemIndex = $itemsContainer.children('.repeater-item').length;
        const controlId = $repeater.attr('id'); // Use the control ID from the parent
    
        // Get the fields template from the data-dummy attribute
        const fields = $repeater.data('dummy'); // Retrieves the JSON-encoded fields
    
        let parsedFields;
        if (typeof fields === 'string') {
            parsedFields = JSON.parse(fields);
        } else {
            parsedFields = fields; // If it's already an object, use it directly
        }
    
        let $newItem = `<div class='repeater-item' draggable='true'>
            <div class='item-title-bar'>
                <label class='item-title'>Item ${itemIndex}</label>
                <button class='toggle-item' tabindex='0'>+</button>
            </div>
            <div class='repeater-content' style='display: none;'>`;

        parsedFields.forEach(field => {
            const args = [
                `${controlId}[${itemIndex}][${field.id}]`, // id for the input/textarea field
                {
                    label: field.label,
                    placeholder: field.placeholder || '', // Provide a placeholder if exists
                    value: field.value || '', // Optional value, if any
                    label_block: field.label_block !== undefined ? field.label_block : false, // Dynamically set label_block
                    options: field.options || [] // Add the options array if available
                }
            ];      
        
            let fieldHtml = '';
        
            // Switch statement to handle different field types
            switch (field.type) {
                case 'textarea':
                    fieldHtml = TEXTAREA.init(args); // Use TEXTAREA for textarea fields
                    break;
        
                case 'text':
                case 'email':
                case 'password':
                    fieldHtml = TEXT.init(args); // Use TEXT for text, email, password fields
                    break;
        
                case 'checkbox':
                    fieldHtml = CHECKBOX.init(args); // Use TEXTAREA for textarea fields
                    break;

                case 'select':
                    // Use SELECT.init for select fields
                    fieldHtml = SELECT.init(args); // Use SELECT for select fields
                    break;
        
                case 'media':
                    // Use MEDIA.init for media fields (e.g., image upload)
                    fieldHtml = MEDIA.init(args); // Use MEDIA for media (image, file upload) fields
                    break;
        
                case 'icon':
                    // Use ICON.init for icon fields
                    fieldHtml = ICON.init(args); // Use ICON for icon fields
                    break;

                case 'url':
                    // Use ICON.init for icon fields
                    fieldHtml = URLinput.init(args); // Use ICON for icon fields
                    break;

                case 'ckeditor':
                    // Use ICON.init for icon fields
                    fieldHtml = CKEditor.init(args); // Use ICON for icon fields
                    break;

                case 'repeater':
                    // Use ICON.init for icon fields
                    fieldHtml = REPEATER.init(args); // Use ICON for icon fields
                    break;
        
                default:
                    console.warn(`Unsupported field type: ${field.type}`);
                    break;
            }
        
            // Add the generated HTML to the $newItem string
            $newItem += `
                <div class='control-${field.type}'>
                    ${fieldHtml}
                </div>`;
        });
        
        
    
        $newItem += `<button class='remove-item'>Remove</button>
            </div>
        </div>`;
    
        $itemsContainer.append($newItem);
        
        // Update the title for the new item
        const $newTitle = $itemsContainer.find('.repeater-item').last().find('.item-title');
        const $newMethodNameInput = $itemsContainer.find('.repeater-item').last().find("input[name^='" + controlId + "'][name$='[method_name]']");
        $newTitle.text($newMethodNameInput.val() || 'Item'); // Set initial title
    });

    $(document).on('click', '.toggle-item', function (e) {
        e.preventDefault();
        const $button = $(this);
        const $repeater = $button.closest('.repeater-control');
        const $allContents = $repeater.find('.repeater-content');
    
        // Close all contents first and reset all toggle buttons to '+'
        $allContents.slideUp();
        $allContents.prev().find('.toggle-item').text('+');
    
        // If the clicked item is currently closed, open it
        const $content = $button.closest('.item-title-bar').next('.repeater-content');
        
        // If the clicked item is already visible, we close it, otherwise, we toggle it open
        if ($content.is(':visible')) {
            $content.slideUp(); // Close the content
            $button.text('+'); // Reset the button to '+'
        } else {
            $content.slideDown(); // Open the content
            $button.text('-'); // Change button to '-'
        }
    });
    

    $(document).on('click', '.remove-item', function () {
        $(this).closest('.repeater-item').remove();
    });

    $(document).on('input', ".repeater-content input", function () {
        const $input = $(this);
        const $item = $input.closest('.repeater-item'); // Get the closest repeater item
        
        // Find the first input field in the current repeater item
        const methodName = $item.find("input").first().val(); // Select the first input
        const $title = $item.find('.item-title'); // Find the item title element
        
        // Update the title based on the first input value or set a default
        $title.text(methodName || 'Item');
    });    

    // Drag and Drop Functionality
    let draggedItem;

    $(document).on('dragstart', '.repeater-item', function (e) {
        draggedItem = $(this); // Store the dragged item
        e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    $(document).on('dragover', '.repeater-item', function (e) {
        e.preventDefault(); // Prevent default to allow drop
        e.originalEvent.dataTransfer.dropEffect = 'move'; // Change cursor to move
    });

    $(document).on('drop', '.repeater-item', function (e) {
        e.preventDefault();
        if (draggedItem) {
            // Insert the dragged item before the item it's dropped on
            $(this).before(draggedItem);
            draggedItem = null; // Reset dragged item
        }
    });

    $(document).on('dragend', '.repeater-item', function () {
        draggedItem = null; // Reset dragged item when drag ends
    });

});
