checkIsLogin();

$(document).ready(function () {
    var str = '<div id="Div_HeaderTitle" class="divHeaderLeft"><span class="spanHeader1">WEBMASTER <span class="spanHeader2">V6</span></span><span class="spanHeader3">网站后台管理系统</span></div>';
    str = str + '<div id="Div_HeaderRight" class="divHeaderRight"><span id="Span_HeaderUser" class="spanHeaderUser"></span><div class="divHeaderMessage divHeaderPwd"><a id="Header_Pwd" href="../../common/cn/sys_pwd.html?SessionId=' + request("SessionId") + '">修改密码</a>&nbsp;&nbsp;&nbsp;<a id="Btn_ReLogin">注销</a></div></div>';
    $(str).appendTo($("#header"));

    initSystem();
    initHeader();

    $("#Btn_ReLogin").click(logout);
});

function initHeader() {
    var data = {};
    data.sessionid = request("SessionId");
    data.action = "GET_SYS_USER";
    data.temp=Math.random();
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                $("#Span_HeaderUser").text(((response.realname == "") ? response.username : response.realname) + "(" + response.role + ")");
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

}

//注销
function logout() {
    var data = {};
    data.sessionid = request("SessionId");
    data.action = "LOGOUT_SYS_USER";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                location = "../../common/cn/login.html?website=" + response.website;
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}