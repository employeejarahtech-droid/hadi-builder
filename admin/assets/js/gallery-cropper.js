let cropper;

const cropperModal = document.getElementById('cropper-modal');
const cropPreview = document.getElementById('crop-preview');
const cropWidthInput = document.getElementById('crop-width');
const cropHeightInput = document.getElementById('crop-height');
const maxSizeInput = document.getElementById('max-size');
const closeCropperBtn = document.getElementById('close-cropper');
const cropAndSaveBtn = document.getElementById('crop-and-save');
const cropResultMsg = document.getElementById('crop-result-msg');
const cropFileInput = document.getElementById('crop-file-input');

// Open file picker
function openCropperModal() {
    cropFileInput.click();
}

// Initialize Cropper when image is selected
cropFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        cropPreview.src = event.target.result;
        cropPreview.style.display = 'block';

        // Show modal
        cropperModal.style.display = 'flex';

        // Initialize Cropper
        initCropper();

        cropAndSaveBtn.style.display = 'inline-block';
        cropResultMsg.innerHTML = '';
    };
    reader.readAsDataURL(file);
});

// Initialize Cropper.js
function initCropper() {
    if (cropper) {
        cropper.destroy();
    }

    const width = parseInt(cropWidthInput.value) || 500;
    const height = parseInt(cropHeightInput.value) || 500;
    const aspectRatio = width / height;

    cropper = new Cropper(cropPreview, {
        viewMode: 1,
        autoCropArea: 0.8,
        aspectRatio: aspectRatio,
        responsive: true,
        ready() {
            const containerData = cropper.getContainerData();
            let cropBoxWidth = Math.min(width, containerData.width * 0.8);
            let cropBoxHeight = cropBoxWidth / aspectRatio;

            if (cropBoxHeight > containerData.height * 0.8) {
                cropBoxHeight = containerData.height * 0.8;
                cropBoxWidth = cropBoxHeight * aspectRatio;
            }

            cropper.setCropBoxData({
                width: cropBoxWidth,
                height: cropBoxHeight
            });
        }
    });
}

// Close modal
closeCropperBtn.addEventListener('click', function() {
    closeCropperModal();
});

function closeCropperModal() {
    cropperModal.style.display = 'none';
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    cropPreview.style.display = 'none';
    cropResultMsg.innerHTML = '';
    cropFileInput.value = ''; // Reset file input
}

// Crop and upload
cropAndSaveBtn.addEventListener('click', function() {
    if (!cropper) return;

    const width = parseInt(cropWidthInput.value) || 500;
    const height = parseInt(cropHeightInput.value) || 500;
    const maxSizeKB = parseInt(maxSizeInput.value) || 30;

    const canvas = cropper.getCroppedCanvas({
        width: width,
        height: height,
        imageSmoothingQuality: 'high'
    });

    cropResultMsg.innerHTML = '<p style="color: #64748b;">Compressing and uploading...</p>';

    canvas.toBlob(
        function(blob) {
            if (!blob) {
                cropResultMsg.innerHTML = '<p style="color: #ef4444;">❌ Error creating image blob.</p>';
                return;
            }

            const fileSizeKB = blob.size / 1024;

            if (fileSizeKB > maxSizeKB) {
                cropResultMsg.innerHTML = `<p style="color: #ef4444;">❌ Image too large: ${Math.round(fileSizeKB)}KB. Max: ${maxSizeKB}KB.</p>`;
                return;
            }

            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result;

                fetch('../../api/crop-upload-image.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        image: base64data
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        cropResultMsg.innerHTML = `<p style="color: #10b981;">✅ Uploaded successfully! <a href="${data.url}" target="_blank" style="color: var(--primary);">View Image</a></p>`;
                        
                        // Reload page after 1.5 seconds to show new image
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else {
                        cropResultMsg.innerHTML = `<p style="color: #ef4444;">❌ ${data.error || 'Upload failed'}</p>`;
                    }
                })
                .catch(err => {
                    cropResultMsg.innerHTML = '<p style="color: #ef4444;">❌ Upload error. Please try again.</p>';
                    console.error('Upload error:', err);
                });
            };
            reader.readAsDataURL(blob);
        },
        'image/webp',
        0.6 // 60% quality
    );
});

// Update cropper when dimensions change
cropWidthInput.addEventListener('change', function() {
    if (cropper) {
        initCropper();
    }
});

cropHeightInput.addEventListener('change', function() {
    if (cropper) {
        initCropper();
    }
});
