giteeapi = function(name, token, branch) {
	this.user = name || "";
	this.author = token || "";
	this.branch = branch || "master"
	this.baseurl = "https://gitee.com/api/v5";
	//this.baseurl="https://api.github.com";
	this.set=function(name, token, branch) {
		this.user = name;
		this.author = token;
		this.branch = branch || "master"
	}
	this.getsha=function(repo, name, branch) {
		if (this.shas && this.shas[name]) {
			var sha = this.shas[name];
			return Promise.resolve(sha);
		} else {
			var branch = branch || this.branch;
			var path = name.match(/(.*)\//)
			path = path && path.length == 2 ? path[0] : "";
			var para = {
				repo: repo,
				path: path,
				branch: branch
			}
			console.log(para);
			var that=this;
			return this.getFiles(para).then(function(){
				var sha = that.shas[name] || null;
				return sha;
			});
		}

	}

	this.getRepos=function(a){
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		var json = {
			url: url+"/users/"+user+"/repos",
			head: {
				Authorization: author
			}
		}
		return http.ajax(json);
	}
	this.getMyRepos=function() {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		var json = {
			url: url+"/user/repos?access_token="+author,
			head: {
				Authorization: author
			}
		}
		return http.ajax(json);
	}
	this.createRespos=function(repo, _private) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		var data = {
			"access_token": author,
			"name": repo,
			"auto_init": true,
			"private": _private||true
		}
		var json = {
			url: url+"/user/repos",
			head: {
				"Content-Type": "application/json"
			},
			type: "post",
			xml: true,
			data: JSON.stringify(data)
		}
		return http.ajax(json);
	}
	this.deleteRespos=function(repo) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		var json = {
			url: url+"/repos/"+user+"/"+repo+"?access_token="+author,
			head: {
				"Content-Type": "application/json"
			},
			type: "DELETE",
			xml: true
		}
		return http.ajax(json);
	}
	this.clearRespos=function(repo) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		var json = {
			url: url+"/repos/"+user+"/"+repo+"/clear?access_token="+author,
			head: {
				"Content-Type": "application/json"
			},
			type: "PUT",
			xml: true
		}
		return http.ajax(json);
	}

	this.getFiles=function(para) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		var branch = this.branch
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		user = para.user || user;
		branch = para.branch || branch;
		var repo = para.repo;
		var path = para.path || "";
		if (!repo) {
			return Promise.resolve(false);
		}
		var json = {
			url: url+"/repos/"+user+"/"+repo+"/contents/"+path+"?ref="+branch+"&access_token="+author,
			head: {
				Authorization: author
			}
		}
		var that=this;
		return http.ajax(json).then(function(text){
			var re = JSON.parse(text);
			var shas = {};
			for (var i = 0; i < re.length; i++) {
				if (re[i].type == "file") {
					shas[re[i].path] = re[i].sha;
				}
			}
			that.shas = shas;
			console.log(shas)
			return re;
		});
		
	}
	this.getDir=function(user, repo, _name) {
		var name=_name||"";
		var that = this;
		var re = {};
		return store.getItem("users").then(function(_users){
			var users = JSON.parse(_users);
			var author = users[user];
			console.log(users)
			if (!user || !author) {
				var dir = [];
				for (var i in users) {
					dir[dir.length] = i;
				}
				re.dir = dir;
				return Promise.resolve(re);
			}
			if (author) {
				//var git=new gitapi(user,author);
				if (!repo) {
					return that.getMyRepos().then(function(_repo){
						var repo =JSON.parse(_repo);
						var dir = [];
						for (var i = 0; i < repo.length; i++) {
							dir[dir.length] = repo[i].name;
						}
						re.dir = dir;
						return re;
					});
				} else {
					 return that.getFiles(repo, name).then(function(_repo){
						var repo =_repo;
						//alert(JSON.stringify(repo,null,4))
						var dir = [];
						var file = [];
						for (var i = 0; i < repo.length; i++) {
							if (repo[i].type == "file") {
								file[file.length] = repo[i].path;
							} else {
								//type="dir";
								dir[dir.length] = repo[i].path;
							}
						}
						re.file = file;
						re.dir = dir;
						return re;
					});
				}
			}
		});
		
	}
	this.getFile=function(para) {
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		var branch = para.branch || this.branch;
		
		var repo = para.repo;
		var name = para.name;

		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/contents/"+name+"?ref="+branch+"&access_token="+author,
			"head": {
				Authorization: author
			}
		}
		var that=this;
		return  http.ajax(json).then(function(text){
			var json = JSON.parse(text);
			var re = "";
			if (json.content) {
				var re = window.atob(json.content);
				re = decodeURIComponent(escape(re));
			}
			if (json.sha) {
				that.shas = that.shas || {};
				that.shas[json.path] = json.sha;
			}
			return re;
		});
		
	}
	this.createFile=function(para) {
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		var branch = para.branch || this.branch;

		//status:201 true;422 false;200 write true
		var repo = para.repo;
		var name = para.name;
		//var sha=this.getsha(repo,name);
		var message = para.message ? para.message : "add";

		var str = window.btoa(unescape(encodeURIComponent(para.txt)));
		var data = {
			"access_token": author,
			"message": message,
			"content": str,
			"branch": branch
		}
		var json = {
			url:  url+"/repos/"+user+"/"+repo+"/contents/"+name,
			head: {
				"Content-Type": "application/json"
			},
			type: "post",
			xml: true,
			data: JSON.stringify(data)
		}
		
		var that=this;
		return http.ajax(json).then(function(re){
			alert(JSON.stringify(re))
			var status = re.xml.status;
			switch (status) {
				case 200:
					alert("写入成功");
					break;
				case 201:
					alert("创建成功");
					break;
				case 422:
					alert("false");
					break;
			}
			try {
				var json = JSON.parse(re.html);
				var re = "";
				if (json.content) {
					re = json.content.sha;
					that.shas[name] = re;
				}
			} catch (e) {
				/* gitee创建完成，不返回sha，需重新请求 */
				that.getFile(repo, name, branch = that.branch);
			}
			return re;
		});
	}
	this.writeFile=function(para) {
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		var branch = para.branch || this.branch;
		//status:201 true;422 false;200 write true
		var repo = para.repo;
		var name = para.name;
		var branch = para.branch || this.branch;
		var message = para.message || "add";
		var sha;
		if(para.sha){
			sha=Promise.resolve(para.sha)
		}
		var sha = para.sha? Promise.resolve(para.sha): this.getsha(repo, name, branch);
		var that=this;
		return sha.then(function(sha){
			if (!sha && confirm(path+"不存在文件"+name+":是否新建")) {
				return that.createFile(para);
			}
			var str = window.btoa(unescape(encodeURIComponent(para.txt)));
			var data = {
				"access_token": author,
				"message": message,
				"content": str,
				"sha": sha,
				"branch": branch
			}
			
			var json = {
				url:  url+"/repos/"+user+"/"+repo+"/contents/"+name,
				head: {
					"Content-Type": "application/json"
				},
				type: "put",
				xml: true,
				data: JSON.stringify(data)
			}
			
			return http.ajax(json).then(function(re){
				alert(JSON.stringify(re))
				var status = re.xml.status;
				switch (status) {
					case 200:
						alert("写入成功");
						break;
					case 201:
						alert("创建成功");
						break;
					case 422:
						alert("false");
						break;
				}
				try {
					var json = JSON.parse(re.html);
					var re = "";
					if (json.content) {
						re = json.content.sha;
						that.shas[name] = re;
					}
				} catch (e) {
					/* gitee创建完成，不返回sha，需重新请求 */
					that.getFile(repo, name, branch = that.branch);
				}
				return re;
			});
		});
		
	}
	this.writeBlobFile=function(para) {
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		var branch = para.branch || this.branch;
		//status:201 true;422 false;200 write true
		var repo = para.repo || window.repo;
		var name = para.name;
		var branch = para.branch || this.branch || window.branch;
		var message = para.message || "add";
		//var str=window.btoa(unescape(encodeURIComponent(para.txt)));
		var str = para.blob;
		var data = {
			"access_token": author,
			"message": message,
			"content": para.txt,
			"branch": branch
		}

		var json = {
			url: url+"/repos/"+user+"/"+repo+"/contents/"+name,
			head: {
				"Content-Type": "application/json"
			},
			type: "post",
			xml: true,
			data: JSON.stringify(data)
		}

		return http.ajax(json).then(function(re){
			alert(JSON.stringify(re))
			var status = re.xml.status;
			switch (status) {
				case 200:
					alert("写入成功");
					break;
				case 201:
					alert("创建成功");
					break;
				case 422:
					alert("false");
					break;
			}
			return re;
		});
	}
	this.deleteFile=function(para) {
		//status:200 true;404 false;422参数错误
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		var branch = para.branch || this.branch;

		var repo = para.repo;
		var name = para.name;
		var sha = para.sha? Promise.resolve(para.sha): this.getsha(repo, name);
		var that=this;
		return sha.then(function(sha){
			if (!sha) {
				alert("不存在文件");
				return 0;
			}
			
			var message = para.message || "delete";
			
			var data = {
				"message": message,
				"sha": sha,
				"branch": branch
			}
			var json = {
				url: url+"/repos/"+user+"/"+repo+"/contents/"+name+"?branch="+branch+"&access_token="+author+"&sha="+sha+"&message="+message,
				//在读取文件api中，分支是ref，在删除文件api中，是branch
				//head:{Authorization:author},
				type: "delete",
				xml: true //,
				//data:JSON.stringify(data)
			}
			return http.ajax(json).then(function(re){
				var status = re.xml.status;
				switch (status) {
					case 200:
						alert("删除成功");
						delete that.shas[name];
						break;
					case 404:
						alert("没有文件");
						break;
					case 422:
						alert("参数错误");
						break;
				}
				return re;
			});			
		});
		
	}

	this.getPages=function(_user, repo) {
		var user = _user||this.user;
		var author = this.author;
		var url = this.baseurl;
		var json = {
			url: url+"/repos/"+user+"/"+repo+"/pages?access_token="+author,
			type: "get"
			//xml:true,
		}

		return http.ajax(json);
	}
	this.pages=function(_user, repo) {
		var user = _user||this.user;
		var author = this.author;
		var url = this.baseurl;
		var data = {
			"access_token": author,
		}
		var json = {
			url: url+"/repos/"+user+"/"+repo+"/pages/builds",
			head: {
				"Content-Type": "application/json"
			},
			type: "post",
			//xml:true,
			data: JSON.stringify(data)
		}

		return http.ajax(json);
	}

	this.getAllIssues=function(user, repo) {
		var user = user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		var user = user || user;
		var number = number == "" ? "" : "/" + number;
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues?access_token="+author
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text); //url,comments_url,number,title,body
			return json;
		});
	}
	this.getIssues=function(user, repo, number) {
		var user = user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		var number=number||"";
		number = number == "" ? "" : "/" + number;
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues/"+number+"?access_token="+author
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text); //url,comments_url,number,title,body
			return json;
		});
	}
	this.getIssue=function() {}
	this.deleteIssue=function() {}
	this.changeIssueState=function(_user, repo, issue, state) {
		var user = _user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		var data = {
			"access_token": author,
			"repo": repo,
			"state": state
		}
		var json = {
			url: url+"/repos/"+user+"/issues/"+issue,
			head: {
				"Content-Type": "application/json"
			},
			type: "PATCH",
			xml: true,
			data: JSON.stringify(data)
		}

		return http.ajax(json).then(function(re){
			alert(JSON.stringify(re))
			var status = re.xml.status;
			switch (status) {
				case 200:
					alert("写入成功");
					break;
				case 201:
					alert("创建成功");
					break;
				case 422:
					alert("false");
					break;
			}
			re = JSON.parse(re.html);
			return re;
		});
	}
	this.writeIssue=function(_user, repo, issue, title, body) {
		var user = _user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		var data = {
			"access_token": author,
			"repo": repo,
			"title": title,
			"body": body
		}
		var json = {
			url: url+"/repos/"+user+"/issues/"+issue,
			head: {
				"Content-Type": "application/json"
			},
			type: "PATCH",
			xml: true,
			data: JSON.stringify(data)
		}

		return http.ajax(json).then(function(re){
			alert(JSON.stringify(re))
			var status = re.xml.status;
			switch (status) {
				case 200:
					alert("写入成功");
					break;
				case 201:
					alert("创建成功");
					break;
				case 422:
					alert("false");
					break;
			}
			re = JSON.parse(re.html);
			return re;
		});
	}
	this.createIssue=function(_user, repo, title, body) {
		var user = _user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		var data = {
			"access_token": author,
			"repo": repo,
			"title": title,
			"body": body
		}
		var json = {
			"url": url+"/repos/"+user+"/issues",
			"head": {
				"Content-Type": "application/json"
			},
			"type": "post",
			"xml": true,
			"data": JSON.stringify(data)
		}

		return http.ajax(json).then(function(re){
			alert(JSON.stringify(re))
			var status = re.xml.status;
			switch (status) {
				case 200:
					alert("写入成功");
					break;
				case 201:
					alert("创建成功");
					break;
				case 422:
					alert("false");
					break;
			}
			re = JSON.parse(re.html);
			return re;
		});
	}

	this.getComments=function(user, repo, issue) {
		var user = user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		if (!user || !repo || !issue) return false;
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues/"+issue+"/comments?access_token="+author
		}
		return http.ajax(json).then(function(re){
			//alert(text)
			var json = JSON.parse(text); //url,html_url,issues_url,id,url.login,body
			return json
		});
	}
	this.getComment=function(user, repo, comment) {
		var user = user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		if (!user || !repo || !comment) return false;
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues/comments/"+comment+"?access_token="+author
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text); //url,html_url,issues_url,id,url.login,body
			return json
		});
	}
	this.deleteComment=function(user, repo, comment) {
		var user = user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		if (!user || !repo || !comment) return false;
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues/comments/"+comment+"?access_token="+author,
			"method": "delete",
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text); //url,html_url,issues_url,id,url.login,body
			return json
		});
	}
	this.writeComment=function(user, repo, comment, body) {
		var user = user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		if (!user || !repo || !comment) return false;
		var data = {
			"access_token": author,
			"body": body
		}
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues/comments/"+comment,
			"head": {
				"Content-Type": "application/json"
			},
			"data": JSON.stringify(data),
			"method": "PATCH",
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text); //url,html_url,issues_url,id,url.login,body
			return json
		});
	}
	this.createComment=function(user, repo, issue, body) {
		var user = user || this.user;
		var author = this.author;
		var url = this.baseurl;
		var repo = repo || this.repo;
		if (!user || !repo || !issue) return false;
		var data = {
			"access_token": author,
			"body": body
		}
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues/comments/"+comment,
			"head": {
				"Content-Type": "application/json"
			},
			"data": JSON.stringify(data),
			"method": "POST",
		}
		/* var json = {
			"url": url+"/repos/"+user+"/"+repo+"/issues/"+issue+"/comments?access_token="+author
		} */
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text); //url,html_url,issues_url,id,url.login,body
			return json
		});
	}

	this.getAllBranch=function(para) {
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			console.log(user, author, url)
			return Promise.resolve(false);
		}
		var repo = para.repo;
		if (!user || !repo) {
			return Promise.resolve(false);
		}

		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/branches?access_token="+author,
			"type": "get"
		}
		return http.ajax(json).then(function(text){
			var re = [];
			var json=text?JSON.parse(text):[];
			for (var i = 0; i < json.length; i++) {
				re.push(json[i].name);
			}
			return re
		});
	}
	this.createBranch=function(para) {
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		var repo = para.repo;
		var from_branch_name = para.from_branch_name;
		var branch_name = para.branch_name;
		if (!repo || !from_branch_name || !branch_name) {
			return Promise.resolve(false);
		}
		var data = {
			"access_token": author,
			"refs": from_branch_name || "master",
			"branch_name": branch_name,
		}
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/branches",
			head: {
				"Content-Type": "application/json"
			},
			"type": "post",
			data: JSON.stringify(data)
		}
		return http.ajax(json).then(function(text){
			var re = [];
			var json=text?JSON.parse(json):[];
			for (var i = 0; i < json.length; i++) {
				re.push(json[i].name);
			}
			return re
		});
	}
	this.deleteBranch=function(para) {
		//无效
		var user = para.user|| para.owner || this.user;
		var author = this.author;
		var url = this.baseurl;
		if (!user || !author || !url) {
			return Promise.resolve(false);
		}
		var repo = para.repo;
		var branche = para.branch;
		if ( !repo || !branch) {
			return Promise.resolve(false);
		}
		var data = {
			"access_token": author,
			"branches": "edit"
		}
		var json = {
			"url": url+"/repos/"+user+"/"+repo+"/git/refs/heads/"+branch+"?access_token="+author,
			"type": "delete"
		}
		return http.ajax(json).then(function(text){
			var re = [];
			var json=text?JSON.parse(json):[];
			for (var i = 0; i < json.length; i++) {
				re.push(json[i].name);
			}
			return re;
		});
	}

	this.getAllGists=function() {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		var json = {
			"url": url+"/gists?access_token="+author
		}
		return http.ajax(json).then(function(text){
			var arrs = text?JSON.parse(text):[];
			console.log(json)
			var re = [];
			for (var i = 0; i < arrs.length; i++) {
				var json = arrs[i];
				var arr = json.files;
				var id = json.id;
				for (var name in arr) {
					var data = {
						"name": name,
						"content": arr[name].content,
						"id": id
					}
					re.push(data);
				}
			}
			return re;
		});
	}
	this.getGists=function(id) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;

		var id = id;
		var json = {
			url: url+"/gists/"+id+"?access_token="+author
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text);
			console.log(json)
			var arr = json.files;
			console.log(arr)
			var re = [];
			for (var name in arr) {
				var data = {
					"name": name,
					"content": arr[name].content,
					"id": id
				}
				re.push(data);
			}
			return re;
		});
	}
	this.createGists=function(files) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;
		var data = {
			"access_token": author,
			"description": "add",
			"files": files,
			"public": false
		}
		var json = {
			"url": url+"/gists",
			"head": {
				"Content-Type": "application/json"
			},
			"type": "post",
			"data": JSON.stringify(data)
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text);
			var arr = json.files;
			var re = [];
			for (var name in arr) {
				var data = {
					"name": name,
					"content": arr[name].content,
					"id": json.id
				}
				re.push(data);
			}
			return re;
		});
	}
	this.writeGists=function(id, files) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;

		var id = id;

		var data = {
			"access_token": author,
			"description": "change",
			"files": files,
			"public": false
		}
		var json = {
			"url": url+"/gists/"+id,
			"head": {
				"Content-Type": "application/json"
			},
			"type": "PATCH",
			"data": JSON.stringify(data)
		}
		return http.ajax(json).then(function(text){
			var json = JSON.parse(text);
			var arr = json.files;
			console.log(json)
			var re = [];
			for (var name in arr) {
				var data = {
					"name": name,
					"content": arr[name].content,
					"id": id
				}
				re.push(data);
			}
			return re;
		});
	}
	this.deleteGists=function(id) {
		var user = this.user;
		var author = this.author;
		var url = this.baseurl;

		var id = id;
		var json = {
			url: url+"/gists/"+id+"?access_token="+author,
			type: "DELETE",
			xml: true
		}
		return http.ajax(json).then(function(re){
			var status = re.xml.status;
			switch (status) {
				case 200:
					alert("删除成功");
					delete this.shas[name];
					break;
				case 404:
					alert("没有文件");
					break;
				case 422:
					alert("参数错误");
					break;
			}
			console.log(text)
			return status;
		});
	}

	this.hasChange=function(time) {
		var url = "${url}/repos/docfeng/page";
		var json = {
			url: url,
			method: "head",
			xml: true,
			head: { //"If-Modified-Since": new Date().toUTCString()//"Sun, 11 Aug 2013 19:48:59 GMT"
			}
		}
		if (time) {
			json.head["If-Modified-Since"] = time.toUTCString();
		}
		var that=this;
		return http.ajax(json).then(function(re){
			//var h=re.xml.getAllResponseHeaders()
			if (re.xml.status == "304") {
				return [true, that.getLimit(re.xml)];
			} else {
				return [false, that.getLimit(re.xml)];
			}
		});
	}
	this.getLimit=function(xml) {
		return [xml.getResponseHeader("X-RateLimit-Remaining"),
			xml.getResponseHeader("X-RateLimit-Limit"),
			xml.getResponseHeader("X-RateLimit-Reset")
		];
	}
	this.download=function(name, url) {
		var anchor = document.createElement("a");
		if ('download' in anchor) {
			anchor.style.visibility = "hidden";
			anchor.href = url;
			anchor.download = name;
			document.body.appendChild(anchor);
			var evt = document.createEvent("MouseEvents");
			evt.initEvent("click", true, true);
			anchor.dispatchEvent(evt);
			document.body.removeChild(anchor);
		} else {
			window.open(url);
		}
	}
	this.downloadFile=function(name, user, repo, file, branch) {
		var url =url+"/"+user+"/"+repo+"/raw/"+branch+"/"+file;
		this.download(name, url);
	}
	this.downloadRepos=function(name, user, repo) {
		//var url="https://codeload.github.com/"+user+"/"+repo+"/legacy.zip/master";
		var url = "https://codeload.github.com/"+user+"/"+repo+"/zip/master";
		//downloadFile(name,url)
		window.open(url)
	}
	this.downloadBlob=function(value, type, name) {
		var blob;
		if (typeof window.Blob == "function") {
			blob = new Blob([value], {
				type: type
			});
		} else {
			var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
			var bb = new BlobBuilder();
			bb.append(value);
			blob = bb.getBlob(type);
		}
		var URL = window.URL || window.webkitURL;
		var bloburl = URL.createObjectURL(blob);

		var anchor = document.createElement("a");
		if ('download' in anchor) {
			anchor.style.visibility = "hidden";
			anchor.href = bloburl;
			anchor.download = name;
			document.body.appendChild(anchor);
			var evt = document.createEvent("MouseEvents");
			evt.initEvent("click", true, true);
			anchor.dispatchEvent(evt);
			document.body.removeChild(anchor);
		} else if (navigator.msSaveBlob) {
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
  alert(await git.deleteFile({"user":"docfeng",repo:"page","name":name,txt:"reghhhst"}))
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
