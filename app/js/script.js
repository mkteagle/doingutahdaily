// Wait for the DOM to be ready (all elements printed on page regardless if loaded or not)
$(function() {

    $(document).ready(function() {
        $('.toggle-nav').click(function(e) {
            $(this).toggleClass('active');
            $('.menu ul').toggleClass('active');

            e.preventDefault();
        });
    });
});