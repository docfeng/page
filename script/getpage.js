
getpage=function (url,callback){
  var gethtml=function(url,fun) {  
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
          //alert(xmlHttp.status)
      	  if(xmlHttp.status==200){
            var re=xmlHttp.responseText;
            if(fun){fun(re)}
         }else{
         }
      }else{
      	  
      }
    }
    var path="http://20.docfeng.top/get.php?url=";
    xmlHttp.open("GET",path+url,true); 
    xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlHttp.send();
    //xmlHttp=null;
  }
  var ini=function(json,fun){
    var txt="";
    var html=json.html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
    html=html.replace(/(<p>)/g,'');
    html=html.replace(/(<\/p>)/g,'\n');
    html=html.replace(/&nbsp;/g,' ');
    //匹配小说名称
    var novelname=html.match(/《([\u4e00-\u9fa5]+)》/);
    novelname=novelname?novelname[1]:"";
    //匹配章节名称
    var title=json.html.match(/>(第[^<]*?章[\u0020]*[\u4e00-\u9fa5]+)[^<]*?</);
    title=title?title[1]:"";
    //匹配正文
    var atxt=html.match(/>([^<]{300,})</g);
    //alert(html)
    //alert(atxt)
    for(var i=0;i<atxt.length;i++){
      var elen=atxt[i].match(/[A-Za-z]/g);
      if(!elen || elen.length/atxt[i].length<0.06){
        txt=atxt[i];
        txt=txt.match(/>([^<]{100,})</)
      }
    }

    txt=txt?txt[1]:"";
    //匹配下一章地址
    var reg=/<a[^>]*?href="([^"]*?)"[^>]*?>下[^<]*?</;
    var nexturl=html.match(reg);
    nexturl=nexturl?nexturl[1]:"";
    nexturl=nexturl.getFullUrl(json.url);
    //
    var re={"novelname":novelname,
               "title":title,
               "txt":txt,
               "url":json.url,
               "nexturl":nexturl
               }
    //是否有分章
    if(nexturl.indexOf("_")>nexturl.length-8){
      getHTML(nexturl,function(html){
          ini({"html":html,"url":nexturl},function(a){
           re.txt+=a.txt;
           re.nexturl=a.nexturl;
           fun(re);
        })
      });
    }else{
        fun(re);
    }
  }
  gethtml(url,function(html){
    ini({"html":html,"url":url},function(json){
      callback(json);
    });
  });
}

getpage_async=function(url){
  return new Promise((resolve)=>{
    gethtml(url,function(html){
      //alert(html);
      ini({"html":html,"url":url},function(json){
        resolve(json);
      });
    });
  });
}

gethtml=function(url,fun) {  
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
          //alert(xmlHttp.status)
      	  if(xmlHttp.status==200){
            var re=xmlHttp.responseText;
            if(fun){fun(re)}
         }else{
         }
      }else{
      	  
      }
    }
    var path="http://20.docfeng.top/get.php?url=";
    xmlHttp.open("GET",path+url,true); 
    xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlHttp.send();
    //xmlHttp=null;
  }
  
ini=function(json,fun){
  try{
      var txt="";
      var html=json.html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
      html=html.replace(/(<p>)/g,'');
      html=html.replace(/(<\/p>)/g,'\n');
      html=html.replace(/&nbsp;/g,' ');
      //匹配小说名称
      var novelname=html.match(/《([\u4e00-\u9fa5]+)》/);
      novelname=novelname?novelname[1]:"";
      //匹配章节名称
      var title=json.html.match(/>(第[^<]*?章[\u0020]*[\u4e00-\u9fa5]+)[^<]*?</);
      title=title?title[1]:"";
      //匹配正文
      var atxt=html.match(/>([^<]{300,})</g);
      atxt=atxt?atxt:"";
      //alert(html)
      //alert(atxt)
      for(var i=0;i<atxt.length;i++){
        var elen=atxt[i].match(/[A-Za-z]/g);
        if(!elen || elen.length/atxt[i].length<0.06){
          txt=atxt[i];
          txt=txt.match(/>([^<]{100,})</)
        }
      }  

      txt=txt?txt[1]:"";
      //匹配下一章地址
      var reg=/<a[^>]*?href="([^"]*?)"[^>]*?>下[^<]*?</;
      var nexturl=html.match(reg);
      nexturl=nexturl?nexturl[1]:"";
      nexturl=nexturl.getFullUrl(json.url);
      //
      var re={"novelname":novelname,
               "title":title,
               "txt":txt,
               "url":json.url,
               "nexturl":nexturl
               }
      //是否有分章
      if(nexturl.indexOf("_")>nexturl.length-8){
        getHTML(nexturl,function(html){
          ini({"html":html,"url":nexturl},function(a){
           re.txt+=a.txt;
           re.nexturl=a.nexturl;
           fun(re);
          })
        });
      }else{
        fun(re);
      }
  }catch(e){
    //alert(e.message);
    var re={"novelname":"",
               "title":"",
               "txt":"",
               "url":"",
               "nexturl":""
    };
    fun(re);
  }
}






String.prototype.getFullUrl=function(url1){
   var re="";
   //alert(this)
   //alert(url1)
   var url=url1.match(/(http[s]?:\/\/[^\/]*?)\//);
   var path=url1.match(/http[s]?:.*\//);
   if(url)
   {
    var root_url=url[1];
   }else{
      url=url1.match(/(http:\/\/[^\/]*?)\//);
   }
   
   var url2=this.replace(/ /g,'');
   switch(url2.slice(0,1)){
       case "/":
         re=root_url+url2;
         break;
       case ".":
         re=url1+url2;
         break;
       default :
         if(url2.slice(0,4)=="http"){
           re=url2;
         }else{re=path+url2;}
   }
   return re;
}


