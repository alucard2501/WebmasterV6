package com.boatsoft.common;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.aspose.cells.SaveFormat;
import com.aspose.cells.Workbook;
import com.aspose.pdf.devices.JpegDevice;

public class BasicFunction {
	
    
	public static String replaceSQL(String param){
		return param;
	}
    /**
     * Convert byte[] to hex string.锟斤拷锟斤拷锟斤拷锟角匡拷锟皆斤拷byte转锟斤拷锟斤拷int锟斤拷然锟斤拷锟斤拷锟斤拷Integer.toHexString(int)锟斤拷转锟斤拷锟斤拷16锟斤拷锟斤拷锟街凤拷
     * @param src byte[] data
     * @return hex string
     */   
    public static String bytesToHexString(byte[] src){
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv+"");
        }
        return stringBuilder.toString();
    }
    public static String byteToHexString(byte src){
    	int v = src & 0xFF;
    	String hv = Integer.toHexString(v);
    	if (hv.length() ==1)hv="0"+hv;
        return hv;
    }
    /**
     * Convert byte[] to hex string.锟斤拷锟斤拷锟斤拷锟角匡拷锟皆斤拷byte转锟斤拷锟斤拷int锟斤拷然锟斤拷锟斤拷锟斤拷Integer.toHexString(int)锟斤拷转锟斤拷锟斤拷16锟斤拷锟斤拷锟街凤拷
     * @param src byte[] data
     * @return hex string
     */   
    public static String bytesIpToString(byte[] src){
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String hv =v+"";
            if(i<3){
            	stringBuilder.append(hv+".");
            }else{
            	stringBuilder.append(hv+"");
            }
        }
        return stringBuilder.toString();
    }
    
    public static String intipToHexString(int ip){
    	byte[] temp=new byte[4];
    	temp[0]=(byte) (ip & 0xff);
    	temp[1]=(byte)((ip>>8)&0xff);
    	temp[2]=(byte)((ip>>16)&0xff);
    	temp[3]=(byte)((ip>>24)&0xff);
    	return bytesToHexString(temp);
    }
    public static String stringIpToHexString(String ip){
    	byte[] temp=new byte[4];
    	String[] tempstr=ip.split("\\.");
    	temp[0]=(byte) Integer.parseInt(tempstr[0]);
    	temp[1]=(byte) Integer.parseInt(tempstr[1]);
    	temp[2]=(byte) Integer.parseInt(tempstr[2]);
    	temp[3]=(byte) Integer.parseInt(tempstr[3]);
    	return bytesToHexString(temp);
    }
    public static String intIpToString(int ipaddress){
    	return (ipaddress & 0xFF ) + "." + ((ipaddress >> 8 ) & 0xFF) + "." +  ((ipaddress >> 16 ) & 0xFF) + "." + ( ipaddress >> 24 & 0xFF) ;
    }
    /**
     * Convert hex string to byte[]
     * @param hexString the hex string
     * @return byte[]
     */
    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        String hexs[];
        if(hexString.indexOf(" ")>=0){
        	hexs=hexString.split(" ");
        }else{
        	hexs=new String[hexString.length()/2];
        	for(int i=0;i<hexs.length;i++){
        		hexs[i]=hexString.substring(i*2, i*2+2);
        	}
        }
        
        int length = hexs.length;
        
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
     	   char[] hexChars = hexs[i].toCharArray();
            d[i] = (byte) (charToByte(hexChars[0]) << 4 | charToByte(hexChars[1]));
        }
        return d;
    }
    /**
     * Convert char to byte
     * @param c char
     * @return byte
     */
     private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }
     
     public static byte hexStringToSingleByte(String hexString){
  	   char[] hexChars = hexString.toCharArray();
  	   return (byte) (charToByte(hexChars[0]) << 4 | charToByte(hexChars[1]));
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
	public static boolean isInteger(String str){  
  	   for(int i=str.length();--i>=0;){  
 	      int chr=str.charAt(i);  
 	      if(chr<48 || chr>57)  
 	         return false;  
 	   }  
 	   return true;  
 	}
     public static String getParam(String paramsStr,String name,String defaultvalue){
    	 return getParam(paramsStr,name,defaultvalue,";");
     }
     public static String getParam(String paramsStr,String name,String defaultvalue,String splitchar){
    	 String[] items=paramsStr.split(splitchar);
    	 for(String item:items){
    		 if(item.length()>0 && item.contains("=")){
    			 if(item.startsWith(name + "=")){
    				 return item.replace(name + "=", "");
    			 }
    		 }
    	 }
    	 return defaultvalue;
     }
     /** 
      * 把数组所有元素排序，并按照“参数=参数值”的模式用“&”字符拼接成字符串
      * @param params 需要排序并参与字符拼接的参数组
      * @return 拼接后字符串
      */
     public static String createLinkString(Map<String, String> params) {

         List<String> keys = new ArrayList<String>(params.keySet());
         Collections.sort(keys);

         String prestr = "";

         for (int i = 0; i < keys.size(); i++) {
             String key = keys.get(i);
             String value = params.get(key);

             if (i == keys.size() - 1) {//拼接时，不包括最后一个&字符
                 prestr = prestr + key + "=" + value;
             } else {
                 prestr = prestr + key + "=" + value + "&";
             }
         }

         return prestr;
     }
     public static String createNoncestr(int length){
    	 String chars="abcdefghijklmnopqrstuvwxyz0123456789";
    	 StringBuilder sb=new StringBuilder();
    	 for(int i=0;i<length;i++){
    		 sb.append(chars.charAt((int) Math.min(Math.random()*length, length)));
    	 }
    	 return sb.toString();
     }
     public static Document json2XML(JSONObject json) throws ParserConfigurationException, JSONException, ClassNotFoundException{
         DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
         DocumentBuilder dbBuilder = dbFactory.newDocumentBuilder();
        
    	 Document doc= dbBuilder.newDocument();
    	 Iterator it = json.keys();
    	 Element result=doc.createElement("Result");
    	 while (it.hasNext()) {  
    		 String key = (String) it.next(); 
    		 Object value = json.get(key);
    		 if(value.getClass()==Class.forName("org.json.JSONObject")){
    			 Element node=json2XMLElement((JSONObject) value,doc,key);
    			 result.appendChild(node); 
    		 }else if(value.getClass()==Class.forName("org.json.JSONArray")){
    			 Element node=doc.createElement(key);
    			 for(int i=0;i<((JSONArray)value).length();i++){
    				 JSONObject record=((JSONArray)value).getJSONObject(i);
    				 node.appendChild(json2XMLElement(record,doc,"record"));
    			 }
    			 result.appendChild(node);
    		 }else{
    			 Element node=doc.createElement(key);
    			 node.appendChild(doc.createTextNode(value.toString()));
    			 result.appendChild(node); 
    		 }
    	 }
    	 doc.appendChild(result);
    	 return doc;
     }
     private static Element json2XMLElement(JSONObject json,Document doc,String elementname) throws JSONException, ClassNotFoundException{
    	 Element root=doc.createElement(elementname);
    	 Iterator<String> it = json.keys();
    	 while (it.hasNext()) {  
    		 String key = (String) it.next(); 
    		 Object value = json.get(key);
    		 
    		 if(value.getClass()==Class.forName("org.json.JSONObject")){
    			 Element node=json2XMLElement((JSONObject) value,doc,key);
    			 root.appendChild(node); 
    		 }else if(value.getClass()==Class.forName("org.json.JSONArray")){
    			 Element node=doc.createElement(key);
    			 for(int i=0;i<((JSONArray)value).length();i++){
    				 JSONObject record=((JSONArray)value).getJSONObject(i);
    				 node.appendChild(json2XMLElement(record,doc,"record"));
    			 }
    			 root.appendChild(node);
    		 }else{
    			 Element node=doc.createElement(key);
    			 node.appendChild(doc.createTextNode((String) value));
    			 root.appendChild(node); 
    		 }
    	 }
    	 return root;
     }
     public static String json2XMLString(JSONObject json) throws ParserConfigurationException, JSONException, ClassNotFoundException{
    	 Document doc=json2XML(json);
    	 return toStringFromDoc(doc);
     }
     public static String json2ParamsString(JSONObject json) throws JSONException, ClassNotFoundException{
    	 StringBuilder sb=new StringBuilder();
    	 Iterator<String> it = json.keys();
    	 
    	 while (it.hasNext()) {  
    		 String key = (String) it.next(); 
    		 Object value = json.get(key);
    		 if(value.getClass()==Class.forName("org.json.JSONArray")){
    			 
    			 JSONArray table=(JSONArray) ((JSONArray)value).get(0);
    			 for(int i=0;i<table.length();i++){
    				 sb.append(key+"=[");
    				 JSONObject record=table.getJSONObject(i);
    				 Iterator<String> columnnames = record.keys();
    				 while (columnnames.hasNext()) {  
    					 String columnname = (String) columnnames.next();
    					 Object columnvalue=record.get(columnname);
    					 if(columnnames.hasNext()){
    						 sb.append(columnname + "="+columnvalue+",");
    					 }else{
    						 sb.append(columnname + "="+columnvalue);
    					 }
    				 }
    				 sb.append("];");
    			 }
    		 }else{
    			 sb.append(key + "=" + value+";");
    		 }
    		 
    	 }
    	 return sb.toString();
     }
     public static String jsonTable2ParamsString(JSONObject json) throws JSONException, ClassNotFoundException{
    	 StringBuilder sb=new StringBuilder();
    	 Iterator<String> it = json.keys();
    	 JSONArray columns=null;
    	 //JSONArray captions=null;
    	 JSONArray Records=null;
    	 while (it.hasNext()) {  
    		 String key = (String) it.next(); 
    		 Object value = json.get(key);
    		 if(key.equals("ColumnsLongStatus")){
    			 columns=(JSONArray) ((JSONArray)value).get(0);
    		 }else if(key.equals("Caption")){
    			 //captions=(JSONArray) ((JSONArray)value).get(0);
    		 }else if(key.equals("Record")){
    			 Records=(JSONArray) ((JSONArray)value).get(0);
    		 }else if(value.getClass()==Class.forName("org.json.JSONArray")){
    			 JSONArray table=(JSONArray) ((JSONArray)value).get(0);
    			 for(int i=0;i<table.length();i++){
    				 sb.append(key+"=[");
    				 JSONObject record=table.getJSONObject(i);
    				 Iterator<String> columnnames = record.keys();
    				 while (columnnames.hasNext()) {  
    					 String columnname = (String) columnnames.next();
    					 Object columnvalue=record.get(columnname);
    					 if(columnnames.hasNext()){
    						 sb.append(columnname + "="+columnvalue+",");
    					 }else{
    						 sb.append(columnname + "="+columnvalue);
    					 }
    				 }
    				 sb.append("];");
    			 }
    		 }else{
    			 sb.append(key + "=" + value+";");
    		 }
    	 }
    	 boolean hasCode=false;
    	 if(columns!=null){
    		 if(Records.length()>0){
    			 JSONObject record=Records.getJSONObject(0);
    			 if(record.has("code")){
    				 hasCode=true;
    			 }
    		 }
    		 
    		 sb.append("Columns=[");
    		 if(hasCode){
    			 sb.append("code=75,roomType=75,");
    		 }else{
    			 sb.append("roomType=75,");
    		 }
    		 
    		 for(int i=0;i<columns.length();i++){
    			 JSONObject record=columns.getJSONObject(i);
    			 if(i<columns.length()-1){
					 sb.append(record.getString("columnName") + "="+record.getString("width")+",");
				 }else{
					 sb.append(record.getString("columnName") + "="+record.getString("width"));
				 }
    		 }
    		 sb.append("];");
    		 sb.append("Caption=[");
    		 if(hasCode){
    			 sb.append("code=房间号,roomType=房间类型,");
    		 }else{
    			 sb.append("roomType=房间类型,");
    		 }
    		
    		 for(int i=0;i<columns.length();i++){
    			 JSONObject record=columns.getJSONObject(i);
    			 if(i<columns.length()-1){
					 sb.append(record.getString("columnName") + "="+record.getString("columnName")+",");
				 }else{
					 sb.append(record.getString("columnName") + "="+record.getString("columnName"));
				 }
    		 }
    		 sb.append("];");
    	 }
    	 if(Records!=null){
    		 for(int i=0;i<Records.length();i++){
    			 sb.append("Record=[");
    			 JSONObject record=Records.getJSONObject(i);
    			 if(hasCode){
    				 sb.append("code="+record.getString("code")+",");
    			 }
    			 sb.append("roomType="+record.getString("roomType")+",");
    			 for(int j=0;j<columns.length();j++){
    				 JSONObject column=columns.getJSONObject(j);
    				 if(j<columns.length()-1){
    					 sb.append(column.getString("columnName") + "="+record.getString(column.getString("columnName"))+",");
    				 }else{
    					 sb.append(column.getString("columnName") + "="+record.getString(column.getString("columnName")));
    				 }
    			 }
    			 
    			 sb.append("];");
    		 }
    	 }
    	 return sb.toString();
     }
     
     public static boolean include(String source,String seek,String split){
    	 String[] temp=source.split(split);
    	 if(temp.length>0){
    		 for(int i=0;i<temp.length;i++){
    			 if(temp[i].equals(seek)){
    				 return true;
    			 }
    		 }
    		 return false;
    	 }else{
    		 return false;
    	 }
     }
     
     /*  
      * 把dom文件转换为xml字符串  
      */  
     private static String toStringFromDoc(Document document) {  
         String result = null;  
   
         if (document != null) {  
             StringWriter strWtr = new StringWriter();  
             StreamResult strResult = new StreamResult(strWtr);  
             TransformerFactory tfac = TransformerFactory.newInstance();  
             try {  
                 javax.xml.transform.Transformer t = tfac.newTransformer();  
                 t.setOutputProperty(OutputKeys.ENCODING, "UTF-8");  
                 t.setOutputProperty(OutputKeys.INDENT, "yes");  
                 t.setOutputProperty(OutputKeys.METHOD, "xml"); // xml, html,  
                 // text  
                 t.setOutputProperty(  
                         "{http://xml.apache.org/xslt}indent-amount", "4");  
                 t.transform(new DOMSource(document.getDocumentElement()),  
                         strResult);  
             } catch (Exception e) {  
                 System.err.println("XML.toString(Document): " + e);  
             }  
             result = strResult.getWriter().toString();  
             try {  
                 strWtr.close();  
             } catch (IOException e) {  
                 e.printStackTrace();  
             }  
         }  
   
         return result;  
     }

     /** 
      * 复制单个文件 
      * @param oldPath String 原文件路径 如：c:/fqf.txt 
      * @param newPath String 复制后路径 如：f:/fqf.txt 
      * @return boolean 
      */ 
    public static void copyFile(String oldPath, String newPath) { 
        try { 
            int bytesum = 0; 
            int byteread = 0; 
            File oldfile = new File(oldPath); 
            if (oldfile.exists()) { //文件存在时 
                InputStream inStream = new FileInputStream(oldPath); //读入原文件 
                File myFilePath = new File(newPath); 
                File myPath = new File(newPath.substring(0,newPath.lastIndexOf("/")));
                if (!myPath.exists()) { 
                	myPath.mkdir(); 
                }
                if (!myFilePath.exists()) { 
                    myFilePath.createNewFile(); 
                } 
                FileOutputStream fs = new FileOutputStream(newPath); 
                byte[] buffer = new byte[1444]; 
                int length; 
                while ( (byteread = inStream.read(buffer)) != -1) { 
                    bytesum += byteread; //字节数 文件大小 
                    //System.out.println(bytesum); 
                    fs.write(buffer, 0, byteread); 
                } 
                inStream.close(); 
                fs.close();
            } 
        } 
        catch (Exception e) { 
            System.out.println("复制单个文件操作出错"); 
            e.printStackTrace();

        }

    }
    /** 
     * 删除文件 
     * @param filePathAndName String 文件路径及名称 如c:/fqf.txt 
     * @param fileContent String 
     * @return boolean 
     */ 
   public static void delFile(String filePathAndName) { 
       try { 
           String filePath = filePathAndName; 
           filePath = filePath.toString(); 
           java.io.File myDelFile = new java.io.File(filePath); 
           myDelFile.delete();

       } 
       catch (Exception e) { 
           System.out.println("删除文件操作出错"); 
           e.printStackTrace();

       }

   }
	/** 
    * 移动文件到指定目录 
    * @param oldPath String 如：c:/fqf.txt 
    * @param newPath String 如：d:/fqf.txt 
    */ 
	public static void moveFile(String oldPath, String newPath) { 
		copyFile(oldPath, newPath); 
		delFile(oldPath);

	}
	
	/** 
	 * 调整图片大小
	 */ 
	public static void resetImageSize(String imgPath,int tag_w,int tag_h){
		int imageWidth = 0;//图片的宽度  
        int imageHeight = 0;//图片的高度  
        int x=0,y=0,w=0,h=0;
        try  
        {    
        	InputStream imagein = new FileInputStream(imgPath);
        	BufferedImage image_src = ImageIO.read(imagein);
        	int src_w=image_src.getWidth();
        	int src_h=image_src.getHeight();
        	
        	if(tag_w>0 && tag_h>0){
            	float ss=(float)src_w/(float)src_h;
            	float st=(float)tag_w/(float)tag_h;
            	if(ss==st){
            		x=0;
            		y=0;
            		w=tag_w;
            		h=tag_h;
            		imageWidth=w;
            		imageHeight=h;
            	}else if(ss>st){
            		x=0;
            		w=tag_w;
            		h=w*src_h/src_w;
            		y=(tag_h-h)/2;
            		imageWidth=w;
            		imageHeight=tag_h;
            	}else{
            		y=0;
            		h=tag_h;
            		w=h*src_w/src_h;
            		x=(tag_w-w)/2;
            		imageWidth=tag_w;
            		imageHeight=h;
            	}
            }else if(tag_w==0 && tag_h>0){
            	x=0;
            	y=0;
            	h=tag_h;
            	w=h*src_w/src_h;
            	imageWidth=w;
        		imageHeight=h;
            }else if(tag_h==0 && tag_w>0){
            	x=0;
            	y=0;
            	w=tag_w;
            	h=w*src_h/src_w;
            	imageWidth=w;
        		imageHeight=h;
            }
        	BufferedImage image = new BufferedImage(imageWidth, imageHeight, BufferedImage.TYPE_INT_ARGB);  
            Graphics g = image.getGraphics();  
        	g.setColor(new Color(0,0,0,0)); 
            g.fillRect(0, 0, imageWidth, imageHeight);  
            
            g.drawImage(image_src.getScaledInstance(w, h,  Image.SCALE_SMOOTH), x, y,  null);
            //g.drawImage(image_src, x, y,w, h, null);
            imagein.close();
            ImageIO.write(image, "PNG", new File(imgPath));//生成图片方法一    
            
            g.dispose();//释放资源 
        }catch(Exception ex){  
            ex.printStackTrace();  
        }
	}
	/** 
	 * 生成缩略图
	 */ 
	public static void createImagePreview(String imgPath,String prePath,int s_w,int s_h){
        int x=0,y=0,w=0,h=0;
        int imageWidth = 0;//图片的宽度  
        int imageHeight = 0;//图片的高度  
        try  
        {    
        	File myPath = new File(prePath.substring(0,prePath.lastIndexOf("/")));
            if (!myPath.exists()) { 
            	myPath.mkdir(); 
            }
            
        	InputStream imagein = new FileInputStream(imgPath);
        	BufferedImage image_src = ImageIO.read(imagein);
        	int src_w=image_src.getWidth();
        	int src_h=image_src.getHeight();
        	
        	if(s_w>0 && s_h>0){
            	float ss=(float)src_w/(float)src_h;
            	float st=(float)s_w/(float)s_h;
            	if(ss==st){
            		x=0;
            		y=0;
            		w=s_w;
            		h=s_h;
            		imageWidth=w;
            		imageHeight=h;
            	}else if(ss>st){
            		x=0;
            		w=s_w;
            		h=w*src_h/src_w;
            		y=(s_h-h)/2;
            		imageWidth=w;
            		imageHeight=s_h;
            	}else{
            		y=0;
            		h=s_h;
            		w=h*src_w/src_h;
            		x=(s_w-w)/2;
            		imageWidth=s_w;
            		imageHeight=h;
            	}
            }else if(s_w==0 && s_h>0){
            	x=0;
            	y=0;
            	h=s_h;
            	w=h*src_w/src_h;
            	imageWidth=w;
        		imageHeight=h;
            }else if(s_h==0 && s_w>0){
            	x=0;
            	y=0;
            	w=s_w;
            	h=w*src_h/src_w;
            	imageWidth=w;
        		imageHeight=h;
            }
        	BufferedImage image = new BufferedImage(imageWidth, imageHeight, BufferedImage.TYPE_INT_ARGB);  
            Graphics g = image.getGraphics();  
        	g.setColor(new Color(0,0,0,0)); 
            g.fillRect(0, 0, imageWidth, imageHeight);  
            
            
            g.drawImage(image_src, x, y,w, h, null);
            imagein.close();
            ImageIO.write(image, "PNG", new File(prePath));//生成图片方法一    
            
            g.dispose();//释放资源 
        }catch(Exception ex){  
            ex.printStackTrace();  
        }
	}
     
	/**
	 * MD5加密
     * @param content
     * @param charset
     * @return
     * @throws SignatureException
     * @throws UnsupportedEncodingException 
     */
    public static byte[] getContentBytes(String content, String charset) {
        if (charset == null || "".equals(charset)) {
            return content.getBytes();
        }
        try {
            return content.getBytes(charset);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("MD5签名过程中出现错误,指定的编码集不对,您目前指定的编码集是:" + charset);
        }
    }

    /**1--word 2--excel 3--pdf**/
    public static boolean getAsposeLicense(int filetype) {
        boolean result = false;
        try {
            ClassLoader loader = Thread.currentThread().getContextClassLoader();
            if(filetype==1){//word
            	InputStream  license = new FileInputStream(loader.getResource("license_word.xml").getPath());// ∆æ÷§Œƒº˛
                com.aspose.words.License aposeLic = new com.aspose.words.License();
                aposeLic.setLicense(license);
            }else if(filetype==2){
            	InputStream  license = new FileInputStream(loader.getResource("license_excel.xml").getPath());// ∆æ÷§Œƒº˛
            	com.aspose.cells.License aposeLic = new com.aspose.cells.License();
                aposeLic.setLicense(license);
            }else if(filetype==3){
            	InputStream  license = new FileInputStream(loader.getResource("license_pdf.xml").getPath());// ∆æ÷§Œƒº˛
            	com.aspose.pdf.License aposeLic = new com.aspose.pdf.License();
                aposeLic.setLicense(license);
            }else{
            	return false;
            }
            
            
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
    public static String doc2pdf(String docPath) throws Exception{
    	getAsposeLicense(1);
    	InputStream  fileInput = new FileInputStream(docPath);
    	com.aspose.words.Document doc = new com.aspose.words.Document(fileInput);
    	String outputFile=docPath.substring(0,docPath.lastIndexOf("."))+".pdf";
    	FileOutputStream fileOS = new FileOutputStream(outputFile);
    	doc.save(fileOS, com.aspose.words.SaveFormat.PDF);
    	return outputFile;
    }
    public static int doc2jpg(String docPath) throws Exception{
    	String pdfPath=doc2pdf(docPath);
    	return pdf2jpg(pdfPath);
    }
    public static  String xls2pdf(String xlsPath)  throws Exception{
    	getAsposeLicense(2);
    	InputStream  fileInput = new FileInputStream(xlsPath);
    	Workbook wb = new Workbook(fileInput);
    	String outputFile=xlsPath.substring(0,xlsPath.lastIndexOf("."))+".pdf";
    	FileOutputStream fileOS = new FileOutputStream(outputFile);
        wb.save(fileOS, SaveFormat.PDF);
        return outputFile;
    }
    public static int xls2jpg(String xlsPath) throws Exception{
    	String pdfPath=xls2pdf(xlsPath);
    	return pdf2jpg(pdfPath);
    }
    public static int pdf2jpg(String pdfPath) throws Exception{
    	getAsposeLicense(3);
    	InputStream  fileInput = new FileInputStream(pdfPath);
    	com.aspose.pdf.Document pdfDocument = new com.aspose.pdf.Document(fileInput);
        JpegDevice device=new JpegDevice(100);
        int picCount=Math.min(pdfDocument.getPages().size(), 10);
		 for (int i = 1; i <=picCount ; i++) {
			 String imageFilePath=pdfPath.substring(0,pdfPath.lastIndexOf("."))+"_"+ i +".jpg";
			 try {
				 device.process(pdfDocument.getPages().get_Item(i), imageFilePath);
			 } catch (Exception ex) {
				 ex.printStackTrace();
			 }
        }
		 return picCount;
    }
}
