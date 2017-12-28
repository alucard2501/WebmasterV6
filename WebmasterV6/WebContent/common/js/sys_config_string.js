
//读数据库相关
var GET_DATA = '/WebmasterV6/do';

function checkIsLogin(){
    var sessionid = request("SessionId");
    var session_c=readCookie("SessionId");
    if (sessionid == null) {
    	location = "/WebmasterV6/common/cn/login.html";
    	return;
    }
    if(session_c!=sessionid){
    	location = "/WebmasterV6/common/cn/login.html";
    	return;
    }
    var data = {};
    data.sessionid = sessionid;
    data.action = "CHECK_IS_LOGIN"
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status != "SUCCESS") {
            	location = "/WebmasterV6/common/cn/login.html";
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

//初始化系统
function initSystem() {
    var data = {};
    data.sessionid = request("SessionId");
    data.action = "INIT_SYSTEM";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var src = response.srcJs;
                var lan = response.lan;
                var title = response.title;
                if (title) {
                    $("title").text(title); 
                    $("#Div_HeaderTitle").html('<span class="spanHeader">' + title + '</span>'); //<span class="spanHeader1">WEBMASTER <span class="spanHeader2">V6</span></span><span class="spanHeader3">网站后台管理系统</span>
                } else {
                    $("title").text("BOATSOFT 网站后台管理系统 WEBMASTER V6");
                }
                
                if (src) {
                    include(src);
                }

                if (lan == "en") {
                    include("../../common/js/lan/lan_en.js");
                } else {
                    include("../../common/js/lan/lan_cn.js");
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

/*--获取网页传递的参数--*/

function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}

//==================================
//描述：读取cookies
//程序员：江晓东
//日期：2008-11-23
//参数说明：name--cookies的名字，返回指定cookies的值
//==================================
function readCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
}
function readCookieSecond(name1, name2) {
    var cookieValue = "";
    var search = name2 + "=";
    var firstvalue = readCookie(name1);
    if (firstvalue.length > 0) {
        var offset = firstvalue.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = firstvalue.indexOf("&", offset);
            if (end == -1) end = firstvalue.length;
            cookieValue = unescape(firstvalue.substring(offset, end));
        }
    }
    return cookieValue;
}
function setCookie(name, value) {
	document.cookie = name + '=' + value +";path=/";
    
}

//
function string2Date(datestr) {
    var converted = Date.parse(datestr);
    var myDate = new Date(converted);
    if (isNaN(myDate)) {
        var arys = datestr.split('-');
        myDate = new Date(arys[0], --arys[1], arys[2]);
    }
    return myDate;
}
function dateDiff(interval, date1, date2) {
    var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60,
        'M': 1000 * 60, 'S': 1000, 'T': 1
    };
    interval = interval.toUpperCase();
    var dt1 = Date.parse(date1.replace(/-/g, '/'));
    var dt2 = Date.parse(date2.replace(/-/g, '/'));
    try {
        return Math.round((dt2 - dt1) / eval('(objInterval.' + interval + ')'));
    }
    catch (e) {
        return e.message;
    }
}
//==================================
//描述：重载setTimeout方法，使之可以执行带参数的函数
//程序员：江晓东
//日期：2008-11-23
//参数说明：name--cookies的名字，返回指定cookies的值
//==================================
_setTimeout = function (callback, timeout, param) {
    var args = Array.prototype.slice.call(arguments, 2);
    var _cb = function () {
        callback.apply(null, args);
    }
    setTimeout(_cb, timeout);
}
//==================================
//描述：只适用于宝特工作室的网站，用于后台转换图片路径
//程序员：江晓东
//==================================
function resetImagePath(sourcePath) {
    if (sourcePath == null) return "";
    if (sourcePath.substring(0, 4) == 'http')return sourcePath
    var regimg = /\.\.\/images\/upload/g;
    return sourcePath.replace(regimg, '../images/upload');
}
//==================================
//描述：只适用于宝特工作室的网站，用于后台转换图片路径
//程序员：江晓东
//==================================
function cleanImage(target_img, target_hidden) {
    target_img.attr("src", target_img.attr("defaultValue") || '');
    target_hidden.val(target_hidden.attr("defaultValue") || '');
}
//==================================
//描述：通用打开编辑窗口对话框
//程序员：江晓东
//==================================
function openDialogEdit(url) {
    var objs = new Array();
    var getv = window.showModalDialog(url, objs, 'dialogWidth=800px;dialogHeight=470px;status=no;scroll=auto;location=no');
    return getv;
}
//==================================
//描述：强制保留两位小数
//程序员：WEB
//==================================
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

