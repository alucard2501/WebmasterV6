(function ($) {
    $.widget("custom.TextboxAdvance", {
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
                onSubmit: function (ids, element, textarea) {
                    var str1 = "", str2 = "", str = "";
                    if (element.attr("value")) str1 = element.attr("value");
                    str2 = ids;
                    if (str1.length == 0 || str2.length == 0) {
                        str = str1 + str2;
                    } else {
                        str = str1 + "," + str2;
                        var arr1 = str.split(",");
                        var arr = [];
                        for (var i = 0; i < arr1.length; i++) {
                            var b = true;
                            for (var j = 0; j < arr.length; j++) {
                                if (arr1[i] == arr[j]) b = false;
                            }
                            if (b) {
                                arr.push(arr1[i]);
                            }
                        }
                        str = "";
                        for (var i = 0; i < arr.th; i++) {
                            str = str + arr[i];
                            if (i < arr.length - 1) str = str + ",";
                        }
                    }
                    element.val(str);
                    textarea.val(getTextByValue(str, _dialog._para.TextColumn, _dialog._para.ValueColumn, _dialog._para.DataGridId));
                },               // 确定，单选
                onDelete: function (indexof, element, textarea) {
                    var str = textarea.val();
                    var str2 = element.val();
                    var deleteIndex = 0;
                    for (var i = 0; i < indexof; i++) {
                        if (str.substr(i, 1) == "," && i < indexof - 1) deleteIndex = deleteIndex + 1;
                    }
                    var arr1 = str2.split(",");
                    var arr = [];
                    for (var i = 0; i < arr1.length; i++) {
                        if (i != deleteIndex) arr.push(arr1[i]);
                    }
                    var strId = "";
                    for (var i = 0; i < arr.length; i++) {
                        strId = strId + arr[i];
                        if (i < arr.length - 1) strId = strId + ",";
                    }
                    element.val(strId);
                    textarea.val(getTextByValue(strId, _dialog._para.TextColumn, _dialog._para.ValueColumn, _dialog._para.DataGridId));
                },           // 光标索引
                onChange: function (element, textarea) {
                    var strId = element.val();
                    textarea.val(getTextByValue(strId, _dialog._para.TextColumn, _dialog._para.ValueColumn, _dialog._para.DataGridId));
                    var arr = strId.split(",");
                    _dialog.find("input[name='check1']").each(function () {
                    	var $this=$(this);
                    	$this.prop("checked", false);
                    	for(var i=0;i<arr.length;i++){
                    		if($this.val()==arr[i]){
                    			$this.prop("checked", true);
                    		}
                    	}
                    });
                }                     // 填充值
            };
            this._para = $.extend(defaults, this.options);
            this.element.css("display", "none");
            
            this._span = $('<span class="custom-TextboxAdvance" />')
              .insertAfter(this.element);
            if (this.element.css("position") == "absolute") {
                this._span.css({ "position": "absolute", "width": (this.element.width() + 18), "height": this.element.height(), "left": this.element.css("left"), "top": this.element.css("top") })
            }
            this._dialog = $('<div id="Div_Datagrid" />').insertAfter(this.element);
            var _dialog = this._dialog;
            _dialog._para = this._para;
            _dialog._val = '';
            _dialog.records=[];
            _dialog.element = this.element;
            this.element.change(function () {
                _dialog._para.onChange(_dialog.element, _dialog._textarea);
            });
            this._dialog._datatable = null;
            this._dialog._datatable_current_page = 0;
            this._dialog._datagrid_id = 0;
            this._dialog._arr_datagrid = [];      //数据集
            this._dialog._textarea = null;
            this._dialog.initDatagrid = function () {
                var data = {};
                data.sessionid = _dialog._para.SessionId;
                data.datagridId = _dialog._para.DataGridId;
                data.action = "LOAD_DATAGRID_DETAIL";
                $.ajax({
                    type: "POST",
                    url: GET_DATA,
                    data: data,
                    dataType: 'json',
                    async: false,
                    success: function (response, status, xhr) {
                        if (response.status == "SUCCESS") {
                            _dialog._arr_datagrid = new Array();

                            for (var i = 1; i <= response.records.length; i++) {
                                var record = response.records[i - 1];

                                var item = {};
                                item.caption = record.caption;
                                item.mappingName = record.mappingName;
                                item.width = record.width;
                                item.valueType = record.valueType;
                                item.columnType = record.columnType;
                                _dialog._arr_datagrid.push(item);
                            }
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
            },
            this._dialog.loadList = function () {
                if (_dialog._datatable != null) {
                    _dialog._datatable = _dialog._datatable.fnPagingInfo().iPage;
                    _dialog._datatable.fnDestroy(); //删除datatable
                }
                var total_width=0;
                var s = _dialog.find("#TextboxAdvance_Table_Body");
                s.find('tr').remove();
                //加载动态表头
                _dialog.find(".thDatagridColumn").remove();
                for (var j = _dialog._arr_datagrid.length - 1; j >= 0; j--) {
                	// style="width:' + _dialog._arr_datagrid[j].width + 'px;"
                    _dialog.find(".thDatagridColumn0").after($('<th class="thDatagridColumn">' + _dialog._arr_datagrid[j].caption + '</th>'));
                    total_width+=parseInt(_dialog._arr_datagrid[j].width);
                }
                var data = {};
                data.sessionid = _dialog._para.SessionId;
                data.datagridId = _dialog._para.DataGridId;
                data.constr = "";
                data.action = "LOAD_ORDER";
                $.ajax({
                    type: "POST",
                    url: GET_DATA,
                    data: data,
                    dataType: 'json',
                    async: false,
                    success: function (response, status, xhr) {
                        if (response.status == "SUCCESS") {
                            var tr, str;
                            _dialog.records=response.records;
                            for (var i = 1; i <= _dialog.records.length; i++) {
                                var record = _dialog.records[i - 1];
                                record.TAIsSelected=false;
                                tr = $("<tr/>");
                                if (i % 2 != 0) {
                                    tr.addClass("odd");
                                }

                                str = '<td class="tdCellCheckBox"><input type="checkbox" name="check1" value="' + record[_dialog._para.ValueColumn] + '" /></td>';

                                /*******************************************************************/
                                //动态读取列表字段
                                for (var j = 0; j < _dialog._arr_datagrid.length; j++) {
                                    if (_dialog._arr_datagrid[j].valueType == "System.DateTime") {
                                        //处理日期格式
                                        str = str + '<td>' + record[_dialog._arr_datagrid[j].mappingName].replace(" 00:00:00.0", "") + '</td>';
                                    } else if (_dialog._arr_datagrid[j].valueType == "System.Boolean") {
                                        //布尔类型
                                        if (record[_dialog._arr_datagrid[j].mappingName] == "true") {
                                            str = str + '<td>√</td>';
                                        } else {
                                            str = str + '<td></td>';
                                        }
                                    } else if (_dialog._arr_datagrid[j].columnType == "4") {
                                        //图片
                                        var src = getImageSrcById(record[_dialog._arr_datagrid[j].mappingName]);
                                        if (src != '') {
                                            src = '../images/upload/' + src;
                                            str = str + '<td><a href="' + src + '" class="galleryA"><img src="' + src + '" class="imgDatagrid" /></a></td>';
                                        } else {
                                            str = str + '<td></td>';
                                        }
                                    } else {
                                        str = str + '<td>' + record[_dialog._arr_datagrid[j].mappingName] + '</td>';
                                    }
                                }
                                /*******************************************************************/
                                tr.html(str);
                                s.append(tr);
                            }
                            _dialog.find("input[name='check1']").change(function(){
                            	_dialog.resetValue($(this).val(),this.checked);
                            });
                            _dialog.find(".galleryA").colorbox({ rel: 'galleryA' });

                            //全选按钮变回空
                            _dialog.find("#TextboxAdvance_Checkbox_All").prop("checked", false);

                            //加载datatalbe
                            var columns_config=[];
                            var column_config={};
                            column_config.width="64";
                            columns_config.push(column_config);
                            for(var i=0;i<_dialog._arr_datagrid.length;i++){
                            	column_config={};
                            	column_config.width=_dialog._arr_datagrid[i].width;
                                columns_config.push(column_config);
                            }
                            _dialog._datatable = _dialog.find("#TextboxAdvance_Table_Datagrid").dataTable({
                                sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                                , autoWidth: false
                                , bFilter: true                //开关，是否启用客户端过滤功能,true or false, default true
                                , bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                                , bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                                , columnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                            	, columns:columns_config
                                , aaSorting: [1, 'asc'] 	    //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
                                , scrollX: true      	    //
                            });
                            
                            
                            _dialog.find("#TextboxAdvance_Table_Datagrid").width(total_width);
                            _dialog.find(".dataTables_wrapper").width("100%");
                            _dialog.find(".dataTables_scrollHeadInner").width(total_width);
                            
                            
                        } else {
                            alert(response.errorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest);
                    }
                });
            },
            this._dialog.btnSubmit = function (table) {
//            	var c_id = "";
//            	//alert(_dialog._datatable.api().rows().nodes().length);
//                if (_dialog.find("input[name='check1']:checked").length > 0) {
//                    var c_id = "";
//                    _dialog.find("input[name='check1']:checked").each(function () {
//                        c_id = c_id + $(this).val() + ",";
//                    });
//                    if (c_id.length > 0) { c_id = c_id.substr(0, c_id.length - 1) }
//
//                    _dialog._para.onSubmit(c_id, _dialog.element,_dialog._textarea);
            	_dialog.dialog("close");
//
//                } else {
//                    alert("没有选定任何行");
//                }
            };
            this._dialog.btnCancel = function () {
                _dialog.dialog("close");
            };
            this._dialog.checkAll =function() {
                var isChecked = $(this).prop("checked");
                for (var i = 1; i <= _dialog.records.length; i++) {
                    var record = _dialog.records[i - 1];
                    record.TAIsSelected=isChecked;
            	}
                
                //var strId = _dialog.element.val();
            	//var temp=strId.split(",");
            	var result="";
            	for (var i = 1; i <= _dialog.records.length; i++) {
                    var record = _dialog.records[i - 1];
                    if(record.TAIsSelected){
                    	result=result+record[_dialog._para.ValueColumn]+",";
                    }
            	}
            	if(result.length>0){
            		result=result.substr(0,result.length-1);
            	}
            	_dialog.element.val(result);
            	_dialog.element.trigger("change");
            }
            this._dialog.resetValue =function(value,check) {
            	for (var i = 1; i <= _dialog.records.length; i++) {
                    var record = _dialog.records[i - 1];
                    if(record[_dialog._para.ValueColumn]==value){
                    	record.TAIsSelected=check;
                    }
            	}
//            	var strId = _dialog.element.val();
//            	var temp=strId.split(",");
            	var result="";
            	for (var i = 1; i <= _dialog.records.length; i++) {
                    var record = _dialog.records[i - 1];
                    if(record.TAIsSelected){
                    	result=result+record[_dialog._para.ValueColumn]+",";
                    }
            	}
//            	var b=false;
//            	for(var i=0;i<temp.length;i++){
//            		var val=temp[i];
//            		if(val.length>0){
//            			if(parseInt(val)==parseInt(value)){
//                			if(check){
//                				result=result+value+",";
//                				b=true;
//                			}
//                		}else{
//                			result=result+val+",";
//                		}
//            		}
//            	}
//            	if(check&&(!b)){
//            		result=result+value+",";
//            	}
            	if(result.length>0){
            		result=result.substr(0,result.length-1);
            	}
            	_dialog.element.val(result);
            	_dialog.element.trigger("change");
            }
            this._createHtml();
            this._dialog.initDatagrid();
            this._dialog.loadList();

            this._span.find(".btnTextboxAdvance").click(function () {
                _dialog.dialog("option", { modal: false }).dialog("open");
                _dialog._datatable.api().columns.adjust().draw();
            });
        },
        _createHtml: function () {
            var html = '';
            html += '<div class="divDatagridBody" style="margin: 0; border: 0; font: normal 13px 微软雅黑; ">';
            html += '	<table id="TextboxAdvance_Table_Datagrid" class="tableDatagrid">';
            html += '		<thead>';
            html += '		    <tr>';
            html += '	            <th class="unsortable thDatagridColumn0" width="20px" style="width:20px;"><input id="TextboxAdvance_Checkbox_All" type="checkbox" /></th>';
            html += '	        </tr>';
            html += '	    </thead>';
            html += '		<tbody id="TextboxAdvance_Table_Body"></tbody>';
            html += '   </table>';
            html += '</div>';
            html += '<div class="divFormButton">';
            html += '   <div class="divFormButtonRight">';
            html += '       <input id="TextboxAdvance_Btn_Submit" type="button" class="btnMiddle btnOrange" value="确 定" />';
            html += '       <input id="TextboxAdvance_Btn_Cancel" type="button" class="btnMiddle btnGray" value="取 消" />';
            html += '   </div>';
            html += '</div>';
            this._dialog.html(html).dialog({
                autoOpen: false,
                title: "查找" + this._dialog._para.Title,
                modal: true,
                width: "420",
                resizable: true    //是否可以调整对话框的大小，默认为 true
            });
            var dheight=this._dialog.height();
            this._dialog.find("#TextboxAdvance_Btn_Submit").click(this._dialog.btnSubmit);
            this._dialog.find("#TextboxAdvance_Btn_Cancel").click(this._dialog.btnCancel);
            this._dialog.find("#TextboxAdvance_Checkbox_All").click(this._dialog.checkAll);

            html = '';
            html += '<textarea id="text2" class="custom-TextboxAdvance-input ui-widget ui-widget-content ui-state-default ui-corner-left ui-autocomplete-input"';
            html += 'style="height: 21px; width: ' + (this._span.width() - 41) + 'px; padding:0 7px 0 7px; color: rgb(50, 50, 50); font-weight: normal; font-size: 12px; line-height:21px; background: rgb(255, 255, 255); resize:none; outline: none; border-radius:2px;"></textarea>';
            html += '<a class="ui-button ui-widget ui-state-default ui-button-icon-only custom-TextboxAdvance-toggle ui-corner-right btnTextboxAdvance" ';
            html += 'style="height:21px; width:21px; vertical-align:top; left:-1px;">';
            html += '<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>';
            html += '</a>';
            this._span.html(html);
            this._dialog._textarea = this._span.find("textarea");
            var _dialog1 = this._dialog;
            this._span.find("#text2").keydown(function () {
                event.returnValue = false;

                if (event.keyCode == 8) {
                    var cursurPosition = 0;
                    if (this.selectionStart) {//非IE
                        cursurPosition = this.selectionStart;
                    } else {//IE
                        try {
                            var range = document.selection.createRange();
                            range.moveStart("character", -this.value.length);
                            cursurPosition = range.text.length;
                        } catch (e) {
                            cursurPosition = 0;
                        }
                    }
                    _dialog1._para.onDelete(cursurPosition, _dialog1.element, _dialog1._textarea);
                }
            });
        },
        closeDialog: function () {
            this._dialog.dialog("close");
        },
        openDialog: function () {
            this._dialog.dialog("option", { modal: false }).dialog("open");
        }
    });
})(jQuery);


