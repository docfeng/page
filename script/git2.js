/*
   未完成;
   git getlog login logout
        files
        ini read write add
        
*/

dr=function(){
    var yhm=prompt("用户名");
    var psw=prompt("密码");
    //var token=prompt("token");
    var author="Basic "+btoa(yhm+":"+psw);
    window.config={
      "author":author,
      "user": yhm,
      "repos_name" : "page"
    };
    (function(obj){
					  var user=obj.user;
					  var repos_name=obj.repos_name;
					  obj.user_url="https://api.github.com/users/"+user;
					  obj.filepath="https://api.github.com/repos/" + user + "/" + repos_name + "/contents/";
					   //https://api.github.com/users/whatever?client_id=xxxx&client_secret=yyyy';
					  obj.blogListURL = 'https://api.github.com/repos/' + user + '/' + repos_name + '/contents/blog';
					  obj.issuesList = 'https://api.github.com/repos/' + user + '/' + repos_name + '/issues';
					  obj.issuesHTML = 'https://github.com/' + user + '/' + repos_name + '/issues'
					  obj.readmeURL = 'https://raw.githubusercontent.com/' + user + '/' + repos_name + '/master/About Me.md';
					  obj.blogName=[];
					  obj.blogURL=[];
					  obj.blogType=[];
					  obj.comments_url=[];
					
					}(config));
    myStorage.setItem("config",JSON.stringify(window.config),function(a){alert(a)});
}

git2=function(){
  var t=this;
  myStorage.getItem("config",function(_config){
    //alert(_config)
    if(_config){
      window.config=JSON.parse(_config);
    }else{
      dr();
    }
    t.fun()
  });
}
git2.prototype.fun=function(){
  this.read=async function(name){
    var path=config.filepath+name;
    var json=await http.getJSON(path);
    if(json.content){
        var str=window.atob(json.content);
        str= decodeURIComponent(escape(str));
      }else{
        alert("没有此文件");
      }
      return str;
  }
  this.write=async function(name,txt,mess){
    var path=config.filepath+name;
    var json=await http.getJSON(path);
    if(json.sha){
        var str=window.btoa(unescape(encodeURIComponent(txt)));
        var author=config.author;
        var commentJson=JSON.stringify({
          "message": mess?mess:"update",
          "content": str,
          "sha": json.sha
        });
        $.ajax({
            type: "PUT",
            url: path,
            dataType: 'json',
            async: false,
            headers: {
                "Authorization": author
            },
            data: commentJson,
            success: function() {
                alert(true)
            },
            error: function(){
                alert("账号密码错误,或者开启了两步验证");
            }
        });
      }else{
        alert("没有此文件");
     }
  }
  this.add=function(name,str,mess){
       var path=config.filepath+name;
        var str=window.btoa(unescape(encodeURIComponent(str)));
        var author=config.author;
        var commentJson=JSON.stringify({
          "message": mess?mess:"add",
          "content": str
        });
        $.ajax({
            type: "PUT",
            url: path,
            dataType: 'json',
            async: false,
            headers: {
                "Authorization": author
            },
            data: commentJson,
            success: function() {
                alert(true)
            },
            error: function(){
                alert("账号密码错误,或者开启了两步验证");
            }
        });
  }
  this.del=function(name,mess){
    var path=config.filepath+name;
    $.getJSON(path,function(json){
      if(json.sha){
        var author=config.author;
        var commentJson=JSON.stringify({
          "message": mess?mess:"update",
          "sha": json.sha
        });
        $.ajax({
            type: "DELETE",
            url: path,
            dataType: 'json',
            async: false,
            headers: {
                "Authorization": author
            },
            data: commentJson,
            success: function() {
                alert(true)
            },
            error: function(){
                alert("账号密码错误,或者开启了两步验证");
            }
        });
      }else{
        alert("没有此文件");
      }
    });
  }
}
//git=new git();