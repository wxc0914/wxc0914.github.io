InstantClick.init();

$("figure.highlight").each(function(){
    var lang = $(this).attr("class").split(" ")[1];
    lang = lang.charAt(0).toUpperCase() + lang.substr(1).toLowerCase();
    $(this).attr('lang', lang)
})