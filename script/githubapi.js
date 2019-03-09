githubapi={
    user:"",
    async login(){
        if(this.user){return this.user};
        var user=localStorage.getItem("user");
        if(user){
            user=JSON.parse(user);
            this.user=user;
            return user
        }
        let name=prompt("用户名");
        let psw=prompt("密码");
        //var token=prompt("token");
        var author="Basic "+btoa(name+":"+psw);
        this.user={name,author};
        localStorage.setItem("user",JSON.stringify(this.user));
        return this.user;
    },
    async getRepos(){
        let user=await this.login();
        var json={
            url:`https://api.github.com/users/${user.name}/repos`,
            head:{Authorization:user.author}
        }
        var re=await f.ajax(json);
        return re.text;
    },
    async getFiles(name){
        let user=await this.login();
        var json={
            url:`https://api.github.com/repos/${user.name}/${name}/contents`,
            head:{Authorization:user.author}
        }
        var re=await f.ajax(json);
        return re.text;
    },
    async getFile(repos_name,file_name,branch="master"){
        let user=await this.login();
        var json={
            url:`https://api.github.com/repos/${user.name}/${repos_name}/contents/${file_name}?ref=${branch}`,
            head:{Authorization:user.author}
        }
        var j=await f.ajax(json);
        var json=JSON.parse(j.text);
        var re="";
        if(json.content){
              var re=window.atob(json.content);
            re= decodeURIComponent(escape(re));
        }
        return re;
    },
    async createFile(para){
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
    },
    async writeFile(){
        
    },
    async deleteFile(){},
    async createRespos(){},
    async deleteRespos(){},
    async getIssues(){},
    async getIssue(){},
    async deleteIssue(){},
    async writeIssue(){},
    async createIssue(){},
    async getComments(){},
    async getComment(){},
    async deleteComment(){},
    async writeComment(){},
    async createComment(){}
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
alert()
