var BS_IMG_SELECTOR_DIALOG=null;
(function ($) {
    $.widget("custom.ImgSelector", {
        _para: {},
        _dialog: null,
        _create: function () {
            var defaults = {
                IsMult: false,                              //是否多选
                /* 提供给外部的接口方法 */
                onSubmit: function (img,element) { },               // 确定，单选
                onDelete: function (file, files) { },     // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
                onSuccess: function (file, response) { },            // 文件上传成功的回调方法
                onFailure: function (file) { },            // 文件上传失败的回调方法
                onComplete: function (responseInfo) { },    // 上传完成的回调方法
            };
            this._para = $.extend(defaults, this.options);
            if(!BS_IMG_SELECTOR_DIALOG){
            	this._dialog = $('<div id="Div_DialogImgSelector" />')
                .addClass("dialog-img-selector")
                .insertAfter(this.element);
            	BS_IMG_SELECTOR_DIALOG=this._dialog;
            }else{
            	this._dialog = BS_IMG_SELECTOR_DIALOG;
            }
            
            var _dialog = this._dialog;
            var _para = this._para;
            _dialog.element = this.element;
            _para.element = this.element;
            this._dialog._arr_sys_images = [];      //图片集
            this._dialog._arr_img_choose = [];      //选择图片数组
            this._dialog._item_per_page = 15;       //每页显示图片数
            this._dialog._page_current = 1;         //当前页
            this._dialog._page_total = 1;           //总页数
            this._dialog._imgId_choose = 1;         //已选图片ID
            this._dialog._li_fst = null;            //首页按钮
            this._dialog._li_prv = null;            //上页按钮
            this._dialog._li_nxt = null;            //下页按钮
            this._dialog._li_lst = null;            //尾页按钮
            this._dialog.loadSysImagesType = function () {  //加载相册
                var $this = $(this);
                var s = $this.find(".selectImgSelector");
                s.empty();

                var option = $("<option/>");
                option.attr("value", "0");
                option.html("全部相册");
                $this.find("#Select_ImagesTypeSearch").append(option);

                var data = {};
                data.sessionid = request("SessionId");
                data.action = "LOAD_SYS_IMAGES_TYPE";
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
                                option.attr("widthL", record.widthL);
                                option.attr("heightL", record.heightL);
                                option.html(record.name);
                                s.append(option);
                                
                                //建议尺寸
                                if(i==1) $("#Span_UploadImagesTypeSize").text("建议尺寸:"+record.widthL+"X"+record.heightL+"(像素)");
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
            this._dialog.loadSysImages = function () {  //加载图片
                var constr = "";
                var data = {};
                data.sessionid = request("SessionId");
                data.action = "LOAD_SYS_IMAGES";
                var $this = $(this);
                if ($this.find("#Select_ImagesTypeSearch").val() != null && $this.find("#Select_ImagesTypeSearch").val() != "0") {
                    constr = " AND imagesTypeId=" + $this.find("#Select_ImagesTypeSearch").val() + " AND IFNULL(name,'') LIKE '%" + $this.find("#Text_ImagesName").val() + "%'";
                } else {
                    constr = " AND IFNULL(name,'') LIKE '%" + $this.find("#Text_ImagesName").val() + "%'";
                }
                data.constr = constr;
                $.ajax({
                    type: "POST",
                    url: GET_DATA,
                    data: data,
                    dataType: 'json',
                    async: false,
                    success: function (response, status, xhr) {
                        if (response.status == "SUCCESS") {
                            _dialog._arr_sys_images = response.records;
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
            };
            this._dialog.initPage = function () {   //初始化页码
                _dialog._page_total = parseInt(_dialog._arr_sys_images.length / _dialog._item_per_page);
                if (_dialog._arr_sys_images.length % _dialog._item_per_page) _dialog._page_total = _dialog._page_total + 1;
                var $this = $(this);
                var s = $this.find(".divImgSelecotrPage");
                s.empty();

                var ul = $("<ul/>");
                var li = $("<li/>");
                li.html('<a href="#" class="btnPage">首页</a>');
                li.attr("page_current", -1);
                _dialog._li_fst = li;
                li.click(function () {
                    $(".divImgSelecotrPage a").removeClass("btnPageCurrent");
                    $(".divImgSelecotrPage li[page_current = 1]").find("a").addClass("btnPageCurrent");
                    _dialog._page_current = 1;
                    _dialog.gotoPage();
                });
                ul.append(li);

                var li = $("<li/>");
                li.html('<a href="#" class="btnPage">上页</a>');
                li.attr("page_current", -2);
                _dialog._li_prv = li;
                li.click(function () {
                    if (_dialog._page_current != 1) _dialog._page_current = _dialog._page_current - 1;
                    $this.find(".divImgSelecotrPage a").removeClass("btnPageCurrent");
                    $this.find(".divImgSelecotrPage li[page_current = " + _dialog._page_current + "]").find("a").addClass("btnPageCurrent");
                    _dialog.gotoPage();
                });
                ul.append(li);

                for (var i = 1; i <= _dialog._page_total; i++) {
                    var li = $("<li/>");
                    li.html('<a href="#" class="btnPage">' + i + '</a>');
                    li.attr("page_current", i);
                    li.click(function () {
                        _dialog.find(".divImgSelecotrPage a").removeClass("btnPageCurrent");
                        $(this).find("a").addClass("btnPageCurrent");
                        _dialog._page_current = parseInt($(this).attr("page_current"));
                        _dialog.gotoPage();
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
                    $this.find(".divImgSelecotrPage a").removeClass("btnPageCurrent");
                    $this.find(".divImgSelecotrPage li[page_current = " + _dialog._page_current + "]").find("a").addClass("btnPageCurrent");
                    _dialog.gotoPage();
                });
                ul.append(li);

                var li = $("<li/>");
                li.html('<a href="#" class="btnPage">尾页</a>');
                li.attr("page_current", -4);
                _dialog._li_lst = li;
                li.click(function () {
                    _dialog._page_current = _dialog._page_total;
                    $this.find(".divImgSelecotrPage a").removeClass("btnPageCurrent");
                    $this.find(".divImgSelecotrPage li[page_current = " + _dialog._page_current + "]").find("a").addClass("btnPageCurrent");
                    _dialog.gotoPage();
                });
                ul.append(li);

                s.append(ul);

                _dialog._page_current = 1;
                _dialog.gotoPage();
            };
            this._dialog.gotoPage = function () {   //跳转页 
                var $this = $(this);
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

                var i_start = _dialog._item_per_page * (_dialog._page_current - 1) + 1;   //起始图片索引
                var i_end = i_start + _dialog._item_per_page - 1;                 //结束图片索引
                if (_dialog._arr_sys_images.length < i_end) {
                    i_end = _dialog._arr_sys_images.length;
                }

                var s = $this.find(".ulImgSelector");
                s.empty();

                var record;
                for (var i = i_start; i <= i_end; i++) {
                    record = _dialog._arr_sys_images[i - 1];

                    var li = $("<li imgId='" + record.id + "' title='" + record.name + "' />");
                    li.html('<img src="' + record.srcLFull + '" class="imgImgSelector" /><div class="divImgSelectorBg" style="display:none"></div><div class="divImgSelectorOver" style="display:none"></div><div class="divImgSelectorClick" style="display:none"></div>');
                    s.append(li);

                    for (var j = 0; j < _dialog._arr_img_choose.length; j++) {
                        if (_dialog._arr_img_choose[j].id == record.id) {
                            li.find(".divImgSelectorBg").css("display", "");
                            li.find(".divImgSelectorClick").css("display", "");
                            break;
                        }
                    }
                }

                _dialog.imgMouseOver();
            };
            this._dialog.imgMouseOver = function () {   //经过/点击图片动作
                var $this = $(this);

                $this.find(".ulImgSelector").find("li").mouseover(function () {
                    if ($(this).find(".divImgSelectorClick").css("display") == "none") {
                        $(this).find(".divImgSelectorBg").css("display", "");
                        $(this).find(".divImgSelectorOver").css("display", "");
                    }
                });
                $this.find(".ulImgSelector").find("li").mouseout(function () {
                    if ($(this).find(".divImgSelectorClick").css("display") == "none") {
                        $(this).find(".divImgSelectorBg").css("display", "none");
                        $(this).find(".divImgSelectorOver").css("display", "none");
                    }
                });
                $this.find(".ulImgSelector").find("li").click(function () {
                    $this.find(".divImgSelectorOver").css("display", "none");

                    if ($(this).find(".divImgSelectorClick").css("display") == "none") { //选中
                        if (_para.IsMult == false) {    //单选情况
                            _dialog._arr_img_choose = [];
                        }

                        $(this).find(".divImgSelectorBg").css("display", "");
                        $(this).find(".divImgSelectorClick").css("display", "");
                        var arr = {};
                        arr.id = $(this).attr("imgId");
                        arr.srcL = $(this).find("img").attr("src");
                        _dialog._arr_img_choose.push(arr);

                    } else {    //不选
                        $(this).find(".divImgSelectorBg").css("display", "none");
                        $(this).find(".divImgSelectorClick").css("display", "none");
                        for (var i = 0; i < _dialog._arr_img_choose.length; i++) {
                            if (_dialog._arr_img_choose[i].id == $(this).attr("imgId")) {
                                _dialog._arr_img_choose.remove(_dialog._arr_img_choose[i]);
                            }
                        }
                    }
                    _dialog.loadImgChoose();
                    _dialog.gotoPage();
                });
            };
            this._dialog.loadImgChoose = function () {  //加载已选图片列表
                var $this = $(this);
                $this.find(".spanImgSelectorRed").text(_dialog._arr_img_choose.length);

                var s = $this.find(".divImgSelected");
                s.empty();
                var ul = $("<ul/>");

                for (var i = 0; i < _dialog._arr_img_choose.length; i++) {
                    var li = $("<li/>");
                    li.attr("imgId", _dialog._arr_img_choose[i].id);
                    li.html('<img src="' + _dialog._arr_img_choose[i].srcL + '" />');
                    ul.append(li);
                }

                s.append(ul);
                
                $this.find(".divImgSelected").find("li").click(function () {
                    $this.find(".divImgSelected").find("li").css("border-color", "#ffffff");
                    $(this).css("border-color", "#51e9ee");
                    _dialog._imgId_choose = $(this).attr("imgId");
                });
            };
            this._dialog.btnImgChooseUp = function () { //上移
                var $this = $(this);

                if (_dialog._imgId_choose != 0) {
                    for (var i = 1; i < _dialog._arr_img_choose.length; i++) {
                        if (_dialog._arr_img_choose[i].id == _dialog._imgId_choose) {
                            var arr_temp;
                            arr_temp = _dialog._arr_img_choose[i];
                            _dialog._arr_img_choose[i] = _dialog._arr_img_choose[i - 1];
                            _dialog._arr_img_choose[i - 1] = arr_temp;

                            _dialog.loadImgChoose();
                            $this.find(".divImgSelected li[imgId = " + _imgId_choose + "]").css("border-color", "#51e9ee");
                            break;
                        }
                    }
                }
            };
            this._dialog.btnImgChooseDown = function () { //下移
                var $this = $(this);

                if (_dialog._imgId_choose != 0) {
                    for (var i = 0; i < _dialog._arr_img_choose.length - 1; i++) {
                        if (_dialog._arr_img_choose[i].id == _dialog._imgId_choose) {
                            var arr_temp;
                            arr_temp = _dialog._arr_img_choose[i + 1];
                            _dialog._arr_img_choose[i + 1] = _dialog._arr_img_choose[i];
                            _dialog._arr_img_choose[i] = arr_temp;

                            _dialog.loadImgChoose();
                            $this.find(".divImgSelected li[imgId = " + _imgId_choose + "]").css("border-color", "#51e9ee");
                            break;
                        }
                    }
                }
            };
            this._dialog.btnImgChooseDown = function () { //删除
                if (_dialog._imgId_choose != 0) {
                    for (var i = 0; i < _dialog._arr_img_choose.length; i++) {
                        if (_dialog._arr_img_choose[i].id == _dialog._imgId_choose) {
                            _dialog._arr_img_choose.remove(_dialog._arr_img_choose[i]);
                        }
                    }
                    _dialog._imgId_choose = 0;
                    _dialog.loadImgChoose();
                    _dialog.gotoPage();
                }
            };
            this._dialog.btnImgSelectorSubmit = function () { //确定
                if (_para.IsMult == false) {    //单选
                    var img = {};
                    img.srcL = _dialog._arr_img_choose[0].srcL;
                    img.id = _dialog._arr_img_choose[0].id;
                    _dialog._para.onSubmit(img,_dialog._para.element);
                } else {    //多选
                    var imgs = "";
                    for (var i = 0; i < _dialog._arr_img_choose.length; i++) {
                        imgs = imgs + '<img src="' + _dialog._arr_img_choose[i].srcL + '" />';
                    }
                    _dialog._para.onSubmit(imgs, _dialog._para.element);
                }
                _dialog.dialog("close");
            };
            this._dialog.btnImgSelectorCancel = function () { //取消
                _dialog.dialog("close");
            };
            this._dialog.btnImgSelectorClean = function () { //清空图片
                var img = {};
                img.srcL = "../images/noimage.jpg";
                img.id = 0;
                _dialog._para.onSubmit(img, _dialog._para.element);
                _dialog.dialog("close");
            };
            this._dialog.btnImgSelectorSearch = function () { //搜索
                _dialog.loadSysImages();
                _dialog.initPage();
            };
            this._dialog.selectUploadImagesTypeChange = function () { //改变上传图片分类
            	$("#Span_UploadImagesTypeSize").text("建议尺寸:"+_dialog.find("#Select_UploadImagesType").find("option:selected").attr("widthL")+"X"+_dialog.find("#Select_UploadImagesType").find("option:selected").attr("heightL")+"(像素)");
            };
            this._dialog.saveSysImages = function (file, response) { //保存图片
                var $this = $(this);

                var filename;
                var arr = response.split("//");
                if (arr.length > 0) {
                    if (arr.length > 1) filename = arr[arr.length - 2] + "/";
                    filename = filename + arr[arr.length - 1];
                }

                var data = {};
                data.sessionid = request("SessionId");
                data.action = "SAVE_SYS_IMAGES";
                data.srcL = filename;
                data.name = file.name.substring(0, file.name.lastIndexOf("."));
                data.imagesTypeId = _dialog.find("#Select_UploadImagesType").val();
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
            };

            this._createHtml();
            this._dialog.loadSysImagesType();
            
            this.element.click(function () {
                if (_para.IsMult == false) {//单选设置
                    _dialog.find(".divImgSelectorRight").css("display", "none");
                    _dialog.find(".divImgSelectorLeft").css("width", "100%");
                    _dialog._item_per_page = 18;
                } else {    //多选
                    _dialog.find("#Btn_ImgSelectorClean").css("display", "none");
                }

                _dialog._arr_img_choose = [];
                _dialog._imgId_choose = 0;
                _dialog.find("#Text_ImagesName").val("");
                _dialog.find("#Select_ImagesTypeSearch").val("0");
                _dialog.loadSysImages();
                _dialog.initPage();
                _dialog.loadImgChoose();
                _dialog.dialog("option", { modal: false }).dialog("open");
                _dialog._para=_para;
            });
        },
        _createHtml: function () {
            var html = '';
            html += '<div class="tabs">';
            html += '	<ul>';
            html += '		<li><a href="#Div_Tab1">相册选择</a></li>';
            html += '		<li><a href="#Div_Tab2">本地上传</a></li>';
            html += '	</ul>';
            html += '	<div id="Div_Tab1">';
            html += '	    <div class="divImgSelectorLeft">';
            html += '		    <div>';
            html += '			    <label>相册<select id="Select_ImagesTypeSearch" class="selectImgSelector"></select></label>';
            html += '				<label>名称<input id="Text_ImagesName" type="text" class="textImgSelector" /></label>';
            html += '				<span id="Btn_Search" class="btnSmall btnGreen">搜索</span>';
            html += '			</div>';
            html += '			<ul class="ulImgSelector"></ul>';
            html += '           <div class="divImgSelecotrPage"></div>';
            html += '		</div>';
            html += '		<div class="divImgSelectorRight"><!--style="display:none;"-->';
            html += '		    <span class="spanImgSelectorRight">已选图片(<span class="spanImgSelectorRed">0</span>)</span>';
            html += '		    <div>';
            html += '		        <span id="Btn_ImgSelectorUp" class="btnImgSelected btnImgSelected1">上移</span>';
            html += '		        <span id="Btn_ImgSelectorDown" class="btnImgSelected">下移</span>';
            html += '		        <span id="Btn_ImgSelectorDel" class="btnImgSelected">删除</span>';
            html += '		    </div>';
            html += '		    <div class="divImgSelected"></div>';
            html += '		</div>';
            html += '	</div>';
            html += '	<div id="Div_Tab2">';
            html += '		<span>上传到相册</span>';
            html += '		<select id="Select_UploadImagesType" class="selectImgSelector"></select>';
            html += '		<span id="Span_UploadImagesTypeSize" style="color: #1c94c4; font-size: 0.9em; margin-left: 0.5em; margin-right: 2em; "></span>';
            html += '		<span>图片质量:</span>';
            html += '		<label><input type="radio" name="identity" value="1" checked="checked" />普通</label>';
            html += '		<label><input type="radio" name="identity" value="2" />原图</label>';
            html += '		<div class="demo"></div>';
            html += '	</div>';
            html += '</div>';
            html += '<div class="divFormButton">';
            html += '<div class="divFormButtonLeft"><input id="Btn_ImgSelectorClean" type="button" class="btnMiddle btnGreen" value="清空图片" /></div>';
            html += '   <div class="divFormButtonRight">';
            html += '		<input id="Btn_ImgSelectorSubmit" type="button" class="btnMiddle btnOrange" value="确 定" />';
            html += '		<input id="Btn_ImgSelectorCancel" type="button" class="btnMiddle btnGray" value="取 消" />';
            html += '	</div>';
            html += '</div>';
            this._dialog.html(html).dialog({
                autoOpen: false,
                title: '选择图片',
                modal: true,
                width: 715,
                resizable: false,    //是否可以调整对话框的大小，默认为 true
                z_index:102
            });
            this._dialog.find(".tabs").tabs();
            this._dialog.find(".demo").zyUpload({
                width: "650px",                 // 宽度
                height: "400px",                // 宽度
                itemWidth: "120px",             // 文件项的宽度
                itemHeight: "100px",            // 文件项的高度
                url: "../../upload?sessionid="+request("SessionId"),  		        // 上传文件的路径
                multiple: true,                 // 是否可以多个文件上传
                dragDrop: true,                 // 是否可以拖动上传文件
                del: true,                      // 是否可以删除文件
                finishDel: true,  				// 是否在上传文件完成后删除预览
                /* 外部获得的回调接口 */
                onSuccess: this._dialog.saveSysImages,
                onComplete: function (responseInfo) {           // 上传完成的回调方法
                    //console.info("文件上传完成");
                    //console.info(responseInfo);
                }
                /*
                onSelect: function (files, allFiles) {                    // 选择文件的回调方法
                    console.info("当前选择了以下文件：");
                    console.info(files);
                    console.info("之前没上传的文件：");
                    console.info(allFiles);
                },
                onDelete: function (file, surplusFiles) {                     // 删除一个文件的回调方法
                    console.info("当前删除了此文件：");
                    console.info(file);
                    console.info("当前剩余的文件：");
                    console.info(surplusFiles);
                },
                onFailure: function (file) {                    // 文件上传失败的回调方法
                    console.info("此文件上传失败：");
                    console.info(file);
                },
                */
            });
            //$(self).append(html).css({ "width": para.width, "height": para.height });

            this._dialog.find("#Btn_ImgSelectorUp").click(this._dialog.btnImgChooseUp);
            this._dialog.find("#Btn_ImgSelectorDown").click(this._dialog.btnImgChooseDown);
            this._dialog.find("#Btn_ImgSelectorDel").click(this._dialog.btnImgChooseDel);
            this._dialog.find("#Btn_Search").click(this._dialog.btnImgSelectorSearch);
            this._dialog.find("#Btn_ImgSelectorSubmit").click(this._dialog.btnImgSelectorSubmit);
            this._dialog.find("#Btn_ImgSelectorCancel").click(this._dialog.btnImgSelectorCancel);
            this._dialog.find("#Btn_ImgSelectorClean").click(this._dialog.btnImgSelectorClean);
            this._dialog.find("#Select_UploadImagesType").change(this._dialog.selectUploadImagesTypeChange);
        },
        closeDialog: function () {
            this._dialog.dialog("close");
        },
        openDialog: function () {
            if (this._para.IsMult == false) {//单选设置
                this._dialog.find(".divImgSelectorRight").css("display", "none");
                this._dialog.find(".divImgSelectorLeft").css("width", "100%");
                this._dialog._item_per_page = 18;
            } else {
                this._dialog.find("#Btn_ImgSelectorClean").css("display", "none");
            }

            this._dialog._arr_img_choose = [];
            this._dialog._imgId_choose = 0;
            this._dialog.find("#Text_ImagesName").val("");
            this._dialog.find("#Select_ImagesTypeSearch").val("0");
            this._dialog.loadSysImages();
            this._dialog.initPage();
            this._dialog.loadImgChoose();
            this._dialog.dialog("option", { modal: false }).dialog("open");
            this._dialog._para=this._para;
        }
    });
})(jQuery);
