var _datatable = null;
var _datatable_current_page = 0;
var _datatable_child = null;
var _datatable_current_page_child = 0;
var _constr = "";
var _edit_userid = 0;
var _edit_userroleid = 0;

function loadDoucument() {
    init();
    loadList();

    $("#Div_FormMain").tabs();

    $("#Div_Form").dialog({
        autoOpen: false,
        title: '编辑操作员',
        modal: true,
        width: "540",
        resizable: false    //是否可以调整对话框的大小，默认为 true
    });

    loadSysRole();
    $("#Div_Form_Child").dialog({
        autoOpen: false,
        title: '设置角色',
        modal: true,
        width: "270",
        resizable: false    //是否可以调整对话框的大小，默认为 true
    });

    //工具栏-列表
    $("#Tool_Add").click(toolAdd);
    $("#Tool_Edit").click(toolEdit);
    $("#Tool_Delete").click(toolDelete);
    $("#Tool_Refresh").click(toolRefresh);

    $("#Tool_Add_Child").click(toolAddChild);
    $("#Tool_Edit_Child").click(toolEditChild);
    $("#Tool_Delete_Child").click(toolDeleteChild);

    //按钮-主窗体
    $("#Btn_Search").click(btnSearch);
    $("#Btn_Clean").click(btnClean);

    //****************************************************
    $('#form1').validateOnBlur();
    $('#form1').attr('action', 'SAVE_SYS_USER');

    $("#Btn_SaveNew").click(function () {
        if ($('#form1').validate()) {
            $('#form1').saveData(saveSuccess, saveError);
            if ($("#Checkbox_isResetPwd")[0].checked) resetSysPwd();
            $('#form1').cleanData();
        }
    });

    $("#Btn_Submit").click(function () {
        if ($('#form1').validate()) {
            $('#form1').saveData(saveSuccess, saveError);
            if ($("#Checkbox_isResetPwd")[0].checked) resetSysPwd();
            btnClose();
        }
    });

    $("#Btn_Cancel").click(btnClose);
    $("#Checkbox_All").click(checkAll);
    $("#Btn_Cancel_Child").click(btnCloseChild);
    $("#Checkbox_All_Child").click(checkAllChild);

    $("#Btn_Submit_Child").click(function () {
        if ($('#form2').validate()) {
            saveUserRole();
            btnCloseChild();
        }
    });

    $("#Checkbox_isResetPwd").change(setPwd);
}

//初始化
function init() {
    $("#Checkbox_isResetPwd").attr("checked", false);
    setPwd();
}

