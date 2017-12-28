package com.boatsoft.common;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

import org.json.JSONArray;

import com.mysql.jdbc.Statement;

public class MConfig {
	
	public static boolean IsDebug=false;
	public static String WEIXIN_APP_ID="wx8356a3a16e8550a8";
	public static String WEIXIN_APP_SECRET="e64a4ccda15011ca2aeb76d801ff06da";
	public static String JDBC_HOST="";
	public static String JDBC_URL_BASIC=JDBC_HOST + "dbsdp";
	public static String JDBC_USERNAME="root";
	public static String JDBC_PASSWORD="boat";
	public String UPLOAD_PATH="";
	public String DOMAIN_NAME="";
	public String HOMEPAGE="";
	public String SRC_JS="";
	public String LAN="";
	public String TITLE="";
	
	public static void setServer(int tips){
		switch(tips){
			case 1:
				//1-����ˮ׼������
				JDBC_HOST="jdbc:mysql://124.172.148.102:3306/";
				JDBC_URL_BASIC=JDBC_HOST + "dbsdp?useUnicode=true&characterEncoding=utf8&useSSL=false&autoReconnect=true&rewriteBatchedStatements=TRUE";
				JDBC_USERNAME="root";
				JDBC_PASSWORD="Boat123";
				break;
			case 2:
				//�Ϻ����������
				JDBC_HOST="jdbc:mysql://localhost:3306/";
				JDBC_URL_BASIC=JDBC_HOST + "dbsdp?useUnicode=true&characterEncoding=utf8&useSSL=false&autoReconnect=true&rewriteBatchedStatements=TRUE";
				JDBC_USERNAME="root";
				JDBC_PASSWORD="Boat123";
				break;
			case 3:
				//ά̩�����Ʒ�����
				JDBC_HOST="jdbc:mysql://39.108.123.164:3306/";
				JDBC_URL_BASIC=JDBC_HOST + "dbsdp?useUnicode=true&characterEncoding=utf8&useSSL=false&autoReconnect=true&rewriteBatchedStatements=TRUE";
				JDBC_USERNAME="root";
				JDBC_PASSWORD="boat";
				break;
			case 4:
				//������һ��������
				JDBC_HOST="jdbc:mysql://124.173.113.80:3306/";
				JDBC_URL_BASIC=JDBC_HOST + "dbsdp?useUnicode=true&characterEncoding=utf8&useSSL=false&autoReconnect=true&rewriteBatchedStatements=TRUE";
				JDBC_USERNAME="root";
				JDBC_PASSWORD="boat";
				break;
			case 5:
				//��ƴ��һ�����������
				JDBC_HOST="jdbc:mysql://localhost:3306/";
				JDBC_URL_BASIC=JDBC_HOST + "dbsdp?useUnicode=true&characterEncoding=utf8&useSSL=false&autoReconnect=true&rewriteBatchedStatements=TRUE";
				JDBC_USERNAME="root";
				JDBC_PASSWORD="Boat123456";
				break;
			default:
				//����
				JDBC_HOST="jdbc:mysql://192.168.0.66:3307/";
				JDBC_URL_BASIC=JDBC_HOST + "dbsdp?useUnicode=true&characterEncoding=utf8&useSSL=false&autoReconnect=true&rewriteBatchedStatements=TRUE";
				JDBC_USERNAME="root";
				JDBC_PASSWORD="Boat123";
				break;
		}
	}
	
	public MConfig(String websiteinfo){
		String website="";
		String host="";
		String sql="";
		if(websiteinfo.indexOf(",")>=0){
			String temp[]=websiteinfo.split(",");
			if(temp.length>1){
				website=temp[0];
				host=temp[1];
			}
		}
		if(website.trim().length()>0){
			sql="SELECT * FROM sys_path WHERE code='" + website + "'";
		}else{
			sql="SELECT * FROM sys_path WHERE domain='" + host + "'";
		}
		
		try {
			Connection con = DriverManager.getConnection(JDBC_URL_BASIC,JDBC_USERNAME,JDBC_PASSWORD);
			Statement stmt = (Statement) con.createStatement() ;
			ResultSet rs = (ResultSet) stmt.executeQuery(sql) ; 
			if(rs.next()){
				this.JDBC_URL=JDBC_HOST + (String) rs.getObject("code") + "?useUnicode=true&characterEncoding=utf8&useSSL=false&autoReconnect=true&rewriteBatchedStatements=TRUE";
				this.UPLOAD_PATH=(String) rs.getObject("path");
				this.DOMAIN_NAME=(String) rs.getObject("url");
				this.HOMEPAGE=(String) rs.getObject("homepage");
				this.SRC_JS=(String) rs.getObject("srcJs");
				this.LAN=(String) rs.getObject("lan");
				this.TITLE=(String) rs.getObject("title");
			}
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	//����Ϊ���ķ�����ʱ�滻����
	public String JDBC_URL="";
	
	public static int SESSION_TIME_LIMIT=7200;
	
	static {
		//1-����ˮ׼������; 2-�Ϻ����������; 3-ά̩�����Ʒ�����; 4-������һ��������; 5-��ƴ��һ�����������
		try {
			InputStream in;
			if(!IsDebug){
				in = MConfig.class.getClassLoader()
						.getResourceAsStream("config.properties");
			}else{
				in = MConfig.class.getClassLoader()
						.getResourceAsStream("config_debug.properties");
			}
			
			Properties props = new Properties();
			props.load(in);
			int database_tips=Integer.parseInt(props.getProperty("DATABASE_TIPS", "0"));
			setServer(database_tips);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("load config error " + e.getMessage());
		}
		
	}
}
