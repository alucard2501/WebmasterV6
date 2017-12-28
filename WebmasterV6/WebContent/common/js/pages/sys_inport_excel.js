var uploader=null;
var excelId=0;
var fileIds=[];

function loadDoucument() {
    loadComboboxOption();
    $("#Select_Excel").combobox().on("change",function(){
    	var record=$($(this).find("option")[this.selectedIndex]).data("record");
    	$("#ADownload").attr("href","../../../poly/excel/inport/" + record.path);
    	excelId=$(this).val();
    	$("#Input_PlUpload").Plupload("setExcelId",excelId);
    });

    uploader=$("#Input_PlUpload").Plupload({
        FileTypeId: 2,
        IsExcelImport: true,
        ExcelId: 2,
        onUploadComplete: function (files,ids) {
        	fileIds=ids;
        	//alert("ok");
        }
    });


    $("#Btn_Submit").click(btnSubmit);
}

//加载上级Combobox列表
function loadComboboxOption() {
    var s = $("#Select_Excel");
    s.empty();

    var data = {};
    data.sessionid = request("SessionId");
    data.action = "LOAD_SYS_INPORT_EXCEL";
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
                    option.data("record",record);
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

    s[0].selectedIndex = 0;
}

//按钮-确定
function btnSubmit() {
	for(var i=0;i<fileIds.length;i++){
		var data = {};
	    data.sessionid = request("SessionId");
	    data.action = "IMPORT_EXCEL";
	    data.excelId=excelId;
	    data.fileId=fileIds[i];
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
}
