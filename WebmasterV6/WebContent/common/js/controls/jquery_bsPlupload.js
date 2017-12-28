(function ($) {
    $.widget("custom.Plupload", {
        _para: {},
        _dialog: null,
        _btn_file: null,
        _ul: null,
        _uploader: null,
        _div:null,
        _create: function () {
            var defaults = {
                Title: "",
                SessionId: "",
                Width: 0,
                Height: 0,
                FileTypeId: 1,
                IsExcelImport:false,
                ExcelId:0,
                /* 提供给外部的接口方法 */
                onSubmit: function (ids, element, textarea) { },               // 确定
                onDelete: function (indexof, element, textarea) { },           // 删除
                onUploadComplete: function (files,ids) { }, 				   // 上传完成
            };
            this._para = $.extend(defaults, this.options);
            this.element.css("display", "none");
            PLUPLOAD_PARAMS.element = this.element;
            this.element.change(function () {
                //_dialog._para.onChange(_dialog.element, _dialog._textarea);
                if ($(this).val().length == 0) return;
                var temp = $(this).val().split(",");
                for (var i = 0; i < temp.length; i++) {
                    PLUPLOAD_PARAMS._arr_plupload_ids.push(temp[i]);
                }
                PLUPLOAD_PARAMS.divPluploadRefresh();
                //PLUPLOAD_PARAMS._arr_plupload_ids.push(info.response);
                //alert($(this).val());
            });
            this._div = $('<div id="DivPlupload" style="overflow:hidden"></div>').insertAfter(this.element);
            this._btn_file = $('<input id="Btn_File" type="button" class="btnMiddle btnGreen" value="添加附件" fileid="" />').appendTo(this._div);
            this._ul = $('<ul class="ulPlupload"></ul>').appendTo(this._div);
            this._dialog = $('<div id="Div_File" />').appendTo(this._div);
            var _dialog = this._dialog;
            var _ul = this._ul;
            _dialog._para = this._para;
            _dialog.element = this.element;
            _dialog._uploader = null;
            
            
            this._dialog.btnFileClick = function () {
                if (_dialog._uploader) {
                    _dialog._uploader.destroy();
                    _dialog._uploader = null;
                    _dialog.initUploader();
                } else {
                    _dialog.initUploader();
                }
                _dialog.dialog("option", { modal: false }).dialog("open");
            };
            this._dialog.btnFileCancel = function () {
                _dialog.dialog("close");
            };
            this._dialog.initUploader = function () {
            	var mime_type=[];
            	if(_dialog._para.IsExcelImport){
            		mime_type.push({ title: "Excel文件", extensions: "xls,xlsx" });
            	}else{
            		mime_type.push({ title: "图片类", extensions: "jpg,gif,png,tiff" });
            		mime_type.push({ title: "网页类", extensions: "htm,html" });
            		mime_type.push({ title: "文本类及Microsoft Office组件类", extensions: "doc,docx,pdf,ppt,pptx,txt,rtf,vcf,xls,xlsx" });
            		mime_type.push({ title: "压缩类", extensions: "zip,rar" });
            	}
               $("#Div_FileUpload").pluploadQueue({
                    runtimes: 'html5,flash,silverlight,html4',
                    url: '../../plupload?sessionid=' + request("SessionId") + '&fileTypeId=' + _dialog._para.FileTypeId + '&isexcel=' + ((_dialog._para.IsExcelImport) ? 1 : 0) + '&excelId=' + _dialog._para.ExcelId,
                    chunk_size: '1mb',
                    rename: true,
                    dragdrop: true,
                    multiple_queues: true,
                    filters: {
                        max_file_size: '100mb',
                        mime_types: mime_type
                    },
                    flash_swf_url: '../images/jquery_plupload/Moxie.swf',
                    silverlight_xap_url: '../images/jquery_plupload/Moxie.xap',
                    init: {
                        FileUploaded: function (up, file, info) {
                            // Called when file has finished uploading
                            // log('[FileUploaded] File:', file, "Info:", info);
                            PLUPLOAD_PARAMS._arr_plupload_ids.push(info.response);
                            PLUPLOAD_PARAMS.divPluploadRefresh();
                        },
                        UploadComplete: function (up, files) {
                            // Called when all files are either uploaded or failed
                            //log('[UploadComplete]');
                            _dialog._uploader= up;
                            _dialog._para.onUploadComplete(files,PLUPLOAD_PARAMS._arr_plupload_ids);
                            //alert("complete");
                        },
                        Error: function (up, args) {
                            // Called when error occurs
                            //log('[Error] ', args);
                            alert(args);
                        }
                    }
                });
            };
            this._createHtml();

        },
        _createHtml: function () {
            var html = '';
            html += '<div id="Div_FileUpload">';
            html += '   <p>Your browser doesn\'t have Flash, Silverlight or HTML5 support.</p>';
            html += '</div>';
            html += '<div class="divFormButton">';
            html += '   <div class="divFormButtonRight">';
            html += '       <input id="Btn_FileCancel" type="button" class="btnMiddle btnGray" value="关 闭" />';
            html += '   </div>';
            html += '</div>';
            var dialog1 = this._dialog;
            this._dialog.html(html).dialog({
                autoOpen: false,
                title: '添加附件',
                modal: true,
                width: 500,
                z_index: 200,
                resizable: false,    //是否可以调整对话框的大小，默认为 true
                close: function (event, ui) {
                    PLUPLOAD_PARAMS.divPluploadRefresh();
                }
            });
           
            this._btn_file.click(this._dialog.btnFileClick);
            this._dialog.find("#Btn_FileCancel").click(this._dialog.btnFileCancel);
            this._ul.find('li').remove();

        },
        closeDialog: function () {
            this._dialog.dialog("close");
        },
        openDialog: function () {
            this._dialog.dialog("option", { modal: false }).dialog("open");
        },
        setExcelId: function (excelId) {
            this._dialog._para.ExcelId=excelId;
        }
    });
})(jQuery);
var PLUPLOAD_PARAMS = {};
PLUPLOAD_PARAMS._arr_plupload_ids = [];
PLUPLOAD_PARAMS.element = null;
//刷新附件队列
PLUPLOAD_PARAMS.divPluploadRefresh = function () {
    var s = $(".ulPlupload");
    var lenLi = s.find('li').length;
    var lenArr = PLUPLOAD_PARAMS._arr_plupload_ids.length;
    var ids = '';
    for (var i = 0; i < lenArr - lenLi; i++) {
        item = $("<li/>");
        item.addClass("liPlupload");
        item.attr("liBtnId", PLUPLOAD_PARAMS._arr_plupload_ids[i + lenLi]);

        var fileInfo = {};
        fileInfo = getFileInfoById(PLUPLOAD_PARAMS._arr_plupload_ids[i + lenLi]);
        item.html('<span class="spanPlupload" path="' + fileInfo.path + '">' + fileInfo.name + '</span><span class="spanPluploadSize" path="' + fileInfo.path + '">(' + bytesToSize(fileInfo.size) + ')</span><div class="btnDelPlupload" btnid="' + PLUPLOAD_PARAMS._arr_plupload_ids[i + lenLi] + '">删除</div>');
        s.append(item);

        item.find(".btnDelPlupload").click(PLUPLOAD_PARAMS.btnDelPlupload_Click);
        item.find(".spanPlupload").click(PLUPLOAD_PARAMS.download_Click);
        item.find(".spanPluploadSize").click(PLUPLOAD_PARAMS.download_Click);
    }
    var l = $(".liPlupload").length;
    var i = 0;
    $(".liPlupload").each(function () {
        ids = ids + $(this).attr("liBtnId")
        if (i < l - 1) {
            ids = ids  + ",";
        }
        i++;
    });
    PLUPLOAD_PARAMS.element.val(ids);
}
//删除一行队列
PLUPLOAD_PARAMS.btnDelPlupload_Click = function () {
    if (confirm("确定删除所选数据？")) {
        var c_id = $(this).attr("btnid");
        var arr = [];
        for (var i = 0; i < PLUPLOAD_PARAMS._arr_plupload_ids.length; i++) {
            if (PLUPLOAD_PARAMS._arr_plupload_ids[i] != c_id) {
                arr.push(PLUPLOAD_PARAMS._arr_plupload_ids[i]);
            }
        }
        PLUPLOAD_PARAMS._arr_plupload_ids = arr;
        $("[liBtnId='" + c_id + "']").remove();
    }
}
//下载文件
PLUPLOAD_PARAMS.download_Click = function () {
    window.open($(this).attr("path"));
}

