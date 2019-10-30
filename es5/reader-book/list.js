
List = (function(a) {
	var _List = Book.List;
	var Arr, Json;
	var List = {
		get: function(name) {
			return _List.get(name);
		},
		getAll: function() {
			return _List.getAll();
		},
		read: function(name) {
			var t=this;
			return _List.read(name).then(function(json) {
				//alert(json.val.length)
				if (json&&json.val) {
					if(json.val.length==300){
						return t.read(name+""+1).then(function(re){
							return json.val.concat(re)
						});
					}
					return json.val;
				} else {
					return false
				}
			});
		},
		readAll: function() {
			return _List.readAll();
		},
		write: function(name, arr) {
			var arr1;
			var t=this;
			if(arr.length>300){
				arr1=arr.splice(300,arr.length-1);
			}
			//alert(arr.length);
			//alert(JSON.stringify(arr1,null,4))
			var json = {
				"name": name,
				"val": arr
			};
			return _List.write(json).then(function(re){
				if(arr1){
					return t.write(name+""+1,arr1);
				}else{
					return re
				}
			});
		},
		writeAll: function(arr) {
			return _List.writeAll(arr);
		},
		put: function(json) {
			return _List.put(json);
		},
		putAll: function(arr) {
			return _List.putAll(arr);
		},
		remote: function(url) {
			return _List.remote(url).then(function(arr) {
				//List.arr = arr;
				return arr;
			});
		},
		add: async function(name, url, arr) {
			var t = this;
			var json = this.json;
			var json1 = {};
			var num = -1;
			for (var i = 0; i < json.length; i++) {
				if (json[i].name == name) {
					num = i;
				}
			}
			if (num == -1) {
				json1 = {
					name: name,
					url: url,
					creatAt: formatDate(new Date()),
					readIndex: 0,
					readTitle: arr[0][1],
					readAt: formatDate(new Date()),
					readURL: arr[0][0],
					updateIndex: arr.length - 1,
					updateTitle: arr[arr.length - 1][1],
					updateAt: formatDate(new Date()),
					updateURL: arr[arr.length - 1][0]
				}
			} else {
				json1 = json.splice(num, 1)[0]; //json[num];
				json1.url = url;
				json1.updateIndex = arr.length - 1,
					json1.updateTitle = arr[arr.length - 1][1],
					json1.updateAt = formatDate(new Date()),
					json1.updateURL = arr[arr.length - 1][0];
				//this.show({index:num})
			}
			json.unshift(json1);
			this.show()
			//alert(json1)
			var re = await this.setKeyData(json1);
		},
		delete: function(i) {
			var name = this.json[i].name;
			if (confirm("是否删除:" + i + name)) {
				this.deleteKeyData(name);
			}
		},
		formatShelfUI: function(json, i) {
			var d =
				"<h1>%s.%s</h1>\
			    <h2>已读:%s</h2>\
			    <h3>%s</h3>\
			    <h4><span class='highlight'>最新:</span>%s</h4>\
			    <h3>%s</h3>\
			    <h6>%s</h6>"
				.fill([i, json.name,
					json.readTitle,
					json.readAt,
					json.updateTitle,
					json.updateAt,
					json.url
				]);
			var str = "<tr><td>" + d + "</td></tr>";
			return str;
		},
		ini: function() {
			return _List.ini();
		},
		showShelf: function(i) {
			var t = this;
			this.readAll().then(function(arr) {
				var json = arr[i];
				var str = t.formatShelfUI(json, i);
				shelf_table.rows[i].innerHTML = str;
			});
		},
		checkChange: function() {
			var arr1, arr2;
			var t = this;
			this.getAll().then(function(arr) {
				arr1 = arr;
				return t.readAll();
			}).then(function(arr) {
				arr2 = arr;

			});
		},
		moveData: function() {
			var t = this;
			var arr1, arr2;
			var re = [];
			DB.Table.has("book", "shelf").catch(function(e) {
				alert(e)
				return t.ini();
			}).then(function() {
				return Git.File.get("docfeng", "page", "novel/data/Shelf.json").then(function(text) {
					//alert(text)
					var p = [];
					arr1 = JSON.parse(text);
					alert(JSON.stringify(arr1[0]))
					t.write(arr1[0]);
					return t.readAll();
				}).then(function(arr) {
					arr2 = arr;
					alert(JSON.stringify(arr));
				}).then(function() {
					for (var i = 0; i < arr1.length; i++) {
						for (var i2 = 0; i2 < arr2.length; i2++) {
							if (arr1[i].name == arr2[i2].name) {
								//if()
								re.push(arr1[i]);
								delete arr1[i];
								delete arr2[i2];
							}
						}
					}
					alert(JSON.stringify(re));
					re = re.concat(arr1, arr2)
					alert(JSON.stringify(re));
				});
			}).then(function() {
				alert(true)
			}).catch(function(e) {
				alert(e)
			});
		},
		upload: async function() {
			var json = await this.getAllIndexData("readAt");
			json = json.reverse();
			json = JSON.stringify(json, null, 4);

			await git.getFile("page", "novel/data/Shelf.json");
			var re = await git.createFile({
				owner: "docfeng",
				repos: "page",
				name: "novel/data/Shelf.json",
				txt: json
			});
			alert(re);
		},
		//显示目录
		show: function(name, url, arr) {
			this.arr = arr;
			this.name = name;
			var url = url;
			this.showarr(arr);
			listName.innerText = name;
			listCount.innerText = arr.length;
			listUrl.innerText = url;
		},
		showarr: function(arr) {
			if(!arr){
				alert("list.showarr 没有arr");
				return false
			}
			var str = "";
			var err = [];
			for (var i = 0; i < arr.length; i++) {
				if (!arr[i] || !arr[i][1]) {
					err[err.length] = i + ":" + arr[i];
				} else {
					var d = "<h4>" + arr[i][1] + "</h4>";
					d += "<h5>" + arr[i][0] + "</h5>";
					str += "<tr><td>" + d + "</td></tr>";
				}
			}
			list_table.innerHTML = str;
		},
		//目录滚动到第i个
		scroll: function(i) {
			var obj=list_table.rows[i];
			if(obj){
				var h = obj.offsetTop
				list_table.parentNode.scrollTop = h
			}else{
				fj.tip("List.scroll超出界限：i="+i);
			}
		},

		click: function(obj) {
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex; //*this.max+obj.cellIndex;
			this.showPageIndex(i);
			//fullScreen(document.querySelector("#pageDiv"))
		},
		showPageIndex:function(i){
			var name = this.name;
			var arr = this.arr[i];
			var title = arr[1];
			var url = arr[0];
			Shelf.read(name).then(function(json){
				json.readTitle = title;
				json.readURL = url;
				json.readIndex = i;
				json.readAt = formatDate(new Date());
				Shelf.write(json);
			});
			
			Page.name = name;
			Page.json=this.json;
			Page.arr = this.arr;
			Page.resize()
			Page.multiIndex(i).then(function(re) {
				//alert(re)
				//Page.show(re)
				Page.resize()
				window.page(i)
			}).catch(function(e) {
				alert("err:Page.multiIndex" + e)
			});
			UI.hidePage();
		},
		
		update: function(url) {
			fj.tip("开始更新");
			var arr=this.arr
			var name=this.name;
			if(!url||!arr){
				fj.tip("参数错误：\nurl:"+url+"\narr:"+ arr,2)
				return false
			}
			var t=this;
			this.remote(url).then(function(_arr){
				if (_arr.length == t.arr.length) {
					fj.tip("目前没有新更新",1.5);
				} else {
					var arr = t.arr = _arr;
					t.showarr(arr);
					t.write(name,arr).then(function(re){
						fj.tip("List写入成功")
					}).catch(function(e){
						fj.tip("List写入失败"+e)
					})
					
					var title = arr[arr.length - 1][1];
					var url = arr[arr.length - 1][0];
					var newpage = title;
					fj.tip("已更新" + title,2);
					listNew.innerText = title;
					var json=t.json;
					json.updateTitle = title;
					json.updateURL = url;
					json.updateIndex = arr.length - 1;
					json.updateAt = formatDate(new Date());
					
					Shelf.write(json);
				}
			}).catch(function(e){
				alert("更新出错"+e)
			})
		},
		changeSource: async function(name) {
			UI.showSearch();
			f6_name.value = name;
			Search.search(name);
		},
		addBook: function(name, url, arr) {
			var name = name || this.name;
			var arr = arr || this.arr;
			var url = url || this.url;
			Shelf.add(name, url, arr);
		},

	}
	return List;
})();


