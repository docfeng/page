githubapi=function(){
  this.fun();
}
githubapi.prototype.fun=function(){
  var t=this;
  t.getrepos=async function(para){
    var json={
      url:"https://api.github.com/users/"+para.owner+"/repos",
      head:{Authorization:para.author}
    }
    var re=await f.ajax(json);
    return re.text;
  }
  t.getfiles=async function(para){
    var json={
      url:"https://api.github.com/repos/"+para.owner+"/"+para.repos+"/contents",
      head:{Authorization:para.author}
    }
    var re=await f.ajax(json);
    return re.text;
  }
  t.getfile=async function(para){
    para.branch=para.branch?para.branch:"master";
    var json={
      url:"https://api.github.com/repos/"+para.owner+"/"+para.repos+"/contents/"+para.path+"?ref="+para.branch,
      head:{Authorization:para.author}
    }
    var j=await f.ajax(json);
    var json=JSON.parse(j.text);
    var re="";
    if(json.content){
        var re=window.atob(json.content);
        re= decodeURIComponent(escape(re));
    }
    return re;
  }
  t.createfile=async function(para){
    //status:201
    para.branch=para.branch?para.branch:"master";
    para.message=para.message?para.message:"add";
    var str=window.btoa(unescape(encodeURIComponent(para.txt)));
    var data={
          "message": para.message,
          "content": str,
          "branch" : para.branch
    }
    var json={
      url:"https://api.github.com/repos/"+para.owner+"/"+para.repos+"/contents/"+para.path,
      head:{Authorization:para.author},
      type:"put",
      data:JSON.stringify(data)
    }
    var j=await f.ajax(json);
    var json=JSON.parse(j.text);
    var re="";
    if(json.content){
        var re=window.atob(json.content);
        re= decodeURIComponent(escape(re));
    }
    return re;
  }
}


f={}
f.ajax=function(json){
    //method,url,async,data
    json.type=json.type?json.type:"get";
    json.url=json.url?json.url:"";
    json.async=json.async?json.async:true;
    json.data=json.data?json.data:null;
    var xmlhttp=null;
    if (window.XMLHttpRequest){// code for Firefox, Mozilla, IE7, etc.
      xmlhttp=new XMLHttpRequest();
    }else if (window.ActiveXObject){// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp==null){
      alert("Your browser does not support XMLHTTP.");
      return 0;
    }
    return new Promise((resolve)=>{
      xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){// 4 = "loaded"
          if(xmlhttp.status==200){// 200 = "OK"
            //alert(xmlhttp.getAllResponseHeaders());
            //alert(xmlhttp.getResponseHeader('X-RateLimit-Remaining'))
            resolve({"text":xmlhttp.responseText,"xmlhttp":xmlhttp})
          }else{
            resolve({"text":xmlhttp.responseText,"xmlhttp":xmlhttp});
          }
        }
      }
      xmlhttp.open(json.type,json.url,json.async);
      if(json.head){
        for(var p in json.head){
          xmlhttp.setRequestHeader(p,json.head[p]);
        }
      }
      xmlhttp.send(json.data);
    });
}
githubapi=new githubapi();