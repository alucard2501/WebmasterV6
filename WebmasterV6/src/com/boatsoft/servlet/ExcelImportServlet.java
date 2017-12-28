package com.boatsoft.servlet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.boatsoft.common.MSession;

public class ExcelImportServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	//上传文件的保存路径  
    protected String configPath = "upload/widget";  
  
    protected String dirTemp = "upload/widget/temp";  
      
    protected String dirName = "file";  
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExcelImportServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");  
        response.setContentType("text/html; charset=UTF-8");  
        PrintWriter out = response.getWriter();  
          
        //文件保存目录路径  
        String sessionId=request.getParameter("sessionid");
        MSession s = this.getSession(sessionId, DoServlet.getSessionList());
        
        //String savePath = "E:/Documents/workspace/WebmasterV6/WebContent/images/upload/";  
        String savePath = s.config.UPLOAD_PATH + "/excel/upload/";  
          
        // 临时文件目录
        String tempPath = this.getServletContext().getRealPath("/") + dirTemp;  
          
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");  
        String ymd = sdf.format(new Date());  
        savePath += "/" + ymd + "/";  
        //创建文件夹  
        File dirFile = new File(savePath);  
        if (!dirFile.exists()) {  
            dirFile.mkdirs();  
        }  
          
        tempPath += "/" + ymd + "/";  
        //创建临时文件夹 
        File dirTempFile = new File(tempPath);  
        if (!dirTempFile.exists()) {  
            dirTempFile.mkdirs();  
        }  
          
        DiskFileItemFactory  factory = new DiskFileItemFactory();  
        factory.setSizeThreshold(20 * 1024 * 1024); //设定使用内存超过5M时，将产生临时文件并存储于临时目录中。
        factory.setRepository(new File(tempPath)); //设定存储临时文件的目录。
        ServletFileUpload upload = new ServletFileUpload(factory);  
        upload.setHeaderEncoding("UTF-8");  
        try {  
            List items = upload.parseRequest(request);  
            System.out.println("items = " + items);  
            Iterator itr = items.iterator();  
              
            while (itr.hasNext())   
            {  
                FileItem item = (FileItem) itr.next();  
                String fileName = item.getName();  
                long fileSize = item.getSize();  
                if (!item.isFormField()) {  
                    String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();  
                    SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");  
                    String newFileName = df.format(new Date()) + "_" + new Random().nextInt(1000) + "." + fileExt;  
                    try{  
                        File uploadedFile = new File(savePath, newFileName);  
                        
                        OutputStream os = new FileOutputStream(uploadedFile);  
                        InputStream is = item.getInputStream();  
                        byte buf[] = new byte[1024];//可以修改 1024 以提高读取速度
                        int length = 0;    
                        while( (length = is.read(buf)) > 0 ){    
                            os.write(buf, 0, length);    
                        }    
                        //关闭流   
                        os.flush();  
                        os.close();    
                        is.close();    
                        System.out.println("上传成功！路径："+savePath+"/"+newFileName);  
                        out.print(savePath+"/"+newFileName);  
                    }catch(Exception e){  
                        e.printStackTrace();  
                    }  
                }else {  
                    String filedName = item.getFieldName();  
                    System.out.println("===============");   
                    System.out.println(new String(item.getString().getBytes("iso-8859-1"),"utf-8"));  
                    System.out.println("FieldName锛�"+filedName);  
                    // 获得裁剪部分的坐标和宽高
                    System.out.println("String锛�"+item.getString());  
                }             
            }   
              
        } catch (FileUploadException e) {  
            // TODO Auto-generated catch block  
            e.printStackTrace();  
        }  
        out.flush();  
        out.close(); 
		
	}
	
	private MSession getSession(String sessionid,ArrayList<MSession> list){
		for(MSession s:list){
			if(sessionid.equals(s.getSessionId())){
				return s;
			}
		}
		return null;
	}
}