//根据重设密码√决定密码是否可填
function setPwd() {
    $("#Text_Pwd").val("");
    if ($("#Checkbox_isResetPwd")[0].checked) {
        $("#Text_Pwd").removeAttr("readonly");
    } else {
        $("#Text_Pwd").attr("readonly", "readonly");
    }
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
    data.constr = _constr;
    data.action = "LOAD_SYS_USER";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var tr, str, strTemp;

                for (var i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];

                    tr = $("<tr/>");
                    if (i % 2 != 0) {
                        tr.addClass("odd");
                    }

                    str = '<td><input type="checkbox" name="check1" value="' + record.id + '" /></td>';
                    str = str + '<td>' + record.username + '</td>';
                    str = str + '<td>' + record.nickname + '</td>';
                    str = str + '<td>' + record.realname + '</td>';
                    str = str + '<td><div class="btnDatagrid toolbarEdit btnEdit" title="修改" id="' + record.id + '"></div></td>';

                    tr.html(str);
                    s.append(tr);
                }

                //事件--点击修改按钮
                $(".btnEdit").click(btnEdit);

                //全选按钮变回空
                $("#Checkbox_All").prop("checked", false);

                //加载datatalbe
                _datatable = $("#Table_Datagrid").dataTable({
                    sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                	, bFilter: false                //开关，是否启用客户端过滤功能,true or false, default true
                	, bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                	, bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                	, aoColumnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                	, aaSorting: [] 	                //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
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


//加载子单据列表
function loadChildList() {
    if (_datatable_child != null) {
        _datatable_current_page_child = _datatable_child.fnPagingInfo().iPage;
        _datatable_child.fnDestroy(); //删除datatable
    }

    var s = $("#Table_Body_Child");
    s.find('tr').remove();

    var data = {};
    data.sessionid = request("SessionId");
    data.roleUserId = _edit_userid;
    data.action = "LOAD_SYS_USER_ROLE";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var tr, str, strTemp;

                for (var i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];

                    tr = $("<tr/>");
                    if (i % 2 != 0) {
                        tr.addClass("odd");
                    }

                    str = '<td><input type="checkbox" name="check2" value="' + record.id + '" /></td>';
                    str = str + '<td>' + record.roleCode + '</td>';
                    str = str + '<td>' + record.roleName + '</td>';
                    str = str + '<td><div class="btnDatagrid toolbarEdit btnEditChild" title="修改" id="' + record.id + '"></div></td>';

                    tr.html(str);
                    s.append(tr);
                }

                //事件--点击修改按钮
                $(".btnEditChild").click(btnEditChild);

                //全选按钮变回空
                $("#Checkbox_All_Child").prop("checked", false);

                //加载datatalbe
                _datatable_child = $("#Table_Datagrid_Child").dataTable({
                    sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                	, bFilter: true                //开关，是否启用客户端过滤功能,true or false, default true
                	, bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                	, bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                	, aoColumnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                	, aaSorting: [] 	                //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
                });
                _datatable_child.fnPageChange(_datatable_current_page_child);
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

//工具栏-新建
function toolAdd() {
    $("#Checkbox_isResetPwd").attr("disabled", "disabled");
    init();
    $('#form1').cleanData();
    $("#Btn_SaveNew").css("display", "");
    $("#Div_Form").dialog("option", { modal: false }).dialog("open");

    _edit_userid = 0;
    loadChildList();
}

//工具栏-修改
function toolEdit() {
    if ($("input[name='check1']:checked").length == 0) {
        alert("没有选定任何行");

    } else if ($("input[name='check1']:checked").length == 1) {
        //选定了一行，执行修改动作
        _edit_userid = $("input[name='check1']:checked").val();
        editUser();
    } else {
        alert("选定多于一行");
    }
}

//工具栏-删除
function toolDelete() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        $('#form1').deleteData('DELETE_DATA', c_id);
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

//按钮-关闭
function btnClose() {
    $("#Div_Form").dialog("close");
}

//按钮-修改
function btnEdit() {
    _edit_userid = $(this).attr("id");
    editUser();
}
function editUser() {
    $("#Checkbox_isResetPwd").removeAttr("disabled");
    init();
    $('#form1').fillData(_edit_userid, 'FILL_DATA');

    loadChildList();

    $("#Btn_SaveNew").css("display", "none");
    $("#Div_Form").dialog("option", { modal: false }).dialog("open");

}

//按钮-全选
function checkAll() {
    var isChecked = $(this).prop("checked");
    $("input[name='check1']").prop("checked", isChecked);
}

//执行保存后返回效果
function saveSuccess() {
    loadList();
}
function saveError(errorMessage) {
    alert(errorMessage);
}

//****************************************************
//按钮-搜索
function btnSearch() {
    _constr = "";

    if ($("#TextFilter_Username").val() != "" && $("#TextFilter_Username").val() != null) _constr = _constr + " AND " + $("#TextFilter_Username").attr("fieldname") + " LIKE '%" + $("#TextFilter_Username").val() + "%'";
    if ($("#TextFilter_Realname").val() != "" && $("#TextFilter_Realname").val() != null) _constr = _constr + " AND " + $("#TextFilter_Realname").attr("fieldname") + " LIKE '%" + $("#TextFilter_Realname").val() + "%'";

    loadList();
}

//按钮-清空
function btnClean() {
    _constr = "";
    $(".filterText").each(function () {
        if (this.tagName == 'SELECT') {
            this.selectedIndex = -1;
            $(this).trigger("change");
        } else {
            $(this).val("");
        }
    });
}

//重置密码
function resetSysPwd() {
    if ($("#Text_Pwd").val() != "" && $("#Text_Pwd").val() != null) {
        var data = {};
        data.sessionid = request("SessionId");
        data.id = $("#Hidden_Id").val();
        data.pwd = $("#Text_Pwd").val();
        data.action = "RESET_SYS_PWD";
        $.ajax({
            type: "POST",
            url: GET_DATA,
            data: data,
            dataType: 'json',
            async: false,
            success: function (response, status, xhr) {
                if (response.status == "SUCCESS") {
                    
                } else {
                    alert("重置密码失败");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest);
            }
        });
    } else {
        alert("重置密码失败，登录密码不能为空");
    }
}


//子单据工具栏-新建
function toolAddChild() {
    if ($("#Hidden_Id").attr("value") != "0") {
        $('#form2').cleanData();
        $("#Div_Form_Child").dialog("option", { modal: false }).dialog("open");
    }
}

//子单据工具栏-修改
function toolEditChild() {
    if ($("input[name='check2']:checked").length == 0) {
        alert("没有选定任何行");

    } else if ($("input[name='check2']:checked").length == 1) {
        //选定了一行，执行修改动作
        _edit_userroleid = $("input[name='check2']:checked").val();
        editUserRole();
    } else {
        alert("选定多于一行");
    }
}

//子单据工具栏-删除
function toolDeleteChild() {
    if ($("input[name='check2']:checked").length > 0) {
        var c_id = "";
        $("input[name='check2']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        $('#form2').deleteData('DELETE_DATA', c_id);
        loadChildList();

    } else {
        alert("没有选定任何行");
    }
}

//子单据按钮-修改
function btnEditChild() {
    _edit_userroleid = $(this).attr("id");
    editUserRole();
}
function editUserRole() {
    $('#form2').fillData(_edit_userroleid, 'FILL_DATA');
    $("#Div_Form_Child").dialog("option", { modal: false }).dialog("open");

}

//子单据按钮-关闭
function btnCloseChild() {
    $("#Div_Form_Child").dialog("close");
}

//子单据按钮-全选
function checkAllChild() {
    var isChecked = $(this).prop("checked");
    $("input[name='check2']").prop("checked", isChecked);
}

//加载角色列表select
function loadSysRole() {
    var s = $("#Select_Role");
    s.find('option').remove();

    var data = {};
    data.sessionid = request("SessionId");
    data.table = "t_sys_role";
    data.action = "LOAD_LIST";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                for (var i = 1; i <= response.records.length; i++) {
                    var record = response.records[i - 1];

                    var option = $("<option/>");
                    option.attr("value", record.id);
                    option.html(record.name);
                    s.append(option);
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

    s.combobox();
}

//执行子单据保存
function saveUserRole() {
    var data = {};
    data.sessionid = request("SessionId");
    data.id = $("#Hidden_Id_Child").val();
    data.userId = _edit_userid;
    data.roleId = $("#Select_Role").val();
    data.action = "SAVE_SYS_USER_ROLE";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                loadChildList();
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}