$(document).ready(function () {
    var str = '<ul id="Ul_Menu" class="ulMenu"></ul><div class="divLeftBorder"></div>';
    $(str).appendTo($("#left"));

    str = '<div class="divLeftBg"></div>';
    $(str).appendTo($("#left"));

    loadMenu();

    $(".liMenu").find("ul").css("display", "none");
    $(".liMenu").each(function () {
        if ($(this).attr("c_id") == request("menuRootId")) {
            $(this).find("ul").css("display", "");
        }
    });

    $(".liMenu").click(function () {
        $(".liMenu").find("ul").slideUp("fast");
        var ul = $(this).find("ul");
        if (ul.length > 0) {
            ul.slideDown("fast");
        }
    });

    //$("#left").height($("#header").height() + $("#main").height()+40);
});

//加载菜单
function loadMenu() {
    var s = $("#Ul_Menu");
    s.find('li').remove();

    var data = {};
    data.sessionid = request("SessionId");
    data.isShowRight = true;
    data.action = "LOAD_SYS_MENU"
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {

                var item, record, ul2, li2, a2, url;
                for (var i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];

                    //0--无; 1--打开窗体; 2--DLL; 3--COMMAND; 4--ABC表; 5--报表; 6--URL
                    url = "";
                    switch (record.menuType) {
	                    case "0":
	                        url = "";
	                        break;
	                    case "1":
	                        url = "/WebmasterV6/common/cn/order.html?menuRootId=" + record.parentId + "&orderId=" + record.class + "&SessionId=" + request("SessionId");
	                        break;
	                    case "4":
	                        url = "/WebmasterV6/common/cn/" + loadEditFormUrl(record.class, record.parentId) + "&SessionId=" + request("SessionId");
	                        break;
	                    case "5":
	                        url = "/WebmasterV6/common/cn/report.html?menuRootId=" + record.parentId + "&reportId=" + record.class + "&SessionId=" + request("SessionId");
	                        break;
	                    case "6":
	                        url = record.param + "&SessionId=" + request("SessionId");
	                        break;
	                    default:
	                        url = "/WebmasterV6/common/cn/index.html?SessionId=" + request("SessionId");
	                        break;
	                }

                    if (record.step == 1) {
                        item = $("<li/>");
                        item.addClass("liMenu");
                        item.attr("c_id", record.id);
                        if (record.id == request("menuRootId")) {
                            item.addClass("liMenuC");
                        }
                        
                        if (url != "") {
                            item.html("<a href='" + url + "'>" + record.text + "</a>");
                        } else {
                            item.html("<a>" + record.text + "</a>");
                        }
                        s.append(item);
                        ul2 = null;

                    } else if (record.step == 2) {
                        if (ul2 == null) {
                            ul2 = $("<ul/>");
                        }
                        if (item != null) {
                            item.append(ul2);
                        }
                        li2 = $("<li/>");
                        a2 = $("<a/>");
                        a2.attr("href", url);
                        //a2.attr("href", "standard_a.html?menuRootId=" + record.parentId);
                        a2.text(record.text);
                        li2.append(a2);
                        ul2.append(li2);
                    }
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

function loadEditFormUrl(c_id, menuRootId) {
    var url = "";
    var data = {};
    data.sessionid = request("SessionId");
    data.id = c_id;
    data.table = "t_sys_datasource_editform";
    data.action = "FILL_DATA";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                if (response.records.length > 0) {
                    record = response.records[0];

                    //1--A类表; 2--B类表; 3--C类表; 4--单据详细数据;
                    switch (record.editFormType) {
                        case "1":
                            url = "standard_a.html?menuRootId=" + menuRootId + "&editFormId=" + c_id;
                            break;
                        case "2":
                            url = "standard_b.html?menuRootId=" + menuRootId + "&editFormId=" + c_id;
                            break;
                        case "3":
                            url = "standard_c.html?menuRootId=" + menuRootId + "&editFormId=" + c_id;
                            break;
                        default:
                            url = "";
                            break;
                    }
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

    return url;
}