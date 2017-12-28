package com.nhschool.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import com.boatsoft.common.BasicFunction;
import com.boatsoft.common.MAction;
import com.boatsoft.common.MSession;
import com.boatsoft.common.VO;
import com.boatsoft.servlet.DoServlet;

public class NhschoolAction extends MAction {
	@Override
	public void submit(String action,Map<String, String> vo,JSONObject r) throws Exception{
		switch(action){

		case "NHSCHOOL_SAVE_EMAIL":
			saveEmail(vo,r);
			break;
		case "NHSCHOOL_SEND_EMAIL":
			sendEmail(vo,r);
			break;
		case "NHSCHOOL_LOAD_EMAIL":
			loadEmail(vo,r);
			break;
		case "NHSCHOOL_READ_EMAIL":
			readEmail(vo,r);
			break;
		case "NHSCHOOL_GET_EMAIL_RECEIVE_UNREAD":
			getEmailReceiveUnread(vo,r);
			break;
		case "NHSCHOOL_GET_EMAIL_NEXTID":
			getEmailNextId(vo,r);
			break;
		case "NHSCHOOL_GET_EMAIL_RECEIVE":
			getEmailReceive(vo,r);
			break;
			
		case "NHSCHOOL_LOAD_NEWS":
			loadNews(vo,r);
			break;

		case "NHSCHOOL_GET_COUNT_BY_GRADE":
			getCountByGrade(vo,r);
			break;

		case "NHSCHOOL_GET_EMPLOYEEID_BY_SYSUSERID":
			getEmployeeIdBySysUserId(vo,r);
			break;
			
		case "NHSCHOOL_SAVE_SCHEDULE":
			saveSchedule(vo,r);
			break;
		case "NHSCHOOL_SAVE_SCHEDULE_TEMP":
			saveScheduleTemp(vo,r);
			break;
		case "NHSCHOOL_SAVE_DEPARTMENT_CUSTOM":
			saveDepartmentCustom(vo,r);
			break;
		case "NHSCHOOL_DELETE_DEPARTMENT_CUSTOM":
			deleteDepartmentCustom(vo,r);
			break;
		case "NHSCHOOL_LOAD_DEPARTMENT":
			loadDepartment(vo,r);
			break;
		case "NHSCHOOL_LOAD_DEPARTMENT_CUSTOM":
			loadDepartmentCustom(vo,r);
			break;
		case "NHSCHOOL_ADD_USER_DEPARTMENT_CUSTOM":
			addUserDepartmentCustom(vo,r);
			break;
		case "NHSCHOOL_DELETE_USER_DEPARTMENT_CUSTOM":
			deleteUserDepartmentCustom(vo,r);
			break;
		default:
		}
	}
	
	
	//***************************************************************************************
	/**保存草稿箱**/
	private void saveEmail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date now = new Date(System.currentTimeMillis());
		String timeSend=dateFormat.format(now);
		
