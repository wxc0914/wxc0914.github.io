// 给code块添加mac样式
var codeblock = $("figure.highlight")
codeblock.css("margin-top", "0");
codeblock.each(function(){
    var lang = $(this).attr("class").split(" ")[1];
    lang = lang.charAt(0).toUpperCase() + lang.substr(1).toLowerCase();
    $(this).before("<div class='code-mac-style' lang=" + lang + " ><div>");
})
// 去掉checklist的小圆点
var checkboxs = $("input[type=checkbox]");
checkboxs.parent().css("list-style", "none");
checkboxs.parent().parent().css("padding-left", "0");