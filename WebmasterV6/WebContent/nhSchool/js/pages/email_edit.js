
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
    $("#Text_sysUserIdsReceive").TextboxMenu({
        SessionId: request("SessionId"),
        DataGridId: 8,
        ValueColumn: "sysUserId",
        TextColumn: "name",
        Width: 630,
        Height: 28,
        IsMult: true,
    });

    $("#Textarea_Conttent").cleditor({
        width: 662,
        height: 300,
        left: 90,
        top: 90,
        position: "absolute",
        controls: "bold italic underline strikethrough | font size " +
                  "style | color highlight removeformat | bullets numbering | " +
                  "alignleft center alignright justify | undo redo | " +
                  "imgSelector link unlink | source"
    });

    $(".plupload").Plupload({
    	
    	onUploadComplete:function(){
    		if($("#Checkbox_AutoSend")[0].checked){
    			//alert("ok1");
    			$("#Btn_Submit").trigger("click");
    		}
    		
    	}
    });

    //$("#left").height($("#header").height() + $("#main").height() + 70);
}

//执行保存后返回效果
function saveSuccess() {
    alert("已发送");
    location = "email.html?menuRootId=" + request("menuRootId") + "&tips=send&SessionId=" + request("SessionId");
}
function saveError(errorMessage) {
    alert(errorMessage);
}

//执行存草稿后返回效果
function saveSuccess2() {
    alert("已保存");
    location = "email.html?menuRootId=" + request("menuRootId") + "&tips=draft&SessionId=" + request("SessionId");
}
