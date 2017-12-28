var _datatable = null;
var _datatable_current_page = 0;
var _constr = "";
var _edit_roleId = 0;
var _str_spanRoleRight = '<span class="spanRoleRight spanRoleRight1"></span>';

function loadDoucument() {
    loadList();
    loadRoleMenu();

    $("#Div_FormMain").tabs();

    $("#Div_Form").dialog({
        autoOpen: false,
        title: '编辑角色',
        modal: true,
        width: "480",
        resizable: false    //是否可以调整对话框的大小，默认为 true
    });

    //工具栏-列表
    $("#Tool_Add").click(toolAdd);
    $("#Tool_Edit").click(toolEdit);
    $("#Tool_Delete").click(toolDelete);
    $("#Tool_Stop").click(toolStop);
    $("#Tool_Remove").click(toolRemove);
    $("#Tool_Refresh").click(toolRefresh);

    //按钮-主窗体
    $("#Btn_Search").click(btnSearch);
    $("#Btn_Clean").click(btnClean);

    //****************************************************
    $('#form1').validateOnBlur();
    $('#form1').attr('action', 'SAVE_SYS_ROLE');

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

    $("#Btn_Close").click(btnClose);
    $("#Btn_Cancel").click(btnClose);
    $("#Checkbox_All").click(checkAll);
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
    data.action = "LOAD_SYS_ROLE";
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
                    str = str + '<td>' + record.code + '</td>';
                    str = str + '<td>' + record.name + '</td>';
                    str = str + '<td>' + record.remark + '</td>';
                    if (record.isStop == "true") {
                        str = str + '<td>√</td>';
                    } else {
                        str = str + '<td></td>';
                    }
                    str = str + '<td><div class="btnDatagrid toolbarEdit btnEdit" title="修改" id="' + record.id + '"></div></td>';

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
                	, aaSorting: [] 	                //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
                });
                _datatable.fnPageChange(_datatable_current_page);
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
    $('#form1').cleanData();
    $("#Btn_SaveNew").css("display", "");
    $("#Div_Form").dialog("option", { modal: false }).dialog("open");
    loadRoleMenuRight();
}

