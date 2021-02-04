$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/currentUserStatistics",
        success: function(result) {
            $('.profileStatisticsLoading').fadeOut('slow', () => {
                $('.profileStatisticsNumberItems').text("You have collected " + result.numItems + " things.");
                $('.profileStatisticsTotalCost').text("You have spent $" + result.totalPrice + " in total.");
                $('.profileStatisticsList').fadeIn('slow');
            });
        },
        error: function(result, statusCode, xhr) {
            $('.profileStatisticsLoading').fadeOut('slow', () => {
                $('.profileStatisticsLoading').parent().append("An error occurred loading your statistics. Please refresh the page to try again.")
            });
        }
    });
}); 