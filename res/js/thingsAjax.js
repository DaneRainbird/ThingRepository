// Convert table to datatable
import {DataTable} from "/js/simpledatatables/module/index.js"
const dataTable = new DataTable("#thingTable", {
    perPage: 5
});
 
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
            let imgUrl = result.imageUrl != '' ? result.imageUrl : "default_thing.png";
            dataTable.rows().add(['<img width="100px" height="100px" src="' + imgUrl + '" />', result.name, result.description, '$' + result.price, new Date(result.date).toDateString()])
            
            dataTable.page(dataTable.totalPages);

            // Set ID for last added item
            let newItem = dataTable.body.querySelector('tr:last-child');
            newItem.id = result._id;
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
            dataTable.rows().remove(dataTable.body.querySelector("tr[id='" + id + '\']').dataIndex);
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

    // Ensure that user has clicked on row rather than column head before continuing
    if (itemId != undefined) {
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

                itemModal.find("#thingTitle").css('font-weight', 'bold').text(result.name);
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
    }
});

// Helper Functions
$.fn.resetModal = function() {
    $(this).modal('hide');
    $(this).find('form')[0].reset();
    $(this).find("#waitText").css("display", "none");
    $(this).find('#imageB64').val("");
    return;
};

// Resets delete buttons
$('#itemModal').on('hidden.bs.modal', () => {
    if ($('#itemModal').find('#delete-menu').hasClass("show")) {
        $('#itemModal').find('#delete-menu').collapse('toggle');
        $('#itemModal').find('#delete-start').collapse('toggle');
    }
}) 

// Closes the alert popup boxes
$('.close').on('click', (e) => {
    e.preventDefault();
    $('.alert').fadeOut();
})