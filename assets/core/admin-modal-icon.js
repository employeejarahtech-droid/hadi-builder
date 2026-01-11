class ModalIcon {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);

        if (!this.modal) {
            console.error(`Modal with ID "${modalId}" not found in DOM`);
            return;
        }

        this.closeButton = this.modal.querySelector('.close, .media-modal-close');
        this.confirmButton = this.modal.querySelector('#confirm-selection');

        this.selectedIcons = [];
        this.popType = 'single_select';
        this.dataSelector = '';
        this.dataFor = '';

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        if (this.confirmButton) {
            this.confirmButton.addEventListener('click', () => this.confirmSelection());
        }

        this.bindCategoryClick();
    }

    open(values) {
        if (!this.modal) {
            console.error('Cannot open modal: modal not initialized');
            return;
        }
        this.setValues(values);
        this.populateIconGallery(); // Populate with predefined icon data
        this.modal.style.display = 'flex';
    }

    close() {
        if (!this.modal) {
            return;
        }
        this.resetValues();
        this.modal.style.display = 'none';
    }

    setValues(values) {
        if (values.selectedFiles && typeof values.selectedFiles === 'string') {
            this.selectedIcons = [values.selectedFiles];
        } else {
            this.selectedIcons = values.selectedFiles || [];
        }
        this.popType = values.popType || this.popType;
        this.dataSelector = values.dataSelector || '';
        this.dataFor = values.dataFor || '';
        this.elementId = values.elementId || null; // Capture element ID
    }

    resetValues() {
        this.selectedIcons = [];
        this.popType = 'single_select';
        this.dataSelector = '';
        this.dataFor = '';
        this.elementId = null;
    }

    confirmSelection() {
        console.log('Confirm selection called');
        console.log('Selected icons:', this.selectedIcons);
        console.log('Data selector:', this.dataSelector);

        if (this.selectedIcons.length > 0 && this.dataSelector) {
            const selectedIcon = this.selectedIcons[0]; // Get first selected icon
            console.log('Setting icon value to:', selectedIcon);

            // Update the input value
            $(this.dataSelector).val(selectedIcon);

            // Trigger change event to update the control and canvas
            $(this.dataSelector).trigger('change');

            console.log('Icon value set and change event triggered');

            // Force canvas refresh
            if (typeof window.updateIconAndRender === 'function') {
                // Use dataFor if available, otherwise try to get ID from DOM
                const controlId = this.dataFor || $(this.dataSelector).attr('id') || 'icon';

                console.log('Using global updateIconAndRender for:', controlId, selectedIcon, 'Element:', this.elementId);
                // Visual confirmation
                Toast.info('Updating ' + controlId + (this.elementId ? ' for ' + this.elementId : ''));
                window.updateIconAndRender(controlId, selectedIcon, this.elementId);
            } else if (typeof renderCanvas === 'function') {
                // Fallback
                setTimeout(() => {
                    console.log('Global helper not found, trying manual update...');
                    const controlId = $(this.dataSelector).attr('id');
                    const selectedElementId = window.selectedElementId;

                    if (typeof elementManager !== 'undefined' && selectedElementId && controlId) {
                        const element = elementManager.elements.get(selectedElementId);
                        if (element) {
                            const newSettings = { ...element.settings, [controlId]: selectedIcon };
                            elementManager.updateElement(selectedElementId, newSettings);
                        }
                    }
                    renderCanvas();
                }, 100);
            }
        }

        // Close the modal
        this.close();
    }

    getValues() {
        return {
            selectedFiles: this.selectedIcons,
            popType: this.popType,
            dataSelector: this.dataSelector,
            dataFor: this.dataFor
        };
    }

    populateIconGallery() {
        if (!this.modal) {
            console.error('Modal not initialized, cannot populate gallery');
            return;
        }

        const gallery = this.modal.querySelector('.icon-gallery');
        if (!gallery) {
            console.error('Icon gallery element not found in modal');
            return;
        }

        gallery.innerHTML = ''; // Clear previous content

        const icons = this.getIconData();

        icons.forEach(icon => {
            this.createIconItem(icon, gallery);
        });

        $(this.modal).find('.selected-qty').html("Item selected " + this.selectedIcons.length);
    }

    createIconItem(icon, gallery) {
        const iconItem = document.createElement('div');
        iconItem.classList.add('icon-item');
        iconItem.dataset.iconClass = icon.class;
        iconItem.dataset.type = icon.type; // Adding type attribute for filtering

        const iconElement = document.createElement('i');
        iconElement.className = icon.class;

        if (this.selectedIcons.includes(icon.class)) {
            iconItem.classList.add('selected');
        }

        iconItem.addEventListener('click', () => this.selectIcon(icon.class, iconItem));

        iconItem.appendChild(iconElement);
        gallery.appendChild(iconItem);
    }

    selectIcon(iconClass, iconItem) {
        console.log('Icon selected:', iconClass);

        // For single select, clear previous selection
        if (this.popType === 'single_select') {
            this.selectedIcons = [iconClass];

            // Remove selected class from all items
            this.modal.querySelectorAll('.icon-item').forEach(item => {
                item.classList.remove('selected');
            });

            // Add selected class to clicked item
            iconItem.classList.add('selected');
        } else {
            // For multiple select
            if (this.selectedIcons.includes(iconClass)) {
                // Deselect
                this.selectedIcons = this.selectedIcons.filter(ic => ic !== iconClass);
                iconItem.classList.remove('selected');
            } else {
                // Select
                this.selectedIcons.push(iconClass);
                iconItem.classList.add('selected');
            }
        }

        // Update selected count
        $(this.modal).find('.selected-qty').html("Item selected " + this.selectedIcons.length);
    }

    bindCategoryClick() {
        $('.modal-category-list span').click((event) => {
            const selectedCategory = $(event.target).data('category');

            // Remove the 'selected' class from all categories
            $('.modal-category-list span').removeClass('selected');

            // Add the 'selected' class to the clicked category
            $(event.target).addClass('selected');

            // Filter the icons based on the selected category
            this.filterIcons(selectedCategory);
            this.filterIconsWithSearch(); // Call the updated method

        });

        // Event listener for search input
        $('.filter-input input').on('input', () => {
            this.filterIconsWithSearch(); // Call the updated method
        });
    }

    // Function to filter icons based on category and search input
    filterIconsWithSearch() {
        const selectedCategory = $('.modal-category-list span.selected').data('category') || 'All';
        const searchTerm = $('.filter-input input').val().toLowerCase();

        // Get icon data using the method
        const icons = this.getIconData();
        const filteredIcons = icons.filter(icon => {
            const matchesCategory = selectedCategory === 'All' || icon.type === selectedCategory;
            const matchesSearch = icon.title.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        // Update the icon gallery with filtered icons
        this.updateIconGallery(filteredIcons);
    }

    // Function to update the icon gallery display
    updateIconGallery(filteredIcons) {
        const gallery = this.modal.querySelector('.icon-gallery');
        gallery.innerHTML = ''; // Clear the current gallery

        filteredIcons.forEach(icon => {
            this.createIconItem(icon, gallery);
        });

        $(this.modal).find('.selected-qty').html("Item selected " + filteredIcons.length);
    }

    filterIcons(category) {
        const gallery = $(this.modal).find('.icon-gallery'); // Use jQuery to select gallery
        const iconItems = gallery.find('.icon-item'); // Get all icon items
        let visibleCount = 0; // Initialize visible icon count

        // Normalize category for comparison
        const normalizedCategory = category.toLowerCase();

        // Loop through icon items to show/hide based on category
        iconItems.each((index, iconItem) => {
            const iconType = $(iconItem).data('type').toLowerCase(); // Get icon type

            // Check if the icon type matches the selected category
            if (iconType === normalizedCategory || normalizedCategory === 'all') {
                $(iconItem).removeClass('hide').addClass('show'); // Show icon
                visibleCount++; // Increment count of visible icons
            } else {
                $(iconItem).removeClass('show').addClass('hide'); // Hide icon
            }
        });

        // Update the displayed count of selected icons
        $('.selected-qty').html("Item selected " + visibleCount);
    }

    getIconData() {

        const fontAwesome = [
            { "class": "fab fa-500px", "title": "500px", "type": "FontAwesome" },
            { "class": "fab fa-accessible-icon", "title": "Accessible Icon", "type": "FontAwesome" },
            { "class": "fab fa-accusoft", "title": "Accusoft", "type": "FontAwesome" },
            { "class": "fas fa-address-book", "title": "Address Book", "type": "FontAwesome" },
            { "class": "far fa-address-book", "title": "Address Book", "type": "FontAwesome" },
            { "class": "fas fa-address-card", "title": "Address Card", "type": "FontAwesome" },
            { "class": "far fa-address-card", "title": "Address Card", "type": "FontAwesome" },
            { "class": "fas fa-adjust", "title": "Adjust", "type": "FontAwesome" },
            { "class": "fab fa-adn", "title": "ADN", "type": "FontAwesome" },
            { "class": "fab fa-adversal", "title": "Adversal", "type": "FontAwesome" },
            { "class": "fab fa-affiliatetheme", "title": "Affiliatetheme", "type": "FontAwesome" },
            { "class": "fab fa-algolia", "title": "Algolia", "type": "FontAwesome" },
            { "class": "fas fa-align-center", "title": "Align Center", "type": "FontAwesome" },
            { "class": "fas fa-align-justify", "title": "Align Justify", "type": "FontAwesome" },
            { "class": "fas fa-align-left", "title": "Align Left", "type": "FontAwesome" },
            { "class": "fas fa-align-right", "title": "Align Right", "type": "FontAwesome" },
            { "class": "fas fa-allergies", "title": "Allergies", "type": "FontAwesome" },
            { "class": "fab fa-amazon", "title": "Amazon", "type": "FontAwesome" },
            { "class": "fab fa-amazon-pay", "title": "Amazon Pay", "type": "FontAwesome" },
            { "class": "fas fa-ambulance", "title": "Ambulance", "type": "FontAwesome" },
            { "class": "fas fa-american-sign-language-interpreting", "title": "American Sign Language Interpreting", "type": "FontAwesome" },
            { "class": "fab fa-amilia", "title": "Amilia", "type": "FontAwesome" },
            { "class": "fas fa-anchor", "title": "Anchor", "type": "FontAwesome" },
            { "class": "fab fa-android", "title": "Android", "type": "FontAwesome" },
            { "class": "fab fa-angellist", "title": "AngelList", "type": "FontAwesome" },
            { "class": "fas fa-angle-double-down", "title": "Angle Double Down", "type": "FontAwesome" },
            { "class": "fas fa-angle-double-left", "title": "Angle Double Left", "type": "FontAwesome" },
            { "class": "fas fa-angle-double-right", "title": "Angle Double Right", "type": "FontAwesome" },
            { "class": "fas fa-angle-double-up", "title": "Angle Double Up", "type": "FontAwesome" },
            { "class": "fas fa-angle-down", "title": "Angle Down", "type": "FontAwesome" },
            { "class": "fas fa-angle-left", "title": "Angle Left", "type": "FontAwesome" },
            { "class": "fas fa-angle-right", "title": "Angle Right", "type": "FontAwesome" },
            { "class": "fas fa-angle-up", "title": "Angle Up", "type": "FontAwesome" },
            { "class": "fab fa-angrycreative", "title": "Angry Creative", "type": "FontAwesome" },
            { "class": "fab fa-angular", "title": "Angular", "type": "FontAwesome" },
            { "class": "fab fa-app-store", "title": "App Store", "type": "FontAwesome" },
            { "class": "fab fa-app-store-ios", "title": "App Store iOS", "type": "FontAwesome" },
            { "class": "fab fa-apper", "title": "Apper", "type": "FontAwesome" },
            { "class": "fab fa-apple", "title": "Apple", "type": "FontAwesome" },
            { "class": "fab fa-apple-pay", "title": "Apple Pay", "type": "FontAwesome" },
            { "class": "fas fa-archive", "title": "Archive", "type": "FontAwesome" },
            { "class": "fas fa-arrow-alt-circle-down", "title": "Arrow Alt Circle Down", "type": "FontAwesome" },
            { "class": "far fa-arrow-alt-circle-down", "title": "Arrow Alt Circle Down", "type": "FontAwesome" },
            { "class": "fas fa-arrow-alt-circle-left", "title": "Arrow Alt Circle Left", "type": "FontAwesome" },
            { "class": "far fa-arrow-alt-circle-left", "title": "Arrow Alt Circle Left", "type": "FontAwesome" },
            { "class": "fas fa-arrow-alt-circle-right", "title": "Arrow Alt Circle Right", "type": "FontAwesome" },
            { "class": "far fa-arrow-alt-circle-right", "title": "Arrow Alt Circle Right", "type": "FontAwesome" },
            { "class": "fas fa-arrow-alt-circle-up", "title": "Arrow Alt Circle Up", "type": "FontAwesome" },
            { "class": "far fa-arrow-alt-circle-up", "title": "Arrow Alt Circle Up", "type": "FontAwesome" },
            { "class": "fas fa-arrow-circle-down", "title": "Arrow Circle Down", "type": "FontAwesome" },
            { "class": "fas fa-arrow-circle-left", "title": "Arrow Circle Left", "type": "FontAwesome" },
            { "class": "fas fa-arrow-circle-right", "title": "Arrow Circle Right", "type": "FontAwesome" },
            { "class": "fas fa-arrow-circle-up", "title": "Arrow Circle Up", "type": "FontAwesome" },
            { "class": "fas fa-arrow-down", "title": "Arrow Down", "type": "FontAwesome" },
            { "class": "fas fa-arrow-left", "title": "Arrow Left", "type": "FontAwesome" },
            { "class": "fas fa-arrow-right", "title": "Arrow Right", "type": "FontAwesome" },
            { "class": "fas fa-arrow-up", "title": "Arrow Up", "type": "FontAwesome" },
            { "class": "fas fa-arrows-alt", "title": "Arrows Alt", "type": "FontAwesome" },
            { "class": "fas fa-arrows-alt-h", "title": "Arrows Alt Horizontal", "type": "FontAwesome" },
            { "class": "fas fa-arrows-alt-v", "title": "Arrows Alt Vertical", "type": "FontAwesome" },
            { "class": "fas fa-assistive-listening-systems", "title": "Assistive Listening Systems", "type": "FontAwesome" },
            { "class": "fas fa-asterisk", "title": "Asterisk", "type": "FontAwesome" },
            { "class": "fab fa-asymmetrik", "title": "Asymmetrik", "type": "FontAwesome" },
            { "class": "fas fa-at", "title": "At", "type": "FontAwesome" },
            { "class": "fab fa-audible", "title": "Audible", "type": "FontAwesome" },
            { "class": "fas fa-audio-description", "title": "Audio Description", "type": "FontAwesome" },
            { "class": "fab fa-autoprefixer", "title": "Autoprefixer", "type": "FontAwesome" },
            { "class": "fab fa-avianex", "title": "Avianex", "type": "FontAwesome" },
            { "class": "fab fa-aviato", "title": "Aviato", "type": "FontAwesome" },
            { "class": "fab fa-aws", "title": "AWS", "type": "FontAwesome" },
            { "class": "fas fa-backward", "title": "Backward", "type": "FontAwesome" },
            { "class": "fas fa-balance-scale", "title": "Balance Scale", "type": "FontAwesome" },
            { "class": "fas fa-ban", "title": "Ban", "type": "FontAwesome" },
            { "class": "fas fa-band-aid", "title": "Band Aid", "type": "FontAwesome" },
            { "class": "fab fa-bandcamp", "title": "Bandcamp", "type": "FontAwesome" },
            { "class": "fas fa-barcode", "title": "Barcode", "type": "FontAwesome" },
            { "class": "fas fa-bars", "title": "Bars", "type": "FontAwesome" },
            { "class": "fas fa-baseball-ball", "title": "Baseball Ball", "type": "FontAwesome" },
            { "class": "fas fa-basketball-ball", "title": "Basketball Ball", "type": "FontAwesome" },
            { "class": "fas fa-bath", "title": "Bath", "type": "FontAwesome" },
            { "class": "fas fa-battery-empty", "title": "Battery Empty", "type": "FontAwesome" },
            { "class": "fas fa-battery-full", "title": "Battery Full", "type": "FontAwesome" },
            { "class": "fas fa-battery-half", "title": "Battery Half", "type": "FontAwesome" },
            { "class": "fas fa-battery-quarter", "title": "Battery Quarter", "type": "FontAwesome" },
            { "class": "fas fa-battery-three-quarters", "title": "Battery Three Quarters", "type": "FontAwesome" },
            { "class": "fas fa-bed", "title": "Bed", "type": "FontAwesome" },
            { "class": "fas fa-beer", "title": "Beer", "type": "FontAwesome" },
            { "class": "fab fa-behance", "title": "Behance", "type": "FontAwesome" },
            { "class": "fab fa-behance-square", "title": "Behance Square", "type": "FontAwesome" },
            { "class": "fas fa-bell", "title": "Bell", "type": "FontAwesome" },
            { "class": "far fa-bell", "title": "Bell", "type": "FontAwesome" },
            { "class": "fas fa-bell-slash", "title": "Bell Slash", "type": "FontAwesome" },
            { "class": "far fa-bell-slash", "title": "Bell Slash", "type": "FontAwesome" },
            { "class": "fas fa-bicycle", "title": "Bicycle", "type": "FontAwesome" },
            { "class": "fab fa-bimobject", "title": "Bimobject", "type": "FontAwesome" },
            { "class": "fas fa-binoculars", "title": "Binoculars", "type": "FontAwesome" },
            { "class": "fas fa-birthday-cake", "title": "Birthday Cake", "type": "FontAwesome" },
            { "class": "fab fa-bitbucket", "title": "Bitbucket", "type": "FontAwesome" },
            { "class": "fab fa-bitcoin", "title": "Bitcoin", "type": "FontAwesome" },
            { "class": "fab fa-bity", "title": "Bity", "type": "FontAwesome" },
            { "class": "fab fa-black-tie", "title": "Black Tie", "type": "FontAwesome" },
            { "class": "fab fa-blackberry", "title": "Blackberry", "type": "FontAwesome" },
            { "class": "fas fa-blind", "title": "Blind", "type": "FontAwesome" },
            { "class": "fab fa-blogger", "title": "Blogger", "type": "FontAwesome" },
            { "class": "fab fa-blogger-b", "title": "Blogger B", "type": "FontAwesome" },
            { "class": "fab fa-bluetooth", "title": "Bluetooth", "type": "FontAwesome" },
            { "class": "fab fa-bluetooth-b", "title": "Bluetooth B", "type": "FontAwesome" },
            { "class": "fas fa-bold", "title": "Bold", "type": "FontAwesome" },
            { "class": "fas fa-bolt", "title": "Bolt", "type": "FontAwesome" },
            { "class": "fas fa-bomb", "title": "Bomb", "type": "FontAwesome" },
            { "class": "fas fa-book", "title": "Book", "type": "FontAwesome" },
            { "class": "fas fa-bookmark", "title": "Bookmark", "type": "FontAwesome" },
            { "class": "far fa-bookmark", "title": "Bookmark", "type": "FontAwesome" },
            { "class": "fas fa-bowling-ball", "title": "Bowling Ball", "type": "FontAwesome" },
            { "class": "fas fa-box", "title": "Box", "type": "FontAwesome" },
            { "class": "fas fa-box-open", "title": "Box Open", "type": "FontAwesome" },
            { "class": "fas fa-boxes", "title": "Boxes", "type": "FontAwesome" },
            { "class": "fas fa-braille", "title": "Braille", "type": "FontAwesome" },
            { "class": "fas fa-briefcase", "title": "Briefcase", "type": "FontAwesome" },
            { "class": "fas fa-briefcase-medical", "title": "Briefcase Medical", "type": "FontAwesome" },
            { "class": "fab fa-btc", "title": "BTC", "type": "FontAwesome" },
            { "class": "fas fa-bug", "title": "Bug", "type": "FontAwesome" },
            { "class": "fas fa-building", "title": "Building", "type": "FontAwesome" },
            { "class": "far fa-building", "title": "Building", "type": "FontAwesome" },
            { "class": "fas fa-bullhorn", "title": "Bullhorn", "type": "FontAwesome" },
            { "class": "fas fa-bullseye", "title": "Bullseye", "type": "FontAwesome" },
            { "class": "fas fa-burn", "title": "Burn", "type": "FontAwesome" },
            { "class": "fab fa-buromobelexperte", "title": "Buromobelexperte", "type": "FontAwesome" },
            { "class": "fas fa-bus", "title": "Bus", "type": "FontAwesome" },
            { "class": "fab fa-buysellads", "title": "BuySellAds", "type": "FontAwesome" },
            { "class": "fas fa-calculator", "title": "Calculator", "type": "FontAwesome" },
            { "class": "fas fa-calendar", "title": "Calendar", "type": "FontAwesome" },
            { "class": "far fa-calendar", "title": "Calendar", "type": "FontAwesome" },
            { "class": "fas fa-calendar-alt", "title": "Calendar Alt", "type": "FontAwesome" },
            { "class": "far fa-calendar-alt", "title": "Calendar Alt", "type": "FontAwesome" },
            { "class": "fas fa-calendar-check", "title": "Calendar Check", "type": "FontAwesome" },
            { "class": "far fa-calendar-check", "title": "Calendar Check", "type": "FontAwesome" },
            { "class": "fas fa-calendar-minus", "title": "Calendar Minus", "type": "FontAwesome" },
            { "class": "far fa-calendar-minus", "title": "Calendar Minus", "type": "FontAwesome" },
            { "class": "fas fa-calendar-plus", "title": "Calendar Plus", "type": "FontAwesome" },
            { "class": "far fa-calendar-plus", "title": "Calendar Plus", "type": "FontAwesome" },
            { "class": "fas fa-calendar-times", "title": "Calendar Times", "type": "FontAwesome" },
            { "class": "far fa-calendar-times", "title": "Calendar Times", "type": "FontAwesome" },
            { "class": "fas fa-camera", "title": "Camera", "type": "FontAwesome" },
            { "class": "fas fa-camera-retro", "title": "Camera Retro", "type": "FontAwesome" },
            { "class": "fas fa-capsules", "title": "Capsules", "type": "FontAwesome" },
            { "class": "fas fa-car", "title": "Car", "type": "FontAwesome" },
            { "class": "fas fa-caret-down", "title": "Caret Down", "type": "FontAwesome" },
            { "class": "fas fa-caret-left", "title": "Caret Left", "type": "FontAwesome" },
            { "class": "fas fa-caret-right", "title": "Caret Right", "type": "FontAwesome" },
            { "class": "fas fa-caret-square-down", "title": "Caret Square Down", "type": "FontAwesome" },
            { "class": "far fa-caret-square-down", "title": "Caret Square Down", "type": "FontAwesome" },
            { "class": "fas fa-caret-square-left", "title": "Caret Square Left", "type": "FontAwesome" },
            { "class": "far fa-caret-square-left", "title": "Caret Square Left", "type": "FontAwesome" },
            { "class": "fas fa-caret-square-right", "title": "Caret Square Right", "type": "FontAwesome" },
            { "class": "far fa-caret-square-right", "title": "Caret Square Right", "type": "FontAwesome" },
            { "class": "fas fa-caret-square-up", "title": "Caret Square Up", "type": "FontAwesome" },
            { "class": "far fa-caret-square-up", "title": "Caret Square Up", "type": "FontAwesome" },
            { "class": "fas fa-caret-up", "title": "Caret Up", "type": "FontAwesome" },
            { "class": "fas fa-cart-arrow-down", "title": "Cart Arrow Down", "type": "FontAwesome" },
            { "class": "fas fa-cart-plus", "title": "Cart Plus", "type": "FontAwesome" },
            { "class": "fab fa-cc-amazon-pay", "title": "CC Amazon Pay", "type": "FontAwesome" },
            { "class": "fab fa-cc-amex", "title": "CC Amex", "type": "FontAwesome" },
            { "class": "fab fa-cc-apple-pay", "title": "CC Apple Pay", "type": "FontAwesome" },
            { "class": "fab fa-cc-diners-club", "title": "CC Diners Club", "type": "FontAwesome" },
            { "class": "fab fa-cc-discover", "title": "CC Discover", "type": "FontAwesome" },
            { "class": "fab fa-cc-jcb", "title": "CC JCB", "type": "FontAwesome" },
            { "class": "fab fa-cc-mastercard", "title": "CC Mastercard", "type": "FontAwesome" },
            { "class": "fab fa-cc-paypal", "title": "CC PayPal", "type": "FontAwesome" },
            { "class": "fab fa-cc-stripe", "title": "CC Stripe", "type": "FontAwesome" },
            { "class": "fab fa-cc-visa", "title": "CC Visa", "type": "FontAwesome" },
            { "class": "fab fa-centercode", "title": "Centercode", "type": "FontAwesome" },
            { "class": "fas fa-certificate", "title": "Certificate", "type": "FontAwesome" },
            { "class": "fas fa-chart-area", "title": "Chart Area", "type": "FontAwesome" },
            { "class": "fas fa-chart-bar", "title": "Chart Bar", "type": "FontAwesome" },
            { "class": "far fa-chart-bar", "title": "Chart Bar", "type": "FontAwesome" },
            { "class": "fas fa-chart-line", "title": "Chart Line", "type": "FontAwesome" },
            { "class": "fas fa-chart-pie", "title": "Chart Pie", "type": "FontAwesome" },
            { "class": "fas fa-check", "title": "Check", "type": "FontAwesome" },
            { "class": "fas fa-check-circle", "title": "check-circle", "type": "FontAwesome" },
            { "class": "far fa-check-circle", "title": "check-circle", "type": "FontAwesome" },
            { "class": "fas fa-check-square", "title": "check-square", "type": "FontAwesome" },
            { "class": "far fa-check-square", "title": "check-square", "type": "FontAwesome" },
            { "class": "fas fa-chess", "title": "chess", "type": "FontAwesome" },
            { "class": "fas fa-chess-bishop", "title": "chess-bishop", "type": "FontAwesome" },
            { "class": "fas fa-chess-board", "title": "chess-board", "type": "FontAwesome" },
            { "class": "fas fa-chess-king", "title": "chess-king", "type": "FontAwesome" },
            { "class": "fas fa-chess-knight", "title": "chess-knight", "type": "FontAwesome" },
            { "class": "fas fa-chess-pawn", "title": "chess-pawn", "type": "FontAwesome" },
            { "class": "fas fa-chess-queen", "title": "chess-queen", "type": "FontAwesome" },
            { "class": "fas fa-chess-rook", "title": "chess-rook", "type": "FontAwesome" },
            { "class": "fas fa-chevron-circle-down", "title": "chevron-circle-down", "type": "FontAwesome" },
            { "class": "fas fa-chevron-circle-left", "title": "chevron-circle-left", "type": "FontAwesome" },
            { "class": "fas fa-chevron-circle-right", "title": "chevron-circle-right", "type": "FontAwesome" },
            { "class": "fas fa-chevron-circle-up", "title": "chevron-circle-up", "type": "FontAwesome" },
            { "class": "fas fa-chevron-down", "title": "chevron-down", "type": "FontAwesome" },
            { "class": "fas fa-chevron-left", "title": "chevron-left", "type": "FontAwesome" },
            { "class": "fas fa-chevron-right", "title": "chevron-right", "type": "FontAwesome" },
            { "class": "fas fa-chevron-up", "title": "chevron-up", "type": "FontAwesome" },
            { "class": "fas fa-child", "title": "child", "type": "FontAwesome" },
            { "class": "fab fa-chrome", "title": "chrome", "type": "FontAwesome" },
            { "class": "fas fa-circle", "title": "circle", "type": "FontAwesome" },
            { "class": "far fa-circle", "title": "circle", "type": "FontAwesome" },
            { "class": "fas fa-circle-notch", "title": "circle-notch", "type": "FontAwesome" },
            { "class": "fas fa-clipboard", "title": "clipboard", "type": "FontAwesome" },
            { "class": "far fa-clipboard", "title": "clipboard", "type": "FontAwesome" },
            { "class": "fas fa-clipboard-check", "title": "clipboard-check", "type": "FontAwesome" },
            { "class": "fas fa-clipboard-list", "title": "clipboard-list", "type": "FontAwesome" },
            { "class": "fas fa-clock", "title": "clock", "type": "FontAwesome" },
            { "class": "far fa-clock", "title": "clock", "type": "FontAwesome" },
            { "class": "fas fa-clone", "title": "clone", "type": "FontAwesome" },
            { "class": "far fa-clone", "title": "clone", "type": "FontAwesome" },
            { "class": "fas fa-closed-captioning", "title": "closed-captioning", "type": "FontAwesome" },
            { "class": "far fa-closed-captioning", "title": "closed-captioning", "type": "FontAwesome" },
            { "class": "fas fa-cloud", "title": "cloud", "type": "FontAwesome" },
            { "class": "fas fa-cloud-download-alt", "title": "cloud-download-alt", "type": "FontAwesome" },
            { "class": "fas fa-cloud-upload-alt", "title": "cloud-upload-alt", "type": "FontAwesome" },
            { "class": "fab fa-cloudscale", "title": "cloudscale", "type": "FontAwesome" },
            { "class": "fab fa-cloudsmith", "title": "cloudsmith", "type": "FontAwesome" },
            { "class": "fab fa-cloudversify", "title": "cloudversify", "type": "FontAwesome" },
            { "class": "fas fa-code", "title": "code", "type": "FontAwesome" },
            { "class": "fas fa-code-branch", "title": "code-branch", "type": "FontAwesome" },
            { "class": "fab fa-codepen", "title": "codepen", "type": "FontAwesome" },
            { "class": "fab fa-codiepie", "title": "codiepie", "type": "FontAwesome" },
            { "class": "fas fa-coffee", "title": "coffee", "type": "FontAwesome" },
            { "class": "fas fa-cog", "title": "cog", "type": "FontAwesome" },
            { "class": "fas fa-cogs", "title": "cogs", "type": "FontAwesome" },
            { "class": "fas fa-columns", "title": "columns", "type": "FontAwesome" },
            { "class": "fas fa-comment", "title": "comment", "type": "FontAwesome" },
            { "class": "far fa-comment", "title": "comment", "type": "FontAwesome" },
            { "class": "fas fa-comment-alt", "title": "comment-alt", "type": "FontAwesome" },
            { "class": "far fa-comment-alt", "title": "comment-alt", "type": "FontAwesome" },
            { "class": "fas fa-comment-dots", "title": "comment-dots", "type": "FontAwesome" },
            { "class": "fas fa-comment-slash", "title": "comment-slash", "type": "FontAwesome" },
            { "class": "fas fa-comments", "title": "comments", "type": "FontAwesome" },
            { "class": "far fa-comments", "title": "comments", "type": "FontAwesome" },
            { "class": "fas fa-compass", "title": "compass", "type": "FontAwesome" },
            { "class": "far fa-compass", "title": "compass", "type": "FontAwesome" },
            { "class": "fas fa-compress", "title": "compress", "type": "FontAwesome" },
            { "class": "fab fa-connectdevelop", "title": "connectdevelop", "type": "FontAwesome" },
            { "class": "fab fa-contao", "title": "contao", "type": "FontAwesome" },
            { "class": "fas fa-copy", "title": "copy", "type": "FontAwesome" },
            { "class": "far fa-copy", "title": "copy", "type": "FontAwesome" },
            { "class": "fas fa-copyright", "title": "copyright", "type": "FontAwesome" },
            { "class": "far fa-copyright", "title": "copyright", "type": "FontAwesome" },
            { "class": "fas fa-couch", "title": "couch", "type": "FontAwesome" },
            { "class": "fab fa-cpanel", "title": "cpanel", "type": "FontAwesome" },
            { "class": "fab fa-creative-commons", "title": "creative-commons", "type": "FontAwesome" },
            { "class": "fas fa-credit-card", "title": "credit-card", "type": "FontAwesome" },
            { "class": "far fa-credit-card", "title": "credit-card", "type": "FontAwesome" },
            { "class": "fas fa-crop", "title": "crop", "type": "FontAwesome" },
            { "class": "fas fa-crosshairs", "title": "crosshairs", "type": "FontAwesome" },
            { "class": "fab fa-css3", "title": "css3", "type": "FontAwesome" },
            { "class": "fab fa-css3-alt", "title": "css3-alt", "type": "FontAwesome" },
            { "class": "fas fa-cube", "title": "cube", "type": "FontAwesome" },
            { "class": "fas fa-cubes", "title": "cubes", "type": "FontAwesome" },
            { "class": "fas fa-cut", "title": "cut", "type": "FontAwesome" },
            { "class": "fab fa-cuttlefish", "title": "cuttlefish", "type": "FontAwesome" },
            { "class": "fab fa-d-and-d", "title": "d-and-d", "type": "FontAwesome" },
            { "class": "fab fa-dashcube", "title": "dashcube", "type": "FontAwesome" },
            { "class": "fas fa-database", "title": "database", "type": "FontAwesome" },
            { "class": "fas fa-deaf", "title": "deaf", "type": "FontAwesome" },
            { "class": "fab fa-delicious", "title": "delicious", "type": "FontAwesome" },
            { "class": "fab fa-deploydog", "title": "deploydog", "type": "FontAwesome" },
            { "class": "fab fa-deskpro", "title": "deskpro", "type": "FontAwesome" },
            { "class": "fas fa-desktop", "title": "desktop", "type": "FontAwesome" },
            { "class": "fab fa-deviantart", "title": "deviantart", "type": "FontAwesome" },
            { "class": "fas fa-diagnoses", "title": "diagnoses", "type": "FontAwesome" },
            { "class": "fab fa-digg", "title": "digg", "type": "FontAwesome" },
            { "class": "fab fa-digital-ocean", "title": "digital-ocean", "type": "FontAwesome" },
            { "class": "fab fa-discord", "title": "discord", "type": "FontAwesome" },
            { "class": "fab fa-discourse", "title": "discourse", "type": "FontAwesome" },
            { "class": "fas fa-dna", "title": "dna", "type": "FontAwesome" },
            { "class": "fab fa-dochub", "title": "dochub", "type": "FontAwesome" },
            { "class": "fab fa-docker", "title": "docker", "type": "FontAwesome" },
            { "class": "fas fa-dollar-sign", "title": "dollar-sign", "type": "FontAwesome" },
            { "class": "fas fa-dolly", "title": "dolly", "type": "FontAwesome" },
            { "class": "fas fa-dolly-flatbed", "title": "dolly-flatbed", "type": "FontAwesome" },
            { "class": "fas fa-donate", "title": "donate", "type": "FontAwesome" },
            { "class": "fas fa-dot-circle", "title": "dot-circle", "type": "FontAwesome" },
            { "class": "far fa-dot-circle", "title": "dot-circle", "type": "FontAwesome" },
            { "class": "fas fa-dove", "title": "dove", "type": "FontAwesome" },
            { "class": "fas fa-download", "title": "download", "type": "FontAwesome" },
            { "class": "fab fa-draft2digital", "title": "draft2digital", "type": "FontAwesome" },
            { "class": "fab fa-dribbble", "title": "dribbble", "type": "FontAwesome" },
            { "class": "fab fa-dribbble-square", "title": "dribbble-square", "type": "FontAwesome" },
            { "class": "fab fa-dropbox", "title": "dropbox", "type": "FontAwesome" },
            { "class": "fab fa-drupal", "title": "drupal", "type": "FontAwesome" },
            { "class": "fab fa-dyalog", "title": "dyalog", "type": "FontAwesome" },
            { "class": "fab fa-earlybirds", "title": "earlybirds", "type": "FontAwesome" },
            { "class": "fab fa-edge", "title": "edge", "type": "FontAwesome" },
            { "class": "fas fa-edit", "title": "edit", "type": "FontAwesome" },
            { "class": "far fa-edit", "title": "edit", "type": "FontAwesome" },
            { "class": "fas fa-eject", "title": "eject", "type": "FontAwesome" },
            { "class": "fab fa-elementor", "title": "elementor", "type": "FontAwesome" },
            { "class": "fas fa-ellipsis-h", "title": "ellipsis-h", "type": "FontAwesome" },
            { "class": "fas fa-ellipsis-v", "title": "ellipsis-v", "type": "FontAwesome" },
            { "class": "fab fa-ember", "title": "ember", "type": "FontAwesome" },
            { "class": "fab fa-empire", "title": "empire", "type": "FontAwesome" },
            { "class": "fas fa-envelope", "title": "envelope", "type": "FontAwesome" },
            { "class": "far fa-envelope", "title": "envelope", "type": "FontAwesome" },
            { "class": "fas fa-envelope-open", "title": "envelope-open", "type": "FontAwesome" },
            { "class": "far fa-envelope-open", "title": "envelope-open", "type": "FontAwesome" },
            { "class": "fas fa-envelope-square", "title": "envelope-square", "type": "FontAwesome" },
            { "class": "fab fa-envira", "title": "envira", "type": "FontAwesome" },
            { "class": "fas fa-eraser", "title": "eraser", "type": "FontAwesome" },
            { "class": "fab fa-erlang", "title": "erlang", "type": "FontAwesome" },
            { "class": "fab fa-ethereum", "title": "ethereum", "type": "FontAwesome" },
            { "class": "fab fa-etsy", "title": "etsy", "type": "FontAwesome" },
            { "class": "fas fa-euro-sign", "title": "euro-sign", "type": "FontAwesome" },
            { "class": "fas fa-exchange-alt", "title": "exchange-alt", "type": "FontAwesome" },
            { "class": "fas fa-exclamation", "title": "exclamation", "type": "FontAwesome" },
            { "class": "fas fa-exclamation-circle", "title": "exclamation-circle", "type": "FontAwesome" },
            { "class": "fas fa-exclamation-triangle", "title": "exclamation-triangle", "type": "FontAwesome" },
            { "class": "fas fa-expand", "title": "expand", "type": "FontAwesome" },
            { "class": "fas fa-expand-arrows-alt", "title": "expand-arrows-alt", "type": "FontAwesome" },
            { "class": "fab fa-expeditedssl", "title": "expeditedssl", "type": "FontAwesome" },
            { "class": "fas fa-external-link-alt", "title": "external-link-alt", "type": "FontAwesome" },
            { "class": "fas fa-external-link-square-alt", "title": "external-link-square-alt", "type": "FontAwesome" },
            { "class": "fas fa-eye", "title": "eye", "type": "FontAwesome" },
            { "class": "fas fa-eye-dropper", "title": "eye-dropper", "type": "FontAwesome" },
            { "class": "fas fa-eye-slash", "title": "eye-slash", "type": "FontAwesome" },
            { "class": "far fa-eye-slash", "title": "eye-slash", "type": "FontAwesome" },
            { "class": "fab fa-facebook", "title": "facebook", "type": "FontAwesome" },
            { "class": "fab fa-facebook-f", "title": "facebook-f", "type": "FontAwesome" },
            { "class": "fab fa-facebook-messenger", "title": "facebook-messenger", "type": "FontAwesome" },
            { "class": "fab fa-facebook-square", "title": "facebook-square", "type": "FontAwesome" },
            { "class": "fas fa-fast-backward", "title": "fast-backward", "type": "FontAwesome" },
            { "class": "fas fa-fast-forward", "title": "fast-forward", "type": "FontAwesome" },
            { "class": "fas fa-fax", "title": "fax", "type": "FontAwesome" },
            { "class": "fas fa-female", "title": "female", "type": "FontAwesome" },
            { "class": "fas fa-fighter-jet", "title": "fighter-jet", "type": "FontAwesome" },
            { "class": "fas fa-file", "title": "file", "type": "FontAwesome" },
            { "class": "far fa-file", "title": "file", "type": "FontAwesome" },
            { "class": "fas fa-file-alt", "title": "file-alt", "type": "FontAwesome" },
            { "class": "far fa-file-alt", "title": "file-alt", "type": "FontAwesome" },
            { "class": "fas fa-file-archive", "title": "file-archive", "type": "FontAwesome" },
            { "class": "far fa-file-archive", "title": "file-archive", "type": "FontAwesome" },
            { "class": "fas fa-file-audio", "title": "file-audio", "type": "FontAwesome" },
            { "class": "far fa-file-audio", "title": "file-audio", "type": "FontAwesome" },
            { "class": "fas fa-file-code", "title": "file-code", "type": "FontAwesome" },
            { "class": "far fa-file-code", "title": "file-code", "type": "FontAwesome" },
            { "class": "fas fa-file-excel", "title": "file-excel", "type": "FontAwesome" },
            { "class": "far fa-file-excel", "title": "file-excel", "type": "FontAwesome" },
            { "class": "fas fa-file-image", "title": "file-image", "type": "FontAwesome" },
            { "class": "far fa-file-image", "title": "file-image", "type": "FontAwesome" },
            { "class": "fas fa-file-medical", "title": "file-medical", "type": "FontAwesome" },
            { "class": "fas fa-file-medical-alt", "title": "file-medical-alt", "type": "FontAwesome" },
            { "class": "fas fa-file-pdf", "title": "file-pdf", "type": "FontAwesome" },
            { "class": "far fa-file-pdf", "title": "file-pdf", "type": "FontAwesome" },
            { "class": "fas fa-file-powerpoint", "title": "file-powerpoint", "type": "FontAwesome" },
            { "class": "far fa-file-powerpoint", "title": "file-powerpoint", "type": "FontAwesome" },
            { "class": "fas fa-file-video", "title": "file-video", "type": "FontAwesome" },
            { "class": "far fa-file-video", "title": "file-video", "type": "FontAwesome" },
            { "class": "fas fa-file-word", "title": "file-word", "type": "FontAwesome" },
            { "class": "far fa-file-word", "title": "file-word", "type": "FontAwesome" },
            { "class": "fas fa-film", "title": "film", "type": "FontAwesome" },
            { "class": "fas fa-filter", "title": "filter", "type": "FontAwesome" },
            { "class": "fas fa-fire", "title": "fire", "type": "FontAwesome" },
            { "class": "fas fa-fire-extinguisher", "title": "fire-extinguisher", "type": "FontAwesome" },
            { "class": "fab fa-firefox", "title": "firefox", "type": "FontAwesome" },
            { "class": "fas fa-first-aid", "title": "first-aid", "type": "FontAwesome" },
            { "class": "fab fa-first-order", "title": "first-order", "type": "FontAwesome" },
            { "class": "fab fa-firstdraft", "title": "firstdraft", "type": "FontAwesome" },
            { "class": "fas fa-flag", "title": "flag", "type": "FontAwesome" },
            { "class": "far fa-flag", "title": "flag", "type": "FontAwesome" },
            { "class": "fas fa-flag-checkered", "title": "flag-checkered", "type": "FontAwesome" },
            { "class": "fas fa-flask", "title": "flask", "type": "FontAwesome" },
            { "class": "fab fa-flickr", "title": "flickr", "type": "FontAwesome" },
            { "class": "fab fa-flipboard", "title": "flipboard", "type": "FontAwesome" },
            { "class": "fab fa-fly", "title": "fly", "type": "FontAwesome" },
            { "class": "fas fa-folder", "title": "folder", "type": "FontAwesome" },
            { "class": "far fa-folder", "title": "folder", "type": "FontAwesome" },
            { "class": "fas fa-folder-open", "title": "folder-open", "type": "FontAwesome" },
            { "class": "far fa-folder-open", "title": "folder-open", "type": "FontAwesome" },
            { "class": "fas fa-font", "title": "font", "type": "FontAwesome" },
            { "class": "fab fa-font-awesome", "title": "font-awesome", "type": "FontAwesome" },
            { "class": "fab fa-font-awesome-alt", "title": "font-awesome-alt", "type": "FontAwesome" },
            { "class": "fab fa-font-awesome-flag", "title": "font-awesome-flag", "type": "FontAwesome" },
            { "class": "fab fa-fonticons", "title": "fonticons", "type": "FontAwesome" },
            { "class": "fab fa-fonticons-fi", "title": "fonticons-fi", "type": "FontAwesome" },
            { "class": "fas fa-football-ball", "title": "football-ball", "type": "FontAwesome" },
            { "class": "fab fa-fort-awesome", "title": "fort-awesome", "type": "FontAwesome" },
            { "class": "fab fa-fort-awesome-alt", "title": "fort-awesome-alt", "type": "FontAwesome" },
            { "class": "fab fa-forumbee", "title": "forumbee", "type": "FontAwesome" },
            { "class": "fas fa-forward", "title": "forward", "type": "FontAwesome" },
            { "class": "fab fa-foursquare", "title": "foursquare", "type": "FontAwesome" },
            { "class": "fab fa-free-code-camp", "title": "free-code-camp", "type": "FontAwesome" },
            { "class": "fab fa-freebsd", "title": "freebsd", "type": "FontAwesome" },
            { "class": "fas fa-frown", "title": "frown", "type": "FontAwesome" },
            { "class": "far fa-frown", "title": "frown", "type": "FontAwesome" },
            { "class": "fas fa-futbol", "title": "futbol", "type": "FontAwesome" },
            { "class": "far fa-futbol", "title": "futbol", "type": "FontAwesome" },
            { "class": "fas fa-gamepad", "title": "gamepad", "type": "FontAwesome" },
            { "class": "fas fa-gavel", "title": "gavel", "type": "FontAwesome" },
            { "class": "fas fa-gem", "title": "gem", "type": "FontAwesome" },
            { "class": "far fa-gem", "title": "gem", "type": "FontAwesome" },
            { "class": "fas fa-genderless", "title": "genderless", "type": "FontAwesome" },
            { "class": "fab fa-get-pocket", "title": "get-pocket", "type": "FontAwesome" },
            { "class": "fab fa-gg", "title": "gg", "type": "FontAwesome" },
            { "class": "fab fa-gg-circle", "title": "gg-circle", "type": "FontAwesome" },
            { "class": "fas fa-gift", "title": "gift", "type": "FontAwesome" },
            { "class": "fab fa-git", "title": "git", "type": "FontAwesome" },
            { "class": "fab fa-git-square", "title": "git-square", "type": "FontAwesome" },
            { "class": "fab fa-github", "title": "github", "type": "FontAwesome" },
            { "class": "fab fa-github-alt", "title": "github-alt", "type": "FontAwesome" },
            { "class": "fab fa-github-square", "title": "github-square", "type": "FontAwesome" },
            { "class": "fab fa-gitkraken", "title": "gitkraken", "type": "FontAwesome" },
            { "class": "fab fa-gitlab", "title": "gitlab", "type": "FontAwesome" },
            { "class": "fab fa-gitter", "title": "gitter", "type": "FontAwesome" },
            { "class": "fas fa-glass-martini", "title": "glass-martini", "type": "FontAwesome" },
            { "class": "fab fa-glide", "title": "glide", "type": "FontAwesome" },
            { "class": "fab fa-glide-g", "title": "glide-g", "type": "FontAwesome" },
            { "class": "fas fa-globe", "title": "globe", "type": "FontAwesome" },
            { "class": "fab fa-gofore", "title": "gofore", "type": "FontAwesome" },
            { "class": "fas fa-golf-ball", "title": "golf-ball", "type": "FontAwesome" },
            { "class": "fab fa-goodreads", "title": "goodreads", "type": "FontAwesome" },
            { "class": "fab fa-goodreads-g", "title": "goodreads-g", "type": "FontAwesome" },
            { "class": "fab fa-google", "title": "google", "type": "FontAwesome" },
            { "class": "fab fa-google-drive", "title": "google-drive", "type": "FontAwesome" },
            { "class": "fab fa-google-play", "title": "google-play", "type": "FontAwesome" },
            { "class": "fab fa-google-plus", "title": "google-plus", "type": "FontAwesome" },
            { "class": "fab fa-google-plus-g", "title": "google-plus-g", "type": "FontAwesome" },
            { "class": "fab fa-google-plus-square", "title": "google-plus-square", "type": "FontAwesome" },
            { "class": "fab fa-google-wallet", "title": "google-wallet", "type": "FontAwesome" },
            { "class": "fas fa-graduation-cap", "title": "graduation-cap", "type": "FontAwesome" },
            { "class": "fab fa-gratipay", "title": "gratipay", "type": "FontAwesome" },
            { "class": "fab fa-grav", "title": "grav", "type": "FontAwesome" },
            { "class": "fab fa-gripfire", "title": "gripfire", "type": "FontAwesome" },
            { "class": "fab fa-grunt", "title": "grunt", "type": "FontAwesome" },
            { "class": "fab fa-gulp", "title": "gulp", "type": "FontAwesome" },
            { "class": "fas fa-h-square", "title": "h-square", "type": "FontAwesome" },
            { "class": "fab fa-hacker-news", "title": "hacker-news", "type": "FontAwesome" },
            { "class": "fab fa-hacker-news-square", "title": "hacker-news-square", "type": "FontAwesome" },
            { "class": "fas fa-hand-holding", "title": "hand-holding", "type": "FontAwesome" },
            { "class": "fas fa-hand-holding-heart", "title": "hand-holding-heart", "type": "FontAwesome" },
            { "class": "fas fa-hand-holding-usd", "title": "hand-holding-usd", "type": "FontAwesome" },
            { "class": "fas fa-hand-lizard", "title": "hand-lizard", "type": "FontAwesome" },
            { "class": "far fa-hand-lizard", "title": "hand-lizard", "type": "FontAwesome" },
            { "class": "fas fa-hand-paper", "title": "hand-paper", "type": "FontAwesome" },
            { "class": "far fa-hand-paper", "title": "hand-paper", "type": "FontAwesome" },
            { "class": "fas fa-hand-peace", "title": "hand-peace", "type": "FontAwesome" },
            { "class": "far fa-hand-peace", "title": "hand-peace", "type": "FontAwesome" },
            { "class": "fas fa-hand-point-down", "title": "hand-point-down", "type": "FontAwesome" },
            { "class": "far fa-hand-point-down", "title": "hand-point-down", "type": "FontAwesome" },
            { "class": "fas fa-hand-point-left", "title": "hand-point-left", "type": "FontAwesome" },
            { "class": "far fa-hand-point-left", "title": "hand-point-left", "type": "FontAwesome" },
            { "class": "fas fa-hand-point-right", "title": "hand-point-right", "type": "FontAwesome" },
            { "class": "far fa-hand-point-right", "title": "hand-point-right", "type": "FontAwesome" },
            { "class": "fas fa-hand-point-up", "title": "hand-point-up", "type": "FontAwesome" },
            { "class": "far fa-hand-point-up", "title": "hand-point-up", "type": "FontAwesome" },
            { "class": "fas fa-hand-pointer", "title": "hand-pointer", "type": "FontAwesome" },
            { "class": "far fa-hand-pointer", "title": "hand-pointer", "type": "FontAwesome" },
            { "class": "fas fa-hand-rock", "title": "hand-rock", "type": "FontAwesome" },
            { "class": "far fa-hand-rock", "title": "hand-rock", "type": "FontAwesome" },
            { "class": "fas fa-hand-scissors", "title": "hand-scissors", "type": "FontAwesome" },
            { "class": "far fa-hand-scissors", "title": "hand-scissors", "type": "FontAwesome" },
            { "class": "fas fa-hand-spock", "title": "hand-spock", "type": "FontAwesome" },
            { "class": "far fa-hand-spock", "title": "hand-spock", "type": "FontAwesome" },
            { "class": "fas fa-hands", "title": "hands", "type": "FontAwesome" },
            { "class": "fas fa-hands-helping", "title": "hands-helping", "type": "FontAwesome" },
            { "class": "fas fa-handshake", "title": "handshake", "type": "FontAwesome" },
            { "class": "far fa-handshake", "title": "handshake", "type": "FontAwesome" },
            { "class": "fas fa-hashtag", "title": "hashtag", "type": "FontAwesome" },
            { "class": "fas fa-hdd", "title": "hdd", "type": "FontAwesome" },
            { "class": "far fa-hdd", "title": "hdd", "type": "FontAwesome" },
            { "class": "fas fa-heading", "title": "heading", "type": "FontAwesome" },
            { "class": "fas fa-headphones", "title": "headphones", "type": "FontAwesome" },
            { "class": "fas fa-heart", "title": "heart", "type": "FontAwesome" },
            { "class": "far fa-heart", "title": "heart", "type": "FontAwesome" },
            { "class": "fas fa-heartbeat", "title": "heartbeat", "type": "FontAwesome" },
            { "class": "fab fa-hips", "title": "hips", "type": "FontAwesome" },
            { "class": "fab fa-hire-a-helper", "title": "hire-a-helper", "type": "FontAwesome" },
            { "class": "fas fa-history", "title": "history", "type": "FontAwesome" },
            { "class": "fas fa-hockey-puck", "title": "hockey-puck", "type": "FontAwesome" },
            { "class": "fas fa-home", "title": "home", "type": "FontAwesome" },
            { "class": "fab fa-hooli", "title": "hooli", "type": "FontAwesome" },
            { "class": "fas fa-hospital", "title": "hospital", "type": "FontAwesome" },
            { "class": "far fa-hospital", "title": "hospital", "type": "FontAwesome" },
            { "class": "fas fa-hospital-alt", "title": "hospital-alt", "type": "FontAwesome" },
            { "class": "fas fa-hospital-symbol", "title": "hospital-symbol", "type": "FontAwesome" },
            { "class": "fab fa-hotjar", "title": "hotjar", "type": "FontAwesome" },
            { "class": "fas fa-hourglass", "title": "hourglass", "type": "FontAwesome" },
            { "class": "far fa-hourglass", "title": "hourglass", "type": "FontAwesome" },
            { "class": "fas fa-hourglass-end", "title": "hourglass-end", "type": "FontAwesome" },
            { "class": "fas fa-hourglass-half", "title": "hourglass-half", "type": "FontAwesome" },
            { "class": "fas fa-hourglass-start", "title": "hourglass-start", "type": "FontAwesome" },
            { "class": "fab fa-houzz", "title": "houzz", "type": "FontAwesome" },
            { "class": "fab fa-html5", "title": "html5", "type": "FontAwesome" },
            { "class": "fab fa-hubspot", "title": "hubspot", "type": "FontAwesome" },
            { "class": "fas fa-i-cursor", "title": "i-cursor", "type": "FontAwesome" },
            { "class": "fas fa-id-badge", "title": "id-badge", "type": "FontAwesome" },
            { "class": "far fa-id-badge", "title": "id-badge", "type": "FontAwesome" },
            { "class": "fas fa-id-card", "title": "id-card", "type": "FontAwesome" },
            { "class": "far fa-id-card", "title": "id-card", "type": "FontAwesome" },
            { "class": "fas fa-id-card-alt", "title": "id-card-alt", "type": "FontAwesome" },
            { "class": "fas fa-image", "title": "image", "type": "FontAwesome" },
            { "class": "far fa-image", "title": "image", "type": "FontAwesome" },
            { "class": "fas fa-images", "title": "images", "type": "FontAwesome" },
            { "class": "far fa-images", "title": "images", "type": "FontAwesome" },
            { "class": "fab fa-imdb", "title": "imdb", "type": "FontAwesome" },
            { "class": "fas fa-inbox", "title": "inbox", "type": "FontAwesome" },
            { "class": "fas fa-indent", "title": "indent", "type": "FontAwesome" },
            { "class": "fas fa-industry", "title": "industry", "type": "FontAwesome" },
            { "class": "fas fa-info", "title": "info", "type": "FontAwesome" },
            { "class": "fas fa-info-circle", "title": "info-circle", "type": "FontAwesome" },
            { "class": "fab fa-instagram", "title": "instagram", "type": "FontAwesome" },
            { "class": "fab fa-internet-explorer", "title": "internet-explorer", "type": "FontAwesome" },
            { "class": "fab fa-ioxhost", "title": "ioxhost", "type": "FontAwesome" },
            { "class": "fas fa-italic", "title": "italic", "type": "FontAwesome" },
            { "class": "fab fa-itunes", "title": "itunes", "type": "FontAwesome" },
            { "class": "fab fa-itunes-note", "title": "itunes-note", "type": "FontAwesome" },
            { "class": "fab fa-java", "title": "java", "type": "FontAwesome" },
            { "class": "fab fa-jenkins", "title": "jenkins", "type": "FontAwesome" },
            { "class": "fab fa-joget", "title": "joget", "type": "FontAwesome" },
            { "class": "fab fa-joomla", "title": "joomla", "type": "FontAwesome" },
            { "class": "fab fa-js", "title": "js", "type": "FontAwesome" },
            { "class": "fab fa-js-square", "title": "js-square", "type": "FontAwesome" },
            { "class": "fab fa-jsfiddle", "title": "jsfiddle", "type": "FontAwesome" },
            { "class": "fas fa-key", "title": "key", "type": "FontAwesome" },
            { "class": "fas fa-keyboard", "title": "keyboard", "type": "FontAwesome" },
            { "class": "far fa-keyboard", "title": "keyboard", "type": "FontAwesome" },
            { "class": "fab fa-keycdn", "title": "keycdn", "type": "FontAwesome" },
            { "class": "fab fa-kickstarter", "title": "kickstarter", "type": "FontAwesome" },
            { "class": "fab fa-kickstarter-k", "title": "kickstarter-k", "type": "FontAwesome" },
            { "class": "fab fa-korvue", "title": "korvue", "type": "FontAwesome" },
            { "class": "fas fa-language", "title": "language", "type": "FontAwesome" },
            { "class": "fas fa-laptop", "title": "laptop", "type": "FontAwesome" },
            { "class": "fab fa-laravel", "title": "laravel", "type": "FontAwesome" },
            { "class": "fab fa-lastfm", "title": "lastfm", "type": "FontAwesome" },
            { "class": "fab fa-lastfm-square", "title": "lastfm-square", "type": "FontAwesome" },
            { "class": "fas fa-leaf", "title": "leaf", "type": "FontAwesome" },
            { "class": "fab fa-leanpub", "title": "leanpub", "type": "FontAwesome" },
            { "class": "fas fa-lemon", "title": "lemon", "type": "FontAwesome" },
            { "class": "far fa-lemon", "title": "lemon", "type": "FontAwesome" },
            { "class": "fab fa-less", "title": "less", "type": "FontAwesome" },
            { "class": "fas fa-level-down-alt", "title": "level-down-alt", "type": "FontAwesome" },
            { "class": "fas fa-level-up-alt", "title": "level-up-alt", "type": "FontAwesome" },
            { "class": "fas fa-life-ring", "title": "life-ring", "type": "FontAwesome" },
            { "class": "far fa-life-ring", "title": "life-ring", "type": "FontAwesome" },
            { "class": "fas fa-lightbulb", "title": "lightbulb", "type": "FontAwesome" },
            { "class": "far fa-lightbulb", "title": "lightbulb", "type": "FontAwesome" },
            { "class": "fab fa-line", "title": "line", "type": "FontAwesome" },
            { "class": "fas fa-link", "title": "link", "type": "FontAwesome" },
            { "class": "fab fa-linkedin", "title": "linkedin", "type": "FontAwesome" },
            { "class": "fab fa-linkedin-in", "title": "linkedin-in", "type": "FontAwesome" },
            { "class": "fab fa-linode", "title": "linode", "type": "FontAwesome" },
            { "class": "fab fa-linux", "title": "linux", "type": "FontAwesome" },
            { "class": "fas fa-lira-sign", "title": "lira-sign", "type": "FontAwesome" },
            { "class": "fas fa-list", "title": "list", "type": "FontAwesome" },
            { "class": "fas fa-list-alt", "title": "list-alt", "type": "FontAwesome" },
            { "class": "far fa-list-alt", "title": "list-alt", "type": "FontAwesome" },
            { "class": "fas fa-list-ol", "title": "list-ol", "type": "FontAwesome" },
            { "class": "fas fa-list-ul", "title": "list-ul", "type": "FontAwesome" },
            { "class": "fas fa-location-arrow", "title": "location-arrow", "type": "FontAwesome" },
            { "class": "fas fa-lock", "title": "lock", "type": "FontAwesome" },
            { "class": "fas fa-lock-open", "title": "lock-open", "type": "FontAwesome" },
            { "class": "fas fa-long-arrow-alt-down", "title": "long-arrow-alt-down", "type": "FontAwesome" },
            { "class": "fas fa-long-arrow-alt-left", "title": "long-arrow-alt-left", "type": "FontAwesome" },
            { "class": "fas fa-long-arrow-alt-right", "title": "long-arrow-alt-right", "type": "FontAwesome" },
            { "class": "fas fa-long-arrow-alt-up", "title": "long-arrow-alt-up", "type": "FontAwesome" },
            { "class": "fas fa-low-vision", "title": "low-vision", "type": "FontAwesome" },
            { "class": "fab fa-lyft", "title": "lyft", "type": "FontAwesome" },
            { "class": "fab fa-magento", "title": "magento", "type": "FontAwesome" },
            { "class": "fas fa-magic", "title": "magic", "type": "FontAwesome" },
            { "class": "fas fa-magnet", "title": "magnet", "type": "FontAwesome" },
            { "class": "fas fa-male", "title": "male", "type": "FontAwesome" },
            { "class": "fas fa-map", "title": "map", "type": "FontAwesome" },
            { "class": "far fa-map", "title": "map", "type": "FontAwesome" },
            { "class": "fas fa-map-marker", "title": "map-marker", "type": "FontAwesome" },
            { "class": "fas fa-map-marker-alt", "title": "map-marker-alt", "type": "FontAwesome" },
            { "class": "fas fa-map-pin", "title": "map-pin", "type": "FontAwesome" },
            { "class": "fas fa-map-signs", "title": "map-signs", "type": "FontAwesome" },
            { "class": "fas fa-mars", "title": "mars", "type": "FontAwesome" },
            { "class": "fas fa-mars-double", "title": "mars-double", "type": "FontAwesome" },
            { "class": "fas fa-mars-stroke", "title": "mars-stroke", "type": "FontAwesome" },
            { "class": "fas fa-mars-stroke-h", "title": "mars-stroke-h", "type": "FontAwesome" },
            { "class": "fas fa-mars-stroke-v", "title": "mars-stroke-v", "type": "FontAwesome" },
            { "class": "fab fa-maxcdn", "title": "maxcdn", "type": "FontAwesome" },
            { "class": "fab fa-medapps", "title": "medapps", "type": "FontAwesome" },
            { "class": "fab fa-medium", "title": "medium", "type": "FontAwesome" },
            { "class": "fab fa-medium-m", "title": "medium-m", "type": "FontAwesome" },
            { "class": "fas fa-medkit", "title": "medkit", "type": "FontAwesome" },
            { "class": "fab fa-medrt", "title": "medrt", "type": "FontAwesome" },
            { "class": "fab fa-meetup", "title": "meetup", "type": "FontAwesome" },
            { "class": "fas fa-meh", "title": "meh", "type": "FontAwesome" },
            { "class": "far fa-meh", "title": "meh", "type": "FontAwesome" },
            { "class": "fas fa-mercury", "title": "mercury", "type": "FontAwesome" },
            { "class": "fas fa-microchip", "title": "microchip", "type": "FontAwesome" },
            { "class": "fas fa-microphone", "title": "microphone", "type": "FontAwesome" },
            { "class": "fas fa-microphone-slash", "title": "microphone-slash", "type": "FontAwesome" },
            { "class": "fab fa-microsoft", "title": "microsoft", "type": "FontAwesome" },
            { "class": "fas fa-minus", "title": "minus", "type": "FontAwesome" },
            { "class": "fas fa-minus-circle", "title": "minus-circle", "type": "FontAwesome" },
            { "class": "fas fa-minus-square", "title": "minus-square", "type": "FontAwesome" },
            { "class": "far fa-minus-square", "title": "minus-square", "type": "FontAwesome" },
            { "class": "fab fa-mix", "title": "mix", "type": "FontAwesome" },
            { "class": "fab fa-mixcloud", "title": "mixcloud", "type": "FontAwesome" },
            { "class": "fab fa-mizuni", "title": "mizuni", "type": "FontAwesome" },
            { "class": "fas fa-mobile", "title": "mobile", "type": "FontAwesome" },
            { "class": "fas fa-mobile-alt", "title": "mobile-alt", "type": "FontAwesome" },
            { "class": "fab fa-modx", "title": "modx", "type": "FontAwesome" },
            { "class": "fab fa-monero", "title": "monero", "type": "FontAwesome" },
            { "class": "fas fa-money-bill-alt", "title": "money-bill-alt", "type": "FontAwesome" },
            { "class": "far fa-money-bill-alt", "title": "money-bill-alt", "type": "FontAwesome" },
            { "class": "fas fa-moon", "title": "moon", "type": "FontAwesome" },
            { "class": "far fa-moon", "title": "moon", "type": "FontAwesome" },
            { "class": "fas fa-motorcycle", "title": "motorcycle", "type": "FontAwesome" },
            { "class": "fas fa-mouse-pointer", "title": "mouse-pointer", "type": "FontAwesome" },
            { "class": "fas fa-music", "title": "music", "type": "FontAwesome" },
            { "class": "fab fa-napster", "title": "napster", "type": "FontAwesome" },
            { "class": "fas fa-neuter", "title": "neuter", "type": "FontAwesome" },
            { "class": "fas fa-newspaper", "title": "newspaper", "type": "FontAwesome" },
            { "class": "far fa-newspaper", "title": "newspaper", "type": "FontAwesome" },
            { "class": "fab fa-nintendo-switch", "title": "nintendo-switch", "type": "FontAwesome" },
            { "class": "fab fa-node", "title": "node", "type": "FontAwesome" },
            { "class": "fab fa-node-js", "title": "node-js", "type": "FontAwesome" },
            { "class": "fas fa-notes-medical", "title": "notes-medical", "type": "FontAwesome" },
            { "class": "fab fa-npm", "title": "npm", "type": "FontAwesome" },
            { "class": "fab fa-ns8", "title": "ns8", "type": "FontAwesome" },
            { "class": "fab fa-nutritionix", "title": "nutritionix", "type": "FontAwesome" },
            { "class": "fas fa-object-group", "title": "object-group", "type": "FontAwesome" },
            { "class": "far fa-object-group", "title": "object-group", "type": "FontAwesome" },
            { "class": "fas fa-object-ungroup", "title": "object-ungroup", "type": "FontAwesome" },
            { "class": "far fa-object-ungroup", "title": "object-ungroup", "type": "FontAwesome" },
            { "class": "fab fa-odnoklassniki", "title": "odnoklassniki", "type": "FontAwesome" },
            { "class": "fab fa-odnoklassniki-square", "title": "odnoklassniki-square", "type": "FontAwesome" },
            { "class": "fab fa-opencart", "title": "opencart", "type": "FontAwesome" },
            { "class": "fab fa-openid", "title": "openid", "type": "FontAwesome" },
            { "class": "fab fa-opera", "title": "opera", "type": "FontAwesome" },
            { "class": "fab fa-optin-monster", "title": "optin-monster", "type": "FontAwesome" },
            { "class": "fab fa-osi", "title": "osi", "type": "FontAwesome" },
            { "class": "fas fa-outdent", "title": "outdent", "type": "FontAwesome" },
            { "class": "fab fa-page4", "title": "page4", "type": "FontAwesome" },
            { "class": "fab fa-pagelines", "title": "pagelines", "type": "FontAwesome" },
            { "class": "fas fa-paint-brush", "title": "paint-brush", "type": "FontAwesome" },
            { "class": "fab fa-palfed", "title": "palfed", "type": "FontAwesome" },
            { "class": "fas fa-pallet", "title": "pallet", "type": "FontAwesome" },
            { "class": "fas fa-paper-plane", "title": "paper-plane", "type": "FontAwesome" },
            { "class": "far fa-paper-plane", "title": "paper-plane", "type": "FontAwesome" },
            { "class": "fas fa-paperclip", "title": "paperclip", "type": "FontAwesome" },
            { "class": "fas fa-parachute-box", "title": "parachute-box", "type": "FontAwesome" },
            { "class": "fas fa-paragraph", "title": "paragraph", "type": "FontAwesome" },
            { "class": "fas fa-paste", "title": "paste", "type": "FontAwesome" },
            { "class": "fab fa-patreon", "title": "patreon", "type": "FontAwesome" },
            { "class": "fas fa-pause", "title": "pause", "type": "FontAwesome" },
            { "class": "fas fa-pause-circle", "title": "pause-circle", "type": "FontAwesome" },
            { "class": "far fa-pause-circle", "title": "pause-circle", "type": "FontAwesome" },
            { "class": "fas fa-paw", "title": "paw", "type": "FontAwesome" },
            { "class": "fab fa-paypal", "title": "paypal", "type": "FontAwesome" },
            { "class": "fas fa-pen-square", "title": "pen-square", "type": "FontAwesome" },
            { "class": "fas fa-pencil-alt", "title": "pencil-alt", "type": "FontAwesome" },
            { "class": "fas fa-people-carry", "title": "people-carry", "type": "FontAwesome" },
            { "class": "fas fa-percent", "title": "percent", "type": "FontAwesome" },
            { "class": "fab fa-periscope", "title": "periscope", "type": "FontAwesome" },
            { "class": "fab fa-phabricator", "title": "phabricator", "type": "FontAwesome" },
            { "class": "fab fa-phoenix-framework", "title": "phoenix-framework", "type": "FontAwesome" },
            { "class": "fas fa-phone", "title": "phone", "type": "FontAwesome" },
            { "class": "fas fa-phone-slash", "title": "phone-slash", "type": "FontAwesome" },
            { "class": "fas fa-phone-square", "title": "phone-square", "type": "FontAwesome" },
            { "class": "fas fa-phone-volume", "title": "phone-volume", "type": "FontAwesome" },
            { "class": "fab fa-php", "title": "php", "type": "FontAwesome" },
            { "class": "fab fa-pied-piper", "title": "pied-piper", "type": "FontAwesome" },
            { "class": "fab fa-pied-piper-alt", "title": "pied-piper-alt", "type": "FontAwesome" },
            { "class": "fab fa-pied-piper-hat", "title": "pied-piper-hat", "type": "FontAwesome" },
            { "class": "fab fa-pied-piper-pp", "title": "pied-piper-pp", "type": "FontAwesome" },
            { "class": "fas fa-piggy-bank", "title": "piggy-bank", "type": "FontAwesome" },
            { "class": "fas fa-pills", "title": "pills", "type": "FontAwesome" },
            { "class": "fab fa-pinterest", "title": "pinterest", "type": "FontAwesome" },
            { "class": "fab fa-pinterest-p", "title": "pinterest-p", "type": "FontAwesome" },
            { "class": "fab fa-pinterest-square", "title": "pinterest-square", "type": "FontAwesome" },
            { "class": "fas fa-plane", "title": "plane", "type": "FontAwesome" },
            { "class": "fas fa-play", "title": "play", "type": "FontAwesome" },
            { "class": "fas fa-play-circle", "title": "play-circle", "type": "FontAwesome" },
            { "class": "far fa-play-circle", "title": "play-circle", "type": "FontAwesome" },
            { "class": "fab fa-playstation", "title": "playstation", "type": "FontAwesome" },
            { "class": "fas fa-plug", "title": "plug", "type": "FontAwesome" },
            { "class": "fas fa-plus", "title": "plus", "type": "FontAwesome" },
            { "class": "fas fa-plus-circle", "title": "plus-circle", "type": "FontAwesome" },
            { "class": "fas fa-plus-square", "title": "plus-square", "type": "FontAwesome" },
            { "class": "far fa-plus-square", "title": "plus-square", "type": "FontAwesome" },
            { "class": "fas fa-podcast", "title": "podcast", "type": "FontAwesome" },
            { "class": "fas fa-poo", "title": "poo", "type": "FontAwesome" },
            { "class": "fas fa-pound-sign", "title": "pound-sign", "type": "FontAwesome" },
            { "class": "fas fa-power-off", "title": "power-off", "type": "FontAwesome" },
            { "class": "fas fa-prescription-bottle", "title": "prescription-bottle", "type": "FontAwesome" },
            { "class": "fas fa-prescription-bottle-alt", "title": "prescription-bottle-alt", "type": "FontAwesome" },
            { "class": "fas fa-print", "title": "print", "type": "FontAwesome" },
            { "class": "fas fa-procedures", "title": "procedures", "type": "FontAwesome" },
            { "class": "fab fa-product-hunt", "title": "product-hunt", "type": "FontAwesome" },
            { "class": "fab fa-pushed", "title": "pushed", "type": "FontAwesome" },
            { "class": "fas fa-puzzle-piece", "title": "puzzle-piece", "type": "FontAwesome" },
            { "class": "fab fa-python", "title": "python", "type": "FontAwesome" },
            { "class": "fab fa-qq", "title": "qq", "type": "FontAwesome" },
            { "class": "fas fa-qrcode", "title": "qrcode", "type": "FontAwesome" },
            { "class": "fas fa-question", "title": "question", "type": "FontAwesome" },
            { "class": "fas fa-question-circle", "title": "question-circle", "type": "FontAwesome" },
            { "class": "far fa-question-circle", "title": "question-circle", "type": "FontAwesome" },
            { "class": "fas fa-quidditch", "title": "quidditch", "type": "FontAwesome" },
            { "class": "fab fa-quinscape", "title": "quinscape", "type": "FontAwesome" },
            { "class": "fab fa-quora", "title": "quora", "type": "FontAwesome" },
            { "class": "fas fa-quote-left", "title": "quote-left", "type": "FontAwesome" },
            { "class": "fas fa-quote-right", "title": "quote-right", "type": "FontAwesome" },
            { "class": "fas fa-random", "title": "random", "type": "FontAwesome" },
            { "class": "fab fa-ravelry", "title": "ravelry", "type": "FontAwesome" },
            { "class": "fab fa-react", "title": "react", "type": "FontAwesome" },
            { "class": "fab fa-readme", "title": "readme", "type": "FontAwesome" },
            { "class": "fab fa-rebel", "title": "rebel", "type": "FontAwesome" },
            { "class": "fas fa-recycle", "title": "recycle", "type": "FontAwesome" },
            { "class": "fab fa-red-river", "title": "red-river", "type": "FontAwesome" },
            { "class": "fab fa-reddit", "title": "reddit", "type": "FontAwesome" },
            { "class": "fab fa-reddit-alien", "title": "reddit-alien", "type": "FontAwesome" },
            { "class": "fab fa-reddit-square", "title": "reddit-square", "type": "FontAwesome" },
            { "class": "fas fa-redo", "title": "redo", "type": "FontAwesome" },
            { "class": "fas fa-redo-alt", "title": "redo-alt", "type": "FontAwesome" },
            { "class": "fas fa-registered", "title": "registered", "type": "FontAwesome" },
            { "class": "far fa-registered", "title": "registered", "type": "FontAwesome" },
            { "class": "fab fa-rendact", "title": "rendact", "type": "FontAwesome" },
            { "class": "fab fa-renren", "title": "renren", "type": "FontAwesome" },
            { "class": "fas fa-reply", "title": "reply", "type": "FontAwesome" },
            { "class": "fas fa-reply-all", "title": "reply-all", "type": "FontAwesome" },
            { "class": "fab fa-replyd", "title": "replyd", "type": "FontAwesome" },
            { "class": "fab fa-resolving", "title": "resolving", "type": "FontAwesome" },
            { "class": "fas fa-retweet", "title": "retweet", "type": "FontAwesome" },
            { "class": "fas fa-ribbon", "title": "ribbon", "type": "FontAwesome" },
            { "class": "fas fa-road", "title": "road", "type": "FontAwesome" },
            { "class": "fas fa-rocket", "title": "rocket", "type": "FontAwesome" },
            { "class": "fab fa-rocketchat", "title": "rocketchat", "type": "FontAwesome" },
            { "class": "fab fa-rockrms", "title": "rockrms", "type": "FontAwesome" },
            { "class": "fas fa-rss", "title": "rss", "type": "FontAwesome" },
            { "class": "fas fa-rss-square", "title": "rss-square", "type": "FontAwesome" },
            { "class": "fas fa-ruble-sign", "title": "ruble-sign", "type": "FontAwesome" },
            { "class": "fas fa-rupee-sign", "title": "rupee-sign", "type": "FontAwesome" },
            { "class": "fab fa-safari", "title": "safari", "type": "FontAwesome" },
            { "class": "fab fa-sass", "title": "sass", "type": "FontAwesome" },
            { "class": "fas fa-save", "title": "save", "type": "FontAwesome" },
            { "class": "far fa-save", "title": "save", "type": "FontAwesome" },
            { "class": "fab fa-schlix", "title": "schlix", "type": "FontAwesome" },
            { "class": "fab fa-scribd", "title": "scribd", "type": "FontAwesome" },
            { "class": "fas fa-search", "title": "search", "type": "FontAwesome" },
            { "class": "fas fa-search-minus", "title": "search-minus", "type": "FontAwesome" },
            { "class": "fas fa-search-plus", "title": "search-plus", "type": "FontAwesome" },
            { "class": "fab fa-searchengin", "title": "searchengin", "type": "FontAwesome" },
            { "class": "fas fa-seedling", "title": "seedling", "type": "FontAwesome" },
            { "class": "fab fa-sellcast", "title": "sellcast", "type": "FontAwesome" },
            { "class": "fab fa-sellsy", "title": "sellsy", "type": "FontAwesome" },
            { "class": "fas fa-server", "title": "server", "type": "FontAwesome" },
            { "class": "fab fa-servicestack", "title": "servicestack", "type": "FontAwesome" },
            { "class": "fas fa-share", "title": "share", "type": "FontAwesome" },
            { "class": "fas fa-share-alt", "title": "share-alt", "type": "FontAwesome" },
            { "class": "fas fa-share-alt-square", "title": "share-alt-square", "type": "FontAwesome" },
            { "class": "fas fa-share-square", "title": "share-square", "type": "FontAwesome" },
            { "class": "far fa-share-square", "title": "share-square", "type": "FontAwesome" },
            { "class": "fas fa-shekel-sign", "title": "shekel-sign", "type": "FontAwesome" },
            { "class": "fas fa-shield-alt", "title": "shield-alt", "type": "FontAwesome" },
            { "class": "fas fa-ship", "title": "ship", "type": "FontAwesome" },
            { "class": "fas fa-shipping-fast", "title": "shipping-fast", "type": "FontAwesome" },
            { "class": "fab fa-shirtsinbulk", "title": "shirtsinbulk", "type": "FontAwesome" },
            { "class": "fas fa-shopping-bag", "title": "shopping-bag", "type": "FontAwesome" },
            { "class": "fas fa-shopping-basket", "title": "shopping-basket", "type": "FontAwesome" },
            { "class": "fas fa-shopping-cart", "title": "shopping-cart", "type": "FontAwesome" },
            { "class": "fas fa-shower", "title": "shower", "type": "FontAwesome" },
            { "class": "fas fa-sign", "title": "sign", "type": "FontAwesome" },
            { "class": "fas fa-sign-in-alt", "title": "sign-in-alt", "type": "FontAwesome" },
            { "class": "fas fa-sign-language", "title": "sign-language", "type": "FontAwesome" },
            { "class": "fas fa-sign-out-alt", "title": "sign-out-alt", "type": "FontAwesome" },
            { "class": "fas fa-signal", "title": "signal", "type": "FontAwesome" },
            { "class": "fab fa-simplybuilt", "title": "simplybuilt", "type": "FontAwesome" },
            { "class": "fab fa-sistrix", "title": "sistrix", "type": "FontAwesome" },
            { "class": "fas fa-sitemap", "title": "sitemap", "type": "FontAwesome" },
            { "class": "fab fa-skyatlas", "title": "skyatlas", "type": "FontAwesome" },
            { "class": "fab fa-skype", "title": "skype", "type": "FontAwesome" },
            { "class": "fab fa-slack", "title": "slack", "type": "FontAwesome" },
            { "class": "fab fa-slack-hash", "title": "slack-hash", "type": "FontAwesome" },
            { "class": "fas fa-sliders-h", "title": "sliders-h", "type": "FontAwesome" },
            { "class": "fab fa-slideshare", "title": "slideshare", "type": "FontAwesome" },
            { "class": "fas fa-smile", "title": "smile", "type": "FontAwesome" },
            { "class": "far fa-smile", "title": "smile", "type": "FontAwesome" },
            { "class": "fas fa-smoking", "title": "smoking", "type": "FontAwesome" },
            { "class": "fab fa-snapchat", "title": "snapchat", "type": "FontAwesome" },
            { "class": "fab fa-snapchat-ghost", "title": "snapchat-ghost", "type": "FontAwesome" },
            { "class": "fab fa-snapchat-square", "title": "snapchat-square", "type": "FontAwesome" },
            { "class": "fas fa-snowflake", "title": "snowflake", "type": "FontAwesome" },
            { "class": "far fa-snowflake", "title": "snowflake", "type": "FontAwesome" },
            { "class": "fas fa-sort", "title": "sort", "type": "FontAwesome" },
            { "class": "fas fa-sort-alpha-down", "title": "sort-alpha-down", "type": "FontAwesome" },
            { "class": "fas fa-sort-alpha-up", "title": "sort-alpha-up", "type": "FontAwesome" },
            { "class": "fas fa-sort-amount-down", "title": "sort-amount-down", "type": "FontAwesome" },
            { "class": "fas fa-sort-amount-up", "title": "sort-amount-up", "type": "FontAwesome" },
            { "class": "fas fa-sort-down", "title": "sort-down", "type": "FontAwesome" },
            { "class": "fas fa-sort-numeric-down", "title": "sort-numeric-down", "type": "FontAwesome" },
            { "class": "fas fa-sort-numeric-up", "title": "sort-numeric-up", "type": "FontAwesome" },
            { "class": "fas fa-sort-up", "title": "sort-up", "type": "FontAwesome" },
            { "class": "fab fa-soundcloud", "title": "soundcloud", "type": "FontAwesome" },
            { "class": "fas fa-space-shuttle", "title": "space-shuttle", "type": "FontAwesome" },
            { "class": "fab fa-speakap", "title": "speakap", "type": "FontAwesome" },
            { "class": "fas fa-spinner", "title": "spinner", "type": "FontAwesome" },
            { "class": "fab fa-spotify", "title": "spotify", "type": "FontAwesome" },
            { "class": "fas fa-square", "title": "square", "type": "FontAwesome" },
            { "class": "far fa-square", "title": "square", "type": "FontAwesome" },
            { "class": "fas fa-square-full", "title": "square-full", "type": "FontAwesome" },
            { "class": "fab fa-stack-exchange", "title": "stack-exchange", "type": "FontAwesome" },
            { "class": "fab fa-stack-overflow", "title": "stack-overflow", "type": "FontAwesome" },
            { "class": "fas fa-star", "title": "star", "type": "FontAwesome" },
            { "class": "far fa-star", "title": "star", "type": "FontAwesome" },
            { "class": "fas fa-star-half", "title": "star-half", "type": "FontAwesome" },
            { "class": "far fa-star-half", "title": "star-half", "type": "FontAwesome" },
            { "class": "fab fa-staylinked", "title": "staylinked", "type": "FontAwesome" },
            { "class": "fab fa-steam", "title": "steam", "type": "FontAwesome" },
            { "class": "fab fa-steam-square", "title": "steam-square", "type": "FontAwesome" },
            { "class": "fab fa-steam-symbol", "title": "steam-symbol", "type": "FontAwesome" },
            { "class": "fas fa-step-backward", "title": "step-backward", "type": "FontAwesome" },
            { "class": "fas fa-step-forward", "title": "step-forward", "type": "FontAwesome" },
            { "class": "fas fa-stethoscope", "title": "stethoscope", "type": "FontAwesome" },
            { "class": "fab fa-sticker-mule", "title": "sticker-mule", "type": "FontAwesome" },
            { "class": "fas fa-sticky-note", "title": "sticky-note", "type": "FontAwesome" },
            { "class": "far fa-sticky-note", "title": "sticky-note", "type": "FontAwesome" },
            { "class": "fas fa-stop", "title": "stop", "type": "FontAwesome" },
            { "class": "fas fa-stop-circle", "title": "stop-circle", "type": "FontAwesome" },
            { "class": "far fa-stop-circle", "title": "stop-circle", "type": "FontAwesome" },
            { "class": "fas fa-stopwatch", "title": "stopwatch", "type": "FontAwesome" },
            { "class": "fab fa-strava", "title": "strava", "type": "FontAwesome" },
            { "class": "fas fa-street-view", "title": "street-view", "type": "FontAwesome" },
            { "class": "fas fa-strikethrough", "title": "strikethrough", "type": "FontAwesome" },
            { "class": "fab fa-stripe", "title": "stripe", "type": "FontAwesome" },
            { "class": "fab fa-stripe-s", "title": "stripe-s", "type": "FontAwesome" },
            { "class": "fab fa-studiovinari", "title": "studiovinari", "type": "FontAwesome" },
            { "class": "fab fa-stumbleupon", "title": "stumbleupon", "type": "FontAwesome" },
            { "class": "fab fa-stumbleupon-circle", "title": "stumbleupon-circle", "type": "FontAwesome" },
            { "class": "fas fa-subscript", "title": "subscript", "type": "FontAwesome" },
            { "class": "fas fa-subway", "title": "subway", "type": "FontAwesome" },
            { "class": "fas fa-suitcase", "title": "suitcase", "type": "FontAwesome" },
            { "class": "fas fa-sun", "title": "sun", "type": "FontAwesome" },
            { "class": "far fa-sun", "title": "sun", "type": "FontAwesome" },
            { "class": "fab fa-superpowers", "title": "superpowers", "type": "FontAwesome" },
            { "class": "fas fa-superscript", "title": "superscript", "type": "FontAwesome" },
            { "class": "fab fa-supple", "title": "supple", "type": "FontAwesome" },
            { "class": "fas fa-sync", "title": "sync", "type": "FontAwesome" },
            { "class": "fas fa-sync-alt", "title": "sync-alt", "type": "FontAwesome" },
            { "class": "fas fa-syringe", "title": "syringe", "type": "FontAwesome" },
            { "class": "fas fa-table", "title": "table", "type": "FontAwesome" },
            { "class": "fas fa-table-tennis", "title": "table-tennis", "type": "FontAwesome" },
            { "class": "fas fa-tablet", "title": "tablet", "type": "FontAwesome" },
            { "class": "fas fa-tablet-alt", "title": "tablet-alt", "type": "FontAwesome" },
            { "class": "fas fa-tablets", "title": "tablets", "type": "FontAwesome" },
            { "class": "fas fa-tachometer-alt", "title": "tachometer-alt", "type": "FontAwesome" },
            { "class": "fas fa-tag", "title": "tag", "type": "FontAwesome" },
            { "class": "fas fa-tags", "title": "tags", "type": "FontAwesome" },
            { "class": "fas fa-tape", "title": "tape", "type": "FontAwesome" },
            { "class": "fas fa-tasks", "title": "tasks", "type": "FontAwesome" },
            { "class": "fas fa-taxi", "title": "taxi", "type": "FontAwesome" },
            { "class": "fab fa-telegram", "title": "telegram", "type": "FontAwesome" },
            { "class": "fab fa-telegram-plane", "title": "telegram-plane", "type": "FontAwesome" },
            { "class": "fab fa-tencent-weibo", "title": "tencent-weibo", "type": "FontAwesome" },
            { "class": "fas fa-terminal", "title": "terminal", "type": "FontAwesome" },
            { "class": "fas fa-text-height", "title": "text-height", "type": "FontAwesome" },
            { "class": "fas fa-text-width", "title": "text-width", "type": "FontAwesome" },
            { "class": "fas fa-th", "title": "th", "type": "FontAwesome" },
            { "class": "fas fa-th-large", "title": "th-large", "type": "FontAwesome" },
            { "class": "fas fa-th-list", "title": "th-list", "type": "FontAwesome" },
            { "class": "fab fa-themeisle", "title": "themeisle", "type": "FontAwesome" },
            { "class": "fas fa-thermometer", "title": "thermometer", "type": "FontAwesome" },
            { "class": "fas fa-thermometer-empty", "title": "thermometer-empty", "type": "FontAwesome" },
            { "class": "fas fa-thermometer-full", "title": "thermometer-full", "type": "FontAwesome" },
            { "class": "fas fa-thermometer-half", "title": "thermometer-half", "type": "FontAwesome" },
            { "class": "fas fa-thermometer-quarter", "title": "thermometer-quarter", "type": "FontAwesome" },
            { "class": "fas fa-thermometer-three-quarters", "title": "thermometer-three-quarters", "type": "FontAwesome" },
            { "class": "fas fa-thumbs-down", "title": "thumbs-down", "type": "FontAwesome" },
            { "class": "far fa-thumbs-down", "title": "thumbs-down", "type": "FontAwesome" },
            { "class": "fas fa-thumbs-up", "title": "thumbs-up", "type": "FontAwesome" },
            { "class": "far fa-thumbs-up", "title": "thumbs-up", "type": "FontAwesome" },
            { "class": "fas fa-thumbtack", "title": "thumbtack", "type": "FontAwesome" },
            { "class": "fas fa-ticket-alt", "title": "ticket-alt", "type": "FontAwesome" },
            { "class": "fas fa-times", "title": "times", "type": "FontAwesome" },
            { "class": "fas fa-times-circle", "title": "times-circle", "type": "FontAwesome" },
            { "class": "far fa-times-circle", "title": "times-circle", "type": "FontAwesome" },
            { "class": "fas fa-tint", "title": "tint", "type": "FontAwesome" },
            { "class": "fas fa-toggle-off", "title": "toggle-off", "type": "FontAwesome" },
            { "class": "fas fa-toggle-on", "title": "toggle-on", "type": "FontAwesome" },
            { "class": "fas fa-trademark", "title": "trademark", "type": "FontAwesome" },
            { "class": "fas fa-train", "title": "train", "type": "FontAwesome" },
            { "class": "fas fa-transgender", "title": "transgender", "type": "FontAwesome" },
            { "class": "fas fa-transgender-alt", "title": "transgender-alt", "type": "FontAwesome" },
            { "class": "fas fa-trash", "title": "trash", "type": "FontAwesome" },
            { "class": "fas fa-trash-alt", "title": "trash-alt", "type": "FontAwesome" },
            { "class": "far fa-trash-alt", "title": "trash-alt", "type": "FontAwesome" },
            { "class": "fas fa-tree", "title": "tree", "type": "FontAwesome" },
            { "class": "fab fa-trello", "title": "trello", "type": "FontAwesome" },
            { "class": "fab fa-tripadvisor", "title": "tripadvisor", "type": "FontAwesome" },
            { "class": "fas fa-trophy", "title": "trophy", "type": "FontAwesome" },
            { "class": "fas fa-truck", "title": "truck", "type": "FontAwesome" },
            { "class": "fas fa-truck-loading", "title": "truck-loading", "type": "FontAwesome" },
            { "class": "fas fa-truck-moving", "title": "truck-moving", "type": "FontAwesome" },
            { "class": "fas fa-tty", "title": "tty", "type": "FontAwesome" },
            { "class": "fab fa-tumblr", "title": "tumblr", "type": "FontAwesome" },
            { "class": "fab fa-tumblr-square", "title": "tumblr-square", "type": "FontAwesome" },
            { "class": "fas fa-tv", "title": "tv", "type": "FontAwesome" },
            { "class": "fab fa-twitch", "title": "twitch", "type": "FontAwesome" },
            { "class": "fab fa-twitter", "title": "twitter", "type": "FontAwesome" },
            { "class": "fab fa-twitter-square", "title": "twitter-square", "type": "FontAwesome" },
            { "class": "fab fa-typo3", "title": "typo3", "type": "FontAwesome" },
            { "class": "fab fa-uber", "title": "uber", "type": "FontAwesome" },
            { "class": "fab fa-uikit", "title": "uikit", "type": "FontAwesome" },
            { "class": "fas fa-umbrella", "title": "umbrella", "type": "FontAwesome" },
            { "class": "fas fa-underline", "title": "underline", "type": "FontAwesome" },
            { "class": "fas fa-undo", "title": "undo", "type": "FontAwesome" },
            { "class": "fas fa-undo-alt", "title": "undo-alt", "type": "FontAwesome" },
            { "class": "fab fa-uniregistry", "title": "uniregistry", "type": "FontAwesome" },
            { "class": "fas fa-universal-access", "title": "universal-access", "type": "FontAwesome" },
            { "class": "fas fa-university", "title": "university", "type": "FontAwesome" },
            { "class": "fas fa-unlink", "title": "unlink", "type": "FontAwesome" },
            { "class": "fas fa-unlock", "title": "unlock", "type": "FontAwesome" },
            { "class": "fas fa-unlock-alt", "title": "unlock-alt", "type": "FontAwesome" },
            { "class": "fab fa-untappd", "title": "untappd", "type": "FontAwesome" },
            { "class": "fas fa-upload", "title": "upload", "type": "FontAwesome" },
            { "class": "fab fa-usb", "title": "usb", "type": "FontAwesome" },
            { "class": "fas fa-user", "title": "user", "type": "FontAwesome" },
            { "class": "far fa-user", "title": "user", "type": "FontAwesome" },
            { "class": "fas fa-user-circle", "title": "user-circle", "type": "FontAwesome" },
            { "class": "far fa-user-circle", "title": "user-circle", "type": "FontAwesome" },
            { "class": "fas fa-user-md", "title": "user-md", "type": "FontAwesome" },
            { "class": "fas fa-user-plus", "title": "user-plus", "type": "FontAwesome" },
            { "class": "fas fa-user-secret", "title": "user-secret", "type": "FontAwesome" },
            { "class": "fas fa-user-times", "title": "user-times", "type": "FontAwesome" },
            { "class": "fas fa-users", "title": "users", "type": "FontAwesome" },
            { "class": "fab fa-ussunnah", "title": "ussunnah", "type": "FontAwesome" },
            { "class": "fas fa-utensil-spoon", "title": "utensil-spoon", "type": "FontAwesome" },
            { "class": "fas fa-utensils", "title": "utensils", "type": "FontAwesome" },
            { "class": "fab fa-vaadin", "title": "vaadin", "type": "FontAwesome" },
            { "class": "fas fa-venus", "title": "venus", "type": "FontAwesome" },
            { "class": "fas fa-venus-double", "title": "venus-double", "type": "FontAwesome" },
            { "class": "fas fa-venus-mars", "title": "venus-mars", "type": "FontAwesome" },
            { "class": "fab fa-viacoin", "title": "viacoin", "type": "FontAwesome" },
            { "class": "fab fa-viadeo", "title": "viadeo", "type": "FontAwesome" },
            { "class": "fab fa-viadeo-square", "title": "viadeo-square", "type": "FontAwesome" },
            { "class": "fas fa-vial", "title": "vial", "type": "FontAwesome" },
            { "class": "fas fa-vials", "title": "vials", "type": "FontAwesome" },
            { "class": "fab fa-viber", "title": "viber", "type": "FontAwesome" },
            { "class": "fas fa-video", "title": "video", "type": "FontAwesome" },
            { "class": "fas fa-video-slash", "title": "video-slash", "type": "FontAwesome" },
            { "class": "fab fa-vimeo", "title": "vimeo", "type": "FontAwesome" },
            { "class": "fab fa-vimeo-square", "title": "vimeo-square", "type": "FontAwesome" },
            { "class": "fab fa-vimeo-v", "title": "vimeo-v", "type": "FontAwesome" },
            { "class": "fab fa-vine", "title": "vine", "type": "FontAwesome" },
            { "class": "fab fa-vk", "title": "vk", "type": "FontAwesome" },
            { "class": "fab fa-vnv", "title": "vnv", "type": "FontAwesome" },
            { "class": "fas fa-volleyball-ball", "title": "volleyball-ball", "type": "FontAwesome" },
            { "class": "fas fa-volume-down", "title": "volume-down", "type": "FontAwesome" },
            { "class": "fas fa-volume-off", "title": "volume-off", "type": "FontAwesome" },
            { "class": "fas fa-volume-up", "title": "volume-up", "type": "FontAwesome" },
            { "class": "fab fa-vuejs", "title": "vuejs", "type": "FontAwesome" },
            { "class": "fas fa-warehouse", "title": "warehouse", "type": "FontAwesome" },
            { "class": "fab fa-weibo", "title": "weibo", "type": "FontAwesome" },
            { "class": "fas fa-weight", "title": "weight", "type": "FontAwesome" },
            { "class": "fab fa-weixin", "title": "weixin", "type": "FontAwesome" },
            { "class": "fab fa-whatsapp", "title": "whatsapp", "type": "FontAwesome" },
            { "class": "fab fa-whatsapp-square", "title": "whatsapp-square", "type": "FontAwesome" },
            { "class": "fas fa-wheelchair", "title": "wheelchair", "type": "FontAwesome" },
            { "class": "fab fa-whmcs", "title": "whmcs", "type": "FontAwesome" },
            { "class": "fas fa-wifi", "title": "wifi", "type": "FontAwesome" },
            { "class": "fab fa-wikipedia-w", "title": "wikipedia-w", "type": "FontAwesome" },
            { "class": "fas fa-window-close", "title": "window-close", "type": "FontAwesome" },
            { "class": "far fa-window-close", "title": "window-close", "type": "FontAwesome" },
            { "class": "fas fa-window-maximize", "title": "window-maximize", "type": "FontAwesome" },
            { "class": "far fa-window-maximize", "title": "window-maximize", "type": "FontAwesome" },
            { "class": "fas fa-window-minimize", "title": "window-minimize", "type": "FontAwesome" },
            { "class": "far fa-window-minimize", "title": "window-minimize", "type": "FontAwesome" },
            { "class": "fas fa-window-restore", "title": "window-restore", "type": "FontAwesome" },
            { "class": "far fa-window-restore", "title": "window-restore", "type": "FontAwesome" },
            { "class": "fab fa-windows", "title": "windows", "type": "FontAwesome" },
            { "class": "fas fa-wine-glass", "title": "wine-glass", "type": "FontAwesome" },
            { "class": "fas fa-won-sign", "title": "won-sign", "type": "FontAwesome" },
            { "class": "fab fa-wordpress", "title": "wordpress", "type": "FontAwesome" },
            { "class": "fab fa-wordpress-simple", "title": "wordpress-simple", "type": "FontAwesome" },
            { "class": "fab fa-wpbeginner", "title": "wpbeginner", "type": "FontAwesome" },
            { "class": "fab fa-wpexplorer", "title": "wpexplorer", "type": "FontAwesome" },
            { "class": "fab fa-wpforms", "title": "wpforms", "type": "FontAwesome" },
            { "class": "fas fa-wrench", "title": "wrench", "type": "FontAwesome" },
            { "class": "fas fa-x-ray", "title": "x-ray", "type": "FontAwesome" },
            { "class": "fab fa-xbox", "title": "xbox", "type": "FontAwesome" },
            { "class": "fab fa-xing", "title": "xing", "type": "FontAwesome" },
            { "class": "fab fa-xing-square", "title": "xing-square", "type": "FontAwesome" },
            { "class": "fab fa-y-combinator", "title": "y-combinator", "type": "FontAwesome" },
            { "class": "fab fa-yahoo", "title": "yahoo", "type": "FontAwesome" },
            { "class": "fab fa-yandex", "title": "yandex", "type": "FontAwesome" },
            { "class": "fab fa-yandex-international", "title": "yandex-international", "type": "FontAwesome" },
            { "class": "fab fa-yelp", "title": "yelp", "type": "FontAwesome" },
            { "class": "fas fa-yen-sign", "title": "yen-sign", "type": "FontAwesome" },
            { "class": "fab fa-yoast", "title": "yoast", "type": "FontAwesome" },
            { "class": "fab fa-youtube", "title": "youtube", "type": "FontAwesome" },
            { "class": "fab fa-youtube-square", "title": "youtube-square", "type": "FontAwesome" },
            { "class": "jarrow jarrow-arrow-one-up", "title": "arrow one", "type": "JArrow" }
        ];

        const combinedIcons = fontAwesome.concat(this.getListIconsArrow(), this.getListIconsClose(), this.getListIconsSocial());

        return combinedIcons;

    }


    getListIconsArrow() {
        const numberWords = [
            'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
            'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
            'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty',
            'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'forty',
            'forty-one', 'forty-two', 'forty-three', 'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine', 'fifty',
            'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine', 'sixty',
            'sixty-one', 'sixty-two', 'sixty-three', 'sixty-four', 'sixty-five', 'sixty-six', 'sixty-seven', 'sixty-eight', 'sixty-nine', 'seventy',
            'seventy-one', 'seventy-two', 'seventy-three', 'seventy-four', 'seventy-five'
        ];

        const array = [];

        numberWords.forEach(val => {
            ['up', 'down', 'left', 'right'].forEach(direction => {
                array.push({
                    class: `jarrow jarrow-arrow-${val}-${direction}`,
                    title: `arrow ${val}`,
                    type: 'JArrow'
                });
            });
        });

        return array;
    }

    getListIconsClose() {
        const numberWords = [
            'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
            'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
            'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty',
            'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'forty',
            'forty-one', 'forty-two'
        ];

        const array = [];

        numberWords.forEach(val => {
            array.push({
                class: `jclose jclose-close-${val}`,
                title: `close ${val}`,
                type: 'JClose'
            });
        });

        return array;
    }

    getListIconsSocial() {
        const numberWords = [
            'ask', 'baidu', 'bandcamp', 'behance', 'bing', 'cafemom', 'care2', 'delicious', 'deviantart', 'discord',
            'dogpile', 'dribbble', 'dropbox', 'duckduckgo', 'ecosia', 'ello', 'excite', 'facebook', 'flickr',
            'gab', 'gigablast', 'google', 'hi5', 'hotbot', 'info', 'instagram', 'lastfm', 'linkedin', 'livejournal',
            'lycos', 'massenger', 'mastodon', 'medium', 'meetup', 'mix', 'mixi.jp', 'mojeek', 'myspace', 'nexopia',
            'paypal', 'pinterest', 'quant', 'quora', 'reddit', 'renren', 'shopify', 'skype', 'slideshare', 'snapchat',
            'soundcloud', 'spotify', 'startpage', 'swisscows', 'telegram', 'tiktok', 'tumblr', 'twitch', 'varizon',
            'vero', 'vimeo', 'vk', 'webcrawler', 'wechat', 'weibo', 'whatsapp', 'wolframalpha', 'x', 'xing', 'yahoo',
            'yandex', 'youtube'
        ];

        const array = [];

        numberWords.forEach(val => {
            array.push({ class: `jsocial jsocial-${val}`, title: val, type: 'JSocial' });
            array.push({ class: `jsocial jsocial-${val}-round`, title: `${val} round`, type: 'JSocial' });
            array.push({ class: `jsocial jsocial-${val}-square`, title: `${val} square`, type: 'JSocial' });
        });

        return array;
    }

    // Example usage:
    //const icons = getListIcons();



    selectIcon(iconClass, iconItem) {
        if (this.popType === 'single_select') {
            this.selectedIcons = [iconClass];
            this.modal.querySelectorAll('.icon-item').forEach(item => item.classList.remove('selected'));
            iconItem.classList.add('selected');
        } else if (this.popType === 'multiple_select') {
            const index = this.selectedIcons.indexOf(iconClass);
            if (index > -1) {
                this.selectedIcons.splice(index, 1);
                iconItem.classList.remove('selected');
            } else {
                this.selectedIcons.push(iconClass);
                iconItem.classList.add('selected');
            }
        }

        $(this.modal).find('.selected-qty').html("Item selected " + this.selectedIcons.length);
    }

    confirmSelection() {
        const selectedIconsString = this.getValues().selectedFiles.join(',');

        if (this.dataFor === 'icon' && this.dataSelector) {
            const inputField = document.querySelector(this.dataSelector);
            if (inputField) {
                inputField.value = selectedIconsString || '';

                const iconDisplay = inputField.closest('.icon-box').querySelector('.icon-selected i');
                if (iconDisplay) {
                    iconDisplay.className = selectedIconsString || '';
                }

                // Trigger change event on the specific input field to notify the icon control
                $(inputField).trigger('change');
            }
        }

        this.close();
    }
}

// Create and export global instance
// Create and export global instance - MOVED TO PAGE BUILDER
// const myModalIcon = new ModalIcon('iconModal');
// window.myModalIcon = myModalIcon;

// Uncomment this to trigger the modal for demonstration
// document.getElementById('openModalButton').addEventListener('click', () => {
//     const values = {
//         selectedFiles: ['fa fa-user'],
//         popType: 'single_select',
//         dataSelector: '.icon-input',
//         dataFor: 'icon',
//     };
//     myModalIcon.open(values);
// });

