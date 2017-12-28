package com.boatsoft.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.boatsoft.action.MyAction;
import com.boatsoft.common.BasicFunction;
import com.boatsoft.common.MResult;
import com.boatsoft.common.MResult.ActionResultStatus;

import com.boatsoft.common.MSession;
import com.nhschool.action.NhschoolAction;

public class DoServlet extends HttpServlet {
	
	private static ArrayList<MSession> _session_list;
	private MyAction _my_action;
	private NhschoolAction _nhschool_action;
	
	
	public static ArrayList<MSession> getSessionList(){
		return _session_list;
	}
	
	@Override
	public void init(){
		try {
			super.init();
			
			Timer timer = new Timer(true);
			timer.schedule(timeTick,0, 1000); 
			_session_list=new ArrayList<MSession>();
			if(_my_action==null)_my_action=new MyAction();
			if(_nhschool_action==null)_nhschool_action=new NhschoolAction();
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	@Override
	public void init(ServletConfig config){
		try {
			super.init(config);
			
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	TimerTask timeTick = new TimerTask(){  
        public void run() {  
        	for(MSession s:_session_list){
        		s.timeTick();
        		
        	}
        	for(MSession s:_session_list){
        		if(s.getTimeLimit()<=0){
        			_session_list.remove(s);
        		}
        	}
        }  
    };
    
    public void doGet(HttpServletRequest request,HttpServletResponse response) throws IOException,ServletException{
    	doProcess(request,response);
	}
    public void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException,ServletException {
    	doProcess(request,response);
	}
    private void doProcess(HttpServletRequest request,HttpServletResponse response) throws IOException,ServletException{
    	response.setCharacterEncoding("GB2312");
		PrintWriter out=response.getWriter();
		MResult r=new MResult();
		r.setStatus(ActionResultStatus.SUCCESS);
		String action=request.getParameter("action");
		if(action==null){
			out.println("没有业务");
			return;
		}
		if(action.trim().length()==0){
			out.println("没有业务");
			return;
		}

		r.setOutputType(MResult.OutputType.JSON);
		JSONObject result=new JSONObject();
		try {
			try{
				switch(action){
				case "create_accesstoken":
					break;
				case "CHECK_IS_LOGIN":
					if(!checkIsLogin(result,request))throw new Exception("用户未登陆");
					break;
				case "CHECK_SYS_USER":
					submit(result,request);
//					Cookie oItem;  
//				    // 因为Cookie 中不允许保存特殊字符, 所以采用 BASE64 编码，CookieUtil.encode()是BASE64编码方法,略..  
//				    oItem = new Cookie("SessionId", result.getString("sessionId")); 
//				    //request.getH
//				    oItem.setDomain(request.getLocalName());  //请用自己的域  
//				    oItem.setMaxAge(60); //关闭浏览器后，cookie立即失效          
//				    //oItem.setPath("/");  
//				    response.addCookie(oItem);
					break;
				default:
					if(!checkIsLogin(result,request))throw new Exception("用户未登陆");
					submit(result,request);
					if(result.has("addedId")){
						r.setAddedId(result.getInt("addedId"));
					}
					if(result.has("records")){
						r.setFillRS(result.getJSONArray("records"));
					}
				}
			}catch(Exception e){
				r.setStatus(MResult.ActionResultStatus.ERROR);
				r.setErrorMessage(e.getMessage());
			}
			
			result.put("status", r.getStatus());
			result.put("errorMessage", r.getErrorMessage());
			result.put("addedId", r.getAddedId());
			result.put("records", r.getFillRS());
			result.put("json", r.getJson());
			if(r.getOutputType()==MResult.OutputType.JSON){
				response.setContentType("text/html");
				out.println(result.toString());
				
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			out.println(e.getMessage());
		}
    }
    private void submit(JSONObject result,HttpServletRequest request) throws Exception{
		String action=request.getParameter("action");
		Map<String, String> sParaTemp = new HashMap<String, String>();
		Enumeration<String> paramNames = request.getParameterNames();  
	    while (paramNames.hasMoreElements()) {  
	    	String paramName = (String) paramNames.nextElement(); 
	    	if((!paramName.equals("sign")) && (!paramName.equals("action"))){
	    		String[] paramValues = request.getParameterValues(paramName);  
	    		if (paramValues.length == 1) {  
	    			String paramValue = paramValues[0];  
	    			//if (paramValue.length() != 0) {  
	    				sParaTemp.put(paramName, paramValue);
	    			//}  
	    		} 
	    	}
	    }
	    if(sParaTemp.containsKey("sessionid")){
	    	String sessionid=sParaTemp.get("sessionid");
	    	for(MSession s:_session_list){
	    		if(s.getSessionId().equals(sessionid)){
	    			sParaTemp.put("userid", s.userid+"");
	    			//sParaTemp.put("username", s.username);
	    		}
	    	}
	    }
	    if(action.startsWith("NHSCHOOL")){
	    	this._nhschool_action.submit(action,sParaTemp,result);
	    }else{
	    	this._my_action.submit(action,sParaTemp,result);
	    }
	    
	}
    private boolean checkIsLogin(JSONObject result,HttpServletRequest request){
    	Cookie[] oCookies = request.getCookies();
    	String sessionid="";
    	sessionid=((request.getParameter("sessionid")!=null)?request.getParameter("sessionid"):"");
    	if(sessionid.length()==0 && oCookies!=null){
    		for (Cookie c : oCookies)  {
    			if(c.getName().equals("sessionId")){
    				sessionid=c.getValue();
    			}
    		}
    	}
		if(sessionid.equals(""))return false;
		return checkIsLogin(sessionid);
    }
    private boolean checkIsLogin(String sessionid){
    	
    	boolean b=false;
    	for(MSession s:_session_list){
    		if(s.getSessionId().equals(sessionid)){
    			b=true;
    		}
    	}
    	return b;
    }
    

}
