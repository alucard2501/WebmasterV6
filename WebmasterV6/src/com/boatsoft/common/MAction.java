package com.boatsoft.common;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.boatsoft.servlet.DoServlet;

public class MAction {

	protected MDAO dao;
	
	public MAction(){
		try {
			dao=new MDAO();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void submit(String action,Map<String, String> vo,JSONObject r) throws Exception{
		
	}
	protected static void fillVOByRequest(HttpServletRequest request,VO vo){
		Enumeration forms=request.getParameterNames();
		while (forms.hasMoreElements()) {
			String key=forms.nextElement().toString();
			vo.setProperty(key, request.getParameter(key));		
		
		}
	}
	protected static JSONObject vo2json(VO vo){
		JSONObject json=new JSONObject();
		for(int i=0;i<vo.PropertySize();i++){
			try {
				json.put(vo.getPropertyName(i), vo.getProperty(i));
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return json;
	}
	
	protected String webGet(String api,List<NameValuePair> params){
		String url=api+"?temp=" + Math.random() ;
		
		//String uriAPI = "http://localhost:8080/IvorHotelServicesJ2EE/do?action=hotel_validate_mobile&temp="  ;
			for(NameValuePair item:params){
				try {
					url=url + "&" + item.getName() + "=" + URLEncoder.encode(item.getValue(),"utf-8");
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			return getStringFromURL(url);
	}
	protected String getStringFromURL(String url){
		try{
			CloseableHttpClient httpclient = HttpClients.createDefault();
			HttpGet httpGet = new HttpGet(url);
            CloseableHttpResponse httpResponse = httpclient.execute(httpGet);

			if(httpResponse.getStatusLine().getStatusCode()==200){
			//取出回应字串
				String strResult=EntityUtils.toString(httpResponse.getEntity());
				return strResult;
				//final JSONObject jObject=new JSONObject(strResult.replace("jsonpCallback(", "").replace(")",""));
			}else{
				return "";
				//textView1.setText("Error Response"+httpResponse.getStatusLine().toString());
			}
		}catch(ClientProtocolException e){
			e.printStackTrace();
			return "";
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return "";
		} catch (IOException e) {
			e.printStackTrace();
			return "";
		} //catch(JSONException e){e.printStackTrace();}
	}
	
	public static String Unicode2GBK(String dataStr) {
	    int index = 0;
	    StringBuffer buffer = new StringBuffer();
	    int li_len = dataStr.length();
	    while (index < li_len) {
	        if (index >= li_len - 1|| !"\\u".equals(dataStr.substring(index, index + 2))) {
	            buffer.append(dataStr.charAt(index));
	            index++;
	            continue;
	        }
	        String charStr = "";
	        charStr = dataStr.substring(index + 2, index + 6);
	        char letter = (char) Integer.parseInt(charStr, 16);
	        buffer.append(letter);
	        index += 6;
	    }
	    return buffer.toString();
	}
	
	protected MSession getSession(Map<String, String> vo,ArrayList<MSession> list) throws Exception{
		if(!vo.containsKey("sessionid"))throw new Exception("请输入sessionid");
		String sessionid=BasicFunction.replaceSQL(vo.get("sessionid"));
		
		for(MSession s:list){
			if(sessionid.equals(s.getSessionId())){
				return s;
			}
		}
		return null;
	}
}
