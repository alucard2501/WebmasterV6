//****************************************************
//全局变量
var _title = "";
var _arr_datagrid = new Array();
var _datatable = null;
var _constr = [];

//****************************************************
//加载页面
function loadDoucument() {
    init();
    $("#Span_DatagridHeader").text(_title);

    //工具栏-列表
    $("#Tool_Setting").click(toolSetting);
    $("#Tool_Refresh").click(toolRefresh);

    //按钮-主窗体
    $("#Btn_Search").click(btnSearch);
    $("#Btn_Clean").click(btnClean);

    //按钮-配置窗体
    $("#Btn_SettingSubmit").click(btnSettingSubmit);
    $("#Btn_SettingCancel").click(btnSettingClose);
}

//初始化
function init() {
    var data = {};
    data.sessionid = request("SessionId");
    data.id = request("reportId");
    data.table = "t_sys_report";
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

                    _title = record.reportName;

                    initFilter(record.id);
                    initDatagrid();
                    btnSearch();

                    $("#Div_Setting").dialog({
                        autoOpen: false,
                        title: '列表配置',
                        modal: true,
                        width: 500,
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

//初始化列表的动态列
function initDatagrid() {
    var data = {};
    data.sessionid = request("SessionId");
    data.reportId = request("reportId");
    data.action = "LOAD_REPORT_DETAIL";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                _arr_datagrid = new Array();

                for (var i = 1; i <= response.records.length; i++) {
                    var record = response.records[i - 1];

                    var item = {};
                    item.caption = record.caption;
                    item.mappingName = record.mappingName;
                    item.width = record.width;
                    _arr_datagrid.push(item);
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
    var tableWidth = 0;

    if (_datatable != null) {
        _datatable.fnDestroy(); //删除datatable
    }

    //加载动态表头
    var s = $("#Table_Head");
    s.find('tr').remove();
    var tr = $("<tr/>");
    var str = '';
    tr.addClass("trReportHeader");
    for (var j = 0; j < _arr_datagrid.length; j++) {
        if (j == 0) {
            str = str + '<th class="tdReport1" style="width:' + _arr_datagrid[j].width + 'px;">' + _arr_datagrid[j].caption + '</th>';
        } else {
            str = str + '<th style="width:' + _arr_datagrid[j].width + 'px;">' + _arr_datagrid[j].caption + '</th>';
        }
        tableWidth = tableWidth + parseInt(_arr_datagrid[j].width);
    }
    tr.html(str);
    s.append(tr);
    if (tableWidth > 1008) $("#Table_Datagrid").width(tableWidth);

    //加载动态表体
    var s = $("#Table_Body");
    s.find('tr').remove();

    var data = {};
    data.sessionid = request("SessionId");
    data.reportId = request("reportId");
    data.constr = _constr;
    data.action = "LOAD_REPORT";
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

                    var tr = $("<tr/>");
                    if (i % 2 != 0) {
                        tr.addClass("trReport1");
                    }

                    //动态读取列表字段
                    var str = '';
                    for (var j = 0; j < _arr_datagrid.length; j++) {
                        if (j == 0) {
                            str = str + '<td class="tdReport1">' + record[_arr_datagrid[j].mappingName] + '</td>';
                        } else {
                            str = str + '<td>' + record[_arr_datagrid[j].mappingName] + '</td>';
                        }
                    }
                    tr.html(str);
                    s.append(tr);
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

//加载combobox项
function loadComboboxOption(item, params, optionParams, datasourceParams) {
    var data = {};
    data.sessionid = request("SessionId");
    data.params = params;
    if (optionParams) data.optionParams = optionParams;
    if (datasourceParams) data.datasourceParams = datasourceParams;
    data.action = "LOAD_DATASOURCE_SQL";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                if (item.find("option").length > 0) {
                    item.find("option").remove();
                    item[0].selectedIndex = -1;
                    item.trigger("change");
                }


                for (var i = 1; i <= response.records.length; i++) {
                    var record = response.records[i - 1];

                    var option = $("<option/>");
                    option.attr("value", record[response.ValueColumn]);
                    option.html(record[response.TextColumn]);
                    item.append(option);
                }
                //带默认值
                if (parseInt(response.SelectedIndex) > -1) {
                    item.attr("defaultIndex", parseInt(response.SelectedIndex));
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

//初始化快速筛选动态控件
function initFilter(orderId) {
    var s = $("#Div_FilterControl");
    s.empty();

    var label, item;
    var xMax = 0;       //最右面控件的X
    var width1 = 60;    //Label宽度
    var width2 = 140;   //控件宽度
    var width3 = 5;     //Label与控件间间距
    var width0 = width1 + width2 + width3 + 14; //每一段的总宽度
    var height0 = 21;   //控件高度
    var height1 = 5;    //控件行距

    var data = {};
    data.sessionid = request("SessionId");
    data.reportId = request("reportId");
    data.action = "LOAD_REPORT_CONDITION";
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

                    label = $("<label/>");
                    label.addClass("labelFilter");
                    label.css("width", width1 + "px");
                    label.css("height", height0 + "px");
                    label.css("left", width0 * (record.x - 1) + "px");
                    label.css("top", (height0 + height1) * (record.y - 1) + "px");
                    label.html(record.label + ": ");
                    s.append(label);

                    switch (record.controlType) {
                        case "TextBox":
                            item = $("<input/>");
                            item.attr("type", "text");
                            item.addClass("filterText");
                            item.css("width", width2 + "px");
                            item.css("height", height0 + "px");
                            item.css("left", width0 * (record.x - 1) + width1 + width3 + "px");
                            item.css("top", (height0 + height1) * (record.y - 1) + "px");
                            item.css("font-size", "12px");
                            item.attr("paramname", record.paramName);

                            s.append(item);
                            break;

                        case "ComboBox":
                            item = $("<select/>");
                            item.addClass("filterText");
                            item.css("width", width2 + "px");
                            item.css("height", height0 + "px");
                            item.css("left", width0 * (record.x - 1) + width1 + width3 + "px");
                            item.css("top", (height0 + height1) * (record.y - 1) + "px");
                            item.css("font-size", "12px");
                            item.attr("paramname", record.paramName);

                            loadComboboxOption(item, record.params);

                            s.append(item);
                            item.combobox();
                            item[0].selectedIndex = -1;
                            item.trigger("change");

                            break;

                        case "DateTimePicker":
                            item = $("<input/>");
                            item.attr("type", "text");
                            item.addClass("filterText");
                            item.css("width", width2 + "px");
                            item.css("height", height0 + "px");
                            item.css("left", width0 * (record.x - 1) + width1 + width3 + "px");
                            item.css("top", (height0 + height1) * (record.y - 1) + "px");
                            item.css("font-size", "12px");
                            item.attr("isDateTime", "1");
                            item.attr("defaultValue", getParam(record.params, "DefaultValue", ""));
                            item.attr("paramname", record.paramName);
                            s.append(item);

                            if (getParam(record.params, "IsDateOnly", "") == "True") {    //只显示日期
                                item.datepicker({
                                    dateFormat: 'yy-mm-dd'
                                });
                            } else {    //显示时间
                                item.datetimepicker({
                                    showSecond: true,
                                    dateFormat: 'yy-mm-dd',
                                    timeFormat: 'hh:mm:ss'
                                });
                            }

                            setDateTimePickerDefault(); //设置默认值
                            break;

                        default:
                            break;
                    }


                    if (parseInt(record.x) > xMax) xMax = parseInt(record.x);
                }

                if (xMax == 0) {
                    $(".divDatagridFilter").css("display", "none");
                } else {
                    $("#Div_FilterControl").css("height", (height0 + height1) * record.y + "px");
                }
                $(".divFilterButton").css("left", (xMax * width0 + 30) + "px");

            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

//设置快速筛选的时间控件默认值
function setDateTimePickerDefault() {
    $(".filterText").each(function () {
        if ($(this).attr("defaultValue") == "3") {
            //今日
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            $(this).val(currentdate);
        } else if ($(this).attr("defaultValue") == "4") {
            //现在时间
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hour >= 1 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minute >= 1 && minute <= 9) {
                minute = "0" + minute;
            }
            if (second >= 1 && second <= 9) {
                second = "0" + second;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + minute + seperator2 + second;
            $(this).val(currentdate);
        }
    });
}

//工具栏-配置
function toolSetting() {
    var s = $("#Table_Setting");
    s.find('tr').remove();

    var tr, str;
    tr = $("<tr/>");
    str = '<td style="width:15%">可见</td><td style="width:50%">列名</td><td style="width:35%">列宽</td>';
    tr.html(str);
    s.append(tr);

    var data = {};
    data.sessionid = request("SessionId");
    data.reportId = request("reportId");
    data.isAll = true;
    data.action = "LOAD_REPORT_DETAIL";
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
                    var record = response.records[i - 1];
                    tr = $("<tr/>");

                    str = '<td><input type="checkbox" class="checkboxSetting" id="' + record.id + '" value0="' + record.isVisible
                    if (record.isVisible == "true") {
                        str = str + '" checked="checked" /></td>';
                    } else {
                        str = str + '" /></td>';
                    }
                    str = str + '<td><input type="text" class="textSetting" data-validation="required" bindcolumn="caption" id="' + record.id + '" value0="' + record.caption + '" value="' + record.caption + '" /></td>';
                    str = str + '<td><input type="text" class="textSetting" data-validation="validate_int" bindcolumn="width" id="' + record.id + '" value0="' + record.width + '" value="' + record.width + '" /></td>';

                    tr.html(str);
                    s.append(tr);
                }

            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

    $('#Form_Setting').validateOnBlur();
    $("#Div_Setting").dialog("option", { modal: false }).dialog("open");
}

//工具栏-刷新
function toolRefresh() {
    btnSearch();
    _datatable.fnPageChange(0);
}

//****************************************************
//按钮-搜索
function btnSearch() {
    _constr = [];
    $(".filterText").each(function () {
        var val = "";
        if ($(this).val() != "" && $(this).val() != null) {
            val = $(this).val();
        }
        var cond = {};
        cond.name = $(this).attr("paramname");
        cond.value = val;
        _constr.push(cond);
    });
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

    setDateTimePickerDefault();
}

//****************************************************
//【配置列表】按钮-确定
function btnSettingSubmit() {
    if ($('#Form_Setting').validate()) {
        var arr_item = new Array();

        $(".textSetting").each(function () {
            if ($(this).val() != $(this).attr("value0")) {
                var item = {};
                item.id = $(this).attr("id");
                item.bindcolumn = $(this).attr("bindcolumn");
                item.value = $(this).val();
                arr_item.push(item);
            }
        });

        $(".checkboxSetting").each(function () {
            if ($(this)[0].checked) {
                if ($(this).attr("value0") == "false") {
                    //改为选定
                    var item = {};
                    item.id = $(this).attr("id");
                    item.bindcolumn = "isVisible";
                    item.value = 1;
                    arr_item.push(item);
                }
            } else {
                if ($(this).attr("value0") == "true") {
                    //改为不选定
                    var item = {};
                    item.id = $(this).attr("id");
                    item.bindcolumn = "isVisible";
                    item.value = 0;
                    arr_item.push(item);
                }
            }

        });

        if (arr_item.length > 0) {
            var data = {};
            data.sessionid = request("SessionId");
            data.arrItem = arr_item;
            data.action = "SAVE_REPORT_DETAIL";
            $.ajax({
                type: "POST",
                url: GET_DATA,
                data: data,
                dataType: 'json',
                async: false,
                success: function (response, status, xhr) {
                    if (response.status == "SUCCESS") {
                        initDatagrid();
                        btnSearch();
                    } else {
                        alert(response.errorMessage);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest);
                }
            });
        }

        btnSettingClose();
    }
}

//【配置列表】按钮-取消
function btnSettingClose() {
    $("#Div_Setting").dialog("close");
}

