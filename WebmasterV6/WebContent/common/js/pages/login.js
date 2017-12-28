
$(document).ready(function () {
    $("#Btn_Submit").click(login);
    var domain=location.host;
    if(domain!=null){
    	if(domain=='oa.nhfls.com'){
        	$("#ImgLogo")[0].src="../../nhSchool/images/nhfls.png";
        }
        if(domain=='oa.nhmic.com'){
        	$("#ImgLogo")[0].src="../../nhSchool/images/nhmic.png";
        }
	if(domain=='www.gdyouliao.com:8080'){
        	$("#ImgLogo")[0].src="../../common/images/POLYICON.png";
        }
    }
    
    //$("#Text_Username").val("系统管理员");
    //$("#Text_Pwd").val("1");
    $(document).keydown(function(e){
    	if(parseInt(e.keyCode)==13){
    		login();
    	}
    });
});
//登录动作
function login() {
    var data = {};
    data.username = $("#Text_Username").val();
    data.pwd = $("#Text_Pwd").val();
    data.website = request("website");
    data.action = "CHECK_SYS_USER";
    data.domain=location.host;
    $.ajax({
        type: "POST",
        url: GET_DATA,
        data: data,
        dataType: 'json',
        async: false,
        success: function (response, status, xhr) {
            if (response.status == "SUCCESS") {
                setCookie("SessionId", response.sessionId);
                if (response.homepage) {
                    location = response.homepage;
                } else {
                    location = "index.html?SessionId=" + response.sessionId;
                }
            } else {
                $("#Div_Tips").text(response.errorMessage);
                $("#Text_Pwd").val('');
                $("#Text_Pwd").focus();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}