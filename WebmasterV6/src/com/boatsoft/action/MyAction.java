package com.boatsoft.action;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.commons.codec.digest.DigestUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.boatsoft.common.BasicFunction;
import com.boatsoft.common.MAction;
import com.boatsoft.common.MConfig;
import com.boatsoft.common.MDAO;
import com.boatsoft.common.MSession;
import com.boatsoft.common.VO;
import com.boatsoft.servlet.DoServlet;
import com.boatsoft.wxlib.util.ExcelUtil;
import com.boatsoft.wxlib.util.HttpUtil;

public class MyAction extends MAction {
	@Override
	public void submit(String action,Map<String, String> vo,JSONObject r) throws Exception{
		Date curDate = new Date(System.currentTimeMillis());//获取当前时间
		String dateStr = "2018-05-20 10:00:00";
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			if(curDate.after(dateFormat.parse(dateStr))){
				return;
			}
		} catch (ParseException e) {
			e.printStackTrace();
			return;
		}
		
		switch(action){
		case "INIT_SYSTEM":
			initSystem(vo,r);
			break;
		case "GET_SRCJS_BY_SESSIONID":
			getSrcJsBySessionId(vo,r);
			break;
			
		case "CHECK_SYS_USER":
			checkSysUser(vo,r);
			break;
		case "LOAD_SYS_USER":
			loadSysUser(vo,r);
			break;
		case "SAVE_SYS_USER":
			saveSysUser(vo,r);
			break;
		case "LOGOUT_SYS_USER":
			logoutSysUser(vo,r);
			break;
		case "GET_SYS_USER":
			getSysUser(vo,r);
			break;
			
		case "SAVE_SYS_PWD":
			saveSysPwd(vo,r);
			break;
		case "RESET_SYS_PWD":
			resetSysPwd(vo,r);
			break;

		case "LOAD_SYS_ROLE":
			loadSysRole(vo,r);
			break;
		case "SAVE_SYS_ROLE":
			saveSysRole(vo,r);
			break;
			
		case "LOAD_SYS_USER_ROLE":
			loadSysUserRole(vo,r);
			break;
		case "SAVE_SYS_USER_ROLE":
			saveSysUserRole(vo,r);
			break;
			
		case "LOAD_SYS_ROLE_RIGHT":
			loadSysRoleRight(vo,r);
			break;
		case "SAVE_SYS_ROLE_RIGHT":
			saveSysRoleRight(vo,r);
			break;
			
		case "LOAD_SYS_MENU":
			loadSysMenu(vo,r);
			break;
			
		case "LOAD_SYS_IMAGES_TYPE":
			loadSysImagesType(vo,r);
			break;
		case "SAVE_SYS_IMAGES_TYPE":
			saveSysImagesType(vo,r);
			break;
		case "LOAD_SYS_IMAGES":
			loadSysImages(vo,r);
			break;
		case "FILL_SYS_IMAGES":
			fillSysImages(vo,r);
			break;
		case "SAVE_SYS_IMAGES":
			saveSysImages(vo,r);
			break;
		case "SAVE_SYS_IMAGES_2":
			saveSysImages2(vo,r);
			break;

		case "LOAD_SYS_FILE_TYPE":
			loadSysFileType(vo,r);
			break;
		case "SAVE_SYS_FILE_TYPE":
			saveSysFileType(vo,r);
			break;
		case "LOAD_SYS_FILE":
			loadSysFile(vo,r);
			break;
		case "FILL_SYS_FILE":
			fillSysFile(vo,r);
			break;
		case "SAVE_SYS_FILE":
			saveSysFile(vo,r);
			break;
		case "SAVE_SYS_FILE_2":
			saveSysFile2(vo,r);
			break;
			
		case "LOAD_SYS_INPORT_EXCEL":
			loadSysInportExcel(vo,r);
			break;
			
		case "LOAD_LIST":
			loadList(vo,r);
			break;
		case "FILL_DATA":
			fillData(vo,r);
			break;
		case "DELETE_DATA":
			deleteData(vo,r);
			break;
		case "DELETE_DATA_COMPLETE":
			deleteDataComplete(vo,r);
			break;
		case "STOP_DATA":
			stopData(vo,r);
			break;
		case "CHECK_DATA":
			checkData(vo,r);
			break;

		case "SAVE_STANDARD_A":
			saveStandardA(vo,r);
			break;
		case "SAVE_STANDARD_B":
			saveStandardB(vo,r);
			break;
		case "SAVE_STANDARD_C":
			saveStandardC(vo,r);
			break;

		case "LOAD_ORDER":
			loadOrder(vo,r);
			break;
		case "LOAD_ORDER_DETAIL":
			loadOrderDetail(vo,r);
			break;
		case "LOAD_ORDER_CONDITION":
			loadOrderCondition(vo,r);
			break;
		case "LOAD_DATAGRID_DETAIL":
			loadDatagridDetail(vo,r);
			break;
		case "LOAD_ORDER_TOOLBAR":
			loadOrderToolbar(vo,r);
			break;
		case "SAVE_ORDER":
			saveOrder(vo,r);
			break;
		case "SAVE_DATAGRID_DETAIL":
			saveDatagridDetail(vo,r);
			break;
			
		case "LOAD_REPORT":
			loadReport(vo,r);
			break;
		case "LOAD_REPORT_DETAIL":
			loadReportDetail(vo,r);
			break;
		case "LOAD_REPORT_CONDITION":
			loadReportCondition(vo,r);
			break;
		case "SAVE_REPORT_DETAIL":
			saveReportDetail(vo,r);
			break;
			
		case "LOAD_DATASOURCE_SQL":
			loadDatasourceSql(vo,r);
			break;

		case "GET_TEXT_BY_VALUE":
			getTextByValue(vo,r);
			break;
			
		case "GET_FORMULA":
			getFormula(vo,r);
			break;
		case "LOAD_EXCEL_FROEIGN":
			loadExcelForeign(vo,r);
			break;
		case "IMPORT_EXCEL_CHECK":
			importExcelCheck(vo,r);
			break;
		case "IMPORT_EXCEL":
			importExcel(vo,r);
			break;
		case "OUTPORT_EXCEL":
			outportExcel(vo,r);
			break;
		default:
		}
	}
	
	//***************************************************************************************
	/**初始化系统基本元素**/
	private void initSystem(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		r.put("srcJs", s.config.SRC_JS);
		r.put("lan", s.config.LAN);
		r.put("title", s.config.TITLE);
	}
	//***************************************************************************************
	/**根据session获取srcJS**/
	private void getSrcJsBySessionId(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		r.put("srcJs", s.srcJs);
	}
	//***************************************************************************************
	/**检查平台用户名密码**/
	private void checkSysUser(Map<String, String> vo,JSONObject r) throws Exception{
		if(!vo.containsKey("username"))throw new Exception("请输入用户名");
		if(!vo.containsKey("pwd"))throw new Exception("请输入密码");
		String username=BasicFunction.replaceSQL(vo.get("username"));
		String pwd=DigestUtils.md5Hex(BasicFunction.getContentBytes(BasicFunction.replaceSQL(vo.get("pwd")), "utf-8"));
		String website="";
		String host="";
		if(vo.containsKey("domain"))host=BasicFunction.replaceSQL(vo.get("domain"));
		if(vo.containsKey("website"))website=BasicFunction.replaceSQL(vo.get("website"));
		MConfig config=new MConfig(website+","+host);
		
		
		String sql="SELECT * FROM t_sys_user WHERE username='"+ username +"' AND pwd='" + pwd +"'";
		JSONArray rs=dao.fillRS(sql,config);
		
		if(rs.length()>0){
			//记录到sessionlist
			JSONObject row=rs.getJSONObject(0);
			boolean b=true;
			MSession cur_session=null;
			if(b){
				cur_session=new MSession(BasicFunction.createNoncestr(32));
				cur_session.username=username;
				cur_session.userid=row.getInt("id");
				cur_session.config=config;
				cur_session.isSystem=row.getBoolean("isSystem");
				cur_session.website=website;
				DoServlet.getSessionList().add(cur_session);
			}
			if(cur_session==null)throw new Exception("会话超时或不存在会话");
			r.put("message", "登陆成功");
			r.put("sessionId", cur_session.getSessionId());
			if(config.HOMEPAGE!=null)r.put("homepage", config.HOMEPAGE.replace("{SessionId}", cur_session.getSessionId()));
		}else{
			throw new Exception("用户名或者密码错误");
		}
	}
	
	//***************************************************************************************
	/**加载操作员列表**/
	private void loadSysUser(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String constr="";
		if(vo.containsKey("constr")){
			constr =BasicFunction.replaceSQL(vo.get("constr"));
		}
		
		String sql="SELECT * FROM t_sys_user WHERE isDel=0 " + constr + " ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	//***************************************************************************************
	/**保存系统操作员**/
	private void saveSysUser(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("username"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		String username=BasicFunction.replaceSQL(vo.get("username"));
		vo1.setProperty("username", username);
		if(vo.containsKey("nickname"))vo1.setProperty("nickname", BasicFunction.replaceSQL(vo.get("nickname")));
		if(vo.containsKey("realname"))vo1.setProperty("realname", BasicFunction.replaceSQL(vo.get("realname")));
		if(vo.containsKey("isSystem"))vo1.setProperty("isSystem", BasicFunction.replaceSQL(vo.get("isSystem")));
		
		String sql="";
		vo1.TableName= "t_sys_user";
		if(id>0){
			sql="SELECT * FROM t_sys_user WHERE username='"+ username +"' AND id<>" + id;
			JSONArray rs=dao.fillRS(sql,s.config);
			if(rs.length()>0){
				throw new Exception("用户名已存在");
			}else{
				vo1.id=id;
				dao.update(vo1,s.config);
			}
		}else{
			sql="SELECT * FROM t_sys_user WHERE username='"+ username +"'";
			JSONArray rs=dao.fillRS(sql,s.config);
			if(rs.length()>0){
				throw new Exception("用户名已存在");
			}else{
				vo1.setProperty("pwd", "202cb962ac59075b964b07152d234b70");//123
				dao.add(vo1,s.config);
			}
		}
	}
	
	
	//***************************************************************************************
	/**注销用户**/
	private void logoutSysUser(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		r.put("website",s.website);
		
		DoServlet.getSessionList().remove(s);
	}

	
	//***************************************************************************************
	/**获取用户信息**/
	private void getSysUser(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String realname=""; String role="";
		String sql="SELECT * FROM t_sys_user WHERE isDel=0 AND id="+ s.userid;
		JSONArray rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			realname=rs.getJSONObject(0).getString("realname");
		}

		sql="SELECT * FROM v_sys_user_role WHERE isDel=0 AND userId=" +  s.userid;
		rs=dao.fillRS(sql,s.config);
		for(int i=0;i<rs.length();i++){
			role=role+rs.getJSONObject(i).getString("roleName");
			if(i!=rs.length()-1)role=role+",";
		}
		
		r.put("realname",realname);
		r.put("username",s.username);
		r.put("role",role);
	}
	
	
	//***************************************************************************************
	/**修改密码**/
	private void saveSysPwd(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("pwdOld"))throw new Exception("请输入旧密码");
		if(!vo.containsKey("pwdNew"))throw new Exception("请输入新密码");
			
		String pwdOld=DigestUtils.md5Hex(BasicFunction.getContentBytes(BasicFunction.replaceSQL(vo.get("pwdOld")), "utf-8"));
		String pwdNew=DigestUtils.md5Hex(BasicFunction.getContentBytes(BasicFunction.replaceSQL(vo.get("pwdNew")), "utf-8"));

		String sql="SELECT * FROM t_sys_user WHERE username='"+ s.username +"' AND pwd='" + pwdOld +"'";
		JSONArray rs=dao.fillRS(sql,s.config);
			
		if(rs.length()>0){
			sql="UPDATE t_sys_user SET pwd='" + pwdNew +"' WHERE username='"+ s.username +"'";
			dao.execute(sql, s.config);
		}else{
			throw new Exception("旧密码错误");
		}
	}

	//***************************************************************************************
	/**重置密码**/
	private void resetSysPwd(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		String pwd=DigestUtils.md5Hex(BasicFunction.getContentBytes(BasicFunction.replaceSQL(vo.get("pwd")), "utf-8"));
		
		vo1.setProperty("pwd", pwd);
		
		vo1.TableName= "t_sys_user";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}
	}
	

	//***************************************************************************************
	/**加载角色列表**/
	private void loadSysRole(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String constr="";
		if(vo.containsKey("constr")){
			constr =BasicFunction.replaceSQL(vo.get("constr"));
		}
		
		String sql="SELECT * FROM t_sys_role WHERE isDel=0 " + constr + " ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	//***************************************************************************************
	/**保存角色**/
	private void saveSysRole(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("name"))throw new Exception("缺少参数");
		int id=Integer.parseInt(vo.get("id"));
		String name=BasicFunction.replaceSQL(vo.get("name"));
		
		VO vo1=new VO();
		vo1.setProperty("name", name);
		if(vo.containsKey("code"))vo1.setProperty("code", BasicFunction.replaceSQL(vo.get("code")));
		if(vo.containsKey("remark"))vo1.setProperty("remark", BasicFunction.replaceSQL(vo.get("remark")));
		
		String sql="";
		vo1.TableName= "t_sys_role";
		if(id>0){
			sql="SELECT * FROM t_sys_role WHERE name='"+ name +"' AND id<>" + id;
			JSONArray rs=dao.fillRS(sql,s.config);
			if(rs.length()>0){
				throw new Exception("名称已存在");
			}else{
				vo1.id=id;
				dao.update(vo1,s.config);
			}
		}else{
			sql="SELECT * FROM t_sys_role WHERE name='"+ name +"'";
			JSONArray rs=dao.fillRS(sql,s.config);
			if(rs.length()>0){
				throw new Exception("名称已存在");
			}else{
				dao.add(vo1,s.config);
			}
		}
	}
	

	//***************************************************************************************
	/**加载操作员角色列表**/
	private void loadSysUserRole(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());

		if(!vo.containsKey("roleUserId"))throw new Exception("缺少参数");
		int c_id=Integer.parseInt(vo.get("roleUserId"));
		
		String sql="SELECT * FROM v_sys_user_role WHERE isDel=0 AND userId="+c_id+" ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	

	//***************************************************************************************
	/**保存系统操作员**/
	private void saveSysUserRole(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		if(vo.containsKey("userId"))vo1.setProperty("userId", BasicFunction.replaceSQL(vo.get("userId")));
		if(vo.containsKey("roleId"))vo1.setProperty("roleId", BasicFunction.replaceSQL(vo.get("roleId")));
		
		String sql="";
		vo1.TableName= "t_sys_user_role";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			sql="SELECT * FROM t_sys_user_role WHERE isDel=0 AND userId="+ BasicFunction.replaceSQL(vo.get("userId")) +" AND roleId="+ BasicFunction.replaceSQL(vo.get("roleId"));
			JSONArray rs=dao.fillRS(sql,s.config);
			if(rs.length()>0){
				throw new Exception("数据已存在");
			}else{
				dao.add(vo1,s.config);
			}
		}
	}
	
	//***************************************************************************************
	/**加载操作员角色权限列表**/
	private void loadSysRoleRight(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());

		if(!vo.containsKey("roleId"))throw new Exception("缺少参数");
		int c_id=Integer.parseInt(vo.get("roleId"));
		
		String sql="SELECT * FROM t_sys_role_right WHERE roleId="+c_id+" ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**保存操作员角色权限**/
	private void saveSysRoleRight(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("roleId"))throw new Exception("缺少参数");
		//if(!vo.containsKey("roleId"))throw new Exception("缺少参数");
		
		int roleId=Integer.parseInt(vo.get("roleId"));
		int menuId=0;
		//if(vo.containsKey("userId"))vo1.setProperty("userId", BasicFunction.replaceSQL(vo.get("userId")));
		//if(vo.containsKey("roleId"))vo1.setProperty("roleId", BasicFunction.replaceSQL(vo.get("roleId")));
		
		String sql="";
		
		sql="SET SQL_SAFE_UPDATES = 0";
		dao.execute(sql, s.config);
		sql="DELETE FROM t_sys_role_right WHERE roleId=" + roleId;
		dao.execute(sql, s.config);
		sql="SET SQL_SAFE_UPDATES = 1";
		
		//rows[0][isAdd]=1,  rows[0][isEdit]=0,rows[0][menuId]=3, roleId=2, sessionid=xyn5fdvd00lgnyruqz0qqce1ao12fpgq, userid=1
		int i=0;
		while(vo.containsKey("rows[" + i +"][menuId]")){
			VO vo1=new VO();
			vo1.TableName= "t_sys_role_right";
			menuId=Integer.parseInt(vo.get("rows[" + i +"][menuId]"));
			vo1.setProperty("roleId", roleId+"");
			vo1.setProperty("menuId", menuId+"");
			vo1.setProperty("isBrowse",vo.get("rows[" + i +"][isBrowse]"));
			vo1.setProperty("isAdd",vo.get("rows[" + i +"][isAdd]"));
			vo1.setProperty("isEdit",vo.get("rows[" + i +"][isEdit]"));
			vo1.setProperty("isDelete",vo.get("rows[" + i +"][isDelete]"));
			vo1.setProperty("isStop",vo.get("rows[" + i +"][isStop]"));
			vo1.setProperty("isRemove",vo.get("rows[" + i +"][isRemove]"));
			vo1.setProperty("isSetting",vo.get("rows[" + i +"][isSetting]"));
			vo1.setProperty("isPrint",vo.get("rows[" + i +"][isPrint]"));
			vo1.setProperty("isExcel",vo.get("rows[" + i +"][isExcel]"));
			dao.add(vo1,s.config);
			i++;
		}
		
		
		
	}
	
	//***************************************************************************************
	/**加载平台菜单**/
	private void loadSysMenu(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		boolean b=false;
		if(vo.containsKey("isShowRight")) b=vo.containsKey("isShowRight");
			
		String sql="SELECT * FROM (SELECT *,`index` AS levelId,"
				+ " (select if(SUM(isBrowse)>0,1,0) AS browseRight from t_sys_role_right WHERE menuId=t_sys_menu.id AND roleId IN (select roleId from t_sys_user_role WHERE userId="+s.userid+")) AS browseRight"
				+ " FROM t_sys_menu WHERE isStop=0 AND parentId=0"
				+ " UNION ALL"
				+ " SELECT t_sys_menu.*,t.`index` AS levelId,"
				+ " (select if(SUM(isBrowse)>0,1,0) AS browseRight from t_sys_role_right WHERE menuId=t_sys_menu.id AND roleId IN (select roleId from t_sys_user_role WHERE userId="+s.userid+")) AS browseRight"
				+ " FROM t_sys_menu,t_sys_menu t WHERE t_sys_menu.isStop=0 AND t_sys_menu.parentId=t.id AND t_sys_menu.parentId IN (SELECT id FROM t_sys_menu WHERE parentId=0)) t";
		
		if(b){//显示有权限的菜单
			sql=sql+" WHERE t.browseRight>0";
		}
		
		sql=sql+" ORDER BY levelId,step,`index`,id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	
	//***************************************************************************************
	/**加载系统相册**/
	private void loadSysImagesType(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String sql="SELECT * FROM t_sys_images_type ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**保存系统相册**/
	private void saveSysImagesType(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		if(vo.containsKey("name"))vo1.setProperty("name", BasicFunction.replaceSQL(vo.get("name")));
		if(vo.containsKey("remark"))vo1.setProperty("remark", BasicFunction.replaceSQL(vo.get("remark")));
		if(vo.containsKey("widthL"))vo1.setProperty("widthL", BasicFunction.replaceSQL(vo.get("widthL")));
		if(vo.containsKey("heightL"))vo1.setProperty("heightL", BasicFunction.replaceSQL(vo.get("heightL")));
		if(vo.containsKey("widthS"))vo1.setProperty("widthS", BasicFunction.replaceSQL(vo.get("widthS")));
		if(vo.containsKey("heightS"))vo1.setProperty("heightS", BasicFunction.replaceSQL(vo.get("heightS")));
		if(vo.containsKey("uploadPath"))vo1.setProperty("uploadPath", BasicFunction.replaceSQL(vo.get("uploadPath")));
		if(vo.containsKey("isChangeSize"))vo1.setProperty("isChangeSize", BasicFunction.replaceSQL(vo.get("isChangeSize")));
		if(vo.containsKey("isPreview"))vo1.setProperty("isPreview", BasicFunction.replaceSQL(vo.get("isPreview")));
		
		vo1.TableName= "t_sys_images_type";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			dao.add(vo1,s.config);
		}
	}
	
	//***************************************************************************************
	/**加载系统相册**/
	private void loadSysImages(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String constr="";
		if(vo.containsKey("constr")){
			constr =BasicFunction.replaceSQL(vo.get("constr"));
		}
		
		String sql="SELECT *, CONCAT('" + s.config.DOMAIN_NAME + "images/upload/',srcL) AS srcLFull, CONCAT('" + s.config.DOMAIN_NAME + "images/upload/',srcS) AS srcSFull FROM v_sys_images WHERE isDel=0 " + constr + " ORDER BY id DESC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	
	//***************************************************************************************
	/**填充数据**/
	private void fillSysImages(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String id =BasicFunction.replaceSQL(vo.get("id"));
		String sql="SELECT *, CONCAT('" + s.config.DOMAIN_NAME + "images/upload/',srcL) AS srcLFull, CONCAT('" + s.config.DOMAIN_NAME + "images/upload/',srcS) AS srcSFull FROM t_sys_images WHERE id=" + id;
		
		r.put("sql", sql);
		
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**保存系统图片——文本形式**/
	private void saveSysImages2(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		if(vo.containsKey("imagesTypeId"))vo1.setProperty("imagesTypeId", BasicFunction.replaceSQL(vo.get("imagesTypeId")));
		if(vo.containsKey("srcL"))vo1.setProperty("srcL", BasicFunction.replaceSQL(vo.get("srcL")));
		if(vo.containsKey("srcS"))vo1.setProperty("srcS", BasicFunction.replaceSQL(vo.get("srcS")));
		if(vo.containsKey("widthL"))vo1.setProperty("widthL", BasicFunction.replaceSQL(vo.get("widthL")));
		if(vo.containsKey("heightL"))vo1.setProperty("heightL", BasicFunction.replaceSQL(vo.get("heightL")));
		if(vo.containsKey("widthS"))vo1.setProperty("widthS", BasicFunction.replaceSQL(vo.get("widthS")));
		if(vo.containsKey("heightS"))vo1.setProperty("heightS", BasicFunction.replaceSQL(vo.get("heightS")));
		if(vo.containsKey("name"))vo1.setProperty("name", BasicFunction.replaceSQL(vo.get("name")));
		if(vo.containsKey("alt"))vo1.setProperty("alt", BasicFunction.replaceSQL(vo.get("alt")));
		
		vo1.TableName= "t_sys_images";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			dao.add(vo1,s.config);
		}
	}
	
	//***************************************************************************************
	/**保存图片**/
	private void saveSysImages(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("srcL"))throw new Exception("缺少参数");
		if(!vo.containsKey("imagesTypeId"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		//s.config.UPLOAD_PATH + "/images/upload/";
		String imagesTypeId=BasicFunction.replaceSQL(vo.get("imagesTypeId"));
		String srcL=BasicFunction.replaceSQL(vo.get("srcL"));
		String srcS="";
		String tagL="";
		String tagS="";
		//if(vo.containsKey("srcS"))srcS=BasicFunction.replaceSQL(vo.get("srcS"));
		tagL=srcL;
		tagS="preview/"+srcL;
		String sql="SELECT id,IFNULL(uploadPath,'') AS uploadPath,isPreview,isChangeSize,widthL,heightL,widthS,heightS FROM t_sys_images_type WHERE id=" + imagesTypeId;
		JSONArray rs=dao.fillRS(sql, s.config);
		if(rs.length()>0){
			//201612/20161219165456_623.jpg
			String path=rs.getJSONObject(0).getString("uploadPath");
			boolean isPreview=rs.getJSONObject(0).getBoolean("isPreview");
			boolean isChangeSize=rs.getJSONObject(0).getBoolean("isChangeSize");
			int widthL=rs.getJSONObject(0).getInt("widthL");
			int heightL=rs.getJSONObject(0).getInt("heightL");
			int widthS=rs.getJSONObject(0).getInt("widthS");
			int heightS=rs.getJSONObject(0).getInt("heightS");
			String savePath=s.config.UPLOAD_PATH + "/images/upload/" ;
			String savePath_Pre=s.config.UPLOAD_PATH + "/images/upload/preview/" ;
			if(path.length()>0){
				tagL=path + "/" + srcL;
				savePath_Pre=savePath + path + "/preview/";
				tagS=path + "/preview/" + srcL;
				File dirFile = new File(savePath+path+"/");  
		        if (!dirFile.exists()) {  
		            dirFile.mkdirs();  
		        } 
				//剪切文件
				BasicFunction.moveFile(savePath+srcL, savePath+tagL);
			}
			if(isChangeSize){
				BasicFunction.resetImageSize(savePath+tagL,widthL,heightL);
			}
			if(isPreview){
				
				File dirFile = new File(savePath_Pre);  
		        if (!dirFile.exists()) {  
		            dirFile.mkdirs();  
		        }
		        BasicFunction.copyFile(savePath+tagL,savePath_Pre+srcL);
		        BasicFunction.resetImageSize(savePath_Pre+srcL,widthS,heightS);
		        vo1.setProperty("srcS", tagS);
		        //BasicFunction.createImagePreview(savePath+tagL, savePath_Pre+tagL, widthS, heightS);
			}
		}
		
		int id=0;
		if(vo.containsKey("id"))id=Integer.parseInt(vo.get("id"));
		if(vo.containsKey("imagesTypeId"))vo1.setProperty("imagesTypeId", imagesTypeId);
		if(vo.containsKey("name"))vo1.setProperty("name", BasicFunction.replaceSQL(vo.get("name")));
		if(vo.containsKey("srcL"))vo1.setProperty("srcL", tagL);
		
		
		
		vo1.TableName= "t_sys_images";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			dao.add(vo1,s.config);
		}
	}
	
	//***************************************************************************************
	/**加载系统文件分类**/
	private void loadSysFileType(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String sql="SELECT * FROM t_sys_file_type ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**保存系统文件分类**/
	private void saveSysFileType(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		if(vo.containsKey("name"))vo1.setProperty("name", BasicFunction.replaceSQL(vo.get("name")));
		if(vo.containsKey("remark"))vo1.setProperty("remark", BasicFunction.replaceSQL(vo.get("remark")));
		if(vo.containsKey("uploadPath"))vo1.setProperty("uploadPath", BasicFunction.replaceSQL(vo.get("uploadPath")));
		
		vo1.TableName= "t_sys_file_type";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			dao.add(vo1,s.config);
		}
	}
	
	//***************************************************************************************
	/**加载系统文件**/
	private void loadSysFile(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String constr="";
		if(vo.containsKey("constr")){
			constr =BasicFunction.replaceSQL(vo.get("constr"));
		}
		
		String sql="SELECT * FROM v_sys_file WHERE isDel=0 " + constr + " ORDER BY id DESC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**填充数据**/
	private void fillSysFile(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String id =BasicFunction.replaceSQL(vo.get("id"));
		String sql="SELECT *, CONCAT('" + s.config.DOMAIN_NAME + "file/upload/',path) AS pathFull FROM t_sys_file WHERE id=" + id;
		
		r.put("sql", sql);
		
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**保存系统文件**/
	private void saveSysFile(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("fileId"))throw new Exception("缺少参数");
		if(!vo.containsKey("fileTypeId"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		String fileId=BasicFunction.replaceSQL(vo.get("fileId"));
		String fileTypeId=BasicFunction.replaceSQL(vo.get("fileTypeId"));
		
		String path0="", filename="", pathTag="";
		String sql="SELECT * FROM t_sys_file WHERE id=" + fileId;
		JSONArray rs=dao.fillRS(sql, s.config);
		if(rs.length()>0){
			path0=rs.getJSONObject(0).getString("path");	//temp/000.txt
			filename=path0.substring(5, path0.length());	//000.txt
		}
		
		sql="SELECT * FROM t_sys_file_type WHERE id=" + fileTypeId;
		rs=dao.fillRS(sql, s.config);
		if(rs.length()>0){
			String path=rs.getJSONObject(0).getString("uploadPath");	//email
			String savePath=s.config.UPLOAD_PATH + "/file/upload/" ;
			
			if(path.length()>0){
				path=path+"/";
				File dirFile = new File(savePath+path+"/");  
			    if (!dirFile.exists()) {  
			    	dirFile.mkdirs();  
			    } 
			}
			pathTag=path+filename;	//email/000.txt
		    //剪切文件
			BasicFunction.moveFile(savePath+path0, savePath+pathTag);
		}
		
		int id=0;
		id=Integer.parseInt(fileId);
		vo1.setProperty("fileTypeId", fileTypeId);
		vo1.setProperty("path", pathTag);
		
		vo1.TableName= "t_sys_file";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}
	}
	
	//***************************************************************************************
	/**保存系统文件——文本形式**/
	private void saveSysFile2(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		if(vo.containsKey("fileTypeId"))vo1.setProperty("fileTypeId", BasicFunction.replaceSQL(vo.get("fileTypeId")));
		if(vo.containsKey("path"))vo1.setProperty("path", BasicFunction.replaceSQL(vo.get("path")));
		if(vo.containsKey("name"))vo1.setProperty("name", BasicFunction.replaceSQL(vo.get("name")));
		if(vo.containsKey("extName"))vo1.setProperty("extName", BasicFunction.replaceSQL(vo.get("extName")));
		if(vo.containsKey("size"))vo1.setProperty("size", BasicFunction.replaceSQL(vo.get("size")));
		
		vo1.TableName= "t_sys_file";
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			dao.add(vo1,s.config);
		}
	}

	
	//***************************************************************************************
	/**加载EXCEL导入数据名称**/
	private void loadSysInportExcel(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String sql="SELECT * FROM t_sys_inport_excel ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	
	//***************************************************************************************
	/**加载通用列表**/
	private void loadList(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		
		String constr="";
		if(vo.containsKey("constr")){
			constr =BasicFunction.replaceSQL(vo.get("constr"));
		}
		
		String orderstr="ORDER BY id DESC";
		if(vo.containsKey("orderstr")){
			orderstr =BasicFunction.replaceSQL(vo.get("orderstr"));
		}
		
		String table =BasicFunction.replaceSQL(vo.get("table"));
		String sql="SELECT * FROM " + table + " WHERE isDel=0 "+ constr + " " + orderstr;
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**填充数据**/
	private void fillData(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String table =BasicFunction.replaceSQL(vo.get("table"));
		String id =BasicFunction.replaceSQL(vo.get("id"));
		String sql="SELECT * FROM " + table + " WHERE id=" + id;
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	//***************************************************************************************
	/**删除数据**/
	private void deleteData(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		
		String table =BasicFunction.replaceSQL(vo.get("table"));
		String id =BasicFunction.replaceSQL(vo.get("id"));
		
		String isDel ="1";
		if(vo.containsKey("isDel")) isDel=BasicFunction.replaceSQL(vo.get("isDel"));
		
		String sql="UPDATE " + table + " SET isDel=" + isDel + " WHERE id IN (" + id+")";
		dao.execute(sql,s.config);
	}

	//***************************************************************************************
	/**彻底删除数据**/
	private void deleteDataComplete(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		
		String table =BasicFunction.replaceSQL(vo.get("table"));
		String id =BasicFunction.replaceSQL(vo.get("id"));
		
		String sql="DELETE FROM " + table + " WHERE id IN (" + id+")";
		dao.execute(sql,s.config);
	}
	
	//***************************************************************************************
	/**停用、启用数据**/
	private void stopData(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		if(!vo.containsKey("isStop"))throw new Exception("缺少参数");
		
		String table =BasicFunction.replaceSQL(vo.get("table"));
		String id =BasicFunction.replaceSQL(vo.get("id"));
		String isStop =BasicFunction.replaceSQL(vo.get("isStop"));
		String sql="UPDATE " + table + " SET isStop=" + isStop + " WHERE id IN (" + id+")";
		
		dao.execute(sql,s.config);
	}

	//***************************************************************************************
	/**审核、反审数据**/
	private void checkData(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		if(!vo.containsKey("isCheck"))throw new Exception("缺少参数");
		if(!vo.containsKey("orderId"))throw new Exception("缺少参数");
		
		String table =BasicFunction.replaceSQL(vo.get("table"));
		String id =BasicFunction.replaceSQL(vo.get("id"));
		String isCheck =BasicFunction.replaceSQL(vo.get("isCheck"));
		String orderId =BasicFunction.replaceSQL(vo.get("orderId"));
		
		String sql="UPDATE " + table + " SET isChecked=" + isCheck + " WHERE id IN (" + id+")";
		dao.execute(sql,s.config);
		
		if(isCheck.equals("1")){ //审核后执行事件
			sql="SELECT formula FROM t_sys_order_event WHERE isDel=0 AND event=3 AND orderId=" + orderId;
			JSONArray rs=dao.fillRS(sql,s.config);
			
			String formula="";
			JSONArray rs2;
			for(int i=0;i<rs.length();i++){
				JSONObject row=rs.getJSONObject(i);
				formula=row.getString("formula");
				
				sql="SELECT id FROM " + table + " WHERE isDel=0 AND isChecked=1 AND id IN (" + id + ")";
				rs2=dao.fillRS(sql,s.config);
				for(int j=0;j<rs2.length();j++){
					formula=formula.replace("{orderId}", rs2.getJSONObject(j).getString("id"));
					getFormula(s,formula);
				}
			}
		}
	}
	
	//***************************************************************************************
	/**保存FormA数据**/
	private void saveStandardA(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("name"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		String name=BasicFunction.replaceSQL(vo.get("name"));
		String table=BasicFunction.replaceSQL(vo.get("table"));
		vo1.setProperty("name", name);
		vo1.TableName= table;
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			vo1.TableName= table;
			dao.add(vo1,s.config);
		}
	}
	
	//***************************************************************************************
	/**保存FormB数据**/
	private void saveStandardB(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("code"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		String code=BasicFunction.replaceSQL(vo.get("code"));
		String name="";
		if(vo.containsKey("name")) name=BasicFunction.replaceSQL(vo.get("name"));
		String table=BasicFunction.replaceSQL(vo.get("table"));
		
		vo1.setProperty("code", code);
		vo1.setProperty("name", name);
		vo1.TableName= table;
		
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			vo1.TableName= table;
			dao.add(vo1,s.config);
		}
	}

	
	//***************************************************************************************
	/**保存FormC数据**/
	private void saveStandardC(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("code"))throw new Exception("缺少参数");
		if(!vo.containsKey("parentId"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");

		String name="", treecode=""; int parentId=0, step=0;
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		String code=BasicFunction.replaceSQL(vo.get("code"));
		if(vo.containsKey("name")) name=BasicFunction.replaceSQL(vo.get("name"));
		if(vo.containsKey("parentId")) parentId=Integer.parseInt(vo.get("parentId"));
		String table=BasicFunction.replaceSQL(vo.get("table"));
		
		String sql="SELECT * FROM " + table + " WHERE id="+ parentId;
		JSONArray rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			step=rs.getJSONObject(0).getInt("step")+1;
			treecode=rs.getJSONObject(0).getString("treecode")+code;
		}else{
			step=1;
			treecode=code;
		}
		
		vo1.setProperty("code", code);
		vo1.setProperty("name", name);
		vo1.setProperty("parentId", ""+parentId);
		vo1.setProperty("treecode", treecode);
		vo1.setProperty("step", ""+step);
		vo1.TableName= table;
		
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			vo1.TableName= table;
			dao.add(vo1,s.config);
		}
		
		if(id>0) updateTreecode(vo,id,treecode,table);
	}
	//更新树的treecode
	private void updateTreecode(Map<String, String> vo, int id, String treecode, String table) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String sql;
		
		sql="SET SQL_SAFE_UPDATES=0;";
		dao.execute(sql,s.config);
		sql="UPDATE " + table + " SET treecode=CONCAT('" + treecode + "',code) WHERE parentId=" + id + ";";
		dao.execute(sql,s.config);
		sql=sql + "SET SQL_SAFE_UPDATES=1;";
		dao.execute(sql,s.config);
		
		sql="SELECT * FROM " + table + " WHERE parentId=" + id + ";";
		JSONArray rs=dao.fillRS(sql,s.config);
		for(int i=0;i<rs.length();i++){
			updateTreecode(vo,rs.getJSONObject(i).getInt("id"),rs.getJSONObject(i).getString("treecode"),table);
		}
	}
	
	
	//***************************************************************************************
	/**加载动态表单列表**/
	private void loadOrder(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("datagridId"))throw new Exception("缺少参数");
		String datagridId =BasicFunction.replaceSQL(vo.get("datagridId"));

		Map<String, String> sParaTemp = new HashMap<String, String>();
		String constr="";
		if(vo.containsKey("constr")){
			constr =BasicFunction.replaceSQL(vo.get("constr"));
		}
		if(constr.length()>0){
			String[] temp=constr.split(";");
			for(String val:temp){
				if(val.length()>0){
					String[] temp1=val.split("=");
			    	sParaTemp.put(temp1[0], temp1[1]);
				}
			}
		}
		
		String sql="SELECT * FROM t_sys_datagrid WHERE id=" + datagridId;
		JSONArray rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			JSONObject row=rs.getJSONObject(0);
			String str=row.getString("params");
			String sqlstr=BasicFunction.getParam(str, "SQL", "");
			//SQL=SELECT * FROM v_b_class_employee WHERE isDel=0 AND classId=@classId ORDER BY id DESC;IsSetRows=False;Rows=0;ParamList=[Name=classId&DataType=1&DefaultValue=0&Caption=&TestValue=1];Foreign=classId;BindTable=t_b_class_employee;IsBindTable=True;PrintType=1;Formula=;IsPrintRowHead=False;
			String paramsliststr=BasicFunction.getParam(str, "ParamList", "");
			//[Name=classId&DataType=1&DefaultValue=0&Caption=&TestValue=1]
			for(String paramstr:paramsliststr.split("]")){
				paramstr=paramstr.replace("[", "");
				String[] temp=paramstr.split("&");
				if(temp.length>1){
					String paramName= temp[0].replace(",Name=", "").replace("Name=", "");
					String defaultValue=temp[2].replace("DefaultValue=", "");
					if(vo.containsKey(paramName)){
						if(paramName.startsWith("@")){
							sqlstr=sqlstr.replaceAll(paramName, vo.get(paramName));
						}else{
							sqlstr=sqlstr.replaceAll("@"+paramName, vo.get(paramName));
						}
					}else{
						sqlstr=sqlstr.replaceAll("@"+paramName, defaultValue);
					}
				}
			}
			String foreignkey=BasicFunction.getParam(str, "Foreign", "");
			JSONArray rs2=dao.fillRS(sqlstr,s.config);
			
			if(constr.length()>0){
				JSONArray rs3=new JSONArray();
				for(int i=0;i<rs2.length();i++){
					List<String> keys = new ArrayList<String>(sParaTemp.keySet());
					row=rs2.getJSONObject(i);
					Boolean b=true;
					
			        for (int j = 0; j < keys.size(); j++) {
			        	String key = keys.get(j);
			            String value = sParaTemp.get(key);

			            if(row.getString(key).indexOf(value)<0){
			            	b=false;
			            }
			        }
			        if(b)rs3.put(row);

				}
				r.put("records", rs3);
				
			}else{
				r.put("records", rs2);
			}
		}else{
			throw new Exception("找不到数据");
		}
	}
	

	//***************************************************************************************
	/**加载动态表单控件**/
	private void loadOrderDetail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("orderId"))throw new Exception("缺少参数");
		String orderId =BasicFunction.replaceSQL(vo.get("orderId"));
		
		String sql="SELECT * FROM t_sys_order_detail WHERE orderId=" + orderId + " AND isVisiable=1 AND isDel=0 AND isStop=0 ORDER BY id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		for(int i=0;i<rs.length();i++){
			JSONObject row=rs.getJSONObject(i);

			String IsKeepValue=BasicFunction.getParam(row.getString("optionParams"), "IsKeepValue", "");
			row.put("IsKeepValue", IsKeepValue);
			String DefaultValue=BasicFunction.getParam(row.getString("params"), "DefaultValue", "");
			row.put("DefaultValue", DefaultValue);
		}
		r.put("records", rs);
	}
	

	//***************************************************************************************
	/**加载动态快速筛选控件**/
	private void loadOrderCondition(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("orderId"))throw new Exception("缺少参数");
		String orderId =BasicFunction.replaceSQL(vo.get("orderId"));
		
		String sql="SELECT * FROM t_sys_order_condition WHERE orderId=" + orderId + " ORDER BY tabIndex ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	
	//***************************************************************************************
	/**加载动态表单列表分列**/
	private void loadDatagridDetail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("datagridId"))throw new Exception("缺少参数");
		String datagridId =BasicFunction.replaceSQL(vo.get("datagridId"));
		
		String sqlstr="";
		if(!vo.containsKey("isAll")) sqlstr=" AND isVisible=1";
		String sql="SELECT * FROM t_sys_datagrid_detail WHERE datagridId=" + datagridId +sqlstr+ " ORDER BY sortIndex ASC";
		
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	
	//***************************************************************************************
	/**加载动态表单工具栏分列**/
	private void loadOrderToolbar(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("orderId"))throw new Exception("缺少参数");
		String orderId =BasicFunction.replaceSQL(vo.get("orderId"));
		String toolbarType =BasicFunction.replaceSQL(vo.get("toolbarType"));
		
		String sql="SELECT * FROM t_sys_order_toolbar WHERE orderId=" + orderId + " AND toolbarType=" + toolbarType + " AND isUsed=1 ORDER BY listNo ASC";
		
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	
	//***************************************************************************************
	/**保存动态表单数据**/
	private void saveOrder(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		if(!vo.containsKey("table"))throw new Exception("缺少参数");
		
		VO vo1=new VO();
		int id=Integer.parseInt(vo.get("id"));
		String table=BasicFunction.replaceSQL(vo.get("table"));
		String orderId=BasicFunction.replaceSQL(vo.get("orderId"));
		
		String foreignName="";
		String foreignValue="";
		if(vo.containsKey("foreignName"))foreignName=BasicFunction.replaceSQL(vo.get("foreignName"));
		if(vo.containsKey("foreignValue"))foreignValue=BasicFunction.replaceSQL(vo.get("foreignValue"));
		
		String sql="SELECT * FROM t_sys_order_detail WHERE orderId=" + orderId + " AND isDel=0";
		JSONArray rs=dao.fillRS(sql,s.config);
		for(int i=0;i<rs.length();i++){
			JSONObject row=rs.getJSONObject(i);
			
			switch(row.getInt("controlType")){
				case 2://Label
					break;
					
				default :
					String str=row.getString("columnName");
					if(vo.containsKey(str)) vo1.setProperty(str, BasicFunction.replaceSQL(vo.get(str)));
					break;
			}
		}
		
		if(foreignName.length()>0) vo1.setProperty(foreignName, foreignValue);
		
		vo1.TableName= table;
		if(id>0){
			vo1.id=id;
			dao.update(vo1,s.config);
		}else{
			vo1.TableName= table;
			id=dao.add(vo1,s.config);
		}

		//**********************************************************************************
		//保存后执行事件
		sql="SELECT formula FROM t_sys_order_event WHERE isDel=0 AND event=1 AND orderId=" + orderId;
		rs=dao.fillRS(sql,s.config);
		String formula="";
		for(int i=0;i<rs.length();i++){
			JSONObject row=rs.getJSONObject(i);
			formula=row.getString("formula");
			formula=formula.replace("{orderId}", id+"");
			formula=formula.replace("{userId}", s.userid+"");
			getFormula(s,formula);
		}
		//***********************************************************************************
	}
	
	
	//***************************************************************************************
	/**保存列表配置**/
	private void saveDatagridDetail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		int i=0;
		while(vo.containsKey("arrItem[" + i + "][id]")){
			String id=vo.get("arrItem[" + i + "][id]");
			String bindcolumn=vo.get("arrItem[" + i + "][bindcolumn]");
			String value=vo.get("arrItem[" + i + "][value]");
			if(bindcolumn.equals("caption")) value = "'" + value + "'";

			String sql="UPDATE t_sys_datagrid_detail SET " + bindcolumn + "=" + value + " WHERE id=" + id;
			dao.execute(sql,s.config);
			i++;
		}
	}
		
	
	//***************************************************************************************
	/**加载动态表单列表**/
	private void loadReport(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("reportId"))throw new Exception("缺少参数");
		String reportId =BasicFunction.replaceSQL(vo.get("reportId"));
		
		String sql="SELECT * FROM t_sys_report WHERE id=" + reportId;
		JSONArray rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			JSONObject row=rs.getJSONObject(0);
			String str=row.getString("params");
			String sqlstr=BasicFunction.getParam(str, "SQL", "").replaceAll("''", "'");
			String paramsliststr=BasicFunction.getParam(str, "ParamList", "");
			
			ArrayList<DataSourceParam> datasourceParams=new ArrayList<DataSourceParam>();
			int i=0;
			while(vo.containsKey("constr[" + i + "][name]")){
				DataSourceParam param=new DataSourceParam();
				param.name=vo.get("constr[" + i + "][name]");
				param.value=vo.get("constr[" + i + "][value]");
				datasourceParams.add(param);
				i++;
			};
			
			for(DataSourceParam param:datasourceParams){
				sqlstr=sqlstr.replaceAll("@"+param.name, param.value);
			}
			
			JSONArray rs2=dao.fillRS(sqlstr,s.config);
			r.put("records", rs2);
		}else{
			throw new Exception("找不到数据");
		}
	}
	

	//***************************************************************************************
	/**加载报表详细数据表头**/
	private void loadReportDetail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("reportId"))throw new Exception("缺少参数");
		String reportId =BasicFunction.replaceSQL(vo.get("reportId"));
		
		String sql="SELECT * FROM t_sys_report_detail WHERE reportId=" + reportId + " AND isVisible=1 ORDER BY sortIndex,id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	

	//***************************************************************************************
	/**加载报表动态快速筛选控件**/
	private void loadReportCondition(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("reportId"))throw new Exception("缺少参数");
		String reportId =BasicFunction.replaceSQL(vo.get("reportId"));
		
		String sql="SELECT * FROM t_sys_report_condition WHERE reportId=" + reportId + " ORDER BY tabIndex,id ASC";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	
	
	//***************************************************************************************
	/**保存报表详细数据配置**/
	private void saveReportDetail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		int i=0;
		while(vo.containsKey("arrItem[" + i + "][id]")){
			String id=vo.get("arrItem[" + i + "][id]");
			String bindcolumn=vo.get("arrItem[" + i + "][bindcolumn]");
			String value=vo.get("arrItem[" + i + "][value]");
			if(bindcolumn.equals("caption")) value = "'" + value + "'";

			String sql="UPDATE t_sys_report_detail SET " + bindcolumn + "=" + value + " WHERE id=" + id;
			dao.execute(sql,s.config);
			i++;
		}
	}
		
	
	//***************************************************************************************
	/**加载数据源的SQL**/
	private void loadDatasourceSql(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("params"))throw new Exception("缺少参数");
		String params =BasicFunction.replaceSQL(vo.get("params"));
		
		String DataSourceId=BasicFunction.getParam(params, "DataSourceId", "");
		String TextColumn=BasicFunction.getParam(params, "TextColumn", "");
		String ValueColumn=BasicFunction.getParam(params, "ValueColumn", "");
		String SelectedIndex=BasicFunction.getParam(params, "SelectedIndex", "");
		
		int i=0;
		ArrayList<DataSourceParam> datasourceParams=new ArrayList<DataSourceParam>();
		while(vo.containsKey("datasourceParams[" + i + "][name]")){
			DataSourceParam param=new DataSourceParam();
			param.name=vo.get("datasourceParams[" + i + "][name]");
			param.value=vo.get("datasourceParams[" + i + "][value]");
			datasourceParams.add(param);
			i++;
		};
		
		//datasourceParams[0][name]
		
		String sql="SELECT * FROM t_sys_datasource WHERE id=" + DataSourceId;
		JSONArray rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			JSONObject row=rs.getJSONObject(0);
			sql=row.getString("sql");
			
			//[Name=classId&DataType=1&DefaultValue=0&Caption=&TestValue=1]
			for(DataSourceParam param:datasourceParams){
				sql=sql.replaceAll("@"+param.name, param.value);
			}
			
			
			rs=dao.fillRS(sql,s.config);
			r.put("records", rs);
			r.put("TextColumn", TextColumn);
			r.put("ValueColumn", ValueColumn);
			r.put("SelectedIndex", SelectedIndex);
		}
		
	}
	
	
	//***************************************************************************************
	/**根据值获取显示文本**/
	private void getTextByValue(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String id =BasicFunction.replaceSQL(vo.get("id"));
		String datagridid =BasicFunction.replaceSQL(vo.get("datagridid"));
		String valueColumn =BasicFunction.replaceSQL(vo.get("valueColumn"));
		
		String sqlstr="";
		String sql="SELECT * FROM t_sys_datagrid WHERE id=" + datagridid;
		JSONArray rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			JSONObject row=rs.getJSONObject(0);
			sqlstr=BasicFunction.getParam(row.getString("params"), "SQL", "");
		}
		
		sql="SELECT t.* FROM (" + sqlstr + ")t WHERE CAST(t." + valueColumn + " AS CHAR)='" + id +"'";
		rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	
	//***************************************************************************************
	/**根据公式获取值**/
	private void getFormula(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String formula =BasicFunction.replaceSQL(vo.get("formula"));
		
		String value=getFormula(s,formula);
		r.put("formulaValue", value);
		
	}
	private String getFormula(MSession s,String formula) throws Exception{
		String formulaId=formula.substring(0, formula.indexOf("("));
		String[] formulaParams=formula.substring(formula.indexOf("(")+1, formula.indexOf(")")).split(",");
		
		String code="";
		String sql="SELECT * FROM t_sys_formula WHERE id=" + formulaId;
		JSONArray rs=dao.fillRS(sql,s.config);
		ArrayList<String> params=new ArrayList<String>();
		if(rs.length()>0){
			JSONObject row=rs.getJSONObject(0);
			code=row.getString("code");
			int language=row.getInt("language");
			//[Name=orderId&ParamType=1&DataType=System.String&DefaultValue=0&TestValue=1&Caption=订单ID],[Name=sysUserId&ParamType=1&DataType=System.String&DefaultValue=0&TestValue=1&Caption=系统操作员ID]
			String paramsStr=row.getString("params");
			int startindex=0;
			int endindex=0;
			for(int i=0;i<paramsStr.length();i++){
				if(paramsStr.charAt(i)=="[".charAt(0)){
					startindex=i;
				}
				if(paramsStr.charAt(i)=="]".charAt(0)){
					endindex=i;
					String paramStr=paramsStr.substring(startindex,endindex).replace("[", "").replace("]", "");
					params.add(paramStr);
					
				}
			}
			int i=0;
			for(String paramStr:params){
				String paramsName=BasicFunction.getParam(paramStr, "Name", "", "&");
				String defaultValue=BasicFunction.getParam(paramStr, "DefaultValue", "", "&");
				if(formulaParams.length>i){
					code=code.replace("@"+paramsName, formulaParams[i]);
				}else{
					code=code.replace("@"+paramsName, defaultValue);
				}
				
				i++;
			}
			
			switch(language){
			case 3:	//VBScript
				break;
				
			case 4:	//Command
				if(code.equals("REFRESH_DATASOURCE")){
					return "REFRESH_DATASOURCE";
				}else if(code.equals("GET_USER_ID")){
					return s.userid+"";
				}
				break;
				
			case 5:	//WebService
				HttpUtil.executeGet(code);
				break;
				
			default: //SQL
				if(code.toLowerCase().startsWith("call")){
					dao.execute(code,s.config);
				}else{
					//执行SQL语句
					rs=dao.fillRS(code,s.config);
					if(rs.length()>0){
						row=rs.getJSONObject(0);
						Iterator it = row.keys(); 
						if(it.hasNext()){
							String key = (String) it.next();  
							String value = row.getString(key); 
							return value;
						}
					}
				}
				break;
			}
		}
		
		return "";
	}
	
	private class DataSourceParam{
		public String name="";
		public String value="";
	}
	//***************************************************************************************
		/**ȡ�õ��뵼��excel�õ�������**/
		private void loadExcelForeign(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			String orderId =BasicFunction.replaceSQL(vo.get("orderId"));
			String sql="";
			JSONArray rs=null;
			//ȡ��excelId
			int excelId=0;
			sql="SELECT * FROM t_sys_order WHERE id=" + orderId;
			rs=dao.fillRS(sql, s.config);
			if(rs.length()<=0)return;
			String params=rs.getJSONObject(0).getString("params");
			
			//����orderIdȡ��excelId��tableName
			excelId=Integer.parseInt(BasicFunction.getParam(params, "ExcelId", "0"));
			sql="SELECT * FROM t_sys_inport_excel WHERE id=" + excelId;
			rs=dao.fillRS(sql, s.config);
			if(rs.length()<=0)return;
			//���ֵ�б�
			sql="SELECT caption,columnName,sourceIndex,datatype,IFNULL(defaultValue,'') AS defaultValue,IFNULL(params,'') AS params FROM t_sys_inport_excel_detail WHERE inportExcelId=" + excelId + " ORDER BY sourceIndex ASC";
	    	rs=dao.fillRS(sql,s.config);

	    	JSONArray records=new JSONArray();
	    	for(int i=0;i<rs.length();i++){
	    		JSONObject row=rs.getJSONObject(i);
	    		String val="";
	    		if(row.getString("params").trim().length()>0){
	    			boolean is_foreign=(Integer.parseInt(BasicFunction.getParam(row.getString("params"), "IS_FOREIGN","0"))==1);
	    			if(is_foreign){
	    				records.put(row);
	    			}
	    		}
	    	}
	    	r.put("records", records);
	    	r.put("excelId", excelId);
		}
		//***************************************************************************************
		/***importExcelCheck����excel���**/
		private void importExcelCheck(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			String excelId =BasicFunction.replaceSQL(vo.get("excelId"));
			String sql;
			JSONArray rs;
			sql="SELECT * FROM t_sys_inport_excel WHERE id=" + excelId;
	    	rs=dao.fillRS(sql, s.config);
	    	if(rs.length()<=0) return;
	    	String tablename=rs.getJSONObject(0).getString("tablename");
	    	String formula=BasicFunction.getParam(rs.getJSONObject(0).getString("params"),"Formula","");
	    	sql="SELECT columnName,sourceIndex,datatype,IFNULL(defaultValue,'') AS defaultValue,IFNULL(params,'') AS params FROM t_sys_inport_excel_detail WHERE (IFNULL(`inout`,3) IN(1,3)) AND inportExcelId=" + excelId;
	    	rs=dao.fillRS(sql,s.config);
	    	ArrayList<String> foreign_col=new ArrayList<String>();
	    	ArrayList<String> foreign_val=new ArrayList<String>();
	    	for(int i=0;i<rs.length();i++){
	    		JSONObject row=rs.getJSONObject(i);
	    		if(row.getString("params").trim().length()>0){
	    			boolean is_foreign=(Integer.parseInt(BasicFunction.getParam(row.getString("params"), "IS_FOREIGN","0"))==1);
	    			if(is_foreign){
	    				if(vo.containsKey(row.getString("columnName"))){
	    					foreign_col.add(row.getString("columnName"));
	    					foreign_val.add(vo.get(row.getString("columnName")));
	    				}
	    			}
	    		}
	    	}
	    	if(foreign_col.size()>0){
	    		String where="";
	    		for(int i=0;i<foreign_col.size();i++){
	    			String col=foreign_col.get(i);
	    			String val=foreign_val.get(i);
	    			if(i==0){
	    				where=where + " WHERE CONCAT(" + col +",'') ='" + val + "'";
	    			}else{
	    				where=where + " AND CONCAT(" + col +",'') ='" + val + "'";
	    			}
	    		}
				sql="SELECT id FROM " + tablename + where +" LIMIT 1";
				rs=dao.fillRS(sql,s.config);
				if(rs.length()>0){
					r.put("result","True");
				}
	    	}
		}
	/**导入excel**/
	private void importExcel(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		String excelId =BasicFunction.replaceSQL(vo.get("excelId"));
		String fileId =BasicFunction.replaceSQL(vo.get("fileId"));
		String sql="SELECT * FROM t_sys_file WHERE id=" + fileId;
		JSONArray rs=dao.fillRS(sql, s.config);
		if(rs.length()<=0)throw new Exception("找不到导入文件");
		JSONObject row=rs.getJSONObject(0);
		
		File file=new File(s.config.UPLOAD_PATH + "/file/upload/" +row.getString("path"));
		ArrayList<ArrayList<Object>> row_list=ExcelUtil.readExcel(file);
		
		String path=s.config.UPLOAD_PATH + row.getString("path");
		//ArrayList<ArrayList<Object>> row_list,int excelId,MDAO dao,MConfig config
    	sql="SELECT * FROM t_sys_inport_excel WHERE id=" + excelId;
    	rs=dao.fillRS(sql, s.config);
    	if(rs.length()<=0) return;
    	String tablename=rs.getJSONObject(0).getString("tablename");
    	String formula=BasicFunction.getParam(rs.getJSONObject(0).getString("params"),"Formula","");

    	sql="SELECT columnName,sourceIndex,datatype,IFNULL(defaultValue,'') AS defaultValue,IFNULL(params,'') AS params FROM t_sys_inport_excel_detail WHERE (IFNULL(`inout`,3) IN(1,3)) AND inportExcelId=" + excelId;
    	rs=dao.fillRS(sql,s.config);
    	ArrayList<String> foreign_col=new ArrayList<String>();
    	ArrayList<String> foreign_val=new ArrayList<String>();
    	for(int i=0;i<rs.length();i++){
    		row=rs.getJSONObject(i);
    		if(row.getString("params").trim().length()>0){
    			boolean is_foreign=(Integer.parseInt(BasicFunction.getParam(row.getString("params"), "IS_FOREIGN","0"))==1);
    			if(is_foreign){
    				if(vo.containsKey(row.getString("columnName"))){
    					foreign_col.add(row.getString("columnName"));
    					foreign_val.add(vo.get(row.getString("columnName")));
    				}
    			}
    		}
    	}
    	if(foreign_col.size()>0){
    		String where="";
    		for(int i=0;i<foreign_col.size();i++){
    			String col=foreign_col.get(i);
    			String val=foreign_val.get(i);
    			if(i==0){
    				where=where + " WHERE CONCAT(" + col +",'') ='" + val + "'";
    			}else{
    				where=where + " AND CONCAT(" + col +",'') ='" + val + "'";
    			}
    		}
    		sql="set sql_safe_updates=0";
			dao.execute(sql, s.config);
			sql="DELETE FROM " + tablename + where;
			dao.execute(sql, s.config);
    	}
    	for(int i=1;i<row_list.size();i++){
    		
    		ArrayList<Object> excel_row=row_list.get(i);
    		if(excel_row.get(0).toString().trim().length()==0)continue;
    		VO vo1=new VO();
    		if(foreign_col.size()>0){
        		for(int j=0;j<foreign_col.size();j++){
        			String col=foreign_col.get(j);
        			String val=foreign_val.get(j);
        			vo1.setProperty(col, val);
        		}
    		}
    		for(int j=0;j<rs.length();j++){
    			
        		row=rs.getJSONObject(j);
        		String defaultValue=row.getString("defaultValue");
        		if(row.getInt("sourceIndex")>-1){
        			String val="";
            		if(row.getString("params").trim().length()>0){
	            			//if(i==1&&)
	            			boolean is_key=(Integer.parseInt(BasicFunction.getParam(row.getString("params"), "IS_KEY","0"))==1);
	            			boolean is_foreign=(Integer.parseInt(BasicFunction.getParam(row.getString("params"), "IS_FOREIGN","0"))==1);
	            			val=excel_row.get(row.getInt("sourceIndex")).toString().trim();
	            			sql=BasicFunction.getParam(row.getString("params"), "SQL"," ").replace("{}",val);
	            			if(sql.trim().length()>0){
	            				JSONArray rs_temp=dao.fillRS(sql, s.config);
		            			if(rs_temp.length()>0){
		            				JSONObject json=rs_temp.getJSONObject(0);
		            				Iterator<String> columnnames = json.keys();
		    	       				 if (columnnames.hasNext()) {  
		    	       					 String columnname = (String) columnnames.next();
		    	       					 val=json.getString(columnname);
		    	       				 }
		            			}
	            			}
	            			
	            			if(is_key){
	            				sql="set sql_safe_updates=0";
	            				dao.execute(sql, s.config);
	            				sql="DELETE FROM " + tablename + " WHERE CONCAT(" + row.getString("columnName") +",'') ='" + val + "'";
	            				dao.execute(sql, s.config);
	//            				sql="set sql_safe_updates=1";
	//            				dao.execute(sql, s.config);
	            			}
	            			
	            		}else{
	            			val=excel_row.get(row.getInt("sourceIndex")).toString();
	            		}
	            		
	            		vo1.setProperty(row.getString("columnName"), (val.trim().length()>0?val:defaultValue));
	            		
	            	}
        		}
        		
    		vo1.TableName= tablename;
    		dao.add(vo1,s.config);
    	}
    	if(formula.length()>0){
    		getFormula(s,formula);
    	}
    }
	/**导出excel**/
	private void outportExcel(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		String orderId =BasicFunction.replaceSQL(vo.get("orderId"));
		String sql="";
		JSONArray rs=null;
		//ȡ��excelId
		int excelId=0;
		sql="SELECT * FROM t_sys_order WHERE id=" + orderId;
		rs=dao.fillRS(sql, s.config);
		if(rs.length()<=0)return;
		String params=rs.getJSONObject(0).getString("params");
		String datagridId=rs.getJSONObject(0).getString("listDataGridId");
		
		JSONObject json4out=new JSONObject();
		//����orderIdȡ��excelId��tableName
		excelId=Integer.parseInt(BasicFunction.getParam(params, "ExcelId", "0"));
		sql="SELECT * FROM t_sys_inport_excel WHERE id=" + excelId;
		rs=dao.fillRS(sql, s.config);
		if(rs.length()<=0)return;
		String tablename=rs.getJSONObject(0).getString("tablename");
		params=rs.getJSONObject(0).getString("params");
		boolean is_queue=(Integer.parseInt(BasicFunction.getParam(params, "IS_QUEUE","0"))==1);
		String path=rs.getJSONObject(0).getString("path");
		String path_source=s.config.UPLOAD_PATH + "/excel/inport/" + path;
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");  
    	String filename_new = df.format(new Date()) + "_" + new Random().nextInt(1000) + ".xlsx";  
		String path_out_temp=s.config.UPLOAD_PATH + "/file/upload/" +filename_new;
		//���ֵ�б�
		sql="SELECT columnName,sourceIndex,datatype,IFNULL(defaultValue,'') AS defaultValue,IFNULL(params,'') AS params FROM t_sys_inport_excel_detail WHERE inportExcelId=" + excelId + " AND (IFNULL(`inout`,3) IN(2,3)) ORDER BY sourceIndex ASC";
    	rs=dao.fillRS(sql,s.config);
    	ArrayList<String> foreign_col=new ArrayList<String>();
    	ArrayList<String> foreign_val=new ArrayList<String>();
    	for(int i=0;i<rs.length();i++){
    		JSONObject row=rs.getJSONObject(i);
    		String val="";
    		if(row.getString("params").trim().length()>0){
    			boolean is_foreign=(Integer.parseInt(BasicFunction.getParam(row.getString("params"), "IS_FOREIGN","0"))==1);
    			if(is_foreign){
    				if(vo.containsKey(row.getString("columnName"))){
    					foreign_col.add(row.getString("columnName"));
    					foreign_val.add(vo.get(row.getString("columnName")));
    				}
    			}
    		}
    	}
    	json4out.put("OutportSetting", rs);
    	if(!is_queue){
    		//����tableName�����ֵ�б���ý����
    		sql="SELECT * FROM " + tablename;
    		String where="";
    		for(int i=0;i<foreign_col.size();i++){
    			String col=foreign_col.get(i);
    			String val=foreign_val.get(i);
    			if(i==0){
    				where=where + " WHERE CONCAT(" + col +",'') ='" + val + "'";
    			}else{
    				where=where + " AND CONCAT(" + col +",'') ='" + val + "'";
    			}
    		}
    		sql=sql + where;
    	}else{
    		sql="SELECT * FROM t_sys_datagrid WHERE id=" + datagridId;
    		rs=dao.fillRS(sql, s.config);
    		if(rs.length()>0){
    			params=rs.getJSONObject(0).getString("params");
    			sql=BasicFunction.getParam(params,"SQL", "");
    		}
    		for(int i=0;i<foreign_col.size();i++){
    			String col=foreign_col.get(i);
    			String val=foreign_val.get(i);
    			sql=sql.replace("@" +col , val);
    		}
    	}
		if(sql.length()<=0)throw new Exception("�Ҳ���sql���");
		JSONArray rs_result=dao.fillRS(sql, s.config);
		json4out.put("records", rs_result);
		//����excelIdȡ��ģ��͵�����򣬸��Ƴ���ʱ�ļ�
		BasicFunction.copyFile(path_source, path_out_temp);
		//��������ϰ��յ������д����ʱexcel�ļ�
		ExcelUtil.writeRecords2Excel(json4out, path_out_temp,is_queue);
		//�����ʱexcel�ļ���url
		r.put("url", "../../../poly/file/upload/"+filename_new);
		
    }
}