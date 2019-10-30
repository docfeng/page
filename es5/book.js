/**
 * es5
 * v 1.0
 * gitapi5.js
 * db5.js
 * store.js
 *
 * 
 * table:shelf book-{namme} 
 * shelf:name url creatAt readIndex readTitle readAt readURL updateIndex updateTitle updateAt updateURL || getAt putAt cammentId
 * book-{namme} title url getAt txt putAt 
 * 
 * issue{title:"shelf",body:"",id:0}
 * comment{body:shelf-item,id:0}
 * 
 * book{Shelf,List,Page,Search,Load,}
 * Shelf
 * 
 * List{get,put,read,write,multi,remote,format,update,changeSource}
 * get(name>issue-id)=>arr;
 * put(name>issue-id,arr)=>bool;
 * read(name)=>arr
 * write(name,arr)=>bool;
 * remote(url){format(html,url)}=>arr;
 * multi(name)
 * update
 * changeSource
 * 
 * Page
 * 
 * Search
 * 
 * Load,
 */

Book = (function() {
	var localModel="";
	store.getItem("localModel").then(function(url){
		if(url){
			localModel=url;
		}
	}).catch(function(e){
		alert("err:localModel:\n"+e)
	});
	var getHTML = function(url, para) {
		var URL = "";
		var xml=false;
		if(para=="real"){
			xml=true;
		}
		if(window.browser&&window.browser.MyApp){
			var url=url;
		}else if(localModel){
			URL=localModel;
			url=URL+"?url="+url;
		}else{
			switch (para) {
				case "search":
					URL = "https://bird.ioliu.cn/v1/";
					break;
				case "real":
				    xml=true;
					URL = "http://gear.docfeng.top/get2.php";
					break;
				case "list":
					URL = "https://bird.ioliu.cn/v2/";
					break;
				case "page":
					URL = "http://gear.docfeng.top/get2.php";//"https://bird.ioliu.cn/v2/";
					break;
				default:
					URL = "http://gear.docfeng.top/get2.php";
					break;
			}
			url=URL+"?url="+url;
		}
		
		//prompt("getHTML url",url)
		return http.get(url,{xml:xml}).then(function(html){
			var html=html;
			if(!localModel&&para=="search")html = eval(html);
			if(!html){
				return Promise.reject("err:getHTML:\nno html:+"+html+"\nurl:"+url+"\nURL:"+URL);
			}
			return html
		}).catch(function(e){
			return Promise.reject("err:getHTML:\n"+e);
		});
	}
	var isJSON = function(str) {
		if (typeof str == 'string') {
			try {
				var obj = JSON.parse(str);
				if (typeof obj == 'object' && obj) {
					return obj;
				} else {
					return false;
				}

			} catch (e) {
				console.log('error：' + str + '!!!' + e);
				return false;
			}
		}
	}
	var Shelf = {
		get: function(id) {

		},
		getAll: function() {
			return Git.Comment.get("docfeng", "book-data", 1).then(function(text) {
				var json = JSON.parse(text);
				var re = [];
				for (var i = 0; i < json.length; i++) {
					var item = isJSON(json[0].body);
					if (item) {
						item.updated_at = json[0].updated_at;
						re.push(item)
					} else {
						Git.Comment.del("docfeng", "book-data", json[0].id);
					}
				}
				return re;
			});
		},
		put: function(json) {
			var id = json.id;
			if (!id) {
				return this.add(json);
			}
			var txt = JSON.stringify(json);
			return Git.Comment.put("docfeng", "book-data", id, txt).then(function(text) {
				return true;
			});
		},
		putAll: function(arr) {
			var id = arr.id;

		},
		readAll: function() {
			var t=this;
			return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
				DB.DB.close();
				var json = json.reverse();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.ini().then(function() {
					return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
						DB.DB.close();
						return json;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.readAll:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		read: function(name) {
			var t = this;
			return DB.Data.getKey("book", "shelf", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.ini().then(function() {
					return DB.Data.getKey("book", "shelf", name).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		writeAll: function(json) {
			var t = this;
			return DB.Table.select("book", "shelf").catch(function(e) {
				DB.DB.close();
				return t.ini();
			}).then(function() {
				var re = [];
				for (var i = 0; i < json.length; i++) {
					var obj = json[i];
					re.push(DB.Data.put("book", "shelf", obj));
				}
				return Promise.all(re);
			}).then(function(re) {
				return true;
			});
		},
		write: function(json) {
			var t = this;
			return DB.Data.put("book", "shelf", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				DB.DB.close();
				return t.ini().then(function() {
					return DB.Data.put("book", "shelf", json).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List" + e)
						return false
					});
				});
			});
		},
		getId: function() {
			return Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
				var json = JSON.parse(text)
				var id = json.id;
				return id;
			});
		},
		add: function(arr) {
			return this.getId().then(function(id) {
				arr.id = id;
				return this.put(arr);
			});
		},
		delete: function(key) {
			return DB.Data.delete("book", "shelf", key).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return Promise.reject(e);
			});
		},
		createShelfTable: function() {
			var data = {
				key: "name",
				index: {
					name: true,
					url: false,
					id: false,
					state: false,
					updated_at: false,
					created_at: false,
					changed_at: false,
					creatAt: false,
					readIndex: false,
					readTitle: false,
					readAt: false,
					readURL: false,
					updateIndex: false,
					updateTitle: false,
					updateAt: false,
					updateURL: false
				}
			};
			return DB.Table.create("book", "shelf", data);
		},
		createListTable: function() {
			var data = {
				key: "name",
				index: {
					name: true,
					arr: false
				}
			};
			return DB.Table.create("book", "list", data);
		},
		createPageTable: function() {
			var data = {
				key: "full_name",
				index: {
					full_name: true,
					name: false,
					title: false,
					txt: false,
					url: false,
					name: false,
					updated_at: false,
				}
			};
			return DB.Table.create("book", "page", data);
		},
		ini: function() {
			alert("开始创建表格");
			return Promise.all([this.createShelfTable(), this.createListTable(), this.createPageTable()]);
		},
		putModel:function(){
			var t=this;
			this.readModel().then(function(re){
				if(re){
					return Git.File.put("docfeng","book-data","config/corsUrl.txt",re)
				}else{
					return false;
				}
			}).then(function(re){
				alert("Book.Shelf.putModel"+re);
			}).catch(function(e){
				alert("err:Book.Shelf.putModel\n"+e)
			})
		},
		getModel:function(){
			var t=this;
			return Git.File.get("docfeng","book-data","config/corsUrl.txt").then(function(re){
				var re=re;
				if(!re){
					re=[
						"http://gear.docfeng.top/get2.php",
						"http://gear2.docfeng.top/get2.php",
						"http://192.168.123.128/get2.php",
						"http://192.168.123.92:8080/get2.php",
					];
					return re;
				}else{
					return JSON.parse(re);
				}
			}).then(function(re){
				alert(re)
				t.writeModel(re)
			});
		},
		writeModel:function(re){
			var re=JSON.stringify(re);
			store.setItem('localModels',re);
		},
		readModel:function(){
			return store.getItem('localModels');
		},
		
		setModel:function(url){
			var t=this;
			if(confirm(url)){
				localModel=url;
				store.setItem('localModel',url);
				this.readModel().then(function(re){
					var re=JSON.parse(re);
					var b=false
					for (var i = 0; i < re.length; i++) {
						if(re[i]==url)b=true;
					}
					if(!b){
						re.push(url);
						t.writeModel(re);
					}
				});
				//alert(localModel)
			}
		},
		alertModel:function(){
			prompt("localModel",localModel)
		},
		selectModel:function(){
			var t=this;
			this.readModel().then(function(re){
				var re=JSON.parse(re);
				fj.select("model",re)
				.then(function(a){
					if(a){
						t.setModel(a);
					}
					
				})
			}).catch(function(e){
				alert(e)
			})		
		}
	}

	var List = {
		get: function(id) {

		},
		getAll: function() {
			return Git.Comment.get("docfeng", "book-data", 1).then(function(text) {
				var json = JSON.parse(text);
				var re = [];
				for (var i = 0; i < json.length; i++) {
					var item = isJSON(json[0].body);
					if (item) {
						item.updated_at = json[0].updated_at;
						re.push(item)
					} else {
						Git.Comment.del("docfeng", "book-data", json[0].id);
					}
				}
				return re;
			});
		},
		put: function(json) {
			var id = json.id;
			if (!id) {
				return this.add(json);
			}
			var txt = JSON.stringify(json);
			return Git.Comment.put("docfeng", "book-data", id, txt).then(function(text) {
				return true;
			});
		},
		puAll: function(arr) {

		},
		read: function(name) {
			var t = this;
			return DB.Data.getKey("book", "list", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getKey("book", "list", name).then(function(bool) {
						DB.DB.close();
						if (bool) {
							return bool;
						} else {
							return false;
						}
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		readAll: function() {
			return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
				DB.DB.close();
				var json = json.reverse();
				return json;
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.readAll:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		write: function(json) {
			var t = this;
			return DB.Data.put("book", "list", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				//alert(JSON.stringify(e))
				console.log(e)
				console.log(e.srcElement.error.message)
				DB.DB.close();
				return DB.Table.has("book", "list").then(function(foo1){
					
					return false;
				}).catch(function(e){
					return t.createTable().then(function() {
						return DB.Data.put("book", "list", json).then(function(json) {
							DB.DB.close();
							return true;
						}).catch(function(e) {
							DB.DB.close();
							alert("Book.List" + e)
							return false
						});
					});
				})
			});
		},
		writeAll: function(json) {
			var t = this;
			return DB.Table.select("book", "shelf").catch(function(e) {
				DB.DB.close();
				return t.createTable();
			}).then(function() {
				var re = [];
				for (var i = 0; i < json.length; i++) {
					var obj = json[i];
					re.push(DB.Data.put("book", "shelf", obj));
				}
				return Promise.all(re);
			}).then(function(re) {
				return true;
			});
		},
		add: function(arr) {
			return this.getId().then(function(id) {
				arr.id = id;
				return this.put(arr);
			});
		},
		delete: function(key) {
			return DB.Data.delete("store", "shelf", key).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return Promise.reject(e);
			});
		},
		remote: function(url) {
			var t = this;
			return getHTML(url, "list").then(function(html) {
				if (!html){
					return Promise.reject("Book.List.remote:error no html");
				}else{
					return t.format(html, url);
				}
				/* if(localModel){
					return t.format(html, url);
				}else{
					var charset = html.match(/charset=([^"]+)"/);
					charset = charset && charset[1].toLowerCase();
					switch (charset) {
						case "gbk":
						case "gb2312":
							return Promise.reject("error charset:" + charset)
							break;
						case "utf-8":
							return t.format(html, url);
							break;
						default:
							//return List.format(html,url);
							return Promise.reject("error charset:" + charset);
					}
				} */
			});
		},
		format1: function(html, url) {
			var html=html.replace(/<img.*?>/g,"");
			var ele = document.createElement("html");
			ele.innerHTML = html;
			var b = document.createElement("base");
			b.href = url.getBaseUrl();
			document.head.appendChild(b);
			var a = [];
			var ul = ele.querySelectorAll("ul");
			for (var i = 0; i < ul.length; i++) {
				var _a = ul[i].querySelectorAll("a");
				if (_a.length > a.length) {
					a = _a;
				}
			}
			var ul = ele.querySelectorAll("dl");
			for (var i = 0; i < ul.length; i++) {
				var _a = ul[i].querySelectorAll("a");
				if (_a.length > a.length) {
					a = _a;
				}
			}
			var re = [];
			for (var i1 = 0; i1 < a.length; i1++) {
				re.push([a[i1].href, a[i1].innerHTML])
			}
			document.head.removeChild(b);
			if (re.length > 0) {
				return re;
			} else {
				return Promise.reject("err list.format: no re");
			}
		},
		format2:function(html,url){
			var t=this;
		    var html=html;
		    var url=url;
			if(!html||!url)return Promise.reject("err:list.format:参数错误\nurl="+url+"\nhtml"+html);
		    var arr=[];
		    var format=function(html){
		        var reg_di=new RegExp("<a[^>]*?href[ ]?=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<","g");
		        var arr=html.matches(reg_di);
		        for(var i=0;i<arr.length;i++){
		            arr[i][0]=arr[i][0].getFullUrl(url);
		        }
		        //下一页地址
		        var reg=/<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
		        var nexturl=html.match(reg);
		        if(nexturl){
		           nexturl=nexturl[1].getFullUrl(url);
		        }
				if(arr.length>0){
					return Promise.resolve({arr:arr,url:nexturl});
				}else{
					return Promise.reject("err:list.format-format:arr.length=0");
				}
		    }
		    fj.tip("开始获取html");
		    return format(html).then(function(json){
		    	var arr=json.arr;
				//alert("开始分析json:arr:%s\nnexturl:%s".fill(arr,url));
				return arr;
		    }); 
		},
		format:function(html,url){
			var t=this;
		    var html=html;
		    var url=url;
			if(!html||!url)return Promise.reject("err:list.format:参数错误\nurl="+url+"\nhtml"+html);
		    var arr=[];
		    var format=function(html){
		        var reg_di=new RegExp("<a[^>]*?href[ ]?=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<","g");
		        var reg_dl=new RegExp("<dl[^>]*?>([\\s\\S]*?)<\/dl>","g");
				var arr=html.match(reg_dl);
				if(arr){
					arr=arr[0].matches(reg_di);
					for(var i=0;i<arr.length;i++){
					    arr[i][0]=arr[i][0].getFullUrl(url);
					}
				}
				
				if(!arr||arr.length==0){
					alert("Book.List.format:html没有dl\n"+html)
					arr=html.matches(reg_di);
					for(var i=0;i<arr.length;i++){
					    arr[i][0]=arr[i][0].getFullUrl(url);
					}
				}
		        //下一页地址
		        var reg=/<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
		        var nexturl=html.match(reg);
		        if(nexturl){
		           nexturl=nexturl[1].getFullUrl(url);
		        }
				return arr;//{arr:arr,url:nexturl};
		    }
		    fj.tip("开始获取html");
		    return format(html);
		},
		getId: function() {
			return Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
				var json = JSON.parse(text)
				var id = json.id;
				return id;
			});
		},
		createTable: function() {
			alert("开始List创建表格");
			var data = {
				key: "name",
				index: {
					name: true,
					arr: false
				}
			};
			return DB.Table.create("book", "list", data);
		}

	}

	var Page = {
		multi: function(name,url) {
			var t = this;
			//alert(url)
			return t.read(name,url).then(function(txt) {
				if(txt){
					return txt.txt;
				}else{
					return Promise.reject("no");;
				}
			}).catch(function() {
				return t.remote(url).then(function(txt) {
					if(txt){
						return txt;
					}else{
						return Promise.reject("Page.mult:\n txt:"+txt);;
					}
					
				});
			});
		},
		remote: function(url) {
			var t = this;
			return getHTML(url, "page").then(function(html) {
				if (html) {
					return t.format(html, url).then(function(txt) {
						if(!txt){
							return Promise.reject("Page.format:没有获取到txt\n"+txt);
						}else{
							return txt;
						}
					}).catch(function(e) {
						return Promise.reject("Page.format:\nerr:"+e);
					});
				} else {
					return Promise.reject("Page.remote:没有获取到HTML\n"+html);
				}
			});
		},
		read: function(name,url) {
			var name = name + url;
			var t = this;
			return DB.Data.getKey("book", "page", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getKey("book", "page", name).then(function(re) {
						DB.DB.close();
						if (re) {
							return re;
						} else {
							return false;
						}
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.page.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		write: function(name, title, url, txt) {
			var t = this;
			var full_name = name + url;
			var json = {
				full_name: full_name,
				name: name,
				title: title,
				txt: txt,
				url: url,
				updated_at: formatDate(new Date())
			}
			return DB.Data.put("book", "page", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.put("book", "page", json).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List" + e)
						return false
					});
				});
			});
		},
		formatUI: function(txt) {
			var txt = "<p>" + txt.replace(/\n/g, '</p>\n<p>') + "</p>"
			//document.querySelector("#txt").innerHTML = txt;
			return Promise.resolve(txt);
		},
		createTable: function() {
			var data = {
				key: "full_name",
				index: {
					full_name: true,
					name: false,
					title: false,
					txt: false,
					url: false,
					updated_at: false
				}
			};
			return DB.Table.create("book", "page", data);
		},
		format: function(html, url) {
			var t = this;
			var txt = "";
			var html = html.replace(/(<br[^>]*?>[ \s]*){1,}/g, '\n');
			html = html.replace(/(<p>)/g, '');
			html = html.replace(/(<\/p>)/g, '\n');
			html = html.replace(/&nbsp;/g, ' ');
			//匹配正文
			var atxt = html.match(/>([^<]{300,})</g);
			atxt = atxt ? atxt : "";
			for (var i = 0; i < atxt.length; i++) {
				var elen = atxt[i].match(/[A-Za-z]/g);
				if (!elen || elen.length / atxt[i].length < 0.06) {
					txt = atxt[i];
					txt = txt.match(/>([^<]{100,})</)
				}
			}
			txt = txt ? txt[1] : "";
			if(!txt)return Promise.reject("没有txt;\nurl="+url+"\nhtml=\n"+html);
			return Promise.resolve(txt);
			/* //匹配下一章地址
			var reg = /<a[^>]*?href="([^"]*?)"[^>]*?>下[^<]*?</;
			var nexturl = html.match(reg);
			nexturl = nexturl ? nexturl[1] : "";
			nexturl = nexturl.getFullUrl(url);
			return new Promise(function(result, reject) {
				//是否有分章
				if (nexturl.indexOf("_") > nexturl.length - 8) {
					getHTML(nexturl).then(function(html) {
						this.format(html, url).then(function(_txt) {
							txt += _txt;
							result(txt);
						});
					});
				} else {
					result(txt);
				}
			}); */
		}
	}
	var Search = {
		multi: function(name) {
			var t = this;
			return t.read(name).then(function(json) {
				if(json&&json.arr){
					return json.arr;
				}else{
					return Promise.reject("book.search.read:no json:"+json);;
				}
			}).catch(function() {
				return t.remote(name).then(function(arr) {
					if(arr){
						return arr;
					}else{
						return Promise.reject("book.search.remote:no arr"+arr);;
					}
				});
			});
		},
		remote: function(name) {
			var t=this;
			var url = "https://www.baidu.com/s?q1=" + name + "&rn=10";
			return getHTML(url, "search").then(function(html) {
				fj.tip("已获取到数据，开始格式化")
				//alert(html)
				return t.format(html);
			}).catch(function(e){
				return Promise.reject("err:book.search.remote:\n"+e);
			})
		},
		read: function(name) {
			var t = this;
			return DB.Data.getKey("book", "search", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getKey("book", "search", name).then(function(re) {
						DB.DB.close();
						if (re) {
							return re;
						} else {
							return false;
						}
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.search.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		write: function(name, arr) {
			var t = this;
			var json = {
				name: name,
				arr : arr
			}
			return DB.Data.put("book", "search", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.put("book", "search", json).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.Search" + e)
						return false
					});
				});
			});
		},
		formatUI: function(arr) {
			var txt="";
			return Promise.resolve(txt);
		},
		format: function(html) {
			if(!html){
				return Promise.reject("book.search.format:no html:\n"+html);
			}
			fj.tip("开始格式化")
			var t=this;
			var html=html.replace(/<img.*?>/g,"");
			var h = document.createElement("html");
			h.innerHTML = html;
			var d = h.getElementsByTagName("div");
			var re = [];
			for (var i = 0; i < d.length; i++) {
				if (d[i].id >= 1) {
					var a = d[i].querySelector("a");
					re.push([a.href, a.innerHTML])
				}
			}
			if(re.length==0){
				fj.tip("格式化成功")
				return Promise.reject("book.search.format:no arr:\n"+JSON.stringify(re,null,4));
			}
			fj.tip("格式化失败")
			return Promise.resolve(re);;
		},
		formatAll:function(arr){
			var p=[];
			var t=this;
			for (var i = 0; i < arr.length; i++) {
					var url=arr[i][0];
					p.push(this.checkCharset(url));
			}
			return Promise.all(p).then(function(a) {
				var r = [];
				var p=[];
				for (var i =0;i< a.length; i++) {
					if(a[i]){
						r.push(re[i]);
						p.push(t.getRealPath(arr[i][0],arr[i][1]))
					}
				}
				return Promise.all(p);
			}).catch(function(a) {
				alert("err:book.search.formatAll:\n"+a)
				return Promise.reject("err:book.search.formatAll:\n"+a);
			});
		},
		checkCharset: function(url) {
			return List.remote(url).then(function(a) {
				if (a) {
					return true;
				} else {
					return false;
				}
			}).catch(function(a) {
				alert("err:book.search.checkCharset:\n"+a)
				return Promise.reject("err:book.search.checkCharset:\n"+a);
			});
		},
		getRealPath: function(url,title) {
			var t=this;
			return getHTML(url, "real").then(function(json) {
				var url = json.xml.getResponseHeader("url");
				if(title){
					return [url,title];
				}else{
					var arr=List.format(json.html,url);
					return [url,arr];
				}
			}).catch(function(a) {
				return Promise.resolve("book.search.getRealPath:\n"+a);;
			});
		},
		createTable: function() {
			var data = {
				key: "name",
				index: {
					name: true,
					arr:false
				}
			};
			return DB.Table.create("book", "search", data);
		}
		
	}
	var download = {

	}
	return {
		"Shelf": Shelf,
		"List": List,
		"Page": Page,
		"Search": Search,
		"download": download
	};
})();

String.prototype.fill = function(arr) {
	var str = this
	for (var i = 0; i < arr.length; i++) {
		str = str.replace("%s", arr[i]);
	}
	return str;
}


var tttt = function() {
	Book.Search.get("唐残").then(function(arr) {
		var re = arr[1];
		//alert(re)
		var arr2 = arr[0];
		var re1 = [];
		for (var i = 0; i < re.length; i++) {
			if (re[i]) {
				var b = arr2[i];
				b.push(re[i]);
				re1.push(b)
			}
		}
		alert(JSON.stringify(re1, null, 4))
		return re1
	}).then(function(a) {
		var url = a[0][0];
		Book.Search.getRealPath(url).then(function(url) {
			return Book.list.get(url)
				.then(function(arr) {
					var url = arr[0][0];
					return Book.page.get(url)
				}).then(function(txt) {
					alert(txt)
				}).catch(function(e) {

				});
			alert(e);
		})
	}).catch(function(a) {
		alert(a)
	});


	Book.List.getAll().then(function(re) {
		alert(re)
	}).catch(function(e) {
		alert(e)
	});

	Book.List.readAll().then(function(re) {
		alert(re)
		alert(JSON.stringify(re))
	}).catch(function(e) {
		alert(e)
	});
}
