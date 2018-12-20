get=function (path,fun) {  
  var xmlHttp=null; 
  try { // Firefox, Opera 8.0+, Safari 
   xmlHttp=new XMLHttpRequest();
  }catch (e) { // Internet Explorer 
    try { 
    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); 
    }catch (e) { 
      xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
      } 
    } 
  if (xmlHttp==null) { 
      alert ("您的浏览器不支持AJAX！"); 
       return; 
  }
  xmlHttp.onreadystatechange=function(){
    if(xmlHttp.readyState==4) { 
     fun(xmlHttp.responseText)
    }
  }
  xmlHttp.open("get",path,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(); 
  //xmlHttp=null;
}
var url="www.baidu.com";
var path="http://192.168.1.3:8080/get.php?url="+url;
get(path,function(a){alert(a)})
