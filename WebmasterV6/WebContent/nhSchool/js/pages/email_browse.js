
function loadDoucument(){
    init();
    fillData();
    toolRead();

    $("#Tool_Delete").click(toolDelete);
    $("#Tool_Back").click(toolBack);
    $("#Tool_Next").click(toolNext);
    $("#Tool_Copy").click(toolCopy);
}

//初始化
function init() {
	$("#Div_Preview").dialog({
        autoOpen: false,
        title: 'Preview',
        modal: true,
        width: "600",
        resizable: true    //是否可以调整对话框的大小，默认为 true
    });
    if (request("tips") == "send") {
        //已发送
    } else if (request("tips") == "draft") {
        //草稿箱
    } else {
        //收件箱
        $("#Tool_Delete").css("display", "none");
    }
}

//填充数据
function fillData() {
    var str = "";

    var data = {};
    data.sessionid = request("SessionId");
    data.table = "t_email";
    data.id = request("id");
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
                    str = "<h1>" + record.title + "</h1>";
                    str = str + "<p>发件人：" + getSysUsernameById(record.sysUserIdSend) + "</p>";
                    str = str + "<p>时&nbsp;&nbsp;&nbsp;间：" + record.timeSend.substring(0, 16) + "</p>";

                    if (request("tips") == "send") {
                        //已发送
                        str = str + "<p>收件人：" + getReceive(record.sysUserIdsReceive) + "</p>";
                    } else {
                        str = str + "<p>收件人：" + getSysUsernameById(record.sysUserIdsReceive) + "</p>";
                    }

                    str = str + '<div class="divEmailBrowseContent">' + record.content + '</div>';

                    //附件
                    if (record.fileList != "") {
                        str = str + '<div class="divFilelist">';
                        var arr = [];
                        arr = record.fileList.split(",");
                        for (var i = 0; i < arr.length; i++) {
                            var fileInfo = getFileInfoById(arr[i]);
                            str = str + '<a href="' + fileInfo.path + '" target="_blank" class="aFileList">' + fileInfo.name + '(' + bytesToSize(fileInfo.size) + ')<a/>' +
                            	'&nbsp;<a class="btn_download" href="' + fileInfo.path + '" target="_blank" >download<a/>' ;
                            if(fileInfo.countPreviewPic>0){
                            	str = str +'&nbsp;<a class="btn_preview" onClick="javascript:onPreviewClick(\'' + fileInfo.path + '\',' + fileInfo.countPreviewPic +');">preview<a/></br>';
                            }
                            if(fileInfo.path.endsWith(".mp4") || fileInfo.path.endsWith(".ogg") || fileInfo.path.endsWith(".avi") || fileInfo.path.endsWith(".3gp") || fileInfo.path.endsWith(".mov") || fileInfo.path.endsWith(".wmv")){
                            	str = str +'&nbsp;<a class="btn_preview" onClick="javascript:onPreviewVideoClick(\'' + fileInfo.path + '\');">preview<a/></br>';
                            }
                            str = str + '<br />';	
                            if (fileInfo.extName == "jpg") {
                                str = str + '<a href="' + fileInfo.path + '" target="_blank"><img src="' + fileInfo.path + '" class="imgFileList"/><a/>';
                            }
                        }
                        str = str + '</div>';
                    }
                }

                $("#Div_EmailBrowse").html(str);
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

function onPreviewClick(path,count){
	//alert(path.substring(0,path.lastIndexOf(".")));
	var path_source=path.substring(0,path.lastIndexOf("."));
	$("#Div_Preview .divFormRow").empty();
	var str="";
	for(var i=1;i<=count;i++){
		str=str + '<img src="' + path_source + '_' + i +'.jpg' +'" /><br /><br />';
	}
	$("#Div_Preview .divFormRow").html(str);
	$("#Div_Preview").dialog("option", { modal: false,position: { my: "center", at: "center", of: window  } }).dialog("open");
	//$("#Div_Preview").dialog(,{top:);  
}
function onPreviewVideoClick(path){
	//alert(path.substring(0,path.lastIndexOf(".")));
	var path_source=path.substring(0,path.lastIndexOf("."));
	$("#Div_Preview .divFormRow").empty();
	var str='<video src="' + path + '" width="550" height="400" controls="controls"><br /><br />';
	$("#Div_Preview .divFormRow").html(str);
	$("#Div_Preview").dialog("option", { modal: false,position: { my: "center", at: "center", of: window  } }).dialog("open");
	//$("#Div_Preview").dialog(,{top:);  
}
//工具栏-删除
function toolDelete() {
    if (!confirm('确定删除此数据？')) return;

    var data = {};
    data.action = "DELETE_DATA";
    data.id = request("id");
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

    toolBack();
}

//工具栏-返回
function toolBack() {
    location = "email.html?menuRootId=" + request("menuRootId") + "&tips=" + request("tips") + "&SessionId=" + request("SessionId");
}

//工具栏-下一封未读邮件
function toolNext() {
    var data = {};
    data.sessionid = request("SessionId");
    data.action = "NHSCHOOL_GET_EMAIL_NEXTID";
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
                    location = "email_browse.html?menuRootId=" + request("menuRootId") + "&tips=" + request("tips") + "&SessionId=" + request("SessionId") + "&id=" + record.id;
                } else {
                    alert("已经是最后一封");
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

//工具栏-标记为已读
function toolRead() {
    var data = {};
    data.action = "NHSCHOOL_READ_EMAIL";
    data.id = request("id");
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
}


//工具栏-转发
function toolCopy() {
    location = "email_edit.html?menuRootId=" + request("menuRootId") + "&tips=" + request("tips") + "&SessionId=" + request("SessionId") + "&fromId=" + request("id");
}


//发件箱显示收件人是否已读邮件
function getReceive(ids) {
    var temp = "", strclass = "";
    var arr = ids.split(",");
    for (var i = 0; i < arr.length; i++) {
        var data = {};
        data.sessionid = request("SessionId");
        data.receiveUserid = arr[i];
        data.fromid = request("id");
        data.action = "NHSCHOOL_GET_EMAIL_RECEIVE";
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
                        if (record.isRead=="true") {//已读
                            strclass = "spanEmialBrowseRead";
                        } else {//未读
                            strclass = "spanEmialBrowseUnRead";
                        }

                        if (record.realname == "") {
                            temp = temp + '<span class="' + strclass + '">' + record.username;
                        } else {
                            temp = temp + '<span class="' + strclass + '">' + record.realname;
                        }
                        temp = temp + "</span>";
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