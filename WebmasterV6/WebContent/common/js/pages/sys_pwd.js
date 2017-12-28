
function loadDoucument() {
    //$("#left").height($("#header").height() + $("#main").height() + 70);

    $("#Btn_Submit").click(btnSubmit);
    $("#Btn_Cancel").click(btnCancel);
}

//按钮-确定
function btnSubmit() {
    if ($('#form1').validate()) {
        if ($("#Text_Pwd1").val() != $("#Text_Pwd2").val()) {
            alert("输入的新密码与确认密码不一致");
            return;
        }

        //修改密码
        var data = {};
        data.sessionid = request("SessionId");
        data.pwdOld = $("#Text_PwdOld").val();
        data.pwdNew = $("#Text_Pwd1").val();
        data.action = "SAVE_SYS_PWD";
        $.ajax({
            type: "POST",
            url: GET_DATA,
            data: data,
            dataType: 'json',
            async: false,
            success: function (response, status, xhr) {
                if (response.status == "SUCCESS") {
                    alert("成功修改密码");
                } else {
                    alert(response.errorMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest);
            }
        });

        btnCancel();
        $("#Text_Pwd").focus();
    }
}

//按钮-取消
function btnCancel() {
    $(".text0").each(function () {
        $(this).val("");
    });
}