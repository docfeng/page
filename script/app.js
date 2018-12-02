
if(window.opener){
    var html=document.documentElement.innerHTML;
    window.opener.postMessage(html,'*');
    window.addEventListener('message', function(e){
      var json=JSON.parse(e.data);
      if(json.url){
        getHTML(json.url,function(html){
          window.opener.postMessage(html,'*');
       };
    }, false);
}else{
    window.addEventListener('message', function(e){   
      alert(e.data);
    }, false);
};

getHTML=function(path,fun) {  
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
  xmlHttp.open("GET",path,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(); 
  //xmlHttp=null;
}