//==================================
//描述：sql日期转换成标准日期yyyy-MM-dd
//程序员：WEB
//==================================
function data_string(str) {
    var d = new Date(parseInt(str));
    var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]); return ar_date.join('-');
    function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
}
//==================================
//描述：js日期格式化
//程序员：WEB
//var time1 = new Date().Format("yyyy-MM-dd");
//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");  
//==================================
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//==================================
//描述：判断是手机版还是PC版
//程序员：WEB
//==================================
function uaredirect() {
    try {
        if (document.getElementById("bdmark") != null) {
            return false;
        }
        var urlhash = window.location.hash;
        if (!urlhash.match("fromapp")) {
            if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i))) {
                return true;
            }
        }
        return false;
    } catch (err) {
        return false;
    }
}

// ==================================
// js从数组中删除指定值（不是指定位置）的元素
// ==================================
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// ==================================
// 根据图片ID获取图片路径
// ==================================
function getImageSrcById(id) {
    var src = "";
    var data = {};
    data.sessionid = request("SessionId");
    data.action = "FILL_SYS_IMAGES";
    data.id = id;
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                if (response.records.length > 0) {
                    record = response.records[0];
                    src = record.srcLFull;
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
    return src;
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix){
    return this.slice(0, prefix.length) === prefix;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}


//==================================
//根据文件ID获取文件信息
//==================================
function getFileInfoById(id) {
var fileInfo = {};
var data = {};
data.sessionid = request("SessionId");
data.action = "FILL_SYS_FILE";
data.id = id;
$.ajax({
   type: "POST",
   url: GET_DATA,
   data: data,
   dataType: 'json',
   async: false,
   success: function (response, status, xhr) {
       if (response.status == "SUCCESS") {
           if (response.records.length > 0) {
               record = response.records[0];
               fileInfo.path = record.pathFull;
               fileInfo.name = record.name;
               fileInfo.size = record.size;
               fileInfo.extName = record.extName;
               fileInfo.countPreviewPic = record.countPreviewPic;
           }
       } else {
           alert(response.errorMessage);
       }
   },
   error: function (XMLHttpRequest, textStatus, errorThrown) {
       alert(XMLHttpRequest);
   }
});
return fileInfo;
}

// ==================================
// 比如我们想1024MB转换成1GB，那就需要进行转换
// ==================================
function bytesToSize(bytes) {  
    if (bytes === 0) return '0 B';  
    var k = 1024;  
    sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];  
    i = Math.floor(Math.log(bytes) / Math.log(k));  
    var num = bytes / Math.pow(k, i);
    return num.toPrecision(3) + ' ' + sizes[i];
    //return (bytes / Math.pow(k, i)) + ' ' + sizes[i]; 
    //toPrecision(3) 后面保留一位小数，如1.0GB //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];                                                                                                                //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
}  

//根据系统用户ID获取系统用户名
function getSysUsernameById(ids) {
    var temp = "";
    var arr = ids.split(",");
    for (var i = 0; i < arr.length; i++) {
        //读取用户名
        var data = {};
        data.sessionid = request("SessionId");
        data.table = "t_sys_user";
        data.id = arr[i];
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
                        if (record.realname == "") {
                            temp = temp + record.username;
                        } else {
                            temp = temp + record.realname;
                        }
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

// ==================================
// 获取参数,例如paramsStr="DataGridId=9;ValueColumn=id;TextColumn=name;Mode=0;",name="DataGridId",defaultvalue=""
// ==================================
function getParam(paramsStr, name, defaultvalue, splitchar) {
    var c = "";
    if (splitchar == null) {
        c = ";";
    } else {
        c = splitchar;
    }
    var items=paramsStr.split(c);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.length>0 && item.indexOf("=")>-1){
            if(item.startsWith(name + "=")){
                return item.replace(name + "=", "");
            }
        }
    }
    return defaultvalue;
}


