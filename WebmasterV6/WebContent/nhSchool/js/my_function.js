//根据系统用户ID获取系统用户名
function getSysUsernameById(ids) {
    var temp = "";
    var arr = ids.split(",");
    for (var i = 0; i < arr.length; i++) {
        //读取用户名
        var data = {};
        data.sessionid = request("SessionId");
        data.table = "t_sys_user";
        data.id = arr[i];
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
                        if (record.realname == "") {
                            temp = temp + record.username;
                        } else {
                            temp = temp + record.realname;
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

        if (i != arr.length - 1) {
            temp = temp + ",";
        }
    }
    return temp;
}

//根据系统用户ID获取教职员ID
function getEmployeeIdBySysUserId() {
    var temp = 0;
    var data = {};
    data.sessionid = request("SessionId");
    data.action = "NHSCHOOL_GET_EMPLOYEEID_BY_SYSUSERID";
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
                    temp = record.id;
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
    return temp;
}