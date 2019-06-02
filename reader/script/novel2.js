/*
  获取第i章内容 novel.getpage(i)
  获取本地第i章内容 novel.getlocalpage(i)
  获取在线第i章内容 novel.getinlinepage(i)
  
*/

novel={
  url:localStorage.getItem("novelurl"),
  json:JSON.parse(localStorage.getItem("his")||'{"name":"科技炼器师","index":[0,0]}'),
  get name(){
    var name=this.json.name;
    return name;
  },
  set name(str){
    this.json.name=str;
    localStorage.setItem("his",JSON.stringify(this.json));
  },
  get index1(){
    var index=this.json.index[0];
    return index;
  },
  set index1(i){
    this.json.index[0]=i;
    localStorage.setItem("his",JSON.stringify(this.json));
  },
  get index2(){
    var index=this.json.index[1];
    return index;
  },
  set index2(i){
    this.json.index[1]=i;
    localStorage.setItem("his",JSON.stringify(this.json));
  },
  async getList(){
    var list=this.List;
    if(list)return list
	list=await List.read(this.name);
    this.List=list;
    return list;
  }
}

/*
  novel.ini(json) async
  格式化文章内容
  json {html,url}
  return {txt,url,nexturl}
*/
novel.ini=async function(json){
  try{
      var txt="";
      var html=json.html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
      html=html.replace(/(<p>)/g,'');
      html=html.replace(/(<\/p>)/g,'\n');
      html=html.replace(/&nbsp;/g,' ');
      //匹配正文
      var atxt=html.match(/>([^<]{300,})</g);
      atxt=atxt?atxt:"";
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
      var re={
               "txt":txt,
               "url":json.url,
               "nexturl":nexturl
               }
      //是否有分章
      if(nexturl.indexOf("_")>nexturl.length-8){
        let rt =await gethtml(nexturl);
        var html=rt.html;
        var a= arguments.callee({"html":html,"url":nexturl});
        re.txt+=a.txt;
        re.nexturl=a.nexturl;
        return re;
      }else{
        return re;
      }
  }catch(e){
    var re={
               "txt":"",
               "url":"",
               "nexturl":""
    };
    return re;
  }
}
/*
  获取在线内容 async
  i number
  return String;
*/
novel.getinlinepage=async function(i){
    var list=await novel.getList();
	var url=list[i][0];
    var count=0;
    var html=await http.get(url,{cors:true,corsUrl:"http://gear.docfeng.top/get2.php"});
    if(!html){
      throw setError("没有获取到html","url"+url);
    }
    var json=await novel.ini({html,url});
    var txt=json.txt;
    if(!txt){
      alert("没有txt:"+txt);
      alert(html)
      throw "11";
      throw html;
      throw setError("getinlinepage获取txt失败","获取${url}失败");
    }
    var path="Shelf/"+novel.name+"/page"+i+".txt";
	if(browser.MyApp){
		if(!fso.fso.exist("Shelf/"+novel.name)){
			fso.fso.createFolder("Shelf/"+novel.name)
		}
		fso.fso.write(path,txt,false);
	}else{
		store.setItem(path,txt);
	}
    return txt;
}
novel.getpage=async function(i){
  var txt=await novel.getlocalpage(i);
  if(txt=="false"||txt==""||!txt){
    txt=await novel.getinlinepage(i);
  }
  txt="<p>"+txt.replace(/\n/g,'</p>\n<p>')+"</p>"
  //txt=txt.replace(/\n/g,'');
  return txt;
}

novel.getlocalpage=async function(i){
    var path="Shelf/"+novel.name+"/page"+i+".txt";
	if(browser.MyApp){
		var txt=fso.fso.read(path);
		if(txt=="undefined"){
			txt="";
		};
	}else{
		var txt=await store.getItem(path);
		if(!txt)txt="";
	}
	return txt;
}
//显示目录
novel.showlist=function(name,arr){
  var arr=arr||this.List;
  var name=name||this.name;
  var config={"height":(document.body.clientHeight-8)+"px","width":"60%","left":"0px","top":"0px"}
  var url_arr=arr;
  var str="";
  var err=[];
  for(var i=0;i<url_arr.length;i++){
      if(!url_arr[i]||!url_arr[i][1]){
        err[err.length]=i+":"+url_arr[i];
      }else{
        var d="<h4>"+url_arr[i][1]+"</h4>";
        d+="<h5>"+url_arr[i][0]+"</h5>";
        //h+="<td>"+d+"</td>";
        str+="<tr><td>"+d+"</td></tr>";
      }
  }

  str='<div style="height:580px;overflow-x:hidden;overflow-y:scroll;"><table style="width:100%;height:100%" onclick="novel.closelist(event.srcElement)">'+str+"</table></div>";
  msg(name,str,config);
  //目录滚动到第i个
  var i=novel.index1;
  var table1=$(".alert_body")[0].childNodes[0].childNodes[0];
  var h=table1.rows[i].offsetTop;
  table1.parentNode.scrollTop=h
}
//关闭目录,显示文章
novel.closelist=function(obj){
    var obj=obj.parentNode;
    var i=obj.parentNode.rowIndex;
    window.page(i);
    $(".alert").css("display","none");
    looseBody();
}