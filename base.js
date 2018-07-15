alert("base")
ajax=function(a,path,str,fun,bool) {  
  var xmlHttp=null; 
  var bool=bool:true;
  var html="";
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
	    html=xmlHttp.responseText;
        fun(html);
	    xmlHttp=null;
    }
  }
  xmlHttp.open(a,path,bool); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(str); 
  return html;
}
post=function(path,str,fun,bool){  
    return ajax("POST",path,str,fun,bool);
}
get=function(path,fun,bool){
    return ajax("POST",path,"",fun,bool);
}