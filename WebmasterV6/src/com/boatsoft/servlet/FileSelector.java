package com.boatsoft.servlet;
  
  
import javax.servlet.ServletException;  
import javax.servlet.ServletOutputStream;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;

import com.boatsoft.common.BasicFunction;
import com.boatsoft.common.MConfig;
import com.boatsoft.common.MDAO;
import com.boatsoft.common.MSession;
import com.boatsoft.common.VO;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest; 
import javax.servlet.http.HttpServletResponse;  
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;  
  
/** 
 * Created with IntelliJ IDEA. 
 * User: Administrator 
 * Date: 13-8-4 
 * Time: 下午3:06 
 * To change this template use File | Settings | File Templates. 
 */  
public class FileSelector extends HttpServlet {  
	
	//protected String dirTemp = "upload/widget/temp"; 
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
        response.setCharacterEncoding("utf-8");  
        response.setHeader("content-type","text/html;charset=UTF-8");  
  
        PrintWriter out=response.getWriter();  
  
  
        //---各个错误代码含义：  
        int errorCode_IOExcption_in_out=100;//无法读写临时文件  
        int errorCode_IOExcption_in=101;//无法打开input stream输入流  
        int errorCode_IOExcption_out=102;//无法打开output stream 输出流  
        int errorCode_IOExcption_move=103;//无法移动临时文件  
        
        //System.out.println("当前父类主要参数：name：【"+uploadFileName+"】，chunk：【"+_chunkSequence+"】，chunks：【"+_chunkTotal+"】");  
  
  
  
  
  
//        if(_chunkTotal<=0){  
//            out.print((getErrorRes(errorCode_IOExcption_in,"客户端上传分块数量错误！")).toString());  
//            return;  
//        }  
//        if(_chunkSequence>=_chunkTotal){  
//            out.print((getErrorRes(errorCode_IOExcption_in,"客户端当前分块序号不可能大于或等于总分块数！")).toString());  
//            return;  
//        }  
//  
//        if(uploadFileName==null || uploadFileName==""){  
//            out.print((getErrorRes(errorCode_IOExcption_in,"请明确当前文件名称！")).toString());  
//            return;  
//        }  
  
  
        //--检查文件名称  
//        }  
//        catch (Exception e){  
//            out.print((getErrorRes(errorCode_IOExcption_out,"写入文件时候出错！"+e.getMessage())).toString());  
//        }  
        try{
        	MDAO dao=new MDAO();
        	
        	String sessionId=request.getParameter("sessionid");
	        MSession s = this.getSession(sessionId, DoServlet.getSessionList());
	        if(s==null){
	        	throw new Exception("未登陆");
	        }
	        
	        //获取文件分类路径
	        String sql;
			HttpSession session = request.getSession();
        	UploadFileInfo fi=uploadFiles(request,response,s.config.UPLOAD_PATH + "/file/upload/temp");
        	//***************************************************************************************
        	/**保存文件 ，返回t_sys_files表id**/
        	if(fi.FileNameSrc.length()>0){
        		VO vo1=new VO();
        		vo1.setProperty("fileTypeId", "0");
        		vo1.setProperty("path", "temp/" + fi.FileNameNew);
        		vo1.setProperty("name", fi.FileNameSrc);
        		vo1.setProperty("extName", fi.FileExt);
        		vo1.setProperty("size", fi.size+"");
        		vo1.setProperty("isDel", "0");
        		vo1.TableName= "t_sys_file";
        		
        		fi.id=dao.add(vo1,s.config);
        		
        		session.setAttribute("addedId", fi.id);
        	}
        	if(session.getAttribute("addedId")!=null){
        		fi.id=(int) session.getAttribute("addedId");
        		sql="UPDATE t_sys_file SET `size`=" + fi.size + " WHERE id=" + fi.id;
        		dao.execute(sql, s.config);
        	}
        	//JSONObject result=getSuccessRes(fi.id,fi.FileNameNew);
        	
        	out.print(fi.id+"");
        }catch(Exception e){
        	out.print((getErrorRes(errorCode_IOExcption_out,e.getMessage())).toString());  
        }
        