//工具栏-修改
function toolEdit() {
    if ($("input[name='check1']:checked").length == 0) {
        alert("没有选定任何行");

    } else if ($("input[name='check1']:checked").length == 1) {
        //选定了一行，执行修改动作
        _edit_roleId = $("input[name='check1']:checked").val();
        editData();
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

//按钮-关闭
function btnClose() {
    $("#Div_Form").dialog("close");
}

//按钮-修改
function btnEdit() {
    _edit_roleId = $(this).attr("id");
    editData();
}
function editData() {
    $('#form1').fillData(_edit_roleId, 'FILL_DATA');
    $("#Btn_SaveNew").css("display", "none");
    $("#Div_Form").dialog("option", { modal: false }).dialog("open");
    loadRoleMenuRight();
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

//****************************************************
//按钮-搜索
function btnSearch() {
    _constr = "";

    if ($("#TextFilter_Code").val() != "" && $("#TextFilter_Code").val() != null) _constr = _constr + " AND " + $("#TextFilter_Code").attr("fieldname") + " LIKE '%" + $("#TextFilter_Code").val() + "%'";
    if ($("#TextFilter_Name").val() != "" && $("#TextFilter_Name").val() != null) _constr = _constr + " AND " + $("#TextFilter_Name").attr("fieldname") + " LIKE '%" + $("#TextFilter_Name").val() + "%'";

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


//加载角色菜单
function loadRoleMenu() {
    var s = $("#Tbody_RoleRight");
    s.find('tr').remove();

    var data = {};
    data.sessionid = request("SessionId");
    data.action = "LOAD_SYS_MENU"
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {

                var tr, record, str;
                var parentId=0;
                for (var i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];

                    tr = $("<tr/>");
                    if (i%2 != 0) tr.addClass("trRoleRight1");
                    var td_css="";
                    if (record.step == 1) {
                        str = '<td class="tdRoleRight1 tdRoleParentMenuHead" menuid="' + record.id + '" style="font-weight:bold;" title="点击全选主菜单及其子菜单">' + record.text + '</td>';
                        td_css = "tdRoleRightColumnHead";
                        parentId=record.id;
                    } else {
                        str = '<td class="tdRoleRight1 tdRoleSubMenuHead" menuid="' + record.id + '" title="点击整行全选">' + record.text + '</td>';
                        td_css='tdRoleRightCell';
                    }
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isBrowse" right="isBrowse" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id +' tdRoleMenuParent' + parentId +'"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isAdd" right="isAdd" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isEdit" right="isEdit" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isDelete" right="isDelete" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isStop" right="isStop" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isRemove" right="isRemove" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isSetting" right="isSetting" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isPrint" right="isPrint" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    str = str + '<td id="Td_RoleRight_' + record.id + '_isExcel" right="isExcel" isSelected=0 menuid="' + record.id + '" class="' + td_css + ' tdRoleMenu' + record.id + ' tdRoleMenuParent' + parentId + '"></td>';
                    tr.html(str);
                    s.append(tr);
                }
                $(".tdRoleRightCell").click(tdRoleRightCell_Click);
                $(".tdRoleSubMenuHead").click(tdRoleSubMenuHead_Click);
                //$(".tdRoleRightColumnHead").click(tdRoleRightColumnHead_Click);
                $(".tdRoleParentMenuHead").click(tdRoleParentMenuHead_Click);
                //loadRoleMenuRight();
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}
//加载权限表
function loadRoleMenuRight() {
    $(".tdRoleRightCell").html("").attr("isSelected", "0");
    $(".tdRoleRightColumnHead").html("").attr("isSelected", "0");

	var data = {};
    data.sessionid = request("SessionId");
    data.roleId=parseInt($("#Hidden_Id").val());
    data.action = "LOAD_SYS_ROLE_RIGHT";
    if(data.roleId==0){
    	return;
    }
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {

                var tr, record, str;
                var parentId=0;
                for (var i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];
                    
                    if(record.isBrowse=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isBrowse").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isBrowse").attr("isSelected","0").html("");
                    }
                    if(record.isAdd=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isAdd").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isAdd").attr("isSelected","0").html("");
                    }
                    if(record.isEdit=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isEdit").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isEdit").attr("isSelected","0").html("");
                    }
                    if(record.isDelete=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isDelete").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isDelete").attr("isSelected","0").html("");
                    }
                    if(record.isStop=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isStop").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isStop").attr("isSelected","0").html("");
                    }
                    if(record.isRemove=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isRemove").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isRemove").attr("isSelected","0").html("");
                    }
                    if(record.isSetting=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isSetting").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isSetting").attr("isSelected","0").html("");
                    }
                    if(record.isPrint=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isPrint").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isPrint").attr("isSelected","0").html("");
                    }
                    if(record.isExcel=="true"){
                    	$("#Td_RoleRight_"+record.menuId + "_isExcel").attr("isSelected","1").html(_str_spanRoleRight);
                    }else{
                    	$("#Td_RoleRight_"+record.menuId + "_isExcel").attr("isSelected","0").html("");
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
//点击权限单元格
function tdRoleRightCell_Click(){
	var tag=$(this);
	if(tag.attr("isSelected")=='1'){
		tag.attr("isSelected","0").html("");
	}else{
		tag.attr("isSelected","1").html(_str_spanRoleRight);
	}
	saveRoleMenuRight();
}

//点击权限行头
function tdRoleSubMenuHead_Click(){
	var tag=$(this);
	var menuid=tag.attr("menuid");
	var isSelected=1;
	$(".tdRoleMenu"+menuid).each(function(){
		if($(this).attr("isSelected")!='1'){
			isSelected=0;
		}
	});
	if(isSelected==1){
		$(".tdRoleMenu"+menuid).attr("isSelected","0").html("");
	}else{
		$(".tdRoleMenu"+menuid).attr("isSelected","1").html(_str_spanRoleRight);
	}
	saveRoleMenuRight();
}
//点击权限一级菜单
function tdRoleParentMenuHead_Click(){
	var tag=$(this);
	var menuid=tag.attr("menuid");
	var isSelected=1;
	$(".tdRoleMenuParent"+menuid).each(function(){
		if($(this).attr("isSelected")!='1'){
			isSelected=0;
		}
	});
	if(isSelected==1){
		$(".tdRoleMenuParent"+menuid).attr("isSelected","0").html("");
	}else{
		$(".tdRoleMenuParent"+menuid).attr("isSelected","1").html(_str_spanRoleRight);
	}
	saveRoleMenuRight();
}

//保存角色权限
function saveRoleMenuRight(){
	var data={};
	data.rows=[];
	data.sessionid = request("SessionId");
	data.roleId=parseInt($("#Hidden_Id").val());
	data.action = "SAVE_SYS_ROLE_RIGHT";
	var count = $(".tdRoleRight1").length;
	for(var i=0;i<count;i++){
	    var head = $(".tdRoleRight1")[i];
		var menuid=$(head).attr("menuid");
		var hasdata=false;
		var row={};
		row.menuId=menuid;
		$(".tdRoleMenu"+menuid).each(function(){
			var tag=$(this);
			if(tag.attr("isSelected")=='1'){
				hasdata=true;
			}
			row[tag.attr("right")]=tag.attr("isSelected");
		});
		if(hasdata){
			data.rows.push(row);
		}
	}
	
	$.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status != "SUCCESS") {
            	alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}