		VO vo1=new VO();
		if(vo.containsKey("title")) vo1.setProperty("title", BasicFunction.replaceSQL(vo.get("title")));
		if(vo.containsKey("content")) vo1.setProperty("content", BasicFunction.replaceSQL(vo.get("content")));
		if(vo.containsKey("sysUserIdsReceive")) vo1.setProperty("sysUserIdsReceive", BasicFunction.replaceSQL(vo.get("sysUserIdsReceive")));
		vo1.setProperty("timeSend", timeSend);
		vo1.setProperty("sysUserIdSend", s.userid+"");
		vo1.setProperty("type", "0");
		vo1.setProperty("isRead", "1");
		if(vo.containsKey("fileList")) vo1.setProperty("fileList", BasicFunction.replaceSQL(vo.get("fileList")));
		vo1.TableName= "t_email";
		dao.add(vo1,s.config);
	}

	
	//***************************************************************************************
	/**发送邮件**/
	private void sendEmail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date now = new Date(System.currentTimeMillis());
		String timeSend=dateFormat.format(now);
		
		//保存到发件箱
		VO vo1=new VO();
		if(vo.containsKey("title")) vo1.setProperty("title", BasicFunction.replaceSQL(vo.get("title")));
		if(vo.containsKey("content")) vo1.setProperty("content", BasicFunction.replaceSQL(vo.get("content")));
		if(vo.containsKey("sysUserIdsReceive")) vo1.setProperty("sysUserIdsReceive", BasicFunction.replaceSQL(vo.get("sysUserIdsReceive")));
		vo1.setProperty("timeSend", timeSend);
		vo1.setProperty("sysUserIdSend", s.userid+"");
		vo1.setProperty("type", "2"); //发件箱
		vo1.setProperty("isRead", "1");
		if(vo.containsKey("fileList")) vo1.setProperty("fileList", BasicFunction.replaceSQL(vo.get("fileList")));
		vo1.TableName= "t_email";
		int fromId=dao.add(vo1,s.config);

		//保存到收件箱
		if(vo.containsKey("sysUserIdsReceive")){
			String[] arr=BasicFunction.replaceSQL(vo.get("sysUserIdsReceive")).split(",");
			for(String val:arr){
			    vo1=new VO();
				if(vo.containsKey("title")) vo1.setProperty("title", BasicFunction.replaceSQL(vo.get("title")));
				if(vo.containsKey("content")) vo1.setProperty("content", BasicFunction.replaceSQL(vo.get("content")));
				vo1.setProperty("sysUserIdsReceive", val);
				vo1.setProperty("timeSend", timeSend);
				vo1.setProperty("sysUserIdSend", s.userid+"");
				vo1.setProperty("type", "1"); //收件箱
				vo1.setProperty("isRead", "0");
				vo1.setProperty("fromId", fromId+"");
				if(vo.containsKey("fileList")) vo1.setProperty("fileList", BasicFunction.replaceSQL(vo.get("fileList")));
				vo1.TableName= "t_email";
				dao.add(vo1,s.config);
			}
		}
		
	}
	
	
	//***************************************************************************************
	/**加载邮件列表**/
	private void loadEmail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("tips"))throw new Exception("缺少参数");
		
		String sql="";
		if(BasicFunction.replaceSQL(vo.get("tips")).equals("SEND")){	//已发送
			sql="SELECT * FROM v_email WHERE isDel=0 AND type=2 AND sysUserIdSend=" + s.userid + " ORDER BY timeSend Desc";
		}else if(BasicFunction.replaceSQL(vo.get("tips")).equals("DRAFT")){	//草稿箱
			sql="SELECT * FROM v_email WHERE isDel=0 AND type=0 AND sysUserIdSend=" + s.userid + " ORDER BY timeSend Desc";
		}else if(BasicFunction.replaceSQL(vo.get("tips")).equals("DELETE")){	//垃圾箱
			sql="SELECT * FROM v_email WHERE isDel=1 AND type=2 AND sysUserIdSend=" + s.userid + " ORDER BY timeSend Desc";
		}else{	//收件箱
			sql="SELECT * FROM v_email WHERE isDel=0 AND type=1 AND sysUserIdsReceive=" + s.userid + " ORDER BY isRead ASC, timeSend DESC";
		}
		
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}


	//***************************************************************************************
	/**已读数据**/
	private void readEmail(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("id"))throw new Exception("缺少参数");
		
		String id =BasicFunction.replaceSQL(vo.get("id"));
		String sql="UPDATE t_email SET isRead=1 WHERE id IN (" + id+")";
		dao.execute(sql,s.config);
	}

	//***************************************************************************************
	/**获取收件箱未读邮件数据**/
	private void getEmailReceiveUnread(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String sql="SELECT * FROM t_email WHERE isDel=0 AND type=1 AND isRead=0 AND sysUserIdsReceive=" + s.userid + " ORDER BY timeSend Desc";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("count", rs.length());
	}

	//***************************************************************************************
	/**获取收件箱下一封未读邮件ID**/
	private void getEmailNextId(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		String sql="SELECT id FROM t_email WHERE isDel=0 AND type=1 AND isRead=0 AND sysUserIdsReceive=" + s.userid + " ORDER BY timeSend Asc LIMIT 1";
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}

	//***************************************************************************************
	/**获取收件人信息（已读、未读）**/
	private void getEmailReceive(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());

		if(!vo.containsKey("receiveUserid"))throw new Exception("缺少参数");
		if(!vo.containsKey("fromid"))throw new Exception("缺少参数");
		String receiveUserid =BasicFunction.replaceSQL(vo.get("receiveUserid"));
		String fromid =BasicFunction.replaceSQL(vo.get("fromid"));
		
		String sql="SELECT realname,username,isRead FROM t_email LEFT OUTER JOIN t_sys_user ON t_email.sysUserIdsReceive=t_sys_user.id";
		sql = sql + " WHERE type=1 AND fromId=" + fromid + " AND sysUserIdsReceive=" + receiveUserid;
		JSONArray rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**加载公告列表**/
	private void loadNews(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("tips"))throw new Exception("缺少参数");
		
		String sql="";
		JSONArray rs;
		String departmentId="0";
		//取得当前用户所属部门
		sql="SELECT departmentId FROM t_employee WHERE sysUserId=" + s.userid;
		rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			departmentId=rs.getJSONObject(0).getString("departmentId");
		}
		//取得当前用户所属年级数组
		int[] gradeIds=new int[1];
		boolean has_gradeIds=false;
		sql="SELECT DISTINCT t_b_grade.id FROM t_b_class INNER JOIN t_b_grade ON f_getGradeByYearReg(t_b_class.yearRegister)=t_b_grade.`name` WHERE t_b_class.id IN(SELECT DISTINCT classId FROM t_b_class_employee WHERE employeeId=(SELECT id FROM t_employee WHERE sysUserId=" +  s.userid + " LIMIT 1))";
		rs=dao.fillRS(sql,s.config);
		if(rs.length()>0){
			gradeIds=new int[rs.length()];
			has_gradeIds=true;
			for(int i=0;i<rs.length();i++){
				gradeIds[i]=rs.getJSONObject(i).getInt("id");
			}
		}
		
		if(BasicFunction.replaceSQL(vo.get("tips")).equals("NOW")){	//本周
			sql=" AND now() between timestampadd(day, (7*(week-1)), termDateBegin) AND timestampadd(day, (7*(week-1))+7, termDateBegin)";
		}else if(BasicFunction.replaceSQL(vo.get("tips")).equals("NEXT")){	//下周
			sql=" AND timestampadd(day, 7, now()) between timestampadd(day, (7*(week-1)), termDateBegin) AND timestampadd(day, (7*(week-1))+7, termDateBegin)";
		}else{
			sql="";
		}
		
		sql="SELECT * FROM v_news WHERE isDel=0 AND isStop=0" + sql;
		
		rs=dao.fillRS(sql,s.config);
		JSONArray rs1=new JSONArray();
		for(int i=0;i<rs.length();i++){
			JSONObject row=rs.getJSONObject(i);
			if(s.isSystem){
				rs1.put(row);
			}else{
				String str_deparement=row.getString("department");
				String str_grade=row.getString("grade");
				if(BasicFunction.include(str_deparement, departmentId+"", ",")){
					if(has_gradeIds){
						for(int j=0;j<gradeIds.length;j++){
							if(BasicFunction.include(str_grade, gradeIds[j]+"", ",")){
								rs1.put(row);
							}
						}
					}
				}
			}
			
		}
		r.put("records", rs1);
	}


	//***************************************************************************************
	/**获取某年级有多少个班**/
	private void getCountByGrade(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		if(!vo.containsKey("grade"))throw new Exception("缺少参数");
		
		JSONArray rs;
		String grade =BasicFunction.replaceSQL(vo.get("grade"));
		String sql="SELECT count(id) as countGrade FROM v_b_class WHERE grade='" + grade + "' GROUP BY grade";
		rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}


	//***************************************************************************************
	/**根据系统用户ID获取教职员ID**/
	private void getEmployeeIdBySysUserId(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		
		JSONArray rs;
		String sql="SELECT id FROM t_employee WHERE sysUserId=" + s.userid;
		rs=dao.fillRS(sql,s.config);
		r.put("records", rs);
	}
	
	//***************************************************************************************
	/**保存课表**/
	private void saveSchedule(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		//day,lessonId,classId,subject,teacher,date
		
		VO vo1=new VO();
		if(vo.containsKey("day")) vo1.setProperty("day", BasicFunction.replaceSQL(vo.get("day")));
		if(vo.containsKey("lessonId")) vo1.setProperty("lessonId", BasicFunction.replaceSQL(vo.get("lessonId")));
		if(vo.containsKey("classId")) vo1.setProperty("classId", BasicFunction.replaceSQL(vo.get("classId")));
		if(vo.containsKey("subject")) vo1.setProperty("subject", BasicFunction.replaceSQL(vo.get("subject")));
		vo1.TableName= "t_schedule";
		dao.add(vo1,s.config);
	}
	//***************************************************************************************
	/**保存临时课表**/
	private void saveScheduleTemp(Map<String, String> vo,JSONObject r) throws Exception{
		MSession s = this.getSession(vo, DoServlet.getSessionList());
		//day,lessonId,classId,subject,teacher,date
		
		VO vo1=new VO();
		if(vo.containsKey("day")) vo1.setProperty("day", BasicFunction.replaceSQL(vo.get("day")));
		if(vo.containsKey("lessonId")) vo1.setProperty("lessonId", BasicFunction.replaceSQL(vo.get("lessonId")));
		if(vo.containsKey("classId")) vo1.setProperty("classId", BasicFunction.replaceSQL(vo.get("classId")));
		if(vo.containsKey("subject")) vo1.setProperty("subject", BasicFunction.replaceSQL(vo.get("subject")));
		if(vo.containsKey("employeeId")) vo1.setProperty("employeeId", BasicFunction.replaceSQL(vo.get("employeeId")));
		if(vo.containsKey("date")) vo1.setProperty("date", BasicFunction.replaceSQL(vo.get("date")));
		vo1.TableName= "t_schedule_temp";
		dao.add(vo1,s.config);
	}
	//***************************************************************************************
		/**保存自定义分组**/
		private void saveDepartmentCustom(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			//day,lessonId,classId,subject,teacher,date
			int id=Integer.parseInt(BasicFunction.replaceSQL(vo.get("id")));
			VO vo1=new VO();
			vo1.setProperty("step", "1");
			vo1.setProperty("parentId", "0");
			vo1.setProperty("userId", s.userid+"");
			if(vo.containsKey("name")) vo1.setProperty("name", BasicFunction.replaceSQL(vo.get("name")));
			vo1.TableName= "t_department";
			if(id>0){
				vo1.id=id;
				dao.update(vo1, s.config);
			}else{
				dao.add(vo1,s.config);
			}
			
		}
		//***************************************************************************************
		/**删除自定义分组**/
		private void deleteDepartmentCustom(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			//day,lessonId,classId,subject,teacher,date
			int id=Integer.parseInt(BasicFunction.replaceSQL(vo.get("id")));
			String sql="SELECT * FROM t_department WHERE id=" + id + " AND userId=" + s.userid;
			JSONArray rs=dao.fillRS(sql, s.config);
			if(rs.length()>0){
				sql="UPDATE  t_department SET isDel=1 WHERE id=" + id;
				dao.execute(sql, s.config);
			}else{
				throw new Exception("’“≤ªµΩ∑÷◊È");
			}
	 	}
		
		private void loadDepartment(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			String sql="SELECT * FROM t_department WHERE isDel=0 AND (userId=" + s.userid + " OR userId=0)";
			JSONArray rs=dao.fillRS(sql,s.config);
			r.put("records", rs);
		}
		//***************************************************************************************
		/**载入自定义分组**/
		private void loadDepartmentCustom(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			String sql="SELECT * FROM t_department WHERE isDel=0 AND userId=" + s.userid;
			JSONArray rs=dao.fillRS(sql,s.config);
			r.put("records", rs);
	 	}
		//***************************************************************************************
		/**讲用户添加到自定义分组**/
		private void addUserDepartmentCustom(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			String ids=BasicFunction.replaceSQL(vo.get("ids"));
			String departmentId=BasicFunction.replaceSQL(vo.get("departmentId"));
			String sql="SELECT * FROM t_employee WHERE sysUserId IN(" + ids + ") AND (NOT find_in_set('" + departmentId + "',departmentId))";
			JSONArray rs=dao.fillRS(sql,s.config);
			for(int i=0;i<rs.length();i++){
				JSONObject row=rs.getJSONObject(i);
				int id=row.getInt("id");
				String deptId=row.getString("departmentId");
				sql="UPDATE t_employee SET departmentId='" + deptId+ "," + departmentId + "' WHERE id=" + id;
				dao.execute(sql, s.config);
			}
	 	}
		//***************************************************************************************
		/**删除自定义分组用户**/
		private void deleteUserDepartmentCustom(Map<String, String> vo,JSONObject r) throws Exception{
			MSession s = this.getSession(vo, DoServlet.getSessionList());
			String userId=BasicFunction.replaceSQL(vo.get("userId"));
			String departmentId=BasicFunction.replaceSQL(vo.get("departmentId"));
			String sql="SELECT * FROM t_employee WHERE sysUserId =" + userId;
			JSONArray rs=dao.fillRS(sql,s.config);
			for(int n=0;n<rs.length();n++){
				String departmentIds=rs.getJSONObject(n).getString("departmentId");
				int id=rs.getJSONObject(n).getInt("id");
				String[] temp=departmentIds.split(",");
				String new_departmentIds="";
				int j=0;
				for(int i=0;i<temp.length;i++){
					if(!temp[i].equals(departmentId)){
						if(j==0){
							new_departmentIds=temp[i];
						}else{
							new_departmentIds=new_departmentIds+"," + temp[i];
						}
						j++;
					}
				}
				sql="UPDATE t_employee SET departmentId='" + new_departmentIds +"' WHERE id=" + id;
				dao.execute(sql, s.config);
			}
		}
}