        //out.print((getSuccessRes()).toString());
    }  
  
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
            doPost(request,response);  
    }  
    /**
	 * <p>使用plupload组件上传文件</p>
	 * @param request
	 * @param response
	 * @param rePath 保存文件的相对路径，以WebRoot为根
	 * @return
     * @throws Exception 
	 */
	public UploadFileInfo uploadFiles(HttpServletRequest request,HttpServletResponse response, String rePath) throws Exception{
		String filename_src = "";
		String filename_new = "";
		String fileExt="";
		int chunk = 0;// 当前正在处理的文件分块序号
		int chunks = 0;//分块上传总数
		HttpSession session = request.getSession();
		if(session.getAttribute("chunk")!=null){
			chunk=(int) session.getAttribute("chunk");
		}
		if(session.getAttribute("chunks")!=null){
			chunks=(int) session.getAttribute("chunks");
		}
		if(session.getAttribute("filename_new")!=null){
			filename_new=(String) session.getAttribute("filename_new");
		}
		
		long size=0;
		if(session.getAttribute("size")!=null){
			size=(long) session.getAttribute("size");
		}
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		// 判断当前表单是否为"multipart/form-data"
		if (isMultipart) {
			ServletFileUpload upload = new ServletFileUpload();
			//webroot绝对路径
			
	        
	        //String savePath = "E:/Documents/workspace/WebmasterV6/WebContent/images/upload/";  
	        String webRootPath = rePath;// 
			//
			//String webRootPath ="D:/workspace/WebmasterV6/WebContent/common/images/upload/"; 
			//String webRootPath = FileHelper.getServerWebRoot();
			try {
				FileItemIterator iter = upload.getItemIterator(request);
				while (iter.hasNext()) {
				    FileItemStream item = iter.next();
				    String name = item.getFieldName();
				    InputStream input = item.openStream();
				    
				    if("chunk".equals(name)) {
				    	chunk = Integer.valueOf(Streams.asString(input));
				    	session.setAttribute("chunk", chunk);
				    	continue;
				    }
				    if("chunks".equals(name)) {
				    	chunks = Integer.valueOf(Streams.asString(input));
				    	session.setAttribute("chunks", chunks);
				    	continue;
				    }
				    if("name".equals(name) && chunk==0 && filename_new.length()==0){
				    	filename_src=Streams.asString(input, "UTF-8");
				    	fileExt = filename_src.substring(filename_src.lastIndexOf(".") + 1).toLowerCase();
				    	SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");  
				    	filename_new = df.format(new Date()) + "_" + new Random().nextInt(1000) + "." + fileExt;  
				    	session.setAttribute("filename_new", filename_new);
				    	session.setAttribute("size", 0);
				    	continue;
				    }
			        if(chunks<=0){  
			        	throw new Exception("客户端上传分块数量错误！");
			        }  
			        if(chunk>=chunks){  
			        	throw new Exception("客户端当前分块序号不可能大于或等于总分块数！");
			        } 
				 // Handle a multi-part MIME encoded file.
				    if (!item.isFormField()) {

				    	// 保存文件目录绝对路径
				    	File dir = new File(webRootPath);
				    	if(!dir.isDirectory() || !dir.exists()){
				    		dir.mkdir();
				    	}
						
						//保存文件绝对路径
						String fullPath = webRootPath+"/"+filename_new;
						//filename_new=fullPath;
				    	if(chunk == 0){					    	
					    	OutputStream os = new FileOutputStream(fullPath);  
			                byte buf[] = new byte[1024];//可以修改 1024 以提高读取速度
			                int length = 0;    
			                while( (length = input.read(buf)) > 0 ){    
			                    os.write(buf, 0, length);    
			                    size+=length;
			                }    
			                //关闭流   
			                os.flush();
			                os.close(); 
			                session.setAttribute("size", size);
				    	}
				    	if(chunk > 0){
				    		//追加文件
				    		OutputStream os = new FileOutputStream(fullPath,true);    
			                byte buf[] = new byte[1024];//可以修改 1024 以提高读取速度
			                int length = 0;    
			                while( (length = input.read(buf)) > 0 ){    
			                    os.write(buf, 0, length);   
			                    size+=length;
			                }    
			                //关闭流   
			                os.flush();
			                os.close();  
			                session.setAttribute("size", size);
				    	}
				    	if(chunk+1 == chunks || chunks == 0){
				    		long s=0;
				    		session.setAttribute("filename_new", "");
				    		session.setAttribute("chunk", 0);
				    		session.setAttribute("chunks", 0);
				    		session.setAttribute("size", s);
				    		break;
				    	}
				    }
				}
			}
			catch (Exception e) {
				//log.error(e, e.fillInStackTrace());
				e.printStackTrace();
			}
		}
		UploadFileInfo fi=new UploadFileInfo();
		fi.FileExt=fileExt;
		fi.FileNameNew=filename_new;
		fi.FileNameSrc=filename_src;
		fi.size=size;
		fi.id=0;
		
		return fi;
	}
    public static JSONObject getErrorRes(int errorCode,String errorMsg){  
        //die('{"jsonrpc" : "2.0", "error" : {"code": 100, "message": "Failed to open temp directory."}, "id" : "id"}');  
    	try{
        	JSONObject json=new JSONObject();
        	json.put("jsonrpc","2.0");  
        	JSONObject _json_child=new JSONObject();  
        	_json_child.put("code",errorCode);  
        	_json_child.put("message",errorMsg);  
        	json.put("error",_json_child);  
        	json.put("id","id");  
            return json;  
    	}catch(Exception e){
    		return null;
    	}
    }  
  
    public static JSONObject getSuccessRes(int id,String filename_new){  
        //{"jsonrpc" : "2.0", "result" : null, "id" : "id"}');  ]
    	try{
        	JSONObject _hs=new JSONObject();  
            _hs.put("jsonrpc","2.0");  
      
            _hs.put("result",filename_new+"");  
            _hs.put("id",id+"");  
            return _hs;  
    	}catch(Exception e){
    		return null;
    	}
    	
    }  
    private MSession getSession(String sessionid,ArrayList<MSession> list){
		for(MSession s:list){
			if(sessionid.equals(s.getSessionId())){
				return s;
			}
		}
		return null;
	}
  
    private class UploadFileInfo{
    	public String FileNameSrc;
    	public String FileNameNew;
    	public long size=0;
    	public String FileExt;
    	public int id=0;
    }
}  