package com.boatsoft.common;

public class MSession {
	public MConfig config;
	public String username="";
	public int userid=0;
	public String province="";
	private int _time_limit=0;
	private String _session_id="";
	public boolean isSystem=false;
	public String website="";
	public String srcJs="";
	public MSession(String sessionid){
		_session_id=sessionid;
	}
	
	public String getSessionId(){
		_time_limit=MConfig.SESSION_TIME_LIMIT;
		return _session_id;
	}
	public void actived(){
		_time_limit=MConfig.SESSION_TIME_LIMIT;
	}
	public void timeTick(){
		_time_limit--;
	}
	public int getTimeLimit(){
		return _time_limit;
	}
}
