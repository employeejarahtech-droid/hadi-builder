$(document).ready(function() {
    // Handle the click event for the media-hover element
    $(document).on("click", ".icon-hover", function(event) {
        const currentitem = $(event.currentTarget).attr("rand-id"); // Get the unique identifier from the button
        let currentitemval = $(".icon-" + currentitem).val();

        const values = {
            selectedFiles: currentitemval,
            popType: "single_select",
            popFileType: "icon",
            dataSelector: ".icon-" + currentitem,
            dataFor: "icon"
        };
        
        // Assuming `myModalIcon` is a globally defined object with an `open` method for displaying icons
        if (typeof myModalIcon !== 'undefined' && typeof myModalIcon.open === 'function') {
            myModalIcon.open(values);
        } else {
            console.error("myModalIcon is not defined or does not have an 'open' method");
        }
    });

    // Event listener for removing the icon
    $(document).on("click", ".icon-trashs", function() {
        const iconBox = $(this).closest(".icon-box");
        iconBox.find("input[type='hidden']").val(""); // Clear the hidden input
        iconBox.find(".icon-selected i").attr("class", ""); // Clear the displayed icon class

        // Trigger form change event to update the changes
        $('#editor-form').trigger('change');
    });
});
