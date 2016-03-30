// Wait for the DOM to be ready (all elements printed on page regardless if loaded or not)
$(function() {

    // Bind a click event to anything with the class "toggle-nav"
    $('.toggle-nav').click(function() {

        // Toggle the Body Class "show-nav"
        $('body').toggleClass('show-nav');

        // Deactivate the default behavior of going to the next page on click
        return false;

    });
});
// Toggle with hitting of ESC
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        $('body').toggleClass('show-nav');
        // $('body').removeClass('show-nav');
    }
});
$(function() {
    $('.toggle-nav').click(function() {
        $('body').toggleClass('show-nav');
        return false;
    });
});