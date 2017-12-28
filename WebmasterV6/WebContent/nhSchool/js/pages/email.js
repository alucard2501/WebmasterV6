var _title = "";
var _datatable = null;
var _datatable_current_page = 0;

function loadDoucument() {
    init();

    $("#Span_DatagridHeader").text(_title + ' ' + LAN.Key_List);

    $("#Tool_Delete").click(toolDelete);
    $("#Tool_UnDelete").click(toolUnDelete);
    $("#Tool_Read").click(toolRead);
    $("#Tool_Refresh").click(toolRefresh);

    $("#Checkbox_All").click(checkAll);
}

//初始化
function init() {
    if (request("tips") == "send") {
        _title = LAN.Email_Sent;
        $("#Th_SysUser").text(LAN.Email_To);
        $("#Tool_UnDelete").css("display", "none");
    } else if (request("tips") == "draft") {
        _title = LAN.Email_Drafts;
        $("#Th_SysUser").text(LAN.Email_To);
        $("#Tool_UnDelete").css("display", "none");
    } else if (request("tips") == "delete") {
        _title = LAN.Email_Dustbin;//删除的已发送
        $("#Th_SysUser").text(LAN.Email_To);
        $("#Tool_Delete").css("display", "none");
    } else {
        _title = LAN.Email_Inbox;
        $("#Th_SysUser").text(LAN.Email_From);
        $("#Tool_Delete").css("display", "none");
        $("#Tool_UnDelete").css("display", "none");
    }

    loadList();
}

//加载列表
function loadList() {
    if (_datatable != null) {
        _datatable_current_page = _datatable.fnPagingInfo().iPage;
        _datatable.fnDestroy(); //删除datatable
    }

    var s = $("#Table_Body");
    s.find('tr').remove();

    var data = {};
    data.sessionid = request("SessionId");
    if (request("tips") == "send") {
        data.tips = "SEND";
    } else if (request("tips") == "draft") {
        data.tips = "DRAFT";
    } else if (request("tips") == "delete") {
        data.tips = "DELETE";
    } else {
        data.tips = "RECEIVE";
}
    data.action = "NHSCHOOL_LOAD_EMAIL";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var tr, str;

                for (var i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];

                    tr = $("<tr/>");
                    if (i % 2 != 0) {
                        tr.addClass("odd");
                    }

                    str = '<td><input type="checkbox" name="check1" value="' + record.id + '" /></td>';

                    str = str + '<td>';
                    if (record.isRead == "true") {
                        str = str + '<img src="../images/icon/email_open.png" style="width:16px" />';
                    } else {
                        str = str + '<img src="../images/icon/email.png" style="width:16px" />';
                    }
                    if (record.fileList != "") str = str + '<img src="../images/icon/attach.png" title="附件" style="width:16px" />';
                    if (record.formIdIsDel == "1") str = str + '<img src="../images/icon/cross.png" title="已删除" style="width:16px" />';
                    str = str + '</td>';

                    if (request("tips") == "receive") {
                        //发件人
                        str = str + '<td>' + getSysUsernameById(record.sysUserIdSend) + '</td>';
                    } else {
                        //收件人
                        str = str + '<td>' + getSysUsernameById(record.sysUserIdsReceive).substring(0, 10) + '</td>';
                    }

                    if (record.formIdIsDel == "1") {
                        str = str + '<td>' + record.title + '</td>';
                    } else {
                        str = str + '<td class="btnBrowse" id="' + record.id + '">' + record.title + '</td>';
                    }

                    str = str + '<td>' + record.timeSend.substring(0, 16) + '</td>';

                    if (record.formIdIsDel == "1") {
                        str = str + '<td></td>';
                    } else {
                        str = str + '<td><div class="btnDatagrid toolbarSearch btnBrowse" title="浏览" id="' + record.id + '"></div></td>';
                    }

                    tr.html(str);
                    s.append(tr);
                }

                //事件--点击浏览按钮
                $(".btnBrowse").click(btnBrowse);

                //全选按钮变回空
                $("#Checkbox_All").prop("checked", false);

                //加载datatalbe
                _datatable = $(".tableDatagrid").dataTable({
                    sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                	, bFilter: true                //开关，是否启用客户端过滤功能,true or false, default true
                	, bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                	, bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                	, aoColumnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                	//, aaSorting: [4, 'desc'] 	                //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
                });
                _datatable.fnPageChange(_datatable_current_page);

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

//工具栏-删除
function toolDelete() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }
        if (!confirm('确定删除此数据？')) return;

        var data = {};
        data.action = "DELETE_DATA";
        data.id = c_id;
        data.table = "t_email";
        data.sessionid = request("SessionId");
        $.ajax({
            type: "POST",
            url: GET_DATA,
            data: data,
            dataType: 'json',
            async: false,
            success: function (response, status, xhr) {
                if (response.status == 'SUCCESS') {

                } else {
                    alert(response.errorMessage);
                }
            }
        });

        loadList();

    } else {
        alert("没有选定任何行");
    }
}

//工具栏-恢复
function toolUnDelete() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        var data = {};
        data.action = "DELETE_DATA";
        data.id = c_id;
        data.isDel = 0;
        data.table = "t_email";
        data.sessionid = request("SessionId");
        $.ajax({
            type: "POST",
            url: GET_DATA,
            data: data,
            dataType: 'json',
            async: false,
            success: function (response, status, xhr) {
                if (response.status == 'SUCCESS') {

                } else {
                    alert(response.errorMessage);
                }
            }
        });

        loadList();

    } else {
        alert("没有选定任何行");
    }
}

//工具栏-标记为已读
function toolRead() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        var data = {};
        data.action = "NHSCHOOL_READ_EMAIL";
        data.id = c_id;
        data.sessionid = request("SessionId");
        $.ajax({
            type: "POST",
            url: GET_DATA,
            data: data,
            dataType: 'json',
            async: false,
            success: function (response, status, xhr) {
                if (response.status == 'SUCCESS') {
                    alert("成功标记为已读");
                } else {
                    alert(response.errorMessage);
                }
            }
        });

        loadList();

    } else {
        alert("没有选定任何行");
    }
}

//工具栏-刷新
function toolRefresh() {
    loadList();
    _datatable.fnPageChange(0);
}

//按钮-浏览
function btnBrowse() {
    if (request("tips") == "draft") {
        location = "email_edit.html?menuRootId=" + request("menuRootId") + "&tips=" + request("tips") + "&SessionId=" + request("SessionId") + "&fromId=" + $(this).attr("id");
    } else {
        location = "email_browse.html?menuRootId=" + request("menuRootId") + "&tips=" + request("tips") + "&SessionId=" + request("SessionId") + "&id=" + $(this).attr("id");
    }
}

//按钮-全选
function checkAll() {
    var isChecked = $(this).prop("checked");
    $("input[name='check1']").prop("checked", isChecked);
}


