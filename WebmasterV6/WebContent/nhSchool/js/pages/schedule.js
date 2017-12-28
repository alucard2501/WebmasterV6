var _lesson_per_day = 0;    //每天多少节课
var _employeeId = 0;
/**1--固定课表，2--临时课表，3--全部**/
var _schedule_flag=1;
$(document).ready(function () {
    _employeeId = getEmployeeIdBySysUserId();
    loadTeacher();
    loadSubject();
    loadList();

    //点击按钮【固定课表】
    $("#Btn_Schedule").click(function () {
        $("#Btn_Schedule").addClass("btnScheduleActive");
        $("#Btn_ScheduleTemp").removeClass("btnScheduleActive");
        $("#Btn_ScheduleAll").removeClass("btnScheduleActive");

        $(".tdScheduleContent").html("");
        $(".tdScheduleContent").removeClass("tdScheduleRed");
        loadSchedule();
    });

    //点击按钮【临时课表】
    $("#Btn_ScheduleTemp").click(function () {
        $("#Btn_Schedule").removeClass("btnScheduleActive");
        $("#Btn_ScheduleTemp").addClass("btnScheduleActive");
        $("#Btn_ScheduleAll").removeClass("btnScheduleActive");

        $(".tdScheduleContent").html("");
        $(".tdScheduleContent").removeClass("tdScheduleRed");
        loadSchedule();
        loadScheduleTemp();
    });

    //点击按钮【全部课表】
    $("#Btn_ScheduleAll").click(function () {
        $("#Btn_Schedule").removeClass("btnScheduleActive");
        $("#Btn_ScheduleTemp").removeClass("btnScheduleActive");
        $("#Btn_ScheduleAll").addClass("btnScheduleActive");

        $(".tdScheduleContent").html("");
        $(".tdScheduleContent").removeClass("tdScheduleRed");
        loadSchedule();
        loadScheduleTemp();
    });
    initForm();
    
});
//初始化编辑对话框

function initForm(){
	
	$("#Div_Form").dialog({
        autoOpen: false,
        title: '编辑课表',
        modal: true,
        width: 472,
        resizable: false    //是否可以调整对话框的大小，默认为 true
    });
	$("#Btn_Cancel").click(function(){
	    $("#Div_Form").dialog("close");
	});
	$("#Btn_Submit").click(function(){
		if ($('#form1').validate()) {
	        $('#form1').saveData(saveSuccess, saveError);
	        $("#Div_Form").dialog("close");
	    }
	});
	$("#Div_FormControl").height(137);
	$("#item478").combobox();
	$("#item480").combobox();
	$("#item482").combobox();
	$("#item484").combobox();
	$("#item486").combobox();
	$("#item488").datepicker({
        dateFormat: 'yy-mm-dd'
    });
}

