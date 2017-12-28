//****************************************************
//全局变量
var _title = "";
var _table = "";
var _constr = "";
var _datatable = null;
var _datatable_current_page = 0;
var _datagrid_id = 0;
var _arr_datagrid = new Array();
var _form_width = 400;
var _form_height = 0;
var _form_height_status = $(window).height() - 240;
var _arr_child = new Array();
var _editor_list = new Array();
var _form_main={};

var uploader=null;
var _excelId=0;
//****************************************************
//加载页面
function loadDoucument() {
    init();
    $("#Span_DatagridHeader").text(_title + ' ' + LAN.Key_List);
    $('#form1').validateOnBlur();

    //工具栏-列表
    $("#Tool_Add").click(toolAdd);
    $("#Tool_Edit").click(toolEdit);
    $("#Tool_Delete").click(toolDelete);
    $("#Tool_Stop").click(toolStop);
    $("#Tool_Remove").click(toolRemove);
    $("#Tool_Setting").click(toolSetting);
    $("#Tool_Refresh").click(toolRefresh);
    $("#Tool_Check").click(toolCheck);
    $("#Tool_UnCheck").click(toolUnCheck);
    $("#Tool_Outport").click(toolOutport);
    $("#Tool_Inport").click(toolInport);

    //按钮-主窗体
    $("#Btn_Search").click(btnSearch);
    $("#Btn_Clean").click(btnClean);
    $("#Btn_Cancel").click(btnClose);
    $("#Checkbox_All").click(checkAll);
    $("#Btn_SaveNew").click(btnSaveNew);
    $("#Btn_Submit").click(btnSubmit);

    //按钮-配置窗体
    $("#Btn_SettingSubmit").click(btnSettingSubmit);
    $("#Btn_SettingCancel").click(btnSettingClose);
    
    //按钮-Excel导出
    $("#Btn_CancelExcelOutport").click(btnCloseExcelOutport);
    $("#Btn_SubmitExcelOutport").click(btnSubmitExcelOutport);
    
    //按钮-Excel导入
    $("#Btn_CancelExcelInport").click(btnCloseExcelInport);
    $("#Btn_SubmitExcelInport").click(btnSubmitExcelInport);
}

