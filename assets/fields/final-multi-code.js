class MULTIREPEATER {
    static init(args, selectorDiv) {
        this.args = args;
        this.fields = args[1].items_field;

        const settings = this.args[1];
        const items = settings.value || []; // Use settings.value for existing items

        // Generate HTML structure
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

        // Append the generated HTML to the target element
        $(selectorDiv).append(html);

        // Initialize event listeners
        this.initEventListeners(settings.item_selector, settings);
    }

    static initEventListeners(controlId, settings) {

        
        $(document).ready(function () {
            let draggedItem = null;


            console.log(JSON.stringify(settings));


            

            function updateItemTitle($input) {
                const $itemTitle = $input.closest(`.repeater-item-multi-${controlId}`).find('.item-title-multi');
                const newTitle = $input.val() || 'Item';
                $itemTitle.text(newTitle);
            }

            function toggleItemContent($toggleButton) {
                const $currentContent = $toggleButton.closest('.item-title-bar').next('.repeater-content-multi');
                const $allContents = $toggleButton.closest(`.repeater-control-multi-${controlId}`).find('.repeater-content-multi');

                $allContents.each(function() {
                    if ($(this).is(':visible') && $(this).get(0) !== $currentContent.get(0)) {
                        $(this).slideUp();
                        $(this).prev('.item-title-bar').find('.toggle-item-multi').text('+');
                    }
                });

                $currentContent.slideToggle(function() {
                    const isVisible = $(this).is(':visible');
                    $toggleButton.text(isVisible ? '-' : '+');
                });
            }

            function toggleNestedItemContent($toggleButton) {
                const $currentContent = $toggleButton.closest('.item-title-bar').next('.nested-content');
                $currentContent.slideToggle(function() {
                    const isVisible = $(this).is(':visible');
                    $toggleButton.text(isVisible ? '-' : '+');
                });
            }

            $(document).on('click', `.add-item-multi`, function (e) {
                e.preventDefault();
                const $repeater = $(this).closest(`.repeater-control-multi-${controlId}`);
                const $itemsContainer = $repeater.find(`.repeater-items-multi`);
                const itemIndex = $itemsContainer.children().length;

                let $newItem = `
                    <div class='repeater-item-multi-${controlId}' draggable='true'>
                        <div class='item-title-bar'>
                            <label class='item-title-multi'>Item</label>
                            <button class='toggle-item-multi' tabindex='0'>+</button>
                        </div>
                        <div class='repeater-content-multi' style='display: none;'>
                            ${MULTIREPEATER.fields.map(field => MULTIREPEATER.renderField(field, {}, itemIndex)).join('')}
                            <button class='remove-item-multi'>Remove</button>
                            <div class='nested-repeater-multi'>
                                <div class='nested-title'>Nested Repeater 1</div>
                                <div class='nested-items-multi'></div>
                                <button class='add-nested-item-multi'>Add Nested Item</button>
                            </div>
                            <div class='nested-repeater-2-multi'>
                                <div class='nested-title'>Nested Repeater 2</div>
                                <div class='nested-items-2-multi'></div>
                                <button class='add-nested-item-2-multi'>Add Nested Item</button>
                            </div>
                        </div>
                    </div>`;

                $itemsContainer.append($newItem);
            });

            $(document).on('click', `.add-nested-item-multi`, function (e) {
                e.preventDefault();
                const $nestedItemsContainer = $(this).siblings('.nested-items-multi');
                const nestedIndex = $nestedItemsContainer.children().length;

                let $newNestedItem = `
                    <div class='nested-item-multi'>
                        <div class='item-title-bar'>
                            <label class='item-title-multi'>Nested Payment Method</label>
                            <button class='toggle-item-multi-nested' tabindex='0'>+</button>
                        </div>
                        <div class='nested-content' style='display: block;'>
                            <input type="text" name="nested_payment_methods[${nestedIndex}][method_name]" placeholder="Enter nested method name">
                            <select name="nested_payment_methods[${nestedIndex}][method_type]">
                                <option value="">Select Method Type</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                            <button class='remove-nested-item'>Remove</button>
                        </div>
                    </div>`;

                $nestedItemsContainer.append($newNestedItem);
            });

            $(document).on('click', `.add-nested-item-2-multi`, function (e) {
                e.preventDefault();
                const $nestedItemsContainer = $(this).siblings('.nested-items-2-multi');
                const nestedIndex = $nestedItemsContainer.children().length;

                let $newNestedItem = `
                    <div class='nested-item-2-multi'>
                        <div class='item-title-bar'>
                            <label class='item-title-multi'>Nested Payment Method</label>
                            <button class='toggle-item-multi-nested' tabindex='0'>+</button>
                        </div>
                        <div class='nested-content' style='display: block;'>
                            <input type="text" name="nested_payment_methods_2[${nestedIndex}][method_name]" placeholder="Enter nested method name">
                            <button class='remove-nested-item'>Remove</button>
                        </div>
                    </div>`;
                $nestedItemsContainer.append($newNestedItem);
            });

            $(document).on('click', `.toggle-item-multi`, function (e) {
                e.preventDefault();
                toggleItemContent($(this));
            });

            $(document).on('click', `.toggle-item-multi-nested`, function (e) {
                e.preventDefault();
                toggleNestedItemContent($(this));
            });

            $(document).on('click', `.remove-item-multi`, function () {
                $(this).closest(`.repeater-item-multi-${controlId}`).remove();
            });

            $(document).on('click', `.remove-nested-item`, function (e) {
                e.preventDefault(); // Prevent default action
                $(this).closest('.nested-item-multi').remove();
            });

            // Drag-and-drop functionality
            $(document).on('dragstart', `.repeater-item-multi-${controlId}, .nested-item-multi`, function (event) {
                draggedItem = $(this);
                event.originalEvent.dataTransfer.effectAllowed = 'move';
                $(this).addClass('dragging');
            });

            $(document).on('dragover', `.repeater-item-multi-${controlId}, .nested-item-multi`, function (event) {
                event.preventDefault();
                $(this).addClass('drag-over');
            });

            $(document).on('dragleave', `.repeater-item-multi-${controlId}, .nested-item-multi`, function () {
                $(this).removeClass('drag-over');
            });

            $(document).on('drop', `.repeater-item-multi-${controlId}, .nested-item-multi`, function (event) {
                event.preventDefault();
                $(this).removeClass('drag-over');
                if (draggedItem) {
                    if ($(this).is(draggedItem)) return;
                    draggedItem.insertBefore($(this));
                    draggedItem.removeClass('dragging');
                    draggedItem = null;
                }
            });

            $(document).on('dragend', function () {
                $(`.repeater-item-multi-${controlId}, .nested-item-multi`).removeClass('drag-over dragging');
                draggedItem = null;
            });
        });
    }

    static renderItem(item, index) {
        return `
            <div class="repeater-item-multi-${this.args[1].item_selector}" draggable="true">
                <div class="item-title-bar">
                    <label class="item-title-multi">${item.method_name || 'Payment Method'}</label>
                    <button class="toggle-item-multi" tabindex="0">+</button>
                </div>
                <div class="repeater-content-multi" style="display: none;">
                    ${this.fields.map(field => this.renderField(field, item, index)).join('')}
                    ${this.renderNestedRepeaters(item, index)}
                    <button class="remove-item-multi">Remove</button>
                </div>
            </div>
        `;
    }

    static renderNestedRepeaters(item, index) {

        const nestedItems1 = item.nested_buttons || []; // Updated here
        const nestedItems2 = item.nested_images || [];  // Updated here

        return `
            <div class="nested-repeater-multi">
                <div class="nested-title">Nested Repeater 1</div>
                <div class="nested-items-multi">
                    ${nestedItems1.map((nestedItem, nestedIndex) => this.renderNestedItem(nestedItem, index, nestedIndex)).join('')}
                </div>
                <button class="add-nested-item-multi">Add Nested Item</button>
            </div>
            <div class="nested-repeater-2-multi">
                <div class="nested-title">Nested Repeater 2</div>
                <div class="nested-items-2-multi">
                    ${nestedItems2.map((nestedItem, nestedIndex) => this.renderNestedItem2(nestedItem, index, nestedIndex)).join('')}
                </div>
                <button class="add-nested-item-2-multi">Add Nested Item</button>
            </div>
        `;
    }

    static renderField(field, item, prefix) {
        const fieldId = field.id;
        const value = item[fieldId] || '';

        if (field.type === 'text') {
            return `
                <label for="${prefix}_${fieldId}">${field.label}</label>
                <input type="text" id="${prefix}_${fieldId}" name="${prefix}_${fieldId}" placeholder="${field.placeholder}" value="${value}">
            `;
        } else if (field.type === 'textarea') {
            return `
                <label for="${prefix}_${fieldId}">${field.label}</label>
                <textarea id="${prefix}_${fieldId}" name="${prefix}_${fieldId}" placeholder="${field.placeholder}">${value}</textarea>
            `;
        }
        return '';
    }

    static renderNestedItem(nestedItem, index, nestedIndex) {
        return `
            <div class="nested-item-multi">
                <div class="item-title-bar">
                    <label class="item-title-multi">${nestedItem.method_name || 'Nested Payment Method'}</label>
                    <button class="toggle-item-multi-nested" tabindex="0">+</button>
                </div>
                <div class="nested-content" style="display: block;">
                    ${this.renderNestedFields(nestedItem)}
                    <button class="remove-nested-item">Remove</button>
                </div>
            </div>
        `;
    }

    static renderNestedFields(nestedItem) {
        const fields = [
            { id: 'method_name_text', label: 'Method Name (Text)', type: 'text', placeholder: 'Enter method name', value: nestedItem.method_name_text || '' },
            { id: 'method_name_textarea', label: 'Method Name (Textarea)', type: 'textarea', placeholder: 'Enter method name', value: nestedItem.method_name_textarea || '' }
        ];

        return fields.map(field => {
            return this.renderField(field, nestedItem, 'nested');
        }).join('');
    }

    static renderNestedItem2(nestedItem, index, nestedIndex) {
        return `
            <div class="nested-item-2-multi">
                <div class="item-title-bar">
                    <label class="item-title-multi">${nestedItem.method_name || 'Nested Payment Method'}</label>
                    <button class="toggle-item-multi-nested" tabindex="0">+</button>
                </div>
                <div class="nested-content" style="display: block;">
                    ${this.renderNestedField2(nestedItem)}
                    <button class='remove-nested-item'>Remove</button>
                </div>
            </div>
        `;
    }

    static renderNestedField2(nestedItem) {
        const fields = [
            { id: 'method_name', label: 'Method Name', type: 'text', placeholder: 'Enter method name', value: nestedItem.method_name || '' }
        ];

        return fields.map(field => {
            return this.renderField(field, nestedItem, 'nested');
        }).join('');
    }
}
