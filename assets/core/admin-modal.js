class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.closeButton = this.modal.querySelector('.close');
        this.confirmButton = this.modal.querySelector('#confirm-selection');

        this.selectedFiles = [];
        this.popType = 'single_select';
        this.popFileType = 'image';
        this.dataSelector = '';
        this.dataFor = '';

        this.submitButton = this.modal.querySelector('button[type="submit"]');
        this.form = this.modal.querySelector('#submitform');

        this.closeButton.addEventListener('click', () => this.close());
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        this.confirmButton.addEventListener('click', () => this.confirmSelection());
        this.form.addEventListener('submit', (event) => this.handleFormSubmit(event)); // Handle form submission

    }

    open(values) {
        this.setValues(values);
        this.fetchData(values.popType)
            .then(data => {
                this.populateGallery(data);
                this.modal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.populateGallery([]); // Show empty state if data fetch fails
            });
    }

    close() {
        this.resetValues();
        this.modal.style.display = 'none';
    }

    setValues(values) {
        // Ensure selectedFiles is a string or an empty string if not defined
        const selectedFilesString = typeof values.selectedFiles === 'string' ? values.selectedFiles : '';
        this.selectedFiles = values.selectedFiles || []; // Split and filter out any empty strings
        this.popType = values.popType || this.popType;
        this.popFileType = values.popFileType || this.popFileType;
        this.dataSelector = values.dataSelector || '';
        this.dataFor = values.dataFor || ''; // Store additional data attribute
    }

    resetValues() {
        this.selectedFiles = [];
        this.popType = 'single_select';
        this.popFileType = 'image';
        this.dataSelector = '';
        this.dataFor = '';
    }

    getValues() {
        return {
            selectedFiles: this.selectedFiles,
            popType: this.popType,
            popFileType: this.popFileType,
            dataSelector: this.dataSelector,
            dataFor: this.dataFor
        };
    }

    async fetchData(type) {
        const endpoint = `${adminurl}/get-data.php`; // Ensure 'adminurl' is defined
        const response = await fetch(endpoint);

        console.log(response);

        // Log the raw response for debugging
        const text = await response.text();
        console.log('Response text:', text); // Check what the response is

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        try {
            return JSON.parse(text); // Attempt to parse as JSON
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            throw new Error('Invalid JSON response');
        }
    }

    populateGallery(data) {
        const gallery = this.modal.querySelector('.category-wise-assets-image-prevview');
        gallery.innerHTML = ''; // Clear previous content

        const images = data && data.length > 0 ? data : this.getFallbackData();

        images.forEach(item => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
            imageItem.dataset.imageUrl = item.imageUrl;

            const img = document.createElement('img');
            img.src = item.imageUrl;

            // Check if the item is already selected
            if (this.selectedFiles.includes(item.imageUrl)) {
                imageItem.classList.add('selected');
            }

            // Add click event for selection
            imageItem.addEventListener('click', () => this.selectImage(item.imageUrl, imageItem));

            imageItem.appendChild(img);
            gallery.appendChild(imageItem);
        });

        $('#textModal').find('.selected-qty').html("Item selected " + this.selectedFiles.length);
    }

    getFallbackData() {
        return [
            { "id": 1, "imageUrl": "https://placehold.elementor-bundle.com/100x100", "title": "Image 1" },
            { "id": 2, "imageUrl": "https://placehold.elementor-bundle.com/100x101", "title": "Image 2" },
            { "id": 3, "imageUrl": "https://placehold.elementor-bundle.com/100x102", "title": "Image 3" },
            { "id": 4, "imageUrl": "https://placehold.elementor-bundle.com/100x103", "title": "Image 4" }
        ];
    }

    selectImage(imageUrl, imageItem) {
        if (this.popType === 'single_select') {
            this.selectedFiles = [imageUrl]; // Reset selection for single select
            this.modal.querySelectorAll('.image-item').forEach(item => item.classList.remove('selected'));
            imageItem.classList.add('selected');
        } else if (this.popType === 'multiple_select') {
            const index = this.selectedFiles.indexOf(imageUrl);
            if (index > -1) {
                this.selectedFiles.splice(index, 1); // Deselect the image
                imageItem.classList.remove('selected');
            } else {
                this.selectedFiles.push(imageUrl); // Select the image
                imageItem.classList.add('selected');
            }
        }

        $('#textModal').find('.selected-qty').html("Item selected " + this.selectedFiles.length);

       // selected-qty
    }

    confirmSelection() {
        const selectedFilesString = this.getValues().selectedFiles.join(','); // Convert to comma-separated string

        console.log('Trigger Here 1');
    
        // Populate the media input field based on the dataSelector
        if (this.dataFor === 'media' && this.dataSelector) {

            console.log('Trigger Here 2');
           

            const inputField = document.querySelector(this.dataSelector);
            if (inputField) {
                inputField.value = selectedFilesString || ''; // Set the value or clear it if none
    
                // Set the image source in the immediate parent .media-selected-image
                const mediaBox = inputField.closest('.media-box');
                const imgElement = mediaBox.querySelector('.media-selected-image img');
                if (imgElement) {
                    imgElement.src = selectedFilesString || ''; // Set the src to the selected image URL
                    $('#editor-form').trigger('change');
                }
            }
        }
    
    
        if (this.dataFor === 'gallery' && this.dataSelector) {
            const inputField = document.querySelector(this.dataSelector);

            console.log('Trigger Here 3');

            if (inputField) {
                inputField.value = selectedFilesString || ''; 
    
                const galleryBox = inputField.nextElementSibling;
                if (galleryBox) {
                    galleryBox.innerHTML = ''; // Clear existing items
    
                    // Split and filter selected files
                    const selectedFiles = selectedFilesString.split(',').filter(Boolean);
    
                    // Loop through the selected files and create gallery items
                    selectedFiles.forEach(imgUrl => {
                        // Create image element
                        const img = document.createElement('img');
                        img.src = imgUrl; // Use imgUrl directly
    
                        // Create a gallery item div
                        const div = document.createElement('div');
                        div.classList.add('gallery-item');
                        div.appendChild(img);
    
                        // Create remove button
                        const removeBtn = document.createElement('span');
                        removeBtn.textContent = '×';
                        removeBtn.classList.add('remove-image');
    
                        removeBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            div.remove(); 

                            this.selectedFiles = selectedFiles;
        
                            // Remove the URL from the selectedFiles array
                            this.selectedFiles = this.selectedFiles.filter(url => url !== imgUrl); 
    
                            // Update input field value
                            inputField.value = this.selectedFiles.join(','); 


                            $('#editor-form').trigger('change');

                        });
    
                        div.appendChild(removeBtn);
                        galleryBox.appendChild(div); // Append each selected image to the gallery
                    });
                }
            }
        }
    
        this.close();
    }




     // Handle form submission via AJAX
     handleFormSubmit(event) {
        event.preventDefault(); // Prevent regular form submission
        const formData = new FormData(this.form);

        // Show loading spinner or disable the button (optional)
        this.submitButton.disabled = true;
        this.submitButton.innerText = 'Uploading...';

        // AJAX request to upload the file
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${adminurl}/upload-image.php`, true); // Change this URL to your image upload endpoint

        xhr.onload = () => {
            this.submitButton.disabled = false;
            this.submitButton.innerText = 'Upload';

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                console.log('response', response);

                if (response.success) {
                    alert('File uploaded successfully!');

                     // After upload success, refresh the gallery or fetch new data
                    this.fetchData(this.popType) // Fetch new data based on the type (e.g., 'single_select', 'multiple_select')
                    .then(data => {
                        this.populateGallery(data); // Populate gallery with the new data
                    })
                    .catch(error => {
                        console.error('Error fetching data after upload:', error);
                    });

                    this.form.reset();

                } else {
                    alert('Upload failed: ' + response.message);
                }
            } else {
                alert('There was an error with the upload request.');
            }
        };

        xhr.onerror = () => {
            alert('Request failed. Please try again.');
            this.submitButton.disabled = false;
            this.submitButton.innerText = 'Upload';
        };

        xhr.send(formData);
    }

    
}

// Example usage
const myModal = new Modal('textModal');

// // Triggering the modal for demonstration
// document.getElementById('openModalButton').addEventListener('click', () => {
//     const values = {
//         selectedFiles: 'file1.jpg,file2.jpg', // Comma-separated string
//         popType: 'multiple_select', // Change as needed
//         popFileType: 'image', // Change as needed
//         dataSelector: '.media-hc5frbhqq', // Selector for the input field
//         dataFor: 'media', // Additional data attribute
//     };
//     myModal.open(values);
// });




/*

Modal Tab

*/

document.addEventListener('DOMContentLoaded', function () {
    // Default active tab for left column
    showTabContent({currentTarget: document.querySelector('.tab-button')}, 'leftTab1');
    // Default active tab for right column
    //showTabContent({currentTarget: document.querySelector('.tab-button')}, 'rightTab1');

    // const leftTabButton = document.querySelector('[data-tab="leftTab1"]');
    // if (leftTabButton) {
    //     leftTabButton.click();
    // }
});

// Function to show the correct tab content when clicking a tab
function showTabContent(event, tabId) {
    // Hide all tab content
    var tabContents = document.querySelectorAll('.tab-content-asset');
    tabContents.forEach(function(tab) {
        tab.style.display = 'none';
    });

    // Show the selected tab content
    var activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
    }

    // Remove the active class from all tab buttons
    var tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(function(button) {
        button.classList.remove('active');
    });

    // Add the active class to the clicked tab button (or default if first load)
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        // If no click event is passed, default to the first tab button
        var defaultTabButton = document.querySelector('.tab-button');
        if (defaultTabButton) {
            defaultTabButton.classList.add('active');
        }
    }
}
