
/*
var page_init = function () { }
$(function () {
page_init();
//setLeftRightHeight();   //设置左右div相同高度
//setSubMenu();
});


//设置左右div相同高度
function setLeftRightHeight() {
if ($('#left')[0] == null && $("#right") == null) return;
var h = Math.max($("#left").height(), $("#right").height());
$("#left").height(h);
$("#right").height(h);
}

//主菜单弹出子菜单
var fading;
function setSubMenu() {
//status说明:0--未打开，1--正在打开,2--已打开,3--正在关闭
$("#liMenu1")[0].status = 0;
$("#liMenu1").mouseenter(function () {
if (this.status == 0) {
this.status = 1;
//$(".subMenu").css("display", "block").animate({ width: "330px", height: "416px", opacity: 0.88 }, "normal", function () {
$(".subMenu").fadeTo( "normal", 0.9,function () {
$("#liMenu1")[0].status = 2;
});
}
});
$("#liMenu1").mouseleave(function () {
if (this.status == 2) {
this.status = 3;
//$(".subMenu").animate({ width: "0px", height: "0px", opacity: 0.0 }, "normal", function () {
$(".subMenu").fadeOut("normal", function () {
$("#liMenu1")[0].status = 0;
});
}
});
}

//用于flash的最大与缩小
function fullScreen() {
var h, w, x, y, ws, hs;
var str = $("#flashContent").html();
h = 600;
w = 1000;
x = ($(self.window).width() - w) / 2;
y = Math.max($(self.window).scrollTop(), ($(self.window).height() - h) / 2);
var div = $("<div/>").html(str).css({ "position": "absolute", "width": x, "height": h, "top": y, "left": x, "z-index": "100" });
div.appendTo($("body"));
div.attr("id", "divFlashLarge");
$("object", div).attr("id", "objFlashLarge").width(w).height(h);
document.objFlashLarge.SetVariable("ZoomStatus", "large");
}
function normalScreen() {
$("#divFlashLarge").fadeOut("fast", function () {
$(this).remove();
});
}
*/

/*jquery marquee插件*/
(function ($) {
    $.fn.marquee = function (o) {
        return this.each(function () {
            var timer;
            var div = this;
            var i = 0;
            function newsMarquee() {
                var a, b, c;
                if (o.dir == "top") { a = "first"; b = "top"; c = "height" }
                if (o.dir == "bottom") { a = "last"; b = "bottom"; c = "height" }
                if (o.dir == "left") { a = "first"; b = "left"; c = "width" }
                if (o.dir == "right") { a = "last"; b = "right"; c = "width" }
                $('ul:' + a, div).css("margin-" + b, i);
                if (0 - parseInt($('ul:' + a, div).css("margin-" + b)) > parseInt($('ul:' + a, div).css(c))) {
                    var n = $('ul:' + a, div)[0];
                    $(div).append(n);
                    $(n).css("margin-" + b, "0px");
                    i = 0
                }
                i -= o.step;
            }
            timer = setInterval(newsMarquee, o.speed);
            $('ul', this).each(function () {
                $(this).mouseover(function () {
                    clearInterval(timer);
                });
                $(this).mouseout(function () {
                    timer = setInterval(newsMarquee, o.speed);
                });
            });
        });
    }
})(jQuery);

