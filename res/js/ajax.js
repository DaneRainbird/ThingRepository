 // Create item (form) request
$('#thingForm').submit(function(event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "/addThing",
        data: $(thingForm).serialize(),
        success: function(result, statusCode, xhr) {
            location.reload();
        },
        error: function(result, statusCode, xhr) {
            console.log("Failed with error " + result.status);
            $('#addItemModel').modal('hide');
            $('.alert').show();
        },
    });
}); 

// Delete item request
$(document).on('click', '#delete-button', function(event) {
    event.preventDefault();
    $.ajax({
        type: "DELETE",
        url: "/deleteThing",
        data: {
            id: $(this).val()  
        },
        success: function(result, statusCode, xhr) {
            location.reload();
        },
        error: function(result, statusCode, xhr) {
            console.log("Failed with error " + result.status);
            $('#addItemModel').modal('hide');
            $('.alert').show();
        }
    });
});

// Get specific item value (for modal loading)
$("#thingTable").on('click', 'tr', function(event) {
    let itemId = $(this).attr('id');
    let userId = "";
    event.preventDefault();

    $.ajax({
        type: "GET",
        url: "/getOneThing",
        data: {
            itemId: itemId,
        },
        success: function(result) {
            let itemModal = $("#itemModal");
            // Update modal values dynamically 
            if (result.imageUrl != "") {
                itemModal.find(".center-image").attr("src", result.imageUrl);
            } else {
                itemModal.find(".center-image").attr("src", "default_thing.png");
            }

            itemModal.find("#thingTitle").html("<strong>" + result.name + "</strong>");
            itemModal.find(".thingName").text(result.name);
            itemModal.find(".thingDescription").text(result.description);
            itemModal.find(".thingPrice").text("$" + result.price);
            itemModal.find(".thingDate").text(new Date(result.date).toDateString())
            itemModal.find("#delete-button").val(result._id);
                
            // Show the modal
            itemModal.modal('show');
        },
        error: function(result, statusCode, xhr) {
            console.log("Failed with error " + result.status);
        }
    });
});