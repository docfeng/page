giteeapi=class gitapi{
    
    constructor(name){
        this.name=name;
        this.baseurl="https://gitee.com/api/v5";
        //this.baseurl="https://api.github.com";
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
        var author=psw;//"Basic "+btoa(name+":"+psw);
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
            url:`${this.baseurl}/users/${user.name}/repos`,
            head:{Authorization:user.author}
        }
        var re=await http.ajax(json);
        return re;
    }
    async getMyRepos(){
        var user=await this.getUser();
        if(!user){return false;}
        var json={
            url:`${this.baseurl}/user/repos`,
            head:{Authorization:user.author}
        }
        var re=await http.ajax(json);
        return re;
    }
    async getFiles(repos,name=""){
        var user=await this.getUser();
        var json={
            url:`${this.baseurl}/repos/${user.name}/${repos}/contents/${name}`,
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var re=JSON.parse(text);
        var shas={};
        for(var i=0;i<re.length;i++){
            if(re[i].type=="file"){
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
               var repo=await git.getMyRepos();
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
                   if(repo[i].type=="file"){
                       file[file.length]=repo[i].path;
                   }else{
                       //type="dir";
                       dir[dir.length]=repo[i].path;
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
            url:`${this.baseurl}/repos/${user.name}/${repos_name}/contents/${file_name}?ref=${branch}`,
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
            "access_token":user.author,
            "message": message,
            "content": str,
            //"branch" : branch
        }
        var json={
            url:`${this.baseurl}/repos/`+owner+"/"+repos+"/contents/"+name,
            head:{"Content-Type": "application/json"},
            type:"post",
            xml:true,
            data:JSON.stringify(data)
        }
        
        var re=await http.ajax(json);
        alert(JSON.stringify(re))
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
    async writeFile(para){
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
            "access_token":user.author,
            "message": message,
            "content": str,
            "sha":sha,
            //"branch" : branch
        }
        var json={
            url:`${this.baseurl}/repos/`+owner+"/"+repos+"/contents/"+name,
            head:{"Content-Type": "application/json"},
            type:"put",
            xml:true,
            data:JSON.stringify(data)
        }
        
        var re=await http.ajax(json);
        alert(JSON.stringify(re))
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
            url:`${this.baseurl}/repos/`+owner+"/"+repos+"/contents/"+name,
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
    async pages(){
        var data={
            "access_token":user.author,
        }
        var json={
            url:"https://gitee.com/api/v5/repos/docf/page/pages/builds",
            head:{"Content-Type": "application/json"},
            type:"post",
            //xml:true,
            data:JSON.stringify(data)
        }
        
        return http.ajax(json);
    }
    async createRespos(){}
    async deleteRespos(){}
    async getIssues(user_name,repos_name,number=""){
        var user=await this.getUser();
        var user_name=user_name||user.name;
        var number=number==""?"":"/"+number;
        var json={
            url:`${this.baseurl}/repos/${user_name}/${repos_name}/issues${number}`,
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,comments_url,number,title,body
        return json;
    }
    async getIssue(){}
    async deleteIssue(){}
    async writeIssue(){}
    async createIssue(){}
    async getComments(){
        var user=await this.getUser();
        if(arguments.length==1){
            var url=arguments[0];
        }else{
            var user_name=arguments[0]||user.name;
            var repos_name=arguments[1];
            var issue_number=arguments[2];
            if(!user_name||!repos_name||!issue_number)return false;
            url=`${this.baseurl}/repos/${user_name}/${repos_name}/issues/${issue_number}/comments`
        }
        var json={
            url:url,
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        alert(text) 
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
    async getComment(){
        var user=await this.getUser();
        if(arguments.length==1){
            var url=arguments[0];
        }else{
            var user_name=arguments[0]||user.name;
            var repos_name=arguments[1];
            var comment_id=arguments[2];
            if(!user_name||!repos_name||!comment_id)return false;
            url=`${this.baseurl}/repos/${user_name}/${repos_name}/issues/comments/${comment_id}`
        }
        var json={
            url:url,
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
    async deleteComment(){
        var user=await this.getUser();
        if(arguments.length==1){
            var url=arguments[0];
        }else{
            var user_name=arguments[0]||user.name;
            var repos_name=arguments[1];
            var comment_id=arguments[2];
            if(!user_name||!repos_name||!comment_id)return false;
            url=`${this.baseurl}/repos/${user_name}/${repos_name}/issues/comments/${comment_id}`
        }
        var json={
            url:url,
            method:"delete",
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
    async writeComment(){
        var user=await this.getUser();
        if(arguments.length==1){
            var url=arguments[0];
        }else{
            var user_name=arguments[0]||user.name;
            var repos_name=arguments[1];
            var comment_id=arguments[2];
            var body=arguments[3];
            if(!user_name||!repos_name||!comment_id)return false;
            url=`${this.baseurl}/repos/${user_name}/${repos_name}/issues/comments/${comment_id}`
        }
        var json={
            url:url,
            method:"PATCH",
            str: JSON.stringify({"body":body}),
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
    async createComment(){
        var user=await this.getUser();
        if(arguments.length==1){
            var url=arguments[0];
        }else{
            var user_name=arguments[0]||user.name;
            var repos_name=arguments[1];
            var issue_number=arguments[2];
            var body=arguments[3];
            if(!user_name||!repos_name||!issue_number||!body)return false;
            url=`${this.baseurl}/repos/${user_name}/${repos_name}/issues/${issue_number}/comments`
        }
        var json={
            url:url,
            method:"post",
            str: JSON.stringify({"body":body}),
            head:{Authorization:user.author}
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
    async hasChange(time){
        var url="${this.baseurl}/repos/docfeng/page";
        var json={
            url:url,
            method:"head",
            xml:true,
            head:{//"If-Modified-Since": new Date().toUTCString()//"Sun, 11 Aug 2013 19:48:59 GMT"
            }
        }
        if(time){
            json.head["If-Modified-Since"]=time.toUTCString();
        }
        var re=await http.ajax(json);
        //var h=re.xml.getAllResponseHeaders()
        if(re.xml.status=="304"){
            return [true,this.getLimit(re.xml)];
        }else{
            return [false,this.getLimit(re.xml)];
        } 
    }
    getLimit(xml){
            return [xml.getResponseHeader("X-RateLimit-Remaining"),
                xml.getResponseHeader("X-RateLimit-Limit"),
                xml.getResponseHeader("X-RateLimit-Reset")
            ];
    }
    download(name,url) {
        var anchor = document.createElement("a");
        if('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = url;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
        }else {
       window.open(url);
        }
    }
    downloadFile(name,user,repos,file){
        var url=`https://raw.githubusercontent.com/${user}/${repos}/master/${file}`
        this.download(name,url);
    }
    downloadRepos(name,user,repos){
        //var url=`https://codeload.github.com/${user}/${repos}/legacy.zip/master`;
        var url=`https://codeload.github.com/${user}/${repos}/zip/master`;
        //downloadFile(name,url)
        window.open(url)
    }
    downloadBlob(value, type, name) {
        var blob;
        if(typeof window.Blob == "function") {
            blob = new Blob([value], {type: type});
        } else {
            var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
            var bb = new BlobBuilder();
            bb.append(value);
            blob = bb.getBlob(type);
        }
        var URL = window.URL || window.webkitURL;
        var bloburl = URL.createObjectURL(blob);
    
        var anchor = document.createElement("a");
        if('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
        } else if(navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, name);
        } else {
            location.href = bloburl;
        }
    }
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

    //downloadFile("hello.txt","docfeng","page","1.mp3");
    //downloadRepos("h.zip","docfeng","reader");
    //downloadBlob("fgggh", "text/csv,charset=UTF-8", "hello.txt");
}

*/
//git=new gitapi("docfeng")
//alert()
/*

https://developer.github.com/v3/repos/#list-your-repositories
*/

alert()