var cur_deptid=0;
var _is_click_icon=false;
$(document).ready(function () {
    init();

    if (request("fromId")) {
        $('#form1').attr('tablename', 't_email');
        $('#form1').fillData(request("fromId"), 'FILL_DATA');
    }

    $('#form1').validateOnBlur();

    $("#Btn_Save").click(function () {
        $('#form1').attr('action', 'NHSCHOOL_SAVE_EMAIL');
        $('#form1').saveData(saveSuccess2, saveError);
    });

    $("#Btn_Submit").click(function () {
        $('#form1').attr('action', 'NHSCHOOL_SEND_EMAIL');
        if ($('#form1').validate()) {
            $('#form1').saveData(saveSuccess, saveError);
        }
    });
    
});

//初始化
function init() {
//    $("#Text_sysUserIdsReceive").TextboxMenu({
//        SessionId: request("SessionId"),
//        DataGridId: 8,
//        ValueColumn: "sysUserId",
//        TextColumn: "name",
//        Width: 630,
//        Height: 28,
//        IsMult: true,
//    });

    
    //$("#left").height($("#header").height() + $("#main").height() + 70);
    $("#Btn_AddDepartCustom").click(function(){
    	var name = prompt("请输入分组名称:","");
    	if(name.length>0){
    		addDepartmentCustom(name);
    	}
    });
    $("#Btn_AddUsers").ButtonMenu({
        SessionId: request("SessionId"),
        DataGridId: 8,
        ValueColumn: "sysUserId",
        TextColumn: "name",
        Width: 630,
        Height: 28,
        IsMult: true,
        onSubmit:function(ids,element){
        	//alert(ids);
        	addUserDepartmentCustom(ids);
        }
    });
    $("#selectable_department").selectable({
    	  cancel:'div',
    	  selected:function( event, ui ) {
    		  loadDepartUsers($(ui.selected).attr("dataId"));
    	  }
    });
    loadDepartmentCustom();
}
function loadDepartmentCustom(){
	var data = {};
    data.sessionid = request("SessionId");
    data.action = "NHSCHOOL_LOAD_DEPARTMENT_CUSTOM";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
        	
            if (response.status == "SUCCESS") {
            	var s=$("#selectable_department");
//            	<li class="ui-widget-content">Item 1<div class="ui-icon ui-icon-close icon_delete"></div></li>
//				  <li class="ui-widget-content">Item 2</li>
//				  <li class="ui-widget-content">Item 3</li>
//				  <li class="ui-widget-content">Item 4</li>
//				  <li class="ui-widget-content">Item 5</li>
//				  <li class="ui-widget-content">Item 6</li>
//				  <li class="ui-widget-content">Item 7</li>
            	s.empty();

                for (var i = 1; i <= response.records.length; i++) {
                    var record = response.records[i - 1];
                    var li = $('<li class="ui-widget-content" dataId="' + record.id + '">' + record.name + '<div dataId="' + record.id + '" class="ui-icon ui-icon-close icon_delete btn_delete_demparment"></div><div dataId="' + record.id + '" class="ui-icon ui-icon-pencil icon_delete btn_edit_demparment"></div></li>');
                    s.append(li);
                    li.mouseup(function(){
                    	if(!_is_click_icon){
                        	$(".selectable li").removeClass("ui-selected");
                        	$(this).addClass("ui-selected");
                        	loadDepartUsers($(this).attr("dataId"));
                    	}
                    });
                }
                $(".btn_delete_demparment").click(function(){
                	_is_click_icon=false;
                	deleteDepartmentCustom($(this).attr("dataId"));
                }).mousedown(function(){
                	_is_click_icon=true;
                });
                $(".btn_edit_demparment").click(function(){
                	_is_click_icon=false;
                	var name = prompt("请输入分组名称:","");
                	if(name.length>0){
                		editDepartmentCustom(name,$(this).attr("dataId"));
                	}
                	
                }).mousedown(function(){
                	_is_click_icon=true;
                });
                //$("#selectable_department").selectable();
                //$("#selectable_department" ).selectable( "refresh" );
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}
function loadDepartUsers(depId){
	cur_deptid=depId;
	var s = $("#selectable_user");
    s.empty();

    var data = {};
    data.sessionid = request("SessionId");
    data.table = "t_employee";
    data.constr = " AND sysUserId<>0 AND find_in_set('" + depId + "',departmentId)";
    data.orderstr = "ORDER BY name ASC";
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

                    var li = $('<li class="ui-widget-content" userId="' + record.sysUserId + '">' + record.name + '<div dataId="' + record.sysUserId + '" class="ui-icon ui-icon-close icon_delete btn_delete_user"></div></li>');
                    //li.html('<a class="custom-TextboxMenu-liMenuRight1" userId="' + record.sysUserId + '">' + record.name + '</a>');
                    s.append(li);
                }
                $(".btn_delete_user").click(function(){
                	_is_click_icon=false;
                	deleteUserDepartmentCustom($(this).attr("dataId"));
                }).mousedown(function(){
                	_is_click_icon=true;
                });
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}
function addDepartmentCustom(name){
	var data = {};
    data.sessionid = request("SessionId");
    data.action = "NHSCHOOL_SAVE_DEPARTMENT_CUSTOM";
    data.id=0;
    data.name=name;
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
        	
            if (response.status == "SUCCESS") {
            	loadDepartmentCustom();
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
	
}
function addUserDepartmentCustom(ids){
	if(cur_deptid==0)return;
	var data = {};
    data.sessionid = request("SessionId");
    data.action = "NHSCHOOL_ADD_USER_DEPARTMENT_CUSTOM";
    data.ids=ids;
    data.departmentId=cur_deptid;
    data.name=name;
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
        	
            if (response.status == "SUCCESS") {
            	loadDepartUsers(cur_deptid);
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}
function deleteUserDepartmentCustom(userId){
	if(!confirm("确定要删除所选数据？"))return;
	if(cur_deptid==0)return;
	var data = {};
    data.sessionid = request("SessionId");
    data.action = "NHSCHOOL_DELETE_USER_DEPARTMENT_CUSTOM";
    data.userId=userId;
    data.departmentId=cur_deptid;
    data.name=name;
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
        	
            if (response.status == "SUCCESS") {
            	loadDepartUsers(cur_deptid);
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}
function deleteDepartmentCustom(id){
	if(confirm("确定要删除所选数据？")){
		var data = {};
	    data.sessionid = request("SessionId");
	    data.action = "NHSCHOOL_DELETE_DEPARTMENT_CUSTOM";
	    data.id=id;
	    $.ajax({
	        type: "POST",
	        url: GET_DATA,
	        data: data,
	        dataType: 'json',
	        async: false,
	        success: function (response, status, xhr) {
	        	
	            if (response.status == "SUCCESS") {
	            	loadDepartmentCustom();
	            } else {
	                alert(response.errorMessage);
	            }
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            alert(XMLHttpRequest);
	        }
	    });
	}
}
function editDepartmentCustom(name,id){
	var data = {};
    data.sessionid = request("SessionId");
    data.action = "NHSCHOOL_SAVE_DEPARTMENT_CUSTOM";
    data.id=id;
    data.name=name;
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
        	
            if (response.status == "SUCCESS") {
            	loadDepartmentCustom();
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}