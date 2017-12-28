var BS_FILE_SELECTOR_DIALOG = null;
(function ($) {
    $.widget("custom.FileSelector", {
        _para: {},
        _dialog: null,
        _create: function () {
            var defaults = {
                IsMult: false,   //是否多选
                Width: 0,
                Height: 0,                     
                /* 提供给外部的接口方法 */
                onSubmit: function (file, element) { },    // 确定，单选
                onDelete: function (file, files) { },      // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
                onChange: function (element) { }           // 填充值
            };
            this._para = $.extend(defaults, this.options);
            this.element.css("display", "none");
            this._span = $('<div class="custom-FileSelector" />')
                .insertAfter(this.element);
            if (this.element.css("position") == "absolute") {
                this._span.css({ "position": "absolute", "width": this.element.width()+16, "height": this.element.height(), "left": this.element.css("left"), "top": this.element.css("top") })
            }

            //if (!BS_FILE_SELECTOR_DIALOG) {
                this._dialog = $('<div id="Div_DialogFileSelector" />')
                .addClass("dialog-file-selector")
                .insertAfter(this.element);
                //BS_FILE_SELECTOR_DIALOG = this._dialog;
            //} else {
                //this._dialog = BS_FILE_SELECTOR_DIALOG;
            //}

            //var _dialog = this._dialog;
            //var _para = this._para;
            //_dialog.element = this.element;
            //_para.element = this.element;
            this._on(this.element, {
                change: function (e) {
                    this.refreshDialog();
                }
            });
            //_para.span = this._span;
            this._dialog._arr_sys_file = [];        //文件集
            this._dialog._arr_file_choose = [];     //选择文件数组
            this._dialog._item_per_page = 20;       //每页显示文件数
            this._dialog._page_current = 1;         //当前页
            this._dialog._page_total = 1;           //总页数
            this._dialog._fileId_choose = 1;        //已选文件ID
            this._dialog._li_fst = null;            //首页按钮
            this._dialog._li_prv = null;            //上页按钮
            this._dialog._li_nxt = null;            //下页按钮
            this._dialog._li_lst = null;            //尾页按钮
            this.loadSysFileType = function () {  //加载文件分类
                var s = this._dialog.find(".selectFileSelector");
                s.empty();

                var option = $("<option/>");
                option.attr("value", "0");
                option.html("全部文件分类");
                this._dialog.find("#Select_FileTypeSearch").append(option);

                var data = {};
                data.sessionid = request("SessionId");
                data.action = "LOAD_SYS_FILE_TYPE";
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

                                var option = $("<option/>");
                                option.attr("value", record.id);
                                if (record.uploadPath != null && record.uploadPath != '') option.attr("uploadPath", record.uploadPath);
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
            };
            this.loadSysFile = function () {  //加载文件
                var $this = this;
                var constr = "";
                var data = {};
                data.sessionid = request("SessionId");
                data.action = "LOAD_SYS_FILE";
                if (this._dialog.find("#Select_FileTypeSearch").val() != null && this._dialog.find("#Select_FileTypeSearch").val() != "0") {
                    constr = " AND fileTypeId=" + this._dialog.find("#Select_FileTypeSearch").val() + " AND IFNULL(name,'') LIKE '%" + this._dialog.find("#Text_FileName").val() + "%'";
                } else {
                    constr = " AND IFNULL(name,'') LIKE '%" + this._dialog.find("#Text_FileName").val() + "%'";
                }
                data.constr = constr;
                
                $.ajax({
                    type: "POST",
                    url: GET_DATA,
                    data: data,
                    dataType: 'json',
                    async: false,
                    dialog:this._dialog,
                    success: function (response, status, xhr) {
                        if (response.status == "SUCCESS") {
                            this.dialog._arr_sys_file = response.records;
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
            };
            this.initPlupload = function () {
                var $this = this;
                this._dialog.find("#Div_FileUpload").pluploadQueue({
                    runtimes: 'html5,flash,silverlight,html4',
                    url: '../../fileselector?sessionid=' + request("SessionId"),
                    chunk_size: '1mb',
                    rename: true,
                    dragdrop: true,
                    multiple_queues: true,
                    filters: {
                        max_file_size: '100mb',
                        mime_types: [
                            { title: "图片类", extensions: "jpg,gif,png,tiff" },
                            { title: "网页类", extensions: "htm,html" },
                            { title: "文本类及Microsoft Office组件类", extensions: "doc,docx,pdf,ppt,pptx,txt,rtf,vcf,xls,xlsx" },
                            { title: "压缩类", extensions: "zip,rar" }
                        ]
                    },
                    flash_swf_url: '../images/jquery_plupload/Moxie.swf',
                    silverlight_xap_url: '../images/jquery_plupload/Moxie.xap',
                    init: {
                        FileUploaded: function (up, file, info) {
                            var data = {};
                            data.sessionid = request("SessionId");
                            data.action = "SAVE_SYS_FILE";
                            data.fileId = info.response;
                            data.fileTypeId = $this._dialog.find("#Select_UploadFileType").val();
                            $.ajax({
                                type: "POST",
                                url: GET_DATA,
                                data: data,
                                dataType: 'json',
                                async: false,
                                success: function (response, status, xhr) {
                                    if (response.status == "SUCCESS") {

                                    } else {
                                        alert(response.errorMessage);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    alert(XMLHttpRequest);
                                }
                            });
                        },
                        UploadComplete: function (up, files) {
                            $this._dialog._uploader = up;
                        },
                        Error: function (up, args) {
                            alert(args);
                        }
                    }
                });
            };
            this.initPage = function () {   //初始化页码
                var _dialog = this._dialog;
                var $this = this;
                this._dialog._page_total = parseInt(this._dialog._arr_sys_file.length / this._dialog._item_per_page);
                if (this._dialog._arr_sys_file.length % this._dialog._item_per_page) this._dialog._page_total = this._dialog._page_total + 1;
                var s = this._dialog.find(".divFileSelecotrPage");
                s.empty();

                var ul = $("<ul/>");
                var li = $("<li/>");
                li.html('<a href="#" class="btnPage">首页</a>');
                li.attr("page_current", -1);
                this._dialog._li_fst = li;
                li.click(function () {
                    $(".divFileSelecotrPage a").removeClass("btnPageCurrent");
                    $(".divFileSelecotrPage li[page_current = 1]").find("a").addClass("btnPageCurrent");
                    _dialog._page_current = 1;
                    $this.gotoPage();
                });
                ul.append(li);

                var li = $("<li/>");
                li.html('<a href="#" class="btnPage">上页</a>');
                li.attr("page_current", -2);
                _dialog._li_prv = li;
                li.click(function () {
                    if (_dialog._page_current != 1) _dialog._page_current = _dialog._page_current - 1;
                    _dialog.find(".divFileSelecotrPage a").removeClass("btnPageCurrent");
                    _dialog.find(".divFileSelecotrPage li[page_current = " + _dialog._page_current + "]").find("a").addClass("btnPageCurrent");
                    $this.gotoPage();
                });
                ul.append(li);

                for (var i = 1; i <= _dialog._page_total; i++) {
                    var li = $("<li/>");
                    li.html('<a href="#" class="btnPage">' + i + '</a>');
                    li.attr("page_current", i);
                    li.click(function () {
                        _dialog.find(".divFileSelecotrPage a").removeClass("btnPageCurrent");
                        $(this).find("a").addClass("btnPageCurrent");
                        _dialog._page_current = parseInt($(this).attr("page_current"));
                        $this.gotoPage();
                    });
                    if (i == 1) li.find("a").addClass("btnPageCurrent");
                    ul.append(li);
                }

                var li = $("<li/>");
                li.html('<a href="#" class="btnPage">下页</a>');
                li.attr("page_current", -3);
                _dialog._li_nxt = li;
                li.click(function () {
                    if (_dialog._page_current != _dialog._page_total) _dialog._page_current = _dialog._page_current + 1;
                    $this.find(".divFileSelecotrPage a").removeClass("btnPageCurrent");
                    $this.find(".divFileSelecotrPage li[page_current = " + _dialog._page_current + "]").find("a").addClass("btnPageCurrent");
                    $this.gotoPage();
                });
                ul.append(li);

                var li = $("<li/>");
                li.html('<a href="#" class="btnPage">尾页</a>');
                li.attr("page_current", -4);
                _dialog._li_lst = li;
                li.click(function () {
                    _dialog._page_current = _dialog._page_total;
                    _dialog.find(".divFileSelecotrPage a").removeClass("btnPageCurrent");
                    _dialog.find(".divFileSelecotrPage li[page_current = " + _dialog._page_current + "]").find("a").addClass("btnPageCurrent");
                    $this.gotoPage();
                });
                ul.append(li);

                s.append(ul);

                _dialog._page_current = 1;
                $this.gotoPage();
            };
            this.gotoPage = function () {   //跳转页 
                var _dialog = this._dialog;
                if (_dialog._page_current == 1) {
                    _dialog._li_fst.find("a").addClass("btnPageDisabled");
                    _dialog._li_prv.find("a").addClass("btnPageDisabled");
                } else {
                    _dialog._li_fst.find("a").removeClass("btnPageDisabled");
                    _dialog._li_prv.find("a").removeClass("btnPageDisabled");
                }
                if (_dialog._page_current == _dialog._page_total) {
                    _dialog._li_nxt.find("a").addClass("btnPageDisabled");
                    _dialog._li_lst.find("a").addClass("btnPageDisabled");
                } else {
                    _dialog._li_nxt.find("a").removeClass("btnPageDisabled");
                    _dialog._li_lst.find("a").removeClass("btnPageDisabled");
                }

                var i_start = _dialog._item_per_page * (_dialog._page_current - 1) + 1;   //起始文件索引
                var i_end = i_start + _dialog._item_per_page - 1;                 //结束文件索引
                if (_dialog._arr_sys_file.length < i_end) {
                    i_end = _dialog._arr_sys_file.length;
                }

                var s = _dialog.find(".ulFileSelector");
                s.empty();

                var record;
                for (var i = i_start; i <= i_end; i++) {
                    record = _dialog._arr_sys_file[i - 1];

                    var li = $("<li fileId='" + record.id + "' path='" + record.path + "' title='" + record.name + "' />");
                    li.html('<div class="fileFileSelector">' + record.name + '</div><div class="divFileSelectorClick" style="display:none"></div>');
                    s.append(li);

                    for (var j = 0; j < _dialog._arr_file_choose.length; j++) {
                        if (_dialog._arr_file_choose[j].id == record.id) {
                            li.find(".divFileSelectorClick").css("display", "");
                            break;
                        }
                    }
                }

                this.fileMouseOver();
            };
            this.fileMouseOver = function () {   //经过/点击文件动作
                var _dialog = this._dialog;

                _dialog.find(".ulFileSelector").find("li").mouseover(function () {
                    if ($(this).find(".divFileSelectorClick").css("display") == "none") {
                    }
                });
                _dialog.find(".ulFileSelector").find("li").mouseout(function () {
                    if ($(this).find(".divFileSelectorClick").css("display") == "none") {
                    }
                });
                //this._on(item.find(".btnDelPlupload"), {
                //    click: btnDelPlupload_Click
                //});
                this._on(_dialog.find(".ulFileSelector").find("li"), {
                    click: function (e) {
                        if ($(e.currentTarget).find(".divFileSelectorClick").css("display") == "none") { //选中
                            if (this._para.IsMult == false) {    //单选情况
                                this._dialog._arr_file_choose = [];
                            }

                            $(e.currentTarget).find(".divFileSelectorClick").css("display", "");
                            var arr = {};
                            arr.id = $(e.currentTarget).attr("fileId");
                            arr.path = $(e.currentTarget).attr("path");
                            //arr.srcL = $(this).find("img").attr("src");
                            this._dialog._arr_file_choose.push(arr);

                        } else {    //不选
                            $(e.currentTarget).find(".divFileSelectorClick").css("display", "none");
                            for (var i = 0; i < this._dialog._arr_file_choose.length; i++) {
                                if (this._dialog._arr_file_choose[i].id == $(e.currentTarget).attr("fileId")) {
                                    this._dialog._arr_file_choose.remove(this._dialog._arr_file_choose[i]);
                                }
                            }
                        }
                        //_dialog.loadFileChoose();
                        this.gotoPage();
                    }
                });
                //_dialog.find(".ulFileSelector").find("li").click(function () {
                //    if ($(this).find(".divFileSelectorClick").css("display") == "none") { //选中
                //        if (_para.IsMult == false) {    //单选情况
                //            _dialog._arr_file_choose = [];
                //        }

                //        $(this).find(".divFileSelectorClick").css("display", "");
                //        var arr = {};
                //        arr.id = $(this).attr("fileId");
                //        arr.path = $(this).attr("path");
                //        //arr.srcL = $(this).find("img").attr("src");
                //        _dialog._arr_file_choose.push(arr);

                //    } else {    //不选
                //        $(this).find(".divFileSelectorClick").css("display", "none");
                //        for (var i = 0; i < _dialog._arr_file_choose.length; i++) {
                //            if (_dialog._arr_file_choose[i].id == $(this).attr("fileId")) {
                //                _dialog._arr_file_choose.remove(_dialog._arr_file_choose[i]);
                //            }
                //        }
                //    }
                //    //_dialog.loadFileChoose();
                //    _dialog.gotoPage();
                //});
            };
            
            this.btnFileSelectorSubmit = function () { //确定
                var _dialog = this._dialog;
                var s = this._span.find(".custom-FileSelector-list");
                s.empty();

                for (var i = 0; i < _dialog._arr_file_choose.length; i++) {
                    item = $("<li/>");
                    item.addClass("liPlupload");
                    item.attr("liBtnId", _dialog._arr_file_choose[i].id);

                    var fileInfo = {};
                    fileInfo = getFileInfoById(_dialog._arr_file_choose[i].id);
                    item.html('<span class="spanPlupload" path="' + fileInfo.path + '">' + fileInfo.name + '</span><span class="spanPluploadSize" path="' + fileInfo.path + '">(' + bytesToSize(fileInfo.size) + ')</span><div class="btnDelPlupload" btnid="' + _dialog._arr_file_choose[i].id + '">删除</div>');
                    s.append(item);

                    //item.find(".btnDelPlupload").click(this.btnDelPlupload_Click);
                    //item.find(".spanPlupload").click(this.download_Click);
                    //item.find(".spanPluploadSize").click(this.download_Click);

                    this._on(item.find(".btnDelPlupload"), {
                        click: this.btnDelPlupload_Click
                    });
                    this._on(item.find(".spanPlupload"), {
                        click: this.download_Click
                    });
                    this._on(item.find(".spanPluploadSize"), {
                        click: this.download_Click
                    });
                }

                this.refreshInputValue();
                _dialog.dialog("close");
            };
            this.refreshInputValue = function () {   //刷新input值
                var _dialog = this._dialog;
                var s = this._span.find(".custom-FileSelector-list");
                var ids = '';
                var i = 0;
                s.find('li').each(function () {
                    ids = ids + $(this).attr("liBtnId")
                    if (i < s.find('li').length - 1) {
                        ids = ids + ",";
                    }
                    i++;
                });
                this.element.val(ids);
            }
            this.refreshDialog = function () {
                var _dialog = this._dialog;
                var ids = this.element.val();
                var arr = [];
                if (ids != "") arr = ids.split(",");

                var s = this._span.find(".custom-FileSelector-list");
                s.empty();

                var item;

                _dialog._arr_file_choose = [];
                

                for (var i = 0; i < arr.length; i++) {
                    var fileInfo = {};
                    fileInfo = getFileInfoById(arr[i]);
                    if (arr[i] != 0) {
                        item = $("<li/>");
                        item.addClass("liPlupload");
                        item.attr("liBtnId", arr[i]);
                        item.html('<span class="spanPlupload" path="' + fileInfo.path + '">' + fileInfo.name + '</span><span class="spanPluploadSize" path="' + fileInfo.path + '">(' + bytesToSize(fileInfo.size) + ')</span><div class="btnDelPlupload" btnid="' + arr[i] + '">删除</div>');
                        s.append(item);

                        this._on(item.find(".btnDelPlupload"), {
                            click: this.btnDelPlupload_Click
                        });
                        this._on(item.find(".spanPlupload"), {
                            click: this.download_Click
                        });
                        this._on(item.find(".spanPluploadSize"), {
                            click: this.download_Click
                        });
                        //item.find(".btnDelPlupload").click(_dialog.btnDelPlupload_Click);
                        //item.find(".spanPlupload").click(_dialog.download_Click);
                        //item.find(".spanPluploadSize").click(_dialog.download_Click);

                        item = {};
                        item.id = arr[i];
                        item.path = fileInfo.path;
                        _dialog._arr_file_choose.push(item);
                    }
                }
            }
            this.btnDelPlupload_Click = function (e) {   //删除一行队列
                var _dialog = this._dialog;
                if (confirm("确定删除所选数据？")) {
                    var c_id = $(e.currentTarget).attr("btnid");
                    var arr = [];
                    for (var i = 0; i < _dialog._arr_file_choose.length; i++) {
                        if (_dialog._arr_file_choose[i].id != c_id) {
                            arr.push(_dialog._arr_file_choose[i]);
                        }
                    }
                    _dialog._arr_file_choose = arr;
                    this._span.find("[liBtnId='" + c_id + "']").remove();
                    this.refreshInputValue();
                }
            }
            this.download_Click = function (e) { //下载文件
                window.open($(e.currentTarget).attr("path"));
            }
            this.btnFileSelectorCancel = function () { //取消
                this._dialog.dialog("close");
            };
            this.btnFileSelectorSearch = function () { //搜索
                this.loadSysFile();
                this.initPage();
            };
            this._createHtml();
            this.loadSysFileType();
            this.initPlupload();
            this._on(this._span.find(".custom-FileSelector-button"), {
                click: function (e) {
                    if (this._para.IsMult == false) {//单选设置
                        this._dialog._item_per_page = 20;
                    }

                    //_dialog._arr_file_choose = [];
                    this._dialog._fileId_choose = 0;
                    this._dialog.find("#Text_FileName").val("");
                    this._dialog.find("#Select_FileTypeSearch").val("0");
                    this.loadSysFile();
                    this.initPage();
                    //_dialog.loadFileChoose();
                    this._dialog.dialog("option", { modal: false }).dialog("open");
                    this._dialog._page_current = 1;
                    this.gotoPage();
                }
            });
            //this._span.find(".custom-FileSelector-button").click(function () {
            //    if (_para.IsMult == false) {//单选设置
            //        _dialog._item_per_page = 20;
            //    } 

            //    //_dialog._arr_file_choose = [];
            //    _dialog._fileId_choose = 0;
            //    _dialog.find("#Text_FileName").val("");
            //    _dialog.find("#Select_FileTypeSearch").val("0");
            //    _dialog.loadSysFile();
            //    _dialog.initPage();
            //    //_dialog.loadFileChoose();
            //    _dialog.dialog("option", { modal: false }).dialog("open");
            //    _dialog._para = _para;
            //    _dialog._page_current = 1;
            //    _dialog.gotoPage();
            //});
        },
        _createHtml: function () {
            var html = '';
            html += '<div class="tabs">';
            html += '	<ul>';
            html += '		<li><a href="#Div_Tab1">文件选择</a></li>';
            html += '		<li><a href="#Div_Tab2">本地上传</a></li>';
            html += '	</ul>';
            html += '	<div id="Div_Tab1">';
            html += '		    <div>';
            html += '			    <label>文件分类<select id="Select_FileTypeSearch" class="selectFileSelector"></select></label>';
            html += '				<label>名称<input id="Text_FileName" type="text" class="textFileSelector" /></label>';
            html += '				<span id="Btn_Search" class="btnSmall btnGreen">搜索</span>';
            html += '			</div>';
            html += '			<ul class="ulFileSelector"></ul>';
            html += '           <div class="divFileSelecotrPage"></div>';
            html += '	</div>';
            html += '	<div id="Div_Tab2">';
            html += '		<span>上传到文件分类</span>';
            html += '		<select id="Select_UploadFileType" class="selectFileSelector"></select>';
            html += '       <div id="Div_FileUpload">';
            html += '           <p>Your browser doesn\'t have Flash, Silverlight or HTML5 support.</p>';
            html += '       </div>';
            html += '	</div>';
            html += '</div>';
            html += '<div class="divFormButton">';
            html += '   <div class="divFormButtonRight">';
            html += '		<input id="Btn_FileSelectorSubmit" type="button" class="btnMiddle btnOrange" value="确 定" />';
            html += '		<input id="Btn_FileSelectorCancel" type="button" class="btnMiddle btnGray" value="取 消" />';
            html += '	</div>';
            html += '</div>';
            this._dialog.html(html).dialog({
                autoOpen: false,
                title: '选择文件',
                modal: true,
                width: 715,
                resizable: false,    //是否可以调整对话框的大小，默认为 true
                z_index: 102
            });
            this._dialog.find(".tabs").tabs();

            //
            this._on(this._dialog.find("#Btn_Search"), {
                click: this.btnFileSelectorSearch
            });
            this._on(this._dialog.find("#Btn_FileSelectorCancel"), {
                click: this.btnFileSelectorCancel
            });
            this._on(this._dialog.find("#Btn_FileSelectorSubmit"), {
                click: this.btnFileSelectorSubmit
            });

            html = '';
            html += '<ul class="custom-FileSelector-list" style="width:' + (this._span.width() - 25) + 'px; height:' + this._span.height() + 'px;"></ul>';
            html += '<a class="ui-button ui-widget ui-state-default ui-button-icon-only ui-corner-right custom-FileSelector-button" ';
            html += 'style="height:21px; width:21px; vertical-align:top;">';
            html += '<span class="ui-button-icon-primary ui-icon ui-icon-folder-collapsed"></span>';
            html += '</a>';
            this._span.html(html);

        },
        closeDialog: function () {
            this._dialog.dialog("close");
        },
        openDialog: function () {
            if (this._para.IsMult == false) {//单选设置
                this._dialog._item_per_page = 20;
            } 

            //this._dialog._arr_file_choose = [];
            this._dialog._fileId_choose = 0;
            this._dialog.find("#Text_FileName").val("");
            this._dialog.find("#Select_FileTypeSearch").val("0");
            this.loadSysFile();
            this.initPage();
            //this._dialog.loadFileChoose();
            this._dialog.dialog("option", { modal: false }).dialog("open");
            this._dialog._para = this._para;
        }
    });
})(jQuery);

