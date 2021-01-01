 // Create item (form) request
$('#thingForm').submit(function(event) {
    event.preventDefault();
    $('#waitText').css("display", "flex");
    $.ajax({
        type: "POST",
        url: "/addThing",
        data: $(thingForm).serialize(),
        success: function(result, statusCode, xhr) {
            // Reset Input Modal
            $('.modal').resetModal();
            
            // Programatically append table
            let table = $('#thingTable');
            let imgUrl = result.imageUrl != '' ? result.imageUrl : "default_thing.png";
            table.append(
                '<tr href="#" id="' + result._id + '"><td><img width="100px" height="100px" src="' + imgUrl + '" /></td><td>' + result.name + '</td><td>' + result.description + '</td><td>$' + result.price + '</td><td>' + new Date(result.date).toDateString() + '</td></tr>' 
            )
        },
        error: function(result, statusCode, xhr) {
            console.log("Failed with error " + result.status);
            $('.modal').resetModal();
            $('.alert').find('#errorMessage').html("An error occurred while adding your thing: <em>" + result.responseJSON.message + "</em>");
            $('.alert').show();
        },
    });
}); 

// Delete item request
$(document).on('click', '#delete-button', function(event) {
    event.preventDefault();
    let id = $(this).val();
    $.ajax({
        type: "DELETE",
        url: "/deleteThing",
        data: {
            id: id
        },
        success: function(result, statusCode, xhr) {
            $('#thingTable').find("#" + id).remove();
            $('.modal').modal('hide');
        },
        error: function(result, statusCode, xhr) {
            $('.modal').modal('hide');
            $('.alert').find('#errorMessage').html("An error occurred while deleting your thing: <em>" + result.responseJSON.message + "</em>");
            $('.alert').show();
        }
    });
});

// Get specific item value (for modal loading)
$("#thingTable").on('click', 'tr', function(event) {
    let itemId = $(this).attr('id');
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
            $('.alert').find('#errorMessage').html("An error occurred while loading your thing: <em>" + result.responseJSON.message + "</em>");
            $('.alert').show();
        }
    });
});

// Helper Functions
$.fn.resetModal = function() {
    $(this).modal('hide');
    $(this).find('form')[0].reset();
    $(this).find("#waitText").css("display", "none");
    $(this).find('#imageB64').val("");
    return;
};