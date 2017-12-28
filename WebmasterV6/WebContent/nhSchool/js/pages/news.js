var _title = "";
var _datatable = null;
var _datatable_current_page = 0;

$(document).ready(function () {
    init();

    $("#Span_DatagridHeader").text(_title + "列表");
});

//初始化
function init() {
    if (request("tips") == "now") {
        _title = "本周公告";
    } else if (request("tips") == "next") {
        _title = "下周公告";
    } else {
        _title = "历史公告";
    }

    loadList();
}

//加载列表
function loadList() {
    if (_datatable != null) {
        _datatable_current_page = _datatable.fnPagingInfo().iPage;
        _datatable.fnDestroy(); //删除datatable
    }

    var s = $("#Table_Body");
    s.find('tr').remove();

    var data = {};
    data.sessionid = request("SessionId");
    if (request("tips") == "now") {
        data.tips = "NOW";
    } else if (request("tips") == "next") {
        data.tips = "NEXT";
    } else {
        data.tips = "ALL";
    }
    data.action = "NHSCHOOL_LOAD_NEWS";
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

                    tr = $("<tr/>");
                    if (i % 2 != 0) {
                        tr.addClass("odd");
                    }

                    str = "";
                    str = str + '<td>' + record.title + '</td>';
                    str = str + '<td>' + record.term + '</td>';
                    str = str + '<td>' + record.weekName + '</td>';
                    str = str + '<td><div class="btnDatagrid toolbarSearch btnBrowse" title="浏览" id="' + record.id + '"></div></td>';

                    tr.html(str);
                    s.append(tr);
                }

                //事件--点击浏览按钮
                $(".btnBrowse").click(btnBrowse);

                //加载datatalbe
                _datatable = $(".tableDatagrid").dataTable({
                    sPaginationType: "full_numbers" //用于指定分页器风格,'full_numbers' or 'two_button', default 'two_button'
                	, bFilter: false                //开关，是否启用客户端过滤功能,true or false, default true
                	, bLengthChange: false          //开关，是否显示一个每页长度的选择条（需要分页器支持）,true or false, default true
                	, bInfo: false                  //开关，是否显示表格的一些信息,true or false, default true
                	, aoColumnDefs: [{ bSortable: false, aTargets: ['unsortable'] }]    //排序，设置哪些列不排序
                	, aaSorting: [0, 'desc'] 	                //指定按多列数据排序的依据,array array[int,string], 如[], [[0,'asc'], [0,'desc']]
                });
                _datatable.fnPageChange(_datatable_current_page);

                //$("#left").height($("#header").height() + $("#main").height() + 70);

            } else {
                alert(response.errorMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

//按钮-浏览
function btnBrowse() {
    location = "news_browse.html?menuRootId=" + request("menuRootId") + "&tips=" + request("tips") + "&SessionId=" + request("SessionId") + "&id=" + $(this).attr("id");
}


