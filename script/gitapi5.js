/**
 * es5
 * v1.0
 * 
 * User{ini,get,set,login,logout}
 * ini()=>users||err;
 * get(name)=>auther||err;
 * set(name,psw)=>author
 * login(name,psw)=>author
 * logout(name)
 * 
 * Repos(getAll,get,creat,del)
 * getAll(user)=>[item];item:{id,node_id,name,full_name,private,owner{login,id,...},...}
 * getAll2(user)=>[item];item:{}
 * get(user,repos)=>item;
 * creat()
 * del()
 * 
 * Issue{get,getAll,del,put,create,read,write}
 * get(user, repos, number)=>json
 * getAll(user, repos, number)=>[json];
 */

Git = (function() {
	var ajax = function(user, type, url, xml, data) {
		return User.get(user).then(function(author) {
			var json = {
				url: url,
				method: type,
				str: data && JSON.stringify(data),
				xml: xml,
				head: {
					Authorization: author
				}
			}
			alert(JSON.stringify(json))
			return http.ajax(json);
		});
	}
	var formatDate = function(d) {
		var date = d || new Date()
		var yyyy = date.getFullYear();
		var mm = date.getMonth() + 1;
		var dd = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		hours == hours < 10 ? "0" + hours : hours;
		minute == minute < 10 ? "0" + minute : minute;
		second == second < 10 ? "0" + second : second;
		date = yyyy + "-" + mm + "-" + dd + "T" + hours + ":" + minute + ":" + second;
		return date;
	}
	var formatUTCDate = function(d) {
		var date = d || new Date()
		var yyyy = date.getUTCFullYear();
		var mm = date.getUTCMonth() + 1;
		var dd = date.getUTCDate();
		var hours = date.getUTCHours();
		var minute = date.getUTCMinutes();
		var second = date.getUTCSeconds();
		date = yyyy + "-" + mm + "-" + dd + "T" + hours + ":" + minute + ":" + second + "Z";
		return date;
	}
	var User = {
		ini: (function() {
			var users = {};
			return function() {
				if (Object.keys(users).length == 0) {
					return store.getItem("users").then(function(_users) {
						if (_users) {
							users = JSON.parse(_users);
							return users;
						} else {
							return Promise.reject("err:uesr.ini() no cash");
						}
					})
				} else {
					return Promise.resolve(users);
				}
			}
		})(),
		get: function(name) {
			if (!name) return Promise.reject("err: user.get(name) \n no name");
			return this.ini().then(function(users) {
				if (users[name]) {
					var author = users[name];
					return author;
				} else {
					return Promise.reject("err: user.get(name) \n no users[name]");
				}
			});
		},
		set: function(name, psw) {
			var author = "Basic " + btoa(name + ":" + psw);
			this.ini().then(function() {
				users[name] = author;
				alert(JSON.stringify(users));
				return true;
			}).then(function() {
				store.setItem("users", JSON.stringify(users));
				return author;
			});
		},
		login: function(name, psw) {
			var name = name || prompt("用户名", "docfeng");
			var psw = psw || prompt("密码:" + name);
			return this.set(name.psw);
		},
		logout: function(name) {
			delete users[name];
			return store.setItem("users", JSON.stringify(users));
		}
	}

	var Repos = {
		//获取公开repos
		getAll2: function(user) {
			var url = "https://api.github.com/users/%s/repos".fill([user]);
			return ajax(user, "get", url);
		},
		//获取全部repos
		getAll: function(user) {
			var url = "https://api.github.com/user/repos";
			return ajax(user, "get", url);
		},
		get: function(user, repos) {
			var url = "https://api.github.com/repos/%s/%s".fill([user, repos]);
			return ajax(user, "get", url);
		},
		create: function() {

		},
		del: function() {

		}
	}

	var Dir = {
		getUserList: function() {
			var dir = [];
			for (var i in users) {
				dir[dir.length] = i;
			}
			return dir;
		},
		getReposList: function(user) {
			return Repos.getAll(user).then(function(repo) {
				var repo = JSON.parse(repo);
				var dir = [];
				for (var i = 0; i < repo.length; i++) {
					dir.push(repo[i].name);
				}
				return dir;
			});
		},
		getFileList: function(user, repos, file) {
			return File.getList(user, repos, file).then(function(repo) {
				//alert(JSON.stringify(repo,null,4))
				var re = {};
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
		},
		get: function(user, repos, name) {
			var name = name || "";
			if (!user) {
				return this.getUserList()
			}
			if (!repos) {

			} else {

			}
		}
	}
	var shas = {};
	var File = {
		getsha: function(user, repos, file) {
			if (Object.keys(shas).length == 0) {
				return this.getList(user, repos, file).then(function() {
					return true;
				});
			}
			return false;
		},
		getList: function(user, repos, path) {
			var path = path || "";
			var url = "https://api.github.com/repos/%s/%s/contents/%s".fill([user, repos, path]);
			return ajax(user, "get", url).then(function(text) {
				var re = JSON.parse(text);
				for (var i = 0; i < re.length; i++) {
					if (re[i].type == "file") {
						shas[re[i].path] = re[i].sha;
					}
				}
				return re;
			});
		},

		get: function(user, repos, file, branch) {
			var branch = branch || "master";
			var url = "https://api.github.com/repos/%s/%s/contents/%s?ref=%s".fill([user, repos, file,branch]);
			return ajax(user, "get", url).then(function(text) {
				var json = JSON.parse(text);
				var re = "";
				if (json.content) {
					var re = window.atob(json.content);
					re = decodeURIComponent(escape(re));
				}
				if (json.sha) {
					shas[json.path] = json.sha;
				}
				return re;
			});
		},
		create: function(user, repos, file, txt, message, branch) {
			var branch = branch || "master";
			var url = "https://api.github.com/repos/%s/%s/contents/%s".fill([user, repos, file, branch]);
			var sha = shas[file];
			var data = {
				"message": message || "add" + file,
				"content": window.btoa(unescape(encodeURIComponent(txt))),
				"sha": sha,
				"branch": branch
			}
			return ajax(user, "put", url, true, data).then(function(re) {
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
				var json = JSON.parse(re.html);
				var re = "";
				if (json.content) {
					re = json.content.sha;
					shas[name] = re;
				}
				return re;
			});
		},
		put: function(user, repos, file, txt, message, branch) {
			return this.create(user, repos, file, txt, message, branch);
		},
		del: function(user, repos, file, message, branch) {
			//status:200 true;404 false;422参数错误
			var branch = branch || "master";
			var url = "https://api.github.com/repos/%s/%s/contents/%s".fill([user, repos, file, message, branch]);
			var sha = shas[file];
			if (!sha) {
				return Promise.reject("不存在文件sha");
			}
			var data = {
				"message": message || "delete " + file,
				"sha": sha,
				"branch": branch
			}
			return ajax(user, "DELETE", url, true, data).then(function(re) {
				var status = re.xml.status;
				switch (status) {
					case 200:
						alert("删除成功");
						delete shas[name];
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
		}
	}

	var Issue = {
		getAll: function(user, repos, number) {
			var number = number ? "/" + number : "";
			var url = "https://api.github.com/repos/%s/%s/issues%s".fill([user, repos, number]);
			return ajax(user, "get", url);
		},
		get: function(user, repos, number) {
			return this.getAll(user, repos, number);
		},
		del: function(number) {

		},
		put: function(user, repos, number, title, body, labels, state) {
			var url = "https://api.github.com/repos/%s/%s/issues/%s".fill([user, repos, number]);
			var data = {
				"title": title,
				"body": body,
				"labels": labels
			}
			return ajax(user, "PATCH", url, false, data);
		},
		create: function(user, repos, title, body, labels) {
			var url = "https://api.github.com/repos/%s/%s/issues".fill([user, repos]);
			var data = {
				"title": title,
				"body": body,
				"labels": labels
			}
			return ajax(user, "post", url, false, data);
		},
		checkChange: function(user, repos, number, time) {
			var url = "https://api.github.com/repos/%s/%s/issues/%s".fill([user, repos, number]);
			return checkChange(user, url, time);
		}
	}

	var Comment = {
		gets: function(user, repos, issue) {
			if (!user || !repos || !issue) return false;
			var url = "https://api.github.com/repos/%s/%s/issues/%s/comments".fill([user, repos, issue]);
			return ajax(user, "get", url);
		},
		get: function(user, repos, number) {
			if (!user || !repos || !number) return false;
			var url = "https://api.github.com/repos/%s/%s/issues/comments/%s".fill([user, repos, number]);
			return ajax(user, "get", url);
		},
		del: function(user, repos, number) {
			if (!user || !repos || !number) return false;
			var url = "https://api.github.com/repos/%s/%s/issues/comments/%s".fill([user, repos, number]);
			return ajax(user, "DELETE", url, true).then(function(re) {
				//204成功
				var status = re.xml.status;
				switch (status) {
					case 204:
						alert("删除成功");
						return true;
						break;
					default:
						alert("删除失败");
						return Promise.reject(false);
				}
			});;
		},
		put: function(user, repos, number, str) {
			if (!user || !repos || !number) return false;
			var url = "https://api.github.com/repos/%s/%s/issues/comments/%s".fill([user, repos, number]);
			var data = {
				"body": str
			}
			return ajax(user, "PATCH", url, false, data);
		},
		create: function(user, repos, issues, str) {
			if (!user || !repos || !issues) return Promise.reject(false);
			var url = "https://api.github.com/repos/%s/%s/issues/%s/comments".fill([user, repos, issues]);
			var data = {
				"body": str
			}
			return ajax(user, "post", url, false, data);
		},
		getSince: function(user, repos, issues, time) {
			if (!user || !repos || !issues || !time) return Promise.reject(false);
			var time = formatUTCDate(time);
			var url = "https://api.github.com/repos/%s/%s/issues/%s/comments?since=%s".fill([user, repos, issues,time]);
			return ajax(user, "get", url);
		}
	}

	var checkChange = function(user, url, time) {
		return User.get(user).then(function(author) {
			alert(author)
			var json = {
				url: url,
				method: "head",
				xml: true,
				head: {
					Authorization: author
					//"If-Modified-Since": new Date().toUTCString()//"Sun, 11 Aug 2013 19:48:59 GMT"
				},
			}
			if (time) {
				json.head["If-Modified-Since"] = time.toUTCString();
			}
			return http.ajax(json).then(function(re) {
				alert(re.xml.status)
				alert(re.html)
				alert(re.xml.getAllResponseHeaders())
				getLimit(re).then(function(re) {
					alert(re);
				});
				if (re.xml.status == "304") {
					return true;
				} else {
					return false;
				}
			});
		});
	}
	var getLimit = function(re) {
		if (re) {
			return Promise.resolve([re.xml.getResponseHeader("X-RateLimit-Remaining"),
				re.xml.getResponseHeader("X-RateLimit-Limit"),
				re.xml.getResponseHeader("X-RateLimit-Reset")
			]);
		} else {
			var json = {
				url: "https://api.github.com/rate_limit",
				method: "head",
				xml: true
			}
			return http.ajax(json).then(function(re) {
				return Promise.resolve([re.xml.getResponseHeader("X-RateLimit-Remaining"),
					re.xml.getResponseHeader("X-RateLimit-Limit"),
					re.xml.getResponseHeader("X-RateLimit-Reset")
				]);
			});
		}
	}
	var load = {
		download: function(name, url) {
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
		},
		downloadFile: function(name, user, repos, file) {
			var url = "https://raw.githubusercontent.com/" + user + "/" + repos + "/master/" + file;
			this.download(name, url);
		},
		downloadRepos: function(name, user, repos) {
			//var url=`https://codeload.github.com/${user}/${repos}/legacy.zip/master`;
			var url = "https://codeload.github.com/" + user + "/" + repos + "/zip/master/";
			//downloadFile(name,url)
			window.open(url)
		},
		downloadBlob: function(value, type, name) {
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
	var gitapi = {
		User: User,
		Repos: Repos,
		Dir: Dir,
		Issue,
		Comment,
		File,
		load: load
	}
	return gitapi;
})()

String.prototype.fill = function(arr) {
	var str = this
	for (var i = 0; i < arr.length; i++) {
		str = str.replace("%s", arr[i]);
	}
	return str;
}

var tttt = function() {
	Git.Repos.getAll("docfeng").then(function(html) {
		alert(html)
	}).catch(function(e) {
		alert(e)
	});
	Git.Repos.get("docfeng", "book-data").then(function(html) {
		alert(html)
	})


	Git.File.create("docfeng", "book-data", "book/test/page1.txt", "test").then(function(author) {
		alert(author)
	});
	Git.File.getList("docfeng", "book-data").then(function(json) {
		prompt("", json[0].sha)
		alert(JSON.stringify(json))
	});

	Git.File.getList("docfeng", "book-data", "book/").then(function(json) {
		prompt("", json[0].sha)
		alert(JSON.stringify(json))
	});
	Git.File.get("docfeng", "book-data", "book/test/page1.txt").then(function(txt) {
		alert(txt)
	});
	Git.File.put("docfeng", "book-data", "book/test/page1.txt", "test2").then(function(author) {
		alert(author)
	})
	Git.File.del("docfeng", "book-data", "book/test/page1.txt").then(function(author) {
		alert(author)
	})

	Git.Issue.create("docfeng", "book-data", "shelf", "test", ["shelf"]).then(function(text) {
		alert(text)
		//alert(JSON.stringify(json))
	});
	Git.Issue.getAll("docfeng", "book-data").then(function(text) {
		alert(text)
	});
	Git.Issue.get("docfeng", "book-data", 1).then(function(text) {
		var json = JSON.parse(text);
		alert(json.body)
		alert(json.updated_at)
		alert(json.created_at)
		alert(JSON.stringify(json))
	});
	Git.Issue.put("docfeng", "book-data", 1, "shelf", "test22222", ["shelf"]).then(function(json) {
		alert(json)
	});
	var d = new Date("2019-07-23 17:16:00");
	Git.Issue.checkChange("docfeng", "book-data", 1, d).then(function(json) {
		alert(json)
	})

	Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		prompt(json.id)
		//alert(JSON.stringify(json))
	});
	Git.Comment.put("docfeng", "book-data", 514108986, "test1111").then(function(text) {
		alert(text)
		//alert(JSON.stringify(json))
	});
	Git.Comment.gets("docfeng", "book-data", 1).then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		json = json[0];
		prompt(json.id)
		alert(json.body)
		alert(json.updated_at)
		prompt("", json.updated_at)
		alert(json.created_at)
	});
	Git.Comment.get("docfeng", "book-data", 1).then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		json = json[0];
		prompt(json.id)
		alert(json.body)
		alert(json.updated_at)
		prompt("", json.updated_at)
		alert(json.created_at)
	});
	Git.Comment.del("docfeng", "book-data", 514119799).then(function(re) {
		window.re = re;
		alert(re.xml.statue)
		//alert(JSON.stringify(json))
	});
	Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		var id = json.id;
		alert(id)
		Git.Comment.del("docfeng", "book-data", id).then(function(re) {
			alert(re)
		});
	});
	var d = new Date("2019-07-23T17:23:10");
	Git.Comment.getSince("docfeng", "book-data", 1, d).then(function(re) {
		alert(re)
		var json = JSON.parse(re);
		for (var i = 0; i < json.length; i++) {
			alert(new Date(json[i].updated_at))
		}
	}).catch(function(e) {
		alert(e)
	});
}
