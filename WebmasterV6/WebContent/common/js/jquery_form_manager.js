

(function ($) {
    //bindColumn
    $.extend($.fn, {
        cleanData: function (isinit,form) {
            var $form = $(this);
            $form.find('textarea,input,select,img,span').each(function () {
                var $el = $(this);
                if (!($el.attr("bindColumn") || $el.attr("getColumn"))) return;

                //$form.find('textarea,input,select,img')
                if ((!isinit) && $el.attr("isClean")) return;
                if ($el.attr("formulaEvent") == "128") {//保存前执行
                    if ($el.attr("formula")) $el.val(getFormula($el.attr("formula"),form));
                    $el.trigger("change");
                }
                if ($el[0].tagName == 'TEXTAREA' && $el.attr("isEditor")) {
                    $el.val("");
                    var o = $el.cleditor()[0];
                    o.updateFrame();
                    return;
                }
                if ($el.attr("isDateTime")) {
                    if ($el.attr("defaultValue") == "3") {
                        //今日
                        var date = new Date();
                        var seperator1 = "-";
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                            strDate = "0" + strDate;
                        }
                        var currentdate = year + seperator1 + month + seperator1 + strDate;
                        $el.val(currentdate);
                    } else if ($el.attr("defaultValue") == "4") {
                        //现在时间
                        var date = new Date();
                        var seperator1 = "-";
                        var seperator2 = ":";
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        var second = date.getSeconds();
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                            strDate = "0" + strDate;
                        }
                        if (hour >= 1 && hour <= 9) {
                            hour = "0" + hour;
                        }
                        if (minute >= 1 && minute <= 9) {
                            minute = "0" + minute;
                        }
                        if (second >= 1 && second <= 9) {
                            second = "0" + second;
                        }
                        var currentdate = year + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + minute + seperator2 + second;
                        $el.val(currentdate);
                    } else {
                        $el.val("");
                    }
                    return;
                }

                if ($el[0].tagName == "IMG" && ($el.attr("bindColumn") || $el.attr("getColumn"))) {
                    $el[0].src = ($el.attr("defaultValue") || '');
                    return;
                }
                if ($el[0].tagName == "SPAN" && ($el.attr("bindColumn") || $el.attr("getColumn"))) {
                    $el[0].innerText = ($el.attr("defaultValue") || '');
                    return;
                }
                if ($el[0].tagName == 'SELECT') {
                    if ($el.attr("formulaEvent") == "128") return;
                    if (!$el[0][$el.attr("defaultIndex")]) {
                        $el[0].selectedIndex=-1;
                    } else {
                        $el.val($el[0][$el.attr("defaultIndex") || '0'].value);
                    }
                    $el.trigger("change");
                    return;
                }
                var elementType = $el.attr('type');
                if (elementType !== 'submit' && elementType !== 'checkbox' && elementType !== 'radio' && elementType !== 'button') {
                    $el.val($el.attr("defaultValue") || '');
                    $el.trigger("change");
                }
                if (elementType == 'checkbox') {
                    if ($el.attr("defaultValue") && $el.attr("defaultValue") != "False" && $el.attr("defaultValue") != "0") {
                        $el.attr("checked", true);
                    } else {
                        $el.attr("checked", false);
                    }
                }
            });

        },
        saveData: function (callback, errorCallback,form) {
            var reglt = /</g;
            var reggt = />/g;
            var regamp = /&/g;
            var regquot = /"/g;
            var regbr = /<BR>/g;
            var regimg = new RegExp('../images/upload', 'g');
            var data = {};
            var $form = $(this);
            var isAddNew = false;   //是否新建
            if ($("#Hidden_Id").val() <= 0) isAddNew = true;
            $form.find('textarea,input,select,img').each(function () {
                var $el = $(this);
                var elementType = $el.attr('type');
                var val = "";
                if (elementType !== 'submit' && elementType !== 'checkbox' && elementType !== 'radio' && elementType !== 'button') {
                    if ($el.val()!= null) val = $el.val().replace(regamp, "&amp;").replace(reglt, "&lt;").replace(reggt, "&gt;").replace(regquot, "&quot;").replace(/'/g, "''");
                    val = val.replace(regimg, '../images/upload');

                    if ($el.attr("formulaEvent") == "8") {//保存前执行
                        if ($el.attr("formula")) val = getFormula($el.attr("formula"),form);
                    }

                    if ($el.attr("IsSaveOnce") == "1") {//一次性保存
                        if (isAddNew) {//新建时保存
                            if ($el.attr("bindColumn") || $el.attr("setColumn")) data[$el.attr("bindColumn") || $el.attr("setColumn")] = val;
                        }
                    } else {
                        if ($el.attr("bindColumn") || $el.attr("setColumn")) data[$el.attr("bindColumn") || $el.attr("setColumn")] = val;
                    }
                }
                if (elementType == 'text' && $el.attr("NotShowZero")=="1") {
                    if ($el.val() == "") {
                        data[$el.attr("bindColumn") || $el.attr("setColumn")] = "0";
                    }
                }
                if (elementType == 'text' && $el.attr("isFile") == "1") {//文件类型
                    if ($el.val() == "") {
                        data[$el.attr("bindColumn") || $el.attr("setColumn")] = "0";
                    }
                }
                if ($el.attr("isDateTime") && val=="") {
                    data[$el.attr("bindColumn") || $el.attr("setColumn")] = "1900-01-01 00:00:00";
                }
                if (elementType == 'checkbox' && ($el.attr("bindColumn") || $el.attr("setColumn"))) {
                    if ($el[0].checked) {
                        data[$el.attr("bindColumn") || $el.attr("setColumn")] = "1";
                    } else {
                        data[$el.attr("bindColumn") || $el.attr("setColumn")] = "0";
                    }
                }
                if ($el[0].tagName == "IMG" && ($el.attr("bindColumn") || $el.attr("getColumn"))) {
                    data[$el.attr("bindColumn") || $el.attr("setColumn")] = $el.attr("value");
                }
                if ($el[0].tagName == 'TEXTAREA' && $el.attr("isEditor")) {
                	var temp=$el.val().replace(/'/mg, "\\'");//.replace(/\n/mg, "").replace(/\r/mg, "");
                	//alert(temp);
                    data[$el.attr("bindColumn") || $el.attr("setColumn")] = temp;
                }
            });
            if (data.id <= 0) $form.attr("action", $form.attr("action").replace("EDIT", "ADD"));
            data.sessionid = request("SessionId");
            data.table = $form.attr("tablename");
            data.orderId = $form.attr("orderId");
            if ($form.attr("foreignName")) data.foreignName = $form.attr("foreignName");
            if ($form.attr("foreignValue")) data.foreignValue = $form.attr("foreignValue");
            $.ajax({
                type: "POST",
                url: GET_DATA + "?action=" + $form.attr("action"),
                data: data,
                dataType: 'json',
                async: false,
                success: function (response, status, xhr) {
                    if (response.status == 'SUCCESS') {
                        if (callback != null) callback();
                    } else {
                        try {
                            errorCallback(response.errorMessage);
                        } catch (e) {
                            alert(response.ErrorMessage);
                        }
                    }
                }
            });

        },
        fillData: function (id, action, resulttype, url, callback) {
            if (id == null) return;
            if (id == 0) return;
            var $form = $(this);
            var datatype;
            var regimg = /\.\.\/images\/upload/g;
            if (!resulttype) {
                datatype = 'json'
            } else {
                datatype = 'xml'
            }
            var data = {};
            data.id = id;
            data.table = $form.attr("tablename");
            data.action = action;
            if (url == null) url = GET_DATA;
            data.sessionid = request("SessionId");
            $.ajax({
                type: "GET",
                url: url,
                data: data,
                dataType: 'json',
                async: false,
                success: function (response, status, xhr) {
                    if (response.status != 'SUCCESS') {
                        alert(response.errorMessage);
                        return;
                    }
                    if (response.records.length == 0) return;
                    var record = response.records[0];
                    $form.find('textarea,input,select,img,span').each(function () {
                        var $el = $(this);
                        var elementType = $el.attr('type');
                        //已审核单据，全部控件只读
                        if (record.isChecked == "true") {
                            if (elementType !== 'button') {
                                $el.attr("ReadOnly", true);
                            }

                            if (elementType == 'checkbox') {
                                $el.click(function(){
                                    return false;
                                });
                            }
                        }

                        if ($el.attr("isReadOnlyOnEdit")) $el.attr("ReadOnly", true);
                        if ($el[0].tagName == 'TEXTAREA' && $el.attr("isEditor")) {
                            var o = $el.cleditor()[0];
                            $el.val(record[$el.attr("bindColumn") || $el.attr("getColumn")]);
                            o.updateFrame();
                            return;
                        }
                        if ($el.attr("isDateTime")) {
                            $el.val(record[$el.attr("bindColumn") || $el.attr("getColumn")].replace("1900-01-01", "").replace(".0", "").replace(" 00:00:00", ""));
                            return;
                        }
                        if ($el[0].tagName == "IMG" && ($el.attr("bindColumn") || $el.attr("getColumn"))) {
                            if (record[$el.attr("bindColumn") || $el.attr("getColumn")]) {
                                $el.attr("value", record[$el.attr("bindColumn") || $el.attr("getColumn")]);
                                var src=getImageSrcById(record[$el.attr("bindColumn") || $el.attr("getColumn")]);
                                if (src == "") {
                                    $el[0].src = ($el.attr("defaultValue") || '');
                                } else {
                                    $el[0].src =  src;//'../images/upload/' +
                                }
                            } else {
                                $el.attr("value", "0");
                                $el[0].src = ($el.attr("defaultValue") || '');
                            }
                            return;
                        }
                        if ($el[0].tagName == "SPAN" && ($el.attr("bindColumn") || $el.attr("getColumn"))) {
                            if (record[$el.attr("bindColumn") || $el.attr("getColumn")]) {
                                $el[0].innerText = record[$el.attr("bindColumn") || $el.attr("getColumn")];
                            } else {
                                $el[0].innerText = ($el.attr("defaultValue") || '');
                            }

                            return;
                        }
                        if (elementType !== 'submit' && elementType !== 'checkbox' && elementType !== 'radio' && elementType !== 'button') {
                            if ($el.attr("bindColumn") || $el.attr("getColumn")) {
                            	var val=record[$el.attr("bindColumn") || $el.attr("getColumn")];
                            	if (val!= null) val = val.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/'/g, "''");
                                $el.val(val);
                                $el.trigger("change");
                            }
                        }
                        if (elementType == 'checkbox' && ($el.attr("bindColumn") || $el.attr("getColumn"))) {
                            if (record[$el.attr("bindColumn") || $el.attr("getColumn")].toLowerCase() == 'true') {
                                //$el.attr("checked", "checked");
                                $el[0].checked = true;
                            } else if (record[$el.attr("bindColumn") || $el.attr("getColumn")].toLowerCase() == 'false') {
                                //$el.attr("checked", false);
                                $el[0].checked = false;
                            }
                        }
                        if (elementType == 'text' && $el.attr("NotShowZero") == "1") {
                            if (record[$el.attr("bindColumn") || $el.attr("getColumn")].toLowerCase() == "0" || record[$el.attr("bindColumn") || $el.attr("getColumn")].toLowerCase() == "0.00") {
                                $el.val("");
                            }
                        }
                    });
                    if (callback != null) callback();
                    $("#Div_Form").find(".galleryA").each(function () {
                        $(this).attr("href", $(this).find("img").attr("src"));
                    });
                    if ($("#Div_Form").find(".galleryA").length > 0) {
                        $("#Div_Form").find(".galleryA").colorbox({ rel: 'galleryA' });
                    }
                }
            });
        },
        deleteData: function (action,id) {
            if (!confirm('确定删除此数据？')) return;
            var c_id = 0;
            if (id == null) {
                c_id = $("input[bindColumn=id]")[0].value;
            } else {
                c_id = id;
            }
            var data = {};
            data.action = action;
            data.id = c_id;
            data.table = $(this).attr("tablename");
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
        },
        stopData: function (action, id, isStop) {
            var c_id = 0;
            if (id == null) {
                c_id = $("input[bindColumn=id]")[0].value;
            } else {
                c_id = id;
            }
            var data = {};
            data.action = action;
            data.id = c_id;
            data.table = $(this).attr("tablename");
            data.isStop = isStop;
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
        },
        checkData: function (action, id, isCheck, orderId) {
            var c_id = 0;
            if (id == null) {
                c_id = $("input[bindColumn=id]")[0].value;
            } else {
                c_id = id;
            }
            var data = {};
            data.action = action;
            data.id = c_id;
            data.table = $(this).attr("tablename");
            data.isCheck = isCheck;
            data.orderId = orderId;
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
    });
})(jQuery);

var FormManagerUtils = {};
FormManagerUtils.Editors = new Array();
FormManagerUtils.DatetimePicker = new Array();
FormManagerUtils.initEditor = function (el) {
    var _content = $('<div id="div_' + el.id + '" contentEditable></div>').appendTo($(el).parent());
    el.style.display = "none";
    _content.attr("class", el.className);
    _content.css({ "overflow": "auto", "background": "#FFFFFF", "border": "1px solid #C0C0C0","float":"left" });
    _content.html("");
    var _edit_button = $('<div id="divEditButton' + el.id + '" content="div_' + el.id + '"></div>').css({ "background": "url(../images/datagrid/ico_editor.png)", "float": "left", "width": "16px", "height": "16px", "cursor": "pointer","margin-left":"2px" })
                        .appendTo($(el).parent());
    _edit_button.click(function () {
        $content = $('#' + $(this).attr("content"));
        openDialogEdirot($content.html(), $content[0]);
    });
    return _content;
}

//选择产品图
function openDialogEdirot(content,div) {
    var objs = new Array(content,div)
    var getv = window.showModalDialog('../dialog/dialogEditor.htm', objs, 'dialogWidth=800px;dialogHeight=470px;status=no;scroll=no;location=no');
}



