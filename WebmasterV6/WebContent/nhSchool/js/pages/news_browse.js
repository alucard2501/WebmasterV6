
$(document).ready(function () {
    fillData();

    $("#Tool_Back").click(toolBack);
});

//填充数据
function fillData() {
    var str = "";

    var data = {};
    data.sessionid = request("SessionId");
    data.table = "v_news";
    data.id = request("id");
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
                    var record = response.records[0];
                    str = "<h1>" + record.title + "</h1>";
                    str = str + "<span>发布人：" + getSysUsernameById(record.sysUserId) + "</span>";
                    str = str + "<span>学期：" + record.term + "</span>";
                    str = str + "<span>周期：" + record.weekName + "</span>";
                    str = str + '<div class="divEmailBrowseContent">' + record.content + '</div>';
                }

                $("#Div_EmailBrowse").html(str);

                //$("#left").height($("#header").height() + $("#main").height() + 70);

            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}


//工具栏-返回
function toolBack() {
    location = "news.html?menuRootId=" + request("menuRootId") + "&tips=" + request("tips") + "&SessionId=" + request("SessionId");
}
