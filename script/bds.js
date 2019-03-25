bds={
  getsearchhtml:async function(str){
    //搜索
    var str=str;
    var html=await http.get("http://gear.docfeng.top/get2.php?url=http://www.baidu.com/s?q1="+str+
          "&q2=&q3=&q4=&rn=20&lm=0&ct=0"+
         "&ft=&q5=1&q6=&tn=baiduadv");
    return html;
  },
  formatsearch(html){
    var arr=[];
    var el = document.createElement( 'html' );
    el.innerHTML =html;
    var d=el.getElementsByTagName("div");
    for(var i=0;i<d.length;i++){
        if(d[i].id && d[i].id<21){
            var a=[];
             a[0]=d[i].querySelector("a").innerHTML;
             a[1]=d[i].querySelector("a").href;
             //a[2]=d[i].querySelector(".c-showurl").innerHTML;
             //a[3]=d[i].outerHTML;
            arr[arr.length]=a;
        }
    }
   return arr
  },
  async getsearch(str){
    var html=await this.getsearchhtml(str);
    return this.formatsearch(html);//{str:str,html:html});
  },
  savesearch(str,arr){
    //保存搜索结果
    if(!fso.fso.exist("bds/"+str)){
      fso.fso.createFolder("bds/"+str);
    }
    return fso.fso.write("bds/"+str+"/"+str+".json",JSON.stringify(arr),false);
  },
  readsearch(str){
    //获取本地保存的搜索结果
    var t=this;
    var txt=fso.fso.read("bds/"+str+"/"+str+".json");
    if(txt=="false"){
      return [];
    }
    var json=JSON.parse(txt);
    return json;
  },
  getfilelist(){
    //获取文件列表
    var arr=JSON.parse(fso.fso.getList("bds"));
    return arr;
  },
  async getpage(url){
    //获取文章页[格式化]
    return new Promise((resolve)=>{
      ajax(url,function(json){
        ini(json,function(json){
          resolve(json);
        });
      });
    });
  },
  async getlisthtml(url){
    return await http.get(url,{cors:true});
  },
  async getlist(url){
    var json=await this.getlisthtml(url);
    
  },
    async formatlist(json){
        var html=json.html;
        var url=json.url;
        var arr=[];
        var fun=async function(html){
            var reg_di=new RegExp("<a[^>]*?href[ ]?=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<","g");
            let arr=html.matches(reg_di);
            for(var i=0;i<arr.length;i++){
                arr[i][0]=arr[i][0].getFullUrl(url);
            }
            //下一页地址
            var reg=/<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
            var nexturl=html.match(reg);
            if(nexturl){
               nexturl=nexturl[1].getFullUrl(url);
            }
            return {arr:arr,url:nexturl};
        }
        var json=await fun(html);
        arr[arr.length]=json.arr
        while(json.url){
               var html=await http.get(nexturl,{cors:true});
               json=await fun(html);
               arr[arr.length]=json.arr
         }
         var index=0;
         if(arr.length>1){
              for(var i=0;i<arr[0].length;i++){
                    if(arr[0][i][0]==arr[1][i][0]){
                        index++;
                    }
              }
              let myarr=[];
              for(var i=0;i<arr.length;i++){
                  for(var i2=0;i2<index;i2++){
                      arr[i].shift();
                  }
                  myarr=myarr.concat(arr[i]);
              }
              arr=myarr;
          }
          //alert(arr)
          if(arr.length==1){arr=arr[0]}
          //alert(arr)
          return arr;
    },
  savelist(name,arr){
    //保存目录
    fso.fso.write(`Shelf/${name}.json`,JSON.stringify(arr),false);
    //warn("保存目录");
  },
  saveShelf(name,arr,url,i){
    var i=i||0;
    var json={
		  	    name:name,
        url:url,
        oldpage:{title:arr[i][1],url:arr[i][0],Date:new Date()},
        newpage:{title:arr[arr.length-1][1],url:arr[arr.length-1][0],Date:new Date()},
        update:false
      };
    Shelf.addBook(json);
    //this.savelist(name,arr);
  },
  saveall(name,arr,url){
    this.savelist(name,arr);
    this.saveShelf(name,arr,url);
  }
}