// ==================================
// 根据值获取显示文本:ids值1，2，3；sql：查询语句
// ==================================
function getTextByValue(ids, textColumn, valueColumn, datagridid) {
    var temp = "";
    var arr = ids.split(",");
    for (var i = 0; i < arr.length; i++) {
    	if(arr[i].length>0){
    		//读取用户名
            var data = {};
            data.sessionid = request("SessionId");
            data.id = arr[i];
            data.datagridid = datagridid;
            data.valueColumn = valueColumn;
            data.action = "GET_TEXT_BY_VALUE";
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
                            temp = temp + record[textColumn];
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
        
    }
    return temp;
}

// ==================================
// 根据公式获取值
// ==================================
function getFormula(formula,form) {
	if(form!=null){
		for(var i=0;i<form.items.length;i++){
			var item=form.items[i];
			formula=formula.replace("{" + item.attr("itemname") + "}",item.val());
		}
	}
    var temp = "";
    var data = {};
    data.sessionid = request("SessionId");
    data.formula = formula;
    data.action = "GET_FORMULA";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                if (response.formulaValue.length > 0) {
                    temp = response.formulaValue;
                }
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
    return temp;
}

//引入js文件
function include(path) {
    var a = document.createElement("script");
    a.type = "text/javascript";
    a.src = path;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(a);
}

//初始化语言包
function initSystemLan() {
    loadDoucument();

    /**********************************************************/
    /*通用*/
    $("#Header_Pwd").text(LAN.Header_Pwd);
    $("#Btn_ReLogin").text(LAN.Btn_ReLogin);

    $("#Tool_Add").text(LAN.Tool_Add);
    $("#Tool_Edit").text(LAN.Tool_Edit);
    $("#Tool_Delete").text(LAN.Tool_Delete);
    $("#Tool_Stop").text(LAN.Tool_Stop);
    $("#Tool_Remove").text(LAN.Tool_Remove);
    $("#Tool_Refresh").text(LAN.Tool_Refresh);
    $("#Tool_Setting").text(LAN.Tool_Setting);

    $("#Filter_Code").text(LAN.Filter_Code);
    $("#Filter_Name").text(LAN.Filter_Name);
    $("#Filter_Parent").text(LAN.Filter_Parent);
    $("#Btn_Search").val(LAN.Btn_Search);
    $("#Btn_Clean").val(LAN.Btn_Clean);

    $("#Th_Code").text(LAN.Th_Code);
    $("#Th_Name").text(LAN.Th_Name);
    $("#Th_Stop").text(LAN.Th_Stop);
    $("#Th_Control").text(LAN.Th_Control);
    $("#Th_Sort").text(LAN.Th_Sort);
    $("#Th_Parent").text(LAN.Th_Parent);

    $("#Btn_SaveNew").val(LAN.Btn_SaveNew);
    $("#Btn_Submit").val(LAN.Btn_Submit);
    $("#Btn_Cancel").val(LAN.Btn_Cancel);

    $("#Label_Code").text(LAN.Label_Code);
    $("#Label_Name").text(LAN.Label_Name);
    $("#Label_Parent").text(LAN.Label_Parent);

    /**********************************************************/
    /*nhSchool*/
    $("#Tool_Read").text(LAN.Tool_Read);
    $("#Tool_UnDelete").text(LAN.Tool_UnDelete);
    $("#Tool_Back").text(LAN.Tool_Back);
    $("#Tool_Next").text(LAN.Tool_Next);
    $("#Tool_Copy").text(LAN.Tool_Copy);

    $("#Th_Title").text(LAN.Th_Title);
    $("#Th_Date").text(LAN.Th_Date);

    $("#Label_To").text(LAN.Label_To);
    $("#Label_Title").text(LAN.Label_Title);
    $("#Label_Content").text(LAN.Label_Content);
    $("#Label_AutoSend").text(LAN.Label_AutoSend);

    $("#Btn_SaveDrafts").val(LAN.Btn_SaveDrafts);
    $(".btn_download").text(LAN.Btn_Download);
    $(".btn_preview").text(LAN.Btn_Preview);
}