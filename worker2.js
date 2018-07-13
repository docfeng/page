onmessage = function (event) { 
    var data=event.data;
    	if(data.opf){
    	    novel.opf=data.opf;
    	    novel.ncx=data.ncx;
    	    novel.page=data.page;
    	}
    	if(data.name){novel.set(data);}
    if(data.download){novel.download();}
    	if(data.fun){
    	    var fun=eval("("+data.fun+")")
         fun(data.para);
     }
 }
//self.importScripts("base_obj.js?i=0");
Novel=function(){
	//base.call(this);
	//this.cc();
  this.fun();
}
Novel.prototype.fun=function(){
  this.html=function(path,fun) {  
    var xmlHttp=null;
    var bool=fun?true:false;
    var re;
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
        re=xmlHttp.responseText;
        if(fun){fun(re)}
      }else{re=false;}
    }
    xmlHttp.open("GET",path,bool); 
    xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlHttp.send();
    return re;
    //xmlHttp=null;
  }

  this.fullurl=function(url1,url2){
    var re="";
    var url=url1.match(/(http[s]?:\/\/[^\/]*?)\//);
    var path=url1.match(/http[s]?:.*\//);
    if(url)
    {
      var root_url=url[1];
    }else{
      url=url1.match(/(http:\/\/[^\/]*?)\//);
    }
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

  this.Reg=function(str,reg){
    var reg=eval("("+reg+")");
    var re=[];
    do
    {
      var r=reg.exec(str);
      if(r){
          r.shift()
          re[re.length]=r;
      }
    }
    while (r!=null) 
    return re;
  }

  this.set=function(data){
    var t=this;
    t.info={};
    t.data=data;
    t.info.base=[data.name,data.url,data.index];
    t.name=data.name;
    t.path=t.name+"/"+t.name;
    t.url=data.url;
    t.index=0;
    
    t.createFolder(t.name);
    t.createFolder(t.path);
    t.createFolder(t.path+"/META-INF");
    t.createFolder(t.path+"/OPS");
    t.createFolder(t.path+"/OPS/css");
    t.copy("1/main.css",t.path+"/OPS/css/main.css");
    t.copy("1/mimetype",t.path+"/mimetype");
    t.copy("1/container.xml",t.path+"/META-INF/container.xml")
    t.copy("1/coverpage.html",t.path+"/OPS/coverpage.html");
  }
  	
  this.post=function(fun,para){
  	  var data={}
  	  	data.fun=fun.toString();
  	  	data.para=para;
  	  postMessage(data);
  	}
  	
  	this.msg=function(str){
  	    var fun=function(para){
  	    	    alert(para[0]);
  	    	}
  	    this.post(fun,[str]);
  	}
  		
  this.alert=function(str){
  	  var data={}
  	  var fun=function(para){
  	  	   form_1.next_url.value=para[0];
  	  	}
  	  	data.fun=fun.toString();
  	  	data.para=[str]
  	  postMessage(data);
  }

  this.write=function(name,txt){
  	  var data={}
  	  var fun=function(para){
  	  	   fso.write(para[0],para[1],false);
  	  	}
  	  	data.fun=fun.toString();
  	  	data.para=[name,txt]
  	  postMessage(data);
  	}
  
   this.copy=function(a,b){
   	var data={}
  	  var fun=function(para){
  	  	   fso.write(para[1],fso.read(para[0]),false);
  	  	}
  	  	data.fun=fun.toString();
  	  	data.para=[a,b]
  	  postMessage(data);
  }
  	
  	this.createFolder=function(name){
  		var data={}
  	  var fun=function(para){
  	  	   fso.createFolder(para[0]);
  	  	}
  	  	data.fun=fun.toString();
  	  	data.para=[name]
  	  postMessage(data);
  	}
  	
  	this.cal=function(){
  		 var t=this;
  		 var fun=function(para){
  	  	   form_1.start.value=para[0];
  	  	   form_1.end.value=para[1];
  	  	   form_1.progress.value=para[2];
  	  	 }
  		 var data={}; 
  		 data.fun=fun.toString();
  		 t.index++;
  		 if(t.index==t.len){
  		     t.alert("结束");
  		     t.index=0;
  		     data.para=[t.start,t.end,t.index/t.len*100+"%"];
  		 }
  		 else{
  	  	     data.para=[t.start+t.index-1,t.end,t.index/t.len*100+"%"];
  	  	 }
  	  postMessage(data);
  	}
  	
  	
  	
  this.ini=function(){
    var t=this;
    var data={};
  	  var fun=function(){
  	  	   var data={};
  	  	   data.opf=fso.read("1/fb.opf");
  	  	   data.ncx=fso.read("1/fb.ncx");
  	  	   data.page=fso.read("1/page.html");
  	  	   load.worker.postMessage(data); 
  	  	   alert(data.opf)
  	  	   
  	  	}
  	  	data.fun=fun.toString();
  	  	data.para=[""];
  	  postMessage(data);
  }

  this.copyopf=function(){
    var t=this;
    var list=t._list;
    var path=this.path;
    var opf="";
    var opf2="";
    for(var i=0;i<list.length;i++){
      opf+='<item id="page'+i+'" href="page'+
          i+'.html" media-type='+
          '"application/xhtml+xml"/>\n';
      opf2+='<itemref idref="page'+i+
           '" linear="yes"/>\n';
    }
    var txt=t.opf;
    txt=txt.replace("包含文件",opf);
    txt=txt.replace("逻辑目录",opf2);
    txt=txt.replace("书名",t.name);
    path=path+"/OPS/fb.opf"
    t.write(path,txt,false);
  }
  
  this.copyncx=function(){
  	  var t=this;
    var list=this._list;
    var ncx="";
    for(var i=0;i<list.length;i++){
      ncx+='<navPoint id="page'+i+
        '" playOrder="'+(i+3)+
        '">\n<navLabel><text>'+list[i][1]+
        '</text></navLabel>\n<content '+
      'src="page'+i+'.html"/>\n</navPoint>\n';
    }
    var txt=this.ncx;
    txt=txt.replace("目录",ncx);
    var path=t.path+"/OPS/fb.ncx";
    t.write(path,txt,false);
  }

  this.list=function(url){
    var t=this;
    t.alert("获取目录")
    var html=this.html(url);
    var reg_di=/<a[^>]*?href="([^"]*?)".*?>(第[^<]*?)</g;
    var reg_xq=/<a[^>]*?href="([^"]*?)".*?>([^<第]*?[下全更][^<]*?)</g;
    var url_arr=t._list=t.Reg(html,reg_di);
    t.alert(t._list.length)
    var str="";
    for(var i=0;i<url_arr.length;i++){
      url_arr[i][0]=t.fullurl(url,url_arr[i][0]);
    }
    	t.msg("获取目录");
  }
  this.getpage=function(url,fun1,i){
  	  var t=this;
    var fun=function(html){
    	   var txt1=html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
        txt1=txt1.replace(/&nbsp;/g,' ');
        txt1=txt1.match(/>([^var<]{100,})</);
        txt1=txt1?txt1[1]:"";
       // if(txt1==""){t.msg("空")}
        txt1=txt1.replace(/\n/g,'<br />\n');
        var data={};
        data.txt=txt1;
        data.i=i;
        fun1(data);
    	}    		
    	this.html(url,fun);
  }
  this.w_page=function(){
    var t=this;
    var list=t._list;
    t.alert("开始");
    var fun=function(data){
    	  var txt=t.page;
       txt=txt.replace("标题",list[data.i][1]);
       txt=txt.replace("内容",data.txt);
       var path=t.path+"/OPS/page"+data.i+".html"
       t.cal();
       t.write(path,txt,false);
    	}
    	t.start=t.data.num[0];
    	t.end=t.data.num[1];
    	if(t.end==0){t.end=list.length-1;}
    	t.len=t.end-t.start+1;
    for(var i=t.start;i<=t.end;i++){
        t.getpage(list[i][0],fun,i);
      }
  }

  this.w_info=function(){
    var t=this;
    t.info.page=t._list;
    var list=JSON.stringify(t.info);
    t.write(t.name+"/list.txt",list,false)
  }
  this.download=function(){
    var t=this;
    t.list(t.url);
    t.alert("opf");
    t.copyopf();
    	t.alert("ncx");
    t.copyncx();
    t.w_info();
    	t.alert("page");
    	t.w_page();
  }
}

novel=new Novel();
novel.ini();                                               