funcs={
  //显示书架
  getShelf(){
    this.getfilelist();
  },
  getfilelist(){
    //获取文件列表
    var arr=bds.getfilelist();
    //显示
    this.showt1(arr);
  },
  
  //书架页点击事件,获取本地搜索结果,并显示
  async tfun1(obj){
        var obj=obj.parentNode;
        var i=obj.rowIndex;
        var str=f6_table1.rows[i].cells[0].innerHTML;
        this.name=str;
        this.getsearch();
  },
  
  //目录页点击事件,小说内容
  async tfun3(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      var str=this.name;
      var arr=this.listarr;
      var pageurl=arr[i][0];
      var pagename=arr[i][1];
      this.showpage(pageurl);
  },
  tfun4(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      var str=this.name;
      var arr=this.listarr;
      i+=arr.length-20;
      var pageurl=arr[i][0];
      var pagename=arr[i][1];
      this.showpage(pageurl);
  },
  //显示书架
  showt1(arr){
    var txt="";
    for(var i=0;i<arr.length;i++){
      txt+="<tr><td>"+arr[i]+"</td></tr>";
    }
    f6_table1.innerHTML=txt;
  },
  
  //显示目录
  showt3(arr){
    var txt1=""
    for(var i=0;i<30;i++){
      var txt2="<tr><td><h3>"+arr[i][0]+"</h3><h4>"+arr[i][1]+"</h4><h4>"+arr[i][2]+"</h4></td></tr>";
      txt1+=txt2;
    }
    f6_table3.innerHTML=txt1;
    this.showt4(arr);
  },
  //显示目录(最新20)
  showt4(arr){
    var txt1=""
    for(var i=arr.length-20;i<arr.length;i++){
      var txt2="<tr><td><h3>"+arr[i][0]+"</h3><h4>"+arr[i][1]+"</h4><h4>"+arr[i][2]+"</h4></td></tr>";
      txt1+=txt2;
    }
    f6_table4.innerHTML=txt1;
  },
  //显示文章内容
  async showpage(title,url){
      var json=await bds.getpage(url);
      //alert(JSON.stringify(json));
      var config={left:"0px",top:"0px",width:"100%",height:"100%"};
      var txt=json.txt.replace(/\n/g,"<br/>");
      //alert(txt)
      var nextbutton=`<input type="button" onclick="funcs.showpage('${json.nexturl}')" value="next">`
      txt=`<div style="text-align:left;height:580px;overflow-x:hidden;overflow-y:scroll;">${txt}${nextbutton}</div>`;
      var title=title||json.title;
      msg(title,txt,config);
  },
  set name(str) {
      f6_txt1.value=str;
  },
  get name() {
      return f6_txt1.value;
  }
}

window.addEventListener("load",function(){
  //funcs.getShelf();
},false);



bdstoa=function(json){
  var reg=new RegExp("<a[^>]*?>((?!<\/a>).)*?"+json.str+
        "((?!<\/a>).)*?<\/a>","g");
  var arr=json.html.match(reg);
  var urls=[];
  for(var i=0;i<arr.length;i++){
    arr[i]=arr[i].replace(/<[\/]?em>/g,"");
    var url=arr[i].match(/<a[^>]*?"(.*?)"[^>]*?>(.*?)<\/a>/);
    url.shift();
    urls[urls.length]=url;
  }
  return urls;
}

