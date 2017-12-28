package com.boatsoft.wxlib.api;

import com.boatsoft.wxlib.util.HttpUtil;

import net.sf.json.JSONObject;


/**
 * ����ƽ̨API �豸ר��API������DeviceApi
 */
public class MpApi {
	
	
	private static final String GetAccessTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="
			+ WXConfig.APPID + "&secret=" + WXConfig.APPSECRET;
	private static final String CustomSendUrl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN";
	private static final String CreateMenuUrl = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
	private static final String QueryMenuUrl = "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=ACCESS_TOKEN";
	private static final String DeleteMenuUrl = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN";

	/**
	 * ��ȡ����ƾ֤
	 * <p>
	 * ���������access_token��Ч��Ϊ7200�룬�ظ���ȡ�������ϴλ�ȡ��access_tokenʧЧ��
	 * ���ڻ�ȡaccess_token��api���ô����ǳ����ޣ���Ҫȫ�ִ洢�����access_token
	 * <br/>
	 * �ĵ�λ�ã�����֧��->��ȡaccess token
	 */
	public static AccessToken getAccessToken() {
		String resultContent = HttpUtil.executeGet(GetAccessTokenUrl);
		return AccessToken.fromJson(resultContent);
	}
	
	/**
	 * ���Ϳͷ���Ϣ <br/>
	 * �ĵ�λ�ã�������Ϣ->���Ϳͷ���Ϣ
	 */
	public static void customSend(String body) {
		System.out.println("customSend body=" + body);
		HttpUtil.doPost(CustomSendUrl, body);
	}

	/**
	 * ���Ϳͷ��ı���Ϣ
	 */
	public static void customSendText(String touser, String content) {
		JSONObject json = new JSONObject();
		json.put("touser", touser);
		json.put("msgtype", "text");
		JSONObject text = new JSONObject();
		text.put("content", content);
		json.put("text", text);
		customSend(json.toString());
	}
	
	/**
	 * �����Զ���˵�<p>
	 * �ĵ�λ�ã��Զ���˵�->�Զ���˵������ӿ�
	 */
	public static String menuCreate(String body) {
		return HttpUtil.doPost(CreateMenuUrl, body);
	}

	/**
	 * ��ѯ�Զ���˵�<p>
	 * �ĵ�λ�ã��Զ���˵�->�Զ���˵���ѯ�ӿ�
	 */
	public static String menuQuery() {
		return HttpUtil.doGet(QueryMenuUrl);
	}
	
	/**
	 * ɾ���Զ���˵�<p>
	 * �ĵ�λ�ã��Զ���˵�->�Զ���˵�ɾ���ӿ�
	 */
	public static String menuDelete() {
		return HttpUtil.doGet(DeleteMenuUrl);
	}

}