//执行保存后返回效果
function saveSuccess() {
	if(_schedule_flag==1){
		loadSchedule();
	}else if(_schedule_flag==2){
		loadScheduleTemp();
	}
}
function saveError(errorMessage) {
    alert(errorMessage);
}
//加载列表
function loadList() {
    var tr, str, i, j, data;
    var count_lesson = 0; //一周总节数

    var s = $("#Table_Schedule");
    s.find('tr').remove();

    //加载星期
    tr = $("<tr/>");
    str = "";
    str = str + '<td colspan="2" rowspan="2"></td>';
    str = str + '<td colspan="6">一</td>';
    str = str + '<td colspan="6">二</td>';
    str = str + '<td colspan="6">三</td>';
    str = str + '<td colspan="6">四</td>';
    str = str + '<td colspan="6">五</td>';
    tr.html(str);
    s.append(tr);

    //加载课时
    tr = $("<tr/>");
    str = "";
    for (j = 1; j <= 5; j++) {
        data = {};
        data.sessionid = request("SessionId");
        data.table = "t_b_lesson";
        data.orderstr = "ORDER BY code ASC";
        data.action = "LOAD_LIST";
        $.ajax({
            type: "POST",
            url: GET_DATA,
            data: data,
            dataType: 'json',
            async: false,
            success: function (response, status, xhr) {
                if (response.status == "SUCCESS") {
                    _lesson_per_day = response.records.length;
                    for (i = 1; i <= response.records.length; i++) {
                        record = response.records[i - 1];
                        str = str + '<td>' + record.code + '</td>';
                        count_lesson = count_lesson + 1;
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
    tr.html(str);
    s.append(tr);

    //加载年级、班级
    var strtemp = "", grade="";

    data = {};
    data.sessionid = request("SessionId");
    data.table = "v_b_class";
    data.constr = "AND YEAR(now())-yearRegister<9";
    data.orderstr = "ORDER BY yearRegister DESC, code ASC";
    data.action = "LOAD_LIST";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
            	var select_class=$("#item482");
            	select_class.empty();
                for (i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];
                    $('<option value="' + record.id + '">'+ record.grade + record.name +'</option>').appendTo(select_class);
                    tr = $("<tr/>");
                    str = "";
                    strtemp = "";
                    if (i == 1) strtemp = ' style="width:16px;"';
                    if (grade != record.grade) {
                        str = str + '<td' + strtemp + ' rowspan="' + getCountByGrade(record.grade) + '">' + record.grade + '</td>';
                        grade = record.grade;
                    }
                    str = str + '<td' + strtemp + '>' + record.name.replace("班", "") + '</td>';
                    for (j = 1; j <= count_lesson; j++) {
                        str = str + '<td id="tdSchedule_' + record.id + '_' + j + '" class="tdScheduleContent"></td>'; //tdSchedule_ClassId_(count_lesson)
                    }
                    tr.html(str);
                    s.append(tr);
                }
                $(".tdScheduleContent").click(ScheduleContent_Click);
            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });

    //加载具体内容（课程、教师）
    loadSchedule();
    loadScheduleTemp();

    //计算高度
    //$("#left").height($("#header").height() + $("#main").height() + 70);
}
function ScheduleContent_Click(){
	//alert(this.id);
	var schedule=$(this).data("schedule");
	var temp=this.id.split("_");
	if(temp.length<3)return;
	var classid=temp[1];
	var lession_index=temp[2];
	var weekday=Math.ceil(lession_index / _lesson_per_day);
	var lession=lession_index % _lesson_per_day;
	var d=new Date();
	var cur_weekday=d.getDay();
	if(cur_weekday==0)cur_weekday=7;
	
	d.setDate(d.getDate()+(weekday-cur_weekday)); 
	$("#item488").val(d.Format("yyyy-MM-dd"));
	if(lession==0)lession=_lesson_per_day;
	$("#item478").val(weekday).trigger("change");
	$("#item480").val(lession).trigger("change");
	$("#item482").val(classid).trigger("change");
	if(schedule!=null){
		$("#item484").val(schedule.subject).trigger("change");
		$("#item486").val(schedule.employeeId).trigger("change");
	}else{
		$("#item484")[0].selectedIndex=-1;
		$("#item486")[0].selectedIndex=-1;
		$("#item484").trigger("change");
		$("#item486").trigger("change");
	}
	
	$("#Div_Form").dialog("option", { modal: false }).dialog("open");
}
//获取某年级有多少个班
function getCountByGrade(grade) {
    var c = 0;

    var data = {};
    data.action = "NHSCHOOL_GET_COUNT_BY_GRADE";
    data.grade = grade;
    data.sessionid = request("SessionId");
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == 'SUCCESS') {
                if (response.records.length > 0) {
                    c = response.records[0].countGrade;
                }
            } else {
                alert(response.errorMessage);
            }
        }
    });

    return c;
}
function loadTeacher(){
	//t_employee
	var data = {};
    data.sessionid = request("SessionId");
    data.table = "t_employee";
    data.action = "LOAD_LIST";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var record;
                var select_teacher=$("#item486");
                for (i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];
                    $('<option value="'+ record.id +'">'+ record.name +'</option>').appendTo(select_teacher);
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
function loadSubject(){
	var data = {};
    data.sessionid = request("SessionId");
    data.table = "t_b_subject";
    data.action = "LOAD_LIST";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var record;
                var select_subject=$("#item484");
                for (i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];
                    $('<option value="'+ record.name +'">'+ record.name +'</option>').appendTo(select_subject);
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
//加载固定课表具体内容（课程、教师）
function loadSchedule() {
	_schedule_flag=1;
	$('#form1').attr("action","NHSCHOOL_SAVE_SCHEDULE");
	$("#item487").css("display","none");
	$("#item488").css("display","none");
    var tdName = "";
    var data = {};
    data.sessionid = request("SessionId");
    data.table = "v_schedule";
    data.action = "LOAD_LIST";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var record;

                for (i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];

                    tdName = "tdSchedule_" + record.classId + "_" + (_lesson_per_day * (parseInt(record.day) - 1) + parseInt(record.lessonCode));
                    $("#" + tdName).html(record.subject.substring(0, 1) + "(" + record.employee.substring(0, 1) + ")").data("schedule",record);
                    if (_employeeId == record.employeeId && _employeeId>0) $("#" + tdName).addClass("tdScheduleRed");
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

//加载临时课表具体内容（课程、教师）
function loadScheduleTemp() {
	$('#form1').attr("action","NHSCHOOL_SAVE_SCHEDULE_TEMP")
	$("#item487").css("display","");
	$("#item488").css("display","");
	_schedule_flag=2;
    var tdName = "";
    var data = {};
    data.sessionid = request("SessionId");
    data.table = "v_schedule_temp";
    data.constr = "AND date BETWEEN subdate(curdate(),date_format(curdate(),'%w')) AND subdate(curdate(),date_format(curdate(),'%w')-6)";
    data.action = "LOAD_LIST";
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                var record;

                for (i = 1; i <= response.records.length; i++) {
                    record = response.records[i - 1];

                    tdName = "tdSchedule_" + record.classId + "_" + (_lesson_per_day * (parseInt(record.day) - 1) + parseInt(record.lessonCode));
                    $("#" + tdName).html(record.subject.substring(0, 1) + "(" + record.employee.substring(0, 1) + ")").data("schedule",record);
                    if (_employeeId == record.employeeId && _employeeId>0) {
                        $("#" + tdName).addClass("tdScheduleRed");
                    } else {
                        $("#" + tdName).removeClass("tdScheduleRed");
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
}
