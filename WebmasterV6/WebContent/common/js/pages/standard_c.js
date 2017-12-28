var _title = "";
var _table = "";
var _constr = "";
var _datatable = null;
var _datatable_current_page = 0;

function loadDoucument() {
    init();

    $("#Span_DatagridHeader").text(_title + ' ' + LAN.Key_List);

    $("#Tool_Add").click(toolAdd);
    $("#Tool_Edit").click(toolEdit);
    $("#Tool_Delete").click(toolDelete);
    $("#Tool_Stop").click(toolStop);
    $("#Tool_Remove").click(toolRemove);
    $("#Tool_Refresh").click(toolRefresh);

    //****************************************************
    $('#form1').validateOnBlur();
    $('#form1').attr('action', 'SAVE_STANDARD_C');

    $("#Btn_SaveNew").click(function () {
        if ($('#form1').validate()) {
            $('#form1').saveData(saveSuccess, saveError);
            $('#form1').cleanData();
        }
    });

    $("#Btn_Submit").click(function () {
        if ($('#form1').validate()) {
            $('#form1').saveData(saveSuccess, saveError);
            btnClose();
        }
    });

    $("#Btn_Search").click(btnSearch);
    $("#Btn_Clean").click(btnClean);
    $("#Btn_Close").click(btnClose);
    $("#Btn_Cancel").click(btnClose);
    $("#Checkbox_All").click(checkAll);
    //****************************************************



}

//初始化
function init() {
    var data = {};
    data.sessionid = request("SessionId");
    data.id = request("editFormId");
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

                    _title = record.caption;
                    _table = record.tableName;
                    loadList();
                    loadComboboxOption();
                    $("#Select_ParentId").combobox();
                    $("#Select_FilterParentId").combobox();


                    $('#form1').attr('tablename', _table);

                    $("#Div_Form").dialog({
                        autoOpen: false,
                        title: LAN.Key_Edit + ' ' + _title,
                        modal: true,
                        width: "400",
                        resizable: false    //是否可以调整对话框的大小，默认为 true
                    });

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
    data.table = _table;
    data.constr = _constr;
    data.action = "LOAD_LIST";
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
                    str = str + '<td>' + record.treecode + '</td>';
                    str = str + '<td>' + record.code + '</td>';
                    str = str + '<td>' + record.name + '</td>';
                    str = str + '<td>' + getParent(record.parentId) + '</td>';
                    if (record.isStop == "true") {
                        str = str + '<td>√</td>';
                    } else {
                        str = str + '<td></td>';
                    }
                    str = str + '<td><div class="btnDatagrid toolbarEdit btnEdit" title="' + LAN.Key_Edit + '" id="' + record.id + '"></div></td>';

                    tr.html(str);
                    s.append(tr);
                }

                //事件--点击修改按钮
                $(".btnEdit").click(btnEdit);

                //全选按钮变回空
                $("#Checkbox_All").prop("checked", false);

                //加载datatalbe
                _datatable = $(".tableDatagrid").dataTable({
                    sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                	, bFilter: false                //开关，是否启用客户端过滤功能,true or false, default true
                	, bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                	, bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                	, aoColumnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                	, aaSorting: [1, 'asc'] 	                //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
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
function getParent(id) {
    var parent = "";
    var data = {};
    data.sessionid = request("SessionId");
    data.table = _table;
    data.id = id;
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
                    parent = record.name;
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
    return parent;
}

//工具栏-新建
function toolAdd() {
    $('#form1').cleanData();
    $("#Btn_SaveNew").css("display", "");
    $("#Div_Form").dialog("option", { modal: false }).dialog("open");
}

//工具栏-修改
function toolEdit() {
    if ($("input[name='check1']:checked").length == 0) {
        alert("没有选定任何行");

    } else if ($("input[name='check1']:checked").length == 1) {
        //选定了一行，执行修改动作
        $('#form1').fillData($("input[name='check1']:checked").val(), 'FILL_DATA');

        $("#Btn_SaveNew").css("display", "none");
        $("#Div_Form").dialog("option", { modal: false }).dialog("open");

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

//工具栏-停用
function toolStop() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        $('#form1').stopData('STOP_DATA', c_id, 1);
        loadList();

    } else {
        alert("没有选定任何行");
    }
}

//工具栏-启用
function toolRemove() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        $('#form1').stopData('STOP_DATA', c_id, 0);
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

//按钮-搜索
function btnSearch() {
    _constr = "";
    $(".filterText").each(function () {
        if ($(this).attr("fieldname") == "parentId") {
            if ($(this).val() != null) {
                _constr = _constr + " AND parentId = " + $(this).val()
            }
        } else {
            _constr = _constr + " AND " + $(this).attr("fieldname") + " LIKE '%" + $(this).val() + "%'";
        }
    });
    loadList();
}

//按钮-清空
function btnClean() {
    _constr = "";
    $(".filterText").each(function () {
        if ($(this).attr("fieldname") == "parentId") {
            $(this)[0].selectedIndex = -1;
            $(this).trigger("change");
        } else {
            $(this).val("");
        }
    });
}

//按钮-关闭
function btnClose() {
    $("#Div_Form").dialog("close");
}

//按钮-修改
function btnEdit() {
    $('#form1').fillData($(this).attr("id"), 'FILL_DATA');

    $("#Btn_SaveNew").css("display", "none");
    $("#Div_Form").dialog("option", { modal: false }).dialog("open");
}

//按钮-关闭
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

//加载上级Combobox列表
function loadComboboxOption() {
    var s = $("#Select_ParentId");
    var s2 = $("#Select_FilterParentId");
    s.empty();
    s2.empty();

    var option = $("<option/>");
    option.attr("value", 0);
    option.html("无");
    s.append(option);
    s2.append(option.clone());

    var data = {};
    data.sessionid = request("SessionId");
    data.table = _table;
    data.orderstr = "ORDER BY treecode ASC";
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
                    s2.append(option.clone());
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

    s2[0].selectedIndex = -1;
}