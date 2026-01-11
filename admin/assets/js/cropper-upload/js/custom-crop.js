let cropper;

const img = document.getElementById('crop-preview');
const cropWidthInput = document.getElementById('crop-width');
const cropHeightInput = document.getElementById('crop-height');
const modal = document.getElementById('cropper-modal');
const closeModal = document.getElementById('close-modal');
const cropAndSaveButton = document.getElementById('crop-and-save');
const resultMsg = document.getElementById('result-msg');

// Initialize Cropper in modal
function initCropper() {
    if (cropper) {
        cropper.destroy();
    }

    const width = parseInt(cropWidthInput.value) || 500;
    const height = parseInt(cropHeightInput.value) || 500;
    const aspectRatio = width / height;

    cropper = new Cropper(img, {
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

// Open modal and display the cropper box
document.getElementById('upload-image').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        img.src = event.target.result;
        img.style.display = 'block';

        // Show modal
        modal.style.display = 'flex';

        // Initialize Cropper with width/height inputs
        initCropper();

        cropAndSaveButton.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
});

// Close the modal
closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
    if (cropper) cropper.destroy();
    resultMsg.innerHTML = ''; // Clear any messages
});

// Crop and upload the image
cropAndSaveButton.addEventListener('click', function () {
    if (!cropper) return;

    const width = parseInt(cropWidthInput.value) || 500;
    const height = parseInt(cropHeightInput.value) || 500;
    const maxSizeKB = parseInt(document.getElementById('max-size').value) || 30;

    const canvas = cropper.getCroppedCanvas({
        width: width,
        height: height,
        imageSmoothingQuality: 'high'
    });

    resultMsg.innerHTML = 'Compressing and uploading...';

    canvas.toBlob(
        function (blob) {
            if (!blob) {
                resultMsg.innerHTML = `<p style="color:red;">❌ Error creating image blob.</p>`;
                return;
            }

            const fileSizeKB = blob.size / 1024;

            if (fileSizeKB > maxSizeKB) {
                resultMsg.innerHTML = `<p style="color:red;">❌ Image too large after crop: ${Math.round(fileSizeKB)}KB. Max allowed: ${maxSizeKB}KB.</p>`;
                return;
            }

            const reader = new FileReader();
            reader.onloadend = function () {
                const base64data = reader.result;

                fetch(cropper_ajax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        action: 'cropper_upload_image',
                        nonce: cropper_ajax.nonce,
                        image: base64data
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        resultMsg.innerHTML = `<p><strong>✅ Uploaded!</strong> <a href="${data.data.url}" target="_blank">View Image</a></p>`;
                    } else {
                        resultMsg.innerHTML = `<p style="color:red;">❌ ${data.data}</p>`;
                    }
                })
                .catch(err => {
                    resultMsg.innerHTML = `<p style="color:red;">❌ Upload error.</p>`;
                    console.error(err);
                });
            };
            reader.readAsDataURL(blob);
        },
        'image/webp',
        0.6
    );
});
