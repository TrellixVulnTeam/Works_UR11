$(function() {
    $(".catalog__countryItem").click(function(e) {
        e.preventDefault(); /* To prevent redirect of <a> */
        $(".catalog__countryItem").removeClass("aCountry"); /* Remove the class to all nav-items */
        $(this).addClass("aCountry"); /* Add the class to clicked nav-items*/
    });
});