bdstoa2=function(json){
  var divs=json.html.replace(/<[\/]?em>/g,"");
  divs=divs.match(/<div[^>]*?id="[\d]+"[^>]*?>[\s\S]*?<\/div><\/div>/g);
  //alert(divs[0])
  var urls=[];
  for(var i=0;i<divs.length;i++){
    var reg=new RegExp("<a[^>]*?\"(.*?)\"[^>]*?>((?:(?!<\/a>).)*?"+json.str+
        "(?:(?!<\/a>).)*?)<\/a>");
    var arr=divs[i].match(reg);
    try{
      arr.shift();
    }catch(e){
      alert(divs[i])
      alert(arr)
      break;
    }
    var reg1=new RegExp("<a[^>]*?href=\"("+"[^>]*?"+")\"[^>]*?>((?=http|www).*?)<\/a>");
    var arr1=divs[i].match(reg1);
    //if(i==0){alert(arr1);alert(arr)}
    if(arr1&&arr[0]==arr1[1]){
      var url="";
      try{
        url=arr1[2].match(/(?:https?:\/\/)?([^\/]*?)\//)[1];
      }catch(e){
        url=arr1[2];
      }
      arr[arr.length]=url;
    }
    urls[urls.length]=arr;
  }
  return urls;
}

bdstoa3=function(html){
    var arr=[];
    var el = document.createElement( 'html' );
    el.innerHTML =html;
    var d=el.getElementsByTagName("div");
    for(var i=0;i<d.length;i++){
        if(d[i].id && d[i].id<21){
            var a=[];
             a[0]=d[i].querySelector("a").innerHTML;
             a[1]=d[i].querySelector("a").href;
             //a[2]=d[i].querySelector(".c-showurl").innerHTML;
             //a[3]=d[i].outerHTML;
            arr[arr.length]=a;
        }
    }
   return arr
}
//alert(JSON.stringify(bdstoa3(html),null,4))

showbds=function(arr){
  var txt1=""
  for(var i=0;i<arr.length;i++){
    var txt2="<tr><td><h3>"+arr[i][0]+"</h3><h4>"+arr[i][1]+"</h4><h4>"+arr[i][2]+"</h4></td></tr>";
    txt1+=txt2;
  }
  f6_table2.innerHTML=txt1;
}

/*bds("我要做门阀").then(function(a){
  urls=a
});
*/
ajax=function(path,fun,timeOutFun) {  
    var xmlHttp=xmlhttp();
  xmlHttp.onreadystatechange=function(){
   // alert(xmlHttp.statusText)
    if(xmlHttp.readyState==4) { 
     fun({html:xmlHttp.responseText,
             url:xmlHttp.responseURL});
    }
  }
  xmlHttp.open("GET",path,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(); 
}
class AJAX{
  constructor(){
    this.json={};
    window.xmls||(window.xmls=[xmlhttp(),xmlhttp(),xmlhttp(),xmlhttp(),xmlhttp()]);
    window._xmls||(window._xmls=[]);
  }
  getxml(){
    for(var i=0;i<xmls.length;i++){
      if(xmls[i].readyState==4||xmls[i].readyState==0){
        return xmls[i];
      }
    }
    return false;
  }
  open(method,path,bool){
    this.json.method=method;
    this.json.path=path;
    this.json.bool=bool;
  }
  set T(fun){
    this.json.t=fun;
  }
  set F(fun){
    this.json.f=fun;
  }
  begin(xml,json){
    var js=json;
    var t=this;
    xml.onreadystatechange=function(){
        if(this.readyState==4) { 
          if(js.t)js.t(this.responseText);
          if(_xmls.length>0){
            var json=_xmls.shift();
            t.begin(this,json);
          }
        }
    }
    xml.open(json.method,json.path,json.bool);
    xml.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xml.send();
  }
  send(){
    var xml=this.getxml();
    if(xml==false){
       _xmls[_xmls.length]=this.json;
    }else{
      var json=this.json;
      this.begin(xml,json);
    }
  }
};
inilist=function(json,fun){
  var html=json.html;
  var url=json.url;
  var my_arr=[];
  var name="";
  var H="";
  var fun2=function(html){
     //获取名称
     if(!name){
         name=html.match(/<title>([^<]*?)[_|-|最新|章节|目录|全文阅读][^<]*?</);
         if(name)name=name[1];
     }
     if(!H)H=html;
     //获取目录
     //alert(html)
     var reg_di=new RegExp("<a[^>]*?href=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<","g");
     var url_arr=html.matches(reg_di);
     for(var i=0;i<url_arr.length;i++){
          url_arr[i][0]=url_arr[i][0].getFullUrl(url);
     }
     //alert(url_arr)
     if(!url_arr)return 0;
     //alert(url_arr)
     my_arr[my_arr.length]=url_arr;
     //if(!confirm(my_arr)){return 0;}
     //下一页地址
     var reg=/<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
     var nexturl=html.match(reg);
     //alert(nexturl)
     if(nexturl){
       nexturl=nexturl[1].getFullUrl(url);
       //alert(nexturl);
       //alert(my_arr)
       getHTML(nexturl,fun2);
     }else{
          var index=0;
          //alert(my_arr)
          if(my_arr.length>1&&my_arr[0].length>3){
              for(var i=0;i<my_arr[0].length;i++){
                    if(my_arr[0][i][0]==my_arr[1][i][0]){
                        index++;
                    }
              }
              var arr=[];
              for(var i=0;i<my_arr.length;i++){
                  for(var i2=0;i2<index;i2++){
                      my_arr[i].shift();
                  }
                  arr=arr.concat(my_arr[i]);
              }
              my_arr=arr;
          }
          //alert(my_arr)
          if(my_arr.length==1){my_arr=my_arr[0]}
          //alert(my_arr)
          fun(my_arr,name,H);
     }
  }
  fun2(html);
}


getpage_async=async function(url){
  var json=await gethtml(url);
  var html=json.html
  return new Promise((resolve)=>{
      ini({"html":html,"url":url},function(json){
        resolve(json);
      });
  });
}
  
ini=function(json,fun){
  try{
      var txt="";
      var html=json.html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
      //alert(html)
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
         if(url2.slice(0,2)=="//"){
           re=url2;
         }else{
           re=root_url+url2;
         }
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


