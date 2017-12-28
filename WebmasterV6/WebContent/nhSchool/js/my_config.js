
$(document).ready(function () {
    var a = "../../nhSchool/cn/email.html?menuRootId=2&tips=receive&SessionId=" + request("SessionId");
    var strNum = '';

    //获取收件箱未读邮件数量
    var data = {};
    data.action = "NHSCHOOL_GET_EMAIL_RECEIVE_UNREAD";
    data.sessionid = request("SessionId");
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == 'SUCCESS') {
                if (response.count > 0) {
                    strNum = '<span class="spanHeaderMessageNum">' + response.count + '</span>';
                }
            } else {
                alert(response.errorMessage);
            }
        }
    });

    var str = '<div id="Div_HeaderMessage" class="divHeaderMessage"><span class="spanHeaderMessageIco"></span>'+strNum+'</div>';
    $(str).appendTo($("#Div_HeaderRight"));

    $("#Div_HeaderMessage").click(function () {
        location = a;
    });
});