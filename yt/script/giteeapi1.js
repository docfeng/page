giteeapi=class gitapi{
    
    constructor(name,token,branch){
        this.user=name||"";
		this.author=token||"";
		this.branch=branch||"master"
        this.baseurl="https://gitee.com/api/v5";
        //this.baseurl="https://api.github.com";
    }
	set(name,token,branch){
		this.user=name;
		this.author=token;
		this.branch=branch||"master"
	}
    async getsha(repo,name,branch){
		if(this.shas&&this.shas[name]){
			var sha=this.shas[name];
			return sha;
		}else{
			var branch=branch||this.branch;
			var path=name.match(/(.*)\//)
			path=path&&path.length==2?path[0]:"";
			var para={
				repo:repo,
				path:path,
				branch:branch
			}
			console.log(para);
			await this.getFiles(para);
			var sha=this.shas[name]||null;
			return sha;
        } 
        
   } 
    
	async getRepos(){
        var user=this.user;
		var author=this.author;
		var url=this.baseurl;
        if(!user||!author||!url){return false;}
        var json={
            url:`${url}/users/${user}/repos`,
            head:{Authorization:author}
        }
        var re=await http.ajax(json);
        return re;
    }
    async getMyRepos(){
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
        if(!user||!author||!url){return false;}
        var json={
            url:`${url}/user/repos?access_token=${author}`,
            head:{Authorization:author}
        }
        var re=await http.ajax(json);
        return re;
    }
    async createRespos(repo,_private=true){
		var user=this.user;
		var author=this.author;
		var url=this.baseurl;
		if(!user||!author||!url){return false;}
		var data={
		    "access_token":author,
		    "name": repo,
		    "auto_init": true,
		    "private" : _private
		}
		var json={
		    url:`${url}/user/repos`,
		    head:{"Content-Type": "application/json"},
		    type:"post",
		    xml:true,
		    data:JSON.stringify(data)
		}
		
		var re=await http.ajax(json);
		console.log(re)
	}
    async deleteRespos(repo){
		var user=this.user;
		var author=this.author;
		var url=this.baseurl;
		if(!user||!author||!url){return false;}
		var json={
		    url:`${url}/repos/${user}/${repo}?access_token=${author}`,
		    head:{"Content-Type": "application/json"},
		    type:"DELETE",
		    xml:true
		}
		
		var re=await http.ajax(json);
		console.log(re)
	}
	async clearRespos(repo){
		var user=this.user;
		var author=this.author;
		var url=this.baseurl;
		if(!user||!author||!url){return false;}
		var json={
		    url:`${url}/repos/${user}/${repo}/clear?access_token=${author}`,
		    head:{"Content-Type": "application/json"},
		    type:"PUT",
		    xml:true
		}
		
		var re=await http.ajax(json);
		console.log(re)
	}
	
	async getFiles(para){
		var user=this.user;
		var author=this.author;
		var url=this.baseurl;
		var branch=this.branch
		if(!user||!author||!url){return false;}
		user=para.user||user;
		branch=para.branch||branch;
		var repo=para.repo;
		var path=para.path||"";
		if(!repo){return false;}
		var json={
			url:`${url}/repos/${user}/${repo}/contents/${path}?ref=${branch}&access_token=${author}`,
			head:{Authorization:author}
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
		console.log(shas)
		return re;
    }
    async getDir(user,repo,name=""){
		var that=this;
        var re={};
        var users=await store.getItem("users");
        users=JSON.parse(users); 
		var author=users[user];
		console.log(users)
        if(!user||!author){
            var dir=[];
            for(var i in users){
                dir[dir.length]=i;
            }
            re.dir= dir;
            return re;
        }
       if(author) {
           //var git=new gitapi(user,author);
           if(!repo){
               var repo=await that.getMyRepos();
               repo=JSON.parse(repo);
               var dir=[];
               for(var i=0;i<repo.length;i++){
                   dir[dir.length]=repo[i].name;
               }
               re.dir= dir;
               return re;
           }else{
               var repo=await that.getFiles(repo,name);
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
    async getFile(para){
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
		var branch=para.branch||this.branch;
		
		var owner=para.owner||user;
		var repo=para.repo; 
		var name=para.name;
		
        var json={
            url:`${url}/repos/${owner}/${repo}/contents/${name}?ref=${branch}&access_token=${author}`,
            head:{Authorization:author}
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
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
        var branch=para.branch||this.branch;
		
        //status:201 true;422 false;200 write true
        var owner=para.owner;
        var repo=para.repo; 
        var name=para.name; 
        //var sha=await this.getsha(repo,name);
        var message=para.message?para.message:"add";

        var str=window.btoa(unescape(encodeURIComponent(para.txt)));
        var data={
            "access_token":author,
            "message": message,
            "content": str,
            "branch" : branch
        }
        var json={
            url:`${url}/repos/${owner}/${repo}/contents/${name}`,
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
		try{
			var json=JSON.parse(re.html);
			var re="";
			if(json.content){
			    re=json.content.sha;
			    this.shas[name]=re; 
			}
		}catch(e){
			/* gitee创建完成，不返回sha，需重新请求 */
			this.getFile(repo,name,branch=this.branch);
		}
        return re;
    }
    async writeFile(para){
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
        var branch=para.branch||this.branch;
        //status:201 true;422 false;200 write true
        var owner=para.owner;
        var repo=para.repo; 
        var name=para.name;
		var branch=para.branch||this.branch;
		var message=para.message||"add";
		
        var sha=para.sha||await this.getsha(repo,name,branch);
        if(!sha&&confirm(`${path}不存在文件${name}：是否新建`)){
			return this.createFile(para);
		}
        var str=window.btoa(unescape(encodeURIComponent(para.txt)));
        var data={
            "access_token":author,
            "message": message,
            "content": str,
            "sha":sha,
            "branch" : branch
        }
		
        var json={
            url:`${url}/repos/${owner}/${repo}/contents/${name}`,
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
		try{
			var json=JSON.parse(re.html);
			var re="";
			if(json.content){
			    re=json.content.sha;
			    this.shas[name]=re; 
			}
		}catch(e){
			/* gitee创建完成，不返回sha，需重新请求 */
			this.getFile(repo,name,branch=this.branch);
		}
        return re;
    }
    async writeBlobFile(para){
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
        var branch=para.branch||this.branch;
        //status:201 true;422 false;200 write true
        var owner=para.owner||user;
        var repo=para.repo||window.repo; 
        var name=para.name;
	var branch=para.branch||this.branch||window.branch;
	var message=para.message||"add";
        //var str=window.btoa(unescape(encodeURIComponent(para.txt)));
        var str=para.blob;
        var data={
            "access_token":author,
            "message": message,
            "content": para.txt,
            "branch" : branch
        }
		
        var json={
            url:`${url}/repos/${owner}/${repo}/contents/${name}`,
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
        return re;
    }
    async deleteFile(para){
        //status:200 true;404 false;422参数错误
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
        var branch=para.branch||this.branch;
		
        var owner=para.owner||user;
        var repo=para.repo; 
        var name=para.name;
        var sha=para.sha||await this.getsha(repo,name);
        if(!sha){
            alert("不存在文件");
            return 0;
        }
		
        var message=para.message||"delete";
        
        var data={
            "message": message,
            "sha":sha,
            "branch" : branch
        }
        var json={
            url:`${url}/repos/${owner}/${repo}/contents/${name}?branch=${branch}&access_token=${author}&sha=${sha}&message=${message}`,
            //在读取文件api中，分支是ref，在删除文件api中，是branch
			//head:{Authorization:author},
            type:"delete",
            xml:true//,
            //data:JSON.stringify(data)
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
    
	async getPages(owner,repo){
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
		var owner=owner||user;
        var json={
            url:`https://gitee.com/api/v5/repos/${owner}/${repo}/pages?access_token=${author}`,
            type:"get"
            //xml:true,
        }
        
        return http.ajax(json);
    }
	async pages(owner,repo){
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
        var data={
            "access_token":author,
        }
        var json={
            url:`https://gitee.com/api/v5/repos/${owner}/${repo}/pages/builds`,
            head:{"Content-Type": "application/json"},
            type:"post",
            //xml:true,
            data:JSON.stringify(data)
        }
        
        return http.ajax(json);
    }

	async getAllIssues(user,repo){
	    var user=user||this.user;
	    var author=this.author;
	    var url=this.baseurl;
	    var repo=repo||this.repo;
	    var user=user||user;
	    var number=number==""?"":"/"+number;
	    var json={
	        url:`${url}/repos/${user}/${repo}/issues?access_token=${author}`
	    }
	    var text=await http.ajax(json);
	    var json=JSON.parse(text);//url,comments_url,number,title,body
	    return json;
	}
	async getIssues(user,repo,number=""){
        var user=user||this.user;
        var author=this.author;
        var url=this.baseurl;
        var repo=repo||this.repo;
        var number=number==""?"":"/"+number;
        var json={
            url:`${url}/repos/${user}/${repo}/issues${number}?access_token=${author}`
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,comments_url,number,title,body
        return json;
    }
    async getIssue(){}
    async deleteIssue(){}
	async changeIssueState(user,repo,issue,state){
		var owner=user||this.user;
		var author=this.author;
		var url=this.baseurl;
		var repo=repo||this.repo;
		var data={
		    "access_token":author,
		    "repo": repo,
		    "state": state
		}
		var json={
		    url:`${url}/repos/${owner}/issues/${issue}`,
		    head:{"Content-Type": "application/json"},
		    type:"PATCH",
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
		re=JSON.parse(re.html);
		return re;
	}
    async writeIssue(user,repo,issue,title,body){
		var owner=user||this.user;
		var author=this.author;
		var url=this.baseurl;
		var repo=repo||this.repo;
		var data={
		    "access_token":author,
		    "repo": repo,
		    "title": title,
		    "body" : body
		}
		var json={
		    url:`${url}/repos/${owner}/issues/${issue}`,
		    head:{"Content-Type": "application/json"},
		    type:"PATCH",
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
		re=JSON.parse(re.html);
		return re;
	}
    async createIssue(user,repo,title,body){
		var owner=user||this.user;
		var author=this.author;
		var url=this.baseurl;
		var repo=repo||this.repo;
		var data={
		    "access_token":author,
		    "repo": repo,
		    "title": title,
		    "body" : body
		}
		var json={
		    url:`${url}/repos/${owner}/issues`,
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
		re=JSON.parse(re.html);
		return re;
	}
    
	async getComments(user,repo,issue){
        var user=user||this.user;
        var author=this.author;
        var url=this.baseurl;
        var repo=repo||this.repo;
        if(!user||!repo||!issue)return false;
        var json={
            "url":`${url}/repos/${user}/${repo}/issues/${issue}/comments?access_token=${author}`
        }
        var text=await http.ajax(json);
        alert(text) 
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
    async getComment(user,repo,comment){
        var user=user||this.user;
        var author=this.author;
        var url=this.baseurl;
        var repo=repo||this.repo;
        if(!user||!repo||!comment)return false;
        var json={
            "url":`${url}/repos/${user}/${repo}/issues/comments/${comment}?access_token=${author}`
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
    async deleteComment(user,repo,comment){
        var user=user||this.user;
        var author=this.author;
        var url=this.baseurl;
        var repo=repo||this.repo;
        if(!user||!repo||!comment)return false;
        var json={
            "url":`${url}/repos/${user}/${repo}/issues/comments/${comment}?access_token=${author}`,
			"method":"delete",
        }
        var text=await http.ajax(json);
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json;
    }
    async writeComment(user,repo,comment,body){
		var user=user||this.user;
		var author=this.author;
		var url=this.baseurl;
		var repo=repo||this.repo;
		if(!user||!repo||!comment)return false;
		var data={
		    "access_token":author,
		    "body": body
		}
		var json={
		    "url":`${url}/repos/${user}/${repo}/issues/comments/${comment}`,
			"head":{"Content-Type": "application/json"},
			"data":JSON.stringify(data),
			"method":"PATCH",
		}
		var text=await http.ajax(json);
		var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
		return json;
    }
    async createComment(user,repo,issue,body){
        var user=user||this.user;
        var author=this.author;
        var url=this.baseurl;
        var repo=repo||this.repo;
        if(!user||!repo||!issue)return false;
		var data={
		    "access_token":author,
		    "body": body
		}
		var json={
		    "url":`${url}/repos/${user}/${repo}/issues/comments/${comment}`,
			"head":{"Content-Type": "application/json"},
			"data":JSON.stringify(data),
			"method":"POST",
		}
        var json={
            "url":`${url}/repos/${user}/${repo}/issues/${issue}/comments?access_token=${author}`
        }
        var text=await http.ajax(json);
        alert(text) 
        var json=JSON.parse(text);//url,html_url,issues_url,id,url.login,body
        return json
    }
       
	async getAllBranch(para){
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
		if(!user||!author||!url){
			console.log(user,author,url)
			return false;
		}
		
		var owner=para.owner||user;
		var repo=para.repo;
		if(!owner||!repo){return false;}

        var json={
            "url":`${url}/repos/${owner}/${repo}/branches?access_token=${author}`,
			"type":"get"
        }
        var json=await http.ajax(json);
		var re=[];
        if(json){
			json=JSON.parse(json);
			for (var i = 0; i < json.length; i++) {
				re.push(json[i].name);
			}
		}
        return re
    }
	async createBranch(para){
	    var user=this.user;
	    var author=this.author;
	    var url=this.baseurl;
		if(!user||!author||!url){return false;}
		
		var owner=para.owner||user;
		var repo=para.repo;
		var from_branch_name=para.from_branch_name;
		var branch_name=para.branch_name;
		if(!owner||!repo||!from_branch_name||!branch_name){return false;}
		var data={
		    "access_token":author,
		    "refs": from_branch_name||"master",
		    "branch_name": branch_name,
		}
	    var json={
	        "url":`${url}/repos/${owner}/${repo}/branches`,
			head:{"Content-Type": "application/json"},
			"type":"post",
			data:JSON.stringify(data)
	    }
	    var json=await http.ajax(json);
		var re=[];
	    if(json){
			json=JSON.parse(json);
			for (var i = 0; i < json.length; i++) {
				re.push(json[i].name);
			}
		}
	    return re
	}
    async deleteBranch(para){
		//无效
        var user=this.user;
        var author=this.author;
        var url=this.baseurl;
    	if(!user||!author||!url){return false;}
    	
    	var owner="docf"//para.owner||user;
    	var repo="page"//para.repo;
    	var branche="edit2"//para.branch;
    	if(!owner||!repo||!branch){return false;}
		var data={
			"access_token":author,
			"branches": "edit"
		}
        var json={
            "url":`${url}/repos/${owner}/${repo}/git/refs/heads/${branch}？access_token=${author}`,
    		"type":"delete"
        }
        var json=await http.ajax(json);
		alert(json)
		console.log(json)
    	var re=[];
        if(json){
    		json=JSON.parse(json);
    		for (var i = 0; i < json.length; i++) {
    			re.push(json[i].name);
    		}
    	}
        return re
    }
    
	
	async getAllGists(){
	    var user=this.user;
	    var author=this.author;
	    var url=this.baseurl;
	    var json={
			url:`${url}/gists?access_token=${author}`
	    }
	    var text=await http.ajax(json);
	    var arrs=JSON.parse(text);
		console.log(json)
	    var re=[];
		for (var i = 0; i < arrs.length; i++) {
			var json=arrs[i];
			var arr=json.files;
			var id=json.id;
			for(var name in arr){
				var data={
					"name":name,
					"content":arr[name].content,
					"id":id
				}
				re.push(data);
			}
		}
	    return re;
	}
	async getGists(id){
	    var user=this.user;
	    var author=this.author;
	    var url=this.baseurl;

		var id=id;
	    var json={
			url:`${url}/gists/${id}?access_token=${author}`
	    }
	    var text=await http.ajax(json);
	    var json=JSON.parse(text);
		console.log(json)
	    var arr=json.files;
	    console.log(arr)
	    var re=[];
		for(var name in arr){
			var data={
				"name":name,
				"content":arr[name].content,
				"id":id
			}
			re.push(data);
		}
	    return re;
	}
	async createGists(files){
	    var user=this.user;
	    var author=this.author;
	    var url=this.baseurl;
	    var data={
	        "access_token":author,
	        "description": "add",
	        "files": files,
	        "public" : false
	    }
	    var json={
	        url:`${url}/gists`,
	        head:{"Content-Type": "application/json"},
	        type:"post",
	        data:JSON.stringify(data)
	    }
	    var text=await http.ajax(json);
	    var json=JSON.parse(text);
		var arr=json.files;
	    var re=[];
	    for(var name in arr){
	    	var data={
	    		"name":name,
	    		"content":arr[name].content,
	    		"id":json.id
	    	}
	    	re.push(data);
	    }
	    return re;
	}
	async writeGists(id,files){
	    var user=this.user;
	    var author=this.author;
	    var url=this.baseurl;

		var id=id;
		
		var data={
		    "access_token":author,
		    "description": "change",
		    "files": files,
		    "public" : false
		}
	    var json={
			"url":`${url}/gists/${id}`,
			"head":{"Content-Type": "application/json"},
			"type":"PATCH",
			"data":JSON.stringify(data)
	    }
	    var text=await http.ajax(json);
	    var json=JSON.parse(text);
	    var arr=json.files;
	    console.log(json)
	    var re=[];
		for(var name in arr){
			var data={
				"name":name,
				"content":arr[name].content,
				"id":id
			}
			re.push(data);
		}
	    return re;
	}
	async deleteGists(id){
	    var user=this.user;
	    var author=this.author;
	    var url=this.baseurl;

		var id=id;
	    var json={
			url:`${url}/gists/${id}?access_token=${author}`,
			type:"DELETE",
			 xml:true
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
		console.log(text)
	    return status;
	}
	
	async hasChange(time){
        var url="${url}/repos/docfeng/page";
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
    downloadFile(name,user,repo,file,branch){
        var url=`https://gitee.com/${user}/${repo}/raw/${branch}/${file}`
        this.download(name,url);
    }
    downloadRepos(name,user,repo){
        //var url=`https://codeload.github.com/${user}/${repo}/legacy.zip/master`;
        var url=`https://codeload.github.com/${user}/${repo}/zip/master`;
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
  alert(await git.deleteFile({"owner":"docfeng",repo:"page","name":name,txt:"reghhhst"}))
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