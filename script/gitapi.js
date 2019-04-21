gitapi=class gitapi{
    constructor(name){
        this.name=name;
    }
    async getUser(name){
        this.name=name||this.name;
        if(this.user){return this.user};
        var users=await store.getItem("users");
        if(users){
            users=JSON.parse(users);
            var name=name||this.name||prompt("用户名","docfeng");
            if(users[name]){
                var author=users[name];
                let user={name,author};
                this.user=user;
                return user;
            }
        }
       return await this.login(name); 
    }
    async login(name,psw){
        var name=name||prompt("用户名","docfeng");
        var psw=psw||prompt("密码:"+name);
        var users=await store.getItem("users");
        alert(users)
        users=users?JSON.parse(users):{};
        //var token=prompt("token");
        var author="Basic "+btoa(name+":"+psw);
        this.user={name,author};
        users[name]=author;
        alert(JSON.stringify(users));
        await store.setItem("users",JSON.stringify(users));
        return this.user;
    }
    async getsha(repos,name){
        if(!this.shas){
            await this.getFiles(repos);
        } 
        var sha=this.shas[name]||null;
        return sha;
   } 
    async getRepos(){
        var user=await this.getUser();
        if(!user){return false;}
        var json={
            url:`https://api.github.com/users/${user.name}/repos`,
            head:{Authorization:user.author}
        }
        var re=await http.ajax(json);
        return re;
    }
    async getFiles(repos,name=""){
        var user=await this.getUser();
        var json={
            url:`https://api.github.com/repos/${user.name}/${repos}/contents/${name}`,
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var re=JSON.parse(text);
        var shas={};
        for(var i=0;i<re.length;i++){
            if(re[i].type="file"){
                shas[re[i].path]=re[i].sha;
            }
        } 
        this.shas=shas; 
        return re;
    }
    async getDir(user,repos,name=""){
        var re={};
        var users=await store.getItem("users");
        users=JSON.parse(users); 
        if(!user||!users[user]){
            var dir=[];
            for(var i in users){
                dir[dir.length]=i;
            }
            re.dir= dir;
            return re;
        }
       if(users[user]) {
           var git=new gitapi(user);
           if(!repos){
               var repo=await git.getRepos();
               repo=JSON.parse(repo);
               var dir=[];
               for(var i=0;i<repo.length;i++){
                   dir[dir.length]=repo[i].name;
               }
               re.dir= dir;
               return re;
           }else{
               var repo=await git.getFiles(repos,name);
               //alert(JSON.stringify(repo,null,4))
               var dir=[];
               var file=[];
               for(var i=0;i<repo.length;i++){
                   if(repo[i].type="file"){
                       file[file.length]=repo[i].path;
                   }else{
                       //type="dir";
                       dir[dir.length]=repo[i].path;alert(repo[i].type)
                   }
               }
               re.file=file;
               re.dir=dir;
               return re;
           }  
       }  
    }
    async getFile(repos_name,file_name,branch="master"){
        var user=await this.getUser();
        var json={
            url:`https://api.github.com/repos/${user.name}/${repos_name}/contents/${file_name}?ref=${branch}`,
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);
        var re="";
        if(json.content){
              var re=window.atob(json.content);
              re= decodeURIComponent(escape(re));
        }
        if(json.sha){
            this.shas=this.shas||{};
            this.shas[json.path]=json.sha;
        }
        return re;
    }
    async createFile(para){
        var user=await this.getUser();
        //status:201 true;422 false;200 write true
        var owner=para.owner;
        var repos=para.repos; 
        var name=para.name; 
        var sha=await this.getsha(repos,name);
        var branch=para.branch?para.branch:"master";
        var message=para.message?para.message:"add";
        var author= user.author;
        var str=window.btoa(unescape(encodeURIComponent(para.txt)));
        var data={
            "message": message,
            "content": str,
            "sha":sha,
            "branch" : branch
        }
        var json={
            url:"https://api.github.com/repos/"+owner+"/"+repos+"/contents/"+name,
            head:{Authorization:user.author},
            type:"put",
            xml:true,
            data:JSON.stringify(data)
        }
        var re=await http.ajax(json);
        var status=re.xml.status;
        switch(status){
            case 200:alert("写入成功");break;
            case 201:alert("创建成功");break;
            case 422:alert("false");break;
        }
        var json=JSON.parse(re.html);
        var re="";
        if(json.content){
            re=json.content.sha;
            this.shas[name]=re; 
        }
        return re;
    }
    async writeFile(){
        
    }
    async deleteFile(para){
        //status:200 true;404 false;422参数错误
        var user=await this.getUser();
        var owner=para.owner;
        var repos=para.repos; 
        var name=para.name;
        var sha=await this.getsha(repos,name);
        if(!sha){
            alert("不存在文件");
            return 0;
        }
        var branch=para.branch?para.branch:"master";
        var message=para.message?para.message:"delete";
        var author= user.author;
        var data={
            "message": message,
            "sha":sha,
            "branch" : branch
        }
        var json={
            url:"https://api.github.com/repos/"+owner+"/"+repos+"/contents/"+name,
            head:{Authorization:user.author},
            type:"delete",
            xml:true,
            data:JSON.stringify(data)
        }
        var re=await http.ajax(json);
        var status=re.xml.status;
        switch(status){
            case 200:alert("删除成功");
                delete this.shas[name];
                break;
            case 404:alert("没有文件");break;
            case 422:alert("参数错误");break;
        }
       return re; 
    }
    async createRespos(){}
    async deleteRespos(){}
    async getIssues(){}
    async getIssue(){}
    async deleteIssue(){}
    async writeIssue(){}
    async createIssue(){}
    async getComments(){}
    async getComment(){}
    async deleteComment(){}
    async writeComment(){}
    async createComment(){}
}

/*
(async function(a){
  var git=new gitapi("docfeng);
  alert(await git.getRepos());
  a1=await git.getFiles("page");
alert(await gitapi.getRepos());
alert(await git.getFile("page","git.html"));
  var name="2019041901.txt";
  alert(await git.deleteFile({"owner":"docfeng",repos:"page","name":name,txt:"reghhhst"}))
//alert(await gitapi.getFiles("page"));
})()

*/
//git=new gitapi("docfeng")
//alert()

