(function ($) {
    $.widget("custom.ButtonMenu", {
        _para: {},
        _dialog: null,
        _create: function () {
            var defaults = {
                Title: "",
                SessionId: "",
                DataGridId: 0,
                ValueColumn: "",
                TextColumn: "",
                Width: 0,
                Height: 0,
                IsMult: false,                              //是否多选
                /* 提供给外部的接口方法 */
                onSubmit: function (ids, element) {
//                    var str1 = "", str2 = "", str = "";
//                    if (element.attr("value")) str1 = element.attr("value");
//                    str2 = ids;
//                    if (str1.length == 0 || str2.length == 0) {
//                        str = str1 + str2;
//                    } else {
//                        str = str1 + "," + str2;
//                        var arr1 = str.split(",");
//                        var arr = [];
//                        for (var i = 0; i < arr1.length; i++) {
//                            var b = true;
//                            for (var j = 0; j < arr.length; j++) {
//                                if (arr1[i] == arr[j]) b = false;
//                            }
//                            if (b) {
//                                arr.push(arr1[i]);
//                            }
//                        }
//                        str = "";
//                        for (var i = 0; i < arr.length; i++) {
//                            str = str + arr[i];
//                            if (i < arr.length - 1) str = str + ",";
//                        }
//                    }
//                    element.val(str);
                    //textarea.val(getTextByValue(str, _dialog._para.TextColumn, _dialog._para.ValueColumn, _dialog._para.DataGridId));
                },               // 确定，单选
                onDelete: function (indexof, element) {
//                    var str = textarea.val();
//                    var str2 = element.val();
//                    var deleteIndex = 0;
//                    for (var i = 0; i < indexof; i++) {
//                        if (str.substr(i, 1) == "," && i < indexof - 1) deleteIndex = deleteIndex + 1;
//                    }
//                    var arr1 = str2.split(",");
//                    var arr = [];
//                    for (var i = 0; i < arr1.length; i++) {
//                        if (i != deleteIndex) arr.push(arr1[i]);
//                    }
//                    var strId = "";
//                    for (var i = 0; i < arr.length; i++) {
//                        strId = strId + arr[i];
//                        if (i < arr.length - 1) strId = strId + ",";
//                    }
//                    element.val(strId);
                    //textarea.val(getTextByValue(strId, _dialog._para.TextColumn, _dialog._para.ValueColumn, _dialog._para.DataGridId));
                },           // 光标索引
                onChange: function (element) {
                    var strId = element.val();
                    //textarea.val(getTextByValue(strId, _dialog._para.TextColumn, _dialog._para.ValueColumn, _dialog._para.DataGridId));
                }                     // 填充值
            };
            this._para = $.extend(defaults, this.options);
            //this.element.css("display", "none");

            //this._span = $('<span class="custom-TextboxAdvance" />').insertAfter(this.element);
            //if (this.element.css("position") == "absolute") {
                //this._span.css({ "position": "absolute", "width": (this.element.width() + 18), "height": this.element.height(), "left": this.element.css("left"), "top": this.element.css("top") })
            //}
            this._dialog = $('<div id="Div_Datagrid" />').insertAfter(this.element);
            var _dialog = this._dialog;
            _dialog._para = this._para;
            _dialog.element = this.element;
            this.element.click(function () {
            	_dialog.dialog("option", { modal: false }).dialog("open");
                $("#MenuHead_Department").trigger("click");
            });
            this._dialog._datatable = null;
            this._dialog._datatable_current_page = 0;
            this._dialog._datagrid_id = 0;
            this._dialog._arr_datagrid = [];      //数据集
            //this._dialog._textarea = null;
            this._dialog._arr_select=[];
            this._dialog.initDatagrid = function () {
            	_dialog.loadUlTextboxMenu();
            	_dialog.loadTextboxMenuContentAll();
                var bsTextboxMenu_head = $('.custom-TextboxMenu-ulMenuLeft > li > a'),
                bsTextboxMenu_body = $('.custom-TextboxMenu-ulMenuLeft li > .custom-TextboxMenu-subMenuLeft');
	            bsTextboxMenu_head.first().addClass('active').next().slideDown('normal');
	            bsTextboxMenu_head.on('click', function (event) {
	                event.preventDefault();
	                if ($(this).attr('class') != 'active') {
	                    bsTextboxMenu_body.slideUp('normal');
	                    $(this).next().stop(true, true).slideToggle('normal');
	                    bsTextboxMenu_head.removeClass('active');
	                    $(this).addClass('active');
	                }
	            });
            },
            this._dialog.loadUlTextboxMenu=function(){
            	var s = $("#Ul_bsTextboxMenu");
                s.empty();
                var li, str;
                li= $("<li/>");
                li.html('<a isAll="1">全部教职员</a>');
                s.append(li);

                li = $("<li/>");
                str = '<a id="MenuHead_Department">按部门查找</a><ul class="custom-TextboxMenu-subMenuLeft">';
                str = str + _dialog.getLiTextboxMenuDepartment();
                str = str + '</ul>';
                li.html(str);
                s.append(li);

                $("#Ul_bsTextboxMenu").find("a").click(_dialog.aTextboxMenu_Click);
                
            },
            this._dialog.loadTextboxMenuContentAll=function(){
            	var s = $("#Ul_bsTextboxMenuContent");
                s.empty();

                var data = {};
                data.sessionid = request("SessionId");
                data.table = "t_employee";
                data.constr = " AND sysUserId<>0";
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
                            var li;
                            li = $("<li/>");
                            li.html('<a class="custom-TextboxMenu-liMenuRight1" userId="0">全选／全不选</a>');
                            s.append(li);
                            for (var i = 1; i <= response.records.length; i++) {
                                record = response.records[i - 1];

                                li = $("<li/>");
                                li.html('<a class="custom-TextboxMenu-liMenuRight1" userId="' + record.sysUserId + '">' + record.name + '</a>');
                                s.append(li);

                                _dialog.aTextboxMenuContent_SetCss(li.find("a"));
                            }

                            $("#Ul_bsTextboxMenuContent").find("a").click(_dialog.aTextboxMenuContent_Click);
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
            },
            this._dialog.aTextboxMenu_Click=function(){
            	if ($(this).attr("isAll")) { //执行搜索
                    if ($(this).attr("isAll")=="1") {   //搜索全部
                    	_dialog.loadTextboxMenuContentAll();
                    } else {
                        if ($(this).attr("type") == "department") { //搜索ID
                        	_dialog.loadTextboxMenuContentDepartment($(this).attr("id"));
                        }
                    }
                }
            },
            this._dialog.aTextboxMenuContent_Click=function(){
            	var userid=parseInt($(this).attr("userId"));
            	if(userid==0){//全选／全不选
            		var b=false;
                	var ns=$(".custom-TextboxMenu-liMenuRight2").length;
                	var na=$(".custom-TextboxMenu-liMenuRight1").length;
                	if(ns<na){//全选
                		$(".custom-TextboxMenu-liMenuRight1").each(function(){
                			var userid_c=parseInt($(this).attr("userId"));
                			if(_dialog._arr_select.indexOf(userid_c)<0){
                				_dialog._arr_select.push(userid_c);
                			}
                			$(this).addClass("custom-TextboxMenu-liMenuRight2")
                		});
                	}else{//全不选
                		$(".custom-TextboxMenu-liMenuRight1").each(function(){
                			var userid_c=parseInt($(this).attr("userId"));
                			if(_dialog._arr_select.indexOf(userid_c)>=0){
                				_dialog._arr_select.remove(userid_c);
                			}
                			$(this).removeClass("custom-TextboxMenu-liMenuRight2");
                		});
                	}
            	}else{
            		var b=false;
                	var val=0;
                	for(var i=0;i<_dialog._arr_select.length;i++){
                		if(_dialog._arr_select[i]==userid){
                			b=true;
                			val=_dialog._arr_select[i];
                		}
                	}
                	if(b){
                	    _dialog._arr_select.remove(val);
                	    $(this).removeClass("custom-TextboxMenu-liMenuRight2");
                	}else{
                	    _dialog._arr_select.push(userid);
                	    $(this).addClass("custom-TextboxMenu-liMenuRight2");
                	}
            	}
            	
            },
            this._dialog.aTextboxMenuContent_SetCss = function (target) {
                var userid = parseInt(target.attr("userId"));
                var b = false;
                var val = 0;
                for (var i = 0; i < _dialog._arr_select.length; i++) {
                    if (_dialog._arr_select[i] == userid) {
                        b = true;
                        val = _dialog._arr_select[i];
                    }
                }
                if (b) {
                    target.addClass("custom-TextboxMenu-liMenuRight2");
                } else {
                    target.removeClass("custom-TextboxMenu-liMenuRight2");
                }
            },
            this._dialog.getLiTextboxMenuDepartment=function(){
            	var data = {}, temp="";
                data.sessionid = request("SessionId");
                data.table = "t_department";
                data.constr = " AND userId=0";
                data.orderstr = "ORDER BY treecode ASC";
                data.action = "LOAD_LIST";
                $.ajax({
                    type: "POST",
                    url: GET_DATA,
                    data: data,
                    dataType: 'json',
                    async: false,
                    success: function (response, status, xhr) {
                        if (response.status == "SUCCESS") {
                            var str = "";
                            for (var i = 1; i <= response.records.length; i++) {
                                record = response.records[i - 1];
                                str = str + '<li><a id="' + record.id + '" type="department" isAll="0">' + record.name + '</a></li>';
                            }
                            temp = str;
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
                return temp;
            },
            this._dialog.loadTextboxMenuContentDepartment=function(c_id){
            	var s = $("#Ul_bsTextboxMenuContent");
                s.empty();

                var data = {};
                data.sessionid = request("SessionId");
                data.table = "t_employee";
                data.constr = " AND sysUserId<>0 AND find_in_set('" + c_id + "',departmentId)";
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
                            var li;
                            li = $("<li/>");
                            li.html('<a class="custom-TextboxMenu-liMenuRight1" userId="0">全选／全不选</a>');
                            s.append(li);
                            for (var i = 1; i <= response.records.length; i++) {
                                record = response.records[i - 1];

                                li = $("<li/>");
                                li.html('<a class="custom-TextboxMenu-liMenuRight1" userId="' + record.sysUserId + '">' + record.name + '</a>');
                                s.append(li);

                                _dialog.aTextboxMenuContent_SetCss(li.find("a"));
                            }
                            $("#Ul_bsTextboxMenuContent").find("a").click(_dialog.aTextboxMenuContent_Click);
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
            },
            
            this._dialog.btnSubmit = function () {
                if (_dialog._arr_select.length > 0) {
                    var c_id = "";
                    for(var i=0;i<_dialog._arr_select.length;i++){
                    	c_id = c_id + _dialog._arr_select[i] + ",";
                    }
                    if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }
                    _dialog._para.onSubmit(c_id, _dialog.element);
                    _dialog.dialog("close");

                } else {
                    alert("没有选定任何行");
                }
            };
            this._dialog.btnCancel = function () {
                _dialog.dialog("close");
            };
            this._dialog.checkAll = function () {
                var isChecked = $(this).prop("checked");
                _dialog.find("input[name='check1']").prop("checked", isChecked);
            }
            this._createHtml();
            this._dialog.initDatagrid();

        },
        _createHtml: function () {
            var html = '';
            html += '<div class="custom-TextboxMenu-divMenu">';
            html += '	<div class="custom-TextboxMenu-divMenuLeft">';
            html += '		<ul id="Ul_bsTextboxMenu" class="custom-TextboxMenu-ulMenuLeft"></ul>';
            html += '	</div>';
            html += '	<div class="custom-TextboxMenu-divMenuRight">';
            html += '		<ul id="Ul_bsTextboxMenuContent" class="custom-TextboxMenu-ulMenuRight"></ul>';
            html += '	</div>';
            html += '</div>';
            html += '<div class="divFormButton">';
            html += '   <div class="divFormButtonRight">';
            html += '       <input id="TextboxMenu_Btn_Submit" type="button" class="btnMiddle btnOrange" value="确 定" />';
            html += '       <input id="TextboxMenu_Btn_Cancel" type="button" class="btnMiddle btnGray" value="取 消" />';
            html += '   </div>';
            html += '</div>';
            this._dialog.html(html).dialog({
                autoOpen: false,
                title: "查找" + this._dialog._para.Title,
                modal: true,
                width: "420",
                resizable: false    //是否可以调整对话框的大小，默认为 true
            });

            this._dialog.find("#TextboxMenu_Btn_Submit").click(this._dialog.btnSubmit);
            this._dialog.find("#TextboxMenu_Btn_Cancel").click(this._dialog.btnCancel);
            //this._dialog.find("#TextboxAdvance_Checkbox_All").click(this._dialog.checkAll);

//            html = '';
//            html += '<textarea id="text2" class="custom-TextboxAdvance-input ui-widget ui-widget-content ui-state-default ui-corner-left ui-autocomplete-input"';
//            html += 'style="height: 21px; width: ' + (this._span.width() - 41) + 'px; padding:0 7px 0 7px; color: rgb(50, 50, 50); font-weight: normal; font-size: 12px; line-height:21px; background: rgb(255, 255, 255); resize:none; outline: none; border-radius:2px;"></textarea>';
//            html += '<a class="ui-button ui-widget ui-state-default ui-button-icon-only custom-TextboxAdvance-toggle ui-corner-right btnTextboxAdvance" ';
//            html += 'style="height:21px; width:21px; vertical-align:top; left:-1px;">';
//            html += '<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>';
//            html += '</a>';
//            this._span.html(html);
//            this._dialog._textarea = this._span.find("textarea");
            var _dialog1 = this._dialog;
//            this._span.find("#text2").keydown(function () {
//                event.returnValue = false;
//
//                if (event.keyCode == 8) {
//                    var cursurPosition = 0;
//                    if (this.selectionStart) {//非IE
//                        cursurPosition = this.selectionStart;
//                    } else {//IE
//                        try {
//                            var range = document.selection.createRange();
//                            range.moveStart("character", -this.value.length);
//                            cursurPosition = range.text.length;
//                        } catch (e) {
//                            cursurPosition = 0;
//                        }
//                    }
//                    _dialog1._para.onDelete(cursurPosition, _dialog1.element, _dialog1._textarea);
//                }
//            });
        },
        closeDialog: function () {
            this._dialog.dialog("close");
        },
        openDialog: function () {
            this._dialog.dialog("option", { modal: false }).dialog("open");
            
        }
    });
})(jQuery);


