package com.boatsoft.wxlib.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

public class EventApi {
	
	public static void getPush(HttpServletRequest request,HttpServletResponse response) throws Exception{
		PrintWriter out=response.getWriter();
		if(request.getParameter("echostr")!=null){
			out.println(request.getParameter("echostr"));
			return;
		}
		String userfrom="";
		String errormessage="";
		String message="";
		String msgtype="";
		String return_msgtype="text";
		String content="";
		String picurl="";
		String url="";
		String title="";
		String description="";
		
		String event="";
		String touser="";
		String EventKey="";
		try {
			ServletInputStream sis=request.getInputStream();
			int size = request.getContentLength();
			byte[] buffer = new byte[size];
			byte[] xmldataByte = new byte[size];  
            int count = 0;  
            int rbyte = 0;  
            // 循环读取  
            while (count < size) {   
                // 每次实际读取长度存于rbyte中  
                rbyte = sis.read(buffer);   
                for(int i=0;i<rbyte;i++){
                    xmldataByte[count + i] = buffer[i];  
                }  
                count += rbyte;  
            }
            String xmlData = new String(xmldataByte, "UTF-8");
			Document doc = DocumentHelper.parseText(xmlData);
			
			long CreateTime=0;
			//(Element) root.getElementsByTagName("backgroundLayer").item(0);
			int userId=0;
			Element root = doc.getRootElement();
			List nodes = root.elements();
			for (Iterator<?> it = nodes.iterator(); it.hasNext();) {
				Element e = (Element) it.next();
				if(e.getName().equals("FromUserName")){
					userfrom=e.getStringValue();
				}else if(e.getName().equals("Event")){
					event=e.getStringValue();
				}else if(e.getName().equals("ToUserName")){
					touser=e.getStringValue();
				}else if(e.getName().equals("EventKey")){
					EventKey=e.getStringValue();
				}else if(e.getName().equals("MsgType")){
					msgtype=e.getStringValue();
				}else if(e.getName().equals("CreateTime")){
					CreateTime=Long.parseLong(e.getStringValue());
				}else if(e.getName().equals("Content")){
					content=e.getStringValue();
				}
				//TODO
			}
			if(msgtype.equals("text")){
				return_msgtype="text";
				message="你好";
				/*
				JSONObject checkinInfo=this._hotelaction_pc.getCheckInId(content);
				if(checkinInfo!=null){
					return_msgtype="news";
					title= checkinInfo.getString("room") + "房控制";
					description="点此链接可通过微信控制" + checkinInfo.getString("room") + "房";
					picurl="http://www.ivor-electric.com/ivor2014/images/upload/IMG20151124111526.jpg";
					url="http://hotel.ivor-electric.com:8080/IvorHotelServicesJ2EE/mobileCn/main.htm?mac=11%2022%2033%2044%2055%2066%2061%2062&ctlId="+checkinInfo.getInt("ctlId")+"&randomCode="+ checkinInfo.getString("randomCode");
					message="1";
				}
				*/
			}
			 //If msgtype = "event" Then
		                //If [event] = "subscribe" Then
			if(msgtype.equals("event")){
				if(event.equals("subscribe")){
					
				}
			}
		} catch (IOException | DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			if(message.length()>0){
				StringBuilder sb=new StringBuilder();
				sb.append("<xml>\r\n");
				sb.append("<ToUserName><![CDATA[" + userfrom + "]]></ToUserName>\r\n");
				sb.append("<FromUserName><![CDATA[" + WXConfig.MY_WX_ID + "]]></FromUserName>\r\n");
	            sb.append("<CreateTime>" + (new Date()).getTime()+ "</CreateTime>\r\n");
	            sb.append("<MsgType><![CDATA[" + return_msgtype + "]]></MsgType>\r\n");
	            if(return_msgtype.equals("text")){
	            	sb.append("<Content><![CDATA[" + message + "]]></Content>\r\n");
	            }else if(return_msgtype.equals("news")){
	            	sb.append("<ArticleCount>1</ArticleCount>\r\n");
	                sb.append("<Articles>\r\n");
	                sb.append("<item>\r\n");
	                sb.append("<Title><![CDATA[" + title + "]]></Title>\r\n");
	                sb.append("<Description><![CDATA[" + description + "]]></Description>\r\n");
	                sb.append("<PicUrl><![CDATA[" + picurl + "]]></PicUrl>\r\n");
	                sb.append("<Url><![CDATA[" + url + "]]></Url>\r\n");
	                sb.append("</item>\r\n");
	                sb.append("</Articles>\r\n");
	            }
	            sb.append("</xml>");
	            //response.setContentType("text/xml");
	            
				out.println(sb.toString());
			}else{
				//response.setContentType("text/xml");
				out.println("");
			}
			/*
			 * 6？50134？e076c352
			If message.Length > 0 Then
            Dim sb As StringBuilder = New StringBuilder
            sb.Append("<xml>" & ControlChars.CrLf)
            sb.Append("<ToUserName><![CDATA[" & userfrom & "]]></ToUserName>" & ControlChars.CrLf)
            sb.Append("<FromUserName><![CDATA[gh_5e8d3ca3c42f]]></FromUserName>" & ControlChars.CrLf)
            sb.Append("<CreateTime>" & Now().Ticks & "</CreateTime>" & ControlChars.CrLf)
            sb.Append("<MsgType><![CDATA[" & return_msgtype & "]]></MsgType>" & ControlChars.CrLf)
            If return_msgtype = "text" Then
                sb.Append("<Content><![CDATA[" & message & "]]></Content>" & ControlChars.CrLf)
            ElseIf return_msgtype = "image" Then
                sb.Append("<Image>" & ControlChars.CrLf)
                sb.Append("<MediaId><![CDATA[" & message & "]]></MediaId>" & ControlChars.CrLf)
                sb.Append("</Image>" & ControlChars.CrLf)
            ElseIf return_msgtype = "news" Then
                sb.Append("<ArticleCount>1</ArticleCount>" & ControlChars.CrLf)
                sb.Append("<Articles>" & ControlChars.CrLf)
                sb.Append("<item>" & ControlChars.CrLf)
                sb.Append("<Title><![CDATA[" & title & "]]></Title> " & ControlChars.CrLf)
                sb.Append("<Description><![CDATA[" & description & "]]></Description>" & ControlChars.CrLf)
                sb.Append("<PicUrl><![CDATA[" & picurl & "]]></PicUrl>" & ControlChars.CrLf)
                sb.Append("<Url><![CDATA[" & url & "]]></Url>" & ControlChars.CrLf)
                sb.Append("</item>" & ControlChars.CrLf)
                sb.Append("</Articles>" & ControlChars.CrLf)
            End If

            sb.Append("</xml>" & ControlChars.CrLf)
            Response.Write(sb.ToString)
        Else
            Response.Write("")
        End If
        */
		}
		/*
		Dim reader As StreamReader = New StreamReader(Request.InputStream)
		        Dim xmlData As String = reader.ReadToEnd()
		        Dim userfrom As String = ""
		        Dim errormessage As String = ""
		        Dim message As String = ""
		        Dim msgtype As String = ""
		        Dim return_msgtype As String = "text"
		        Dim content As String = ""
		        Dim picurl As String = ""
		        Dim url As String = ""
		        Dim title As String = ""
		        Dim description As String = ""
		        Try
		            Dim doc As XmlDocument = New XmlDocument
		            doc.LoadXml(xmlData)
		            Dim root As XmlElement = doc.DocumentElement
		            '<xml><ToUserName><![CDATA[gh_5e8d3ca3c42f]]></ToUserName>
		            '<FromUserName><![CDATA[o5KRdwZBV4I8v1rV5QAZVmdCi3Rc]]></FromUserName>
		            '<CreateTime>1450512518</CreateTime>
		            '<MsgType><![CDATA[event]]></MsgType>
		            '<Event><![CDATA[subscribe]]></Event>
		            '<EventKey><![CDATA[qrscene_2]]></EventKey>
		            '<Ticket><![CDATA[gQHA7joAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2F6b1l2bVhsVGRvMHNfRkhseElnAAIEZwZ1VgMEAAAAAA==]]></Ticket>
		            '</xml>
		            Dim node As XmlNode, userid As Integer = 0

		            Dim [event] As String = ""
		            Dim touser As String = ""
		            Dim EventKey As String = ""
		            Dim CreateTime As Long = 0
		            
		            For Each node In root.ChildNodes
		                Select Case node.Name
		                    Case "FromUserName"
		                        userfrom = node.FirstChild.Value
		                    Case "Event"
		                        [event] = node.FirstChild.Value
		                    Case "ToUserName"
		                        touser = node.FirstChild.Value
		                    Case "EventKey"
		                        EventKey = node.FirstChild.Value
		                    Case "MsgType"
		                        msgtype = node.FirstChild.Value
		                    Case "CreateTime"
		                        CreateTime = node.FirstChild.Value
		                    Case "Content"
		                        content = node.FirstChild.Value
		                End Select
		            Next
		            Dim temptime As Long
		            For Each temptime In ListCreateTime
		                If temptime = CreateTime Then
		                    '找到相同的时间撮，直接退出
		                    Response.Write("")
		                    Exit Sub
		                End If
		            Next
		            ListCreateTime.Add(CreateTime)
		            If ListCreateTime.Count > LIST_SIZE Then
		                ListCreateTime.Remove(0)
		            End If
		            Dim sql As String
		            Dim rs As DataTable

		            If msgtype = "text" Then
		                sql = "SELECT * FROM tAutoReturn WHERE keyWord LIKE '%" & content & "%'"
		                rs = MDAOOledb.fillTable(sql, config.conn)
		                If rs.Rows.Count > 0 Then
		                    Dim row As DataRow = rs.Rows(0)
		                    return_msgtype = CStr(row("returnType")).Trim
		                    If return_msgtype = "text" Then
		                        message = row("content")
		                    End If
		                    If return_msgtype = "news" Then
		                        picurl = row("picUrl")
		                        url = row("url")
		                        title = row("title")
		                        description = row("description")
		                        message = "a"
		                    End If
		                    

		                End If
		                'If content = "福利" Then
		                '    return_msgtype = "news"
		                '    message = "http://mp.weixin.qq.com/s?__biz=MzI0NDEzOTc0OA==&mid=401688170&idx=1&sn=95dac3f23badd34579842c9c3f97e201#rd"
		                'End If

		            End If
		            If msgtype = "event" Then
		                If [event] = "subscribe" Then
		                    Dim cr As String = ControlChars.Lf
		                    Dim sb As StringBuilder = New StringBuilder
		                    sql = "SELECT * FROM tAutoReturn WHERE keyWord='关注'"
		                    rs = MDAOOledb.fillTable(sql, config.conn)
		                    If rs.Rows.Count > 0 Then
		                        message = rs.Rows(0).Item("content")
		                    Else
		                        sb.Append("欢迎关注""流量特价超市""！" & cr)
		                        sb.Append("即日起，发展5个一级代理即可领取100m流量！" & cr)
		                        sb.Append("我们为您提供7折的流量充值服务。" & cr)
		                        sb.Append("广东移动省内流量200m只需9.2元 、" & cr)
		                        sb.Append("广东移动全国流量2G只需52元 、" & cr)
		                        sb.Append("全国联通流量500m仅售28.8元 、" & cr)
		                        sb.Append("全国联通流量500m仅售27.5元 、" & cr)
		                        sb.Append("全天24小时自动充值流量秒到。 " & cr)
		                        sb.Append("<a href=""http://www.gdyouliao.com/mobileCn/login.htm""><点我充值流量></a>" & cr)
		                        sb.Append("将流量特价超市分享出去还可获得永久的提成!" & cr)
		                        sb.Append("一次分享终生受益!" & cr)
		                        sb.Append("<a href=""http://www.gdyouliao.com/mobileCn/user_qrcode.aspx""><点我生成分享名片></a>")
		                        message = sb.ToString
		                    End If

		                    '回复一条消息，记录上级id，创建二维码
		                    '获取用户信息
		                    'https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
		                    If _mythread_userSubScribe Is Nothing Then
		                        _mythread_userSubScribe = New Threading.Thread(AddressOf userSubScribe)
		                        _mythread_userSubScribe.Start()
		                    End If

		                    Dim pei As PushEventInfo = New PushEventInfo
		                    pei.userfrom = userfrom
		                    pei.EventKey = EventKey
		                    _arr_push_dueing.Add(pei)
		                End If
		                '<xml><ToUserName><![CDATA[gh_5e8d3ca3c42f]]></ToUserName>
		                '<FromUserName><![CDATA[o5KRdwRhys_JG0SaT5F6_t0CDIrg]]></FromUserName>
		                '<CreateTime>1450769092</CreateTime>
		                '<MsgType><![CDATA[event]]></MsgType>
		                '<Event><![CDATA[CLICK]]></Event>
		                '<EventKey><![CDATA[GET_SERVEICE]]></EventKey>
		                '</xml>
		                If [event] = "CLICK" Then
		                    createUserInfo(userfrom)
		                    If EventKey = "GET_SERVEICE" Then
		                        message = "你好，客服代理为您服务，请问有什么可以帮到您？"
		                    End If
		                    If EventKey = "GET_QRCODE" Then
		                        message = "您的名片正在生成，请稍候"
		                        mythread = New Threading.Thread(AddressOf createUserCard)
		                        mythread.Start(userfrom)

		                        '<xml>
		                        '<ToUserName><![CDATA[toUser]]></ToUserName>
		                        '<FromUserName><![CDATA[fromUser]]></FromUserName>
		                        '<CreateTime>12345678</CreateTime>
		                        '<MsgType><![CDATA[image]]></MsgType>
		                        '<Image>
		                        '<MediaId><![CDATA[media_id]]></MediaId>
		                        '</Image>
		                        '</xml>
		                    End If
		                End If
		                '<xml><ToUserName><![CDATA[gh_5e8d3ca3c42f]]></ToUserName>
		                '<FromUserName><![CDATA[o5KRdwRhys_JG0SaT5F6_t0CDIrg]]></FromUserName>
		                '<CreateTime>1450769322</CreateTime>
		                '<MsgType><![CDATA[event]]></MsgType>
		                '<Event><![CDATA[VIEW]]></Event>
		                '<EventKey><![CDATA[http://www.gdyouliao.com/]]></EventKey>
		                '</xml>
		                If [event] = "VIEW" Then
		                    createUserInfo(userfrom)
		                    'Session("openId") = userfrom
		                    'wx_login()
		                End If
		            End If
		        Catch ex As Exception
		            errormessage = ex.Message
		        Finally
		            If message.Length > 0 Then
		                Dim sb As StringBuilder = New StringBuilder
		                sb.Append("<xml>" & ControlChars.CrLf)
		                sb.Append("<ToUserName><![CDATA[" & userfrom & "]]></ToUserName>" & ControlChars.CrLf)
		                sb.Append("<FromUserName><![CDATA[gh_5e8d3ca3c42f]]></FromUserName>" & ControlChars.CrLf)
		                sb.Append("<CreateTime>" & Now().Ticks & "</CreateTime>" & ControlChars.CrLf)
		                sb.Append("<MsgType><![CDATA[" & return_msgtype & "]]></MsgType>" & ControlChars.CrLf)
		                If return_msgtype = "text" Then
		                    sb.Append("<Content><![CDATA[" & message & "]]></Content>" & ControlChars.CrLf)
		                ElseIf return_msgtype = "image" Then
		                    sb.Append("<Image>" & ControlChars.CrLf)
		                    sb.Append("<MediaId><![CDATA[" & message & "]]></MediaId>" & ControlChars.CrLf)
		                    sb.Append("</Image>" & ControlChars.CrLf)
		                ElseIf return_msgtype = "news" Then
		                    sb.Append("<ArticleCount>1</ArticleCount>" & ControlChars.CrLf)
		                    sb.Append("<Articles>" & ControlChars.CrLf)
		                    sb.Append("<item>" & ControlChars.CrLf)
		                    sb.Append("<Title><![CDATA[" & title & "]]></Title> " & ControlChars.CrLf)
		                    sb.Append("<Description><![CDATA[" & description & "]]></Description>" & ControlChars.CrLf)
		                    sb.Append("<PicUrl><![CDATA[" & picurl & "]]></PicUrl>" & ControlChars.CrLf)
		                    sb.Append("<Url><![CDATA[" & url & "]]></Url>" & ControlChars.CrLf)
		                    sb.Append("</item>" & ControlChars.CrLf)
		                    sb.Append("</Articles>" & ControlChars.CrLf)
		                End If

		                sb.Append("</xml>" & ControlChars.CrLf)
		                Response.Write(sb.ToString)
		            Else
		                Response.Write("")
		            End If

		        End Try
		        */
	}
}