//初始化
function init() {
    var data = {};
    data.sessionid = request("SessionId");
    data.id = request("orderId");
    data.table = "t_sys_order";
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

                    _title = record.orderName;
                    _table = getTablename(record.moduleId);
                    _datagrid_id = record.listDataGridId;
                    $('#form1').attr('tablename', _table);
                    $('#form1').attr('orderId', record.id);

                    initToolbar();
                    initFilter(record.id);
                    initDatagrid();
                    loadList();
                    initExcelForeign();
                    $("#Div_Form").dialog({
                        autoOpen: false,
                        title: LAN.Key_Edit + ' ' + _title,
                        modal: true,
                        width: _form_width,
                        resizable: false    //是否可以调整对话框的大小，默认为 true
                    });

                    //判断Tabs
                    if (record.isTabPage == "true") { //分页
                        var ul = $("<ul/>");
                        var arrTab = record.tabPages.split(";");
                        for (var i = 0; i < arrTab.length - 1; i++) {
                            var li = $("<li/>");
                            li.html('<a href="#Tabs_' + i + '">' + arrTab[i] + '</a>');
                            ul.append(li);
                        }
                        $("#Div_FormMain").append(ul);

                        for (var i = 0; i < arrTab.length - 1; i++) {
                            var div = $('<div class="divTabsForm"/>');
                            div.attr("id", "Tabs_" + i).attr("tabname","Tabs_"+arrTab[i]);
                            $("#Div_FormMain").append(div);
                            div.empty();
                        }

                        $("#Div_FormMain").tabs();

                        //加入子单据
                        var arrChildList = getParam(record.params, "ChildList", "").split(",");
                        for (var i = 0; i < arrChildList.length - 1; i++) {
                            if (arrChildList[i]!="") initChildList(arrChildList[i],i+1);
                        }
                    } else {    //不分页,Div_FormMain就是容器
                        $("#Div_FormMain").html('<div id="Div_FormControl" class="divTabsForm"></div>');
                        $("#Div_FormControl").empty();
                    }
                    _form_main={};
                    _form_main.orderId=record.id;
                    _form_main.targetId="#Div_FormControl";
                    initForm(_form_main);
                    $("#Div_Form").dialog("option", { width: _form_width });
                    //initFilter(record.id);

                    $("#Div_Setting").dialog({
                        autoOpen: false,
                        title: '列表配置',
                        modal: true,
                        width: 500,
                        resizable: false    //是否可以调整对话框的大小，默认为 true
                    });
                    for (var i = 0; i < _editor_list.length; i++) {
                        _editor_list[i].item.cleditor({
                            width: _editor_list[i].width,
                            height: _editor_list[i].height,
                            left: _editor_list[i].left,
                            top: _editor_list[i].top,
                            position: "absolute",
                            controls: "bold italic underline strikethrough | font size " +
                                      "style | color highlight removeformat | bullets numbering | " +
                                      "alignleft center alignright justify | undo redo | " +
                                      "imgSelector link unlink | source"
                        });
                    }
                    $("#Div_ExcelOutport").dialog({
                        autoOpen: false,
                        title: '导出' + _title,
                        modal: true,
                        width: 300,
                        resizable: false    //是否可以调整对话框的大小，默认为 true
                    });
                    $("#Div_ExcelInport").dialog({
                        autoOpen: false,
                        title: '导入' + _title,
                        modal: true,
                        width: 300,
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

//获取表名
function getTablename(moduleId) {
    var tablename = "";
    var data = {};
    data.sessionid = request("SessionId");
    data.id = moduleId;
    data.table = "t_sys_module";
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
                    tablename = record.tableName;
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

    return tablename;
}

//初始化工具栏
function initToolbar() {
    var data = {};
    data.sessionid = request("SessionId");
    data.orderId = request("orderId");
    data.toolbarType = 0;
    data.action = "LOAD_ORDER_TOOLBAR";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                for (var i = 0; i < response.records.length; i++) {
                    var record = response.records[i];

                    switch (record.buttonName) {
                        case "新建":
                            $("#Tool_Add").css("display", "block");
                            break;
                        case "修改":
                            $("#Tool_Edit").css("display", "block");
                            break;
                        case "删除":
                            $("#Tool_Delete").css("display", "block");
                            break;
                        case "停用":
                            $("#Tool_Stop").css("display", "block");
                            break;
                        case "启用":
                            $("#Tool_Remove").css("display", "block");
                            break;
                        case "审核":
                            $("#Tool_Check").css("display", "block");
                            break;
                        case "反审":
                            $("#Tool_UnCheck").css("display", "block");
                            break;
                        case "配置":
                            $("#Tool_Setting").css("display", "block");
                            break;
                        case "刷新":
                            $("#Tool_Refresh").css("display", "block");
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
}

//初始化列表的动态列
function initDatagrid(){
	var data = {};
    data.sessionid = request("SessionId");
    data.datagridId = _datagrid_id;
    data.action = "LOAD_DATAGRID_DETAIL";
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
                    item.valueType = record.valueType;
                    item.columnType = record.columnType;
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

function initExcelForeign(){
	var data = {};
    data.sessionid = request("SessionId");
    data.orderId = request("orderId");
    data.action = "LOAD_EXCEL_FROEIGN";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
            	if(response.excelId==null){
            		$("#Tool_Outport").css("display","none");
            		$("#Tool_Inport").css("display","none");
            		return;
            	}
            	_excelId=response.excelId;
                uploader=$("#Input_PlUpload").Plupload({
                    FileTypeId: 2,
                    IsExcelImport: true,
                    ExcelId: response.excelId,
                    onUploadComplete: function (files,ids) {
                    	fileIds=ids;
                    	//alert("ok");
                    }
                });
            	var height1 = 20;   //上距离高度
            	var so = $("#Div_FormExcelOutport");
            	var si = $("#Div_FormExcelInport");
            	so.height(response.records.length*50);
            	si.height(response.records.length*50+120);
            	$("#Div_PlUpload").css("top",(response.records.length==0)?60:response.records.length*50+30);
            	var y=40;
                for (var i = 0; i < response.records.length; i++) {
                	var record = response.records[i];
                    //caption,columnName
                	//***************************
                	var item = $("<label/>");
                    item.addClass("label0");
                    item.css("width", "50px");
                    item.css("height", "21px");
                    item.css("left", "35px");
                    item.css("top", (40*(i+1)+height1)+"px");
                    so.append(item);
                    item.text(record.caption);
                    
                    item=$("<input/>");
                    item.addClass("text0");
                    item.addClass("outport_field");
                    item.attr("columnName",record.columnName);
                    item.css("width", "100px");
                    item.css("height", "21px");
                    item.css("left", "95px");
                    item.css("top", (40*(i+1)+height1)+"px");
                    item.css("font-size", "12px");
                    so.append(item);
                    //***************************
                    item = $("<label/>");
                    item.addClass("label0");
                    item.css("width", "50px");
                    item.css("height", "21px");
                    item.css("left", "35px");
                    item.css("top", (40*(i+1)+height1)+"px");
                    si.append(item);
                    item.text(record.caption);
                    
                    item=$("<input/>");
                    item.addClass("text0");
                    item.addClass("inport_field");
                    item.attr("columnName",record.columnName);
                    item.css("width", "100px");
                    item.css("height", "21px");
                    item.css("left", "95px");
                    item.css("top", (40*(i+1)+height1)+"px");
                    item.css("font-size", "12px");
                    si.append(item);
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

    //加载动态表头
    var total_width=0;
    var s = $("#Table_Head");
    s.find('tr').remove();
    var tr = $("<tr/>");
    var str = '<th class="unsortable" style="width:51px;"><input id="Checkbox_All" type="checkbox" /></th>';
    for (var j = 0; j < _arr_datagrid.length; j++) {
        str = str + '<th class="thDatagridColumn" width="' + (parseInt(_arr_datagrid[j].width)) + 'px">' + _arr_datagrid[j].caption + '</th>';
        total_width+=parseInt(_arr_datagrid[j].width);
    }
    //str = str + '<th class="unsortable" style="width:28px;">停用</th>';
    str = str + '<th class="unsortable" style="width:40px;">' + LAN.Th_Control + '</th>';
    total_width=total_width+113+_arr_datagrid.length+4;
    tr.html(str);
    s.append(tr);

    //加载动态表体
    var s = $("#Table_Body");
    s.find('tr').remove();

    var data = {};

    //建立筛选条件
    _constr = "";
    $(".filterText").each(function () {
        if ($(this).val() != "" && $(this).val() != null) {
            if ($(this).attr("conditionType") == "2") {
                data[$(this).attr("datagridParamName")] = $(this).val();
            } else {
                _constr = _constr + $(this).attr("fieldname") + "=" + $(this).val() + ";";
            }
        }
    });

    data.sessionid = request("SessionId");
    data.datagridId = _datagrid_id;
    data.constr = _constr;
    data.action = "LOAD_ORDER";
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
                        tr.addClass("odd");
                    }

                    var str = '<td ><input type="checkbox" name="check1" value="' + record.id + '" /></td>';
                    
                    /*******************************************************************/
                    //动态读取列表字段
                    for (var j = 0; j < _arr_datagrid.length; j++) {
                    	var width=(parseInt(_arr_datagrid[j].width));
                        if (_arr_datagrid[j].valueType == "System.DateTime") {
                            //处理日期格式
                        	str = str + '<td >' + record[_arr_datagrid[j].mappingName].replace(".0", "").replace(" 00:00:00", "") + '</td>';
                        } else if (_arr_datagrid[j].valueType == "System.Boolean") {
                            //布尔类型
                            if(record[_arr_datagrid[j].mappingName]=="true"){
                                str = str + '<td >√</td>';
                            } else {
                                str = str + '<td ></td>';
                            }
                        } else if (_arr_datagrid[j].valueType == "System.Decimal") {
                            str = str + '<td width="' + width + 'px">' + parseFloat(record[_arr_datagrid[j].mappingName]) + '</td>';
                        } else if (_arr_datagrid[j].columnType == "4") {
                            //图片
                            var src = getImageSrcById(record[_arr_datagrid[j].mappingName]);
                            if (src != '') {
                                str = str + '<td ><a href="' + src + '" class="galleryA"><img src="' + src + '" class="imgDatagrid" /></a></td>';
                            } else {
                                str = str + '<td ></td>';
                            }
                        } else {
                        	 str = str + '<td>' + record[_arr_datagrid[j].mappingName] + '</td>';
                        }
                    }
                    /******************************************************************
                    
                    if (record.isStop == "true") {
                        str = str + '<td>√</td>';
                    } else {
                        str = str + '<td></td>';
                    }*/
                    str = str + '<td><div class="btnDatagrid toolbarEdit btnEdit" title="' + LAN.Key_Edit + '" id="' + record.id + '"></div></td>';

                    tr.html(str);
                    s.append(tr);
                }

                $(".galleryA").colorbox({ rel: 'galleryA' });

                //事件--点击修改按钮
                $(".btnEdit").click(btnEdit);

                //全选按钮变回空
                $("#Checkbox_All").prop("checked", false);

                //加载datatalbe
                var columns_config=[];
                var column_config={};
                column_config.width="64";
                columns_config.push(column_config);
                for(var i=0;i<_arr_datagrid.length;i++){
                	column_config={};
                	column_config.width=_arr_datagrid[i].width;
                    columns_config.push(column_config);
                }
                column_config={};
            	column_config.width="62";
                columns_config.push(column_config);
                _datatable = $("#Table_Datagrid").dataTable({
                    sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                    , autoWidth: false
                	, bFilter: false                //开关，是否启用客户端过滤功能,true or false, default true
                	, bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                	, bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                	, columnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                	, columns: columns_config
                	, aaSorting: [] 	    //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
                	, scrollX: true      	    //
                	//
                });
                _datatable.fnPageChange(_datatable_current_page);
                $("#Table_Datagrid").width(total_width);
                $("#Table_Datagrid_wrapper").width("100%");
                $(".dataTables_scrollHeadInner").width(total_width);
                _datatable.api().columns.adjust().draw();
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

//初始化表单动态控件
//orderId, formname
function initForm(form_order) {
    var item;
    var height1 = 20;   //上距离高度
    var height2 = 45;   //下距离高度
    var yMax = 0;       //最下面控件的Y
    var xMax = 0;       //最右面控件的X
    var heightEnd = 0;  //最下面控件的最大高度
    var widthEnd = 0;   //最右面控件的最大宽度
    var width1 = 50;   //左右距边宽度总和
    form_order.items=[];

	var data = {};
    data.sessionid = request("SessionId");
    data.orderId = form_order.orderId;
    data.action = "LOAD_ORDER_DETAIL";
    $.ajax({
    type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var arr_size = new Array();

                for (var i = 1; i <= response.records.length; i++) {
                    var record = response.records[i - 1];

                    //分页，找出对应的div
                    if (record.tabPage != "") {
                        var s =	$("[tabname='Tabs_" + record.tabPage +"']") // $("#Tabs_" + record.tabPage); //tabname
                    } else {
                        var s = $(form_order.targetId);
                    }

                    switch (record.controlType) {
                        case "1"://Textbox
                            if (record.height > 21) {
                                item = $("<textarea/>");
                            } else {
                                item = $("<input/>");
                                item.attr("type", "text");
                            }
                            item.addClass("text0");
                            item.css("width", record.width + "px");
                            item.css("height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");
                            item.css("font-size", "12px");
                            item.attr("bindcolumn", record.columnName);
                            if (record.IsKeepValue == "True") item.attr("isClean", "0");                                        //新建不刷新
                            if (getParam(record.params, "NotShowZero", "") == "1") item.attr("NotShowZero", "1");               //为0时不显示
                            if (getParam(record.optionParams, "IsReadOnly", "") == "True") item.attr("readonly", "readonly");   //只读
                            if (getParam(record.optionParams, "IsSaveOnce", "") == "True") item.attr("IsSaveOnce", "1");        //一次性保存
                            if (record.formula != "") item.attr("formula", record.formula);                                     //公式
                            if (record.formulaEvent != "") item.attr("formulaEvent", record.formulaEvent);                      //公式事件
                            if (record.formulaListenControl != "") item.attr("formulaListenControl", record.formulaListenControl);
                            if (record.checkCodeType == 1) item.attr("data-validation", "required");                            //不能为空
                            switch(getParam(record.params, "DataType", "")){//数据验证
                                case "Integer":
                                    item.attr("data-validation", "validate_int");
                                    break;
                                case "Decimal":
                                    item.attr("data-validation", "validate_float");
                                    break;
                            }
                            s.append(item);
                            if (getParam(record.params, "IsSuggest", "") == "1") {  //录入提示，变成Autocomplete
                                var itemAutocompleteSource = [];
                                itemAutocompleteSource = getAutocompleteSource(record.params);
                                item.autocomplete({
                                    source: itemAutocompleteSource
                                });
                            }
                            break;

                        case "2": //Lable
                            item = $("<label/>");
                            item.addClass("label0");
                            item.css("width", record.width + "px");
                            item.css("height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");

                            var reg = / /g;
                            item.html(record.TEXT.replace(reg, "&nbsp;"));
                            s.append(item);
                            break;

                        case "3"://Combobox
                            item = $("<select/>");
                            item.css("width", record.width + "px");
                            item.css("height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");
                            item.css("font-size", "12px");
                            item.attr("bindcolumn", record.columnName);
                            if (record.IsKeepValue == "True") item.attr("isClean", "0");    //新建不刷新
                            if (getParam(record.optionParams, "IsReadOnly", "") == "True") item.attr("readonly", "readonly");
                            if (record.formula != "") item.attr("formula", record.formula);                                     //公式
                            if (record.formulaEvent != "") item.attr("formulaEvent", record.formulaEvent); 
                            if (record.formulaListenControl != "") item.attr("formulaListenControl", record.formulaListenControl);
                            if (record.checkCodeType == 1) item.attr("data-validation", "required");                            //不能为空
                            loadComboboxOption(item, record.params, record.optionParams);
                            s.append(item);
                            item.combobox();

                            item[0].selectedIndex = item.attr("defaultindex");
                            
                            item.trigger("change");
                            break;

                        case "4"://Image
                            item = $("<img/>");
                            //item.css("min-width", "84px");
                            //item.css("min-height", "84px");
                            item.css("max-width", record.width + "px");
                            item.css("max-height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");
                            item.attr("bindcolumn", record.columnName);
                            item.attr("defaultValue", "../images/noimage.jpg");
                            item.attr("title", "点击选择图片");
                            item.attr("value", "0");

                            if (getParam(record.optionParams, "IsReadOnly", "") == "True") {
                                item.addClass("text0");
                                var a = $("<a/>");
                                a.addClass("galleryA")
                                a.append(item);
                                s.append(a);
                            } else {
                                item.addClass("imgSelector");
                                s.append(item);
                                item.ImgSelector({
                                    onSubmit: function (img, element) {                    // 确定
                                        element.attr("src", img.srcL);
                                        element.attr("value", img.id);
                                    }
                                });
                            }
                            break;

                        case "7"://Datepicker
                            item = $("<input/>");
                            item.attr('id', 'item'+record.id);
                            item.attr("type", "text");
                            item.addClass("text0");
                            item.css("width", record.width + "px");
                            item.css("height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");
                            item.css("font-size", "12px");
                            item.attr("bindcolumn", record.columnName);
                            if (record.IsKeepValue == "True") item.attr("isClean", "0");
                            item.attr("isDateTime", "1");
                            item.attr("defaultValue", record.DefaultValue);
                            s.append(item);
                            if (getParam(record.optionParams, "IsReadOnly", "") == "True") {    //只读
                                item.datepicker({
                                    disabled: true
                                });
                            } else {
                                if (getParam(record.params, "IsDateOnly", "") == "True") {    //只显示日期
                                    item.datepicker({
                                        dateFormat: 'yy-mm-dd'
                                    });
                                    //item.datepicker("option", "dateFormat", "yy-mm-dd");
                                } else {    //显示时间
                                    item.datetimepicker({
                                        showSecond: true,
                                        dateFormat: 'yy-mm-dd',
                                        timeFormat: 'hh:mm:ss'
                                    });
                                }
                            }
                            break;

                        case "8"://Checkbox
                            item = $("<input/>");
                            item.attr("type", "checkbox");
                            item.addClass("checkbox0");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1 + 2) + "px");
                            item.attr("bindcolumn", record.columnName);
                            if (record.IsKeepValue == "True") item.attr("isClean", "0");
                            s.append(item);
                            break;

                        case "9"://TextboxAdvance
                            item = $("<input/>");
                            item.attr("type", "text");
                            item.addClass("text0");
                            item.addClass("textboxAdvance");
                            item.css("width", record.width + "px");
                            item.css("height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");
                            item.css("font-size", "12px");
                            item.attr("bindcolumn", record.columnName);
                            if (record.IsKeepValue == "True") item.attr("isClean", "0");
                            s.append(item);
                            item.TextboxAdvance({
                                SessionId: data.sessionid,
                                DataGridId: getParam(record.params, "DataGridId", ""),
                                ValueColumn: getParam(record.params, "ValueColumn", ""),
                                TextColumn: getParam(record.params, "TextColumn", ""),
                                Width: 630,
                                Height: 28,
                                IsMult: true,
                            });
                            break;

                        case "11"://Textarea
                            item = $("<textarea/>");
                            item.addClass("text0");
                            item.css("font-size", "12px");
                            item.attr("bindcolumn", record.columnName);
                            item.attr("isEditor", "1");
                            if (record.checkCodeType == 1) item.attr("data-validation", "required");                            //不能为空
                            s.append(item);
                            var editor = {};
                            editor.item = item;
                            editor.width = (parseInt(record.width) + 12);
                            editor.height = record.height;
                            editor.left = parseInt(record.x);
                            editor.top = (parseInt(record.y) + height1);

                            _editor_list.push(editor);
                            //item.cleditor({
                            //    width: (parseInt(record.width) + 12),
                            //    height: record.height,
                            //    left: parseInt(record.x),
                            //    top: (parseInt(record.y) + height1),
                            //    position: "absolute",
                            //    controls: "bold italic underline strikethrough | font size " +
                            //              "style | color highlight removeformat | bullets numbering | " +
                            //              "alignleft center alignright justify | undo redo | " +
                            //              "imgSelector link unlink | source"
                            //});
                            break;

                        case "12"://FileSelector
                            item = $("<input/>");
                            item.attr("type", "text");
                            item.addClass("text0");
                            item.css("width", record.width + "px");
                            item.css("height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");
                            item.css("font-size", "12px");
                            item.attr("bindcolumn", record.columnName);
                            item.attr("isFile", "1");
                            if (record.IsKeepValue == "True") item.attr("isClean", "0");                                        //新建不刷新
                            s.append(item);
                            item.FileSelector();
                            break;

                        default://Textbox
                            item = $("<input/>");
                            item.attr("type", "text");
                            item.addClass("text0");
                            item.css("width", record.width + "px");
                            item.css("height", record.height + "px");
                            item.css("left", record.x + "px");
                            item.css("top", (parseInt(record.y) + height1) + "px");
                            item.css("font-size", "12px");
                            item.attr("bindcolumn", record.columnName);
                            s.append(item);
                            break;
                    }
                    item.attr("id","item"+record.id);
                    item.attr("itemname",record.itemName);
                    form_order.items.push(item);
                    item.data("form",form_order);
                    item.data("params",record.params);
                    var sizeItem = {};
                    sizeItem.width = record.width;
                    sizeItem.height = record.height;
                    sizeItem.x = record.x;
                    sizeItem.y = record.y;
                    arr_size.push(sizeItem);

                    if (parseInt(record.y) > yMax) yMax = parseInt(record.y);
                    //if (parseInt(record.x) > xMax) xMax = parseInt(record.x);
                }
                for(var j=0;j<form_order.items.length;j++){
                	var sender=form_order.items[j];
                	for(var i=0;i<form_order.items.length;i++){
            			item=form_order.items[i];
            			if(item.attr("formulaEvent")!=""){
            				var formulaEvent=parseInt(item.attr("formulaEvent"));
            				if((formulaEvent & 64)>0){
            					var formulaListenControl=item.attr("formulaListenControl");
            					if(formulaListenControl!=null && formulaListenControl!=""){
            						var handleItemNames=formulaListenControl.split(";");
            						for(var k=0;k<handleItemNames.length;k++){
            							if(handleItemNames[k]!="" && handleItemNames[k]==sender.attr("itemname")){
            								sender.change(itemChange);
            							}
            						}
            					}
            					
            				}
            			}
            		}
                }
                
                for (var j = 0; j < arr_size.length; j++) {
                    _form_width = Math.max(_form_width, parseInt(arr_size[j].x) + parseInt(arr_size[j].width) + width1);
                    //if (arr_size[j].x == xMax && parseInt(arr_size[j].width) > widthEnd) widthEnd = parseInt(arr_size[j].width);
                    if (arr_size[j].y == yMax && parseInt(arr_size[j].height) > heightEnd) heightEnd = parseInt(arr_size[j].height);
                }
                var form_height = 0;
                if (yMax + heightEnd + height1 + height2 > form_height) form_height = yMax + heightEnd + height1 + height2;
                if (form_height > _form_height_status) form_height = _form_height_status;
                _form_height = Math.max(form_height, _form_height);
                if (form_order.targetId != "#Div_FormControl") {
                    $(form_order.targetId).css("height", form_height + "px");
                    _form_height = _form_height_status;
                } else {
                    $(".divTabsForm").css("height", _form_height + "px");
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
//加载Autocomplete数据源
function getAutocompleteSource(params) {
    var a = [];
    var data = {};
    data.sessionid = request("SessionId");
    data.params = params;
    data.action = "LOAD_DATASOURCE_SQL";
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
                    a.push(record[getParam(params, "TextColumn", "")]);
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
    //a.push(getParam(params, "SortStr", ""));
    return a;
}
//加载combobox项
function loadComboboxOption(item, params, optionParams,datasourceParams) {
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
            	if(item.find("option").length>0){
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

//初始化子单据
function initChildList(param,index) {
    //_arr_child = [];    //暂时一种子单据的情况

    var child = {};
    var tempParam = param;
    var arr = tempParam.split("&");
    child.id=0;
    child.targetId="";
    child.orderId = arr[0];
    child.name = arr[1];
    child.columnBind = arr[2];
    child.datagridId = 0;
    child.datagridHead = [];
    child.datatable = null;
    child.columnBindValue = $('[bindcolumn="' + child.columnBind + '"]').val();
    child.foreignKey = "";
    child.datagridParams = [];
    child.BindTable = "";
    child.listNo = 0;

    _arr_child.push(child);

    //子单据列表（框架，工具栏）
    var s = $('<div class="divDatagridBody"/>');
    var str = '';
    str = str + '<div class="divDatagridToolbar" style="border-top:solid 2px #444444;"><ul><li><span id="Tool_Add_Child_' + child.name + '" class="toolbarAdd" childname="' + child.name + '">' + LAN.Tool_Add + '</span></li>';
    str = str + '<li><span id="Tool_Edit_Child_' + child.name + '" class="toolbarEdit" childname="' + child.name + '">' + LAN.Tool_Edit + '</span></li>';
    str = str + '<li><span id="Tool_Delete_Child_' + child.name + '" class="toolbarDelete" childname="' + child.name + '" listNo="' + child.listNo + '">' + LAN.Tool_Delete + '</span></li>';
    str = str + '</ul></div>';
    str = str + '<table id="Table_Datagrid_Child_' + child.name + '" class="tableDatagrid">';
    str = str + ' <thead id="Table_Head_Child_' + child.name + '"></thead>';
    str = str + '<tbody id="Table_Body_Child_' + child.name + '"></tbody></table>';
    s.html(str);
    //s.css("width", _form_width + "px");
    $("#Tabs_" + index).append(s);

    initDatagridChildList(child);

    s = $('<div id="Div_Form_Child_' + child.name + '"/>');
    str = '';
    str = str + '<form id="Form_Child_' + child.name + '" method="post" action="SAVE_ORDER" tablename="' + child.BindTable + '" orderId="' + child.orderId + '" foreignName="' + child.foreignKey + '" foreignValue="">';
    str = str + '<input id="Hidden_Id_Child_' + child.name + '" type="hidden" value="0" bindcolumn="id" defaultvalue="0" />';
    str = str + '<div id="Div_FormMain_Child_' + child.name + '" class="divFormControlChild"></div>';
    str = str + '<div class="divFormButton"><div class="divFormButtonRight">';
    str = str + '<input id="Btn_Submit_Child_' + child.name + '" type="button" class="btnMiddle btnOrange" childname="' + child.name + '" listNo="' + child.listNo + '" value="确 定" /> ';
    str = str + '<input id="Btn_Cancel_Child_' + child.name + '" type="button" class="btnMiddle btnGray" childname="' + child.name + '" value="取 消" />';
    str = str + '</div></div></form>';
    s.html(str);
    $("#Div_Form").after(s);
    //child.id=child.orderId;
    child.targetId="#Div_FormMain_Child_" + child.name;
    initForm(child); //初始化子单据动态控件
    $("#Div_Form_Child_" + child.name).dialog({
        autoOpen: false,
        title: '编辑' + child.name,
        modal: true,
        width: _form_width,
        resizable: false    //是否可以调整对话框的大小，默认为 true
    });

    //子单据工具栏
    $("#Tool_Add_Child_" + child.name).click(toolChildAdd);
    $("#Tool_Edit_Child_" + child.name).click(toolChildEdit);
    $("#Tool_Delete_Child_" + child.name).click(toolChildDelete);

    //子单据按钮
    $("#Btn_Submit_Child_" + child.name).click(btnChildSubmit);
    $("#Btn_Cancel_Child_" + child.name).click(btnChildCancel);
}
//初始化子单据列表的动态列
function initDatagridChildList(child) {
    var data = {};
    data.sessionid = request("SessionId");
    data.id = child.orderId;
    data.table = "t_sys_order";
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
                    child.datagridId = record.listDataGridId;
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

    data = {};
    data.sessionid = request("SessionId");
    data.id = child.datagridId;
    data.table = "t_sys_datagrid";
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
                    child.foreignKey = getParam(record.params, "Foreign", "");
                    child.BindTable = getParam(record.params, "BindTable", "");
                    var paramliststr = getParam(record.params, "ParamList", "");
                    var paramlist = paramliststr.split("]");
                    var val = "";
                    for (var i = 0; i < paramlist.length; i++) {
                        val = paramlist[i].replace("[", "");
                        if (val.length > 0) {
                            var item = {};
                            var temp = val.split("&");
                            item.Name = temp[0].replace("Name=", "");
                            item.DefaultValue = temp[2].replace("DefaultValue=", "");
                            item.value = "";
                            child.datagridParams.push(item);
                        }
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

    data = {};
    data.sessionid = request("SessionId");
    data.datagridId = child.datagridId;
    data.action = "LOAD_DATAGRID_DETAIL";
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

                    var item = {};
                    item.caption = record.caption;
                    item.mappingName = record.mappingName;
                    item.width = record.width;
                    item.valueType = record.valueType;
                    item.columnType = record.columnType;
                    child.datagridHead.push(item);
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
//加载子单据列表
function loadChildList(child) {
    if (child.datatable != null) {
        //_datatable_current_page = _datatable_child.fnPagingInfo().iPage;
        child.datatable.fnDestroy(); //删除datatable
    }
    child.columnBindValue = $('[bindcolumn="' + child.columnBind + '"]').val();
    //加载动态表头
    var s = $("#Table_Head_Child_" + child.name);
    s.find('tr').remove();
    var tr = $("<tr/>");
    var str = '<th class="unsortable" style="width:20px;"><input id="Checkbox_All_Child" type="checkbox" /></th>';
    var width_max=60;
    for (var j = 0; j < child.datagridHead.length; j++) {
        str = str + '<th class="thDatagridColumn" style="width:' + child.datagridHead[j].width + 'px;">' + child.datagridHead[j].caption + '</th>';
        width_max=width_max+parseInt(child.datagridHead[j].width);
    }
    str = str + '<th class="unsortable" style="width:40px;">操作</th>';
    tr.html(str);
    s.append(tr);

    //加载动态表体
    var s = $("#Table_Body_Child_" + child.name);
    s.find('tr').remove();

    var data = {};
    data.sessionid = request("SessionId");
    data.datagridId = child.datagridId;
    data.constr = "";
    if (child.datagridParams.length > 0) {
        for (var i = 0; i < child.datagridParams.length; i++) {
            if (child.datagridParams[i].Name == child.foreignKey) {
                child.datagridParams[i].value = child.columnBindValue;
            }
            data[child.datagridParams[i].Name] = child.datagridParams[i].value;
        }
    }
    data.action = "LOAD_ORDER";
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
                        tr.addClass("odd");
                    }

                    var str = '<td><input type="checkbox" name="checkChild" value="' + record.id + '" /></td>';

                    /*******************************************************************/
                    //动态读取列表字段
                    for (var j = 0; j < child.datagridHead.length; j++) {
                        if (child.datagridHead[j].valueType == "System.DateTime") {
                            //处理日期格式
                            str = str + '<td>' + record[_arr_datagrid[j].mappingName].replace(" 00:00:00.0", "") + '</td>';
                        } else if (child.datagridHead[j].valueType == "System.Boolean") {
                            //布尔类型
                            if (record[child.datagridHead[j].mappingName] == "true") {
                                str = str + '<td>√</td>';
                            } else {
                                str = str + '<td></td>';
                            }
                        } else if (child.datagridHead[j].columnType == "4") {
                            //图片
                            var src = getImageSrcById(record[child.datagridHead[j].mappingName]);
                            if (src != '') {
                                str = str + '<td><a href="' + src + '" class="galleryA"><img src="' + src + '" class="imgDatagrid" /></a></td>';
                            } else {
                                str = str + '<td></td>';
                            }
                        } else {
                            str = str + '<td>' + record[child.datagridHead[j].mappingName] + '</td>';
                        }
                    }
                    /*******************************************************************/

                    str = str + '<td><div class="btnDatagrid toolbarEdit btnChildEdit" title="修改" id="' + record.id + '" childname="' + child.name + '"></div></td>';

                    tr.html(str);
                    s.append(tr);
                }

                $(".galleryA").colorbox({ rel: 'galleryA' });

                //事件--点击修改按钮
                $(".btnChildEdit").click(btnChildEdit);

                //全选按钮变回空
                $("#Checkbox_All_Child").prop("checked", false);

                //加载datatalbe
                child.datatable = $("#Table_Datagrid_Child_"+child.name).dataTable({
                    sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                	, bFilter: true                //开关，是否启用客户端过滤功能,true or false, default true
                	, bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                	, bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                	, aoColumnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                	, aaSorting: [1, 'asc'] 	    //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
                	, sScrollX: true    //是否开启水平滚动，以及指定滚动区域大小,可设值
                    , aLengthMenu: [5]
                    //, sScrollY: "220px" //是否开启垂直滚动，以及指定滚动区域大小,可设值
                    //, bPaginate: false //开关，是否显示分页器
                });
                child.datatable.fnPageChange(0);
                //$("#Table_Datagrid_Child_"+child.name).parent().parent().css("overflow-x","auto");
                //if(width_max>630){
                    //$("#Table_Datagrid_Child_"+child.name).parent().css("width",width_max+"px");
                    //$("#Table_Datagrid_Child_"+child.name).parent().prev().css("width",width_max+"px");
                //}
                
                //$("#left").height($("#header").height() + $("#main").height() + 70);
                //$(".divDatagrid").width($("#Table_Datagrid").width() + 7);
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

    var label,item;
    var xMax = 0;       //最右面控件的X
    var width1 = 60;    //Label宽度
    var width2 = 140;   //控件宽度
    var width3 = 5;     //Label与控件间间距
    var width0 = width1 + width2 + width3 + 14; //每一段的总宽度
    var height0 = 21;   //控件高度
    var height1 = 5;    //控件行距

    var data = {};
    data.sessionid = request("SessionId");
    data.orderId = orderId;
    data.action = "LOAD_ORDER_CONDITION";
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
                            item.attr("fieldname", record.columnName);
                            item.attr("conditionType", record.conditionType);
                            item.attr("datagridParamName", record.datagridParamName);
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
                            item.attr("fieldname", record.columnName);
                            item.attr("conditionType", record.conditionType);
                            item.attr("datagridParamName", record.datagridParamName);

                            loadComboboxOption(item, record.params);

                            s.append(item);
                            item.combobox();

                            if (item.attr("defaultindex")) {
                                item[0].selectedIndex = item.attr("defaultindex");
                            } else {
                                item[0].selectedIndex = -1;
                            }
                            item.change(itemChange);
                            item.trigger("change");

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

//****************************************************
//工具栏-新建
function toolAdd() {
    $('#form1').cleanData(true,_form_main);
    $("#Btn_SaveNew").css("display", "");

    for (var i = 0; i < _arr_child.length; i++) {
        loadChildList(_arr_child[i]);
    }

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

//工具栏-审核
function toolCheck() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        $('#form1').checkData('CHECK_DATA', c_id, 1, request("orderId"));
        loadList();

    } else {
        alert("没有选定任何行");
    }
}

//工具栏-反审
function toolUnCheck() {
    if ($("input[name='check1']:checked").length > 0) {
        var c_id = "";
        $("input[name='check1']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        $('#form1').checkData('CHECK_DATA', c_id, 0, request("orderId"));
        loadList();

    } else {
        alert("没有选定任何行");
    }
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
    data.datagridId = _datagrid_id;
    data.isAll = true;
    data.action = "LOAD_DATAGRID_DETAIL";
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
    loadList();
    _datatable.fnPageChange(0);
}
//工具栏-导出
function toolOutport() {
	$("#Div_ExcelOutport").dialog("option", { modal: false }).dialog("open");
	
}
//工具栏-导出
function toolInport() {
	$("#Div_ExcelInport").dialog("option", { modal: false }).dialog("open");
	
}
//****************************************************
//按钮-搜索
function btnSearch() {
    loadList();
    //$(".filterText").each(function () {
    //    if ($(this).val() != "" && $(this).val() != null) _constr = _constr + $(this).attr("fieldname") + "=" + $(this).val() + ";";
    //    loadList();
    //});
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

//按钮-关闭
function btnClose() {
    $(".imgSelector").ImgSelector("closeDialog");
    $(".textboxAdvance").TextboxAdvance("closeDialog");
    $("#Div_Form").dialog("close");
}

//按钮-修改
function btnEdit() {
    $('#form1').fillData($(this).attr("id"), 'FILL_DATA');
    for (var i = 0; i < _arr_child.length; i++) {
        loadChildList(_arr_child[i]);
        $('#Form_Child_' + _arr_child[i].name).attr("foreignValue", $(this).attr("id"));
    }
    
    $("#Btn_SaveNew").css("display", "none");
    $("#Div_Form").dialog("option", { modal: false }).dialog("open");
}

//按钮-全选
function checkAll() {
    var isChecked = $(this).prop("checked");
    $("input[name='check1']").prop("checked", isChecked);
}

//按钮-保存并新增
function btnSaveNew() {
    if ($('#form1').validate()) {
        $('#form1').saveData(saveSuccess, saveError,_form_main);
        $('#form1').cleanData(false,_form_main);
    }
}

//按钮-确定
function btnSubmit() {
    if ($('#form1').validate()) {
        $('#form1').saveData(saveSuccess, saveError,_form_main);
        btnClose();
    }
}
//按钮-Excel导出关闭
function btnCloseExcelOutport() {
    $("#Div_ExcelOutport").dialog("close");
}
//按钮-Excel导出确定
function btnSubmitExcelOutport() {
	var data={};
	data.sessionid = request("SessionId");
	data.orderId=_form_main.orderId;
	data.constr=_constr;
    data.action = "OUTPORT_EXCEL";
    $(".outport_field").each(function(){
    	data[$(this).attr("columnName")]=$(this).val();
    });
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
            	window.open(response.url,"_blank");
            	$("#Div_ExcelOutport").dialog("close");
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}
//按钮-Excel导入关闭
function btnCloseExcelInport() {
    $("#Div_ExcelInport").dialog("close");
}
//按钮-Excel导出确定
function btnSubmitExcelInport() {
	
	var data = {};
    data.sessionid = request("SessionId");
    data.action = "IMPORT_EXCEL_CHECK";
    data.excelId=_excelId;
    data.fileId=fileIds[0];
    $(".inport_field").each(function(){
    	data[$(this).attr("columnName")]=$(this).val();
    });
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.result!=null && response.result == "True") {
            	var b=false;
            	if(confirm("继续导入将覆盖部分数据，是否继续导入？")){
            		b=true;
            	}
            	
            } else {
                b=true;
            }
            if(b){
            	var data = {};
                data.sessionid = request("SessionId");
                data.action = "IMPORT_EXCEL";
                data.excelId=_excelId;
                data.fileId=fileIds[0];
                $(".inport_field").each(function(){
                	data[$(this).attr("columnName")]=$(this).val();
                });
                $.ajax({
                    type: "POST",
                    url: GET_DATA,
                    data: data,
                    dataType: 'json',
                    async: false,
                    success: function (response, status, xhr) {
                        if (response.status == "SUCCESS") {
                            alert("导入成功");
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}
//执行保存后返回效果
function saveSuccess() {
    loadList();
}
function saveError(errorMessage) {
    alert(errorMessage);
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

        if (arr_item.length>0) {
            var data = {};
            data.sessionid = request("SessionId");
            data.arrItem = arr_item;
            data.action = "SAVE_DATAGRID_DETAIL";
            $.ajax({
                type: "POST",
                url: GET_DATA,
                data: data,
                dataType: 'json',
                async: false,
                success: function (response, status, xhr) {
                    if (response.status == "SUCCESS") {
                        initDatagrid();
                        loadList();
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

//****************************************************
//【子单据】工具栏-新建
function toolChildAdd() {
    if ($("#Hidden_Id").attr("value") != "0") {
        var childname = $(this).attr("childname");
        $('#Form_Child_' + childname).cleanData();
        $('#Div_Form_Child_' + childname).dialog("option", { modal: false }).dialog("open");
    }
}

//【子单据】工具栏-修改
function toolChildEdit() {
    var childname = $(this).attr("childname");

    if ($("input[name='checkChild']:checked").length == 0) {
        alert("没有选定任何行");

    } else if ($("input[name='checkChild']:checked").length == 1) {
        //选定了一行，执行修改动作
        $('#Form_Child_' + childname).fillData($("input[name='checkChild']:checked").val(), 'FILL_DATA');
        $('#Div_Form_Child_' + childname).dialog("option", { modal: false }).dialog("open");

    } else {
        alert("选定多于一行");
    }
}

//【子单据】工具栏-删除
function toolChildDelete() {
    var childname = $(this).attr("childname");
    var listNO = parseInt($(this).attr("listNo"));

    if ($("input[name='checkChild']:checked").length > 0) {
        var c_id = "";
        $("input[name='checkChild']:checked").each(function () {
            c_id = c_id + $(this).val() + ",";
        });
        if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }

        $('#Form_Child_' + childname).deleteData('DELETE_DATA', c_id);
        loadChildList(_arr_child[listNO]);

    } else {
        alert("没有选定任何行");
    }
}

//【子单据】按钮-修改
function btnChildEdit() {
    var childname = $(this).attr("childname");

    $('#Form_Child_' + childname).fillData($(this).attr("id"), 'FILL_DATA');
    $('#Div_Form_Child_' + childname).dialog("option", { modal: false }).dialog("open");
}

//【子单据】按钮-取消
function btnChildCancel() {
    var childname = $(this).attr("childname");

    $(".imgSelector").ImgSelector("closeDialog");
    $(".textboxAdvance").TextboxAdvance("closeDialog");
    $('#Div_Form_Child_' + childname).dialog("close");
}

//【子单据】按钮-确定
function btnChildSubmit() {
    var childname = $(this).attr("childname");
    var listNO = parseInt($(this).attr("listNo"));

    if ($('#Form_Child_' + childname).validate()) {
        $('#Form_Child_' + childname).saveData(saveChildSuccess, saveError);
        loadChildList(_arr_child[listNO]);

        //关闭
        $(".imgSelector").ImgSelector("closeDialog");
        $(".textboxAdvance").TextboxAdvance("closeDialog");
        $('#Div_Form_Child_' + childname).dialog("close");
    }
}

//执行保存后返回效果
function saveChildSuccess() {
}

//全局监视值改变
function itemChange(e) {
	var sender=$(e.target);
	//if (record.formula != "") item.attr("formula", record.formula);                                     //公式
    //if (record.formulaEvent != "") item.attr("formulaEvent", record.formulaEvent); 
    //if (record.formulaListenControl != "") item.attr("formulaListenControl", record.formulaListenControl); 
	
	var form=sender.data("form");
	if(form!=null){
		for(var i=0;i<form.items.length;i++){
			var item=form.items[i];
			if(item.attr("formulaEvent")!=""){
				var formulaEvent=parseInt(item.attr("formulaEvent"));
				if((formulaEvent & 64)>0){
					var formulaListenControl=item.attr("formulaListenControl");
					if(formulaListenControl!=null && formulaListenControl!=""){
						var handleItemNames=formulaListenControl.split(";");
						for(var j=0;j<handleItemNames.length;j++){
							if(handleItemNames[j]!="" && handleItemNames[j]==sender.attr("itemname")){
								//此时执行item的公式
								var formula=item.attr("formula");
								var result=getFormula(formula,form);
								//alert(result);
								if(result=='REFRESH_DATASOURCE'){
									//执行刷新数据源
									var params=createDataSourceParams(item);
									//item.data("params",record.params);
									loadComboboxOption(item, item.data("params"), null ,params);
									item.val("");
									item.trigger("change");
									//item.combobox("refreshDataSource");
								}else{
									item.val(result);
								}
							}
						}
					}
					
				}
			}
		}
	}
}
function createDataSourceParams(item_handle){
	var result=[];
	var formulaListenControl=item_handle.attr("formulaListenControl");
	var listenItemNames=formulaListenControl.split(";");
	var form=item_handle.data("form");
	for(var i=0;i<form.items.length;i++){
		var itemname=form.items[i].attr("itemName");
		if(itemname!='' && listenItemNames.indexOf(itemname)>=0){
			var param={};
			param.name=itemname;
			param.value=form.items[i].val();
			result.push(param);
		}
	}
	return result;
	
}